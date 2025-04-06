import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Lohit Devanagari", sans-serif',
    h1: {
      fontFamily: '"Lohit Devanagari", sans-serif',
    },
    h2: {
      fontFamily: '"Lohit Devanagari", sans-serif',
    },
    h3: {
      fontFamily: '"Lohit Devanagari", sans-serif',
    },
    h4: {
      fontFamily: '"Lohit Devanagari", sans-serif',
    },
    h5: {
      fontFamily: '"Lohit Devanagari", sans-serif',
    },
    h6: {
      fontFamily: '"Lohit Devanagari", sans-serif',
    },
    body1: {
      fontFamily: '"Lohit Devanagari", sans-serif',
    },
    body2: {
      fontFamily: '"Lohit Devanagari", sans-serif',
    },
    button: {
      fontFamily: '"Lohit Devanagari", sans-serif',
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ce93d8',
    },
    background: {
      default: '#0a1929',
      paper: '#0a1929',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#141829',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0f1124',
          borderBottom: '1px solid rgba(51, 204, 255, 0.2)',
        },
      },
    },
  },
});

export default theme; 