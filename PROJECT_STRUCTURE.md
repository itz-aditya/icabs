# iCabs Project Structure

## Current Folder Structure

```
icabs/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ProtectedRoute.js
│   │   ├── AdminRoute.js
│   │   └── .gitkeep
│   │
│   ├── pages/              # Page components (routes)
│   │   ├── HomePage.js
│   │   ├── SignUpPage.js
│   │   ├── SignInPage.js
│   │   ├── BookingPage.js
│   │   ├── AdminDashboard.js
│   │   └── .gitkeep
│   │
│   ├── context/            # React Context providers
│   │   ├── AuthContext.js
│   │   └── .gitkeep
│   │
│   ├── services/           # Firebase & API services
│   │   ├── authService.js
│   │   └── .gitkeep
│   │
│   ├── config/             # Configuration files
│   │   └── firebase.js
│   │
│   ├── constants/          # Application constants
│   │   ├── userTypes.js
│   │   ├── routes.js
│   │   ├── bookingStatus.js
│   │   └── .gitkeep
│   │
│   ├── utils/              # Utility functions
│   │   ├── validation.js
│   │   ├── formatters.js
│   │   └── .gitkeep
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── .gitkeep
│   │
│   ├── App.js              # Main App component with routing
│   ├── App.css
│   ├── index.js            # Entry point
│   ├── index.css
│   ├── App.test.js
│   ├── setupTests.js
│   └── reportWebVitals.js
│
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
├── package-lock.json
├── INSTALLATION.md         # Installation guide
├── FIREBASE_SCHEMA.md      # Database schema documentation
├── PROJECT_STRUCTURE.md    # This file
├── Notes.md
└── README.md
```

## Key Files Description

### Configuration Files

- **src/config/firebase.js**: Firebase initialization and configuration
- **.env.example**: Template for environment variables
- **.env.local**: Actual environment variables (not in git)

### Context

- **src/context/AuthContext.js**: Global authentication state with userType support

### Services

- **src/services/authService.js**: Firebase authentication operations (signup, signin, logout, etc.)

### Constants

- **src/constants/userTypes.js**: User type definitions (NORMAL_USER/ADMIN)
- **src/constants/routes.js**: All application routes
- **src/constants/bookingStatus.js**: Booking and payment status constants

### Components

- **src/components/ProtectedRoute.js**: Wrapper for authenticated routes
- **src/components/AdminRoute.js**: Wrapper for admin-only routes

### Pages (Current)

- **HomePage.js**: Landing page (placeholder)
- **SignUpPage.js**: User registration (placeholder)
- **SignInPage.js**: User login (placeholder)
- **BookingPage.js**: Cab booking (placeholder)
- **AdminDashboard.js**: Admin portal (placeholder)

## Upcoming Structure (Future Phases)

### Components (To be added)
```
components/
├── Layout/
│   ├── Navbar.js
│   ├── Footer.js
│   └── Sidebar.js
├── Forms/
│   ├── BookingForm.js
│   ├── SignUpForm.js
│   └── SignInForm.js
├── Cards/
│   ├── VehicleCard.js
│   ├── BookingCard.js
│   └── DriverCard.js
└── Common/
    ├── Button.js
    ├── Input.js
    ├── Loader.js
    └── Modal.js
```

### Services (To be added)
```
services/
├── bookingService.js      # Booking CRUD operations
├── vehicleService.js      # Vehicle management
├── driverService.js       # Driver management
├── paymentService.js      # Payment processing
└── feedbackService.js     # Feedback operations
```

### Hooks (To be added)
```
hooks/
├── useBookings.js         # Fetch and manage bookings
├── useVehicles.js         # Fetch vehicles
└── useDrivers.js          # Fetch drivers
```

## Next Steps

Phase 1 ✅ Complete:
- Folder structure created
- Firebase configured
- Authentication context set up
- Basic routing in place
- Constants defined

Phase 2 📝 Next:
- Implement authentication pages (Sign Up, Sign In)
- Build authentication forms
- Add form validation
- Implement forgot/change password
