/**
 * Payment Page
 * Handle payment for booking using Razorpay
 */

import React, { useState, useEffect } from 'react';
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
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookingById } from '../services/bookingService';
import { getVehicleById } from '../services/vehicleService';
import { getDriverById } from '../services/driverService';
import {
  createPaymentOrder,
  initiateRazorpayPayment,
  verifyPaymentSignature,
  updatePaymentStatus,
} from '../services/paymentService';
import { updatePaymentStatus as updateBookingPayment } from '../services/bookingService';
import { formatCurrency } from '../utils/formatters';
import { ROUTES } from '../constants/routes';
import { toast } from 'react-toastify';
import { PAYMENT_STATUS } from '../constants/bookingStatus';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();
  const { currentUser, userDetails } = useAuth();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      setError('');

      // Check if data passed via state
      if (location.state?.booking) {
        setBooking(location.state.booking);
        if (location.state.vehicle) setVehicle(location.state.vehicle);
        if (location.state.driver) setDriver(location.state.driver);
      } else {
        // Fetch from Firebase
        const bookingData = await getBookingById(bookingId);
        setBooking(bookingData);

        if (bookingData.vehicleId) {
          const vehicleData = await getVehicleById(bookingData.vehicleId);
          setVehicle(vehicleData);
        }

        if (bookingData.driverId) {
          const driverData = await getDriverById(bookingData.driverId);
          setDriver(driverData);
        }
      }
    } catch (err) {
      console.error('Error loading booking:', err);
      setError('Failed to load booking details');
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError('');

      // Create payment order in our database
      const orderData = await createPaymentOrder({
        bookingId: booking.bookingId || booking.id,
        userId: currentUser.uid,
        amount: booking.fare,
        userDetails: {
          fullName: userDetails.fullName,
          email: userDetails.email,
          mobileNumber: userDetails.mobileNumber,
        },
      });

      // Initiate Razorpay payment
      await initiateRazorpayPayment(orderData, {
        userName: userDetails.fullName,
        userEmail: userDetails.email,
        userPhone: userDetails.mobileNumber,
        onSuccess: async (response) => {
          await handlePaymentSuccess(response, orderData.orderId);
        },
        onFailure: async (error) => {
          await handlePaymentFailure(error, orderData.orderId);
        },
        onDismiss: () => {
          setProcessing(false);
          toast.info('Payment cancelled');
        },
      });
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError(err.message || 'Failed to initiate payment');
      toast.error(err.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async (razorpayResponse, paymentId) => {
    try {
      // Verify payment signature
      const isValid = verifyPaymentSignature(razorpayResponse);

      if (!isValid) {
        throw new Error('Payment verification failed');
      }

      // Update payment status in payments collection
      await updatePaymentStatus(paymentId, PAYMENT_STATUS.PAID, razorpayResponse);

      // Update booking payment status
      await updateBookingPayment(
        booking.bookingId || booking.id,
        PAYMENT_STATUS.PAID,
        razorpayResponse.razorpay_payment_id
      );

      toast.success('Payment successful!');

      // Navigate to success page
      navigate('/payment/success', {
        state: {
          booking,
          vehicle,
          driver,
          paymentId,
          razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        },
      });
    } catch (err) {
      toast.error('Payment verification failed');
      setProcessing(false);
    }
  };

  const handlePaymentFailure = async (error, paymentId) => {
    try {
      // Update payment status as failed
      await updatePaymentStatus(paymentId, PAYMENT_STATUS.FAILED, {
        error: error.description || error.reason,
      });

      toast.error(error.description || 'Payment failed');

      // Navigate to failure page
      navigate('/payment/failure', {
        state: {
          booking,
          error: error.description || 'Payment failed',
        },
      });
    } catch (err) {
      console.error('Error processing payment failure:', err);
      setProcessing(false);
    }
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
        <Alert severity="error">{error || 'Booking not found'}</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(ROUTES.HOME)}>
          Go to Home
        </Button>
      </Container>
    );
  }

  // Check if already paid
  if (booking.paymentStatus === PAYMENT_STATUS.PAID) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="success" icon={<CheckCircleIcon />}>
          This booking has already been paid.
        </Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(ROUTES.HISTORY)}>
          View Bookings
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <PaymentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            Complete Payment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Secure payment powered by Razorpay
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Booking Summary */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                Booking Summary
              </Typography>

              <Grid container spacing={2}>
                {/* Booking ID */}
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircleIcon color="primary" fontSize="small" />
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                          Booking ID
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                        {booking.bookingId || booking.id}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Pickup Date & Time */}
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <DirectionsCarIcon color="primary" fontSize="small" />
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                          Pickup Date & Time
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={600}>
                        {booking.pickupDate} at {booking.pickupTime}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Route */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOnIcon color="primary" fontSize="small" />
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                          Route
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={booking.sourceAddress?.address}
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ maxWidth: '100%', height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal', py: 1 } }}
                        />
                        <Typography variant="h6" color="primary">→</Typography>
                        <Chip
                          label={booking.destinationAddress?.address}
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ maxWidth: '100%', height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal', py: 1 } }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Vehicle */}
                {vehicle && (
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <DirectionsCarIcon color="primary" fontSize="small" />
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                            Vehicle
                          </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight={600}>
                          {vehicle.model}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {vehicle.type}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Distance */}
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOnIcon color="primary" fontSize="small" />
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                          Distance
                        </Typography>
                      </Box>
                      <Typography variant="h5" fontWeight={600} color="primary">
                        {booking.distance} km
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Fare Breakdown */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Payment Details
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
                      Amount to Pay
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight={700}>
                      {formatCurrency(booking.fare || booking.fareBreakdown.total)}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>
                    Amount to Pay
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight={700}>
                    {formatCurrency(booking.fare)}
                  </Typography>
                </Box>
              )}

              {/* Payment Button */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handlePayment}
                disabled={processing}
                startIcon={processing ? <CircularProgress size={20} /> : <PaymentIcon />}
                sx={{ mt: 2 }}
              >
                {processing ? 'Processing...' : 'Pay Now'}
              </Button>

              {/* Security Notice */}
              <Alert severity="info" icon={<SecurityIcon />} sx={{ mt: 2 }}>
                Your payment is secure. All transactions are encrypted and processed through Razorpay.
              </Alert>
            </Paper>
          </Grid>

          {/* Payment Methods Info */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Accepted Payment Methods
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item>
                    <Chip label="Credit Card" variant="outlined" />
                  </Grid>
                  <Grid item>
                    <Chip label="Debit Card" variant="outlined" />
                  </Grid>
                  <Grid item>
                    <Chip label="UPI" variant="outlined" />
                  </Grid>
                  <Grid item>
                    <Chip label="Net Banking" variant="outlined" />
                  </Grid>
                  <Grid item>
                    <Chip label="Wallets" variant="outlined" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Terms */}
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              By proceeding, you agree to our Terms & Conditions and Refund Policy
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PaymentPage;
