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
    doc.rect(42,y - 10,510,44).fill('#f3f3f3');
    doc.rect(42,y - 10,3,44).fill('#e21a24');line('SALARIO NETO',item.net_cents,true); y += 20;
    doc.font('Helvetica').fontSize(9).fillColor('#666666');
    if (item.adjustment_reason) { doc.text(`Ajuste de salario: ${item.adjustment_reason}`,52,y,{ width: 485 }); y = doc.y + 12; }
    if (item.other_reason) { doc.text(`Otras deducciones: ${item.other_reason}`,52,y,{ width: 485 }); y = doc.y + 12; }
    doc.text(`Estado: ${period.status === 'closed' ? 'Nómina cerrada' : 'BORRADOR · pendiente de cierre'}`,52,y,{ width:485 });
    doc.text(`Referencia: ${item.id}`,52,doc.y + 10,{ width: 485 });
    doc.end();
  });
}
