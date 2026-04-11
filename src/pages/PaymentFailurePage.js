/**
 * Payment Failure Page
 * Display payment failure information
 */

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  Grid,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import SupportIcon from '@mui/icons-material/Support';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { ROUTES } from '../constants/routes';

const PaymentFailurePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking, error } = location.state || {};

  const handleRetryPayment = () => {
    if (booking) {
      navigate(`/payment/${booking.bookingId || booking.id}`, {
        state: { booking },
      });
    }
  };

  if (!booking) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">No payment details found</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(ROUTES.HOME)}>
          Go to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        {/* Failure Header */}
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mb: 4 }}>
          <CancelIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
          <Typography variant="h3" gutterBottom fontWeight={700} color="error.main">
            Payment Failed
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Your payment could not be processed
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>

        {/* Booking Details */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Booking Details
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Booking ID
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {booking.bookingId || booking.id}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Amount
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formatCurrency(booking.fare)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Pickup Date & Time
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {booking.pickupDate} at {booking.pickupTime}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Reasons */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Common Reasons for Payment Failure
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2" gutterBottom>
              Insufficient balance in your account
            </Typography>
            <Typography component="li" variant="body2" gutterBottom>
              Incorrect card details or CVV
            </Typography>
            <Typography component="li" variant="body2" gutterBottom>
              Card expired or blocked
            </Typography>
            <Typography component="li" variant="body2" gutterBottom>
              Network issue during payment processing
            </Typography>
            <Typography component="li" variant="body2">
              Payment cancelled by user
            </Typography>
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<RefreshIcon />}
            onClick={handleRetryPayment}
          >
            Retry Payment
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate(ROUTES.HOME)}
          >
            Back to Home
          </Button>
        </Box>

        {/* Help Section */}
        <Alert severity="info" icon={<SupportIcon />}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Need Help?
          </Typography>
          <Typography variant="body2">
            If you're facing issues with payment, please contact our support team at{' '}
            <strong>+91 98765 43210</strong> or email us at{' '}
            <strong>support@icabs.com</strong>
          </Typography>
        </Alert>

        {/* Note */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Your booking is still active. You can complete the payment later from your bookings page.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PaymentFailurePage;
