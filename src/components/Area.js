import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Area() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        THE AREA
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Local attractions and activities will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Area; 