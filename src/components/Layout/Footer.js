/**
 * Footer Component
 * Application footer with links and info
 */

import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DirectionsCarIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={700}>
                iCabs
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your trusted cab booking service. Safe, reliable, and affordable transportation at your fingertips.
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                color="inherit"
                underline="hover"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => navigate(ROUTES.HOME)}
              >
                Home
              </Link>
              <Link
                color="inherit"
                underline="hover"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => navigate(ROUTES.FLEET)}
              >
                Our Fleet
              </Link>
              <Link
                color="inherit"
                underline="hover"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => navigate(ROUTES.ABOUT)}
              >
                About Us
              </Link>
              <Link
                color="inherit"
                underline="hover"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => navigate(ROUTES.CONTACT)}
              >
                Contact Us
              </Link>
              <Link
                color="inherit"
                underline="hover"
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => navigate(ROUTES.FEEDBACK)}
              >
                Feedback
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: support@icabs.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Phone: +91 98765 43210
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Address: 123 Main Street, City, State 110001
            </Typography>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} iCabs. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
