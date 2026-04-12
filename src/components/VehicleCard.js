/**
 * Vehicle Card Component
 * Displays vehicle information in a card format
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatCurrency } from '../utils/formatters';

const VehicleCard = ({ vehicle, onBook, showBookButton = false }) => {
  const [imageError, setImageError] = React.useState(false);

  const getVehicleImage = () => {
    if (imageError || !vehicle.imageUrl) {
      // Return a better placeholder based on vehicle type
      const type = vehicle.type?.toLowerCase() || 'car';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(vehicle.model)}&size=400&background=1976d2&color=fff&bold=true&format=svg`;
    }
    return vehicle.imageUrl;
  };

  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={getVehicleImage()}
        alt={vehicle.model}
        onError={() => setImageError(true)}
        sx={{
          objectFit: 'cover',
          backgroundColor: '#f5f5f5'
        }}
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Vehicle Model and Type */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
            {vehicle.model}
          </Typography>
          <Chip 
            label={vehicle.type} 
            size="small" 
            color="primary" 
            variant="outlined"
            icon={<DirectionsCarIcon />}
          />
        </Box>

        {/* Capacity */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PeopleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            Capacity: {vehicle.capacity} passengers
          </Typography>
        </Box>

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Features:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {vehicle.features.slice(0, 3).map((feature, index) => (
                <Chip 
                  key={index} 
                  label={feature} 
                  size="small" 
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
              {vehicle.features.length > 3 && (
                <Chip 
                  label={`+${vehicle.features.length - 3} more`} 
                  size="small" 
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Pricing */}
        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Base Price
              </Typography>
              <Typography variant="h6" color="primary" fontWeight={600}>
                {formatCurrency(vehicle.basePrice || 0)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Per KM
              </Typography>
              <Typography variant="h6" color="primary" fontWeight={600}>
                {formatCurrency(vehicle.pricePerKm || 0)}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Availability Status */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {vehicle.availability ? (
              <>
                <CheckCircleIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 20 }} />
                <Typography variant="body2" color="success.main" fontWeight={600}>
                  Available
                </Typography>
              </>
            ) : (
              <>
                <CancelIcon sx={{ color: 'error.main', mr: 0.5, fontSize: 20 }} />
                <Typography variant="body2" color="error.main" fontWeight={600}>
                  Not Available
                </Typography>
              </>
            )}
          </Box>

          {/* Book Button */}
          {showBookButton && vehicle.availability && onBook && (
            <Button 
              variant="contained" 
              size="small"
              onClick={() => onBook(vehicle)}
            >
              Book Now
            </Button>
          )}
        </Box>

        {/* License Plate (if available) */}
        {vehicle.licensePlate && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            License: {vehicle.licensePlate}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
