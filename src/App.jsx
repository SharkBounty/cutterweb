import React, { useState } from 'react';
import { Container, Typography, Grid, Box, Alert } from '@mui/material';
import BarForm from './components/BarForm';
import PartForm from './components/PartForm';
import MaterialSettings from './components/MaterialSettings';
import Results from './components/Results';
import { calculateCuttingPlan } from './utils/algorithms';
import { exportCSV, exportPDF } from './utils/exportUtils';

function App() {
  const [bars, setBars] = useState([]);
  const [parts, setParts] = useState([]);
  const [material, setMaterial] = useState({ 
    density: 7.85e-6, 
    pricePerKg: 0 
  });
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});

  const handleCalculate = () => {
    const { isValid, errors: validationErrors } = validateInputs();
    if (!isValid) return;
    
    const results = calculateCuttingPlan(bars, parts);
    setResults(results);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Otimizador de Corte de Barras
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <BarForm onAdd={setBars} errors={errors} />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <PartForm onAdd={setParts} errors={errors} />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <MaterialSettings material={material} onChange={setMaterial} />
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
          disabled={!bars.length || !parts.length}
          sx={{ px: 6, py: 1.5 }}
        >
          Calcular Plano de Corte
        </Button>
      </Box>

      {results && (
        <Results 
          results={results}
          material={material}
          onExportCSV={() => exportCSV(results, material)}
          onExportPDF={() => exportPDF(results, material)}
        />
      )}
    </Container>
  );
}

export default App;