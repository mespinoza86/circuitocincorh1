import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { randomBytes } from 'node:crypto';
import pg from 'pg';

const root = resolve(import.meta.dirname, '..');
const local = join(root, '.local');
const cluster = join(local, 'postgres');
const envPath = join(root, '.env');
if (existsSync(envPath)) process.loadEnvFile(envPath);
const bin = process.env.PG_BIN || 'C:/Program Files/PostgreSQL/18/bin';
const executable = name => join(bin, `${name}${process.platform === 'win32' ? '.exe' : ''}`);
function run(name, args, quiet = false) {
  // pg_ctl deja PostgreSQL en segundo plano: no heredar pipes que impidan finalizar.
  const result = spawnSync(executable(name), args, { encoding: 'utf8', windowsHide: true, stdio: name === 'pg_ctl' ? 'ignore' : 'pipe' });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr || result.stdout || `${name} falló.`);
  if (!quiet && result.stdout) console.log(result.stdout.trim());
}
function running() {
  return spawnSync(executable('pg_ctl'), ['status', '-D', cluster], { windowsHide: true, stdio: 'ignore' }).status === 0;
}
function start() {
  if (!existsSync(join(cluster, 'PG_VERSION'))) throw new Error('Primero ejecute npm run setup:local.');
  if (!running()) run('pg_ctl', ['start', '-D', cluster, '-l', join(local, 'postgres.log'), '-w'], true);
  console.log('PostgreSQL del proyecto disponible en 127.0.0.1:55432.');
}
const action = process.argv[2] || 'setup';
try {
  if (action === 'stop') {
    if (existsSync(cluster) && running()) run('pg_ctl', ['stop', '-D', cluster, '-m', 'fast', '-w'], true);
    console.log('PostgreSQL del proyecto detenido.');
  } else if (action === 'start') start();
  else if (action === 'setup') {
    if (existsSync(envPath)) {
      const current = new URL(process.env.DATABASE_URL);
      if (current.hostname !== '127.0.0.1' || current.port !== '55432' || current.pathname !== '/circuito_rrhh') throw new Error('Ya existe una configuración distinta en .env; no se modificó. Use npm run db:migrate con su servidor.');
      start();
      console.log('Se conservó la configuración existente.');
    } else {
      if (existsSync(join(cluster, 'PG_VERSION'))) throw new Error('Existe un clúster sin .env. Restaure su .env; no se sobrescribió ningún dato.');
      if (!existsSync(executable('initdb'))) throw new Error(`No se encontró PostgreSQL en ${bin}. Configure PG_BIN.`);
      mkdirSync(local, { recursive: true });
      const ownerPassword = randomBytes(32).toString('hex');
      const appPassword = randomBytes(32).toString('hex');
      const passwordFile = join(local, 'init-password.tmp');
      writeFileSync(passwordFile, ownerPassword, { mode: 0o600 });
      try { run('initdb', ['-D', cluster, '-U', 'circuito_owner', '--pwfile', passwordFile, '--auth-host=scram-sha-256', '--auth-local=scram-sha-256', '--encoding=UTF8', '--locale=C'], true); }
      finally { if (existsSync(passwordFile)) unlinkSync(passwordFile); }
      writeFileSync(join(cluster, 'postgresql.auto.conf'), "listen_addresses = '127.0.0.1'\nport = 55432\ntimezone = 'America/Costa_Rica'\n");
      start();
      const owner = new pg.Client({ host: '127.0.0.1', port: 55432, user: 'circuito_owner', password: ownerPassword, database: 'postgres' });
      try {
        await owner.connect();
        await owner.query(`CREATE ROLE circuito_app WITH LOGIN CREATEDB PASSWORD '${appPassword}'`);
        await owner.query('CREATE DATABASE circuito_rrhh OWNER circuito_app');
      } finally { await owner.end(); }
      const example = readFileSync(join(root, '.env.example'), 'utf8');
      writeFileSync(envPath, example.replace('CAMBIAR', appPassword).replace('C:/Program Files/PostgreSQL/18/bin', bin.replaceAll('\\', '/')), { mode: 0o600 });
      console.log('Base circuito_rrhh creada. Credenciales locales guardadas en .env, excluido de Git.');
    }
  } else throw new Error('Acción desconocida. Use setup, start o stop.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
