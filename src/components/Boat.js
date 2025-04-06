import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Boat() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        THE BOAT
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Boat information and scheduling will be displayed here.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Boat; 