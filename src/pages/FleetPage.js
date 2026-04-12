/**
 * Fleet Page
 * Display all available vehicles
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { getAllVehicles } from '../services/vehicleService';
import VehicleCard from '../components/VehicleCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';
import { toast } from 'react-toastify';

const FleetPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');

  const vehicleTypes = ['All', 'Sedan', 'SUV', 'Hatchback', 'Luxury'];

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vehicles, searchTerm, filterType, filterAvailability]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles. Please try again later.');
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    // Filter by type
    if (filterType !== 'All') {
      filtered = filtered.filter(v => v.type === filterType);
    }

    // Filter by availability
    if (filterAvailability === 'Available') {
      filtered = filtered.filter(v => v.availability === true);
    } else if (filterAvailability === 'Unavailable') {
      filtered = filtered.filter(v => v.availability === false);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.features && v.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    setFilteredVehicles(filtered);
  };

  const handleBookVehicle = (vehicle) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to book a vehicle');
      navigate(ROUTES.SIGN_IN);
      return;
    }
    // Navigate to booking page with pre-selected vehicle
    navigate(ROUTES.BOOKING, { state: { selectedVehicle: vehicle } });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <DirectionsCarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            Our Fleet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Choose from our wide range of vehicles to suit your travel needs
          </Typography>
        </Box>

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Type Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  value={filterType}
                  label="Vehicle Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  {vehicleTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Availability Filter */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select
                  value={filterAvailability}
                  label="Availability"
                  onChange={(e) => setFilterAvailability(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Available">Available</MenuItem>
                  <MenuItem value="Unavailable">Unavailable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Active Filters Display */}
          {(filterType !== 'All' || filterAvailability !== 'All' || searchTerm) && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ mr: 1, alignSelf: 'center' }}>
                Active Filters:
              </Typography>
              {filterType !== 'All' && (
                <Chip label={`Type: ${filterType}`} onDelete={() => setFilterType('All')} size="small" />
              )}
              {filterAvailability !== 'All' && (
                <Chip label={`Status: ${filterAvailability}`} onDelete={() => setFilterAvailability('All')} size="small" />
              )}
              {searchTerm && (
                <Chip label={`Search: ${searchTerm}`} onDelete={() => setSearchTerm('')} size="small" />
              )}
            </Box>
          )}
        </Paper>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Vehicles Grid */}
        {!loading && !error && (
          <>
            {/* Results Count */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Showing {filteredVehicles.length} of {vehicles.length} vehicles
            </Typography>

            {filteredVehicles.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No vehicles found matching your criteria
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your filters
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredVehicles.map((vehicle) => (
                  <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                    <VehicleCard 
                      vehicle={vehicle} 
                      onBook={handleBookVehicle}
                      showBookButton={true}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default FleetPage;
