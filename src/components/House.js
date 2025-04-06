// Testing DreamHost deployment
import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, Card, CardContent, ImageList, ImageListItem, Modal, Breadcrumbs, Link } from '@mui/material';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import HotTubIcon from '@mui/icons-material/HotTub';
import KingBedIcon from '@mui/icons-material/KingBed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import PetsIcon from '@mui/icons-material/Pets';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import WeekendIcon from '@mui/icons-material/Weekend';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

function House() {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const images = [
    {
      url: '/cabin-images/entrance.jpg',
      title: 'Front entrance to cabin with seating area'
    },
    {
      url: '/cabin-images/frontview.jpg',
      title: 'Front view of the cabin'
    },
    {
      url: '/cabin-images/hottub.jpg',
      title: 'Outdoor hot tub'
    },
    {
      url: '/cabin-images/lake-view-1.jpg',
      title: 'Beautiful view of the lake'
    },
    {
      url: '/cabin-images/lake-view-2.jpg',
      title: 'Another stunning lake view'
    },
    {
      url: '/cabin-images/loft.jpg',
      title: 'Cozy loft bedroom'
    }
  ];

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const amenities = [
    { icon: BeachAccessIcon, text: '100\' Private Sandy Beach' },
    { icon: HotTubIcon, text: 'Outdoor Hot Tub' },
    { icon: LocalLaundryServiceIcon, text: 'Washer & Dryer' },
    { icon: PetsIcon, text: 'Pet Friendly (under 50 lbs)' },
    { icon: OutdoorGrillIcon, text: 'Weber Gas Grill' },
    { icon: WifiIcon, text: 'Free WiFi' },
    { icon: LocalParkingIcon, text: 'Parking Available' },
    { icon: WeekendIcon, text: 'Outdoor Space & Deck' }
  ];

  const rooms = [
    {
      name: 'Master Bedroom',
      beds: '2 Queen Beds'
    },
    {
      name: 'Bedroom off kitchen',
      beds: '1 Queen Bed'
    },
    {
      name: 'Loft bedroom',
      beds: '1 Queen Bed'
    },
    {
      name: 'Kids Kabin',
      beds: '8 Twin Beds'
    },
    {
      name: 'Extra Beds',
      beds: '2 Twin Beds and 1 Double Bed'
    }
  ];

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
          The House
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          Lakefront Log Cabin
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Spectacular 3 Bedroom, 3 Bath Waterfront Cabin with Hot Tub
        </Typography>
      </Box>

      {/* Image Gallery Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Photo Gallery
        </Typography>
        <ImageList variant="masonry" cols={3} gap={8}>
          {images.map((image) => (
            <ImageListItem 
              key={image.url}
              onClick={() => handleImageClick(image)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                  transition: 'opacity 0.3s'
                }
              }}
            >
              <img
                src={image.url}
                alt={image.title}
                loading="lazy"
                style={{ borderRadius: '8px' }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              About the Property
            </Typography>
            <Typography paragraph>
              Welcome to our lovely lakefront log cabin home in picturesque Wakefield, NH. Situated on a peaceful cove on the clean 700-acre Balch Lake, this property features a stunning 100'+ sandy beach perfect for family enjoyment.
            </Typography>
            <Typography paragraph>
              The cabin offers three private bedrooms including a lovely loft, plus a downstairs 'Kids Kabin' that can accommodate additional guests. With three bathrooms, two propane fireplaces, and a lovely outdoor hot tub, this home provides the perfect blend of comfort and adventure.
            </Typography>
            <Typography paragraph>
              Enjoy peaceful mornings listening to the loons while sipping coffee on the covered deck, or spend your days engaging in various water activities including canoeing, kayaking, sailing, fishing, and swimming in the crystal-clear lake water.
            </Typography>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Sleeping Arrangements
            </Typography>
            <Grid container spacing={2}>
              {rooms.map((room) => (
                <Grid item xs={12} sm={6} key={room.name}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <KingBedIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                        {room.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {room.beds}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Quick Facts
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><BathtubIcon /></ListItemIcon>
                <ListItemText primary="3 Bathrooms" />
              </ListItem>
              <ListItem>
                <ListItemIcon><KingBedIcon /></ListItemIcon>
                <ListItemText primary="Sleeps up to 16" />
              </ListItem>
              <ListItem>
                <ListItemIcon><WeekendIcon /></ListItemIcon>
                <ListItemText primary="2200 sq ft" />
              </ListItem>
            </List>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Amenities
            </Typography>
            <List>
              {amenities.map((amenity, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <amenity.icon />
                  </ListItemIcon>
                  <ListItemText primary={amenity.text} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal for full-size image view */}
      <Modal
        open={Boolean(selectedImage)}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
            p: 1,
            bgcolor: 'background.paper',
            borderRadius: 2,
            position: 'relative'
          }}
        >
          {selectedImage && (
            <>
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '85vh',
                  objectFit: 'contain'
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: 'center',
                  mt: 1,
                  color: 'text.secondary'
                }}
              >
                {selectedImage.title}
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default House; 