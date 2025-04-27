export const calculateCuttingPlan = (bars) => {
  return bars.map(bar => {
    const sortedParts = bar.parts.flatMap(part => 
      Array(part.quantity).fill().map(() => ({
        name: part.name,
        length: part.length
      }))
    ).sort((a, b) => b.length - a.length);

    const stock = [];
    let totalWaste = 0;

    sortedParts.forEach(part => {
      let bestFit = null;

      stock.forEach((rod, index) => {
        if (rod.remaining >= part.length) {
          const waste = rod.remaining - part.length;
          if (!bestFit || waste < bestFit.waste) {
            bestFit = { index, waste };
          }
        }
      });

      if (bestFit) {
        stock[bestFit.index].parts.push(part);
        stock[bestFit.index].remaining -= part.length;
        totalWaste += bestFit.waste;
      } else {
        stock.push({
          length: bar.length,
          parts: [part],
          remaining: bar.length - part.length
        });
        totalWaste += bar.length - part.length;
      }
    });

    return {
      ...bar,
      used: stock.length,
      totalWaste,
      stock
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