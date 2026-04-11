/**
 * Contact Service
 * Handles contact form submissions
 */

import { ref, push, set, get } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Submit contact message
 * @param {Object} messageData - name, email, phone, message
 * @returns {Promise<string>} Message ID
 */
export const submitContactMessage = async (messageData) => {
  try {
    const messagesRef = ref(database, 'contact-messages');
    const newMessageRef = push(messagesRef);
    
    const message = {
      messageId: newMessageRef.key,
      ...messageData,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    
    await set(newMessageRef, message);
    return newMessageRef.key;
  } catch (error) {
    console.error('Error submitting contact message:', error);
    throw error;
  }
};

/**
 * Get all contact messages (Admin only)
 * @returns {Promise<Array>} Array of messages
 */
export const getAllContactMessages = async () => {
  try {
    const messagesRef = ref(database, 'contact-messages');
    const snapshot = await get(messagesRef);
    
    if (snapshot.exists()) {
      const messagesData = snapshot.val();
      return Object.keys(messagesData).map(key => ({
        id: key,
        ...messagesData[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw error;
  }
};
