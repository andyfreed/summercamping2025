import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Breadcrumbs, Link, Tabs, Tab, List, ListItem, ListItemText, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

function Area() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const stripClubs = [
    {
      name: "Kittens Gentlemen's Club",
      location: "Salisbury, MA",
      tagline: "The Purrfect Detour",
      description: "Welcome to Kittens, where the claws come out... in the classiest way possible. Tucked just off the coast in Salisbury, this feline-inspired fantasy land brings together ocean breeze and pole tease. Whether you're escaping the mundane or just need a good purr, Kittens offers a tight but tidy spot to sip, sit, and pretend you're more mysterious than you really are. Bonus points if you arrive on a motorcycle like a brooding antihero — just don't actually bring a kitten, they have enough already."
    },
    {
      name: "Ten's Showclub",
      location: "Salisbury, MA",
      tagline: "Where Tens are Standard Issue",
      description: "Ten's is like if a Vegas lounge and a 90s R&B music video had a beautiful, glittery baby. You walk in, the lights dim, and suddenly you're questioning your life choices... in the best way. There's champagne, there's sparkle, and somewhere in the background is a guy named Dave pretending it's his birthday again. The only numbers that matter here are 10s — whether that's the performers, the heels, or the credit card bill you'll be rationalizing on Monday."
    },
    {
      name: "Millennium Cabaret",
      location: "Bedford, NH",
      tagline: "The Future Is Now… and It's Wearing Heels",
      description: "At Millennium Cabaret, they didn't come to play — they came to conquer. Think neon lights, multiple stages, and enough square footage to get your steps in between performances. This place is part space station, part bachelor party fever dream. Order a steak, vibe with the DJ, and let yourself be whisked into a dimension where the lap dances are abundant and shame is checked at the door. The name might be futuristic, but the motto is timeless: 'Treat yourself, you beautiful mess.'"
    }
  ];

  const restaurants = [
    {
      name: "Knotty Pine Grill & Tavern",
      location: "551 Pine River Pond Rd, Sanbornville, NH 03872",
      tagline: "Where the only thing straighter than the pine is the shot of whiskey you're about to down.",
      description: "Nestled among the trees, Knotty Pine offers a rustic ambiance that screams 'cabin fever' in the best possible way. Their menu boasts everything from hearty steaks to seafood that didn't have to travel far to meet your plate. It's the kind of place where the napkins are as thick as the accents, and the only thing warmer than the hearth is the welcome."
    },
    {
      name: "Wakefield Inn & Restaurant",
      location: "2723 Wakefield Rd, Wakefield, NH 03872",
      tagline: "Where history meets haute cuisine, and your diet plans meet their untimely demise.",
      description: "Housed in a building older than your great-great-grandma, the Wakefield Inn serves up a slice of history with every meal. Their menu is a delightful mix of classic dishes and modern twists, ensuring that both your palate and your Instagram feed are well catered for. Just remember, the creaky floors aren't ghosts—it's just the sound of calories sneaking up on you."
    },
    {
      name: "Blue Bay Seafood & Steaks",
      location: "3381 Province Lake Rd, East Wakefield, NH 03830",
      tagline: "Where surf meets turf, and your belt meets a new notch.",
      description: "Perched conveniently near the Maine border, Blue Bay is the Switzerland of dining—neutral ground for seafood lovers and steak enthusiasts to break bread together. Whether you're in the mood for a lobster that tastes like it did the backstroke to your plate or a steak so tender it practically carves itself, they've got you covered. Just be prepared to loosen that belt; it's not just a meal, it's an experience."
    }
  ];

  const otherAttractions = [
    {
      name: "Treasure Trove",
      location: "Sanbornville, NH",
      tagline: "Where one person's attic meets another person's treasure chest.",
      description: "At first glance, Treasure Trove might seem like your typical indoor flea market. But delve deeper, and you'll discover a labyrinth of curiosities ranging from vintage collectibles to items that defy categorization. It's the kind of place where you might enter looking for a lamp and leave with a taxidermied squirrel wearing a top hat."
    },
    {
      name: "District No. 2 Schoolhouse (The Little Red Schoolhouse)",
      location: "Wakefield, NH",
      tagline: "Time travel back to when chalkboards were the height of technology.",
      description: "This charming one-room schoolhouse, built in 1858, offers a nostalgic glimpse into 19th-century education. Now serving as a museum, it's a place where you can marvel at antique desks, vintage textbooks, and perhaps ponder how students survived without Wi-Fi. It's a history lesson wrapped in red brick."
    },
    {
      name: "Newichawannock Canal",
      location: "Wakefield, NH",
      tagline: "A canal so nice, they named it... unpronounceably.",
      description: "Constructed in the mid-19th century to boost water flow for mills miles away, this 0.75-mile canal is a testament to human ingenuity and perhaps overambition. Spanning the border between New Hampshire and Maine, it's a serene spot for contemplation and practicing the art of pronouncing 'Newichawannock' without tripping over your tongue."
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
          The Area
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          THE AREA
        </Typography>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Strip Clubs" />
          <Tab label="Restaurants and Bars" />
          <Tab label="Other Attractions" />
        </Tabs>
      </Paper>

      {selectedTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <List>
            {stripClubs.map((club, index) => (
              <React.Fragment key={club.name}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="h6" color="primary">
                        {club.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="subtitle1"
                          color="text.primary"
                          sx={{ display: 'block', fontStyle: 'italic' }}
                        >
                          {club.tagline}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          {club.location}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body1"
                          color="text.primary"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          {club.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {selectedTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <List>
            {restaurants.map((restaurant, index) => (
              <React.Fragment key={restaurant.name}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="h6" color="primary">
                        {restaurant.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="subtitle1"
                          color="text.primary"
                          sx={{ display: 'block', fontStyle: 'italic' }}
                        >
                          {restaurant.tagline}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          {restaurant.location}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body1"
                          color="text.primary"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          {restaurant.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {selectedTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <List>
            {otherAttractions.map((attraction, index) => (
              <React.Fragment key={attraction.name}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="h6" color="primary">
                        {attraction.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="subtitle1"
                          color="text.primary"
                          sx={{ display: 'block', fontStyle: 'italic' }}
                        >
                          {attraction.tagline}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          {attraction.location}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body1"
                          color="text.primary"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          {attraction.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default Area; 