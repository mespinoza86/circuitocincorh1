import PDFDocument from 'pdfkit';
import {fileURLToPath} from 'node:url';

const logoPath=fileURLToPath(new URL('../public/assets/circuito-cinco-logo.png',import.meta.url));

const amount = cents => `CRC ${new Intl.NumberFormat('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(cents) / 100)}`;
export function payslipPdf(item, period, company) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 52, info: { Title: 'Colilla de pago', Author: company.name } });
    const chunks = []; doc.on('data', chunk => chunks.push(chunk)); doc.on('end', () => resolve(Buffer.concat(chunks))); doc.on('error', reject);
    doc.rect(0,0,595,7).fill('#e21a24');
    doc.image(logoPath,52,31,{width:180});
    doc.fillColor('#2c2d2e').font('Helvetica-Bold').fontSize(company.name.length>55?10:13).text(company.name,275,34,{width:268,height:34,ellipsis:true,align:'right'});
    doc.font('Helvetica').fontSize(9).fillColor('#666666').text('RECURSOS HUMANOS',275,79,{width:268,align:'right'});
    doc.fontSize(10).fillColor('#2c2d2e').text('COLILLA DE PAGO · COLONES COSTARRICENSES',52,94);
    doc.moveTo(52,118).lineTo(543,118).strokeColor('#e6e6e6').stroke();
    doc.fillColor('#2c2d2e').font('Helvetica-Bold').fontSize(16).text(item.employee_snapshot.full_name,52,145);
    doc.font('Helvetica').fontSize(10).text(`Cédula: ${item.employee_snapshot.national_id}    Código: ${item.employee_snapshot.code}`);
    doc.text(`Puesto: ${item.employee_snapshot.position || 'Sin especificar'}`);
    doc.text(`Periodo: ${period.start_date} al ${period.end_date}`);
    doc.text(`Salario mensual: ${amount(item.monthly_salary_cents)}`);
    if (company.legal_id) doc.text(`Cédula jurídica: ${company.legal_id}`);
    let y = 260;
    const line = (label, value, bold = false) => {
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(11).fillColor('#2c2d2e').text(label,52,y,{ width: 325 });
      doc.text(amount(value),390,y,{ width: 150, align: 'right' });
      y += 29;
    };
    line('Salario de la quincena',item.base_cents);
    line('Comisiones',item.commissions_cents);
    line('Total de ingresos',item.gross_cents,true); y += 12;
    line('Caja',item.caja_cents); line('Renta',item.renta_cents); line('Préstamos',item.loan_cents); line('Otras deducciones',item.other_cents);
    line('Total de deducciones',item.deductions_cents,true); y += 14;
    if(Number(item.tax_refund_cents)>0)line('Devolución de renta del mes',item.tax_refund_cents);
    doc.rect(42,y - 10,510,44).fill('#f3f3f3');
    doc.rect(42,y - 10,3,44).fill('#e21a24');line('SALARIO NETO',item.net_cents,true); y += 20;
    doc.font('Helvetica').fontSize(9).fillColor('#666666');
    if (item.adjustment_reason) { doc.text(`Ajuste de salario: ${item.adjustment_reason}`,52,y,{ width: 485 }); y = doc.y + 12; }
    if (item.other_reason) { doc.text(`Otras deducciones: ${item.other_reason}`,52,y,{ width: 485 }); y = doc.y + 12; }
    if(item.deduction_snapshot){doc.text(`Renta calculada para ${period.year}-${String(period.month).padStart(2,'0')}. Bruto mensual: ${amount(item.deduction_snapshot.monthly_gross_cents)}.`,52,y,{width:485});y=doc.y+10;}
    if(item.deduction_snapshot?.confirmation_note){doc.text(`Conciliación de renta: ${item.deduction_snapshot.confirmation_note}`,52,y,{width:485});y=doc.y+10;}
    if(item.exception_data){doc.text(`Excepción: ${item.exception_data.reason}. Referencia: ${item.exception_data.reference}`,52,y,{width:485});y=doc.y+10;}
    doc.text(`Estado: ${period.status === 'closed' ? 'Nómina cerrada' : 'BORRADOR · pendiente de cierre'}`,52,y,{ width:485 });
    doc.text(`Referencia: ${item.id}`,52,doc.y + 10,{ width: 485 });
    doc.end();
  });
}

export function taxAdjustmentPdf(adjustment,company) {
  return new Promise((resolve,reject)=> {
    const doc=new PDFDocument({size:'A4',margin:52,info:{Title:'Comprobante de ajuste de renta',Author:company.name}}),chunks=[];
    doc.on('data',chunk=>chunks.push(chunk));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);
    doc.rect(0,0,595,7).fill('#e21a24');doc.image(logoPath,52,31,{width:180});
    doc.fillColor('#2c2d2e').font('Helvetica-Bold').fontSize(15).text('COMPROBANTE DE AJUSTE DE RENTA',52,105);
    doc.fontSize(12).text(adjustment.calculation.employee.full_name,52,150);
    doc.font('Helvetica').fontSize(10).text(`Empresa: ${company.name}`).text(`Empleado: ${adjustment.calculation.employee.code}`).text(`Mes de origen: ${adjustment.year}-${String(adjustment.month).padStart(2,'0')}`);
    doc.moveDown().text(`Ingreso salarial registrado: ${amount(adjustment.calculation.gross_cents)}`).text(`Renta calculada: ${amount(adjustment.calculation.tax_cents)}`).text(`Renta neta previa: ${amount(adjustment.calculation.retained_cents)}`);
    doc.moveDown().font('Helvetica-Bold').fontSize(14).text(`${Number(adjustment.delta_cents)<0?'Devolución':'Cobro adicional'}: ${amount(Math.abs(Number(adjustment.delta_cents)))}`);
    doc.font('Helvetica').fontSize(10).moveDown().text(`Motivo: ${adjustment.reason}`).text(`Estado: ${adjustment.status==='applied'?'Aplicado':adjustment.status==='cancelled'?'Cancelado':'Propuesta pendiente; no aplicada'}`);
    if(adjustment.reference)doc.moveDown().text(`Referencia: ${adjustment.reference}`);
    doc.moveDown().text('Este comprobante conserva la referencia del ajuste y no modifica las colillas originales. No representa una declaración o pago a Hacienda.');
    doc.moveDown().fontSize(8).text(`Referencia del registro: ${adjustment.id}`);doc.end();
  });
}
