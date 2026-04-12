/**
 * Receipt Component
 * Printable receipt/invoice for bookings
 */

import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const Receipt = ({ booking, vehicle, driver, payment }) => {
  return (
    <Paper elevation={0} sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
          iCabs
        </Typography>
        <Typography variant="h5" gutterBottom>
          Payment Receipt
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Invoice ID: {booking.bookingId || booking.id}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: {new Date().toLocaleString()}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Customer Details */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Customer Details
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {booking.userDetails?.fullName}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {booking.userDetails?.email}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Mobile
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {booking.userDetails?.mobileNumber}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Payment ID
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {payment?.razorpayPaymentId || payment?.id || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Booking Details */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Booking Details
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Pickup Date & Time
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {booking.pickupDate} at {booking.pickupTime}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Pickup Location
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {booking.sourceAddress?.address || booking.sourceAddress}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Destination
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {booking.destinationAddress?.address || booking.destinationAddress}
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
          {vehicle && (
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Vehicle
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {vehicle.model} ({vehicle.type})
              </Typography>
            </Grid>
          )}
          {driver && (
            <>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Driver
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {driver.name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Driver Contact
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {driver.phone}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Payment Breakdown */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Payment Breakdown
        </Typography>
        <Table>
          <TableBody>
            {booking.fareBreakdown ? (
              <>
                <TableRow>
                  <TableCell>Base Price</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatCurrency(booking.fareBreakdown.basePrice)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    Distance Charge ({booking.fareBreakdown.distance} km × {formatCurrency(booking.fareBreakdown.pricePerKm)}/km)
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatCurrency(booking.fareBreakdown.distanceCharge)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Subtotal</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatCurrency(booking.fareBreakdown.subtotal)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tax (5%)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatCurrency(booking.fareBreakdown.tax)}
                  </TableCell>
                </TableRow>
              </>
            ) : null}
            <TableRow>
              <TableCell sx={{ borderTop: 2, borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={700}>
                  Total Amount
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ borderTop: 2, borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={700} color="primary">
                  {formatCurrency(booking.fare)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Payment Status</TableCell>
              <TableCell align="right">
                <Typography variant="body1" fontWeight={600} color="success.main">
                  {booking.paymentStatus || 'PAID'}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Thank you for choosing iCabs!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          For support, contact: +91 98765 43210 | support@icabs.com
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
          This is a computer-generated receipt and does not require a signature.
        </Typography>
      </Box>
    </Paper>
  );
};

export default Receipt;
