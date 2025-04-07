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
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'move 30s linear infinite',
        transformOrigin: 'center center',
      },
      '&::before': {
        background: 'rgba(255, 126, 0, 0.1)',
        left: '-50%',
        top: '-50%',
        animationDelay: '-7s',
      },
      '&::after': {
        background: 'rgba(0, 128, 128, 0.1)',
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
      main: '#FF7E00',
      light: '#FFA040',
      dark: '#CC6500',
      contrastText: '#000000',
    },
    secondary: {
      main: '#008080',
      light: '#40A0A0',
      dark: '#006666',
      contrastText: '#ffffff',
    },
    background: {
      default: '#1A1A1A',
      paper: 'rgba(26, 26, 26, 0.7)',
    },
    text: {
      primary: '#F5E6D3',
      secondary: 'rgba(245, 230, 211, 0.7)',
    },
    error: {
      main: '#ff4444',
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
      background: 'linear-gradient(45deg, #FF7E00, #FF4000)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 700,
    },
    h2: {
      background: 'linear-gradient(45deg, #FF7E00, #FF4000)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 600,
    },
    h3: {
      background: 'linear-gradient(45deg, #FF7E00, #FF4000)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#1A1A1A',
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 26, 0.5)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 126, 0, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 40px rgba(255, 126, 0, 0.2)',
            border: '1px solid rgba(255, 126, 0, 0.3)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '24px',
            background: 'linear-gradient(45deg, rgba(255, 126, 0, 0.1), rgba(0, 128, 128, 0.1))',
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
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 126, 0, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #FF7E00, #008080)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(45deg, #008080, #FF7E00)',
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
          background: 'linear-gradient(45deg, #FF7E00, #008080)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(45deg, #008080, #FF7E00)',
          },
        },
        outlined: {
          borderColor: '#FF7E00',
          color: '#FF7E00',
          '&:hover': {
            borderColor: '#008080',
            color: '#008080',
            background: 'rgba(0, 128, 128, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 26, 0.5)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 126, 0, 0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '24px',
            background: 'linear-gradient(45deg, rgba(255, 126, 0, 0.1), rgba(0, 128, 128, 0.1))',
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
          <Box sx={{ 
            position: 'relative', 
            minHeight: '100vh',
            overflowX: 'hidden'
          }}>
            <AnimatedBackground />
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh', 
              position: 'relative', 
              zIndex: 1,
              maxWidth: '100vw'
            }}>
              <AppBar 
                position="static" 
                sx={{ 
                  bgcolor: 'transparent',
                  backgroundImage: 'linear-gradient(180deg, rgba(26, 26, 26, 0.9) 0%, rgba(26, 26, 26, 0.7) 50%, rgba(26, 26, 26, 0.4) 100%)',
                  borderBottom: '1px solid rgba(255, 126, 0, 0.2)',
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(255, 126, 0, 0) 0%, rgba(255, 126, 0, 0.1) 50%, rgba(255, 126, 0, 0) 100%)',
                    animation: 'shimmer 3s infinite',
                  },
                  '@keyframes shimmer': {
                    '0%': {
                      transform: 'translateX(-100%)',
                    },
                    '100%': {
                      transform: 'translateX(100%)',
                    },
                  },
                }}
              >
                <Toolbar 
                  sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: { xs: 'center', sm: 'space-between' },
                    alignItems: 'center',
                    py: { xs: 2, sm: 2 },
                    gap: { xs: 1.5, sm: 2 },
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center', 
                    gap: { xs: 1.5, sm: 3 },
                    justifyContent: 'center',
                  }}>
                    <Box
                      component="img"
                      src="/logo.png"
                      alt="Summer Camping 2025"
                      sx={{
                        height: { xs: '75px', sm: '90px' },
                        width: 'auto',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease-in-out',
                        filter: 'drop-shadow(0 4px 12px rgba(255, 126, 0, 0.3))',
                        '&:hover': {
                          transform: 'scale(1.05) rotate(-2deg)',
                          filter: 'drop-shadow(0 8px 20px rgba(255, 126, 0, 0.4))',
                        },
                      }}
                    />
                    <Typography
                      variant="h4"
                      sx={{ 
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #FF7E00 0%, #FFA040 50%, #FF4000 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '1.8rem', sm: '2.2rem' },
                        letterSpacing: '0.05em',
                        textAlign: { xs: 'center', sm: 'left' },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -4,
                          left: 0,
                          width: '100%',
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, #FF7E00, transparent)',
                          transform: 'scaleX(0.8)',
                          transition: 'transform 0.3s ease',
                        },
                        '&:hover::after': {
                          transform: 'scaleX(1)',
                        },
                      }}
                    >
                      SUMMER CAMPING 2025
                    </Typography>
                  </Box>
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
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
