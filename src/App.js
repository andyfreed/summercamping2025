import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, createTheme } from '@mui/material';
import House from './components/House';
import Boat from './components/Boat';
import Area from './components/Area';
import MessageBoard from './components/MessageBoard';
import Dashboard from './components/Dashboard';
import ScrollToTop from './components/ScrollToTop';
import CountdownTimer from './components/CountdownTimer';
import { AuthProvider } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
      light: '#6effff',
      dark: '#00b2cc',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ff00e5',
      light: '#ff6eff',
      dark: '#c800b2',
      contrastText: '#ffffff',
    },
    background: {
      default: 'rgba(10, 10, 25, 0.95)',
      paper: 'rgba(20, 20, 40, 0.7)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    error: {
      main: '#ff4444',
    },
    warning: {
      main: '#ffbb33',
    },
    success: {
      main: '#00c851',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      background: 'linear-gradient(45deg, #00e5ff, #ff00e5)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700,
    },
    h2: {
      background: 'linear-gradient(45deg, #00e5ff, #ff00e5)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 600,
    },
    h3: {
      background: 'linear-gradient(45deg, #00e5ff, #ff00e5)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0a0a19 0%, #1a1a33 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(20, 20, 40, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 10, 25, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #00e5ff, #ff00e5)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(45deg, #ff00e5, #00e5ff)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          background: 'linear-gradient(45deg, #00e5ff, #ff00e5)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(45deg, #ff00e5, #00e5ff)',
          },
        },
        outlined: {
          borderColor: '#00e5ff',
          color: '#00e5ff',
          '&:hover': {
            borderColor: '#ff00e5',
            color: '#ff00e5',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(20, 20, 40, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="static" sx={{ bgcolor: 'background.paper' }}>
              <Toolbar sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 4 },
                py: { xs: 2, sm: 1 }
              }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    color: 'primary.main', 
                    fontWeight: 700,
                    flexGrow: { sm: 1 }
                  }}
                >
                  SUMMER CAMPING 2025
                </Typography>
                <CountdownTimer />
              </Toolbar>
            </AppBar>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/house" element={<House />} />
                <Route path="/boat" element={<Boat />} />
                <Route path="/area" element={<Area />} />
                <Route path="/messages" element={<MessageBoard />} />
              </Routes>
            </Box>
            <ScrollToTop />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
