import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button
} from '@mui/material';
import useResultsStyles from './styles';

const Results = ({ results, material, onExportCSV, onExportPDF }) => {
  const classes = useResultsStyles();

  const calculateCost = (waste) => {
    return (waste * material.density * material.pricePerKg).toFixed(2);
  };

  return (
    <Paper className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h5" className={classes.title}>
          Resultados da Otimização
        </Typography>
        
        <Box className={classes.exportButtons}>
          <Button onClick={onExportCSV} className={classes.exportButton}>
            Exportar CSV
          </Button>
          <Button 
            variant="contained" 
            onClick={onExportPDF}
            className={classes.exportButton}
          >
            Exportar PDF
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <TableContainer>
            <Table className={classes.table}>
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
                    <TableCell align="right">{bar.totalWaste.toFixed(1)}</TableCell>
                    <TableCell align="right">{calculateCost(bar.totalWaste)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12} md={7}>
          <Box className={classes.visualization}>
            {results.details.map((barDetail) => (
              <Box key={barDetail.name} className={classes.barContainer}>
                <Typography variant="subtitle1" className={classes.barTitle}>
                  {barDetail.name} ({barDetail.length}mm) - {barDetail.used} unidades
                </Typography>
                
                {barDetail.stock.map((rod, index) => (
                  <Box key={index} className={classes.rod}>
                    {rod.parts.map((part, partIndex) => {
                      const partWidth = (part.length / barDetail.length) * 100;
                      const partPosition = rod.parts
                        .slice(0, partIndex)
                        .reduce((acc, p) => acc + (p.length / barDetail.length) * 100, 0);

                      return (
                        <Box
                          key={partIndex}
                          className={classes.part}
                          style={{
                            left: `${partPosition}%`,
                            width: `${partWidth}%`
                          }}
                        >
                          <span className={classes.partLabel}>
                            {part.name} ({part.length}mm)
                          </span>
                        </Box>
                      );
                    })}
                    
                    <Box className={classes.wasteLabel}>
                      Sobra: {rod.remaining.toFixed(1)}mm
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Results;