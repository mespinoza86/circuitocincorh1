import { makePool, migrate } from './db.js';
import { createApp } from './app.js';

const pool=makePool();
try {
  await migrate(pool);
  const host=process.env.HOST || '127.0.0.1'; const port=Number(process.env.PORT || 3000);
  const server=createApp(pool).listen(port,host,()=>console.log(`Circuito RRHH disponible en http://${host}:${port}`));
  server.on('error',async error=> {console.error('No se pudo iniciar:',error.message);await pool.end();process.exitCode=1;});
  const close=()=>server.close(async()=> {await pool.end();process.exit(0);});
  process.on('SIGINT',close);process.on('SIGTERM',close);
} catch(error) {console.error('No se pudo conectar o preparar PostgreSQL:',error.message);await pool.end();process.exitCode=1;}
