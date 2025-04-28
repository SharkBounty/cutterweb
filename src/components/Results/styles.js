import { styled } from '@mui/material/styles';
import { Paper, Table, Button } from '@mui/material';

export const RootContainer = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  borderRadius: '12px',
  overflow: 'hidden',
  padding: '16px'
});

export const ResultTable = styled(Table)({
  '& .MuiTableCell-root': {
    padding: '8px 16px',
    fontSize: '0.875rem'
  }
});

export const Visualization = styled('div')({
  flex: 1,
  position: 'relative',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px'
});

export const ExportButton = styled(Button)({
  textTransform: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-1px)'
  }
});