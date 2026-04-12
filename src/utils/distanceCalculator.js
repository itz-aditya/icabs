/**
 * Distance Calculator Utilities
 * Calculate distance between two coordinates
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return parseFloat(distance.toFixed(2)); // Return distance rounded to 2 decimal places
};

/**
 * Convert degrees to radians
 * @param {number} degrees 
 * @returns {number} Radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate distance using Google Maps Distance Matrix API
 * @param {Object} origin - {lat, lng}
 * @param {Object} destination - {lat, lng}
 * @returns {Promise<Object>} {distance: number (km), duration: number (minutes)}
 */
export const calculateDistanceWithGoogle = async (origin, destination) => {
  try {
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps) {
      throw new Error('Google Maps API not loaded');
    }

    const service = new window.google.maps.DistanceMatrixService();
    
    const request = {
      origins: [{ lat: origin.lat, lng: origin.lng }],
      destinations: [{ lat: destination.lat, lng: destination.lng }],
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
    };

    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(request, (response, status) => {
        if (status === 'OK') {
          const result = response.rows[0].elements[0];
          if (result.status === 'OK') {
            resolve({
              distance: parseFloat((result.distance.value / 1000).toFixed(2)), // Convert meters to km
              duration: Math.ceil(result.duration.value / 60), // Convert seconds to minutes
              distanceText: result.distance.text,
              durationText: result.duration.text
            });
          } else {
            reject(new Error('Unable to calculate distance'));
          }
        } else {
          reject(new Error(`Distance Matrix API error: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error('Error calculating distance with Google:', error);
    throw error;
  }
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(2)} km`;
};
