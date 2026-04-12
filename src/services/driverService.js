/**
 * Driver Service
 * Handles all Firebase driver operations
 */

import { ref, set, get, update, remove, push } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Get all drivers
 * @returns {Promise<Array>} Array of drivers
 */
export const getAllDrivers = async () => {
  try {
    const driversRef = ref(database, 'drivers');
    const snapshot = await get(driversRef);
    
    if (snapshot.exists()) {
      const driversData = snapshot.val();
      return Object.keys(driversData).map(key => ({
        id: key,
        ...driversData[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error;
  }
};

/**
 * Get available drivers
 * @returns {Promise<Array>} Array of available drivers
 */
export const getAvailableDrivers = async () => {
  try {
    const drivers = await getAllDrivers();
    return drivers.filter(driver => driver.availability === true);
  } catch (error) {
    console.error('Error fetching available drivers:', error);
    throw error;
  }
};

/**
 * Get driver by ID
 * @param {string} driverId 
 * @returns {Promise<Object>} Driver data
 */
export const getDriverById = async (driverId) => {
  try {
    const driverRef = ref(database, `drivers/${driverId}`);
    const snapshot = await get(driverRef);
    
    if (snapshot.exists()) {
      return {
        id: driverId,
        ...snapshot.val()
      };
    }
    throw new Error('Driver not found');
  } catch (error) {
    console.error('Error fetching driver:', error);
    throw error;
  }
};

/**
 * Add new driver (Admin only)
 * @param {Object} driverData 
 * @returns {Promise<string>} Driver ID
 */
export const addDriver = async (driverData) => {
  try {
    const driversRef = ref(database, 'drivers');
    const newDriverRef = push(driversRef);
    
    const driver = {
      driverId: newDriverRef.key,
      ...driverData,
      rating: driverData.rating || 5.0,
      totalRides: driverData.totalRides || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await set(newDriverRef, driver);
    return newDriverRef.key;
  } catch (error) {
    console.error('Error adding driver:', error);
    throw error;
  }
};

/**
 * Update driver (Admin only)
 * @param {string} driverId 
 * @param {Object} updates 
 */
export const updateDriver = async (driverId, updates) => {
  try {
    const driverRef = ref(database, `drivers/${driverId}`);
    await update(driverRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating driver:', error);
    throw error;
  }
};

/**
 * Delete driver (Admin only)
 * @param {string} driverId 
 */
export const deleteDriver = async (driverId) => {
  try {
    const driverRef = ref(database, `drivers/${driverId}`);
    await remove(driverRef);
  } catch (error) {
    console.error('Error deleting driver:', error);
    throw error;
  }
};

/**
 * Update driver availability
 * @param {string} driverId 
 * @param {boolean} availability 
 */
export const updateDriverAvailability = async (driverId, availability) => {
  try {
    const driverRef = ref(database, `drivers/${driverId}`);
    await update(driverRef, {
      availability,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating driver availability:', error);
    throw error;
  }
};

/**
 * Update driver rating
 * @param {string} driverId 
 * @param {number} newRating 
 */
export const updateDriverRating = async (driverId, newRating) => {
  try {
    const driverRef = ref(database, `drivers/${driverId}`);
    const snapshot = await get(driverRef);
    
    if (snapshot.exists()) {
      const driver = snapshot.val();
      const totalRides = driver.totalRides || 0;
      const currentRating = driver.rating || 5.0;
      
      // Calculate new average rating
      const updatedRating = ((currentRating * totalRides) + newRating) / (totalRides + 1);
      
      await update(driverRef, {
        rating: parseFloat(updatedRating.toFixed(2)),
        totalRides: totalRides + 1,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error updating driver rating:', error);
    throw error;
  }
};
