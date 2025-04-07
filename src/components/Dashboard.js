import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Container, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import TerrainIcon from '@mui/icons-material/Terrain';
import ForumIcon from '@mui/icons-material/Forum';

const sections = [
  { title: 'THE HOUSE', icon: HomeIcon, path: '/house', description: 'House details and management' },
  { title: 'THE BOAT', icon: DirectionsBoatIcon, path: '/boat', description: 'Boat information and scheduling', comingSoon: true },
  { title: 'THE AREA', icon: TerrainIcon, path: '/area', description: 'Local attractions and activities' },
  { title: 'MESSAGE BOARD', icon: ForumIcon, path: '/messages', description: 'Community updates and discussions' }
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        minHeight: { xs: 'auto', sm: 'calc(100vh - 88px)' },
        py: { xs: 2, sm: 4 },
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' }
      }}
    >
      <Grid 
        container 
        spacing={{ xs: 2, sm: 4 }} 
        justifyContent="center"
      >
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Grid item xs={12} sm={6} key={section.title}>
              <Card
                onClick={() => !section.comingSoon && navigate(section.path)}
                sx={{
                  height: { xs: '200px', sm: '280px' },
                  cursor: section.comingSoon ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  opacity: section.comingSoon ? 0.7 : 1,
                  position: 'relative',
                  '&:hover': {
                    transform: section.comingSoon ? 'none' : 'translateY(-8px)',
                    boxShadow: (theme) => section.comingSoon ? 'none' : `0 8px 24px ${theme.palette.primary.main}40`,
                    borderColor: section.comingSoon ? 'grey.500' : 'primary.main',
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
                  p: { xs: 2, sm: 4 }
                }}>
                  {section.comingSoon && (
                    <>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '50%',
                          height: '100%',
                          background: 'linear-gradient(135deg, transparent 0%, rgba(255, 126, 0, 0.05) 100%)',
                          borderRadius: 'inherit',
                          pointerEvents: 'none'
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: { xs: 20, sm: 24 },
                          right: { xs: 20, sm: 24 },
                          background: 'linear-gradient(135deg, #FF7E00 0%, #FFA040 100%)',
                          borderRadius: '16px',
                          boxShadow: '0 4px 12px rgba(255, 126, 0, 0.3)',
                          p: { xs: 1.5, sm: 2 },
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          lineHeight: 1.2,
                        }}
                      >
                        <Typography
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                            textTransform: 'uppercase',
                          }}
                        >
                          Coming
                        </Typography>
                        <Typography
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                            textTransform: 'uppercase',
                          }}
                        >
                          Soon
                        </Typography>
                      </Box>
                    </>
                  )}
                  <Box sx={{ 
                    mb: { xs: 2, sm: 3 }, 
                    color: section.comingSoon ? 'grey.500' : 'primary.main'
                  }}>
                    <Icon sx={{ 
                      fontSize: { xs: 48, sm: 72 } 
                    }} />
                  </Box>
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    gutterBottom 
                    sx={{ 
                      color: section.comingSoon ? 'grey.500' : 'primary.main',
                      mb: 2,
                      fontSize: { xs: '1.75rem', sm: '2.125rem' }
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color={section.comingSoon ? 'text.disabled' : 'text.secondary'}
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
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