import React, { useState } from 'react';
import { 
  Container, Typography, TextField, Button, Grid, Paper, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, Select, MenuItem, Alert
} from '@mui/material';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function App() {
  const [bars, setBars] = useState([]);
  const [parts, setParts] = useState([]);
  const [material, setMaterial] = useState({ density: 7.85e-6, pricePerKg: 0 });
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});

  const validateInput = (value, min = 1) => {
    const num = Number(value);
    return !isNaN(num) && num >= min;
  };

  const addBar = (bar) => {
    const newErrors = {};
    if (!bar.name.trim()) newErrors.bar = 'Nome da barra é obrigatório';
    if (!validateInput(bar.length)) newErrors.bar = 'Comprimento inválido';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setBars([...bars, { ...bar, length: Number(bar.length) }]);
    setErrors({});
  };

  const addPart = (part) => {
    const newErrors = {};
    if (!part.name.trim()) newErrors.part = 'Nome da peça é obrigatório';
    if (!validateInput(part.length)) newErrors.part = 'Comprimento inválido';
    if (!validateInput(part.quantity)) newErrors.part = 'Quantidade inválida';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setParts([...parts, { 
      ...part, 
      length: Number(part.length),
      quantity: Number(part.quantity)
    }]);
    setErrors({});
  };

  const calculateCuttingPlan = () => {
    // Implementação melhorada do algoritmo Best-Fit Decreasing
    const sortedParts = parts
      .flatMap(part => Array(part.quantity).fill().map(() => ({
        name: part.name,
        length: part.length
      }))
    )
      .sort((a, b) => b.length - a.length);

    const barTypes = bars.map(bar => ({
      ...bar,
      stock: [],
      totalWaste: 0,
      used: 0
    }));

    sortedParts.forEach(part => {
      let bestFit = null;
      
      // Tenta encaixar em barras existentes
      barTypes.forEach(barType => {
        barType.stock.forEach((rod, index) => {
          if (rod.remaining >= part.length) {
            const waste = rod.remaining - part.length;
            if (!bestFit || waste < bestFit.waste) {
              bestFit = { barType, rodIndex: index, waste };
            }
          }
        });
      });

      // Se não encontrou, procura nova barra
      if (!bestFit) {
        const possibleBars = barTypes.filter(bar => bar.length >= part.length);
        if (possibleBars.length === 0) return;
        
        const selectedBar = possibleBars.reduce((min, bar) => 
          bar.length < min.length ? bar : min
        );
        
        bestFit = {
          barType: selectedBar,
          rodIndex: selectedBar.stock.length,
          waste: selectedBar.length - part.length
        };
        
        selectedBar.stock.push({
          length: selectedBar.length,
          parts: [],
          remaining: selectedBar.length
        });
        selectedBar.used++;
      }

      // Adiciona a peça na barra selecionada
      bestFit.barType.stock[bestFit.rodIndex].parts.push(part);
      bestFit.barType.stock[bestFit.rodIndex].remaining -= part.length;
      bestFit.barType.totalWaste += bestFit.waste;
    });

    setResults({
      summary: barTypes.map(bar => ({
        name: bar.name,
        length: bar.length,
        used: bar.used,
        totalWaste: bar.totalWaste
      })),
      details: barTypes
    });
  };

  const exportCSV = () => {
    const csvContent = [
      'Tipo de Barra,Quantidade Usada,Desperdício Total (mm),Custo do Desperdício (R$)',
      ...results.summary.map(bar => `${bar.name},${bar.used},${bar.totalWaste},${(bar.totalWaste * material.density * material.pricePerKg).toFixed(2)}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'relatorio_corte.csv');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.text('Relatório de Plano de Corte', 15, 15);
    doc.setFontSize(10);
    doc.text(`Data: ${date}`, 15, 23);
    
    // Tabela de resumo
    doc.autoTable({
      startY: 30,
      head: [['Barra', 'Quantidade', 'Desperdício (mm)', 'Custo (R$)']],
      body: results.summary.map(bar => [
        bar.name,
        bar.used,
        bar.totalWaste.toFixed(2),
        (bar.totalWaste * material.density * material.pricePerKg).toFixed(2)
      ]),
      theme: 'grid'
    });
    
    // Detalhes das barras
    let yPos = doc.lastAutoTable.finalY + 10;
    results.details.forEach(bar => {
      doc.setFontSize(12);
      doc.text(`Barra: ${bar.name} (${bar.length}mm)`, 15, yPos);
      yPos += 7;
      
      bar.stock.forEach((rod, index) => {
        doc.setFontSize(10);
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Otimizador de Corte de Barras
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <BarForm addBar={addBar} errors={errors} />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <PartForm addPart={addPart} errors={errors} />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <MaterialSettings material={material} setMaterial={setMaterial} />
        </Grid>
      </Grid>

      {Object.keys(errors).map((key) => (
        <Alert severity="error" sx={{ mt: 2 }} key={key}>
          {errors[key]}
        </Alert>
      ))}

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={calculateCuttingPlan}
          disabled={!bars.length || !parts.length}
          sx={{ px: 6, py: 1.5 }}
        >
          Calcular Plano de Corte
        </Button>
      </Box>

      {results && (
        <ResultsSection 
          results={results}
          material={material}
          onExportCSV={exportCSV}
          onExportPDF={exportPDF}
        />
      )}
    </Container>
  );
}

// Componentes auxiliares atualizados
const BarForm = ({ addBar, errors }) => {
  const [bar, setBar] = useState({ name: '', length: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addBar(bar);
    setBar({ name: '', length: '' });
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Adicionar Barras
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome da Barra"
          fullWidth
          value={bar.name}
          onChange={(e) => setBar({ ...bar, name: e.target.value })}
          error={!!errors.bar}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Comprimento (mm)"
          type="number"
          fullWidth
          value={bar.length}
          onChange={(e) => setBar({ ...bar, length: e.target.value })}
          error={!!errors.bar}
          sx={{ mb: 2 }}
        />
        
        <Button 
          type="submit" 
          variant="outlined" 
          fullWidth
          sx={{ mt: 1 }}
        >
          Adicionar Barra
        </Button>
      </form>
    </Paper>
  );
};

const PartForm = ({ addPart, errors }) => {
  const [part, setPart] = useState({ name: '', length: '', quantity: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addPart(part);
    setPart({ name: '', length: '', quantity: '' });
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Adicionar Peças
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome da Peça"
          fullWidth
          value={part.name}
          onChange={(e) => setPart({ ...part, name: e.target.value })}
          error={!!errors.part}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Comprimento (mm)"
          type="number"
          fullWidth
          value={part.length}
          onChange={(e) => setPart({ ...part, length: e.target.value })}
          error={!!errors.part}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Quantidade"
          type="number"
          fullWidth
          value={part.quantity}
          onChange={(e) => setPart({ ...part, quantity: e.target.value })}
          error={!!errors.part}
          sx={{ mb: 2 }}
        />
        
        <Button 
          type="submit" 
          variant="outlined" 
          fullWidth
          sx={{ mt: 1 }}
        >
          Adicionar Peça
        </Button>
      </form>
    </Paper>
  );
};

const MaterialSettings = ({ material, setMaterial }) => (
  <Paper sx={{ p: 3, height: '100%' }}>
    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
      Configurações do Material
    </Typography>
    
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Material</InputLabel>
      <Select
        value={material.density}
        onChange={(e) => setMaterial({ ...material, density: e.target.value })}
        label="Material"
      >
        <MenuItem value={7.85e-6}>Aço Carbono (7.85 g/mm³)</MenuItem>
        <MenuItem value={2.7e-6}>Alumínio (2.7 g/mm³)</MenuItem>
        <MenuItem value={8.96e-6}>Cobre (8.96 g/mm³)</MenuItem>
      </Select>
    </FormControl>
    
    <TextField
      label="Preço por kg (R$)"
      type="number"
      fullWidth
      value={material.pricePerKg}
      onChange={(e) => setMaterial({ ...material, pricePerKg: e.target.value })}
      sx={{ mb: 2 }}
    />
  </Paper>
);

const ResultsSection = ({ results, material, onExportCSV, onExportPDF }) => (
  <Paper sx={{ p: 3, mt: 4 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
      <Typography variant="h5" component="h2">
        Resultados da Otimização
      </Typography>
      
      <Box>
        <Button onClick={onExportCSV} sx={{ mr: 2 }}>
          Exportar CSV
        </Button>
        <Button variant="contained" onClick={onExportPDF}>
          Exportar PDF
        </Button>
      </Box>
    </Box>

    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Barra</TableCell>
                <TableCell align="right">Quantidade</TableCell>
                <TableCell align="right">Desperdício (mm)</TableCell>
                <TableCell align="right">Custo (R$)</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {results.summary.map((bar) => (
                <TableRow key={bar.name}>
                  <TableCell>{bar.name}</TableCell>
                  <TableCell align="right">{bar.used}</TableCell>
                  <TableCell align="right">{bar.totalWaste.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    {(bar.totalWaste * material.density * material.pricePerKg).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12} md={7}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Visualização do Corte
        </Typography>
        
        {results.details.map((barDetail) => (
          <Box key={barDetail.name} sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {barDetail.name} ({barDetail.length}mm) - {barDetail.used} unidades
            </Typography>
            
            {barDetail.stock.map((rod, index) => (
              <Box 
                key={index}
                sx={{
                  position: 'relative',
                  height: '40px',
                  backgroundColor: '#e0e0e0',
                  mb: 2,
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                {rod.parts.map((part, partIndex) => {
                  const partWidth = (part.length / barDetail.length) * 100;
                  const partPosition = rod.parts
                    .slice(0, partIndex)
                    .reduce((acc, p) => acc + (p.length / barDetail.length) * 100, 0);

                  return (
                    <Box
                      key={partIndex}
                      sx={{
                        position: 'absolute',
                        left: `${partPosition}%`,
                        width: `${partWidth}%`,
                        height: '100%',
                        backgroundColor: '#1976d2',
                        borderRight: '2px solid white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.8rem'
                      }}
                    >
                      {part.name} ({part.length}mm)
                    </Box>
                  );
                })}
                
                <Box
                  sx={{
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderTopLeftRadius: '4px',
                    borderBottomLeftRadius: '4px'
                  }}
                >
                  Sobra: {rod.remaining.toFixed(1)}mm
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Grid>
    </Grid>
  </Paper>
);

export default App;