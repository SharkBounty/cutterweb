import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(4)
  },
  title: {
    fontWeight: '600',
    color: '#2c3e50'
  },
  exportButtons: {
    display: 'flex',
    gap: theme.spacing(2)
  },
  exportButton: {
    textTransform: 'none',
    borderRadius: '8px',
    padding: '8px 20px'
  },
  table: {
    '& .MuiTableCell-root': {
      padding: '12px 16px',
      fontSize: '0.875rem'
    }
  },
  visualization: {
    padding: theme.spacing(2),
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  barContainer: {
    marginBottom: theme.spacing(4)
  },
  barTitle: {
    marginBottom: theme.spacing(1.5),
    fontWeight: '500',
    color: '#34495e'
  },
  rod: {
    position: 'relative',
    height: '40px',
    backgroundColor: '#e0e0e0',
    marginBottom: theme.spacing(2),
    borderRadius: '6px',
    overflow: 'hidden'
  },
  part: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#3498db',
    borderRight: '2px solid #fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#2980b9'
    }
  },
  partLabel: {
    color: '#fff',
    fontSize: '0.75rem',
    padding: '2px 4px',
    borderRadius: '3px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    whiteSpace: 'nowrap'
  },
  wasteLabel: {
    position: 'absolute',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '4px 12px',
    fontSize: '0.75rem',
    borderTopLeftRadius: '4px',
    borderBottomLeftRadius: '4px'
  }
}));