# Phase 2: Installation Instructions

## Install Required Packages for Phase 2

Run the following command to install all dependencies:

```bash
npm install firebase react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled react-hook-form yup @hookform/resolvers react-datepicker date-fns react-toastify @react-google-maps/api axios react-icons react-loader-spinner uuid
```

## Individual Package Installation (if needed)

### Core Dependencies
```bash
npm install firebase react-router-dom
```

### Material-UI (UI Framework)
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

### Form Handling & Validation
```bash
npm install react-hook-form yup @hookform/resolvers
```

### Date & Time Picker
```bash
npm install react-datepicker date-fns
```

### Notifications
```bash
npm install react-toastify
```

### Google Maps
```bash
npm install @react-google-maps/api
```

### Payment Gateway - Razorpay (Simpler option for India)
```bash
npm install razorpay
```

### Additional Utilities
```bash
npm install axios react-icons react-loader-spinner uuid
```

## One-Line Installation Command

```bash
npm install firebase react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled react-hook-form yup @hookform/resolvers react-datepicker date-fns react-toastify @react-google-maps/api axios react-icons react-loader-spinner uuid
```

## After Installation

1. Set up your `.env.local` file with Firebase credentials
2. Configure Razorpay API keys (we'll use test mode for development)
3. Start the development server: `npm start`

## What's Included in Phase 2

✅ Material-UI for modern, responsive design
✅ Form validation with React Hook Form + Yup
✅ Toast notifications for user feedback
✅ Razorpay integration (simpler than Stripe)
✅ Complete authentication flow
