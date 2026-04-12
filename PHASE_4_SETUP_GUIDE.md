# Phase 4: Setup & Testing Guide

## Prerequisites

Before starting Phase 4, ensure:
- ✅ Phase 1, 2, and 3 are complete
- ✅ Firebase is configured
- ✅ Vehicles are added to Firebase (from Phase 3)
- ✅ App is running without errors

---

## Setup Steps

### Step 1: Install Google Maps Package

```bash
npm install @react-google-maps/api
```

### Step 2: Get Google Maps API Key

**Follow the detailed guide in `GOOGLE_MAPS_SETUP.md`**

Quick steps:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "iCabs"
3. Enable 4 APIs:
   - Maps JavaScript API
   - Places API
   - Distance Matrix API
   - Geocoding API
4. Create API key
5. **Restrict the API key** (important for security!)
   - HTTP referrer: `http://localhost:3000/*`
   - API restrictions: Select the 4 APIs above
6. Copy the API key

### Step 3: Add API Key to Environment

Open `.env.local` and add:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=AIza...your_key_here
```

**Important**: Restart the development server after adding:
```bash
# Press Ctrl+C to stop
npm start
```

### Step 4: Add Sample Driver Data to Firebase

**Method 1: Import JSON (Recommended)**
1. Open Firebase Console > Realtime Database
2. Click 3-dot menu (⋮) > Import JSON
3. Select `SAMPLE_DRIVER_DATA.json`
4. Click Import
5. ✅ 10 drivers added

**Method 2: Manual Import**
1. Open `SAMPLE_DRIVER_DATA.json`
2. Copy all content
3. Firebase Console > Realtime Database
4. Click on root node > + Add child
5. Paste JSON
6. Click Import

### Step 5: Verify Data in Firebase

Check Firebase Realtime Database has:
- ✅ `vehicles/` node with 10 vehicles (from Phase 3)
- ✅ `drivers/` node with 10 drivers (just added)
- ✅ Each driver linked to a vehicle

### Step 6: Test Google Maps API

Open browser console (F12) after starting the app:
- ✅ No Google Maps errors
- ✅ You should see: "Google Maps loaded successfully" in console

---

## Testing Guide

### Test 1: Basic Booking Flow

1. **Start the App**
   ```bash
   npm start
   ```

2. **Navigate to Booking Page**
   - Click "Book a Cab" button in navbar
   - OR go to: http://localhost:3000/booking
   - Should see Step 1: Trip Details

3. **Fill Step 1: Trip Details**
   - Select Pickup Date: Tomorrow
   - Select Pickup Time: Any future time
   - **Source Address**: Start typing "Connaught Place, New Delhi"
     - Should see autocomplete suggestions
     - Select from suggestions
     - If no suggestions: Check Google Maps API key
   - **Destination**: Start typing "India Gate, New Delhi"
     - Should see autocomplete suggestions
     - Select from suggestions
   - **Distance**: Should automatically calculate and display
   - Click "Next: Select Vehicle"

4. **Fill Step 2: Select Vehicle**
   - Should see available vehicles in grid
   - Click on any vehicle card
   - Selected vehicle should have blue border
   - **Fare Summary** on right should update
   - Check fare breakdown shows:
     - Base Price
     - Distance Charge
     - Tax (5%)
     - Total
   - Click "Next: Confirm Booking"

5. **Fill Step 3: Confirm Booking**
   - Review all details
   - Verify pickup date, time, addresses
   - Verify selected vehicle
   - Verify fare in sidebar
   - Click "Confirm & Proceed to Payment"

6. **Booking Confirmation**
   - Should redirect to confirmation page
   - Success icon with "Booking Confirmed!"
   - Booking ID displayed
   - All trip details shown
   - Vehicle details shown
   - Driver details shown
   - Fare breakdown shown
   - "Proceed to Payment" button visible

7. **Verify in Firebase**
   - Go to Firebase Console > Realtime Database
   - Check `bookings/` node
   - New booking should be created with:
     - Correct userId, vehicleId, driverId
     - Source and destination addresses with coordinates
     - Distance and fare
     - Status: PENDING
     - PaymentStatus: PENDING

---

### Test 2: Address Autocomplete

**With Google Maps API**:
- [ ] Type "Delhi" → Shows suggestions
- [ ] Type "Mumbai" → Shows suggestions
- [ ] Select suggestion → Address fills
- [ ] Distance calculates automatically

**Without Google Maps API**:
- [ ] No autocomplete dropdown
- [ ] Can still type address manually
- [ ] Distance defaults to 0 (manual calculation needed)

---

### Test 3: Fare Calculation

1. Select different vehicles
2. Verify fare updates for each
3. Check breakdown is correct:
   - Example: Swift (Base ₹60 + 10km × ₹8/km = ₹60 + ₹80 = ₹140)
   - Add 5% tax: ₹140 × 1.05 = ₹147

---

### Test 4: Driver Assignment

1. Complete a booking
2. Check Firebase > bookings > your booking
3. Verify `driverId` is assigned
4. Check Firebase > drivers > that driver ID
5. Verify driver exists and was available

---

### Test 5: Validation

**Test required fields**:
- [ ] Try to proceed without date → Shows error
- [ ] Try to proceed without time → Shows error
- [ ] Try to proceed without source → Shows error
- [ ] Try to proceed without destination → Shows error
- [ ] Try Step 2 without selecting vehicle → Button disabled

---

### Test 6: Pre-Selected Vehicle (from Fleet)

1. Go to Fleet page (`/fleet`)
2. Click "Book Now" on any vehicle
3. Should navigate to booking page
4. In Step 2, that vehicle should be pre-selected
5. Fare should already be calculated (if distance known)

---

### Test 7: Responsive Design

Test on different screen sizes:
- [ ] Desktop (1920x1080): Sidebar on right, form on left
- [ ] Tablet (768px): Sidebar below form
- [ ] Mobile (375px): All stacked vertically
- [ ] Stepper readable on all sizes

---

### Test 8: Error Scenarios

**No drivers available**:
1. Go to Firebase > drivers
2. Set all drivers' `availability` to `false`
3. Try to create booking
4. Should show error: "No drivers available"
5. Set drivers back to `true`

**No vehicles available**:
1. Go to Firebase > vehicles
2. Set all vehicles' `availability` to `false`
3. Go to booking page
4. Step 2 should show warning
5. Set vehicles back to `true`

---

## Common Issues & Solutions

### Issue 1: Address autocomplete not working

**Symptoms**: No dropdown when typing address

**Solutions**:
1. Check console for Google Maps errors
2. Verify API key in `.env.local`
3. Verify environment variable: `REACT_APP_GOOGLE_MAPS_API_KEY`
4. Restart development server
5. Check all 4 APIs are enabled in Google Cloud
6. Check API key restrictions allow `localhost:3000`

### Issue 2: "REQUEST_DENIED" error

**Solution**:
- Check API key restrictions
- Verify all 4 APIs are enabled
- Check billing is enabled on Google Cloud
- Wait a few minutes (APIs take time to activate)

### Issue 3: Distance not calculating

**Solutions**:
1. Verify both addresses have coordinates
2. Check browser console for errors
3. If Google Maps not loaded, distance defaults to 0
4. Try manual entry for testing

### Issue 4: Booking not created

**Solutions**:
1. Check browser console for errors
2. Verify Firebase security rules allow write
3. Check user is logged in
4. Verify all required fields are filled

### Issue 5: Fare not updating

**Solutions**:
1. Verify distance is calculated
2. Verify vehicle is selected
3. Check vehicle has `basePrice` and `pricePerKm`
4. Check browser console for calculation errors

---

## Testing Without Google Maps API

If you don't want to set up Google Maps yet:

1. **Skip autocomplete**: Just type addresses manually
2. **Distance**: Will be 0 initially
3. **Manual distance entry**: Add a field to enter distance manually (temporary)
4. **Fare**: Will calculate once distance is known

The booking will still work, just without the autocomplete convenience.

---

## Data Verification Checklist

After creating a booking, verify in Firebase:

```
bookings/
  {bookingId}/
    ✅ bookingId: auto-generated
    ✅ userId: current user's ID
    ✅ driverId: assigned driver ID
    ✅ vehicleId: selected vehicle ID
    ✅ userDetails: {fullName, email, mobileNumber}
    ✅ pickupDate: selected date
    ✅ pickupTime: selected time
    ✅ sourceAddress: {address, lat, lng}
    ✅ destinationAddress: {address, lat, lng}
    ✅ distance: calculated distance
    ✅ fare: total fare
    ✅ fareBreakdown: {basePrice, distanceCharge, tax, total}
    ✅ status: "PENDING"
    ✅ paymentStatus: "PENDING"
    ✅ createdAt: timestamp
    ✅ updatedAt: timestamp
```

---

## Success Criteria

Phase 4 is successful if:
- ✅ Can complete full 3-step booking
- ✅ Address autocomplete works (with Google Maps)
- ✅ Distance calculates automatically
- ✅ Fare calculates correctly
- ✅ Vehicle selection works
- ✅ Driver auto-assigned
- ✅ Booking created in Firebase
- ✅ Confirmation page displays correctly
- ✅ All data stored properly
- ✅ No console errors

---

## Next: Phase 5 Preview

After Phase 4 works, you'll implement:
- Razorpay payment integration
- Payment success/failure handling
- Payment confirmation page
- Invoice generation
- Payment history

---

**Ready to test!** Follow the guide and verify everything works! 🚀
