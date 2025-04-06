import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#33ccff',
      light: '#5cd6ff',
      dark: '#00a3d6',
    },
    background: {
      default: '#0a0d1c',
      paper: '#141829',
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
          backgroundColor: '#141829',
          border: '1px solid rgba(51, 204, 255, 0.2)',
          '&:hover': {
            borderColor: 'rgba(51, 204, 255, 0.5)',
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