# Razorpay Payment Gateway Setup Guide

## Why Razorpay?

Razorpay is the easiest payment gateway for Indian businesses:
- ✅ Simple integration (just a few lines of code)
- ✅ No setup fees, no annual fees
- ✅ Supports all payment methods (Cards, UPI, Wallets, Net Banking)
- ✅ Test mode available (no real money needed for development)
- ✅ Instant settlements
- ✅ Great documentation

---

## Step 1: Create Razorpay Account

### For Testing (Recommended for Development)

1. Go to [Razorpay](https://razorpay.com/)
2. Click **"Sign Up"**
3. Fill in details:
   - Business Email
   - Password
   - Business Name: "iCabs"
4. Verify email
5. **Skip KYC for now** (Test mode doesn't need it)
6. You'll be in **Test Mode** by default

### For Production (Later)

- Complete KYC verification
- Add bank account details
- Submit required documents
- Wait for approval (1-2 days)

---

## Step 2: Get API Keys

### Test Mode Keys (For Development)

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Make sure you're in **Test Mode** (toggle at top-left)
3. Go to **Settings** (⚙️) > **API Keys**
4. Click **"Generate Test Key"** (if not already generated)
5. You'll see:
   - **Key ID**: `rzp_test_xxxxxxxxxxxxx`
   - **Key Secret**: Click "Show" to reveal (keep this secret!)
6. **Copy both keys** - you'll need them

### Production Keys (After KYC Approval)

1. Toggle to **Live Mode** in dashboard
2. Go to Settings > API Keys
3. Generate Live keys
4. Use these only in production

---

## Step 3: Add Keys to Environment Variables

Open or create `.env.local` in your project root:

```env
# Razorpay Test Keys (for development)
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
REACT_APP_RAZORPAY_KEY_SECRET=your_key_secret_here

# For production, use live keys:
# REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
```

**Important**: 
- Only `REACT_APP_RAZORPAY_KEY_ID` should be in frontend code
- Never expose `REACT_APP_RAZORPAY_KEY_SECRET` in frontend
- Key Secret should only be used in backend (we'll use it for verification)

---

## Step 4: Install Razorpay SDK (Already done)

The Razorpay SDK is loaded via CDN in the browser. No npm package needed!

---

## Step 5: Test Payment Flow

### Test Cards (In Test Mode)

Razorpay provides test cards that always succeed or fail:

**Successful Payment**:
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)
- Name: Any name

**Failed Payment** (to test failure flow):
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

**UPI Test**:
- UPI ID: `success@razorpay`
- Will auto-approve

---

## Step 6: Load Razorpay Script

Add this to your `public/index.html` (before closing `</body>` tag):

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

Or load it dynamically in your payment component.

---

## Understanding Razorpay Checkout Flow

1. **Create Order**: Your app creates an order with amount
2. **Open Checkout**: Razorpay modal opens with payment options
3. **User Pays**: User selects method and completes payment
4. **Payment Success**: Razorpay returns payment details
5. **Verify Payment**: Your app verifies the payment signature
6. **Update Database**: Mark booking as paid

---

## Important Razorpay Concepts

### Amount Format
- Razorpay uses **paise** (smallest currency unit)
- ₹100 = 10000 paise
- Always multiply amount by 100: `amount * 100`

### Payment ID
- Unique ID for each payment: `pay_xxxxxxxxxxxxx`
- Store this in your database

### Order ID
- Unique ID for each order: `order_xxxxxxxxxxxxx`
- Created before opening checkout

### Signature
- Used to verify payment authenticity
- Prevents tampering
- Generated using: `order_id|payment_id` + secret

---

## Security Best Practices

1. **Never expose Key Secret** in frontend code
2. **Always verify payment signature** (prevents fake payments)
3. **Use HTTPS** in production
4. **Validate amount** before accepting payment
5. **Store transaction IDs** for reference
6. **Use webhooks** for payment notifications (advanced)

---

## Razorpay Dashboard Features

### View Payments
- Go to **Payments** in dashboard
- See all transactions
- Filter by status, date, etc.

### Refunds
- Click on any payment
- Click "Refund"
- Enter amount (full or partial)

### Settlement
- In Live mode, money settles to your bank
- T+2 or T+3 days (configurable)
- No settlement in Test mode

---

## Pricing (Production)

- **Transaction Fee**: 2% per transaction
- **No setup fees**
- **No annual fees**
- **No hidden charges**

Example: ₹1000 transaction = ₹20 fee (you receive ₹980)

---

## Common Issues & Solutions

### "Invalid Key ID"
- Check if key ID is correct in `.env.local`
- Verify you're using Test key in Test mode
- Restart development server after adding keys

### "Payment failed"
- In Test mode, use test cards provided above
- Check if amount is in paise (multiply by 100)
- Check browser console for errors

### Checkout modal not opening
- Verify Razorpay script is loaded
- Check browser console for errors
- Ensure key ID is correct

### "Signature verification failed"
- Check if you're using the correct key secret
- Verify signature calculation is correct
- Contact Razorpay support if issue persists

---

## Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Checkout Integration Guide](https://razorpay.com/docs/payments/payment-gateway/web-integration/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Dashboard](https://dashboard.razorpay.com/)
- [Support](https://razorpay.com/support/)

---

## Next Steps After Setup

1. ✅ Create Razorpay account
2. ✅ Get Test API keys
3. ✅ Add keys to `.env.local`
4. ✅ Add Razorpay script to `public/index.html`
5. ✅ Restart development server
6. 🚀 Ready to integrate payment in your app!

---

**Important Note**: For this project, we'll start with **Test Mode**. You can switch to Live Mode later after completing KYC and testing thoroughly.
