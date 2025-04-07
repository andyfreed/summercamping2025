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
      main: '#FFD700',
      light: '#FFE55C',
      dark: '#CC9900',
    },
    secondary: {
      main: '#9B4DCA',
      light: '#B679E3',
      dark: '#7A2BAD',
    },
    background: {
      default: '#1E0F2F',
      paper: '#2D1B40',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.8)',
    },
    error: {
      main: '#FF6B6B',
    },
    warning: {
      main: '#FFB347',
    },
    success: {
      main: '#66BB6A',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(255, 215, 0, 0.2)',
          background: 'linear-gradient(135deg, rgba(45, 27, 64, 0.95) 0%, rgba(30, 15, 47, 0.95) 100%)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            border: '1px solid rgba(255, 215, 0, 0.5)',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(180deg, rgba(45, 27, 64, 0.98) 0%, rgba(30, 15, 47, 0.98) 100%)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FFD700 0%, #CC9900 100%)',
          color: '#1E0F2F',
          '&:hover': {
            background: 'linear-gradient(135deg, #FFE55C 0%, #FFD700 100%)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
        contained: {
          background: 'linear-gradient(135deg, #FFD700 0%, #CC9900 100%)',
          color: '#1E0F2F',
          '&:hover': {
            background: 'linear-gradient(135deg, #FFE55C 0%, #FFD700 100%)',
          },
        },
      },
    },
  },
  typography: {
    h1: {
      background: 'linear-gradient(135deg, #FFD700 0%, #FFE55C 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h2: {
      background: 'linear-gradient(135deg, #FFD700 0%, #FFE55C 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    h3: {
      background: 'linear-gradient(135deg, #FFD700 0%, #FFE55C 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
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
