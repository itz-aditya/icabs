/**
 * Payment Service
 * Handles Razorpay payment operations
 */

import { ref, set, get, push } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Load Razorpay script
 * @returns {Promise} Resolves when script is loaded
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      reject(new Error('Failed to load Razorpay SDK'));
    };

    document.body.appendChild(script);
  });
};

/**
 * Create payment order
 * @param {Object} paymentData - amount, bookingId, userDetails
 * @returns {Promise<Object>} Order details
 */
export const createPaymentOrder = async (paymentData) => {
  try {
    const paymentsRef = ref(database, 'payments');
    const newPaymentRef = push(paymentsRef);

    const order = {
      paymentId: newPaymentRef.key,
      bookingId: paymentData.bookingId,
      userId: paymentData.userId,
      amount: paymentData.amount, // In rupees
      amountPaise: Math.round(paymentData.amount * 100), // Convert to paise for Razorpay
      currency: 'INR',
      status: 'PENDING',
      userDetails: paymentData.userDetails,
      createdAt: new Date().toISOString(),
    };

    await set(newPaymentRef, order);

    return {
      orderId: newPaymentRef.key,
      ...order,
    };
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
};

/**
 * Initiate Razorpay payment
 * @param {Object} orderData - order details
 * @param {Object} options - user details, callbacks
 * @returns {Promise} Razorpay checkout instance
 */
export const initiateRazorpayPayment = async (orderData, options) => {
  try {
    // Load Razorpay script
    await loadRazorpayScript();

    const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID;

    if (!razorpayKeyId) {
      throw new Error('Razorpay Key ID not found in environment variables. Please check your .env.local file.');
    }

    if (razorpayKeyId === 'rzp_test_xxxxxxxxxxxxx' || razorpayKeyId.includes('xxx')) {
      console.error('[paymentService] Razorpay Key ID is still a placeholder!');
      throw new Error('Razorpay Key ID is a placeholder. Please add your actual Razorpay Test Key ID to .env.local');
    }

    const razorpayOptions = {
      key: razorpayKeyId,
      amount: orderData.amountPaise, // Amount in paise
      currency: orderData.currency || 'INR',
      name: 'iCabs',
      description: `Booking Payment - ${orderData.bookingId}`,
      // Note: order_id is optional for simple payments without backend
      // It's required only when you create orders via Razorpay Orders API
      image: '', // You can add your logo URL here
      prefill: {
        name: options.userName || '',
        email: options.userEmail || '',
        contact: options.userPhone || '',
      },
      notes: {
        bookingId: orderData.bookingId,
        orderId: orderData.orderId,
      },
      theme: {
        color: '#1976d2', // Primary color from theme
      },
      handler: function (response) {
        // Payment successful
        if (options.onSuccess) {
          options.onSuccess(response);
        }
      },
      modal: {
        ondismiss: function () {
          // Payment cancelled
          if (options.onDismiss) {
            options.onDismiss();
          }
        },
      },
    };

    console.log('[paymentService] Razorpay options:', {
      ...razorpayOptions,
      key: razorpayOptions.key?.substring(0, 15) + '...',
    });

    console.log('[paymentService] Creating Razorpay instance...');
    const razorpayInstance = new window.Razorpay(razorpayOptions);
    console.log('[paymentService] Razorpay instance created successfully');

    razorpayInstance.on('payment.failed', function (response) {
      // Payment failed
      if (options.onFailure) {
        options.onFailure(response.error);
      }
    });

    razorpayInstance.open();

    return razorpayInstance;
  } catch (error) {
    console.error('Error initiating Razorpay payment:', error);
    throw error;
  }
};

/**
 * Verify payment signature (simplified for frontend)
 * Note: In production, this should be done on backend for security
 * @param {Object} paymentData - razorpay_payment_id, razorpay_order_id, razorpay_signature
 * @returns {boolean} True if valid
 */
export const verifyPaymentSignature = (paymentData) => {
  try {
    console.log('[paymentService] Verifying payment:', paymentData);

    // In a real production app, this verification MUST be done on the backend
    // For this demo, we'll do a basic check

    // When using simple checkout (without order_id), Razorpay only returns razorpay_payment_id
    // When using Orders API, it returns razorpay_payment_id, razorpay_order_id, and razorpay_signature

    // Check if payment_id exists (minimum requirement)
    const isValid = !!(paymentData.razorpay_payment_id);

    console.log('[paymentService] Payment verification result:', isValid);

    return isValid;
  } catch (error) {
    console.error('[paymentService] Error verifying payment:', error);
    return false;
  }
};

/**
 * Update payment status
 * @param {string} paymentId - Payment ID
 * @param {string} status - Payment status
 * @param {Object} razorpayResponse - Razorpay response data
 */
export const updatePaymentStatus = async (paymentId, status, razorpayResponse = {}) => {
  try {
    const paymentRef = ref(database, `payments/${paymentId}`);
    const snapshot = await get(paymentRef);

    if (!snapshot.exists()) {
      throw new Error('Payment not found');
    }

    const updates = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (razorpayResponse.razorpay_payment_id) {
      updates.razorpayPaymentId = razorpayResponse.razorpay_payment_id;
    }

    if (razorpayResponse.razorpay_order_id) {
      updates.razorpayOrderId = razorpayResponse.razorpay_order_id;
    }

    if (razorpayResponse.razorpay_signature) {
      updates.razorpaySignature = razorpayResponse.razorpay_signature;
    }

    if (status === 'PAID') {
      updates.paidAt = new Date().toISOString();
    }

    await set(paymentRef, {
      ...snapshot.val(),
      ...updates,
    });

    return updates;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

/**
 * Get payment by ID
 * @param {string} paymentId
 * @returns {Promise<Object>} Payment data
 */
export const getPaymentById = async (paymentId) => {
  try {
    const paymentRef = ref(database, `payments/${paymentId}`);
    const snapshot = await get(paymentRef);

    if (snapshot.exists()) {
      return {
        id: paymentId,
        ...snapshot.val(),
      };
    }
    throw new Error('Payment not found');
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};

/**
 * Get payments by user ID
 * @param {string} userId
 * @returns {Promise<Array>} Array of payments
 */
export const getPaymentsByUser = async (userId) => {
  try {
    const paymentsRef = ref(database, 'payments');
    const snapshot = await get(paymentsRef);

    if (snapshot.exists()) {
      const paymentsData = snapshot.val();
      return Object.keys(paymentsData)
        .filter(key => paymentsData[key].userId === userId)
        .map(key => ({
          id: key,
          ...paymentsData[key],
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [];
  } catch (error) {
    console.error('Error fetching user payments:', error);
    throw error;
  }
};

/**
 * Get all payments (Admin only)
 * @returns {Promise<Array>} Array of all payments
 */
export const getAllPayments = async () => {
  try {
    const paymentsRef = ref(database, 'payments');
    const snapshot = await get(paymentsRef);

    if (snapshot.exists()) {
      const paymentsData = snapshot.val();
      return Object.keys(paymentsData)
        .map(key => ({
          id: key,
          ...paymentsData[key],
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return [];
  } catch (error) {
    console.error('Error fetching all payments:', error);
    throw error;
  }
};
