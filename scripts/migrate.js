import { makePool, migrate } from '../server/db.js';
const pool = makePool();
try { await migrate(pool); console.log('Base de datos actualizada.'); }
finally { await pool.end(); }
