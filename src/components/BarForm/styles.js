import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    height: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px'
  },
  input: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px'
    }
  },
  button: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
    textTransform: 'none'
  }
}));