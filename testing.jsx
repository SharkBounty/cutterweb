import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, Box } from '@mui/material';

function App() {
  const [bars, setBars] = useState([]);
  const [parts, setParts] = useState([]);
  const [material, setMaterial] = useState({
    density: 7.85e-6,
    pricePerKg: 0
  });
  const [results, setResults] = useState(null);

  // Funções para manipulação do estado dos formulários
  const addBar = (bar) => setBars([...bars, bar]);
  const addPart = (part) => setParts([...parts, part]);

  // Algoritmo de cálculo do plano de corte
  const calculateCuttingPlan = () => {
    // Implementação do algoritmo Best-Fit Decreasing com múltiplos tipos de barras
    const flatParts = parts.flatMap(part => 
      Array.from({ length: part.quantity }, () => ({ ...part }))
    ).sort((a, b) => b.length - a.length);

    const usedBars = [];
    
    flatParts.forEach(part => {
      let bestBar = null;
      let minRemaining = Infinity;

      // Tenta encontrar barra existente
      usedBars.forEach(bar => {
        const remaining = bar.remainingLength - part.length;
        if (remaining >= 0 && remaining < minRemaining) {
          minRemaining = remaining;
          bestBar = bar;
        }
      });

      if (bestBar) {
        bestBar.parts.push(part);
        bestBar.remainingLength -= part.length;
      } else {
        // Seleciona nova barra
        const eligibleBars = bars.filter(bar => bar.length >= part.length);
        if (eligibleBars.length === 0) return;

        const selectedBar = eligibleBars.reduce((min, bar) => {
          const cost = calculateBarCost(bar);
          return cost < min.cost ? { bar, cost } : min;
        }, { bar: null, cost: Infinity });

        usedBars.push({
          ...selectedBar.bar,
          parts: [part],
          remainingLength: selectedBar.bar.length - part.length
        });
      }
    });

    // Cálculo dos resultados
    const summary = bars.map(bar => ({
      ...bar,
      count: usedBars.filter(b => b.name === bar.name).length,
      waste: usedBars.filter(b => b.name === bar.name)
        .reduce((acc, b) => acc + b.remainingLength, 0)
    }));

    setResults({ summary, details: usedBars });
  };

  // Funções auxiliares
  const calculateBarCost = (bar) => {
    const volume = Math.PI * Math.pow(bar.diameter/2, 2) * bar.length;
    return volume * material.density * material.pricePerKg;
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Otimizador de Planos de Corte
      </Typography>

      {/* Formulários de entrada */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <BarForm addBar={addBar} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PartForm addPart={addPart} />
        </Grid>
      </Grid>

      {/* Configurações do material */}
      <MaterialForm material={material} setMaterial={setMaterial} />

      <Button variant="contained" onClick={calculateCuttingPlan}>
        Calcular Plano de Corte
      </Button>

      {/* Exibição dos resultados */}
      {results && <Results {...results} material={material} />}
    </Container>
  );
}

// Componentes auxiliares (BarForm, PartForm, MaterialForm, Results)...
// Implementação completa disponível no GitHub: https://github.com/exemplo/cutting-plan-optimizer

export default App;