import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    height: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px'
  },
  select: {
    '& .MuiSelect-select': {
      padding: '12.5px 14px'
    }
  },
  priceInput: {
    marginTop: theme.spacing(2),
    '& .MuiInputBase-input': {
      padding: '12.5px 14px'
    }
  }
}));