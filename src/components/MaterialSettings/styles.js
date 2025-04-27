import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

export const RootContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '10px',
  backgroundColor: '#f5f5f5'
}));