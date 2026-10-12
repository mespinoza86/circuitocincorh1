import { randomUUID } from 'node:crypto';
import { makePool, migrate } from '../server/db.js';
import { createApp } from '../server/app.js';

export async function testServer() {
  const original=new URL(process.env.DATABASE_URL);
  if (!['127.0.0.1','localhost'].includes(original.hostname) || original.port!=='55432' || original.pathname!=='/circuito_rrhh') throw new Error('Las pruebas de integración requieren el PostgreSQL aislado creado por setup:local.');
  const database=`circuito_test_${randomUUID().replaceAll('-','')}`;
  const owner=makePool(original.toString());
  await owner.query(`CREATE DATABASE "${database}"`);
  const url=new URL(original);url.pathname=`/${database}`;
  const pool=makePool(url.toString());
  let server;
  try {
    await migrate(pool);server=createApp(pool).listen(0,'127.0.0.1');
    await new Promise((resolve,reject)=>{server.once('listening',resolve);server.once('error',reject);});
    const base=`http://127.0.0.1:${server.address().port}`;
    process.env.APP_ORIGIN=base;
    return {pool,base,connectionString:url.toString(),async close(){await new Promise(resolve=>server.close(resolve));await pool.end();await owner.query(`DROP DATABASE "${database}"`);await owner.end();}};
  }catch(e){if(server)await new Promise(resolve=>server.close(resolve));await pool.end();await owner.query(`DROP DATABASE "${database}"`);await owner.end();throw e;}
}
export const admin={name:'Administrador de prueba',email:'admin@example.test',password:'Contraseña-segura-1234',company_name:'Empresa de prueba'};
export function employee(overrides={}) {
  return {code:'EMP-001',full_name:'Persona de Prueba',national_id:'1-1111-1111',email:'persona@example.test',hire_date:'2020-06-16',birth_date:'1990-01-15',position:'Ventas',department:'Comercial',phone:'8888-8888',monthly_salary:'1000000',active:true,historical_days:0,historical_cutoff:'',historical_note:'',notes:'',...overrides};
}
