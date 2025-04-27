export const calculateCuttingPlan = (bars, parts) => {
    const sortedBars = [...bars].sort((a, b) => a.length - b.length);
    const sortedParts = parts
      .flatMap(part => Array(part.quantity).fill().map(() => ({
        name: part.name,
        length: part.length
      })))
      .sort((a, b) => b.length - a.length);
  
    const barInventory = sortedBars.map(bar => ({
      ...bar,
      stock: [],
      totalWaste: 0,
      used: 0
    }));
  
    sortedParts.forEach(part => {
      let bestFit = null;
  
      // Tentar encontrar em barras existentes
      barInventory.forEach(barType => {
        barType.stock.forEach((rod, index) => {
          if (rod.remaining >= part.length) {
            const waste = rod.remaining - part.length;
            if (!bestFit || waste < bestFit.waste) {
              bestFit = { barType, rodIndex: index, waste };
            }
          }
        });
      });
  
      // Se não encontrou, selecionar nova barra
      if (!bestFit) {
        const possibleBars = barInventory.filter(bar => bar.length >= part.length);
        if (possibleBars.length === 0) return;
  
        const selectedBar = possibleBars.reduce((min, bar) => 
          bar.length < min.length ? bar : min
        );
  
        selectedBar.stock.push({
          length: selectedBar.length,
          parts: [],
          remaining: selectedBar.length
        });
        selectedBar.used++;
        bestFit = {
          barType: selectedBar,
          rodIndex: selectedBar.stock.length - 1,
          waste: selectedBar.length - part.length
        };
      }
  
      // Adicionar a peça
      bestFit.barType.stock[bestFit.rodIndex].parts.push(part);
      bestFit.barType.stock[bestFit.rodIndex].remaining -= part.length;
      bestFit.barType.totalWaste += bestFit.waste;
    });
  
    return {
      summary: barInventory.map(bar => ({
        name: bar.name,
        length: bar.length,
        used: bar.used,
        totalWaste: bar.totalWaste
      })),
      details: barInventory
    };
  };
  
  export const validateInputs = (bars, parts) => {
    const errors = {};
    
    if (bars.length === 0) errors.bars = 'Adicione pelo menos um tipo de barra';
    if (parts.length === 0) errors.parts = 'Adicione pelo menos uma peça';
    
    bars.forEach(bar => {
      if (!bar.name.trim()) errors.bars = 'Nome da barra inválido';
      if (bar.length <= 0) errors.bars = 'Comprimento da barra inválido';
    });
    
    parts.forEach(part => {
      if (!part.name.trim()) errors.parts = 'Nome da peça inválido';
      if (part.length <= 0) errors.parts = 'Comprimento da peça inválido';
      if (part.quantity <= 0) errors.parts = 'Quantidade inválida';
    });
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };