import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Breadcrumbs, Link, Card, CardContent, Grid, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import WavesIcon from '@mui/icons-material/Waves';
import { useNavigate } from 'react-router-dom';

function Boat() {
  const navigate = useNavigate();
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Handle video load event
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

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
        <Typography variant="h3" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold', position: 'relative', zIndex: 2 }}>
          THE BOAT
        </Typography>
      </Box>

      {/* Video Background Card */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          height: '60vh',
          mb: 4,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 1,
          },
        }}
      >
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={handleVideoLoaded}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: videoLoaded ? 1 : 0,
            transition: 'opacity 1s ease',
          }}
        >
          <source src="/videos/boat-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </Box>

        {/* Fallback image while video loads */}
        {!videoLoaded && (
          <Box
            component="img"
            src="/cabin-images/boat-fallback.jpg"
            alt="Boat"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Content overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            p: 4,
            color: 'white',
            textAlign: 'center',
          }}
        >
          <DirectionsBoatIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h2" component="h2" gutterBottom sx={{ 
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
            fontWeight: 'bold',
            mb: 3,
          }}>
            Lake Adventures Await
          </Typography>
          <Typography variant="h5" sx={{ 
            maxWidth: '800px', 
            mb: 4,
            textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
          }}>
            Explore the pristine waters of Lake Chelan aboard our pontoon boat
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<WavesIcon />}
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.1rem',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 126, 0, 0.7)',
              '&:hover': {
                background: 'rgba(255, 126, 0, 0.9)',
              },
            }}
          >
            Reserve Your Boat Time
          </Button>
        </Box>
      </Box>

      {/* Boat Information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom color="primary">
              About Our Pontoon Boat
            </Typography>
            <Typography variant="body1" paragraph>
              Our spacious pontoon boat is perfect for exploring Lake Chelan, offering comfortable seating for up to 10 people. With a powerful motor and stable design, it's ideal for both relaxing cruises and water activities.
            </Typography>
            <Typography variant="body1" paragraph>
              The boat comes equipped with a sunshade canopy, bluetooth speakers, and plenty of space for your picnic supplies or fishing gear. Life jackets are provided for all passengers.
            </Typography>
            <Typography variant="body1">
              Please check the calendar below to reserve your time slot. Each family will have designated days for boat usage to ensure everyone gets equal lake time.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                Boat Schedule
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Reservation system will be available closer to the camping date.
              </Typography>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'background.paper', 
                border: '1px dashed rgba(255, 126, 0, 0.3)',
                borderRadius: 2,
                textAlign: 'center',
                mt: 2
              }}>
                <Typography variant="body2">
                  Check back in June 2025 for boat scheduling
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Boat; 