import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {testServer,admin,employee} from './helpers.js';
import {migrate} from '../server/db.js';
import {passwordHash} from '../server/auth.js';
import {aguinaldoReport,aguinaldoPeriod} from '../server/aguinaldo.js';
const config={effective_from:'2026-10-01',worker_rate:'10.83',employer_rate:'26.83',enabled:true,note:'Reglas ficticias de prueba basadas en tabla 2026',brackets:[{up_to:'918000',rate:'0'},{up_to:'1347000',rate:'10'},{up_to:'2364000',rate:'15'},{up_to:'4727000',rate:'20'},{up_to:'',rate:'25'}]};

test('deducciones: octubre simulado, noviembre automático, conciliación, ajustes y conservación',async t=> {
  const instance=await testServer();t.after(()=>instance.close());let cookie='',csrf='';
  async function request(path,{method='GET',body}={}) {
    const r=await fetch(instance.base+'/api'+path,{method,headers:{'Content-Type':'application/json',cookie,'X-CSRF-Token':csrf},body:body===undefined?undefined:JSON.stringify(body)});
    const session=r.headers.get('set-cookie');if(session)cookie=session.split(';')[0];return {status:r.status,data:await r.json()};
  }
  const getItems=async p=>(await request(`/payroll/${p.id}`)).data.items;
  async function create(month,half,year=2026){const r=await request('/payroll',{method:'POST',body:{year,month,half}});assert.equal(r.status,201,JSON.stringify(r.data));return r.data;}
  async function close(p){const r=await request(`/payroll/${p.id}/close`,{method:'POST',body:{}});assert.equal(r.status,200,JSON.stringify(r.data));}
  async function preview(p,body={}) {const i=(await getItems(p))[0];return {item:i,result:await request(`/payroll/${p.id}/items/${i.id}/deduction-preview`,{method:'POST',body})};}
  async function saveAuto(p,body={}){const {item,result}=await preview(p,body);assert.equal(result.status,200,JSON.stringify(result.data));return request(`/payroll/${p.id}/items/${item.id}`,{method:'PUT',body:{...body,revision:item.revision,deduction_review:result.data.review}});}
  assert.equal((await request('/deduction-settings')).status,401);
  const setup=await request('/auth/setup',{method:'POST',body:admin});csrf=setup.data.csrf;
  const created=await request('/employees',{method:'POST',body:employee({monthly_salary:'600000'})});assert.equal(created.status,201);const e=created.data;
  const oct1=await create(10,1),oct2=await create(10,2);
  for(const [p,body] of [[oct1,{commissions:'800000',caja:'123',renta:'50850'}],[oct2,{base_override:'150000',adjustment_reason:'Importe salarial de prueba',caja:'456'}]]) {
    const i=(await getItems(p))[0];assert.equal((await request(`/payroll/${p.id}/items/${i.id}`,{method:'PUT',body:{...body,revision:i.revision}})).status,200);await close(p);
  }
  await t.test('migración preserva registros manuales anteriores',async()=> {
    const beforeE=(await instance.pool.query('SELECT * FROM employees ORDER BY id')).rows;
    const beforeI=(await instance.pool.query('SELECT * FROM payroll_items ORDER BY id')).rows;
    const beforeP=(await instance.pool.query('SELECT * FROM payroll_periods ORDER BY id')).rows;
    await instance.pool.query('DROP TABLE tax_adjustments,deduction_rules,deduction_control');
    await instance.pool.query('ALTER TABLE payroll_items DROP COLUMN tax_refund_cents,DROP COLUMN employer_cents,DROP COLUMN deduction_snapshot,DROP COLUMN exception_data');
    await instance.pool.query('ALTER TABLE payroll_periods DROP COLUMN deduction_mode');
    await instance.pool.query("DELETE FROM schema_migrations WHERE name='004-deductions.sql'");await migrate(instance.pool);
    assert.deepEqual((await instance.pool.query('SELECT * FROM employees ORDER BY id')).rows,beforeE);
    assert.deepEqual((await instance.pool.query('SELECT * FROM payroll_items ORDER BY id')).rows,beforeI);
    assert.deepEqual((await instance.pool.query('SELECT * FROM payroll_periods ORDER BY id')).rows,beforeP);
  });
  let settings=(await request('/deduction-settings')).data;assert.equal(settings.control.enabled,false);
  assert.equal((await request('/deduction-settings',{method:'POST',body:{...config,worker_rate:'101',revision:1}})).status,400);
  assert.equal((await request('/deduction-settings',{method:'POST',body:{...config,revision:1}})).status,201);
  assert.equal((await request('/deduction-settings',{method:'POST',body:{...config,revision:1}})).status,409);
  await t.test('octubre compara sin cambiar salarios, colillas o rebajos',async()=> {
    const before=(await instance.pool.query('SELECT * FROM payroll_items WHERE period_id=ANY($1::uuid[]) ORDER BY id',[[oct1.id,oct2.id]])).rows;
    const one=await preview(oct1);assert.equal(one.result.status,200);assert.equal(one.result.data.caja,11913000);assert.equal(one.result.data.renta,5085000);assert.equal(one.result.data.trial,true);
    const two=await preview(oct2);assert.equal(two.result.status,200);assert.equal(two.result.data.refund,1765000);
    assert.deepEqual((await instance.pool.query('SELECT * FROM payroll_items WHERE period_id=ANY($1::uuid[]) ORDER BY id',[[oct1.id,oct2.id]])).rows,before);
    assert.equal((await request(`/payroll/${oct1.id}/automatic`,{method:'POST',body:{}})).status,409);
  });
  const nov2=await create(11,2);assert.equal(nov2.deduction_mode,'automatic');assert.equal((await preview(nov2)).result.status,409);
  settings=(await request('/deduction-settings')).data;
  assert.equal((await request('/deduction-settings',{method:'POST',body:{...config,enabled:false,revision:settings.control.revision}})).status,201);
  const nov1=await create(11,1);assert.equal(nov1.deduction_mode,'automatic');const body1={commissions:'800000'};
  await t.test('cálculo oficial ignora rebajos escritos y rechaza vista previa desactualizada',async()=> {
    const prior=await preview(nov1,body1);assert.equal(prior.result.status,200);
    settings=(await request('/deduction-settings')).data;
    assert.equal((await request('/deduction-settings',{method:'POST',body:{...config,effective_from:'2026-11-01',revision:settings.control.revision}})).status,201);
    assert.equal((await request(`/payroll/${nov1.id}/items/${prior.item.id}`,{method:'PUT',body:{...body1,revision:prior.item.revision,deduction_review:prior.result.data.review}})).data.code,'DEDUCTION_PREVIEW_CHANGED');
    const saved=await saveAuto(nov1,{...body1,caja:'0',renta:'0'});assert.equal(saved.status,200);assert.equal(saved.data.renta_cents,'5085000');assert.equal(saved.data.caja_cents,'11913000');assert.equal(saved.data.net_cents,'93002000');await close(nov1);
    settings=(await request('/deduction-settings')).data;
    assert.equal((await request('/deduction-settings',{method:'POST',body:{...config,effective_from:'2026-11-01',revision:settings.control.revision}})).status,409);
  });
  const body2={base_override:'150000',adjustment_reason:'Salario corregido por incapacidad (prueba)',exception_reason:'Incapacidad',exception_reference:'Boleta ficticia',exception_start:'2026-11-16',exception_end:'2026-11-30'};
  await t.test('conciliación devuelve sin sumar al salario/aguinaldo y requiere aprobación',async()=> {
    assert.equal((await preview(nov2,{commissions:'1'})).result.status,400);
    assert.equal((await saveAuto(nov2,body2)).data.code,'TAX_ADJUSTMENT_CONFIRMATION');
    assert.equal((await saveAuto(nov2,{...body2,loan:'200000',confirm_tax_adjustment:true,tax_adjustment_note:'Neto insuficiente de prueba'})).data.code,'NEGATIVE_PAYROLL_NET');
    const saved=await saveAuto(nov2,{...body2,confirm_tax_adjustment:true,tax_adjustment_note:'Revisión contable de prueba'});assert.equal(saved.status,200,JSON.stringify(saved.data));
    assert.equal(saved.data.gross_cents,'15000000');assert.equal(saved.data.tax_refund_cents,'1765000');assert.equal(saved.data.net_cents,'15140500');await close(nov2);
    const report=(await request('/employer-report?year=2026&month=11')).data;
    assert.equal(report.closed.renta-report.closed.refund,3320000);assert.equal(report.closed.worker,13537500);assert.equal(report.closed.employer,33537500);
    assert.equal((await request('/tax-adjustments',{method:'POST',body:{employee_id:e.id,year:2026,month:11,reason:'No debe duplicar'}})).status,409);
    const sources=(await instance.pool.query("SELECT i.*,p.year,p.month,p.half,p.status,p.end_date FROM payroll_items i JOIN payroll_periods p ON p.id=i.period_id WHERE p.month=11 AND p.year=2026")).rows;
    const a=aguinaldoReport([e],sources,[],aguinaldoPeriod(2026,'2026-11-30')).employees[0];assert.equal(a.gross_cents,'125000000');
    const response=await fetch(instance.base+`/api/payslips/${saved.data.id}.pdf`,{headers:{cookie}});assert.equal(response.status,200);assert.equal(Buffer.from(await response.arrayBuffer()).subarray(0,4).toString(),'%PDF');
    const future=await create(1,1,2027);assert.equal((await preview(future)).result.data.code,'DEDUCTIONS_NOT_CONFIGURED');
  });
  await t.test('salida sin segunda quincena registra ajuste posterior, cancelación y aplicación única',async()=> {
    const p=await create(12,1),saved=await saveAuto(p,body1);assert.equal(saved.status,200);await close(p);
    const original=(await getItems(p))[0];
    const update=await request(`/employees/${e.id}`,{method:'PUT',body:employee({monthly_salary:'600000',revision:e.revision,active:false,termination_date:'2026-12-15'})});assert.equal(update.status,200);
    const input={employee_id:e.id,year:2026,month:12,reason:'Salida después de la retención estimada'};
    const pending=await request('/tax-adjustments',{method:'POST',body:input});assert.equal(pending.status,201);assert.equal(pending.data.delta_cents,'-3265000');
    assert.equal((await request(`/tax-adjustments/${pending.data.id}/cancel`,{method:'POST',body:{revision:1,reference:'Cancelar prueba anterior'}})).status,200);
    const next=await request('/tax-adjustments',{method:'POST',body:input});assert.equal(next.status,201);
    assert.equal((await request('/tax-adjustments',{method:'POST',body:input})).status,409);
    assert.equal((await request(`/tax-adjustments/${next.data.id}/apply`,{method:'POST',body:{revision:1,reference:'Revisión contable'}})).status,400);
    const concurrent=await Promise.all([1,2].map(()=>request(`/tax-adjustments/${next.data.id}/apply`,{method:'POST',body:{revision:1,reference:'Revisado y devolución registrada fuera del sistema',confirm:true}})));
    assert.deepEqual(concurrent.map(r=>r.status).sort(),[200,409]);
    const receipt=await fetch(instance.base+`/api/tax-adjustments/${next.data.id}.pdf`,{headers:{cookie}});assert.equal(receipt.status,200);assert.equal(Buffer.from(await receipt.arrayBuffer()).subarray(0,4).toString(),'%PDF');
    assert.deepEqual((await getItems(p))[0],original);
    const r=(await request('/employer-report?year=2026&month=12')).data;assert.equal(r.closed.renta+r.external_adjustments,1820000);
  });
  await t.test('reportes y configuración son exclusivos de administradores',async()=> {
    const originalCookie=cookie,originalCsrf=csrf;
    await instance.pool.query("INSERT INTO users(id,name,email,password_hash,role,employee_id) VALUES($1,'Empleado','privado@example.test',$2,'employee',$3)",[randomUUID(),await passwordHash('Empleado-seguro-1234'),e.id]);
    const login=await request('/auth/login',{method:'POST',body:{email:'privado@example.test',password:'Empleado-seguro-1234'}});csrf=login.data.csrf;
    for(const path of ['/deduction-settings','/employer-report?year=2026&month=11'])assert.equal((await request(path)).status,403);
    assert.equal((await request('/tax-adjustments',{method:'POST',body:{}})).status,403);
    cookie=originalCookie;csrf=originalCsrf;
  });
});

