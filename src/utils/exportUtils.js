import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportCSV = (results, material) => {
  const csvContent = [
    'Barra,Quantidade Usada,Desperdício Total (mm),Custo do Desperdício (R$)',
    ...results.map(bar => 
      `${bar.name},${bar.used},${bar.totalWaste.toFixed(2)},${(bar.totalWaste * material.density * material.pricePerKg).toFixed(2)}`
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, 'relatorio_corte.csv');
};

export const exportPDF = (results, material) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  let yPos = margin;
  const barHeight = 12;
  const maxBarWidth = pageWidth - 2 * margin;

  // Função para verificar espaço e adicionar página
  const checkSpace = (requiredHeight) => {
    if (yPos + requiredHeight > doc.internal.pageSize.getHeight() - 15) {
      doc.addPage();
      yPos = margin;
      // Restaurar cor padrão ao criar nova página
      doc.setTextColor(0, 0, 0); // Preto
      doc.setFontSize(12);
      doc.text('Continuação do Relatório', margin, yPos);
      yPos += 15;
      return true;
    }
    return false;
  };

  // Cabeçalho principal (preto)
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0); // Garantir cor preta
  doc.text('Relatório de Corte Otimizado', margin, yPos);
  yPos += 15;

  // Tabela de resumo
  autoTable(doc, {
    startY: yPos,
    head: [['Barra', 'Qtd', 'Desperdício (mm)', 'Custo (R$)']],
    body: results.map(bar => [
      bar.name,
      bar.used,
      bar.totalWaste.toFixed(1),
      (bar.totalWaste * material.density * material.pricePerKg).toFixed(2)
    ]),
    styles: { 
      fontSize: 10,
      textColor: [0, 0, 0] // Texto preto
    },
    headStyles: { 
      fillColor: [25, 118, 210],
      textColor: [255, 255, 255] // Texto branco
    },
    margin: { horizontal: margin }
  });
  
  yPos = doc.lastAutoTable.finalY + 10;

  // Processar cada barra
  results.forEach((bar, index) => {
    // Título da barra (preto)
    checkSpace(25);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Garantir cor preta
    doc.setFont('helvetica', 'bold');
    doc.text(`Barra: ${bar.name} (${bar.length}mm) - Usadas: ${bar.used}`, margin, yPos);
    yPos += 12;

    // Processar cada córrego
    bar.stock.forEach((rod, rodIndex) => {
      checkSpace(barHeight + 20);
      
      // Fundo da barra (cinza claro)
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin, yPos, maxBarWidth, barHeight, 2, 2, 'F');

      let currentX = margin;
      rod.parts.forEach((part, partIndex) => {
        const partWidth = (part.length / bar.length) * maxBarWidth;
        
        // Parte cortada (azul)
        doc.setFillColor(21, 101, 192);
        doc.rect(currentX, yPos, partWidth, barHeight, 'F');

        // Texto da peça (branco)
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255); // Branco
        doc.text(
          `${part.name} (${part.length})`,
          currentX + 2,
          yPos + barHeight/2 + 3,
          { maxWidth: partWidth - 4 }
        );

        currentX += partWidth;
      });

      // Restaurar cor preta para outros elementos
      doc.setTextColor(0, 0, 0);

      // Sobra (fundo escuro, texto branco)
      const wasteText = `Sobra: ${rod.remaining.toFixed(1)}mm`;
      doc.setFontSize(9);
      const textWidth = doc.getTextWidth(wasteText);
      
      doc.setFillColor(40, 40, 40);
      doc.rect(
        margin + maxBarWidth - textWidth - 6,
        yPos + barHeight - 11,
        textWidth + 4,
        9,
        'F'
      );
      
      doc.setTextColor(255, 255, 255); // Branco
      doc.text(wasteText, margin + maxBarWidth - textWidth - 4, yPos + barHeight - 5);

      // Restaurar cor preta após elemento
      doc.setTextColor(0, 0, 0);
      
      yPos += barHeight + 10;
    });

    yPos += 12;
  });

  doc.save(`relatorio_corte_${Date.now()}.pdf`);
};