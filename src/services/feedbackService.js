/**
 * Feedback Service
 * Handles user feedback for bookings
 */

import { ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Submit feedback for a booking
 * @param {Object} feedbackData - bookingId, userId, driverId, rating, comment
 * @returns {Promise<string>} Feedback ID
 */
export const submitFeedback = async (feedbackData) => {
  try {
    const feedbackRef = ref(database, 'feedback');
    const newFeedbackRef = push(feedbackRef);
    
    const feedback = {
      feedbackId: newFeedbackRef.key,
      ...feedbackData,
      createdAt: new Date().toISOString()
    };
    
    await set(newFeedbackRef, feedback);
    return newFeedbackRef.key;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

/**
 * Get feedback by user ID
 * @param {string} userId 
 * @returns {Promise<Array>} Array of feedback
 */
export const getFeedbackByUser = async (userId) => {
  try {
    const feedbackRef = ref(database, 'feedback');
    const snapshot = await get(feedbackRef);
    
    if (snapshot.exists()) {
      const feedbackData = snapshot.val();
      return Object.keys(feedbackData)
        .filter(key => feedbackData[key].userId === userId)
        .map(key => ({
          id: key,
          ...feedbackData[key]
        }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    throw error;
  }
};

/**
 * Get all feedback (Admin only)
 * @returns {Promise<Array>} Array of all feedback
 */
export const getAllFeedback = async () => {
  try {
    const feedbackRef = ref(database, 'feedback');
    const snapshot = await get(feedbackRef);
    
    if (snapshot.exists()) {
      const feedbackData = snapshot.val();
      return Object.keys(feedbackData).map(key => ({
        id: key,
        ...feedbackData[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    throw error;
  }
};
