/**
 * Booking Page
 * Cab booking form page with address autocomplete and fare calculation
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { createBooking } from '../services/bookingService';
import { getAvailableVehicles } from '../services/vehicleService';
import { getAvailableDrivers } from '../services/driverService';
import { calculateDistance } from '../utils/distanceCalculator';
import { calculateFare } from '../utils/fareCalculator';
import { loadGoogleMapsAPI } from '../utils/loadGoogleMaps';
import AddressAutocomplete from '../components/AddressAutocomplete';
import VehicleCard from '../components/VehicleCard';
import { formatCurrency } from '../utils/formatters';
import { ROUTES } from '../constants/routes';

// Validation schema
const schema = yup.object({
  pickupDate: yup
    .string()
    .required('Pickup date is required'),
  pickupTime: yup
    .string()
    .required('Pickup time is required'),
  sourceAddress: yup
    .string()
    .required('Pickup location is required'),
  destinationAddress: yup
    .string()
    .required('Destination is required'),
  vehicleId: yup
    .string()
    .required('Please select a vehicle'),
}).required();

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userDetails } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [sourceCoords, setSourceCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [distance, setDistance] = useState(0);
  const [fareBreakdown, setFareBreakdown] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  const steps = ['Trip Details', 'Select Vehicle', 'Confirm Booking'];

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      pickupDate: '',
      pickupTime: '',
      sourceAddress: '',
      destinationAddress: '',
      vehicleId: '',
    },
  });

  const watchedVehicleId = watch('vehicleId');

  useEffect(() => {
    // Load Google Maps API
    loadGoogleMapsAPI()
      .then(() => {
        setMapsLoaded(true);
        console.log('Google Maps loaded successfully');
      })
      .catch(err => {
        console.error('Failed to load Google Maps:', err);
        toast.warning('Address autocomplete not available');
      });

    // Fetch available vehicles
    fetchVehicles();

    // Check if vehicle was pre-selected from fleet page
    if (location.state?.selectedVehicle) {
      const vehicle = location.state.selectedVehicle;
      setSelectedVehicle(vehicle);
      setValue('vehicleId', vehicle.id);
    }
  }, []);

  useEffect(() => {
    // Calculate distance when both addresses have coordinates
    if (sourceCoords && destCoords) {
      const dist = calculateDistance(
        sourceCoords.lat,
        sourceCoords.lng,
        destCoords.lat,
        destCoords.lng
      );
      setDistance(dist);
    }
  }, [sourceCoords, destCoords]);

  useEffect(() => {
    // Calculate fare when distance and vehicle are selected
    if (distance > 0 && selectedVehicle) {
      const fare = calculateFare(distance, selectedVehicle);
      setFareBreakdown(fare);
    }
  }, [distance, selectedVehicle]);

  useEffect(() => {
    // Update selected vehicle when vehicleId changes
    if (watchedVehicleId && vehicles.length > 0) {
      const vehicle = vehicles.find(v => v.id === watchedVehicleId);
      setSelectedVehicle(vehicle);
    }
  }, [watchedVehicleId, vehicles]);

  const fetchVehicles = async () => {
    try {
      const data = await getAvailableVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      toast.error('Failed to load vehicles');
    }
  };

  const handleSourceSelect = (placeData) => {
    setSourceCoords({ lat: placeData.lat, lng: placeData.lng });
  };

  const handleDestSelect = (placeData) => {
    setDestCoords({ lat: placeData.lat, lng: placeData.lng });
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setValue('vehicleId', vehicle.id);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      if (!fareBreakdown) {
        throw new Error('Fare calculation failed');
      }

      // Get available driver
      const drivers = await getAvailableDrivers();
      if (drivers.length === 0) {
        throw new Error('No drivers available at the moment');
      }

      // Assign first available driver (simple logic for now)
      const assignedDriver = drivers[0];

      const bookingData = {
        userId: currentUser.uid,
        userDetails: {
          fullName: userDetails.fullName,
          email: userDetails.email,
          mobileNumber: userDetails.mobileNumber,
        },
        driverId: assignedDriver.id,
        vehicleId: selectedVehicle.id,
        pickupDate: data.pickupDate,
        pickupTime: data.pickupTime,
        sourceAddress: {
          address: data.sourceAddress,
          lat: sourceCoords?.lat || 0,
          lng: sourceCoords?.lng || 0,
        },
        destinationAddress: {
          address: data.destinationAddress,
          lat: destCoords?.lat || 0,
          lng: destCoords?.lng || 0,
        },
        distance: distance,
        fare: fareBreakdown.total,
        fareBreakdown: fareBreakdown,
      };

      const bookingId = await createBooking(bookingData);

      toast.success('Booking created successfully!');

      // Navigate to payment page or confirmation
      navigate(`${ROUTES.BOOKING_CONFIRM}/${bookingId}`, {
        state: { booking: { ...bookingData, id: bookingId } }
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Failed to create booking');
      toast.error(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <DirectionsCarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            Book Your Cab
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fill in the details to book your ride
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Left Column - Form */}
            <Grid item xs={12} md={8}>
              {/* Step 1: Trip Details */}
              {activeStep === 0 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Trip Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={2}>
                    {/* Pickup Date */}
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="pickupDate"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="date"
                            label="Pickup Date"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.pickupDate}
                            helperText={errors.pickupDate?.message}
                            disabled={loading}
                            InputProps={{
                              startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                            inputProps={{
                              min: new Date().toISOString().split('T')[0]
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Pickup Time */}
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="pickupTime"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type="time"
                            label="Pickup Time"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.pickupTime}
                            helperText={errors.pickupTime?.message}
                            disabled={loading}
                            InputProps={{
                              startAdornment: <AccessTimeIcon sx={{ mr: 1, color: 'action.active' }} />
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Source Address */}
                    <Grid item xs={12}>
                      <Controller
                        name="sourceAddress"
                        control={control}
                        render={({ field }) => (
                          <AddressAutocomplete
                            {...field}
                            label="Pickup Location"
                            placeholder="Enter your pickup address"
                            error={!!errors.sourceAddress}
                            helperText={errors.sourceAddress?.message || 'Start typing to search for an address'}
                            disabled={loading}
                            required
                            onPlaceSelected={handleSourceSelect}
                            InputProps={{
                              startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'success.main' }} />
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Destination Address */}
                    <Grid item xs={12}>
                      <Controller
                        name="destinationAddress"
                        control={control}
                        render={({ field }) => (
                          <AddressAutocomplete
                            {...field}
                            label="Destination"
                            placeholder="Enter your destination address"
                            error={!!errors.destinationAddress}
                            helperText={errors.destinationAddress?.message || 'Start typing to search for an address'}
                            disabled={loading}
                            required
                            onPlaceSelected={handleDestSelect}
                            InputProps={{
                              startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'error.main' }} />
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* Distance Display */}
                    {distance > 0 && (
                      <Grid item xs={12}>
                        <Alert severity="info">
                          Estimated Distance: <strong>{distance} km</strong>
                        </Alert>
                      </Grid>
                    )}
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!sourceCoords || !destCoords}
                    >
                      Next: Select Vehicle
                    </Button>
                  </Box>
                </Paper>
              )}

              {/* Step 2: Select Vehicle */}
              {activeStep === 1 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Select Your Vehicle
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  {vehicles.length === 0 ? (
                    <Alert severity="warning">
                      No vehicles available at the moment. Please try again later.
                    </Alert>
                  ) : (
                    <Grid container spacing={2}>
                      {vehicles.map((vehicle) => (
                        <Grid item xs={12} sm={6} key={vehicle.id}>
                          <Box
                            onClick={() => handleVehicleSelect(vehicle)}
                            sx={{
                              cursor: 'pointer',
                              border: selectedVehicle?.id === vehicle.id ? 3 : 1,
                              borderColor: selectedVehicle?.id === vehicle.id ? 'primary.main' : 'divider',
                              borderRadius: 2,
                              transition: 'all 0.2s',
                              '&:hover': {
                                borderColor: 'primary.main',
                                boxShadow: 2,
                              }
                            }}
                          >
                            <VehicleCard vehicle={vehicle} showBookButton={false} />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!selectedVehicle}
                    >
                      Next: Confirm Booking
                    </Button>
                  </Box>
                </Paper>
              )}

              {/* Step 3: Confirm Booking */}
              {activeStep === 2 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Confirm Your Booking
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  {/* Booking Summary */}
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Trip Details
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Pickup Date & Time
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {watch('pickupDate')} at {watch('pickupTime')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Distance
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {distance} km
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        From
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {watch('sourceAddress')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        To
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {watch('destinationAddress')}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        Selected Vehicle
                      </Typography>
                    </Grid>
                    {selectedVehicle && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Vehicle Model
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {selectedVehicle.model}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">
                            Vehicle Type
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {selectedVehicle.type}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Confirm & Proceed to Payment'}
                    </Button>
                  </Box>
                </Paper>
              )}
            </Grid>

            {/* Right Column - Fare Summary */}
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Fare Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {fareBreakdown ? (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Base Price
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(fareBreakdown.basePrice)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Distance Charge ({fareBreakdown.distance} km × {formatCurrency(fareBreakdown.pricePerKm)})
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(fareBreakdown.distanceCharge)}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Subtotal
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(fareBreakdown.subtotal)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tax (5%)
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(fareBreakdown.tax)}
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" fontWeight={700}>
                        Total
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        {formatCurrency(fareBreakdown.total)}
                      </Typography>
                    </Box>
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Final fare may vary based on actual route taken
                    </Alert>
                  </Box>
                ) : (
                  <Alert severity="info">
                    Please complete trip details and select a vehicle to see fare estimate
                  </Alert>
                )}

                {/* Selected Vehicle Info */}
                {selectedVehicle && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      Selected Vehicle
                    </Typography>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body1" fontWeight={600} gutterBottom>
                          {selectedVehicle.model}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedVehicle.type} • {selectedVehicle.capacity} passengers
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default BookingPage;
