import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {join,resolve} from 'node:path';
import {testServer,admin,employee} from './helpers.js';
import {makePool} from '../server/db.js';

test('pg_dump y pg_restore recuperan estructura y datos en una base aislada',async()=> {
  const instance=await testServer();
  const source=new URL(instance.connectionString);
  const restoredName=`circuito_test_restore_${randomUUID().replaceAll('-','')}`;
  const target=new URL(source);target.pathname=`/${restoredName}`;
  let restored;
  const bin=process.env.PG_BIN || 'C:/Program Files/PostgreSQL/18/bin';
  const executable=name=>join(bin,process.platform==='win32'?`${name}.exe`:name);
  const directory=resolve('test-results');mkdirSync(directory,{recursive:true});const dump=join(directory,'restore-test.dump');
  const args=['--host',source.hostname,'--port',source.port,'--username',decodeURIComponent(source.username)];
  const options={encoding:'utf8',windowsHide:true,env:{...process.env,PGPASSWORD:decodeURIComponent(source.password)}};
  try {
    const setup=await fetch(instance.base+'/api/auth/setup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(admin)});assert.equal(setup.status,201);
    const session=setup.headers.get('set-cookie').split(';')[0],csrf=(await setup.json()).csrf;
    const headers={'Content-Type':'application/json',cookie:session,'X-CSRF-Token':csrf};
    const created=await fetch(instance.base+'/api/employees',{method:'POST',headers,body:JSON.stringify(employee({code:'CC0001'}))});assert.equal(created.status,201);
    const worker=await created.json();
    const historical=await fetch(instance.base+'/api/salary-history',{method:'POST',headers,body:JSON.stringify({employee_id:worker.id,year:2025,month:9,gross:'1200000.01',note:'Histórico restaurado de prueba'})});assert.equal(historical.status,201);
    async function operation(path,method='GET',body,status=200){const response=await fetch(instance.base+'/api'+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});const data=await response.json();assert.equal(response.status,status,JSON.stringify(data));return data;}
    await operation('/deduction-settings','POST',{revision:1,effective_from:'2026-10-01',worker_rate:'10.83',employer_rate:'26.83',enabled:true,note:'Reglas restauradas de prueba',brackets:[{up_to:'918000',rate:0},{up_to:'1347000',rate:10},{up_to:'2364000',rate:15},{up_to:'4727000',rate:20},{up_to:'',rate:25}]},201);
    async function periodPayment(month,half,data){const p=await operation('/payroll','POST',{year:2026,month,half},201),i=(await operation(`/payroll/${p.id}`)).items[0];const preview=await operation(`/payroll/${p.id}/items/${i.id}/deduction-preview`,'POST',data);const saved=await operation(`/payroll/${p.id}/items/${i.id}`,'PUT',{...data,revision:i.revision,deduction_review:preview.review});await operation(`/payroll/${p.id}/close`,'POST',{});return saved;}
    await periodPayment(11,1,{commissions:'800000'});
    const refunded=await periodPayment(11,2,{base_override:'250000',adjustment_reason:'Salario ajustado de prueba',confirm_tax_adjustment:true,tax_adjustment_note:'Conciliación restaurada'});assert.equal(refunded.tax_refund_cents,'3750000');
    await periodPayment(12,1,{commissions:'800000'});
    await operation(`/employees/${worker.id}`,'PUT',employee({code:'CC0001',revision:worker.revision,active:false,termination_date:'2026-12-15'}));
    const proposed=await operation('/tax-adjustments','POST',{employee_id:worker.id,year:2026,month:12,reason:'Salida registrada para restauración'},201);
    await operation(`/tax-adjustments/${proposed.id}/apply`,'POST',{revision:1,confirm:true,reference:'Aplicación y revisión contable ficticias'});
    await instance.pool.query("UPDATE company SET name='Empresa restaurada de prueba',legal_id='3-101-123456' WHERE id=1");
    await instance.pool.query("INSERT INTO holidays(id,day,name) VALUES($1,'2027-05-01','Feriado restaurado')",[randomUUID()]);
    await instance.pool.query('UPDATE employee_code_counter SET last_value=42 WHERE id=1');
    const migrationCount=(await instance.pool.query('SELECT COUNT(*)::int AS total FROM schema_migrations')).rows[0].total;
    const backup=spawnSync(executable('pg_dump'),[...args,'--dbname',source.pathname.slice(1),'--format=custom','--file',dump],options);
    assert.equal(backup.status,0,backup.stderr || backup.error?.message);
    await instance.pool.query(`CREATE DATABASE "${restoredName}"`);
    restored=makePool(target.toString());
    const restore=spawnSync(executable('pg_restore'),[...args,'--dbname',restoredName,'--no-owner','--no-privileges','--exit-on-error',dump],options);
    assert.equal(restore.status,0,restore.stderr || restore.error?.message);
    const company=(await restored.query('SELECT * FROM company')).rows[0];assert.equal(company.name,'Empresa restaurada de prueba');
    assert.equal((await restored.query('SELECT COUNT(*)::int AS total FROM holidays')).rows[0].total,1);
    assert.equal((await restored.query('SELECT COUNT(*)::int AS total FROM schema_migrations')).rows[0].total,migrationCount);
    assert.equal((await restored.query('SELECT last_value FROM employee_code_counter WHERE id=1')).rows[0].last_value,'42');
    const salary=(await restored.query('SELECT * FROM salary_history')).rows[0];
    assert.equal(salary.employee_id,worker.id);assert.equal(salary.gross_cents,'120000001');assert.equal(salary.active,true);assert.equal(salary.note,'Histórico restaurado de prueba');
    const payment=(await restored.query('SELECT * FROM payroll_items WHERE id=$1',[refunded.id])).rows[0];assert.equal(payment.tax_refund_cents,'3750000');assert.deepEqual(payment.deduction_snapshot,refunded.deduction_snapshot);assert.equal(payment.employer_cents,refunded.employer_cents);
    assert.equal((await restored.query('SELECT enabled FROM deduction_control WHERE id=1')).rows[0].enabled,true);
    assert.equal((await restored.query('SELECT note FROM deduction_rules')).rows[0].note,'Reglas restauradas de prueba');
    const adjustment=(await restored.query('SELECT * FROM tax_adjustments WHERE id=$1',[proposed.id])).rows[0];assert.equal(adjustment.status,'applied');assert.equal(adjustment.delta_cents,proposed.delta_cents);assert.equal(adjustment.reference,'Aplicación y revisión contable ficticias');
  }finally {
    if(restored){await restored.end();await instance.pool.query(`DROP DATABASE "${restoredName}"`);}
    await instance.close();
  }
});
