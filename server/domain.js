// Fechas civiles: ningún cálculo depende del huso horario del servidor.
export class AppError extends Error {
  constructor(message, status = 400, code = 'INVALID_INPUT', details) {
    super(message); Object.assign(this, { status, code, details });
  }
}
export function todayCR() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Costa_Rica', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}
export function date(value, label = 'Fecha') {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new AppError(`${label}: indique una fecha válida.`);
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(+parsed) || parsed.toISOString().slice(0, 10) !== value || value < '1900-01-01' || value > '2200-12-31') throw new AppError(`${label}: indique una fecha válida.`);
  return value;
}
export function text(value, label, { optional = false, max = 200 } = {}) {
  if (optional && (value === undefined || value === null || value === '')) return '';
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new AppError(`${label}: campo obligatorio, máximo ${max} caracteres.`);
  return value.trim();
}
export function email(value) {
  const result = text(value, 'Correo', { max: 254 }).toLowerCase();
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}$/i.test(result) || result.includes('..')) throw new AppError('Indique un correo electrónico válido.');
  return result;
}
export function money(value, label = 'Monto') {
  const raw = String(value ?? '');
  if (!/^\d{1,10}(\.\d{1,2})?$/.test(raw)) throw new AppError(`${label}: indique un monto positivo con hasta dos decimales, sin separadores de miles.`);
  const [whole, fraction = ''] = raw.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}
export function halfDays(value, label = 'Días') {
  const number = Number(value);
  if (value === '' || value === null || value === undefined || !Number.isFinite(number) || number < 0 || number > 100000 || !Number.isInteger(number * 2)) throw new AppError(`${label}: use días completos o medios días.`);
  return number;
}
export function completeMonths(hireDate, asOf) {
  date(hireDate); date(asOf);
  if (asOf < hireDate) return 0;
  const [hy, hm, hd] = hireDate.split('-').map(Number);
  const [ay, am, ad] = asOf.split('-').map(Number);
  const anniversaryDay = Math.min(hd, new Date(Date.UTC(ay, am, 0)).getUTCDate());
  return (ay - hy) * 12 + am - hm - (ad < anniversaryDay ? 1 : 0);
}
export function workingDays(start, end, holidays = [], halfDay = false) {
  date(start, 'Inicio'); date(end, 'Fin');
  if (end < start) throw new AppError('La fecha final no puede ser anterior a la inicial.');
  if ((+new Date(`${end}T00:00:00Z`) - +new Date(`${start}T00:00:00Z`)) / 86400000 > 730) throw new AppError('El rango no puede superar dos años.');
  if (halfDay && start !== end) throw new AppError('Medio día requiere una única fecha.');
  const excluded = new Set(holidays);
  const entries = [];
  for (const cursor = new Date(`${start}T00:00:00Z`); cursor.toISOString().slice(0, 10) <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const day = cursor.toISOString().slice(0, 10);
    const weekend = cursor.getUTCDay() === 0 || cursor.getUTCDay() === 6;
    const reason = weekend ? 'Fin de semana' : excluded.has(day) ? 'Feriado' : null;
    entries.push({ date: day, days: reason ? 0 : halfDay ? 0.5 : 1, reason });
  }
  return { days: entries.reduce((sum, entry) => sum + entry.days, 0), entries };
}
export function vacationBalance(employee, requests, asOf = todayCR()) {
  date(asOf);
  const accrueUntil = employee.termination_date && employee.termination_date < asOf ? employee.termination_date : asOf;
  const months = completeMonths(employee.hire_date, accrueUntil);
  const historical = employee.historical_cutoff && asOf >= employee.historical_cutoff ? Number(employee.historical_days) : 0;
  let used = 0, reserved = 0;
  for (const request of requests.filter(x => x.employee_id === employee.id && x.status === 'approved')) {
    for (const entry of request.entries) {
      if (entry.date <= asOf) used += Number(entry.days);
      else reserved += Number(entry.days);
    }
  }
  // 14/12 se aplica al total de meses, nunca se redondea la tasa mensual.
  const accrued = months * 14 / 12;
  return { months, accrued, historical, used, reserved, balance: accrued - historical - used, available: accrued - historical - used - reserved };
}
export function payPeriod(year, month, half) {
  year = Number(year); month = Number(month); half = Number(half);
  if (!Number.isInteger(year) || year < 2000 || year > 2200 || !Number.isInteger(month) || month < 1 || month > 12 || ![1, 2].includes(half)) throw new AppError('Periodo de pago inválido.');
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return { start: `${prefix}-${half === 1 ? '01' : '16'}`, end: `${prefix}-${half === 1 ? '15' : new Date(Date.UTC(year, month, 0)).getUTCDate()}`, year, month, half };
}
export function payrollAmounts(salaryCents, inputs, half = 1, {deferNetValidation=false} = {}) {
  // Un céntimo impar se asigna a la primera quincena; ambas suman el mes exacto.
  const automatic = half === 2 ? Math.floor(Number(salaryCents) / 2) : Math.ceil(Number(salaryCents) / 2);
  const base = inputs.base_override === '' || inputs.base_override == null ? automatic : money(inputs.base_override, 'Salario ajustado');
  const adjustmentReason = text(inputs.adjustment_reason, 'Motivo del ajuste', { optional: base === automatic, max: 1000 });
  const commissions = money(inputs.commissions ?? 0, 'Comisiones');
  const caja = money(inputs.caja ?? 0, 'Caja');
  const renta = money(inputs.renta ?? 0, 'Renta');
  const loan = money(inputs.loan ?? 0, 'Préstamo');
  const other = money(inputs.other ?? 0, 'Otras deducciones');
  const otherReason = text(inputs.other_reason, 'Detalle de otras deducciones', { optional: other === 0, max: 1000 });
  const gross = base + commissions;
  const deductions = caja + renta + loan + other;
  if (!deferNetValidation && deductions > gross) throw new AppError('Las deducciones no pueden superar los ingresos de esta quincena.');
  return { automatic, base, commissions, caja, renta, loan, other, gross, deductions, net: gross - deductions, adjustment_reason: adjustmentReason, other_reason: otherReason };
}
