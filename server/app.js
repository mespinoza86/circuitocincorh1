import express from 'express';
import helmet from 'helmet';
import { randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';
import { resolve } from 'node:path';
import { AppError, date, text, email, money, halfDays, todayCR, workingDays, vacationBalance, payPeriod, payrollAmounts } from './domain.js';
import { transaction, audit } from './db.js';
import { installAuth, adminOnly, passwordHash, publicUser } from './auth.js';
import { payslipPdf } from './pdf.js';
import { nextEmployeeCode, rememberEmployeeCode } from './employee-codes.js';

const first = async (client, query, values = [], label = 'Registro') => {
  const result = await client.query(query, values);
  if (!result.rowCount) throw new AppError(`${label} no encontrado.`, 404);
  return result.rows[0];
};
function employeeInput(body) {
  const hire = date(body.hire_date, 'Ingreso');
  const birth = date(body.birth_date, 'Nacimiento');
  const termination = body.termination_date ? date(body.termination_date, 'Salida') : null;
  const cutoff = body.historical_cutoff ? date(body.historical_cutoff, 'Fecha de corte') : null;
  const historical = halfDays(body.historical_days ?? 0, 'Días históricos');
  if (birth > todayCR()) throw new AppError('El nacimiento no puede ser posterior a la fecha actual.');
  if (birth >= hire) throw new AppError('El nacimiento debe ser anterior al ingreso.');
  if (termination && termination < hire) throw new AppError('La salida no puede ser anterior al ingreso.');
  if (cutoff && (cutoff < hire || cutoff > todayCR())) throw new AppError('El corte debe estar entre el ingreso y la fecha actual.');
  if (historical && !cutoff) throw new AppError('Indique la fecha de corte para el descuento histórico.');
  if (typeof body.active !== 'boolean') throw new AppError('Estado del empleado inválido.');
  if (!body.active && !termination) throw new AppError('Indique la fecha de salida para desactivar al empleado.');
  if (body.active && termination) throw new AppError('Quite la fecha de salida para mantener al empleado activo.');
  return {
    code: text(body.code, 'Código', { max: 30 }), full_name: text(body.full_name, 'Nombre completo'),
    national_id: text(body.national_id, 'Cédula', { max: 40 }), email: email(body.email), hire_date: hire, birth_date: birth,
    position: text(body.position, 'Puesto', { optional: true }), department: text(body.department, 'Departamento', { optional: true }),
    phone: text(body.phone, 'Teléfono', { optional: true, max: 40 }), monthly_salary_cents: money(body.monthly_salary, 'Salario mensual'),
    active: body.active, termination_date: termination, historical_days: historical, historical_cutoff: cutoff,
    historical_note: text(body.historical_note, 'Motivo del ajuste histórico', { optional: historical === 0, max: 1000 }),
    notes: text(body.notes, 'Observaciones', { optional: true, max: 2000 })
  };
}
const snapshot = employee => ({ full_name: employee.full_name, national_id: employee.national_id, code: employee.code, email: employee.email, position: employee.position, department: employee.department, hire_date: employee.hire_date, termination_date: employee.termination_date });
function publicMailConfig() {
  const host=(process.env.SMTP_HOST||'').trim();
  const user=(process.env.SMTP_USER||'').trim();
  const from=(process.env.SMTP_FROM||'').trim();
  const authenticated=Boolean(user&&process.env.SMTP_PASS);
  return {
    smtp_configured:Boolean(host&&from&&(user?authenticated:true)&&(host.toLowerCase()==='smtp.gmail.com'?authenticated:true)),
    smtp_from:from||'Contabilidad Circuito Cinco <contabilidad@circuitocinco.com>'
  };
}
async function vacationRows(client, employeeId) {
  return (await client.query('SELECT * FROM vacations WHERE employee_id=$1 ORDER BY start_date DESC,created_at DESC', [employeeId])).rows;
}
async function validateVacation(client, body) {
  const employee = await first(client, 'SELECT * FROM employees WHERE id=$1 FOR UPDATE', [body.employee_id], 'Empleado');
  if (!employee.active) throw new AppError('No se pueden asignar vacaciones a un empleado inactivo.');
  const start = date(body.start_date); const end = date(body.end_date);
  if (start < employee.hire_date) throw new AppError('Las vacaciones no pueden comenzar antes del ingreso.');
  if (employee.historical_cutoff && start <= employee.historical_cutoff) throw new AppError('El rango debe ser posterior al corte histórico; los días anteriores ya están incluidos en el ajuste.');
  if (typeof body.half_day !== 'boolean') throw new AppError('Indique si corresponde a medio día.');
  const holidays = (await client.query('SELECT day FROM holidays WHERE day BETWEEN $1 AND $2', [start,end])).rows.map(x => x.day);
  const count = workingDays(start,end,holidays,body.half_day);
  if (!count.days) throw new AppError('El rango no contiene días laborales.');
  const requests = await vacationRows(client, employee.id);
  const already = new Map();
  for (const r of requests.filter(x => x.status === 'approved')) for (const entry of r.entries) already.set(entry.date, (already.get(entry.date) ?? 0) + Number(entry.days));
  if (count.entries.some(x => x.days + (already.get(x.date) ?? 0) > 1)) throw new AppError('El rango se superpone con vacaciones aprobadas. Puede registrar hasta un día por fecha.');
  const before = vacationBalance(employee,requests);
  const after = vacationBalance(employee,[...requests,{ employee_id: employee.id,status:'approved',entries:count.entries }]);
  return { employee, ...count, before, after };
}
async function savePayrollItem(client, actor, period, employee, inputs, existing = null) {
  const amounts = payrollAmounts(employee.monthly_salary_cents, inputs, period.half);
  const partial = employee.hire_date > period.start_date || (employee.termination_date && employee.termination_date < period.end_date);
  if (partial && inputs.reviewed && !amounts.adjustment_reason) throw new AppError('El trabajador ingresó o salió durante la quincena. Registre el motivo del salario revisado para este periodo.');
  const data = { employee_snapshot: snapshot(employee), monthly_salary_cents: employee.monthly_salary_cents,
    automatic_cents: amounts.automatic, base_cents: amounts.base, commissions_cents: amounts.commissions,
    caja_cents: amounts.caja, renta_cents: amounts.renta, loan_cents: amounts.loan, other_cents: amounts.other,
    gross_cents: amounts.gross, deductions_cents: amounts.deductions, net_cents: amounts.net,
    adjustment_reason: amounts.adjustment_reason, other_reason: amounts.other_reason, reviewed: inputs.reviewed === true, updated_by: actor };
  const keys = Object.keys(data); const values = Object.values(data);
  let result;
  if (existing) {
    if (Number(inputs.revision) !== existing.revision) throw new AppError('Esta fila cambió en otra sesión. Recargue la nómina antes de guardarla.',409);
    result = await first(client, `UPDATE payroll_items SET ${keys.map((k,i)=>`${k}=$${i+1}`).join(',')},revision=revision+1,updated_at=now() WHERE id=$${keys.length+1} RETURNING *`, [...values,existing.id]);
  } else {
    result = await first(client, `INSERT INTO payroll_items(id,period_id,employee_id,${keys.join(',')}) VALUES($1,$2,$3,${keys.map((_,i)=>`$${i+4}`).join(',')}) RETURNING *`, [randomUUID(),period.id,employee.id,...values]);
  }
  await audit(client,actor,existing ? 'editar' : 'crear','nomina_detalle',result.id,existing,result);
  return result;
}

export function createApp(pool) {
  const app = express();
  app.disable('x-powered-by');
  if (process.env.TRUST_PROXY === 'true') app.set('trust proxy',1);
  app.use(helmet({ contentSecurityPolicy: { directives: { 'upgrade-insecure-requests': null, 'style-src': ["'self'"], 'script-src': ["'self'"], 'font-src':["'self'"], 'img-src':["'self'",'data:'] } }, strictTransportSecurity: process.env.COOKIE_SECURE === 'true' ? undefined : false }));
  app.use(express.json({ limit: '128kb' }));
  app.use('/api',(req,res,next) => {
    res.setHeader('Cache-Control','no-store');
    const origin = req.headers.origin;
    const allowed = process.env.APP_ORIGIN || 'http://127.0.0.1:3000';
    if (origin && origin !== allowed && !(allowed === 'http://127.0.0.1:3000' && origin === 'http://localhost:3000')) throw new AppError('Origen de la solicitud no permitido.',403);
    if (req.headers['sec-fetch-site'] === 'cross-site') throw new AppError('Solicitud externa no permitida.',403);
    next();
  });
  app.get('/api/health',async (req,res) => { await pool.query('SELECT 1'); res.json({ ok:true }); });
  installAuth(app,pool);
  // Las cuentas de empleado quedan previstas, pero no se habilitan en esta versión.
  app.use('/api',adminOnly);
  app.get('/api/bootstrap',async (req,res) => {
    const results = await Promise.all([
      pool.query('SELECT * FROM company WHERE id=1'),pool.query('SELECT * FROM employees ORDER BY active DESC,full_name'),
      pool.query('SELECT v.*,e.full_name,e.code FROM vacations v JOIN employees e ON e.id=v.employee_id ORDER BY v.start_date DESC,v.created_at DESC'),
      pool.query('SELECT * FROM holidays ORDER BY day'),pool.query('SELECT p.*,COUNT(i.id)::int AS employee_count,COALESCE(SUM(i.net_cents),0)::text AS total_net_cents FROM payroll_periods p LEFT JOIN payroll_items i ON i.period_id=p.id GROUP BY p.id ORDER BY year DESC,month DESC,half DESC'),
      pool.query('SELECT id,name,email,role,employee_id,active,must_change_password,created_at FROM users ORDER BY created_at'),
      pool.query('SELECT a.*,u.name AS actor_name FROM audit_log a LEFT JOIN users u ON u.id=a.actor_id ORDER BY a.id DESC LIMIT 100')
    ]);
    const [company,employees,vacations,holidays,periods,users,auditRows] = results.map(x=>x.rows);
    const asOf = todayCR();
    res.json({ company:company[0],employees:employees.map(e=>({...e,vacation:vacationBalance(e,vacations,asOf)})),vacations,holidays,periods,users,audit:auditRows,today:asOf,...publicMailConfig() });
  });
  app.get('/api/reports/vacations',async (req,res) => {
    const asOf=date(req.query.as_of || todayCR());const year=Number(req.query.year || asOf.slice(0,4));
    if (!Number.isInteger(year) || year<1900 || year>2200) throw new AppError('Año del reporte inválido.');
    const employees=(await pool.query('SELECT * FROM employees ORDER BY full_name')).rows;
    const requests=(await pool.query("SELECT * FROM vacations WHERE status='approved' ORDER BY start_date")).rows;
    res.json({as_of:asOf,year,employees:employees.map(e=>({...e,vacation:vacationBalance(e,requests,asOf),used_year:requests.filter(v=>v.employee_id===e.id).flatMap(v=>v.entries).filter(d=>Number(d.date.slice(0,4))===year && d.date<=asOf).reduce((sum,d)=>sum+Number(d.days),0),historical_detail_missing:Boolean(e.historical_cutoff && Number(e.historical_cutoff.slice(0,4))>=year && Number(e.historical_days)>0)}))});
  });
  app.put('/api/company',async (req,res) => {
    const data = { name:text(req.body.name,'Empresa'),legal_id:text(req.body.legal_id,'Cédula jurídica',{ optional:true,max:50 }),email:req.body.email ? email(req.body.email) : '' };
    const company = await transaction(pool,async client=> {
      const before = await first(client,'SELECT * FROM company WHERE id=1 FOR UPDATE');
      const after = await first(client,'UPDATE company SET name=$1,legal_id=$2,email=$3 WHERE id=1 RETURNING *',Object.values(data));
      await audit(client,req.user.id,'editar','empresa',1,before,after); return after;
    });res.json(company);
  });
  app.get('/api/employees/next-code',async (req,res) => {
    res.json({code:await nextEmployeeCode(pool)});
  });
  app.post('/api/employees',async (req,res) => {
    const data = employeeInput(req.body); const keys=Object.keys(data);
    const employee = await transaction(pool,async client=> {
      await client.query('SELECT pg_advisory_xact_lock(74210618)');
      if (req.body.use_suggested_code===true) data.code=await nextEmployeeCode(client);
      const id=randomUUID();
      const after=await first(client,`INSERT INTO employees(id,${keys.join(',')}) VALUES($1,${keys.map((_,i)=>`$${i+2}`).join(',')}) RETURNING *`,[id,...Object.values(data)]);
      await rememberEmployeeCode(client,after.code);
      await audit(client,req.user.id,'crear','empleado',id,null,after);return after;
    });res.status(201).json(employee);
  });
  app.put('/api/employees/:id',async (req,res) => {
    const data=employeeInput(req.body);const keys=Object.keys(data);
    const employee=await transaction(pool,async client=> {
      await client.query('SELECT pg_advisory_xact_lock(74210618)');
      const before=await first(client,'SELECT * FROM employees WHERE id=$1 FOR UPDATE',[req.params.id],'Empleado');
      if (before.revision !== Number(req.body.revision)) throw new AppError('El perfil cambió en otra sesión. Recargue antes de guardarlo.',409);
      const requests=await vacationRows(client,before.id);
      if (requests.some(v=>v.status==='approved' && (v.start_date<data.hire_date || (data.historical_cutoff && v.start_date<=data.historical_cutoff)))) throw new AppError('El ingreso o corte se superpone con vacaciones registradas. Cancele primero esos movimientos o conserve las fechas.');
      if (data.termination_date && requests.some(v=>v.status==='approved' && v.end_date>data.termination_date)) throw new AppError('Hay vacaciones posteriores a la salida. Cancele esos movimientos antes de desactivar al empleado.');
      const after=await first(client,`UPDATE employees SET ${keys.map((k,i)=>`${k}=$${i+1}`).join(',')},revision=revision+1,updated_at=now() WHERE id=$${keys.length+1} RETURNING *`,[...Object.values(data),before.id]);
      await rememberEmployeeCode(client,before.code);
      await rememberEmployeeCode(client,after.code);
      await audit(client,req.user.id,'editar','empleado',before.id,before,after);return after;
    });res.json(employee);
  });
  app.post('/api/vacations/preview',async (req,res) => {
    res.json(await transaction(pool,client=>validateVacation(client,req.body)));
  });
  app.post('/api/vacations',async (req,res) => {
    const result=await transaction(pool,async client=> {
      await client.query('SELECT pg_advisory_xact_lock(74210617)'); // serializa cambios de calendario y solicitudes
      const preview=await validateVacation(client,req.body);
      if (preview.after.available<0 && req.body.allow_negative!==true) throw new AppError('El trabajador quedará con vacaciones negativas. Confirme expresamente para continuar.',409,'NEGATIVE_BALANCE',{ available:preview.after.available });
      const vacation=await first(client,'INSERT INTO vacations(id,employee_id,start_date,end_date,half_day,days,entries,note,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
        [randomUUID(),preview.employee.id,req.body.start_date,req.body.end_date,req.body.half_day,preview.days,JSON.stringify(preview.entries),text(req.body.note,'Observación',{ optional:true,max:1000 }),req.user.id]);
      await audit(client,req.user.id,'aprobar','vacaciones',vacation.id,null,vacation);return { vacation,balance:preview.after };
    });res.status(201).json(result);
  });
  app.post('/api/vacations/:id/cancel',async (req,res) => {
    const reason=text(req.body.reason,'Motivo de cancelación',{ max:1000 });
    const result=await transaction(pool,async client=> {
      await client.query('SELECT pg_advisory_xact_lock(74210617)');
      const before=await first(client,'SELECT * FROM vacations WHERE id=$1 FOR UPDATE',[req.params.id],'Vacación');
      await client.query('SELECT id FROM employees WHERE id=$1 FOR UPDATE',[before.employee_id]);
      if (before.status==='cancelled') throw new AppError('El movimiento ya está cancelado.',409);
      const after=await first(client,"UPDATE vacations SET status='cancelled',cancellation_reason=$1 WHERE id=$2 RETURNING *",[reason,before.id]);
      await audit(client,req.user.id,'cancelar','vacaciones',after.id,before,after);return after;
    });res.json(result);
  });
  async function protectHoliday(client,day) {
    await client.query('SELECT pg_advisory_xact_lock(74210617)');
    if ((await client.query("SELECT 1 FROM vacations WHERE status='approved' AND start_date <= $1 AND end_date >= $1 LIMIT 1",[day])).rowCount) throw new AppError('Esta fecha pertenece a vacaciones aprobadas. Cancele y registre de nuevo esos movimientos para cambiar el calendario sin alterar su historial.');
  }
  app.post('/api/holidays',async (req,res) => {
    const day=date(req.body.day);const name=text(req.body.name,'Nombre del feriado');
    const result=await transaction(pool,async client=> {
      await protectHoliday(client,day);
      const after=await first(client,'INSERT INTO holidays(id,day,name) VALUES($1,$2,$3) RETURNING *',[randomUUID(),day,name]);
      await audit(client,req.user.id,'crear','feriado',after.id,null,after);return after;
    });res.status(201).json(result);
  });
  app.delete('/api/holidays/:id',async (req,res) => {
    await transaction(pool,async client=> {
      const before=await first(client,'SELECT * FROM holidays WHERE id=$1',[req.params.id],'Feriado');
      await protectHoliday(client,before.day);await client.query('DELETE FROM holidays WHERE id=$1',[before.id]);
      await audit(client,req.user.id,'eliminar','feriado',before.id,before);
    });res.json({ ok:true });
  });
  app.post('/api/payroll',async (req,res) => {
    const dates=payPeriod(req.body.year,req.body.month,req.body.half);
    const period=await transaction(pool,async client=> {
      const p=await first(client,'INSERT INTO payroll_periods(id,year,month,half,start_date,end_date) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',[randomUUID(),dates.year,dates.month,dates.half,dates.start,dates.end]);
      const employees=(await client.query('SELECT * FROM employees WHERE hire_date <= $1 AND (termination_date IS NULL OR termination_date >= $2) ORDER BY full_name',[dates.end,dates.start])).rows;
      if (!employees.length) throw new AppError('No hay trabajadores con relación laboral durante este periodo.');
      for (const employee of employees) await savePayrollItem(client,req.user.id,p,employee,{});
      await audit(client,req.user.id,'crear','nomina',p.id,null,p);return p;
    });res.status(201).json(period);
  });
  app.get('/api/payroll/:id',async (req,res) => {
    const period=await first(pool,'SELECT * FROM payroll_periods WHERE id=$1',[req.params.id],'Periodo');
    const items=(await pool.query("SELECT i.*,e.email AS recipient_email FROM payroll_items i JOIN employees e ON e.id=i.employee_id WHERE i.period_id=$1 ORDER BY i.employee_snapshot->>'full_name'",[period.id])).rows;
    const deliveries=(await pool.query('SELECT d.* FROM email_deliveries d JOIN payroll_items i ON i.id=d.item_id WHERE i.period_id=$1 ORDER BY d.created_at DESC',[period.id])).rows;
    res.json({ period,items,deliveries });
  });
  app.put('/api/payroll/:periodId/items/:id',async (req,res) => {
    const result=await transaction(pool,async client=> {
      const period=await first(client,'SELECT * FROM payroll_periods WHERE id=$1 FOR UPDATE',[req.params.periodId],'Periodo');
      if (period.status!=='draft') throw new AppError('La nómina está cerrada. Sus importes no se pueden modificar.',409);
      const item=await first(client,'SELECT * FROM payroll_items WHERE id=$1 AND period_id=$2 FOR UPDATE',[req.params.id,period.id],'Detalle');
      const employee=await first(client,'SELECT * FROM employees WHERE id=$1 FOR SHARE',[item.employee_id],'Empleado');
      if (employee.hire_date>period.end_date || (employee.termination_date && employee.termination_date<period.start_date)) throw new AppError('El empleado ya no corresponde a este periodo. Revise su fecha de ingreso o salida.');
      return savePayrollItem(client,req.user.id,period,employee,{...req.body,reviewed:true},item);
    });res.json(result);
  });
  app.post('/api/payroll/:id/close',async (req,res) => {
    const result=await transaction(pool,async client=> {
      const before=await first(client,'SELECT * FROM payroll_periods WHERE id=$1 FOR UPDATE',[req.params.id],'Periodo');
      if (before.status!=='draft') throw new AppError('El periodo ya está cerrado.',409);
      const items=(await client.query('SELECT * FROM payroll_items WHERE period_id=$1',[before.id])).rows;
      if (!items.length || items.some(i=>!i.reviewed)) throw new AppError('Revise y guarde cada trabajador antes de cerrar la nómina.');
      const employees=(await client.query('SELECT * FROM employees WHERE hire_date <= $1 AND (termination_date IS NULL OR termination_date >= $2) FOR SHARE',[before.end_date,before.start_date])).rows;
      if (employees.length!==items.length || employees.some(e=>!items.some(i=>i.employee_id===e.id))) throw new AppError('La plantilla cambió desde que se creó el borrador. Complete el periodo con el botón «Actualizar plantilla».');
      for (const item of items) {
        const e=employees.find(e=>e.id===item.employee_id);
        if (Number(e.monthly_salary_cents)!==Number(item.monthly_salary_cents) || Object.entries(snapshot(e)).some(([key,value])=>item.employee_snapshot[key]!==value)) throw new AppError('Hay perfiles actualizados desde la revisión. Vuelva a guardar los trabajadores afectados antes de cerrar.');
      }
      const company=(await client.query('SELECT * FROM company WHERE id=1 FOR SHARE')).rows[0];
      const after=await first(client,"UPDATE payroll_periods SET status='closed',closed_at=now(),closed_by=$1,company_snapshot=$2 WHERE id=$3 RETURNING *",[req.user.id,company,before.id]);
      await audit(client,req.user.id,'cerrar','nomina',after.id,before,after);return after;
    });res.json(result);
  });
  app.post('/api/payroll/:id/sync',async (req,res) => {
    await transaction(pool,async client=> {
      const period=await first(client,'SELECT * FROM payroll_periods WHERE id=$1 FOR UPDATE',[req.params.id],'Periodo');
      if (period.status!=='draft') throw new AppError('Solo se puede actualizar la plantilla de un borrador.',409);
      const employees=(await client.query('SELECT * FROM employees WHERE hire_date <= $1 AND (termination_date IS NULL OR termination_date >= $2) FOR SHARE',[period.end_date,period.start_date])).rows;
      const items=(await client.query('SELECT * FROM payroll_items WHERE period_id=$1',[period.id])).rows;
      for (const e of employees) if (!items.some(i=>i.employee_id===e.id)) await savePayrollItem(client,req.user.id,period,e,{});
      for (const i of items) if (!employees.some(e=>e.id===i.employee_id)) {
        await client.query('DELETE FROM payroll_items WHERE id=$1',[i.id]);await audit(client,req.user.id,'retirar_del_borrador','nomina_detalle',i.id,i);
      }
      await audit(client,req.user.id,'actualizar_plantilla','nomina',period.id);
    });res.json({ ok:true });
  });
  async function slipData(id) {
    const item=await first(pool,'SELECT * FROM payroll_items WHERE id=$1',[id],'Colilla');
    const period=await first(pool,'SELECT * FROM payroll_periods WHERE id=$1',[item.period_id]);
    const company=period.company_snapshot ?? (await pool.query('SELECT * FROM company WHERE id=1')).rows[0];
    return {item,period,company};
  }
  app.get('/api/payslips/:id.pdf',async (req,res) => {
    const {item,period,company}=await slipData(req.params.id);
    const pdf=await payslipPdf(item,period,company);
    res.setHeader('Content-Type','application/pdf');res.setHeader('Content-Disposition',`inline; filename="colilla-${period.start_date}-${item.employee_snapshot.code.replace(/[^a-zA-Z0-9_-]/g,'')}.pdf"`);res.send(pdf);
  });
  app.post('/api/payslips/:id/email',async (req,res) => {
    if (!publicMailConfig().smtp_configured) throw new AppError('El correo de la empresa no está configurado completamente. Revise remitente, servidor y credencial SMTP en el servidor.',503);
    const {item,period,company}=await slipData(req.params.id);
    if (period.status!=='closed') throw new AppError('Cierre la nómina antes de enviar una colilla.');
    const delivery=await transaction(pool,async client=> {
      await client.query('SELECT id FROM payroll_items WHERE id=$1 FOR UPDATE',[item.id]);
      const employee=await first(client,'SELECT email FROM employees WHERE id=$1 FOR SHARE',[item.employee_id],'Empleado');
      const recipient=email(employee.email);
      if (req.body.recipient!==recipient) throw new AppError('El correo del empleado cambió o no coincide. Recargue la nómina y confirme el destinatario actualizado.',409,'RECIPIENT_CHANGED');
      const previous=(await client.query("SELECT * FROM email_deliveries WHERE item_id=$1 AND (status='sent' OR (status='sending' AND created_at>now()-interval '5 minutes')) ORDER BY created_at DESC LIMIT 1",[item.id])).rows[0];
      if (previous?.status==='sending') throw new AppError('Ya hay un envío en curso para esta colilla.',409);
      if (previous?.status==='sent' && req.body.resend!==true) throw new AppError('La colilla ya fue enviada. Confirme si desea reenviarla.',409,'ALREADY_SENT');
      return first(client,"INSERT INTO email_deliveries(id,item_id,recipient,status,sent_by) VALUES($1,$2,$3,'sending',$4) RETURNING *",[randomUUID(),item.id,recipient,req.user.id]);
    });
    const transport=nodemailer.createTransport({ host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_SECURE==='true',auth:process.env.SMTP_USER ? {user:process.env.SMTP_USER,pass:process.env.SMTP_PASS} : undefined,connectionTimeout:15000,socketTimeout:20000 });
    try {
      await transport.sendMail({ from:process.env.SMTP_FROM,to:delivery.recipient,subject:`Colilla de pago · ${period.start_date} al ${period.end_date}`,text:`Hola ${item.employee_snapshot.full_name},\n\nAdjuntamos su colilla de pago del periodo ${period.start_date} al ${period.end_date}.\n\n${company.name}`,attachments:[{filename:`colilla-${period.start_date}.pdf`,content:await payslipPdf(item,period,company)}] });
      await transaction(pool,async client=> {await client.query("UPDATE email_deliveries SET status='sent',detail='Aceptado por el servidor de correo' WHERE id=$1",[delivery.id]);await audit(client,req.user.id,'enviar_colilla','correo',delivery.id,null,{recipient:delivery.recipient,item_id:item.id});});
      res.json({ok:true,recipient:delivery.recipient});
    } catch(error) {
      await pool.query("UPDATE email_deliveries SET status='failed',detail=$1 WHERE id=$2",[`Error de envío: ${error.code || 'SMTP'}`,delivery.id]);
      throw new AppError('El servidor de correo no confirmó el envío. Revise la configuración y el historial antes de reintentarlo.',502);
    } finally { transport.close(); }
  });
  app.post('/api/users',async (req,res) => {
    const name=text(req.body.name,'Nombre');const userEmail=email(req.body.email);const hash=await passwordHash(req.body.password);
    const user=await transaction(pool,async client=> {
      const after=await first(client,"INSERT INTO users(id,name,email,password_hash,role,must_change_password) VALUES($1,$2,$3,$4,'admin',true) RETURNING *",[randomUUID(),name,userEmail,hash]);
      await audit(client,req.user.id,'crear','cuenta',after.id,null,publicUser(after));return publicUser(after);
    });res.status(201).json(user);
  });
  app.patch('/api/users/:id',async (req,res) => {
    const hash=req.body.password ? await passwordHash(req.body.password) : null;
    if (typeof req.body.active !== 'boolean') throw new AppError('Estado de cuenta inválido.');
    const user=await transaction(pool,async client=> {
      await client.query('SELECT pg_advisory_xact_lock(74210616)');
      const before=await first(client,'SELECT * FROM users WHERE id=$1 FOR UPDATE',[req.params.id],'Cuenta');
      if (before.id===req.user.id && (!req.body.active || hash)) throw new AppError('Use «Mi contraseña» para su cuenta. Su propia cuenta no se puede desactivar.');
      const after=await first(client,'UPDATE users SET active=$1,password_hash=COALESCE($2,password_hash),must_change_password=CASE WHEN $2 IS NOT NULL THEN true ELSE must_change_password END WHERE id=$3 RETURNING *',[req.body.active,hash,before.id]);
      if (!after.active || hash) await client.query('DELETE FROM sessions WHERE user_id=$1',[after.id]);
      await audit(client,req.user.id,hash ? 'restablecer_contraseña' : 'cambiar_estado','cuenta',after.id,publicUser(before),publicUser(after));return publicUser(after);
    });res.json(user);
  });
  app.use('/api',(req,res)=>res.status(404).json({error:'Ruta no encontrada.'}));
  app.use(express.static(resolve(import.meta.dirname,'../public'),{ dotfiles:'deny',etag:true }));
  app.use((error,req,res,next)=> {
    if (res.headersSent) return next(error);
    if (error instanceof AppError) return res.status(error.status).json({error:error.message,code:error.code,details:error.details});
    if (error.code==='23505' && error.constraint==='employees_code_key') return res.status(409).json({error:'Ese código interno ya pertenece a otro trabajador. Elija un código diferente.',code:'EMPLOYEE_CODE_EXISTS'});
    if (error.code==='23505') return res.status(409).json({error:'Ya existe un registro con ese código, cédula, correo, fecha o periodo.'});
    if (['23514','22P02','22007','22003'].includes(error.code) || error.type==='entity.parse.failed') return res.status(400).json({error:'Los datos enviados no son válidos. Revise los campos.'});
    console.error('Error de aplicación:',error.code ?? error.name,error.message?.replace(/postgres(?:ql)?:\/\/\S+/g,'[conexión]'));
    res.status(500).json({error:'No se pudo completar la operación. Intente nuevamente.'});
  });
  return app;
}
