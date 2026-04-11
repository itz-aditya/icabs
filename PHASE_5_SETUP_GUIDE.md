# Phase 5: Setup & Testing Guide

## Prerequisites

Before starting Phase 5, ensure:
- ✅ Phase 1-4 are complete
- ✅ Can create bookings successfully
- ✅ Firebase is configured
- ✅ Development server runs without errors

---

## Setup Steps

### Step 1: Create Razorpay Account

**Follow the detailed guide in `RAZORPAY_SETUP.md`**

Quick steps:
1. Go to [Razorpay.com](https://razorpay.com/)
2. Click "Sign Up"
3. Enter business details:
   - Email
   - Business Name: "iCabs"
   - Password
4. Verify email
5. **You're now in Test Mode** by default

### Step 2: Get Razorpay API Keys

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Make sure **Test Mode** is enabled (toggle at top-left)
3. Go to Settings (⚙️) > API Keys
4. Click "Generate Test Key"
5. You'll see:
   - **Key ID**: `rzp_test_xxxxxxxxxxxxx`
   - **Key Secret**: (click "Show" to reveal)
6. **Copy both keys**

### Step 3: Add Keys to Environment

Open `.env.local` and add:

```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
REACT_APP_RAZORPAY_KEY_SECRET=your_key_secret_here
```

**Important**: Restart the development server!

```bash
# Press Ctrl+C to stop
npm start
```

### Step 4: Verify Setup

Open browser console (F12) after starting the app. No errors related to Razorpay should appear.

---

## Testing Guide

### Test 1: Complete Payment Flow (Success)

#### Step 1: Create a Booking
1. Navigate to `/booking`
2. Fill in trip details:
   - Pickup Date: Tomorrow
   - Pickup Time: 10:00 AM
   - Source: Any address
   - Destination: Any address
3. Select a vehicle
4. Confirm booking
5. **You're now on confirmation page**

#### Step 2: Navigate to Payment
1. On confirmation page, click **"Proceed to Payment"**
2. Should navigate to `/payment/{bookingId}`
3. Verify booking summary displays:
   - ✅ Booking ID
   - ✅ Pickup date and time
   - ✅ Route (source → destination)
   - ✅ Vehicle details
   - ✅ Distance
   - ✅ Fare breakdown

#### Step 3: Initiate Payment
1. Click **"Pay Now"** button
2. Razorpay checkout modal should open
3. Should show:
   - ✅ iCabs logo
   - ✅ Amount to pay
   - ✅ Multiple payment options

#### Step 4: Complete Payment
Use **Test Card** (always succeeds):
- Card Number: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: `12/25`
- Cardholder Name: `Test User`

Click **"Pay"**

#### Step 5: Payment Success
1. Should redirect to `/payment/success`
2. Verify success page shows:
   - ✅ Green checkmark icon
   - ✅ "Payment Successful!" message
   - ✅ Payment ID (starts with `pay_`)
   - ✅ Booking details
   - ✅ Vehicle and driver info
   - ✅ "Download Receipt" button
   - ✅ "My Bookings" button

#### Step 6: Verify in Firebase
1. Go to Firebase Console > Realtime Database
2. Check `payments/` node:
   - ✅ New payment created
   - ✅ Status: "PAID"
   - ✅ razorpayPaymentId present
   - ✅ Amount matches booking fare
3. Check `bookings/{yourBookingId}`:
   - ✅ paymentStatus: "PAID"
   - ✅ paymentId: {razorpay_payment_id}

#### Step 7: Download Receipt
1. Click "Download Receipt"
2. Browser print dialog opens
3. Can save as PDF or print

---

### Test 2: Failed Payment Flow

#### Step 1: Create Another Booking
- Follow same steps as Test 1 to create a booking

#### Step 2: Fail the Payment
Use **Test Card for Failure**:
- Card Number: `4000 0000 0000 0002`
- CVV: `123`
- Expiry: `12/25`
- Cardholder Name: `Test User`

Click **"Pay"**

#### Step 3: Payment Failure
1. Should redirect to `/payment/failure`
2. Verify failure page shows:
   - ✅ Red X icon
   - ✅ "Payment Failed" message
   - ✅ Error description
   - ✅ Booking details
   - ✅ Common failure reasons
   - ✅ "Retry Payment" button
   - ✅ Support contact info

#### Step 4: Verify in Firebase
Check `payments/` node:
- ✅ Payment status: "FAILED"
- ✅ Error message stored

#### Step 5: Retry Payment
1. Click "Retry Payment"
2. Should go back to payment page
3. Can try again with successful card

---

### Test 3: Cancelled Payment

1. Go to payment page
2. Click "Pay Now"
3. Razorpay modal opens
4. Click **X** or press **Escape** to close modal
5. Should see toast: "Payment cancelled"
6. User stays on payment page
7. Can try again

---

### Test 4: Booking History

#### View All Bookings
1. Click user menu in navbar
2. Click **"My Bookings"**
3. OR navigate to `/history`
4. Should show table with all your bookings:
   - ✅ Booking ID
   - ✅ Date & Time
   - ✅ Route
   - ✅ Distance
   - ✅ Fare
   - ✅ Status (color-coded chip)
   - ✅ Payment Status (color-coded chip)
   - ✅ Action buttons

#### Test Filters
1. Select "Pending" from filter dropdown
   - ✅ Shows only pending bookings
2. Select "Completed"
   - ✅ Shows only completed bookings
3. Select "All"
   - ✅ Shows all bookings again

#### Pay for Pending Booking
1. Find a booking with Payment Status: "PENDING"
2. Click the **green payment icon** (💳)
3. Should navigate to payment page
4. Complete payment

#### View Booking Details
1. Click the **blue eye icon** (👁️)
2. Should navigate to confirmation page
3. Shows complete booking details

#### Cancel a Booking
1. Find an active booking (not cancelled/completed)
2. Click the **red cancel icon** (❌)
3. Confirmation dialog appears
4. Click "OK" to confirm
5. Success toast appears
6. Booking status updates to "CANCELLED"
7. Table refreshes

---

### Test 5: Multiple Payment Methods

Try different payment methods in Razorpay:

#### UPI Test
1. In Razorpay modal, select "UPI"
2. Enter UPI ID: `success@razorpay`
3. Will auto-approve

#### Net Banking Test
1. Select "Net Banking"
2. Choose any bank
3. Payment will succeed in test mode

#### Wallet Test
1. Select wallet (Paytm, PhonePe, etc.)
2. Payment will succeed in test mode

---

## Common Issues & Solutions

### Issue 1: Razorpay modal not opening

**Symptoms**: Click "Pay Now", nothing happens

**Solutions**:
1. Check browser console for errors
2. Verify Razorpay key in `.env.local`
3. Verify environment variable: `REACT_APP_RAZORPAY_KEY_ID`
4. Make sure it starts with `rzp_test_`
5. Restart development server
6. Clear browser cache

### Issue 2: "Invalid Key ID" error

**Solutions**:
- Check if key ID is correct
- Make sure you're using Test key (rzp_test_...)
- Verify key is not expired
- Restart development server

### Issue 3: Payment succeeds but not updating Firebase

**Solutions**:
- Check browser console for errors
- Verify Firebase security rules allow write to `payments/`
- Check network tab for failed requests
- Ensure user is authenticated

### Issue 4: Booking history empty

**Solutions**:
- Make sure you're logged in with the same user who created bookings
- Check Firebase `bookings/` node has data
- Verify `userId` matches
- Check browser console for errors

### Issue 5: "Amount mismatch" error

**Solutions**:
- Verify fare is calculated correctly
- Check amount conversion to paise (multiply by 100)
- Ensure no NaN values in fare

---

## Razorpay Test Cards Reference

| Purpose | Card Number | Result |
|---------|-------------|--------|
| Success | `4111 1111 1111 1111` | Payment succeeds |
| Failure | `4000 0000 0000 0002` | Payment fails |
| Auth Fail | `4000 0000 0000 9995` | Authentication fails |
| Insufficient Funds | `4000 0025 0000 3155` | Insufficient funds |

For all cards:
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

---

## Data Verification Checklist

After successful payment, verify in Firebase:

### Payments Collection
```
payments/
  {paymentId}/
    ✅ paymentId: auto-generated
    ✅ bookingId: links to booking
    ✅ userId: current user ID
    ✅ amount: in rupees (e.g., 500)
    ✅ amountPaise: amount * 100 (e.g., 50000)
    ✅ currency: "INR"
    ✅ status: "PAID"
    ✅ razorpayPaymentId: "pay_xxxxx"
    ✅ userDetails: {fullName, email, mobileNumber}
    ✅ createdAt: timestamp
    ✅ paidAt: timestamp
```

### Bookings Collection (Updated)
```
bookings/
  {bookingId}/
    ✅ paymentStatus: "PAID" (was "PENDING")
    ✅ paymentId: "pay_xxxxx" (new field)
```

---

## Success Criteria

Phase 5 is successful if:
- ✅ Can initiate Razorpay payment
- ✅ Payment modal opens with correct amount
- ✅ Successful payment redirects to success page
- ✅ Failed payment redirects to failure page
- ✅ Can retry failed payments
- ✅ Payment records created in Firebase
- ✅ Booking payment status updated
- ✅ Can view booking history
- ✅ Can filter bookings by status
- ✅ Can pay for pending bookings
- ✅ Can cancel active bookings
- ✅ Receipt generation works
- ✅ No console errors

---

## Next: Phase 6 Preview

After Phase 5 works, you can implement:
- User profile management
- Admin dashboard with analytics
- Manage all bookings (admin)
- Payment reports
- Driver and vehicle management UI

---

**Ready to test!** Follow the guide and verify everything works! 🚀
