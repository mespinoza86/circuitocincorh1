import {test} from 'node:test';
import assert from 'node:assert/strict';
import {testServer,admin,employee} from './helpers.js';
import {todayCR} from '../server/domain.js';
import {migrate} from '../server/db.js';

test('códigos CC sugeridos, editables, persistentes y sin duplicados concurrentes',async t=> {
  const instance=await testServer();t.after(()=>instance.close());
  let cookie='',csrf='';
  async function request(path,{method='GET',body,auth=true}={}) {
    const response=await fetch(instance.base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(auth?{cookie,'X-CSRF-Token':csrf}:{})},body:body===undefined?undefined:JSON.stringify(body)});
    const set=response.headers.get('set-cookie');if(set)cookie=set.split(';')[0];
    return {status:response.status,data:await response.json()};
  }
  let first,highest;
  await t.test('consulta protegida, primera sugerencia y cancelación sin consumir códigos',async()=> {
    assert.equal((await request('/employees/next-code',{auth:false})).status,401);
    const setup=await request('/auth/setup',{method:'POST',body:admin});assert.equal(setup.status,201);csrf=setup.data.csrf;
    assert.equal((await request('/employees/next-code')).data.code,'CC0001');
    assert.equal((await request('/employees/next-code')).data.code,'CC0001');
    const manual=await request('/employees',{method:'POST',body:employee({code:'PERSONAL-A',national_id:'1-1000-0001'})});assert.equal(manual.status,201);assert.equal(manual.data.code,'PERSONAL-A');
    assert.equal((await request('/employees/next-code')).data.code,'CC0001');
  });
  await t.test('guardar sugerencia avanza; un error no consume la siguiente',async()=> {
    const saved=await request('/employees',{method:'POST',body:employee({code:'CC0001',use_suggested_code:true})});assert.equal(saved.status,201);first=saved.data;assert.equal(first.code,'CC0001');
    assert.equal((await request('/employees/next-code')).data.code,'CC0002');
    const failed=await request('/employees',{method:'POST',body:employee({code:'CC0002',use_suggested_code:true})});assert.equal(failed.status,409); // cédula duplicada
    assert.equal((await request('/employees/next-code')).data.code,'CC0002');
    const duplicate=await request('/employees',{method:'POST',body:employee({code:'CC0001',national_id:'2-2000-0001'})});assert.equal(duplicate.status,409);assert.equal(duplicate.data.code,'EMPLOYEE_CODE_EXISTS');
  });
  await t.test('código manual superior e inactivo avanzan; editarlo no retrocede',async()=> {
    const saved=await request('/employees',{method:'POST',body:employee({code:'CC0042',national_id:'4-4000-0001',active:false,termination_date:todayCR()})});assert.equal(saved.status,201);highest=saved.data;
    assert.equal((await request('/employees/next-code')).data.code,'CC0043');
    const edited=await request(`/employees/${highest.id}`,{method:'PUT',body:employee({code:'ESPECIAL-42',national_id:highest.national_id,active:false,termination_date:todayCR(),revision:highest.revision})});assert.equal(edited.status,200);
    assert.equal((await request('/employees/next-code')).data.code,'CC0043');
  });
  await t.test('dos administradores con la misma sugerencia obtienen códigos consecutivos',async()=> {
    const suggested=(await request('/employees/next-code')).data.code;
    const results=await Promise.all([1,2].map(i=>request('/employees',{method:'POST',body:employee({code:suggested,use_suggested_code:true,national_id:`5-5000-000${i}`})})));
    assert.deepEqual(results.map(r=>r.status),[201,201]);assert.deepEqual(results.map(r=>r.data.code).sort(),['CC0043','CC0044']);
    assert.equal((await request('/employees/next-code')).data.code,'CC0045');
  });
  await t.test('la serie continúa después de cuatro dígitos',async()=> {
    const saved=await request('/employees',{method:'POST',body:employee({code:'CC9999',national_id:'9-9000-0001'})});assert.equal(saved.status,201);
    assert.equal((await request('/employees/next-code')).data.code,'CC10000');
    const next=await request('/employees',{method:'POST',body:employee({code:'CC10000',use_suggested_code:true,national_id:'9-9000-0002'})});assert.equal(next.status,201);assert.equal(next.data.code,'CC10000');
  });
  await t.test('migración recupera el avance del historial y conserva los perfiles',async()=> {
    const before=(await instance.pool.query('SELECT id,code FROM employees ORDER BY id')).rows;
    const actor=(await instance.pool.query('SELECT id FROM users LIMIT 1')).rows[0].id;
    await instance.pool.query("INSERT INTO audit_log(actor_id,action,entity,entity_id,before_data,after_data) VALUES($1,'editar','empleado',$2,$3,$4)",[actor,first.id,{code:'CC20000'},{code:first.code}]);
    // Reconstruir exclusivamente en la base temporal para probar una actualización.
    await instance.pool.query('DROP TABLE employee_code_counter');
    await instance.pool.query("DELETE FROM schema_migrations WHERE name='002-employee-codes.sql'");
    await migrate(instance.pool);
    assert.equal((await request('/employees/next-code')).data.code,'CC20001');
    assert.deepEqual((await instance.pool.query('SELECT id,code FROM employees ORDER BY id')).rows,before);
  });
});
