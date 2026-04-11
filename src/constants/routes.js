/**
 * Application Routes
 * Centralized route path definitions
 */

export const ROUTES = {
  // Public Routes
  HOME: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  ABOUT: '/about',
  CONTACT: '/contact',
  FLEET: '/fleet',
  
  // Protected User Routes
  BOOKING: '/booking',
  BOOKING_CONFIRM: '/booking/confirm',
  PAYMENT: '/payment',
  HISTORY: '/history',
  FEEDBACK: '/feedback',
  CHANGE_PASSWORD: '/change-password',
  PROFILE: '/profile',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_VEHICLES: '/admin/vehicles',
  ADMIN_DRIVERS: '/admin/drivers',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_USERS: '/admin/users',
  ADMIN_SEARCH: '/admin/search',
};
