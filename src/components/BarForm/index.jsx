import React, { useState } from 'react';
import { Paper, Typography, TextField, Button } from '@mui/material';
import useBarFormStyles from './styles';

const BarForm = ({ onAdd, errors }) => {
  const [bar, setBar] = useState({ name: '', length: '' });
  const classes = useBarFormStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de validação e submissão
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Adicionar Barras
      </Typography>
      
      <form onSubmit={handleSubmit}>
        {/* Campos do formulário */}
      </form>
    </Paper>
  );
};

export default BarForm;