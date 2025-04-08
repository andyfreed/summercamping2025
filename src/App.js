import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  createTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  Tab,
  Tabs,
  TextField,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import House from './components/House';
import Boat from './components/Boat';
import Area from './components/Area';
import MessageBoard from './components/MessageBoard';
import Dashboard from './components/Dashboard';
import ScrollToTop from './components/ScrollToTop';
import CountdownTimer from './components/CountdownTimer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignUpForm from './components/SignUpForm';

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

function AppContent() {
  const { user, signOut, signIn } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authTab, setAuthTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut();
      setUserMenuAnchor(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { error } = await signIn({
        email,
        password,
      });
      if (error) throw error;
      setAuthDialogOpen(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUserMenuClick = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  return (
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
                position: 'relative',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'center', sm: 'space-between' },
                alignItems: 'center',
                py: { xs: 2, sm: 1 },
                gap: { xs: 2, sm: 0 }
              }}
            >
              {/* Auth button for mobile - positioned absolutely */}
              <Box
                sx={{
                  display: { xs: 'block', sm: 'none' },
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 2
                }}
              >
                {user ? (
                  <IconButton
                    onClick={handleUserMenuClick}
                    sx={{
                      color: '#FF7E00',
                      '&:hover': {
                        background: 'rgba(255, 126, 0, 0.1)',
                      },
                    }}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => setAuthDialogOpen(true)}
                    startIcon={<LoginIcon />}
                    sx={{
                      borderColor: 'rgba(255, 126, 0, 0.5)',
                      color: '#FF7E00',
                      '&:hover': {
                        borderColor: '#FF7E00',
                        background: 'rgba(255, 126, 0, 0.1)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </Box>

              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: { xs: 1, sm: 3 }
              }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Box
                    component="img"
                    src="/logo.png"
                    alt="Logo"
                    sx={{
                      width: { xs: '100px', sm: '120px' },
                      height: 'auto',
                      filter: 'drop-shadow(0 0 10px rgba(255, 126, 0, 0.3))',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        filter: 'drop-shadow(0 0 15px rgba(255, 126, 0, 0.5))',
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                </Link>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="h4"
                    sx={{ 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #FF7E00 0%, #FFA040 50%, #FF4000 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '1.8rem', sm: '2.2rem' },
                      letterSpacing: '0.05em',
                      textAlign: 'center',
                      position: 'relative',
                      cursor: 'pointer',
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
                </Link>
              </Box>
              <Box sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: { xs: 1, sm: 2 }
              }}>
                <CountdownTimer />
                {/* Auth button for desktop */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  {user ? (
                    <>
                      <IconButton
                        onClick={handleUserMenuClick}
                        sx={{
                          color: '#FF7E00',
                          '&:hover': {
                            background: 'rgba(255, 126, 0, 0.1)',
                          },
                        }}
                      >
                        <AccountCircleIcon />
                      </IconButton>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => setAuthDialogOpen(true)}
                      startIcon={<LoginIcon />}
                      sx={{
                        borderColor: 'rgba(255, 126, 0, 0.5)',
                        color: '#FF7E00',
                        '&:hover': {
                          borderColor: '#FF7E00',
                          background: 'rgba(255, 126, 0, 0.1)',
                        },
                      }}
                    >
                      Sign In
                    </Button>
                  )}
                </Box>
              </Box>
            </Toolbar>
            {user && (
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="textSecondary">
                    Signed in as {user?.email}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            )}
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

      <Dialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Tabs value={authTab} onChange={(e, newValue) => setAuthTab(newValue)}>
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
        </DialogTitle>
        <DialogContent>
          {authTab === 0 ? (
            <Box component="form" onSubmit={handleSignIn} sx={{ mt: 2 }}>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!email || !password}
              >
                Sign In
              </Button>
            </Box>
          ) : (
            <SignUpForm onSignUp={() => {
              setAuthDialogOpen(false);
              setAuthTab(0);
            }} />
          )}
        </DialogContent>
      </Dialog>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
