/**
 * About Us Page
 * Company information and mission
 */

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlagIcon from '@mui/icons-material/Flag';

const AboutPage = () => {
  const stats = [
    { label: 'Happy Customers', value: '10,000+', icon: <GroupsIcon sx={{ fontSize: 40 }} /> },
    { label: 'Rides Completed', value: '50,000+', icon: <DirectionsCarIcon sx={{ fontSize: 40 }} /> },
    { label: 'Verified Drivers', value: '500+', icon: <VerifiedUserIcon sx={{ fontSize: 40 }} /> },
    { label: 'Cities Covered', value: '25+', icon: <EmojiEventsIcon sx={{ fontSize: 40 }} /> },
  ];

  const values = [
    {
      title: 'Safety First',
      description: 'Your safety is our top priority. All our drivers are verified and vehicles are regularly inspected.',
      icon: <VerifiedUserIcon sx={{ fontSize: 50, color: 'primary.main' }} />
    },
    {
      title: 'Customer Satisfaction',
      description: 'We strive to provide the best service possible and ensure every ride is comfortable and pleasant.',
      icon: <GroupsIcon sx={{ fontSize: 50, color: 'primary.main' }} />
    },
    {
      title: 'Reliability',
      description: 'Count on us for punctual pickups, professional drivers, and well-maintained vehicles.',
      icon: <DirectionsCarIcon sx={{ fontSize: 50, color: 'primary.main' }} />
    },
    {
      title: 'Innovation',
      description: 'We continuously improve our technology and services to enhance your booking experience.',
      icon: <EmojiEventsIcon sx={{ fontSize: 50, color: 'primary.main' }} />
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
            About iCabs
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Your Trusted Partner in Transportation
          </Typography>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Founded in 2020, iCabs was created with a simple mission: to provide safe, reliable, 
              and affordable transportation services to everyone. What started as a small fleet of 
              vehicles has now grown into one of the most trusted cab booking platforms in the region.
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              We understand that getting from point A to point B should be hassle-free. That's why 
              we've built a platform that makes booking a cab as easy as a few taps on your phone. 
              Our commitment to quality service and customer satisfaction has helped us build lasting 
              relationships with thousands of riders.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Today, we continue to expand our services, improve our technology, and most importantly, 
              ensure that every ride with iCabs is a safe and pleasant experience.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                height: 400,
                bgcolor: 'grey.200',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DirectionsCarIcon sx={{ fontSize: 100, color: 'grey.400' }} />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom fontWeight={600} sx={{ mb: 6 }}>
            Our Achievements
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mission & Vision */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%', p: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FlagIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" fontWeight={600}>
                    Our Mission
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  To provide safe, reliable, and affordable transportation services that connect 
                  people to their destinations with ease and comfort. We aim to revolutionize the 
                  way people travel by leveraging technology and maintaining the highest standards 
                  of service quality.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%', p: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <VisibilityIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" fontWeight={600}>
                    Our Vision
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  To become the most trusted and preferred cab booking platform, known for 
                  exceptional service, innovation, and customer satisfaction. We envision a future 
                  where transportation is accessible to everyone, everywhere, at any time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Core Values Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom fontWeight={600} sx={{ mb: 6 }}>
            Our Core Values
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      {value.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
