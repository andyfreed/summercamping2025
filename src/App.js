import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, createTheme } from '@mui/material';
import House from './components/House';
import Boat from './components/Boat';
import Area from './components/Area';
import MessageBoard from './components/MessageBoard';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#33ccff',
    },
    background: {
      default: '#0f1020',
      paper: '#1a1b2e',
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
          border: '1px solid rgba(51, 204, 255, 0.2)',
          background: '#1a1b2e',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
          <AppBar position="static" sx={{ bgcolor: 'background.paper', mb: 2 }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ color: 'primary.main', fontWeight: 700 }}>
                SUMMER CAMPING 2025
              </Typography>
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
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
