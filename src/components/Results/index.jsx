import React from 'react';
import { 
  Paper, Typography, Box, Grid, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, useMediaQuery, useTheme 
} from '@mui/material';
import { RootContainer, Visualization, ResultTable, ExportButton } from './styles';

const Results = ({ results, material, onExportCSV, onExportPDF }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const calculateCost = (waste) => {
    return (waste * material.density * material.pricePerKg).toFixed(2);
  };

  return (
    <RootContainer elevation={3} sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 3,
        p: 2,
        gap: 2
      }}>
        <Typography variant="h5" component="h2" sx={{ 
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          fontWeight: 'bold'
        }}>
          Resultados da Otimização
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: { xs: 'flex-start', sm: 'flex-end' }
        }}>
          <ExportButton 
            onClick={onExportCSV} 
            variant="outlined"
            size="small"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Exportar CSV
          </ExportButton>
          <ExportButton 
            onClick={onExportPDF} 
            variant="contained"
            size="small"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Exportar PDF
          </ExportButton>
        </Box>
      </Box>

      {/* Conteúdo Principal */}
      <Grid container sx={{ 
        flex: 1, 
        overflow: 'hidden',
        margin: '0 !important',
        width: '100%'
      }}>
        {/* Tabela */}
        <Grid item xs={12} lg={6} sx={{ 
          height: isMobile ? '45vh' : '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRight: { lg: '1px solid #e0e0e0' },
          pr: { xs: 0, lg: 2 }
        }}>
          <TableContainer sx={{
            flex: 1,
            overflow: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            '& .MuiTable-root': {
              width: '100%',
              tableLayout: 'auto'
            }
          }}>
            <ResultTable stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: 'bold',
                    width: { xs: '30%', sm: '25%' },
                    minWidth: '100px',
                    py: 1.5
                  }}>
                    Barra
                  </TableCell>
                  
                  <TableCell align="right" sx={{ 
                    fontWeight: 'bold',
                    width: { xs: '20%', sm: '25%' },
                    minWidth: '80px',
                    py: 1.5,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    Qtd.
                  </TableCell>
                  
                  <TableCell align="right" sx={{ 
                    fontWeight: 'bold',
                    width: { xs: '25%', sm: '25%' },
                    minWidth: '110px',
                    py: 1.5,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    Desperdício (mm)
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 'bold',
                    width: { xs: '25%', sm: '25%' },
                    minWidth: '90px',
                    py: 1.5,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    Desperdício (%)
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 'bold',
                    width: { xs: '25%', sm: '25%' },
                    minWidth: '90px',
                    py: 1.5,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    Custo (R$)
                  </TableCell>
                </TableRow>
              </TableHead>
              
              <TableBody>
                {results.map((bar) => (
                  <TableRow key={bar.name} hover sx={{
                    '& td': {
                      py: 1,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      whiteSpace: 'nowrap'
                    }
                  }}>
                    <TableCell sx={{ 
                      fontWeight: 500,
                      color: 'text.primary'
                    }}>
                      {bar.name}
                    </TableCell>
                    
                    <TableCell align="right" sx={{
                      color: 'success.dark',
                      fontWeight: 500
                    }}>
                      {bar.used}
                    </TableCell>
                    
                    <TableCell align="right" sx={{
                      color: 'error.main',
                      fontWeight: 500
                    }}>
                    {bar.totalWaste.toFixed(1)}mm
                    </TableCell>
                    <TableCell align="right" sx={{
                      color: 'error.main',
                      fontWeight: 500
                    }}>
                      {bar.totalWastePercent}
                    </TableCell>
                    
                    <TableCell align="right" sx={{
                      color: 'text.secondary',
                      fontWeight: 500
                    }}>
                      {calculateCost(bar.totalWaste)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ResultTable>
          </TableContainer>
        </Grid>

        {/* Visualização */}
        <Grid item xs={12} lg={6} sx={{ 
          height: isMobile ? '55vh' : '100%',
          display: 'flex',
          flexDirection: 'column',
          pl: { xs: 0, lg: 2 },
          overflow: 'hidden'
        }}>
          <Visualization sx={{ 
            flex: 1,
            overflow: 'auto',
            p: 2,
            backgroundColor: 'white',
            '& > div': { minHeight: 'min-content' },
            '&::-webkit-scrollbar': {
              width: '6px',
              height: '6px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#1976d2',
              borderRadius: '4px'
            }
          }}>
            {results.map((barDetail) => {
              let counterBarras = 1;
              
              return (
                <Box key={barDetail.name} sx={{ 
                  mb: 4,
                  minHeight: '200px'
                }}>
                  <Typography variant="subtitle1" sx={{ 
                    mb: 2,
                    fontWeight: 'bold',
                    color: '#1976d2',
                    fontSize: '0.875rem',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'white',
                    zIndex: 1,
                    top: '-8px'
                  }}>
                    {barDetail.name} ({barDetail.length}mm) - {barDetail.used} unidades
                  </Typography>
                  
                  {barDetail.stock.map((rod, index) => {
                    const totalUsed = rod.parts.reduce((acc, part) => acc + part.length, 0);
                    const remaining = barDetail.length - totalUsed;
                    const usedPercentage = (totalUsed / barDetail.length) * 100;
                    
                    return (
                      <Box 
                        key={index}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          mb: 3,
                          width: '100%',
                          minWidth: { xs: '100%', sm: '400px', lg: '500px' }
                        }}>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%'
                        }}>
                          <Box sx={{
                            fontWeight: 'bold',
                            color: '#1976d2',
                            fontSize: '0.75rem'
                          }}>
                            Barra #{counterBarras++}
                          </Box>
                          <Box sx={{
                            backgroundColor: 'rgba(75, 65, 65, 0.85)',
                            borderRadius: '4px',
                            p: 1,
                            color: 'white',
                            fontSize: '0.75rem'
                          }}>
                            Sobra: {remaining.toFixed(1)}mm
                          </Box>
                        </Box>

                        <Box sx={{
                          position: 'relative',
                          height: '25px',
                          width: '100%',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          backgroundColor: '#ffe0e0'
                        }}>
                          <Box sx={{
                            width: `${usedPercentage}%`,
                            height: '100%',
                            backgroundColor: '#1976d2',
                            display: 'flex',
                            transition: 'width 0.3s ease'
                          }}>
                            {rod.parts.map((part, partIndex) => (
                              <Box
                                key={partIndex}
                                sx={{
                                  width: `${(part.length / totalUsed) * 100}%`,
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '0.6rem',
                                  borderRight: '2px solid rgba(255,255,255,0.3)',
                                  px: 0.5,
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                  minWidth: 'max-content'
                                }}
                              >
                                {part.name} ({part.length}mm)
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Visualization>
        </Grid>
      </Grid>
    </RootContainer>
  );
};

export default React.memo(Results);