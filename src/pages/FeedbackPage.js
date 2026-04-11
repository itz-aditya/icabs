/**
 * Feedback Page
 * User feedback form for completed bookings
 */

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Rating,
  Grid,
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import StarIcon from '@mui/icons-material/Star';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { submitFeedback } from '../services/feedbackService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Validation schema
const schema = yup.object({
  bookingId: yup
    .string()
    .required('Booking ID is required'),
  rating: yup
    .number()
    .required('Rating is required')
    .min(1, 'Please select a rating')
    .max(5, 'Rating must be between 1 and 5'),
  comment: yup
    .string()
    .required('Feedback comment is required')
    .min(10, 'Comment must be at least 10 characters'),
}).required();

const FeedbackPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      bookingId: '',
      rating: 0,
      comment: '',
    },
  });

  const ratingValue = watch('rating');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      await submitFeedback({
        userId: currentUser.uid,
        bookingId: data.bookingId,
        rating: data.rating,
        comment: data.comment,
        driverId: '', // This would come from the booking data in a real scenario
      });

      setSuccess(true);
      toast.success('Thank you for your feedback!');
      reset();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <FeedbackIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            Share Your Feedback
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We value your opinion! Please share your experience with us.
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Thank you for your valuable feedback! We appreciate you taking the time to share your experience with us.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              {/* Booking ID */}
              <Grid item xs={12}>
                <Controller
                  name="bookingId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Booking ID"
                      placeholder="Enter your booking ID"
                      error={!!errors.bookingId}
                      helperText={errors.bookingId?.message || 'You can find this in your booking history'}
                      disabled={loading}
                    />
                  )}
                />
              </Grid>

              {/* Rating */}
              <Grid item xs={12}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                    How would you rate your experience?
                  </Typography>
                  <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                      <Box>
                        <Rating
                          {...field}
                          size="large"
                          value={field.value}
                          onChange={(event, newValue) => {
                            field.onChange(newValue);
                          }}
                          disabled={loading}
                          icon={<StarIcon fontSize="inherit" />}
                          emptyIcon={<StarIcon fontSize="inherit" />}
                        />
                        {ratingValue > 0 && (
                          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                            {ratingLabels[ratingValue]}
                          </Typography>
                        )}
                        {errors.rating && (
                          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                            {errors.rating.message}
                          </Typography>
                        )}
                      </Box>
                    )}
                  />
                </Box>
              </Grid>

              {/* Comment */}
              <Grid item xs={12}>
                <Controller
                  name="comment"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Your Feedback"
                      multiline
                      rows={6}
                      error={!!errors.comment}
                      helperText={errors.comment?.message}
                      disabled={loading}
                      placeholder="Tell us about your experience... What did you like? What could we improve?"
                    />
                  )}
                />
              </Grid>

              {/* Additional Info */}
              <Grid item xs={12}>
                <Alert severity="info">
                  Your feedback helps us improve our services. All feedback is reviewed by our team.
                </Alert>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Feedback'}
            </Button>
          </Box>
        </Paper>

        {/* Why Feedback Matters */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Why Your Feedback Matters
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Improve Service Quality</strong><br />
                  Your feedback helps us identify areas for improvement
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Recognize Excellence</strong><br />
                  Positive feedback motivates our drivers to maintain high standards
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Better Experience</strong><br />
                  We use your insights to enhance the overall customer experience
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default FeedbackPage;
