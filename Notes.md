Cabs Booking System - I want to create a React application where i will use firebase for my authentication and store i will use firebase realtime firebase. The use case is that i have a vehicle fleet and many drivers and i want to provide a service to book a cab. I want to create a web application which is fully responsive and mobile friendly and modern css styling. Users can come and book a cab and pay for it, based on the source and destination address a fair would be calculated and shown and assigned to the available driver accordingly. I want to build this application which will be used by end users for booking the cab and by admin to manage the bookings, vehicles, drivers, payments, etc.
Build this application step by step and take my feedback after each step.

Pages/Functionality to be implemented

1. Home Page 
2. Sign Up Page - Full Name, Mobile Number, Email, Password, Confirm Password, Gender
3. Sign In - Email and Passwrod 
4. Booking Page - Add Pick Up Date, Time, Source Address and Destination Address 
5. Payments Page - integrate payment sdk - razorpay or stripe 
6. Cancel Booking
7. History Page - it will show past bookings
8. Search Bookings - For Admin only 
9. Change Password/Forgot Password  
10. Sign out button 
11. Fleet Page - Users can check the list of all available vehicles 
12. Contact Us 
13. About Us 
14. Feedback Page 
15. Admin Portal - Manage Bookings, Manage Vehicles, Manage Drivers, Payments History, etc 


Dependencies 

# Firebase
firebase

# Routing
react-router-dom

# UI Framework (Choose one - I recommend TailwindCSS for modern styling)
# Option 1: TailwindCSS
tailwindcss postcss autoprefixer
@headlessui/react
@heroicons/react

# OR Option 2: Material-UI
# @mui/material @mui/icons-material @emotion/react @emotion/styled

# Form Handling & Validation
react-hook-form
yup
@hookform/resolvers

# Date & Time Picker
react-datepicker
date-fns

# Notifications
react-toastify

# Google Maps Integration
@react-google-maps/api

# Payment Gateway (Choose one)
# For Razorpay
razorpay

# OR For Stripe
# @stripe/stripe-js @stripe/react-stripe-js

# HTTP Client (for API calls to payment gateways, etc.)
axios

# Icons (if not using Material-UI)
react-icons

# Loading Spinners
react-loader-spinner

# UUID Generation
uuid


Installation - 

npm install firebase react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled react-hook-form yup @hookform/resolvers react-datepicker date-fns react-toastify @react-google-maps/api axios react-icons react-loader-spinner uuid





Others stuffs

Step 2: Firebase Setup
A. Create Firebase Project
Go to Firebase Console
Click "Add project"
Enter project name: "icabs" (or any name you prefer)
Disable Google Analytics (optional for now)
Click "Create project"
B. Enable Authentication
In Firebase Console, go to Build > Authentication
Click "Get started"
Click on "Email/Password" under Sign-in method
Enable Email/Password authentication
Click "Save"
C. Create Realtime Database
In Firebase Console, go to Build > Realtime Database
Click "Create Database"
Choose location (e.g., United States)
Start in "Test mode" (we'll update security rules later)
Click "Enable"
D. Get Firebase Configuration
In Firebase Console, click on ⚙️ (Settings) > Project settings
Scroll down to "Your apps" section
Click on Web icon (</> ) to add a web app
Register app with nickname: "iCabs Web"
Copy the Firebase configuration object
It will look like this:

const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "icabs-xxxxx.firebaseapp.com",
  databaseURL: "https://icabs-xxxxx-default-rtdb.firebaseio.com",
  projectId: "icabs-xxxxx",
  storageBucket: "icabs-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
Step 3: Configure Environment Variables
A. Create .env.local file
In the root directory of your project (same level as  package.json), create a file named .env.local:

B. Add Firebase Credentials
Open .env.local and add your Firebase configuration:

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=icabs-xxxxx.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://icabs-xxxxx-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=icabs-xxxxx
REACT_APP_FIREBASE_STORAGE_BUCKET=icabs-xxxxx.appspot.com

Important: Replace all the xxxxx values with your actual Firebase configuration values.

Step 4: Update Firebase Security Rules
Go to Firebase Console > Realtime Database > Rules
Replace the default rules with these:

{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('userType').val() === 'ADMIN'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('userType').val() === 'ADMIN'"

Click "Publish"

Step 5: Verify Files Are Correct
Files that reference Firebase config:
1.  src/config/firebase.js - ✅ Already created (Phase 1)

This file reads from .env.local
No changes needed
2.  src/services/authService.js - ✅ Already created (Phase 1)

Imports from  src/config/firebase.js
No changes needed
3.  src/context/AuthContext.js - ✅ Already created (Phase 1)

Uses auth from config
No changes needed
Step 6: Start the Development Server
The app should open at http://localhost:3000

Step 7: Test Phase 2 Features
Test 1: Sign Up
Navigate to http://localhost:3000/signup
Fill in the form:
Full Name: Test User
Email: test@example.com
Mobile: 9876543210
Gender: Male
Password: test123
Confirm Password: test123
Click "Sign Up"
Expected: Success toast, redirect to Sign In
Test 2: Verify User in Firebase
Go to Firebase Console > Authentication
Check: New user appears in the list
Go to Realtime Database
Check: User data exists under users/{userId} with userType: "NORMAL_USER"
Test 3: Sign In
Navigate to http://localhost:3000/signin
Enter email and password
Click "Sign In"
Expected: Success toast, redirect to Home, navbar shows user menu
Test 4: Navigation
Check navbar shows:
Logo
Home, Fleet, About, Contact links
User menu with name
Book a Cab button
Click user menu
Check: Shows "My Bookings", "Change Password", "Logout"
Test 5: Forgot Password
Navigate to http://localhost:3000/forgot-password
Enter your email
Click "Send Reset Link"
Expected: Success message, check email inbox
Test 6: Logout
Click user menu
Click "Logout"
Expected: Success toast, redirect to home, navbar shows Sign In/Sign Up
Step 8: Create an Admin User (For Testing Admin Features)
Since all signups create NORMAL_USER, to test admin routes:

Sign up a new account (e.g., admin@icabs.com)
Go to Firebase Console > Realtime Database
Navigate to users/
Find your user by UID
Click on userType
Change value from "NORMAL_USER" to "ADMIN"
Sign out and sign in again with admin@icabs.com
Expected: Navbar now shows "Admin Portal" link
Navigate to /admin
Expected: Admin Dashboard loads