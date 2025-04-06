import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function House() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        THE HOUSE
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          House information and management will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default House; 