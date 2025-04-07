import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';

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

const CompactDisplay = ({ timeLeft }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'center',
    gap: { xs: 1, sm: 2 }
  }}>
    <TimeBlock value={timeLeft.days} label="DAYS" />
    <Typography sx={{ opacity: 0.7, fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>:</Typography>
    <TimeBlock value={timeLeft.hours} label="HRS" />
    <Typography sx={{ opacity: 0.7, fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>:</Typography>
    <TimeBlock value={timeLeft.minutes} label="MIN" />
    <Typography sx={{ opacity: 0.7, fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>:</Typography>
    <TimeBlock value={timeLeft.seconds} label="SEC" />
  </Box>
);

const ExpandedDetails = ({ timeLeft }) => (
  <Box sx={{ 
    mt: 2, 
    p: 2, 
    borderRadius: 2,
    background: 'rgba(255, 126, 0, 0.1)',
    backdropFilter: 'blur(10px)'
  }}>
    <Typography 
      variant="body1" 
      sx={{ 
        mb: 1,
        fontSize: { xs: '1rem', sm: '1.2rem' }
      }}
    >
      {timeLeft.years} years, {timeLeft.months} months, and {timeLeft.weeks} weeks
    </Typography>
    <Typography 
      variant="body2" 
      sx={{ 
        opacity: 0.8,
        fontSize: { xs: '0.9rem', sm: '1.1rem' }
      }}
    >
      {Math.round(timeLeft.percentComplete)}% of 2024 complete
    </Typography>
  </Box>
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
      borderRadius: 1,
      px: 2,
    }}>
      <TimeBlock value={timeLeft.days} label="DAYS" />
      <TimeBlock value={timeLeft.hours.toString().padStart(2, '0')} label="HRS" />
      <TimeBlock value={timeLeft.minutes.toString().padStart(2, '0')} label="MIN" />
      <TimeBlock value={timeLeft.seconds.toString().padStart(2, '0')} label="SEC" />
    </Box>
  );
} 