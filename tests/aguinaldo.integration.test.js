import {test} from 'node:test';
import assert from 'node:assert/strict';
import {testServer,admin,employee} from './helpers.js';
import {todayCR} from '../server/domain.js';
import {migrate} from '../server/db.js';

test('aguinaldo: ingresos reales, históricos, duplicados, concurrencia y migración con datos',async t=> {
  const instance=await testServer();t.after(()=>instance.close());
  let cookie='',csrf='';
  const year=Number(todayCR().slice(0,4))-1;
  async function request(path,{method='GET',body}={}) {
    const response=await fetch(instance.base+'/api'+path,{method,headers:{'Content-Type':'application/json',cookie,'X-CSRF-Token':csrf},body:body===undefined?undefined:JSON.stringify(body)});
    const session=response.headers.get('set-cookie');if(session)cookie=session.split(';')[0];
    return {status:response.status,data:await response.json()};
  }
  assert.equal((await request(`/aguinaldo?year=${year}`)).status,401);
  const setup=await request('/auth/setup',{method:'POST',body:admin});csrf=setup.data.csrf;
  const created=await request('/employees',{method:'POST',body:employee({hire_date:`${year-1}-12-01`})});assert.equal(created.status,201);let e=created.data;
  const monthly={employee_id:e.id,year:year-1,month:12,gross:'1000000.01',note:'Planilla anterior de prueba'};
  const historical=await request('/salary-history',{method:'POST',body:monthly});assert.equal(historical.status,201);let h=historical.data;
  assert.equal((await request('/salary-history',{method:'POST',body:monthly})).status,409);
  assert.equal((await request('/salary-history',{method:'POST',body:{...monthly,month:11}})).status,400);
  assert.equal((await request('/salary-history',{method:'POST',body:{...monthly,year:Number(todayCR().slice(0,4))+1,month:1}})).status,400);
  assert.equal((await request('/payroll',{method:'POST',body:{year:year-1,month:12,half:1}})).status,409);
  const p=(await request('/payroll',{method:'POST',body:{year,month:1,half:1}})).data;
  const item=(await request(`/payroll/${p.id}`)).data.items[0];
  assert.equal((await request('/salary-history',{method:'POST',body:{...monthly,year,month:1}})).status,409);
  let report=(await request(`/aguinaldo?year=${year}`)).data;
  assert.equal(report.employees[0].gross_cents,'100000001');assert.equal(report.employees[0].missing_halves,22);
  const reviewed=await request(`/payroll/${p.id}/items/${item.id}`,{method:'PUT',body:{revision:item.revision,commissions:'100000',caja:'250000',renta:'50000'}});assert.equal(reviewed.status,200);
  assert.equal((await request(`/payroll/${p.id}/close`,{method:'POST',body:{}})).status,200);
  report=(await request(`/aguinaldo?year=${year}`)).data;
  assert.equal(report.employees[0].gross_cents,'160000001');assert.equal(report.employees[0].aguinaldo_cents,'13333333');assert.equal(report.employees[0].missing_halves,21);
  const changed=await request(`/employees/${e.id}`,{method:'PUT',body:employee({hire_date:e.hire_date,revision:e.revision,monthly_salary:'2500000'})});assert.equal(changed.status,200);e=changed.data;
  assert.equal((await request(`/aguinaldo?year=${year}`)).data.employees[0].gross_cents,'160000001');
  assert.equal((await request(`/salary-history/${h.id}`,{method:'PUT',body:{...monthly,gross:'1200000',revision:0}})).status,409);
  const revised=await request(`/salary-history/${h.id}`,{method:'PUT',body:{...monthly,gross:'1200000',revision:h.revision}});assert.equal(revised.status,200);h=revised.data;
  assert.equal((await request(`/salary-history/${h.id}/cancel`,{method:'POST',body:{revision:h.revision,reason:'Corregir la fuente'}})).status,200);
  assert.equal((await request(`/aguinaldo?year=${year}`)).data.employees[0].gross_cents,'60000000');
  assert.equal((await request(`/salary-history/${h.id}`,{method:'PUT',body:{...monthly,gross:'0',revision:h.revision+1,note:'Mes confirmado sin remuneración'}})).status,200);
  const [histRace,payRace]=await Promise.all([
    request('/salary-history',{method:'POST',body:{...monthly,year,month:2}}),
    request('/payroll',{method:'POST',body:{year,month:2,half:1}})
  ]);
  assert.equal([histRace,payRace].filter(r=>r.status===201).length,1);assert.equal([histRace,payRace].filter(r=>r.status===409).length,1);
  const concurrentPeriod=(await request('/payroll',{method:'POST',body:{year,month:3,half:1}})).data;
  const concurrentItem=(await request(`/payroll/${concurrentPeriod.id}`)).data.items[0];
  const concurrent=await Promise.all([
    request(`/employees/${e.id}`,{method:'PUT',body:employee({hire_date:e.hire_date,revision:e.revision,monthly_salary:'3000000'})}),
    request(`/payroll/${concurrentPeriod.id}/items/${concurrentItem.id}`,{method:'PUT',body:{revision:concurrentItem.revision}}),
    request('/salary-history',{method:'POST',body:{...monthly,year,month:4}})
  ]);
  assert.deepEqual(concurrent.map(r=>r.status),[200,200,201]);
  const audit=(await request('/bootstrap')).data.audit;assert.ok(audit.some(a=>a.entity==='salario_historico'&&a.action==='retirar'));
  // Recrea únicamente la migración nueva en la base temporal, con nómina cerrada ya existente.
  const beforeEmployees=(await instance.pool.query('SELECT * FROM employees ORDER BY id')).rows;
  const beforePayroll=(await instance.pool.query('SELECT * FROM payroll_items ORDER BY id')).rows;
  await instance.pool.query('DROP TABLE salary_history');
  await instance.pool.query("DELETE FROM schema_migrations WHERE name='003-aguinaldo.sql'");
  await migrate(instance.pool);
  assert.deepEqual((await instance.pool.query('SELECT * FROM employees ORDER BY id')).rows,beforeEmployees);
  assert.deepEqual((await instance.pool.query('SELECT * FROM payroll_items ORDER BY id')).rows,beforePayroll);
  assert.equal((await request(`/aguinaldo?year=${year}`)).data.employees[0].gross_cents,'60000000');
});
