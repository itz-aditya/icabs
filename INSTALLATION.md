# iCabs Installation Guide

## Phase 1: Foundation & Setup - Installation Instructions

### Step 1: Install Required NPM Packages

Run the following commands in your terminal:

#### Core Dependencies
```bash
npm install firebase react-router-dom
```

#### UI Framework - TailwindCSS (Recommended)
```bash
npm install -D tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
npx tailwindcss init -p
```

**OR if you prefer Material-UI:**
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

#### Form Handling & Validation
```bash
npm install react-hook-form yup @hookform/resolvers
```

#### Date & Time Picker
```bash
npm install react-datepicker date-fns
```

#### Notifications
```bash
npm install react-toastify
```

#### Google Maps
```bash
npm install @react-google-maps/api
```

#### Payment Gateway - Razorpay (Recommended for India)
```bash
npm install razorpay
```

**OR if you prefer Stripe:**
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

#### Additional Utilities
```bash
npm install axios react-icons react-loader-spinner uuid
```

### Step 2: Configure TailwindCSS (if using TailwindCSS)

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#64748b',
      }
    },
  },
  plugins: [],
}
```

Add to `src/index.css` (at the top):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 3: Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your Firebase credentials in `.env.local`

### Step 4: Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "icabs"
3. Enable Authentication > Email/Password
4. Create Realtime Database
5. Copy configuration to `.env.local`
6. Set up security rules from `FIREBASE_SCHEMA.md`

### Step 5: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API and Places API
3. Create API key
4. Add to `.env.local`

### Step 6: Set Up Payment Gateway

**For Razorpay:**
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get API keys from Dashboard
3. Add to `.env.local`

**For Stripe:**
1. Sign up at [Stripe](https://stripe.com/)
2. Get publishable key
3. Add to `.env.local`

### Step 7: Run the Application

```bash
npm start
```

The application will open at `http://localhost:3000`

### Complete Installation Command (One-liner)

```bash
npm install firebase react-router-dom tailwindcss postcss autoprefixer @headlessui/react @heroicons/react react-hook-form yup @hookform/resolvers react-datepicker date-fns react-toastify @react-google-maps/api razorpay axios react-icons react-loader-spinner uuid && npx tailwindcss init -p
```

## Next Steps

After installation:
1. Configure Firebase as per `FIREBASE_SCHEMA.md`
2. Set up all environment variables in `.env.local`
3. Proceed to Phase 2: Authentication System
