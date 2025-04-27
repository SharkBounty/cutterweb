import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    height: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  input: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#ffffff'
    },
    '& .MuiInputLabel-root': {
      color: '#666'
    }
  },
  button: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
    textTransform: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#1976d2',
      color: '#fff'
    }
  },
  errorText: {
    color: '#d32f2f',
    fontSize: '0.75rem',
    marginTop: theme.spacing(0.5)
  }
}));