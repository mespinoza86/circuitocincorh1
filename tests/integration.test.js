import {test} from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { randomUUID } from 'node:crypto';
import {testServer,admin,employee} from './helpers.js';
import {todayCR} from '../server/domain.js';
import {passwordHash} from '../server/auth.js';

test('flujo real PostgreSQL: permisos, perfiles, vacaciones, nómina, PDF y cuentas',async t=> {
  const instance=await testServer();t.after(()=>instance.close());
  let cookie='',csrf='';
  async function request(path,{method='GET',body,auth=true,headers={}}={}) {
    const response=await fetch(instance.base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(auth?{cookie,'X-CSRF-Token':csrf}:{}),...headers},body:body===undefined?undefined:JSON.stringify(body)});
    const set=response.headers.get('set-cookie');if(set)cookie=set.split(';')[0];
    const data=await response.json();return {status:response.status,data};
  }
  const year=Number(todayCR().slice(0,4))+1;
  const future=`${year}-01`;
  let e,period,item;
  await t.test('no expone información sin sesión ni admite origen externo',async()=> {
    assert.equal((await request('/bootstrap',{auth:false})).status,401);
    assert.equal((await request('/auth/setup',{method:'POST',body:admin,headers:{Origin:'https://externo.invalid'}})).status,403);
    assert.equal((await request('/auth/status')).data.initialized,false);
  });
  await t.test('configuración inicial, hash de contraseña y protección CSRF',async()=> {
    const result=await request('/auth/setup',{method:'POST',body:admin});assert.equal(result.status,201);csrf=result.data.csrf;
    assert.equal((await request('/auth/setup',{method:'POST',body:admin})).status,409);
    assert.equal((await request('/employees',{method:'POST',body:employee(),headers:{'X-CSRF-Token':'incorrecto'}})).status,403);
    const user=(await instance.pool.query('SELECT * FROM users')).rows[0];assert.match(user.password_hash,/^scrypt:/);assert.ok(!user.password_hash.includes(admin.password));
  });
  await t.test('crea perfiles y rechaza duplicados, fechas y revisiones antiguas',async()=> {
    const created=await request('/employees',{method:'POST',body:employee()});assert.equal(created.status,201);e=created.data;
    assert.equal((await request('/employees',{method:'POST',body:employee()})).status,409);
    assert.equal((await request(`/employees/${e.id}`,{method:'PUT',body:employee({revision:0})})).status,409);
    assert.equal((await request('/employees',{method:'POST',body:employee({code:'otro',national_id:'otra',birth_date:'2026-02-30'})})).status,400);
  });
  await t.test('feriados, medios días y superposiciones se comprueban en el servidor',async()=> {
    // Día laboral fijo dentro de enero futuro, independientemente del calendario.
    let day=14;while([0,6].includes(new Date(`${future}-${day}T12:00:00Z`).getUTCDay()))day++;
    const work=`${future}-${String(day).padStart(2,'0')}`;
    const input={employee_id:e.id,start_date:work,end_date:work,half_day:true};
    const half=await request('/vacations',{method:'POST',body:input});assert.equal(half.status,201);assert.equal(Number(half.data.vacation.days),.5);
    assert.equal((await request('/vacations',{method:'POST',body:{...input,half_day:false}})).status,400);
    assert.equal((await request('/vacations',{method:'POST',body:input})).status,201); // segunda mitad
    assert.equal((await request('/vacations',{method:'POST',body:input})).status,400); // tercera mitad
    assert.equal((await request('/holidays',{method:'POST',body:{day:work,name:'Feriado en movimiento aprobado'}})).status,400);
    const cancelled=await request(`/vacations/${half.data.vacation.id}/cancel`,{method:'POST',body:{reason:'Cambio de fechas'}});assert.equal(cancelled.status,200);
    assert.equal((await request(`/vacations/${half.data.vacation.id}/cancel`,{method:'POST',body:{reason:'Otra vez'}})).status,409);
    const holiday=`${year}-02-02`;
    assert.equal((await request('/holidays',{method:'POST',body:{day:holiday,name:'Feriado de prueba'}})).status,201);
    assert.equal((await request('/vacations/preview',{method:'POST',body:{employee_id:e.id,start_date:holiday,end_date:holiday,half_day:false}})).status,400);
  });
  await t.test('saldo negativo necesita confirmación y descuento histórico evita duplicados',async()=> {
    const created=await request('/employees',{method:'POST',body:employee({code:'EMP-002',national_id:'2-2222-2222',full_name:'Saldo Negativo',historical_days:10000,historical_cutoff:todayCR(),historical_note:'Histórico informado'})});assert.equal(created.status,201);
    const negative=created.data;
    let day=4;while([0,6].includes(new Date(`${future}-${String(day).padStart(2,'0')}T12:00:00Z`).getUTCDay()))day++;
    const work=`${future}-${String(day).padStart(2,'0')}`,input={employee_id:negative.id,start_date:work,end_date:work,half_day:false};
    const denied=await request('/vacations',{method:'POST',body:input});assert.equal(denied.status,409);assert.equal(denied.data.code,'NEGATIVE_BALANCE');
    const accepted=await request('/vacations',{method:'POST',body:{...input,allow_negative:true}});assert.equal(accepted.status,201);assert.ok(accepted.data.balance.available<0);
    assert.equal((await request('/vacations',{method:'POST',body:{...input,start_date:todayCR(),end_date:todayCR(),allow_negative:true}})).status,400);
    const report=await request(`/reports/vacations?year=${year}&as_of=${todayCR()}`);assert.equal(report.status,200);assert.ok(report.data.employees.find(x=>x.id===negative.id).vacation.available<0);
  });
  await t.test('nómina divide salario, exige revisión y conserva colilla después de cambios',async()=> {
    const created=await request('/payroll',{method:'POST',body:{year,month:3,half:1}});assert.equal(created.status,201);period=created.data;
    assert.equal((await request('/payroll',{method:'POST',body:{year,month:3,half:1}})).status,409);
    assert.equal((await request(`/payroll/${period.id}/close`,{method:'POST',body:{}})).status,400);
    const details=(await request(`/payroll/${period.id}`)).data;assert.equal(details.items.length,2);
    for(const row of details.items) {
      assert.equal(Number(row.base_cents),50000000);
      const saved=await request(`/payroll/${period.id}/items/${row.id}`,{method:'PUT',body:{revision:row.revision,commissions:'20000',caja:'50000',renta:'10000',loan:'5000',other:'1000',other_reason:'Asociación'}});
      assert.equal(saved.status,200);assert.equal(Number(saved.data.net_cents),45400000);
      if(row.employee_id===e.id)item=saved.data;
    }
    const close=await request(`/payroll/${period.id}/close`,{method:'POST',body:{}});assert.equal(close.status,200);
    assert.equal((await request(`/payroll/${period.id}/items/${item.id}`,{method:'PUT',body:{revision:item.revision,commissions:0}})).status,409);
    const pdf=await fetch(instance.base+`/api/payslips/${item.id}.pdf`,{headers:{cookie}});assert.equal(pdf.status,200);assert.equal(pdf.headers.get('content-type'),'application/pdf');assert.ok(Buffer.from(await pdf.arrayBuffer()).subarray(0,4).toString()==='%PDF');
    const updated=await request(`/employees/${e.id}`,{method:'PUT',body:employee({monthly_salary:'2000000',full_name:'Nombre Actualizado',revision:e.revision})});assert.equal(updated.status,200);
    const preserved=(await request(`/payroll/${period.id}`)).data.items.find(i=>i.id===item.id);assert.equal(preserved.employee_snapshot.full_name,'Persona de Prueba');assert.equal(Number(preserved.monthly_salary_cents),100000000);assert.equal(Number(preserved.net_cents),45400000);
  });
  await t.test('correo requiere SMTP y destinatario de la colilla; envío local verificable',async()=> {
    const env={host:process.env.SMTP_HOST,from:process.env.SMTP_FROM,port:process.env.SMTP_PORT,user:process.env.SMTP_USER,secure:process.env.SMTP_SECURE};
    process.env.SMTP_HOST='';assert.equal((await request(`/payslips/${item.id}/email`,{method:'POST',body:{recipient:'persona@example.test'}})).status,503);
    const messages=[];
    const smtp=net.createServer(socket=> {
      socket.setEncoding('utf8');socket.write('220 localhost test SMTP\r\n');let buffer='',reading=false,message='';
      socket.on('data',chunk=>{buffer+=chunk;let index;while((index=buffer.indexOf('\r\n'))>=0){const line=buffer.slice(0,index);buffer=buffer.slice(index+2);
        if(reading){if(line==='.'){reading=false;messages.push(message);socket.write('250 accepted\r\n');}else message+=line+'\r\n';continue;}
        if(/^EHLO|^HELO/.test(line))socket.write('250 localhost\r\n');
        else if(/^MAIL|^RCPT|^RSET/.test(line))socket.write('250 OK\r\n');
        else if(line==='DATA'){reading=true;message='';socket.write('354 send data\r\n');}
        else if(line==='QUIT'){socket.end('221 bye\r\n');}
        else socket.write('250 OK\r\n');
      }});
    });
    await new Promise(resolve=>smtp.listen(0,'127.0.0.1',resolve));
    try {
      process.env.SMTP_HOST='127.0.0.1';process.env.SMTP_PORT=String(smtp.address().port);process.env.SMTP_FROM='rrhh@example.test';process.env.SMTP_USER='';process.env.SMTP_SECURE='false';
      assert.equal((await request(`/payslips/${item.id}/email`,{method:'POST',body:{recipient:'otro@example.test'}})).status,400);
      assert.equal((await request(`/payslips/${item.id}/email`,{method:'POST',body:{recipient:'persona@example.test'}})).status,200);
      assert.equal(messages.length,1);assert.match(messages[0],/application\/pdf/);assert.match(messages[0],/persona@example.test/);
      assert.equal((await request(`/payslips/${item.id}/email`,{method:'POST',body:{recipient:'persona@example.test'}})).status,409);
      assert.equal(messages.length,1);
    }finally{await new Promise(resolve=>smtp.close(resolve));for(const [key,value] of Object.entries({SMTP_HOST:env.host,SMTP_FROM:env.from,SMTP_PORT:env.port,SMTP_USER:env.user,SMTP_SECURE:env.secure})){if(value===undefined)delete process.env[key];else process.env[key]=value;}}
  });
  await t.test('ingreso y salida durante una quincena requieren revisión manual y sincronización',async()=> {
    const hire=`${year}-04-08`,exit=`${year}-04-10`;
    const created=await request('/employees',{method:'POST',body:employee({code:'EMP-003',national_id:'3-3333-3333',full_name:'Ingreso Parcial',hire_date:hire,monthly_salary:'900000'})});assert.equal(created.status,201);
    const partialEmployee=created.data;
    const createdPeriod=await request('/payroll',{method:'POST',body:{year,month:4,half:1}});assert.equal(createdPeriod.status,201);
    const p=createdPeriod.data;
    let items=(await request(`/payroll/${p.id}`)).data.items;
    const partial=items.find(i=>i.employee_id===partialEmployee.id);
    assert.equal((await request(`/payroll/${p.id}/items/${partial.id}`,{method:'PUT',body:{revision:partial.revision}})).status,400);
    const afterExit=await request(`/employees/${partialEmployee.id}`,{method:'PUT',body:employee({code:'EMP-003',national_id:'3-3333-3333',full_name:'Ingreso Parcial',hire_date:hire,monthly_salary:'900000',active:false,termination_date:exit,revision:partialEmployee.revision})});assert.equal(afterExit.status,200);
    for(const i of items) {
      const body=i.employee_id===partialEmployee.id?{revision:i.revision,base_override:'150000',adjustment_reason:'Importe manual por ingreso el 8 y salida el 10'}:{revision:i.revision};
      const saved=await request(`/payroll/${p.id}/items/${i.id}`,{method:'PUT',body});assert.equal(saved.status,200);
      if(i.employee_id===partialEmployee.id)assert.equal(Number(saved.data.net_cents),15000000);
    }
    assert.equal((await request('/employees',{method:'POST',body:employee({code:'EMP-004',national_id:'4-4444-4444',full_name:'Ingreso posterior al borrador',hire_date:`${year}-04-03`})})).status,201);
    assert.equal((await request(`/payroll/${p.id}/close`,{method:'POST',body:{}})).status,400);
    assert.equal((await request(`/payroll/${p.id}/sync`,{method:'POST',body:{}})).status,200);
    items=(await request(`/payroll/${p.id}`)).data.items;assert.equal(items.length,4);
    const added=items.find(i=>!i.reviewed);
    assert.equal((await request(`/payroll/${p.id}/items/${added.id}`,{method:'PUT',body:{revision:added.revision,base_override:'250000',adjustment_reason:'Ingreso durante la quincena'}})).status,200);
    assert.equal((await request(`/payroll/${p.id}/close`,{method:'POST',body:{}})).status,200);
  });
  await t.test('cuentas temporales, cambio de contraseña, revocación y aislamiento por rol',async()=> {
    const originalCookie=cookie,originalCsrf=csrf;
    const created=await request('/users',{method:'POST',body:{name:'Otra Administradora',email:'segunda@example.test',password:'Temporal-segura-1234'}});assert.equal(created.status,201);
    const login=await request('/auth/login',{method:'POST',body:{email:'segunda@example.test',password:'Temporal-segura-1234'}});assert.equal(login.status,200);csrf=login.data.csrf;assert.equal(login.data.user.must_change_password,true);
    assert.equal((await request('/bootstrap')).status,403);
    const changed=await request('/auth/password',{method:'POST',body:{current_password:'Temporal-segura-1234',password:'Definitiva-segura-1234'}});assert.equal(changed.status,200);csrf=changed.data.csrf;
    assert.equal((await request('/bootstrap')).status,200);
    const secondCookie=cookie;cookie=originalCookie;csrf=originalCsrf;
    assert.equal((await request(`/users/${created.data.id}`,{method:'PATCH',body:{active:false}})).status,200);
    cookie=secondCookie;assert.equal((await request('/bootstrap')).status,401);cookie=originalCookie;
    const hash=await passwordHash('Empleado-seguro-1234'),employeeUser=randomUUID();
    await instance.pool.query("INSERT INTO users(id,name,email,password_hash,role,employee_id) VALUES($1,'Empleado','empleado@example.test',$2,'employee',$3)",[employeeUser,hash,e.id]);
    const employeeLogin=await request('/auth/login',{method:'POST',body:{email:'empleado@example.test',password:'Empleado-seguro-1234'}});assert.equal(employeeLogin.status,200);csrf=employeeLogin.data.csrf;
    assert.equal((await request('/bootstrap')).status,403);assert.equal((await request(`/payslips/${item.id}.pdf`)).status,403);
    cookie=originalCookie;csrf=originalCsrf;
    const audit=(await request('/bootstrap')).data.audit;assert.ok(audit.some(a=>a.action==='cerrar'));assert.ok(!JSON.stringify(audit).includes('scrypt:'));assert.ok(!JSON.stringify(audit).includes(admin.password));
  });
});
