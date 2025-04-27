import React, { useState } from 'react';
import { Paper, Typography, TextField, Button } from '@mui/material';
import { RootContainer, StyledInput, SubmitButton } from './styles';

const BarForm = ({ onAdd, errors }) => {
  const [bar, setBar] = useState({ name: '', length: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bar.name || !bar.length) return;
    onAdd(bar);
    setBar({ name: '', length: '' });
  };

  return (
    <RootContainer elevation={3}>
      <Typography variant="h6" gutterBottom>
        Adicionar Nova Barra
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <StyledInput
          label="Nome da Barra"
          fullWidth
          value={bar.name}
          onChange={(e) => setBar({ ...bar, name: e.target.value })}
          error={!!errors.barName}
          helperText={errors.barName}
        />
        
        <StyledInput
          label="Comprimento (mm)"
          type="number"
          fullWidth
          value={bar.length}
          onChange={(e) => setBar({ ...bar, length: e.target.value })}
          error={!!errors.barLength}
          helperText={errors.barLength}
          sx={{ mt: 2 }}
        />
        
        <SubmitButton 
          type="submit" 
          variant="contained" 
          fullWidth
          sx={{ mt: 2 }}
        >
          Adicionar Barra
        </SubmitButton>
      </form>
    </RootContainer>
  );
};

export default BarForm;