/**
 * Booking Confirmation Page
 * Display booking details after successful creation
 */

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getBookingById } from '../services/bookingService';
import { getVehicleById } from '../services/vehicleService';
import { getDriverById } from '../services/driverService';
import { formatCurrency } from '../utils/formatters';
import { ROUTES } from '../constants/routes';
import { toast } from 'react-toastify';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [driver, setDriver] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if booking data was passed via state
    if (location.state?.booking) {
      loadBookingDetails(location.state.booking.id);
    } else if (bookingId) {
      loadBookingDetails(bookingId);
    } else {
      setError('No booking found');
      setLoading(false);
    }
  }, [bookingId, location.state]);

  const loadBookingDetails = async (id) => {
    try {
      setLoading(true);
      setError('');

      const bookingData = await getBookingById(id);
      setBooking(bookingData);

      // Fetch vehicle details
      if (bookingData.vehicleId) {
        const vehicleData = await getVehicleById(bookingData.vehicleId);
        setVehicle(vehicleData);
      }

      // Fetch driver details
      if (bookingData.driverId) {
        const driverData = await getDriverById(bookingData.driverId);
        setDriver(driverData);
      }
    } catch (err) {
      console.error('Error loading booking:', err);
      setError('Failed to load booking details');
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    navigate(`/payment/${booking.id}`, {
      state: { booking, vehicle, driver }
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !booking) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          {error || 'Booking not found'}
        </Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(ROUTES.HOME)}>
          Go to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        {/* Success Header */}
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mb: 4 }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Booking Confirmed!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Your booking has been successfully created
          </Typography>
          <Chip
            label={`Booking ID: ${booking.bookingId || booking.id}`}
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        </Paper>

        {/* Booking Details */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Trip Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <CalendarTodayIcon sx={{ color: 'primary.main', mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pickup Date & Time
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {booking.pickupDate} at {booking.pickupTime}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <DirectionsCarIcon sx={{ color: 'primary.main', mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Distance
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {booking.distance} km
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <LocationOnIcon sx={{ color: 'success.main', mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pickup Location
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {booking.sourceAddress?.address || booking.sourceAddress}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <LocationOnIcon sx={{ color: 'error.main', mt: 0.5 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Destination
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {booking.destinationAddress?.address || booking.destinationAddress}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Vehicle & Driver Details */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Vehicle Details */}
          {vehicle && (
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Vehicle Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    {vehicle.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {vehicle.type} • {vehicle.capacity} passengers
                  </Typography>
                  {vehicle.licensePlate && (
                    <Typography variant="body2" color="text.secondary">
                      License: {vehicle.licensePlate}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Driver Details */}
          {driver && (
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Driver Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" fontWeight={600} gutterBottom>
                    {driver.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Phone: {driver.phone}
                  </Typography>
                  {driver.rating && (
                    <Typography variant="body2" color="text.secondary">
                      Rating: ⭐ {driver.rating}/5.0
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Fare Summary */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Fare Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {booking.fareBreakdown ? (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Base Price
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatCurrency(booking.fareBreakdown.basePrice)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Distance Charge ({booking.fareBreakdown.distance} km)
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatCurrency(booking.fareBreakdown.distanceCharge)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Tax (5%)
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatCurrency(booking.fareBreakdown.tax)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Total Amount
                </Typography>
                <Typography variant="h6" color="primary" fontWeight={700}>
                  {formatCurrency(booking.fare || booking.fareBreakdown.total)}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" fontWeight={700} color="primary">
              Total: {formatCurrency(booking.fare)}
            </Typography>
          )}
        </Paper>

        {/* Payment Status */}
        <Alert severity={booking.paymentStatus === 'PAID' ? 'success' : 'warning'} sx={{ mb: 3 }}>
          {booking.paymentStatus === 'PAID' ? (
            'Payment completed successfully'
          ) : (
            'Payment is pending. Please complete the payment to confirm your booking.'
          )}
        </Alert>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {booking.paymentStatus !== 'PAID' && (
            <Button
              variant="contained"
              size="large"
              startIcon={<PaymentIcon />}
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </Button>
          )}
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(ROUTES.HISTORY)}
          >
            View All Bookings
          </Button>
          <Button
            variant="text"
            size="large"
            onClick={() => navigate(ROUTES.HOME)}
          >
            Back to Home
          </Button>
        </Box>

        {/* Important Notes */}
        <Paper elevation={1} sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Important Notes
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary" gutterBottom>
              Driver will contact you 15 minutes before pickup time
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" gutterBottom>
              Please be ready at the pickup location on time
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" gutterBottom>
              You can cancel this booking up to 2 hours before pickup time
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary" gutterBottom>
              For any issues, contact our support: +91 98765 43210
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookingConfirmationPage;
