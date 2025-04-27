import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportCSV = (results, material) => {
  const csvContent = [
    'Tipo de Barra,Quantidade Usada,Desperdício Total (mm),Custo do Desperdício (R$)',
    ...results.summary.map(bar => `${bar.name},${bar.used},${bar.totalWaste.toFixed(2)},${(bar.totalWaste * material.density * material.pricePerKg).toFixed(2)}`)
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, 'relatorio_corte.csv');
};

export const exportPDF = (results, material) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleString();
  
  // Cabeçalho
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Plano de Corte', 15, 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data: ${date}`, 15, 23);
  
  // Tabela de resumo
  doc.autoTable({
    startY: 30,
    head: [['Barra', 'Quantidade', 'Desperdício (mm)', 'Custo (R$)']],
    body: results.summary.map(bar => [
      bar.name,
      bar.used.toString(),
      bar.totalWaste.toFixed(2),
      (bar.totalWaste * material.density * material.pricePerKg).toFixed(2)
    ]),
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 }
  });
  
  // Detalhes das barras
  let yPos = doc.lastAutoTable.finalY + 10;
  results.details.forEach(bar => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Barra: ${bar.name} (${bar.length}mm)`, 15, yPos);
    yPos += 7;
    
    bar.stock.forEach((rod, index) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Barra ${index + 1}:`, 20, yPos);
      rod.parts.forEach((part, pIndex) => {
        doc.text(`- ${part.name}: ${part.length}mm`, 25, yPos + 5 + (pIndex * 5));
      });
      yPos += 10 + (rod.parts.length * 5);
    });
    yPos += 10;
  });

  doc.save('relatorio_corte.pdf');
};