import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { rateLimit } from 'express-rate-limit';
import { AppError, email, text } from './domain.js';
import { transaction, audit } from './db.js';

const scrypt = promisify(scryptCallback);
const digest = token => createHash('sha256').update(token).digest('hex');
export async function passwordHash(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) throw new AppError('La contraseña debe tener entre 12 y 128 caracteres.');
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt:${salt}:${hash.toString('hex')}`;
}
async function verify(password, stored) {
  if (typeof password !== 'string' || password.length > 128) return false;
  const [, salt, hash] = stored.split(':');
  const result = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return timingSafeEqual(result, Buffer.from(hash, 'hex'));
}
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, employee_id: user.employee_id, active: user.active, must_change_password: user.must_change_password };
}
function tokenFrom(req) {
  return req.headers.cookie?.split(';').map(x => x.trim()).find(x => x.startsWith('circuito_session='))?.slice('circuito_session='.length);
}
function setCookie(res, token) {
  res.cookie('circuito_session', token, { httpOnly: true, sameSite: 'strict', secure: process.env.COOKIE_SECURE === 'true', maxAge: 8 * 60 * 60 * 1000, path: '/' });
}
export async function createSession(client, userId, res) {
  const token = randomBytes(32).toString('hex');
  const csrf = randomBytes(32).toString('hex');
  await client.query("DELETE FROM sessions WHERE expires_at < now()");
  await client.query("INSERT INTO sessions(token_hash,user_id,csrf_token,expires_at) VALUES($1,$2,$3,now()+interval '8 hours')", [digest(token), userId, csrf]);
  setCookie(res, token);
  return csrf;
}
export function installAuth(app, pool) {
  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Demasiados intentos. Intente de nuevo en unos minutos.' } });
  app.use('/api', async (req, res, next) => {
    const token = tokenFrom(req);
    if (token && /^[a-f0-9]{64}$/.test(token)) {
      const result = await pool.query('SELECT u.*,s.csrf_token FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now() AND u.active=true', [digest(token)]);
      req.user = result.rows[0]; req.tokenHash = digest(token);
    }
    next();
  });
  app.get('/api/auth/status', async (req, res) => {
    const { rows } = await pool.query('SELECT EXISTS(SELECT 1 FROM users) AS initialized');
    res.json({ initialized: rows[0].initialized, user: req.user ? publicUser(req.user) : null, csrf: req.user?.csrf_token ?? null });
  });
  app.post('/api/auth/setup', limiter, async (req, res) => {
    // Primer administrador solo desde la propia máquina, incluso si se sirve en una red.
    if (!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) throw new AppError('La configuración inicial debe hacerse desde la computadora del servidor.', 403);
    const name = text(req.body.name, 'Nombre'); const userEmail = email(req.body.email);
    const hash = await passwordHash(req.body.password);
    const result = await transaction(pool, async client => {
      await client.query('SELECT pg_advisory_xact_lock(74210616)');
      if ((await client.query('SELECT 1 FROM users LIMIT 1')).rowCount) throw new AppError('La cuenta inicial ya existe.', 409);
      const id = randomUUID();
      const user = (await client.query("INSERT INTO users(id,name,email,password_hash,role) VALUES($1,$2,$3,$4,'admin') RETURNING *", [id,name,userEmail,hash])).rows[0];
      await client.query('UPDATE company SET name=$1 WHERE id=1', [text(req.body.company_name, 'Empresa')]);
      await audit(client, id, 'crear', 'cuenta', id, null, publicUser(user));
      const csrf = await createSession(client, id, res);
      return { user: publicUser(user), csrf };
    });
    res.status(201).json(result);
  });
  app.post('/api/auth/login', limiter, async (req, res) => {
    const userEmail = email(req.body.email);
    const user = (await pool.query('SELECT * FROM users WHERE email=$1', [userEmail])).rows[0];
    const dummy = 'scrypt:00000000000000000000000000000000:' + '00'.repeat(64);
    const matches = await verify(req.body.password, user?.password_hash ?? dummy);
    if (!user || !user.active || !matches) throw new AppError('Correo o contraseña incorrectos.', 401);
    const csrf = await transaction(pool, async client => {
      await audit(client, user.id, 'ingresar', 'cuenta', user.id);
      return createSession(client, user.id, res);
    });
    res.json({ user: publicUser(user), csrf });
  });
  app.use('/api', (req, res, next) => {
    if (!req.user) throw new AppError('Inicie sesión para continuar.', 401);
    if (!['GET','HEAD','OPTIONS'].includes(req.method) && req.headers['x-csrf-token'] !== req.user.csrf_token) throw new AppError('La sesión no permite esta operación. Recargue la página.', 403);
    if (req.user.must_change_password && !['/auth/password','/auth/logout'].includes(req.path)) throw new AppError('Debe cambiar su contraseña temporal.', 403, 'PASSWORD_CHANGE_REQUIRED');
    next();
  });
  app.post('/api/auth/logout', async (req, res) => {
    await pool.query('DELETE FROM sessions WHERE token_hash=$1', [req.tokenHash]);
    res.clearCookie('circuito_session', { path: '/', sameSite: 'strict', secure: process.env.COOKIE_SECURE === 'true' });
    res.json({ ok: true });
  });
  app.post('/api/auth/password', async (req, res) => {
    if (!await verify(req.body.current_password, req.user.password_hash)) throw new AppError('La contraseña actual no es correcta.');
    const hash = await passwordHash(req.body.password);
    const csrf = await transaction(pool, async client => {
      await client.query('UPDATE users SET password_hash=$1,must_change_password=false WHERE id=$2', [hash,req.user.id]);
      await client.query('DELETE FROM sessions WHERE user_id=$1', [req.user.id]);
      await audit(client, req.user.id, 'cambiar_contraseña', 'cuenta', req.user.id);
      return createSession(client, req.user.id, res);
    });
    res.json({ csrf });
  });
}
export function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') throw new AppError('Esta función requiere una cuenta de administrador.', 403);
  next();
}
export { publicUser };
