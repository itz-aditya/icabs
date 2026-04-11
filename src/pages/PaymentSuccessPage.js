/**
 * Payment Success Page
 * Display successful payment confirmation
 */

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Divider,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { ROUTES } from '../constants/routes';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking, vehicle, driver, paymentId, razorpayPaymentId } = location.state || {};

  const handleDownloadReceipt = () => {
    // This will be implemented with proper receipt generation
    window.print();
  };

  if (!booking) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h6">No payment details found</Typography>
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
          <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />
          <Typography variant="h3" gutterBottom fontWeight={700} color="success.main">
            Payment Successful!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Your booking is confirmed
          </Typography>
          <Chip
            label={`Payment ID: ${razorpayPaymentId || paymentId}`}
            color="success"
            sx={{ fontWeight: 600 }}
          />
        </Paper>

        {/* Booking Details */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Booking Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
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
                Amount Paid
              </Typography>
              <Typography variant="body1" fontWeight={600} color="success.main">
                {formatCurrency(booking.fare)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Pickup Date & Time
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {booking.pickupDate} at {booking.pickupTime}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Distance
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {booking.distance} km
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Route
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {booking.sourceAddress?.address} → {booking.destinationAddress?.address}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Vehicle & Driver Info */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {vehicle && (
            <Grid item xs={12} sm={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Vehicle
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body1" fontWeight={600}>
                    {vehicle.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {vehicle.type} • {vehicle.capacity} passengers
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          {driver && (
            <Grid item xs={12} sm={6}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Driver
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Typography variant="body1" fontWeight={600}>
                    {driver.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {driver.phone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ⭐ {driver.rating}/5.0
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadReceipt}
          >
            Download Receipt
          </Button>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => navigate(ROUTES.HISTORY)}
          >
            My Bookings
          </Button>
          <Button
            variant="text"
            startIcon={<HomeIcon />}
            onClick={() => navigate(ROUTES.HOME)}
          >
            Back to Home
          </Button>
        </Box>

        {/* Important Info */}
        <Paper elevation={1} sx={{ p: 3, bgcolor: 'success.50', borderColor: 'success.main', borderWidth: 1, borderStyle: 'solid' }}>
          <Typography variant="h6" gutterBottom fontWeight={600} color="success.dark">
            What's Next?
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2" gutterBottom>
              Your booking confirmation has been sent to your email
            </Typography>
            <Typography component="li" variant="body2" gutterBottom>
              Driver will contact you 15 minutes before pickup time
            </Typography>
            <Typography component="li" variant="body2" gutterBottom>
              Please be ready at the pickup location on time
            </Typography>
            <Typography component="li" variant="body2" gutterBottom>
              You can track your booking status in "My Bookings" section
            </Typography>
            <Typography component="li" variant="body2">
              For any queries, contact support: +91 98765 43210
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PaymentSuccessPage;
