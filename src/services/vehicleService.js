/**
 * Vehicle Service
 * Handles all Firebase vehicle operations
 */

import { ref, set, get, update, remove, push } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Get all vehicles
 * @returns {Promise<Array>} Array of vehicles
 */
export const getAllVehicles = async () => {
  try {
    const vehiclesRef = ref(database, 'vehicles');
    const snapshot = await get(vehiclesRef);
    
    if (snapshot.exists()) {
      const vehiclesData = snapshot.val();
      // Convert object to array with IDs
      return Object.keys(vehiclesData).map(key => ({
        id: key,
        ...vehiclesData[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

/**
 * Get available vehicles
 * @returns {Promise<Array>} Array of available vehicles
 */
export const getAvailableVehicles = async () => {
  try {
    const vehicles = await getAllVehicles();
    return vehicles.filter(vehicle => vehicle.availability === true);
  } catch (error) {
    console.error('Error fetching available vehicles:', error);
    throw error;
  }
};

/**
 * Get vehicle by ID
 * @param {string} vehicleId 
 * @returns {Promise<Object>} Vehicle data
 */
export const getVehicleById = async (vehicleId) => {
  try {
    const vehicleRef = ref(database, `vehicles/${vehicleId}`);
    const snapshot = await get(vehicleRef);
    
    if (snapshot.exists()) {
      return {
        id: vehicleId,
        ...snapshot.val()
      };
    }
    throw new Error('Vehicle not found');
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    throw error;
  }
};

/**
 * Get vehicles by type
 * @param {string} type - Vehicle type (Sedan, SUV, Hatchback, Luxury)
 * @returns {Promise<Array>} Array of vehicles
 */
export const getVehiclesByType = async (type) => {
  try {
    const vehicles = await getAllVehicles();
    return vehicles.filter(vehicle => vehicle.type === type);
  } catch (error) {
    console.error('Error fetching vehicles by type:', error);
    throw error;
  }
};

/**
 * Add new vehicle (Admin only)
 * @param {Object} vehicleData 
 * @returns {Promise<string>} Vehicle ID
 */
export const addVehicle = async (vehicleData) => {
  try {
    const vehiclesRef = ref(database, 'vehicles');
    const newVehicleRef = push(vehiclesRef);
    
    const vehicle = {
      vehicleId: newVehicleRef.key,
      ...vehicleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await set(newVehicleRef, vehicle);
    return newVehicleRef.key;
  } catch (error) {
    console.error('Error adding vehicle:', error);
    throw error;
  }
};

/**
 * Update vehicle (Admin only)
 * @param {string} vehicleId 
 * @param {Object} updates 
 */
export const updateVehicle = async (vehicleId, updates) => {
  try {
    const vehicleRef = ref(database, `vehicles/${vehicleId}`);
    await update(vehicleRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
};

/**
 * Delete vehicle (Admin only)
 * @param {string} vehicleId 
 */
export const deleteVehicle = async (vehicleId) => {
  try {
    const vehicleRef = ref(database, `vehicles/${vehicleId}`);
    await remove(vehicleRef);
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
};

/**
 * Update vehicle availability
 * @param {string} vehicleId 
 * @param {boolean} availability 
 */
export const updateVehicleAvailability = async (vehicleId, availability) => {
  try {
    const vehicleRef = ref(database, `vehicles/${vehicleId}`);
    await update(vehicleRef, {
      availability,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating vehicle availability:', error);
    throw error;
  }
};
