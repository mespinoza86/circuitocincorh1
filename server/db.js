import pg from 'pg';
import { readFile, readdir } from 'node:fs/promises';

pg.types.setTypeParser(1082, value => value); // DATE permanece YYYY-MM-DD.
export function makePool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error('Falta DATABASE_URL. Ejecute npm run setup:local o configure .env.');
  const pool = new pg.Pool({ connectionString, max: 10, connectionTimeoutMillis: 5000 });
  pool.on('error', error => console.error('Conexión PostgreSQL:', error.code ?? error.name));
  return pool;
}
export async function transaction(pool, operation) {
  const client = await pool.connect();
  try { await client.query('BEGIN'); const value = await operation(client); await client.query('COMMIT'); return value; }
  catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
export async function migrate(pool) {
  await transaction(pool, async client => {
    await client.query('SELECT pg_advisory_xact_lock(74210615)');
    await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
    for (const name of (await readdir(new URL('../db/', import.meta.url))).filter(x => x.endsWith('.sql')).sort()) {
      const found = await client.query('SELECT 1 FROM schema_migrations WHERE name=$1', [name]);
      if (found.rowCount) continue;
      await client.query(await readFile(new URL(`../db/${name}`, import.meta.url), 'utf8'));
      await client.query('INSERT INTO schema_migrations(name) VALUES($1)', [name]);
    }
  });
}
export async function audit(client, actor, action, entity, id, before = null, after = null) {
  await client.query('INSERT INTO audit_log(actor_id,action,entity,entity_id,before_data,after_data) VALUES($1,$2,$3,$4,$5,$6)', [actor, action, entity, String(id), before, after]);
}
