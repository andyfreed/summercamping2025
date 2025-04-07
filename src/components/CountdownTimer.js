import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const TARGET_DATE = new Date('2025-08-08T00:00:00');

const TimeBlock = ({ value, label }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    mx: { xs: 0.5, sm: 1 }
  }}>
    <Typography 
      variant="h5" 
      sx={{ 
        fontWeight: 'bold',
        fontSize: { xs: '1.5rem', sm: '1.8rem' },
        background: 'linear-gradient(135deg, #FF7E00 0%, #FFA040 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {value}
    </Typography>
    <Typography 
      variant="caption" 
      sx={{ 
        fontSize: { xs: '0.75rem', sm: '0.9rem' },
        opacity: 0.8 
      }}
    >
      {label}
    </Typography>
  </Box>
);

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    years: 0,
    months: 0,
    weeks: 0,
    percentComplete: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = TARGET_DATE - now;

      if (difference > 0) {
        // Calculate all time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        // Calculate years, months, and weeks
        const years = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        const weeks = Math.floor(((days % 365) % 30) / 7);

        // Calculate percentage of 2025 complete
        const startOf2025 = new Date('2025-01-01T00:00:00');
        const endOf2025 = new Date('2025-12-31T23:59:59');
        const percentComplete = ((now - startOf2025) / (endOf2025 - startOf2025)) * 100;

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          years,
          months,
          weeks,
          percentComplete
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
      borderRadius: 1,
      px: 2,
    }}>
      <TimeBlock value={timeLeft.days} label="DAYS" />
      <Typography sx={{ opacity: 0.7, fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>:</Typography>
      <TimeBlock value={timeLeft.hours.toString().padStart(2, '0')} label="HRS" />
      <Typography sx={{ opacity: 0.7, fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>:</Typography>
      <TimeBlock value={timeLeft.minutes.toString().padStart(2, '0')} label="MIN" />
      <Typography sx={{ opacity: 0.7, fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>:</Typography>
      <TimeBlock value={timeLeft.seconds.toString().padStart(2, '0')} label="SEC" />
    </Box>
  );
}

export default CountdownTimer; 