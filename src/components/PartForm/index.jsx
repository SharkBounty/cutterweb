import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, FormHelperText } from '@mui/material';
import usePartFormStyles from './styles';

const PartForm = ({ onAdd, errors }) => {
  const [part, setPart] = useState({ name: '', length: '', quantity: '' });
  const classes = usePartFormStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Validação atualizada
    if (!part.name.trim()) newErrors.name = 'Nome obrigatório';
    if (!part.length || Number(part.length) <= 0) newErrors.length = 'Comprimento inválido';
    if (!part.quantity || Number(part.quantity) <= 0) newErrors.quantity = 'Quantidade inválida';

    if (Object.keys(newErrors).length > 0) {
      onAdd(prev => ({ ...prev, ...newErrors }));
      return;
    }

    onAdd(prev => [...prev, {
      name: part.name.trim(),
      length: Number(part.length),
      quantity: Number(part.quantity)
    }]);
    setPart({ name: '', length: '', quantity: '' });
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Adicionar Peças
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nome da Peça"
          fullWidth
          value={part.name}
          onChange={(e) => setPart({ ...part, name: e.target.value })}
          className={classes.input}
          error={!!errors.name}
        />
        {errors.name && <FormHelperText className={classes.errorText}>{errors.name}</FormHelperText>}

        <TextField
          label="Comprimento (mm)"
          type="number"
          fullWidth
          value={part.length}
          onChange={(e) => setPart({ ...part, length: e.target.value })}
          className={classes.input}
          error={!!errors.length}
        />
        {errors.length && <FormHelperText className={classes.errorText}>{errors.length}</FormHelperText>}

        <TextField
          label="Quantidade"
          type="number"
          fullWidth
          value={part.quantity}
          onChange={(e) => setPart({ ...part, quantity: e.target.value })}
          className={classes.input}
          error={!!errors.quantity}
        />
        {errors.quantity && <FormHelperText className={classes.errorText}>{errors.quantity}</FormHelperText>}
        
        <Button 
          type="submit" 
          variant="outlined" 
          fullWidth
          className={classes.button}
        >
          Adicionar Peça
        </Button>
      </form>
    </Paper>
  );
};

export default PartForm;