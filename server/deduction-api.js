import {randomUUID} from 'node:crypto';
import {transaction,audit} from './db.js';
import {AppError,date,text,payPeriod,payrollAmounts} from './domain.js';
import {percentage,parseBrackets,calculateFor,ruleFor,incomeTax,percentageAmount,exceptionInput,deductionReview} from './deductions.js';
import {taxAdjustmentPdf} from './pdf.js';

const row=async(client,sql,args=[])=>{const result=await client.query(sql,args);if(!result.rowCount)throw new AppError('Registro no encontrado.',404);return result.rows[0];};
export async function deductionSettings(client) {
  const control=await row(client,'SELECT * FROM deduction_control WHERE id=1');
  const rules=(await client.query('SELECT * FROM deduction_rules ORDER BY effective_from DESC,version DESC')).rows;
  return {control,rules};
}
export function installDeductionRoutes(app,pool) {
  app.get('/api/deduction-settings',async(req,res)=>res.json(await deductionSettings(pool)));
  app.post('/api/deduction-settings',async(req,res)=> {
    const start=date(req.body.effective_from,'Vigencia');
    if(!start.endsWith('-01'))throw new AppError('La vigencia debe comenzar el primer día del mes.');
    const worker=percentage(req.body.worker_rate,'Caja del trabajador'),employer=percentage(req.body.employer_rate,'Aporte patronal'),brackets=parseBrackets(req.body.brackets),note=text(req.body.note,'Referencia de las reglas',{max:1000});
    if(typeof req.body.enabled!=='boolean')throw new AppError('Indique si se habilita el cálculo automático.');
    const result=await transaction(pool,async client=> {
      await client.query('SELECT pg_advisory_xact_lock(74210620)');
      const control=await row(client,'SELECT * FROM deduction_control WHERE id=1 FOR UPDATE');
      if(Number(req.body.revision)!==control.revision)throw new AppError('La configuración cambió. Recargue antes de guardar.',409);
      if((await client.query("SELECT 1 FROM payroll_periods WHERE deduction_mode='automatic' AND status='closed' AND start_date >= $1 LIMIT 1",[start])).rowCount)throw new AppError('Hay nóminas automáticas cerradas desde esa vigencia. Cree reglas para un mes posterior; las anteriores se conservan.',409);
      const rule=await row(client,'INSERT INTO deduction_rules(id,effective_from,worker_bp,employer_bp,brackets,note,created_by) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',[randomUUID(),start,worker,employer,JSON.stringify(brackets),note,req.user.id]);
      const after=await row(client,'UPDATE deduction_control SET enabled=$1,revision=revision+1 WHERE id=1 RETURNING *',[req.body.enabled]);
      await audit(client,req.user.id,'configurar','deducciones',rule.id,control,{control:after,rule});return {control:after,rule};
    });res.status(201).json(result);
  });
  app.post('/api/payroll/:id/automatic',async(req,res)=> {
    const result=await transaction(pool,async client=> {
      await client.query('SELECT pg_advisory_xact_lock(74210619)');await client.query('SELECT pg_advisory_xact_lock(74210620)');
      const p=await row(client,'SELECT * FROM payroll_periods WHERE id=$1 FOR UPDATE',[req.params.id]);
      const c=await row(client,'SELECT * FROM deduction_control WHERE id=1');
      if(p.status!=='draft'||p.deduction_mode==='automatic')throw new AppError('Solo se puede activar un borrador manual.',409);
      if(!c.enabled||p.start_date<c.official_start)throw new AppError('Octubre es comparación de prueba. Configure y habilite el cálculo oficial desde noviembre.',409);
      if((await client.query("SELECT 1 FROM payroll_periods WHERE year=$1 AND month=$2 AND status='closed' AND deduction_mode='manual'",[p.year,p.month])).rowCount)throw new AppError('Este mes tiene una quincena manual cerrada. Conserve ese mes y active desde el próximo mes completo.',409);
      await ruleFor(client,p.start_date);
      const changed=(await client.query("UPDATE payroll_periods SET deduction_mode='automatic' WHERE year=$1 AND month=$2 AND status='draft' RETURNING *",[p.year,p.month])).rows;
      const after=changed.find(period=>period.id===p.id);
      await client.query('UPDATE payroll_items SET reviewed=false,revision=revision+1 WHERE period_id=ANY($1::uuid[])',[changed.map(period=>period.id)]);
      await audit(client,req.user.id,'activar_automatico','nomina',p.id,p,after);return after;
    });res.json(result);
  });
  app.post('/api/payroll/:periodId/items/:id/deduction-preview',async(req,res)=> {
    const result=await transaction(pool,async client=> {
      await client.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY');
      const p=await row(client,'SELECT * FROM payroll_periods WHERE id=$1',[req.params.periodId]);
      const i=await row(client,'SELECT * FROM payroll_items WHERE id=$1 AND period_id=$2',[req.params.id,p.id]);
      const control=await row(client,'SELECT * FROM deduction_control WHERE id=1');
      if(p.start_date<control.trial_start)throw new AppError('La comparación de prueba empieza en octubre de 2026.');
      const current=await row(client,'SELECT * FROM employees WHERE id=$1',[i.employee_id]);
      const e=p.status==='closed'?{...current,...i.employee_snapshot,monthly_salary_cents:i.monthly_salary_cents}:current;
      const inputs=p.status==='closed'?{base_override:String(Number(i.base_cents)/100),adjustment_reason:i.adjustment_reason,commissions:String(Number(i.commissions_cents)/100),loan:String(Number(i.loan_cents)/100),other:String(Number(i.other_cents)/100),other_reason:i.other_reason}:req.body;
      const a=payrollAmounts(e.monthly_salary_cents,{...inputs,caja:0,renta:0},p.half,{deferNetValidation:true});
      const calculated=await calculateFor(client,e,p,a,{simulation:p.deduction_mode!=='automatic'});
      const net=a.gross+calculated.refund-a.deductions-calculated.caja-calculated.renta;
      return {...calculated,base:a.base,gross:a.gross,net,review:deductionReview(calculated,e,a),trial:p.deduction_mode!=='automatic',exception:exceptionInput(req.body),actual:{caja_cents:i.caja_cents,renta_cents:i.renta_cents,net_cents:i.net_cents},needs_approval:p.half===2&&calculated.snapshot.difference_cents!==0};
    });res.json(result);
  });
  app.get('/api/employer-report',async(req,res)=> {
    const dates=payPeriod(req.query.year,req.query.month,req.query.half||1),half=req.query.half?Number(req.query.half):null;
    const report=await transaction(pool,async client=> {
      await client.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY');
      const items=(await client.query('SELECT i.*,p.year,p.month,p.half,p.status,p.deduction_mode,p.start_date,p.end_date FROM payroll_items i JOIN payroll_periods p ON p.id=i.period_id WHERE p.year=$1 AND p.month=$2 AND ($3::integer IS NULL OR p.half=$3) ORDER BY i.employee_snapshot->>\'full_name\',p.half',[dates.year,dates.month,half])).rows;
      const rows=[];
      for(const i of items) {
        let employer=Number(i.employer_cents),estimated=false;
        if(i.deduction_mode!=='automatic') {
          estimated=true;
          try{employer=percentageAmount(i.gross_cents,(await ruleFor(client,i.start_date)).employer_bp);}catch(error){if(error.code==='DEDUCTIONS_NOT_CONFIGURED')employer=null;else throw error;}
        }
        rows.push({employee_id:i.employee_id,full_name:i.employee_snapshot.full_name,code:i.employee_snapshot.code,half:i.half,status:i.status,mode:i.deduction_mode,gross_cents:Number(i.gross_cents),worker_cents:Number(i.caja_cents),employer_cents:employer,estimated,renta_cents:Number(i.renta_cents),refund_cents:Number(i.tax_refund_cents)});
      }
      const adjustments=(await client.query('SELECT a.*,e.full_name,e.code FROM tax_adjustments a JOIN employees e ON e.id=a.employee_id WHERE a.year=$1 AND a.month=$2 ORDER BY a.created_at DESC',[dates.year,dates.month])).rows;
      const totals=status=>rows.filter(i=>i.status===status).reduce((sum,i)=>({gross:sum.gross+i.gross_cents,worker:sum.worker+i.worker_cents,employer:sum.employer+(i.employer_cents??0),renta:sum.renta+i.renta_cents,refund:sum.refund+i.refund_cents,missing:sum.missing+(i.employer_cents===null?1:0)}),{gross:0,worker:0,employer:0,renta:0,refund:0,missing:0});
      return {year:dates.year,month:dates.month,half,rows,adjustments,closed:totals('closed'),draft:totals('draft'),external_adjustments:adjustments.filter(a=>a.status==='applied').reduce((sum,a)=>sum+Number(a.delta_cents),0)};
    });res.json(report);
  });
  async function settlement(client,employeeId,year,month) {
    const e=await row(client,'SELECT * FROM employees WHERE id=$1 FOR SHARE',[employeeId]);
    const dates=payPeriod(year,month,2);
    const items=(await client.query("SELECT i.*,p.half,p.status,p.deduction_mode,p.company_snapshot FROM payroll_items i JOIN payroll_periods p ON p.id=i.period_id WHERE i.employee_id=$1 AND p.year=$2 AND p.month=$3 ORDER BY p.half",[employeeId,dates.year,dates.month])).rows;
    if(!items.length||items.some(i=>i.status!=='closed'||i.deduction_mode!=='automatic'))throw new AppError('El ajuste posterior requiere nóminas automáticas cerradas del mes.',409);
    for(const half of [1,2]){const p=payPeriod(year,month,half);if(e.hire_date<=p.end&&(!e.termination_date||e.termination_date>=p.start)&&!items.some(i=>i.half===half))throw new AppError('Falta cerrar una quincena del mes. Complete la nómina antes del ajuste.',409);}
    const rule=items[0].deduction_snapshot?.tax_rule||items[0].deduction_snapshot?.rule||await ruleFor(client,payPeriod(year,month,1).start);
    const gross=items.reduce((sum,i)=>sum+Number(i.gross_cents),0),tax=incomeTax(gross,rule.brackets).tax_cents;
    const applied=Number((await client.query("SELECT COALESCE(SUM(delta_cents),0) AS total FROM tax_adjustments WHERE employee_id=$1 AND year=$2 AND month=$3 AND status='applied'",[employeeId,year,month])).rows[0].total);
    const retained=items.reduce((sum,i)=>sum+Number(i.renta_cents)-Number(i.tax_refund_cents),0)+applied;
    return {employee:{id:e.id,full_name:e.full_name,code:e.code},company:items[0].company_snapshot,year:Number(year),month:Number(month),gross_cents:gross,tax_cents:tax,retained_cents:retained,delta_cents:tax-retained,rule,sources:items.map(i=>({id:i.id,revision:i.revision})),hire_date:e.hire_date,termination_date:e.termination_date};
  }
  app.post('/api/tax-adjustments',async(req,res)=> {
    const dates=payPeriod(req.body.year,req.body.month,1),reason=text(req.body.reason,'Motivo del ajuste',{max:1000});
    const after=await transaction(pool,async client=> {
      await client.query('SELECT pg_advisory_xact_lock(74210619)');await client.query('SELECT pg_advisory_xact_lock(74210620)');
      const calc=await settlement(client,req.body.employee_id,dates.year,dates.month);
      if(!calc.delta_cents)throw new AppError('No hay diferencia pendiente de renta para los ingresos registrados.',409);
      const a=await row(client,'INSERT INTO tax_adjustments(id,employee_id,year,month,delta_cents,calculation,reason,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',[randomUUID(),req.body.employee_id,dates.year,dates.month,calc.delta_cents,JSON.stringify(calc),reason,req.user.id]);
      await audit(client,req.user.id,'proponer_ajuste','renta',a.id,null,a);return a;
    });res.status(201).json(after);
  });
  app.post('/api/tax-adjustments/:id/:action',async(req,res)=> {
    if(!['apply','cancel'].includes(req.params.action))throw new AppError('Acción de ajuste inválida.');
    const after=await transaction(pool,async client=> {
      await client.query('SELECT pg_advisory_xact_lock(74210619)');await client.query('SELECT pg_advisory_xact_lock(74210620)');
      const before=await row(client,'SELECT * FROM tax_adjustments WHERE id=$1 FOR UPDATE',[req.params.id]);
      if(before.status!=='pending'||Number(req.body.revision)!==before.revision)throw new AppError('El ajuste cambió o ya fue resuelto. Recargue.',409);
      const reference=text(req.body.reference,'Referencia y revisión contable',{max:1000});
      if(req.params.action==='apply') {
        if(req.body.confirm!==true)throw new AppError('Confirme la revisión contable y el cobro/devolución registrado.');
        const current=await settlement(client,before.employee_id,before.year,before.month);
        const saved=before.calculation;
        if(current.delta_cents!==Number(before.delta_cents)||current.gross_cents!==saved.gross_cents||current.retained_cents!==saved.retained_cents||current.sources.length!==saved.sources.length||current.sources.some((source,index)=>source.id!==saved.sources[index].id||source.revision!==saved.sources[index].revision)||current.termination_date!==saved.termination_date)throw new AppError('La base del ajuste cambió. Cancele y genere una propuesta actualizada.',409);
      }
      const a=await row(client,"UPDATE tax_adjustments SET status=$1,reference=$2,revision=revision+1,applied_at=CASE WHEN $1='applied' THEN now() ELSE NULL END,applied_by=$3 WHERE id=$4 RETURNING *",[req.params.action==='apply'?'applied':'cancelled',reference,req.user.id,before.id]);
      await audit(client,req.user.id,req.params.action==='apply'?'aplicar_ajuste':'cancelar_ajuste','renta',a.id,before,a);return a;
    });res.json(after);
  });
  app.get('/api/tax-adjustments/:id.pdf',async(req,res)=> {
    const adjustment=await row(pool,'SELECT * FROM tax_adjustments WHERE id=$1',[req.params.id]);
    const company=adjustment.calculation.company||(await pool.query('SELECT * FROM company WHERE id=1')).rows[0];
    res.type('application/pdf').setHeader('Content-Disposition',`inline; filename="ajuste-renta-${adjustment.year}-${adjustment.month}.pdf"`);res.send(await taxAdjustmentPdf(adjustment,company));
  });
}
