import React from 'react';
import { 
  Paper, Typography, Box, Grid, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button 
} from '@mui/material';
import { RootContainer, Visualization, ResultTable, ExportButton } from './styles';

const Results = ({ results, material, onExportCSV, onExportPDF }) => {
  const calculateCost = (waste) => {
    return (waste * material.density * material.pricePerKg).toFixed(2);
  };

  return (
    <RootContainer elevation={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Resultados da Otimização
        </Typography>
        
        <Box>
          <ExportButton onClick={onExportCSV} variant="outlined" sx={{ mr: 2 }}>
            Exportar CSV
          </ExportButton>
          <ExportButton onClick={onExportPDF} variant="contained">
            Exportar PDF
          </ExportButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TableContainer>
            <ResultTable>
              <TableHead>
                <TableRow>
                  <TableCell>Barra</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Desperdício (mm)</TableCell>
                  <TableCell align="right">Custo (R$)</TableCell>
                </TableRow>
              </TableHead>
              
              <TableBody>
                {results.map((bar) => (
                  <TableRow key={bar.name}>
                    <TableCell>{bar.name}</TableCell>
                    <TableCell align="right">{bar.used}</TableCell>
                    <TableCell align="right">{bar.totalWaste.toFixed(1)}</TableCell>
                    <TableCell align="right">{calculateCost(bar.totalWaste)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ResultTable>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={8}>
          <Visualization sx={{ minWidth: 800 }}>
            {results.map((barDetail) => (
              <Box key={barDetail.name} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  {barDetail.name} ({barDetail.length}mm) - {barDetail.used} unidades
                </Typography>
                
                {barDetail.stock.map((rod, index) => (
                  <Box key={index} sx={{
                    position: 'relative',
                    height: '40px',
                    backgroundColor: '#e0e0e0',
                    mb: 2,
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    {rod.parts.map((part, partIndex) => (
                      <Box
                        key={partIndex}
                        sx={{
                          position: 'absolute',
                          left: `${rod.parts
                            .slice(0, partIndex)
                            .reduce((acc, p) => acc + (p.length / barDetail.length) * 100, 0)}%`,
                          width: `${(part.length / barDetail.length) * 100}%`,
                          height: '100%',
                          backgroundColor: '#1976d2',
                          borderRight: '2px solid white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.75rem',
                          zIndex: 1
                        }}
                      >
                        {part.name} ({part.length}mm)
                      </Box>
                    ))}
                    
                    <Box sx={{
                      position: 'absolute',
                      right: '4px',
                      bottom: '4px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      px: 1,
                      py: 0.3,
                      fontSize: '0.65rem',
                      borderRadius: '3px',
                      zIndex: 2
                    }}>
                      Sobra: {rod.remaining.toFixed(1)}mm
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Visualization>
        </Grid>
      </Grid>
    </RootContainer>
  );
};

export default Results;