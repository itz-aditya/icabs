/**
 * Authentication Service
 * Handles all Firebase authentication operations
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../config/firebase';
import { DEFAULT_USER_TYPE } from '../constants/userTypes';

/**
 * Sign up a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} User object
 */
export const signUp = async (userData) => {
  try {
    const { email, password, fullName, mobileNumber, gender } = userData;
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store additional user data in Realtime Database
    const userRef = ref(database, `users/${user.uid}`);
    await set(userRef, {
      uid: user.uid,
      email: email,
      fullName: fullName,
      mobileNumber: mobileNumber,
      gender: gender,
      userType: DEFAULT_USER_TYPE, // Set to NORMAL_USER by default
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      uid: user.uid,
      email: user.email,
      fullName: fullName,
      userType: DEFAULT_USER_TYPE
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Sign in an existing user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User object with userType
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch user data from database to get userType
    const userRef = ref(database, `users/${user.uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return {
        uid: user.uid,
        email: user.email,
        fullName: userData.fullName,
        mobileNumber: userData.mobileNumber,
        gender: userData.gender,
        userType: userData.userType
      };
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Sign out current user
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email 
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

/**
 * Change password for logged in user
 * @param {string} currentPassword 
 * @param {string} newPassword 
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    
    if (!user || !user.email) {
      throw new Error('No authenticated user found');
    }
    
    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
  } catch (error) {
    throw error;
  }
};

/**
 * Get user data from database
 * @param {string} uid 
 * @returns {Promise<Object>} User data
 */
export const getUserData = async (uid) => {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    throw error;
  }
};
