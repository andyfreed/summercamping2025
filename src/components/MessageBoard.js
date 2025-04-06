import React from 'react';
import { Box, Container, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

function MessageBoard() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          color="inherit"
          onClick={() => navigate('/')}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          Message Board
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          MESSAGE BOARD
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Community updates and discussions will be displayed here.
        </Typography>
      </Paper>
    </Container>
  );
}

export default MessageBoard; 