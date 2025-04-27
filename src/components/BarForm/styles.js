import { styled } from '@mui/material/styles';
import { Paper, TextField, Button } from '@mui/material';

export const RootContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '10px',
  backgroundColor: '#f5f5f5'
}));

export const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#ffffff'
  }
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontWeight: 'bold',
  textTransform: 'none',
  borderRadius: '8px'
}));