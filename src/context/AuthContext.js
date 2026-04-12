/**
 * Authentication Context
 * Provides authentication state and functions throughout the app
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserData } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Fetch user details including userType from database
          const userData = await getUserData(user.uid);
          setUserDetails(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserDetails(null);
        }
      } else {
        setUserDetails(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userDetails,
    loading,
    isAuthenticated: !!currentUser,
    isAdmin: userDetails?.userType === 'ADMIN',
    isNormalUser: userDetails?.userType === 'NORMAL_USER'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
