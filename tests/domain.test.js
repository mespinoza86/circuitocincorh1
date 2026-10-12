import { test } from 'node:test';
import assert from 'node:assert/strict';
import { completeMonths, workingDays, vacationBalance, payPeriod, payrollAmounts, money, date } from '../server/domain.js';

test('14 días exactos por año y acumulación en aniversarios mensuales',()=> {
  assert.equal(completeMonths('2020-06-16','2021-06-15'),11);
  assert.equal(completeMonths('2020-06-16','2021-06-16'),12);
  assert.equal(vacationBalance({id:'a',hire_date:'2020-06-16',historical_days:0},[],'2021-06-16').accrued,14);
  assert.equal(completeMonths('2020-06-16','2026-10-10'),75);
  assert.equal(completeMonths('2027-06-16','2026-10-10'),0);
});
test('aniversarios 29, 30 y 31 usan último día y recuperan día original',()=> {
  assert.equal(completeMonths('2025-01-31','2025-02-27'),0);
  assert.equal(completeMonths('2025-01-31','2025-02-28'),1);
  assert.equal(completeMonths('2025-01-31','2025-03-30'),1);
  assert.equal(completeMonths('2025-01-31','2025-03-31'),2);
  assert.equal(completeMonths('2024-01-31','2024-02-29'),1);
  assert.equal(completeMonths('2024-02-29','2025-02-28'),12);
});
test('rango inclusivo excluye fines de semana y feriados sin doble descuento',()=> {
  const result=workingDays('2026-10-10','2026-10-20',['2026-10-12','2026-10-10']);
  assert.equal(result.days,6);
  assert.equal(result.entries.length,11);
  assert.equal(result.entries.find(e=>e.date==='2026-10-10').days,0);
  assert.equal(result.entries.find(e=>e.date==='2026-10-12').reason,'Feriado');
});
test('medios días requieren una fecha laboral',()=> {
  assert.equal(workingDays('2026-10-13','2026-10-13',[],true).days,.5);
  assert.equal(workingDays('2026-10-10','2026-10-10',[],true).days,0);
  assert.throws(()=>workingDays('2026-10-13','2026-10-14',[],true));
  assert.throws(()=>workingDays('2026-10-20','2026-10-10'));
});
test('ajuste histórico, disfrutadas, reservas y cancelaciones mantienen saldo',()=> {
  const e={id:'a',hire_date:'2020-06-16',historical_days:80,historical_cutoff:'2026-09-30'};
  const requests=[{employee_id:'a',status:'approved',entries:[{date:'2026-10-01',days:1},{date:'2026-10-20',days:.5}]},{employee_id:'a',status:'cancelled',entries:[{date:'2026-10-02',days:5}]},{employee_id:'b',status:'approved',entries:[{date:'2026-10-03',days:10}]}];
  assert.deepEqual(vacationBalance(e,requests,'2026-10-10'),{months:75,accrued:87.5,historical:80,used:1,reserved:.5,balance:6.5,available:6});
  assert.equal(vacationBalance({...e,historical_days:100},requests,'2026-10-10').available,-14);
});
test('la salida detiene la acumulación',()=> {
  const e={id:'a',hire_date:'2020-06-16',termination_date:'2021-06-16',historical_days:0};
  assert.equal(vacationBalance(e,[],'2026-10-10').accrued,14);
});
test('periodos quincenales contemplan febrero bisiesto',()=> {
  assert.equal(payPeriod(2024,2,2).end,'2024-02-29');
  assert.equal(payPeriod(2025,2,2).end,'2025-02-28');
  assert.equal(payPeriod(2026,10,1).end,'2026-10-15');
  assert.throws(()=>payPeriod(2026,13,1));
  assert.throws(()=>payPeriod(2026,2,3));
});
test('nómina usa céntimos, comisiones y deducciones manuales',()=> {
  const result=payrollAmounts(money('1000000.01'),{commissions:'25000',caja:'50000',renta:'10000',loan:'5000',other:'1000',other_reason:'Asociación'});
  assert.equal(result.automatic,50000001);
  assert.equal(payrollAmounts(money('1000000.01'),{},2).automatic,50000000);
  assert.equal(result.gross,52500001);
  assert.equal(result.net,45900001);
  assert.throws(()=>payrollAmounts(100,{caja:'2'}));
  assert.throws(()=>payrollAmounts(100000,{base_override:'200'}));
  assert.equal(payrollAmounts(100000,{base_override:'200',adjustment_reason:'Salida'}).base,20000);
});
test('validación rechaza fechas inexistentes y montos ambiguos',()=> {
  assert.throws(()=>date('2026-02-30'));
  assert.throws(()=>date('2026-2-3'));
  assert.throws(()=>money('1,000'));
  assert.throws(()=>money('-10'));
  assert.throws(()=>money('0.001'));
  assert.equal(money('0.10'),10);
});
