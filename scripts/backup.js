import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const url = new URL(process.env.DATABASE_URL);
const directory = resolve(import.meta.dirname, '../backups');
mkdirSync(directory, { recursive: true });
const file = join(directory, `circuito-${new Date().toISOString().replace(/[:.]/g, '-')}.dump`);
const executable = join(process.env.PG_BIN || 'C:/Program Files/PostgreSQL/18/bin', process.platform === 'win32' ? 'pg_dump.exe' : 'pg_dump');
const result = spawnSync(executable, ['--host', url.hostname, '--port', url.port || '5432', '--username', decodeURIComponent(url.username), '--dbname', url.pathname.slice(1), '--format=custom', '--file', file], {
  windowsHide: true, encoding: 'utf8', env: { ...process.env, PGPASSWORD: decodeURIComponent(url.password) }
});
if (result.error || result.status !== 0) { console.error('No se pudo generar la copia:', result.error?.message || result.stderr); process.exitCode = 1; }
else console.log(`Copia guardada: ${file}`);
