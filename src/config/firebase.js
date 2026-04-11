/**
 * Firebase Configuration
 * Initialize Firebase app with environment variables
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyAw1qpHqUpkCcXJiy6ZgTRzCQqIixFai-U",
  authDomain: "icabs-5a628.firebaseapp.com",
  projectId: "icabs-5a628",
  storageBucket: "icabs-5a628.firebasestorage.app",
  messagingSenderId: "1077877391240",
  appId: "1:1077877391240:web:5813b584c555d029ee443d",
  measurementId: "G-7T0KHPN8S3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;
