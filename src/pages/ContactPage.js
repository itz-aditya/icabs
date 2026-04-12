/**
 * Contact Us Page
 * Contact form for users to reach out
 */

import React, { useState } from 'react';
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
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { submitContactMessage } from '../services/contactService';
import { toast } from 'react-toastify';

// Validation schema
const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters'),
}).required();

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      await submitContactMessage(data);

      setSuccess(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (err) {
      console.error('Error submitting contact message:', err);
      setError('Failed to send message. Please try again.');
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Email',
      content: 'support@icabs.com',
      subcontent: 'We\'ll respond within 24 hours'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Phone',
      content: '+91 98765 43210',
      subcontent: 'Mon-Sat, 9AM to 6PM'
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Office',
      content: '123 Main Street',
      subcontent: 'City, State 110001'
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            Contact Us
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                Send us a Message
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for contacting us! We've received your message and will get back to you soon.
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                  {/* Name */}
                  <Grid item xs={12}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Full Name"
                          error={!!errors.name}
                          helperText={errors.name?.message}
                          disabled={loading}
                        />
                      )}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email Address"
                          type="email"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          disabled={loading}
                        />
                      )}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone Number"
                          placeholder="10 digit mobile number"
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                          disabled={loading}
                        />
                      )}
                    />
                  </Grid>

                  {/* Message */}
                  <Grid item xs={12}>
                    <Controller
                      name="message"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Message"
                          multiline
                          rows={6}
                          error={!!errors.message}
                          helperText={errors.message?.message}
                          disabled={loading}
                          placeholder="Tell us what's on your mind..."
                        />
                      )}
                    />
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
                  endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Get in Touch
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Feel free to reach out to us through any of these channels. We're here to help!
                </Typography>
              </Paper>

              {contactInfo.map((info, index) => (
                <Paper key={index} elevation={2} sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box>
                      {info.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {info.title}
                      </Typography>
                      <Typography variant="body1" fontWeight={600} gutterBottom>
                        {info.content}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {info.subcontent}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactPage;
