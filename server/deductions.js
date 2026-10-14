import {AppError,money,date,payPeriod} from './domain.js';

export function percentage(value,label) {
  const bp=money(value,label);
  if(bp>10000)throw new AppError(`${label}: use un porcentaje entre 0 y 100.`);
  return bp;
}
export function parseBrackets(value) {
  if(!Array.isArray(value)||value.length<2||value.length>20)throw new AppError('Ingrese entre 2 y 20 tramos, incluido el exento y el último sin límite.');
  let previous=0,previousRate=0;
  return value.map((row,index)=> {
    const rate=percentage(row.rate,'Porcentaje del tramo');
    if(rate<previousRate)throw new AppError('Los porcentajes de los tramos deben ser progresivos.');previousRate=rate;
    const end=row.up_to===''||row.up_to===null?null:money(row.up_to,'Límite del tramo');
    if(index===0&&rate!==0)throw new AppError('El primer tramo debe ser exento (0 %).');
    if(index===value.length-1?end!==null:end===null||end<=previous)throw new AppError('Los límites deben aumentar y únicamente el último tramo queda sin límite.');
    const result={from_cents:previous,up_to_cents:end,rate_bp:rate};previous=end;return result;
  });
}
export function percentageAmount(cents,bp) {return Number((BigInt(cents)*BigInt(bp)+5000n)/10000n);}
export function incomeTax(cents,brackets) {
  let numerator=0n;const detail=[];
  for(const row of brackets) {
    const base=Math.max(0,Math.min(cents,row.up_to_cents??cents)-row.from_cents);
    numerator+=BigInt(base)*BigInt(row.rate_bp);
    detail.push({...row,base_cents:base});
  }
  return {tax_cents:Number((numerator+5000n)/10000n),detail};
}
export function exceptionInput(body) {
  if(!body.exception_reason&&!body.exception_start&&!body.exception_end&&!body.exception_reference)return null;
  const reason=String(body.exception_reason||'').trim(),reference=String(body.exception_reference||'').trim();
  if(!reason||reason.length>1000||!reference||reference.length>200)throw new AppError('La excepción necesita motivo y referencia.');
  const start=date(body.exception_start,'Inicio de excepción'),end=date(body.exception_end,'Fin de excepción');
  if(end<start)throw new AppError('La fecha final de la excepción no puede ser anterior a su inicio.');
  return {reason,reference,start,end};
}
export function automaticDeductions(rule,employee,period,amounts,first=null,alreadyAdjusted=0) {
  if(period.half===2&&amounts.commissions!==0)throw new AppError('Las comisiones se registran en la primera quincena.');
  const expectedSecond=employee.termination_date&&employee.termination_date<payPeriod(period.year,period.month,2).start?0:Math.floor(Number(employee.monthly_salary_cents)/2);
  const monthly=period.half===1?amounts.gross+expectedSecond:amounts.gross+Number(first.gross_cents);
  const taxRule=period.half===2?(first.deduction_snapshot?.rule||rule):rule;
  const tax=incomeTax(monthly,taxRule.brackets);
  const retained=period.half===1?0:Number(first.renta_cents)-Number(first.tax_refund_cents||0)+alreadyAdjusted;
  const difference=tax.tax_cents-retained;
  return {caja:percentageAmount(amounts.gross,rule.worker_bp),employer:percentageAmount(amounts.gross,rule.employer_bp),
    renta:Math.max(0,difference),refund:Math.max(0,-difference),snapshot:{rule,tax_rule:taxRule,monthly_gross_cents:monthly,monthly_tax_cents:tax.tax_cents,retained_cents:retained,difference_cents:difference,expected_second_cents:period.half===1?expectedSecond:null,first_item_id:first?.id||null,first_revision:first?.revision||null,detail:tax.detail}};
}
export async function ruleFor(client,start) {
  const rule=(await client.query('SELECT * FROM deduction_rules WHERE effective_from<=$1 ORDER BY effective_from DESC,version DESC LIMIT 1',[start])).rows[0];
  if(!rule)throw new AppError('Configure los porcentajes y tramos vigentes antes de calcular las deducciones.',409,'DEDUCTIONS_NOT_CONFIGURED');
  if(rule.effective_from.slice(0,4)!==start.slice(0,4))throw new AppError('Confirme una configuración de renta para el año de esta nómina. No se reutiliza automáticamente la tabla de otro año.',409,'DEDUCTIONS_NOT_CONFIGURED');
  return {id:rule.id,version:rule.version,effective_from:rule.effective_from,worker_bp:rule.worker_bp,employer_bp:rule.employer_bp,brackets:rule.brackets};
}
export function deductionReview(calculation,employee,amounts) {
  return {employee_revision:employee.revision,rule_id:calculation.snapshot.rule.id,first_item_id:calculation.snapshot.first_item_id,first_revision:calculation.snapshot.first_revision,
    monthly_gross_cents:calculation.snapshot.monthly_gross_cents,monthly_tax_cents:calculation.snapshot.monthly_tax_cents,retained_cents:calculation.snapshot.retained_cents,
    gross_cents:amounts.gross,caja:calculation.caja,renta:calculation.renta,refund:calculation.refund,employer:calculation.employer,
    net:amounts.gross+calculation.refund-amounts.loan-amounts.other-calculation.caja-calculation.renta};
}
export async function calculateFor(client,employee,period,amounts,{simulation=false}={}) {
  const rule=await ruleFor(client,period.start_date);
  let first=null,applied=0;
  if(period.half===2) {
    first=(await client.query("SELECT i.*,p.status,p.deduction_mode FROM payroll_items i JOIN payroll_periods p ON p.id=i.period_id WHERE i.employee_id=$1 AND p.year=$2 AND p.month=$3 AND p.half=1",[employee.id,period.year,period.month])).rows[0];
    if(!first&&employee.hire_date>=payPeriod(period.year,period.month,2).start)first={gross_cents:0,renta_cents:0,tax_refund_cents:0,revision:0,status:'closed',deduction_mode:'automatic'};
    if(!first||(!simulation&&first.status!=='closed')||(!simulation&&first.deduction_mode!=='automatic'))throw new AppError('Primero cierre y revise la primera quincena del mismo mes. Para cálculo oficial debe ser automática.',409,'FIRST_HALF_REQUIRED');
    applied=Number((await client.query("SELECT COALESCE(SUM(delta_cents),0) AS total FROM tax_adjustments WHERE employee_id=$1 AND year=$2 AND month=$3 AND status='applied'",[employee.id,period.year,period.month])).rows[0].total);
  }
  return automaticDeductions(rule,employee,period,amounts,first,applied);
}
