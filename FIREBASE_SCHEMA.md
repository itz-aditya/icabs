# Firebase Realtime Database Schema

This document outlines the database structure for the iCabs application.

## Database Structure

```
icabs-database/
├── users/
│   └── {userId}/
│       ├── uid: string
│       ├── email: string
│       ├── fullName: string
│       ├── mobileNumber: string
│       ├── gender: string (Male/Female/Other)
│       ├── userType: string (NORMAL_USER/ADMIN)
│       ├── createdAt: string (ISO timestamp)
│       └── updatedAt: string (ISO timestamp)
│
├── bookings/
│   └── {bookingId}/
│       ├── bookingId: string
│       ├── userId: string
│       ├── userDetails: object
│       │   ├── fullName: string
│       │   ├── email: string
│       │   └── mobileNumber: string
│       ├── driverId: string (optional, assigned later)
│       ├── vehicleId: string
│       ├── pickupDate: string
│       ├── pickupTime: string
│       ├── sourceAddress: object
│       │   ├── address: string
│       │   ├── lat: number
│       │   └── lng: number
│       ├── destinationAddress: object
│       │   ├── address: string
│       │   ├── lat: number
│       │   └── lng: number
│       ├── distance: number (in km)
│       ├── fare: number
│       ├── status: string (PENDING/CONFIRMED/ASSIGNED/IN_PROGRESS/COMPLETED/CANCELLED)
│       ├── paymentStatus: string (PENDING/PAID/FAILED/REFUNDED)
│       ├── paymentId: string (optional)
│       ├── createdAt: string (ISO timestamp)
│       └── updatedAt: string (ISO timestamp)
│
├── vehicles/
│   └── {vehicleId}/
│       ├── vehicleId: string
│       ├── model: string
│       ├── type: string (Sedan/SUV/Hatchback/Luxury)
│       ├── capacity: number
│       ├── features: array of strings
│       ├── pricePerKm: number
│       ├── basePrice: number
│       ├── availability: boolean
│       ├── imageUrl: string
│       ├── licensePlate: string
│       ├── color: string
│       ├── createdAt: string (ISO timestamp)
│       └── updatedAt: string (ISO timestamp)
│
├── drivers/
│   └── {driverId}/
│       ├── driverId: string
│       ├── name: string
│       ├── email: string
│       ├── phone: string
│       ├── licenseNumber: string
│       ├── vehicleId: string
│       ├── availability: boolean
│       ├── rating: number (0-5)
│       ├── totalRides: number
│       ├── experience: number (years)
│       ├── photoUrl: string
│       ├── createdAt: string (ISO timestamp)
│       └── updatedAt: string (ISO timestamp)
│
├── payments/
│   └── {paymentId}/
│       ├── paymentId: string
│       ├── bookingId: string
│       ├── userId: string
│       ├── amount: number
│       ├── status: string (PENDING/SUCCESS/FAILED/REFUNDED)
│       ├── transactionId: string (from payment gateway)
│       ├── paymentMethod: string (Razorpay/Stripe/Card/UPI/etc)
│       ├── gateway: string (Razorpay/Stripe)
│       ├── createdAt: string (ISO timestamp)
│       └── updatedAt: string (ISO timestamp)
│
├── feedback/
│   └── {feedbackId}/
│       ├── feedbackId: string
│       ├── bookingId: string
│       ├── userId: string
│       ├── driverId: string
│       ├── rating: number (1-5)
│       ├── comment: string
│       ├── createdAt: string (ISO timestamp)
│       └── updatedAt: string (ISO timestamp)
│
└── contact-messages/
    └── {messageId}/
        ├── messageId: string
        ├── name: string
        ├── email: string
        ├── phone: string
        ├── message: string
        ├── status: string (NEW/READ/RESPONDED)
        └── createdAt: string (ISO timestamp)
```

## Firebase Security Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('userType').val() === 'ADMIN'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('userType').val() === 'ADMIN'"
      }
    },
    "bookings": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$bookingId": {
        ".read": "auth != null && (data.child('userId').val() === auth.uid || root.child('users').child(auth.uid).child('userType').val() === 'ADMIN')",
        ".write": "auth != null && (data.child('userId').val() === auth.uid || root.child('users').child(auth.uid).child('userType').val() === 'ADMIN')"
      }
    },
    "vehicles": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('userType').val() === 'ADMIN'"
    },
    "drivers": {
      ".read": "auth != null",
      ".write": "root.child('users').child(auth.uid).child('userType').val() === 'ADMIN'"
    },
    "payments": {
      "$paymentId": {
        ".read": "auth != null && (data.child('userId').val() === auth.uid || root.child('users').child(auth.uid).child('userType').val() === 'ADMIN')",
        ".write": "auth != null"
      }
    },
    "feedback": {
      ".read": "root.child('users').child(auth.uid).child('userType').val() === 'ADMIN'",
      "$feedbackId": {
        ".read": "auth != null && data.child('userId').val() === auth.uid",
        ".write": "auth != null && newData.child('userId').val() === auth.uid"
      }
    },
    "contact-messages": {
      ".read": "root.child('users').child(auth.uid).child('userType').val() === 'ADMIN'",
      ".write": "auth != null"
    }
  }
}
```
