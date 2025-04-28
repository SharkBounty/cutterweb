export const calculateCuttingPlan = (bars) => {
  return bars.map(bar => {
    // Validar comprimentos
    if (bar.length <= 0) throw new Error(`Comprimento inválido para barra ${bar.name}`);
    
    const parts = bar.parts.flatMap(part => {
      if (part.length > bar.length) {
        throw new Error(`Peça ${part.name} (${part.length}mm) excede o comprimento da barra ${bar.name} (${bar.length}mm)`);
      }
      return Array(part.quantity).fill({ 
        name: part.name, 
        length: part.length 
      });
    });

    const sortedParts = [...parts].sort((a, b) => b.length - a.length);
    const stock = [];
    let totalWaste = 0;
    let totalWastePercent = 0;
    let totalLength = 0;

    sortedParts.forEach(part => {
      let bestFitIndex = -1;
      let smallestWaste = Infinity;
      
      // Encontrar a melhor posição
      stock.forEach((rod, index) => {
        if (rod.remaining >= part.length) {
          const waste = rod.remaining - part.length;
          if (waste < smallestWaste) {
            smallestWaste = waste;
            bestFitIndex = index;
          }
        }
      });

      // console.log(stock.remaining)
      if (bestFitIndex !== -1) {
        // Atualizar barra existente
        stock[bestFitIndex].remaining -= part.length;
        stock[bestFitIndex].parts.push(part);
        
      } else {
        // Criar nova barra
        const remaining = bar.length - part.length;
        stock.push({
          length: bar.length,
          remaining,
          parts: [part]
        });
        // totalWaste += remaining;
      }
    });

    stock.forEach(rod => {
      totalWaste += rod.remaining
    });

    totalLength = stock.length * bar.length;
    totalWastePercent = (totalWaste/totalLength*100).toFixed(2)
    return {
      ...bar,
      used: stock.length,
      totalWaste,
      totalWastePercent,
      stock,
    };
  });
};

export const validateInputs = (bars) => {
  const errors = {};
  
  bars.forEach((bar, index) => {
    if (!bar.name?.trim()) errors[`bar-${index}-name`] = `Nome obrigatório na barra ${index + 1}`;
    if (isNaN(bar.length) || bar.length <= 0) errors[`bar-${index}-length`] = `Comprimento inválido na barra ${index + 1}`;
    
    bar.parts.forEach((part, partIndex) => {
      if (part.length > bar.length) {
        errors[`bar-${index}-part-${partIndex}`] = 
          `Peça "${part.name}" excede o comprimento da barra ${bar.name}`;
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};