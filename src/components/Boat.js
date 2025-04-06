import React from 'react';
import { Box, Container, Typography, Paper, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

function Boat() {
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
          The Boat
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          THE BOAT
        </Typography>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Boat information and scheduling will be displayed here.
        </Typography>
      </Paper>
    </Container>
  );
}

export default Boat; 