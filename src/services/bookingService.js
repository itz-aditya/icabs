/**
 * Booking Service
 * Handles all Firebase booking operations
 */

import { ref, set, get, update, push } from 'firebase/database';
import { database } from '../config/firebase';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../constants/bookingStatus';

/**
 * Create a new booking
 * @param {Object} bookingData 
 * @returns {Promise<string>} Booking ID
 */
export const createBooking = async (bookingData) => {
  try {
    const bookingsRef = ref(database, 'bookings');
    const newBookingRef = push(bookingsRef);
    
    const booking = {
      bookingId: newBookingRef.key,
      ...bookingData,
      status: BOOKING_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await set(newBookingRef, booking);
    return newBookingRef.key;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Get booking by ID
 * @param {string} bookingId 
 * @returns {Promise<Object>} Booking data
 */
export const getBookingById = async (bookingId) => {
  try {
    const bookingRef = ref(database, `bookings/${bookingId}`);
    const snapshot = await get(bookingRef);
    
    if (snapshot.exists()) {
      return {
        id: bookingId,
        ...snapshot.val()
      };
    }
    throw new Error('Booking not found');
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

/**
 * Get all bookings for a user
 * @param {string} userId 
 * @returns {Promise<Array>} Array of bookings
 */
export const getBookingsByUser = async (userId) => {
  try {
    const bookingsRef = ref(database, 'bookings');
    const snapshot = await get(bookingsRef);
    
    if (snapshot.exists()) {
      const bookingsData = snapshot.val();
      return Object.keys(bookingsData)
        .filter(key => bookingsData[key].userId === userId)
        .map(key => ({
          id: key,
          ...bookingsData[key]
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [];
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

/**
 * Get all bookings (Admin only)
 * @returns {Promise<Array>} Array of all bookings
 */
export const getAllBookings = async () => {
  try {
    const bookingsRef = ref(database, 'bookings');
    const snapshot = await get(bookingsRef);
    
    if (snapshot.exists()) {
      const bookingsData = snapshot.val();
      return Object.keys(bookingsData)
        .map(key => ({
          id: key,
          ...bookingsData[key]
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [];
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
};

/**
 * Update booking status
 * @param {string} bookingId 
 * @param {string} status 
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = ref(database, `bookings/${bookingId}`);
    await update(bookingRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

/**
 * Update payment status
 * @param {string} bookingId 
 * @param {string} paymentStatus 
 * @param {string} paymentId 
 */
export const updatePaymentStatus = async (bookingId, paymentStatus, paymentId = null) => {
  try {
    const bookingRef = ref(database, `bookings/${bookingId}`);
    const updates = {
      paymentStatus,
      updatedAt: new Date().toISOString()
    };
    
    if (paymentId) {
      updates.paymentId = paymentId;
    }
    
    await update(bookingRef, updates);
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

/**
 * Assign driver to booking
 * @param {string} bookingId 
 * @param {string} driverId 
 */
export const assignDriver = async (bookingId, driverId) => {
  try {
    const bookingRef = ref(database, `bookings/${bookingId}`);
    await update(bookingRef, {
      driverId,
      status: BOOKING_STATUS.ASSIGNED,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error assigning driver:', error);
    throw error;
  }
};

/**
 * Cancel booking
 * @param {string} bookingId 
 */
export const cancelBooking = async (bookingId) => {
  try {
    const bookingRef = ref(database, `bookings/${bookingId}`);
    await update(bookingRef, {
      status: BOOKING_STATUS.CANCELLED,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};
