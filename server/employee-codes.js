import {AppError} from './domain.js';

// Consultar una sugerencia no consume números. La asignación ocurre al guardar.
export async function nextEmployeeCode(client) {
  const {rows}=await client.query(`
    SELECT GREATEST(last_value,
      (SELECT COALESCE(MAX(CASE WHEN code ~ '^CC[0-9]+$'
        THEN substring(code FROM 3)::numeric ELSE 0 END),0) FROM employees)
    ) AS last_value FROM employee_code_counter WHERE id=1
  `);
  const next=(BigInt(rows[0].last_value)+1n).toString();
  if (next.length>28) throw new AppError('Se alcanzó el límite de la numeración CC. Indique un código manual.',409);
  return 'CC'+next.padStart(4,'0');
}
export async function rememberEmployeeCode(client,code) {
  if (/^CC[0-9]+$/.test(code)) await client.query('UPDATE employee_code_counter SET last_value=GREATEST(last_value,$1::numeric) WHERE id=1',[code.slice(2)]);
}
