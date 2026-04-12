/**
 * Google Maps Script Loader
 * Dynamically load Google Maps API
 */

let isLoading = false;
let isLoaded = false;
const callbacks = [];

/**
 * Load Google Maps API script
 * @returns {Promise} Resolves when Google Maps is loaded
 */
export const loadGoogleMapsAPI = () => {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (isLoaded) {
      resolve();
      return;
    }

    // Currently loading, add to queue
    if (isLoading) {
      callbacks.push({ resolve, reject });
      return;
    }

    // Check if API key exists
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      const error = new Error('Google Maps API key not found in environment variables');
      console.error(error);
      reject(error);
      return;
    }

    // Start loading
    isLoading = true;

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      
      // Resolve this promise
      resolve();
      
      // Resolve all queued promises
      callbacks.forEach(cb => cb.resolve());
      callbacks.length = 0;
    };

    script.onerror = (error) => {
      isLoading = false;
      
      const err = new Error('Failed to load Google Maps API');
      console.error(err);
      
      // Reject this promise
      reject(err);
      
      // Reject all queued promises
      callbacks.forEach(cb => cb.reject(err));
      callbacks.length = 0;
    };

    // Add script to document
    document.head.appendChild(script);
  });
};

/**
 * Check if Google Maps API is loaded
 * @returns {boolean}
 */
export const isGoogleMapsLoaded = () => {
  return isLoaded && window.google && window.google.maps;
};
