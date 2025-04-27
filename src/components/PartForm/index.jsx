import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { RootContainer, StyledInput, SubmitButton } from './styles';

const PartForm = ({ onAdd, errors }) => {
  const [part, setPart] = useState({ name: '', length: '', quantity: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPart = {
      name: part.name.trim(),
      length: Number(part.length),
      quantity: Number(part.quantity)
    };
    
    if (!newPart.name || newPart.length <= 0 || newPart.quantity <= 0) return;
    
    onAdd(prev => [...prev, newPart]);
    setPart({ name: '', length: '', quantity: '' });
  };

  return (
    <RootContainer elevation={3}>
      <Typography variant="h6" gutterBottom>
        Adicionar Peças
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <StyledInput
          label="Nome da Peça"
          fullWidth
          value={part.name}
          onChange={(e) => setPart({ ...part, name: e.target.value })}
          error={!!errors.parts}
        />
        
        <StyledInput
          label="Comprimento (mm)"
          type="number"
          fullWidth
          value={part.length}
          onChange={(e) => setPart({ ...part, length: e.target.value })}
          error={!!errors.parts}
          sx={{ mt: 2 }}
        />
        
        <StyledInput
          label="Quantidade"
          type="number"
          fullWidth
          value={part.quantity}
          onChange={(e) => setPart({ ...part, quantity: e.target.value })}
          error={!!errors.parts}
          sx={{ mt: 2 }}
        />
        
        <SubmitButton 
          type="submit" 
          variant="outlined" 
          fullWidth
          sx={{ mt: 2 }}
        >
          Adicionar Peça
        </SubmitButton>
      </form>
    </RootContainer>
  );
};

export default PartForm;