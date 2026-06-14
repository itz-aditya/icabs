/**
 * Address Autocomplete Component
 * Google Places API integration for address input
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const [isMapsReady, setIsMapsReady] = useState(false);

  useEffect(() => {
    const checkGoogleMapsReady = () => {
      const isReady = !!(window.google && window.google.maps && window.google.maps.places);
      return isReady;
    };

    if (checkGoogleMapsReady()) {
      setIsMapsReady(true);
      return;
    }

    const interval = setInterval(() => {
      if (checkGoogleMapsReady()) {
        setIsMapsReady(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const onPlaceSelectedRef = useRef(onPlaceSelected);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onPlaceSelectedRef.current = onPlaceSelected;
    onChangeRef.current = onChange;
  }, [onPlaceSelected, onChange]);

  const handlePlaceSelect = useCallback(() => {

    if (!autocompleteRef.current) {
      return;
    }

    const place = autocompleteRef.current.getPlace();

    if (!place || !place.geometry) {
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

    if (onPlaceSelectedRef.current) {
      onPlaceSelectedRef.current(addressData);
    }

    if (onChangeRef.current) {
      onChangeRef.current({
        target: {
          value: addressData.address
        }
      });
    }
  }, []); // Empty dependencies - stable function

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    if (!isMapsReady) {
      return;
    }

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'in' }, // Restrict to India
          fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id']
        }
      );

      const handlePlaceChange = () => {
        handlePlaceSelect();
      };

      autocompleteRef.current.addListener('place_changed', handlePlaceChange);
    } catch (error) {
    }

    return () => {
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isMapsReady]);

  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <TextField
      {...props}
      inputRef={inputRef}
      value={value || ''}
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
