/**
 * Fare Calculator Utilities
 * Calculate fare based on distance and vehicle pricing
 */

/**
 * Calculate fare for a booking
 * @param {number} distance - Distance in kilometers
 * @param {Object} vehicle - Vehicle object with basePrice and pricePerKm
 * @returns {Object} Fare breakdown
 */
export const calculateFare = (distance, vehicle) => {
  if (!vehicle || !distance) {
    return {
      basePrice: 0,
      distanceCharge: 0,
      subtotal: 0,
      tax: 0,
      total: 0
    };
  }

  const basePrice = vehicle.basePrice || 0;
  const pricePerKm = vehicle.pricePerKm || 0;
  
  const distanceCharge = distance * pricePerKm;
  const subtotal = basePrice + distanceCharge;
  const taxRate = 0.05; // 5% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    basePrice: parseFloat(basePrice.toFixed(2)),
    distanceCharge: parseFloat(distanceCharge.toFixed(2)),
    distance: parseFloat(distance.toFixed(2)),
    pricePerKm: parseFloat(pricePerKm.toFixed(2)),
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    taxRate: taxRate,
    total: parseFloat(total.toFixed(2))
  };
};

/**
 * Calculate estimated fare range for multiple vehicles
 * @param {number} distance 
 * @param {Array} vehicles 
 * @returns {Object} Min and max fare
 */
export const calculateFareRange = (distance, vehicles) => {
  if (!vehicles || vehicles.length === 0) {
    return { min: 0, max: 0 };
  }

  const fares = vehicles.map(vehicle => {
    const fareBreakdown = calculateFare(distance, vehicle);
    return fareBreakdown.total;
  });

  return {
    min: Math.min(...fares),
    max: Math.max(...fares)
  };
};

/**
 * Apply discount to fare
 * @param {number} totalFare 
 * @param {number} discountPercent 
 * @returns {Object} Fare with discount
 */
export const applyDiscount = (totalFare, discountPercent) => {
  const discountAmount = (totalFare * discountPercent) / 100;
  const finalAmount = totalFare - discountAmount;

  return {
    originalFare: parseFloat(totalFare.toFixed(2)),
    discountPercent: discountPercent,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    finalAmount: parseFloat(finalAmount.toFixed(2))
  };
};

/**
 * Calculate surge pricing (peak hours, high demand)
 * @param {number} baseFare 
 * @param {number} surgeMultiplier 
 * @returns {Object} Fare with surge
 */
export const applySurgePricing = (baseFare, surgeMultiplier = 1.0) => {
  const surgeAmount = baseFare * (surgeMultiplier - 1);
  const totalWithSurge = baseFare * surgeMultiplier;

  return {
    baseFare: parseFloat(baseFare.toFixed(2)),
    surgeMultiplier: surgeMultiplier,
    surgeAmount: parseFloat(surgeAmount.toFixed(2)),
    totalWithSurge: parseFloat(totalWithSurge.toFixed(2))
  };
};

/**
 * Get surge multiplier based on time of day
 * @returns {number} Surge multiplier
 */
export const getSurgeMultiplier = () => {
  const hour = new Date().getHours();
  
  // Peak hours: 7-10 AM and 5-9 PM
  if ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 21)) {
    return 1.5;
  }
  
  // Late night: 11 PM - 5 AM
  if (hour >= 23 || hour < 5) {
    return 1.3;
  }
  
  return 1.0; // Normal hours
};
