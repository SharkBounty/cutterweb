import { styled } from '@mui/material/styles';
import { Paper, Table, Button } from '@mui/material';

export const RootContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  borderRadius: '12px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
}));

export const ResultTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    padding: theme.spacing(1.5),
    fontSize: '0.875rem'
  }
}));

export const Visualization = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#f8f9fa',
  borderRadius: '8px'
}));

export const ExportButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '8px',
  padding: theme.spacing(1, 2)
}));