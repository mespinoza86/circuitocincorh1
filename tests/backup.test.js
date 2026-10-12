import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {join,resolve} from 'node:path';
import {testServer} from './helpers.js';
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
  }finally {
    if(restored){await restored.end();await instance.pool.query(`DROP DATABASE "${restoredName}"`);}
    await instance.close();
  }
});
