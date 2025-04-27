import React from 'react';
import { Typography, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { RootContainer } from './styles';

const MaterialSettings = ({ material, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...material, [field]: value });
  };

  return (
    <RootContainer elevation={3}>
      <Typography variant="h6" gutterBottom>
        Configurações do Material
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Material</InputLabel>
        <Select
          value={material.density}
          onChange={(e) => handleChange('density', e.target.value)}
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
        onChange={(e) => handleChange('pricePerKg', e.target.value)}
      />
    </RootContainer>
  );
};

export default MaterialSettings;