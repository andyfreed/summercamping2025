import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import TerrainIcon from '@mui/icons-material/Terrain';
import ForumIcon from '@mui/icons-material/Forum';

const sections = [
  { title: 'THE HOUSE', icon: HomeIcon, path: '/house', description: 'House details and management' },
  { title: 'THE BOAT', icon: DirectionsBoatIcon, path: '/boat', description: 'Boat information and scheduling' },
  { title: 'THE AREA', icon: TerrainIcon, path: '/area', description: 'Local attractions and activities' },
  { title: 'MESSAGE BOARD', icon: ForumIcon, path: '/messages', description: 'Community updates and discussions' }
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ height: 'calc(100vh - 88px)', display: 'flex', alignItems: 'center' }}>
      <Grid container spacing={4} justifyContent="center">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Grid item xs={12} sm={6} key={section.title}>
              <Card
                onClick={() => navigate(section.path)}
                sx={{
                  height: '280px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.main}40`,
                    borderColor: 'primary.main',
                  },
                }}
              >
                <CardContent sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  textAlign: 'center', 
                  p: 4 
                }}>
                  <Box sx={{ mb: 3, color: 'primary.main' }}>
                    <Icon sx={{ fontSize: 72 }} />
                  </Box>
                  <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {section.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default Dashboard; 