/**
 * Clear all Firebase-related cache and storage
 */

export const clearFirebaseCache = () => {
    try {
      // Clear all localStorage items related to Firebase
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('firebase:') ||
          key.startsWith('firebaseui::') ||
          key.includes('firebase')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        console.log('Removing Firebase cache key:', key);
        localStorage.removeItem(key);
      });
      
      // Clear sessionStorage as well
      const sessionKeysToRemove = [];
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (
          key.startsWith('firebase:') ||
          key.startsWith('firebaseui::') ||
          key.includes('firebase')
        )) {
          sessionKeysToRemove.push(key);
        }
      }
      
      sessionKeysToRemove.forEach(key => {
        console.log('Removing Firebase session key:', key);
        sessionStorage.removeItem(key);
      });
      
      console.log('Firebase cache cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing Firebase cache:', error);
      return false;
    }
  };
  
  /**
   * Clear websocket failure flag
   */
  export const clearWebsocketFailure = () => {
    try {
      localStorage.removeItem('firebase:previous_websocket_failure');
      sessionStorage.removeItem('firebase:previous_websocket_failure');
      console.log('Websocket failure flag cleared');
    } catch (error) {
      console.error('Error clearing websocket failure:', error);
    }
  };