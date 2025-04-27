import React, { useState } from 'react';
import { 
  Container, Typography, Grid, Box, Alert, Button, 
  TextField, Chip, Paper, IconButton, Dialog, DialogContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BarForm from './components/BarForm';
import MaterialSettings from './components/MaterialSettings';
import Results from './components/Results';
import { calculateCuttingPlan, validateInputs } from './utils/algorithms';
import { exportCSV, exportPDF } from './utils/exportUtils';

function App() {
  const [bars, setBars] = useState([]);
  const [material, setMaterial] = useState({ 
    density: 7.85e-6, 
    pricePerKg: 0 
  });
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [openResults, setOpenResults] = useState(false);

  const handleAddBar = (bar) => {
    setBars(prev => [...prev, {
      ...bar,
      id: Date.now(),
      parts: [],
      tempPart: { name: '', length: '', quantity: 1 },
      length: Number(bar.length)
    }]);
  };

  const handleDeleteBar = (barId) => {
    setBars(prev => prev.filter(bar => bar.id !== barId));
  };

  const handleAddPart = (barId) => {
    setBars(prev => prev.map(bar => {
      if (bar.id === barId) {
        const newPart = bar.tempPart;
        if (!newPart.name || !newPart.length || newPart.quantity < 1) return bar;
        
        return {
          ...bar,
          parts: [...bar.parts, {
            ...newPart,
            length: Number(newPart.length),
            quantity: Number(newPart.quantity)
          }],
          tempPart: { name: '', length: '', quantity: 1 }
        };
      }
      return bar;
    }));
  };

  const handleDeletePart = (barId, partIndex) => {
    setBars(prev => prev.map(bar => 
      bar.id === barId ? {
        ...bar,
        parts: bar.parts.filter((_, i) => i !== partIndex)
      } : bar
    ));
  };

  const handleTempPartChange = (barId, field, value) => {
    setBars(prev => prev.map(bar => 
      bar.id === barId ? {
        ...bar,
        tempPart: {
          ...bar.tempPart,
          [field]: value
        }
      } : bar
    ));
  };

  const handleCalculate = () => {
    const validation = validateInputs(bars);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setResults(calculateCuttingPlan(bars));
    setOpenResults(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Otimizador de Corte de Barras
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <BarForm onAdd={handleAddBar} errors={errors} />
          <MaterialSettings material={material} onChange={setMaterial} />
        </Grid>
        
        <Grid item xs={12} md={8}>
          {bars.map(bar => (
            <Paper key={bar.id} sx={{ mb: 3, p: 2, position: 'relative' }}>
              <IconButton
                sx={{ position: 'absolute', right: 8, top: 8 }}
                onClick={() => handleDeleteBar(bar.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                {bar.name} ({bar.length}mm)
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <TextField
                    label="Nome da Peça"
                    fullWidth
                    size="small"
                    value={bar.tempPart.name}
                    onChange={(e) => handleTempPartChange(bar.id, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Comprimento (mm)"
                    type="number"
                    fullWidth
                    size="small"
                    value={bar.tempPart.length}
                    onChange={(e) => handleTempPartChange(bar.id, 'length', e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Quantidade"
                    type="number"
                    fullWidth
                    size="small"
                    value={bar.tempPart.quantity}
                    onChange={(e) => handleTempPartChange(bar.id, 'quantity', e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={() => handleAddPart(bar.id)}
                  >
                    Adicionar
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {bar.parts.map((part, index) => (
                  <Chip
                    key={index}
                    label={`${part.name} - ${part.length}mm (x${part.quantity})`}
                    onDelete={() => handleDeletePart(bar.id, index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Paper>
          ))}
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
          onClick={handleCalculate}
          disabled={!bars.length}
          sx={{ px: 6, py: 1.5 }}
        >
          Calcular Plano de Corte
        </Button>
      </Box>

      <Dialog
        open={openResults}
        onClose={() => setOpenResults(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent>
          {results && (
            <Results 
              results={results}
              material={material}
              onExportCSV={() => exportCSV(results, material)}
              onExportPDF={() => exportPDF(results, material)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default App;