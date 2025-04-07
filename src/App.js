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

const AnimatedBackground = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      overflow: 'hidden',
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        width: '150vmax',
        height: '150vmax',
        borderRadius: '50%',
        animation: 'move 20s linear infinite',
      },
      '&::before': {
        background: 'rgba(123, 31, 162, 0.15)',
        left: '-50%',
        top: '-50%',
        animationDelay: '-5s',
      },
      '&::after': {
        background: 'rgba(32, 201, 151, 0.15)',
        right: '-50%',
        bottom: '-50%',
      },
      '@keyframes move': {
        '0%': {
          transform: 'rotate(0deg)',
        },
        '100%': {
          transform: 'rotate(360deg)',
        },
      },
    }}
  />
);

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#20c997',
      light: '#63e6be',
      dark: '#0ca678',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7b1fa2',
      light: '#9c27b0',
      dark: '#6a1b9a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a1929',
      paper: 'rgba(10, 25, 41, 0.5)',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      background: 'linear-gradient(45deg, #20c997, #7b1fa2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700,
    },
    h2: {
      background: 'linear-gradient(45deg, #20c997, #7b1fa2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 600,
    },
    h3: {
      background: 'linear-gradient(45deg, #20c997, #7b1fa2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#0a1929',
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 25, 41, 0.3)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 40px rgba(32, 201, 151, 0.2)',
            border: '1px solid rgba(32, 201, 151, 0.3)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '24px',
            background: 'linear-gradient(45deg, rgba(32, 201, 151, 0.1), rgba(123, 31, 162, 0.1))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            padding: '1px',
            pointerEvents: 'none',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 25, 41, 0.3)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(32, 201, 151, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #20c997, #7b1fa2)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(45deg, #7b1fa2, #20c997)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 500,
          backdropFilter: 'blur(20px)',
        },
        contained: {
          background: 'linear-gradient(45deg, #20c997, #7b1fa2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(45deg, #7b1fa2, #20c997)',
          },
        },
        outlined: {
          borderColor: '#20c997',
          color: '#20c997',
          '&:hover': {
            borderColor: '#7b1fa2',
            color: '#7b1fa2',
            background: 'rgba(123, 31, 162, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 25, 41, 0.3)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '24px',
            background: 'linear-gradient(45deg, rgba(32, 201, 151, 0.1), rgba(123, 31, 162, 0.1))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            padding: '1px',
            pointerEvents: 'none',
          },
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
          <AnimatedBackground />
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
            <AppBar position="static" sx={{ bgcolor: 'transparent' }}>
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
