/**
 * Home Page
 * Landing page for the application
 */

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <DirectionsCarIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Wide Fleet Selection',
      description: 'Choose from a variety of vehicles that suit your needs and budget',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Safe & Secure',
      description: 'All our drivers are verified and vehicles are regularly inspected',
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Easy Payments',
      description: 'Multiple payment options including cards, UPI, and wallets',
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: '24/7 Availability',
      description: 'Book a cab anytime, anywhere - we are always at your service',
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Verified Drivers',
      description: 'Professional and courteous drivers with excellent track records',
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Customer Support',
      description: 'Dedicated support team to help you with any queries or issues',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
            Welcome to i Cabs
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Your trusted cab booking service - Safe, Reliable, and Affordable
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate(ROUTES.BOOKING)}
                sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              >
                Book a Cab Now
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate(ROUTES.SIGN_UP)}
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate(ROUTES.SIGN_IN)}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Sign In
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom fontWeight={600}>
          Why Choose iCabs?
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}>
          We provide the best cab booking experience with our reliable service and customer-first approach
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4,
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'background.default',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of satisfied customers who trust iCabs for their transportation needs
          </Typography>
          {!isAuthenticated && (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(ROUTES.SIGN_UP)}
              sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
            >
              Sign Up Now
            </Button>
          )}
          {isAuthenticated && (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(ROUTES.BOOKING)}
              sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
            >
              Book Your Ride
            </Button>
          )}
        </Container>
      </Paper>
    </Box>
  );
};

export default HomePage;
