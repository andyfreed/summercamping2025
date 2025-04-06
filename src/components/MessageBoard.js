import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

function MessageBoard() {
  // Placeholder messages
  const messages = [
    {
      id: 1,
      author: 'John Doe',
      content: 'Welcome to the Summer Camping 2025 message board!',
      timestamp: '2025-04-06 10:00 AM',
    },
    {
      id: 2,
      author: 'Jane Smith',
      content: 'Looking forward to this summer!',
      timestamp: '2025-04-06 10:30 AM',
    },
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
        MESSAGE BOARD
      </Typography>
      <Paper sx={{ p: 3 }}>
        <List>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography component="span" variant="subtitle1" color="primary">
                        {message.author}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {message.timestamp}
                      </Typography>
                    </Box>
                  }
                  secondary={message.content}
                />
              </ListItem>
              {index < messages.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default MessageBoard; 