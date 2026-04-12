/**
 * Navbar Component
 * Main navigation bar with responsive menu
 */

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import { toast } from 'react-toastify';
import { ROUTES } from '../../constants/routes';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, userDetails } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate(ROUTES.HOME);
      handleMenuClose();
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const menuItems = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'Fleet', path: ROUTES.FLEET },
    { label: 'About', path: ROUTES.ABOUT },
    { label: 'Contact', path: ROUTES.CONTACT },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        iCabs
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} onClick={() => navigate(item.path)}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem onClick={() => navigate(ROUTES.BOOKING)}>
            <ListItemText primary="Book a Cab" />
          </ListItem>
        )}
        {isAdmin && (
          <ListItem onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}>
            <ListItemText primary="Admin Portal" />
          </ListItem>
        )}
        {!isAuthenticated ? (
          <>
            <ListItem onClick={() => navigate(ROUTES.SIGN_IN)}>
              <ListItemText primary="Sign In" />
            </ListItem>
            <ListItem onClick={() => navigate(ROUTES.SIGN_UP)}>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        ) : (
          <ListItem onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Mobile Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <DirectionsCarIcon sx={{ display: { xs: 'none', sm: 'block' }, mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }}
              onClick={() => navigate(ROUTES.HOME)}
            >
              iCabs
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  sx={{ color: '#fff', mx: 1 }}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
              {isAuthenticated && (
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mx: 1 }}
                  onClick={() => navigate(ROUTES.BOOKING)}
                >
                  Book a Cab
                </Button>
              )}
              {isAdmin && (
                <Button sx={{ color: '#fff', mx: 1 }} onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}>
                  Admin Portal
                </Button>
              )}
            </Box>

            {/* Auth Buttons */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {!isAuthenticated ? (
                <>
                  <Button sx={{ color: '#fff' }} onClick={() => navigate(ROUTES.SIGN_IN)}>
                    Sign In
                  </Button>
                  <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff', ml: 1 }} onClick={() => navigate(ROUTES.SIGN_UP)}>
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <IconButton color="inherit" onClick={handleMenuOpen}>
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem disabled>
                      <Typography variant="body2">{userDetails?.fullName}</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { navigate(ROUTES.HISTORY); handleMenuClose(); }}>
                      My Bookings
                    </MenuItem>
                    <MenuItem onClick={() => { navigate(ROUTES.CHANGE_PASSWORD); handleMenuClose(); }}>
                      Change Password
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
