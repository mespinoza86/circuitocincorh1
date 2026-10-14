import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseBrackets,percentage,incomeTax,automaticDeductions,percentageAmount,exceptionInput} from '../server/deductions.js';
const brackets=parseBrackets([{up_to:'918000',rate:'0'},{up_to:'1347000',rate:'10'},{up_to:'2364000',rate:'15'},{up_to:'4727000',rate:'20'},{up_to:'',rate:'25'}]);
const rule={id:'rule',worker_bp:1083,employer_bp:2683,brackets};
test('renta progresiva: umbrales y ejemplo mensual 1.400.000',()=> {
  for(const [gross,tax] of [[91800000,0],[120000000,2820000],[134700000,4290000],[140000000,5085000],[236400000,19545000],[472700000,66805000]])assert.equal(incomeTax(gross,brackets).tax_cents,tax);
});
test('porcentajes y tramos rechazan cifras, límites y orden inválidos',()=> {
  assert.equal(percentage('10.83','Caja'),1083);assert.equal(percentageAmount(110000000,1083),11913000);
  assert.throws(()=>percentage('100.01','Caja'));assert.throws(()=>percentage('-1','Caja'));
  assert.throws(()=>parseBrackets([{up_to:'100',rate:10},{up_to:'',rate:20}]));
  assert.throws(()=>parseBrackets([{up_to:'100',rate:0},{up_to:'90',rate:10},{up_to:'',rate:20}]));
  assert.throws(()=>parseBrackets([{up_to:'100',rate:0},{up_to:'200',rate:10}]));
  assert.throws(()=>parseBrackets([{up_to:'100',rate:0},{up_to:'200',rate:20},{up_to:'',rate:10}]));
});
test('primera retiene mensual; segunda concilia con devolución separada del salario',()=> {
  const employee={monthly_salary_cents:60000000};
  const first=automaticDeductions(rule,employee,{year:2026,month:11,half:1},{gross:110000000,commissions:80000000});
  assert.equal(first.renta,5085000);assert.equal(first.refund,0);assert.equal(first.employer,29513000);
  const paid={id:'first',revision:2,gross_cents:110000000,renta_cents:first.renta,tax_refund_cents:0,deduction_snapshot:first.snapshot};
  const second=automaticDeductions(rule,employee,{year:2026,month:11,half:2},{gross:15000000,commissions:0},paid);
  assert.equal(second.refund,1765000);assert.equal(second.renta,0);assert.equal(second.snapshot.monthly_gross_cents,125000000);
  assert.equal(second.caja,1624500);assert.equal(second.employer,4024500);
  assert.equal(automaticDeductions(rule,employee,{year:2026,month:11,half:2},{gross:30000000,commissions:0},paid).snapshot.difference_cents,0);
  assert.ok(automaticDeductions(rule,employee,{year:2026,month:11,half:2},{gross:50000000,commissions:0},paid).renta>0);
  assert.throws(()=>automaticDeductions(rule,employee,{year:2026,month:11,half:2},{gross:30000000,commissions:1},paid));
});
test('salida conocida elimina base futura; excepciones exigen fecha, motivo y referencia',()=> {
  const calc=automaticDeductions(rule,{monthly_salary_cents:60000000,termination_date:'2026-11-15'},{year:2026,month:11,half:1},{gross:110000000,commissions:80000000});assert.equal(calc.renta,1820000);
  assert.equal(exceptionInput({}),null);
  assert.throws(()=>exceptionInput({exception_reason:'Incapacidad'}));
  assert.throws(()=>exceptionInput({exception_reason:'Caso',exception_reference:'Ref',exception_start:'2026-11-20',exception_end:'2026-11-19'}));
  assert.equal(exceptionInput({exception_reason:'Caso',exception_reference:'Ref',exception_start:'2026-11-20',exception_end:'2026-11-21'}).reference,'Ref');
});
