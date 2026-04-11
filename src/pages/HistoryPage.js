/**
 * Booking History Page
 * Display all user bookings
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaymentIcon from '@mui/icons-material/Payment';
import CancelIcon from '@mui/icons-material/Cancel';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookingsByUser, cancelBooking } from '../services/bookingService';
import { formatCurrency } from '../utils/formatters';
import { ROUTES } from '../constants/routes';
import { toast } from 'react-toastify';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../constants/bookingStatus';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [bookings, filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getBookingsByUser(currentUser.uid);
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filterStatus === 'All') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === filterStatus));
    }
  };

  const handleViewDetails = (booking) => {
    navigate(`${ROUTES.BOOKING_CONFIRM}/${booking.id}`, {
      state: { booking },
    });
  };

  const handlePayNow = (booking) => {
    navigate(`/payment/${booking.id}`, {
      state: { booking },
    });
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh list
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      [BOOKING_STATUS.PENDING]: 'warning',
      [BOOKING_STATUS.CONFIRMED]: 'info',
      [BOOKING_STATUS.ASSIGNED]: 'primary',
      [BOOKING_STATUS.IN_PROGRESS]: 'secondary',
      [BOOKING_STATUS.COMPLETED]: 'success',
      [BOOKING_STATUS.CANCELLED]: 'error',
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      [PAYMENT_STATUS.PENDING]: 'warning',
      [PAYMENT_STATUS.PAID]: 'success',
      [PAYMENT_STATUS.FAILED]: 'error',
      [PAYMENT_STATUS.REFUNDED]: 'info',
    };
    return colors[status] || 'default';
  };

  const canCancel = (booking) => {
    return (
      booking.status !== BOOKING_STATUS.CANCELLED &&
      booking.status !== BOOKING_STATUS.COMPLETED
    );
  };

  const needsPayment = (booking) => {
    return booking.paymentStatus === PAYMENT_STATUS.PENDING;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <HistoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" component="h1" fontWeight={700}>
              My Bookings
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            View and manage all your cab bookings
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filter */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="All">All Bookings</MenuItem>
              <MenuItem value={BOOKING_STATUS.PENDING}>Pending</MenuItem>
              <MenuItem value={BOOKING_STATUS.CONFIRMED}>Confirmed</MenuItem>
              <MenuItem value={BOOKING_STATUS.COMPLETED}>Completed</MenuItem>
              <MenuItem value={BOOKING_STATUS.CANCELLED}>Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {/* Bookings Table */}
        {filteredBookings.length === 0 ? (
          <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No bookings found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {filterStatus === 'All'
                ? "You haven't made any bookings yet"
                : `No bookings with status: ${filterStatus}`}
            </Typography>
            <Button variant="contained" onClick={() => navigate(ROUTES.BOOKING)}>
              Book a Cab Now
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Booking ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Route</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Distance</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Fare</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id} hover>
                    <TableCell>{booking.bookingId || booking.id}</TableCell>
                    <TableCell>
                      {booking.pickupDate}
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {booking.pickupTime}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {booking.sourceAddress?.address?.substring(0, 30)}...
                      </Typography>
                    </TableCell>
                    <TableCell>{booking.distance} km</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(booking.fare)}</TableCell>
                    <TableCell>
                      <Chip label={booking.status} color={getStatusColor(booking.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.paymentStatus}
                        color={getPaymentStatusColor(booking.paymentStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary" onClick={() => handleViewDetails(booking)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {needsPayment(booking) && (
                          <Tooltip title="Pay Now">
                            <IconButton size="small" color="success" onClick={() => handlePayNow(booking)}>
                              <PaymentIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canCancel(booking) && (
                          <Tooltip title="Cancel Booking">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default HistoryPage;
