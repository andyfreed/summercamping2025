import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';

const TARGET_DATE = new Date('2025-08-08T00:00:00');

const TimeBlock = ({ value, unit }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    minWidth: 50,
  }}>
    <Typography 
      variant="body1" 
      sx={{ 
        color: 'primary.main', 
        fontWeight: 'bold',
        fontSize: '1.1rem',
        lineHeight: 1
      }}
    >
      {value}
    </Typography>
    <Typography 
      variant="caption" 
      sx={{ 
        color: 'text.secondary',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        opacity: 0.8
      }}
    >
      {unit}
    </Typography>
  </Box>
);

const Separator = () => (
  <Divider 
    orientation="vertical" 
    flexItem 
    sx={{ 
      height: '70%',
      my: 'auto',
      borderColor: 'primary.main',
      opacity: 0.3,
      mx: 0.5
    }} 
  />
);

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = TARGET_DATE - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({
          days,
          hours,
          minutes,
          seconds
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      height: '40px',
      bgcolor: 'rgba(255, 215, 0, 0.03)',
      borderRadius: 1,
      px: 2,
    }}>
      <TimeBlock value={timeLeft.days} unit="d" />
      <Separator />
      <TimeBlock value={timeLeft.hours.toString().padStart(2, '0')} unit="h" />
      <Separator />
      <TimeBlock value={timeLeft.minutes.toString().padStart(2, '0')} unit="m" />
      <Separator />
      <TimeBlock value={timeLeft.seconds.toString().padStart(2, '0')} unit="s" />
    </Box>
  );
} 