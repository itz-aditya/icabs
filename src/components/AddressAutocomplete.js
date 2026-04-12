/**
 * Address Autocomplete Component
 * Google Places API integration for address input
 */

import React, { useEffect, useRef } from 'react';
import { TextField } from '@mui/material';

const AddressAutocomplete = ({
  value,
  onChange,
  onPlaceSelected,
  label,
  placeholder,
  error,
  helperText,
  disabled,
  required,
  ...props
}) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) return;

    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn('Google Maps API not loaded. Autocomplete disabled.');
      return;
    }

    // Initialize autocomplete
    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'in' }, // Restrict to India
          fields: ['address_components', 'formatted_address', 'geometry', 'name']
        }
      );

      // Add place changed listener
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
    }

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();

    if (!place || !place.geometry) {
      console.warn('No place details available');
      return;
    }

    const addressData = {
      address: place.formatted_address || place.name,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      placeId: place.place_id
    };

    // Parse address components
    if (place.address_components) {
      addressData.components = {};
      place.address_components.forEach(component => {
        const type = component.types[0];
        addressData.components[type] = component.long_name;
      });
    }

    if (onPlaceSelected) {
      onPlaceSelected(addressData);
    }

    if (onChange) {
      onChange({
        target: {
          value: addressData.address
        }
      });
    }
  };

  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <TextField
      {...props}
      inputRef={inputRef}
      value={value}
      onChange={handleInputChange}
      label={label}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      disabled={disabled}
      required={required}
      fullWidth
      autoComplete="off"
    />
  );
};

export default AddressAutocomplete;
