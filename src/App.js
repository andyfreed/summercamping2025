import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography } from '@mui/material';
import { theme } from './theme';
import House from './components/House';
import Boat from './components/Boat';
import Area from './components/Area';
import MessageBoard from './components/MessageBoard';
import Dashboard from './components/Dashboard';

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
