import {test} from 'node:test';
import assert from 'node:assert/strict';
import {aguinaldoPeriod,aguinaldoReport,currentAguinaldoYear} from '../server/aguinaldo.js';

const employee={id:'a',code:'CC0001',full_name:'Prueba',hire_date:'2020-01-01',active:true};
const history=(year,month,cents,extra={})=>({employee_id:'a',year,month,gross_cents:String(cents),active:true,...extra});
test('ciclo diciembre–noviembre y doce meses completos de ingresos',()=> {
  const period=aguinaldoPeriod(2026,'2026-12-20');
  assert.equal(period.start,'2025-12-01');assert.equal(period.as_of,'2026-11-30');
  assert.equal(currentAguinaldoYear('2026-11-30'),2026);assert.equal(currentAguinaldoYear('2026-12-01'),2027);
  assert.throws(()=>aguinaldoPeriod('2026.5'));
  const inputs=[history(2025,12,100000000),...Array.from({length:11},(_,index)=>history(2026,index+1,100000000))];
  const report=aguinaldoReport([employee],[],inputs,period);
  assert.equal(report.employees[0].aguinaldo_cents,'100000000');assert.equal(report.employees[0].missing_halves,0);
});
test('proporcional divide entre 12; toma bruto, conserva céntimos y excluye borradores/futuro',()=> {
  const rows=[{id:'p',employee_id:'a',year:2026,month:6,half:1,status:'closed',end_date:'2026-06-15',gross_cents:'60000001',net_cents:'1'},
    {id:'d',employee_id:'a',year:2026,month:6,half:2,status:'draft',end_date:'2026-06-30',gross_cents:'999999999'},
    {id:'f',employee_id:'a',year:2026,month:7,half:1,status:'closed',end_date:'2026-07-15',gross_cents:'999999999'}];
  const employeeFromJune={...employee,hire_date:'2026-06-01'};
  const report=aguinaldoReport([employeeFromJune],rows,[],aguinaldoPeriod(2026,'2026-06-30'));
  assert.equal(report.employees[0].gross_cents,'60000001');assert.equal(report.employees[0].aguinaldo_cents,'5000000');
  assert.equal(report.employees[0].missing_halves,1);
  const proportional=aguinaldoReport([{...employee,hire_date:'2026-06-01'}],[],Array.from({length:6},(_,i)=>history(2026,i+6,100000000)),aguinaldoPeriod(2026,'2026-11-30'));
  assert.equal(proportional.employees[0].aguinaldo_cents,'50000000');assert.equal(proportional.employees[0].missing_halves,0);
});
test('retiro conserva historial, cero explícito cubre el mes y salida delimita pendientes',()=> {
  const e={...employee,hire_date:'2026-01-16',termination_date:'2026-02-20',active:false};
  const incomes=[history(2026,1,0),history(2026,2,600, {active:false})];
  const report=aguinaldoReport([e],[],incomes,aguinaldoPeriod(2026,'2026-11-30'));
  assert.equal(report.employees[0].missing_halves,2);assert.equal(report.employees[0].aguinaldo_cents,'0');
  assert.equal(report.employees[0].months[2].history.active,false);
});
test('redondea la suma una vez, a céntimos, sin perder precisión en totales grandes',()=> {
  const incomes=Array.from({length:12},(_,index)=>history(index===0?2025:2026,index===0?12:index,'1000000000001'));
  const report=aguinaldoReport([employee],[],incomes,aguinaldoPeriod(2026,'2026-11-30'));
  assert.equal(report.employees[0].aguinaldo_cents,'1000000000001');
  assert.equal(aguinaldoReport([employee],[],[history(2026,1,6)],aguinaldoPeriod(2026,'2026-11-30')).employees[0].aguinaldo_cents,'1');
});