test('activación conserva importes de borradores y mantiene un solo modo para todo el mes',async t=> {
  const instance=await testServer();t.after(()=>instance.close());let cookie='',csrf='';
  async function request(path,method='GET',body){const r=await fetch(instance.base+'/api'+path,{method,headers:{'Content-Type':'application/json',cookie,'X-CSRF-Token':csrf},body:body===undefined?undefined:JSON.stringify(body)});const session=r.headers.get('set-cookie');if(session)cookie=session.split(';')[0];return {status:r.status,data:await r.json()};}
  const setup=await request('/auth/setup','POST',admin);csrf=setup.data.csrf;assert.equal((await request('/employees','POST',employee({monthly_salary:'600000'}))).status,201);
  const p1=(await request('/payroll','POST',{year:2026,month:11,half:1})).data,p2=(await request('/payroll','POST',{year:2026,month:11,half:2})).data;
  const old=(await request(`/payroll/${p1.id}`)).data.items[0];
  const reviewed=await request(`/payroll/${p1.id}/items/${old.id}`,'PUT',{revision:old.revision,caja:'123',renta:'456'});assert.equal(reviewed.status,200);
  assert.equal((await request('/deduction-settings','POST',{...config,revision:1})).status,201);
  assert.equal((await request(`/payroll/${p2.id}/automatic`,'POST',{})).status,200);
  const one=(await request(`/payroll/${p1.id}`)).data,two=(await request(`/payroll/${p2.id}`)).data;
  assert.equal(one.period.deduction_mode,'automatic');assert.equal(two.period.deduction_mode,'automatic');assert.equal(one.items[0].reviewed,false);assert.equal(one.items[0].net_cents,reviewed.data.net_cents);assert.equal(one.items[0].caja_cents,'12300');
  const settings=(await request('/deduction-settings')).data;
  assert.equal((await request('/deduction-settings','POST',{...config,effective_from:'2026-12-01',enabled:false,revision:settings.control.revision})).status,201);
  const dec1=(await request('/payroll','POST',{year:2026,month:12,half:1})).data;assert.equal(dec1.deduction_mode,'manual');
  const i=(await request(`/payroll/${dec1.id}`)).data.items[0];assert.equal((await request(`/payroll/${dec1.id}/items/${i.id}`,'PUT',{revision:i.revision})).status,200);assert.equal((await request(`/payroll/${dec1.id}/close`,'POST',{})).status,200);
  const next=(await request('/deduction-settings')).data;assert.equal((await request('/deduction-settings','POST',{...config,effective_from:'2026-12-01',enabled:true,revision:next.control.revision})).status,201);
  const dec2=await request('/payroll','POST',{year:2026,month:12,half:2});assert.equal(dec2.status,201);assert.equal(dec2.data.deduction_mode,'manual');
});
