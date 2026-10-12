import {AppError,date,payPeriod,todayCR} from './domain.js';

export const currentAguinaldoYear=(asOf=todayCR())=>Number(asOf.slice(0,4))+(asOf.slice(5,7)==='12'?1:0);

export function aguinaldoPeriod(value,asOf=todayCR()) {
  const year=Number(value);date(asOf);
  if(!Number.isInteger(year)||year<2001||year>2200)throw new AppError('Año de aguinaldo inválido.');
  const start=`${year-1}-12-01`,end=`${year}-11-30`;
  return {year,start,end,as_of:asOf<end?asOf:end};
}

// Se suma en céntimos con BigInt y se redondea una sola vez al dividir entre 12.
export function aguinaldoReport(employees,payroll,history,period) {
  const summaries=employees.map(employee=> {
    let total=0n;const months=[];
    for(let index=0;index<12;index++) {
      const year=index===0?period.year-1:period.year,month=index===0?12:index;
      const first=payPeriod(year,month,1),second=payPeriod(year,month,2);
      const historical=history.find(h=>h.employee_id===employee.id&&h.year===year&&h.month===month);
      const records=payroll.filter(p=>p.employee_id===employee.id&&p.year===year&&p.month===month);
      const closed=records.filter(p=>p.status==='closed'&&p.end_date<=period.as_of);
      const includedHistory=historical?.active&&second.end<=period.as_of?historical:null;
      const gross=closed.reduce((sum,row)=>sum+BigInt(row.gross_cents),0n)+(includedHistory?BigInt(includedHistory.gross_cents):0n);
      const missing=[first,second].filter(p=> {
        const employed=employee.hire_date<=p.end&&(!employee.termination_date||employee.termination_date>=p.start);
        const due=(employee.termination_date&&employee.termination_date<p.end)?employee.termination_date:p.end;
        return employed&&due<=period.as_of&&!includedHistory&&!closed.some(row=>row.half===p.half);
      }).map(p=>p.half);
      months.push({year,month,start:first.start,end:second.end,gross_cents:gross.toString(),history:historical||null,
        payroll:records.map(row=>({id:row.id,period_id:row.period_id,half:row.half,status:row.status,gross_cents:row.gross_cents,included:closed.includes(row)})),missing_halves:missing});
      total+=gross;
    }
    const missing=months.reduce((sum,m)=>sum+m.missing_halves.length,0);
    return {id:employee.id,code:employee.code,full_name:employee.full_name,position:employee.position,active:employee.active,
      gross_cents:total.toString(),aguinaldo_cents:((total+6n)/12n).toString(),missing_halves:missing,months};
  }).filter(row=> {
    const employee=employees.find(e=>e.id===row.id);
    return (employee.hire_date<=period.end&&(!employee.termination_date||employee.termination_date>=period.start))||row.months.some(m=>m.history||m.payroll.length);
  });
  const total=summaries.reduce((sum,row)=>sum+BigInt(row.aguinaldo_cents),0n);
  return {...period,employees:summaries,total_cents:total.toString()};
}
