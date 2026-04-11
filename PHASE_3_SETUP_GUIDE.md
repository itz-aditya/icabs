# Phase 3: Setup & Testing Guide

## Quick Setup Steps

### Step 1: Verify Packages (Already Done in Phase 2)
All required packages should already be installed from Phase 2. No new packages needed.

### Step 2: Add Sample Vehicle Data to Firebase

#### Method 1: Import JSON (Recommended)
1. Open Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Go to **Realtime Database**
4. Click the **3-dot menu** (⋮) at the top right
5. Select **"Import JSON"**
6. Choose the file `SAMPLE_VEHICLE_DATA.json`
7. Click **"Import"**
8. ✅ Done! 10 vehicles added

#### Method 2: Manual Copy-Paste
1. Open `SAMPLE_VEHICLE_DATA.json`
2. Copy all content
3. Go to Firebase Console > Realtime Database
4. Click on the root node
5. Click **"+"** to add child
6. Click the **3-dot menu** > **"Import JSON"**
7. Paste the content
8. Click **"Import"**

### Step 3: Verify Data in Firebase
1. In Realtime Database, expand the `vehicles` node
2. You should see 10 vehicles (vehicle_001 to vehicle_010)
3. Each vehicle should have:
   - model, type, capacity
   - features (array)
   - pricePerKm, basePrice
   - availability
   - imageUrl, licensePlate, color

### Step 4: Start the App
```bash
npm start
```

## Testing Checklist

### ✅ Fleet Page (`/fleet`)

**Basic Display**:
- [ ] Navigate to http://localhost:3000/fleet
- [ ] All 10 vehicles displayed in grid
- [ ] Vehicle cards show: image, model, type, capacity, features, price
- [ ] Availability status shown (green checkmark or red X)

**Search Functionality**:
- [ ] Type "Toyota" in search → Shows only Toyota vehicles
- [ ] Type "SUV" in search → Shows all SUVs
- [ ] Type "AC" in search → Shows vehicles with AC feature
- [ ] Clear search → Shows all vehicles again

**Filter by Type**:
- [ ] Select "Sedan" → Shows only Sedans (4 vehicles)
- [ ] Select "SUV" → Shows only SUVs (3 vehicles)
- [ ] Select "Hatchback" → Shows only Hatchbacks (2 vehicles)
- [ ] Select "Luxury" → Shows only Luxury (2 vehicles)
- [ ] Select "All" → Shows all vehicles

**Filter by Availability**:
- [ ] Select "Available" → Shows only available vehicles
- [ ] Select "Unavailable" → Shows unavailable vehicles
- [ ] Select "All" → Shows all vehicles

**Combined Filters**:
- [ ] Search "Honda" + Type "Sedan" → Should show Honda City
- [ ] Type "SUV" + Availability "Available" → Shows available SUVs only
- [ ] Active filters shown as chips
- [ ] Clicking X on chip removes that filter

**Book Now Button**:
- [ ] While logged out: Click "Book Now" → Redirects to sign-in
- [ ] While logged in: Click "Book Now" → Navigates to booking page
- [ ] Only shows on available vehicles

**Responsive**:
- [ ] Resize browser → Grid adjusts (3 cols → 2 cols → 1 col)
- [ ] Works on mobile view

---

### ✅ About Page (`/about`)

- [ ] Navigate to http://localhost:3000/about
- [ ] Hero section displays with title
- [ ] "Our Story" section shows company history
- [ ] Statistics section shows 4 stat cards:
  - 10,000+ Happy Customers
  - 50,000+ Rides Completed
  - 500+ Verified Drivers
  - 25+ Cities Covered
- [ ] Mission & Vision cards display
- [ ] Core Values section shows 4 values
- [ ] Hover effects work on stat cards
- [ ] Responsive on mobile

---

### ✅ Contact Page (`/contact`)

**Form Display**:
- [ ] Navigate to http://localhost:3000/contact
- [ ] Form shows: Name, Email, Phone, Message fields
- [ ] Contact info displayed on the right (Email, Phone, Office)

**Form Validation**:
- [ ] Submit empty form → All fields show "required" errors
- [ ] Enter invalid email → Shows "Enter a valid email"
- [ ] Enter 9-digit phone → Shows "must be exactly 10 digits"
- [ ] Enter short message (<10 chars) → Shows error

**Form Submission**:
- [ ] Fill all fields correctly
- [ ] Click "Send Message"
- [ ] Success alert appears
- [ ] Success toast notification
- [ ] Form resets to empty
- [ ] Go to Firebase Console > Realtime Database > contact-messages
- [ ] Verify new entry created with:
  - name, email, phone, message
  - status: "NEW"
  - createdAt timestamp
  - messageId

**Responsive**:
- [ ] On mobile: Form and contact info stack vertically

---

### ✅ Feedback Page (`/feedback`)

**Access Control**:
- [ ] While logged out: Navigate to http://localhost:3000/feedback
- [ ] Should redirect to sign-in page
- [ ] Sign in first
- [ ] Navigate to /feedback again
- [ ] Should load successfully

**Form Display**:
- [ ] Shows: Booking ID, Rating, Comment fields
- [ ] Rating shows 5 stars
- [ ] "Why Feedback Matters" section at bottom

**Rating Interaction**:
- [ ] Click 1 star → Shows "Poor"
- [ ] Click 2 stars → Shows "Fair"
- [ ] Click 3 stars → Shows "Good"
- [ ] Click 4 stars → Shows "Very Good"
- [ ] Click 5 stars → Shows "Excellent"

**Form Validation**:
- [ ] Submit empty → All fields show errors
- [ ] No rating selected → Shows "Please select a rating"
- [ ] Short comment (<10 chars) → Shows error
- [ ] Missing booking ID → Shows error

**Form Submission**:
- [ ] Fill Booking ID: "BOOK123"
- [ ] Select 5 stars
- [ ] Write comment (min 10 characters)
- [ ] Click "Submit Feedback"
- [ ] Success alert appears
- [ ] Success toast notification
- [ ] Form resets
- [ ] Go to Firebase Console > Realtime Database > feedback
- [ ] Verify new entry created with:
  - userId (your user ID)
  - bookingId: "BOOK123"
  - rating: 5
  - comment: your comment
  - createdAt timestamp

---

### ✅ Navigation Links

**Navbar Links**:
- [ ] Click "Home" → Goes to /
- [ ] Click "Fleet" → Goes to /fleet
- [ ] Click "About" → Goes to /about
- [ ] Click "Contact" → Goes to /contact

**Footer Links**:
- [ ] Click "Our Fleet" → Goes to /fleet
- [ ] Click "About Us" → Goes to /about
- [ ] Click "Contact Us" → Goes to /contact
- [ ] Click "Feedback" → Goes to /feedback

---

## Common Issues & Solutions

### Issue: No vehicles showing on Fleet page
**Solution**: 
- Check Firebase Console > Realtime Database
- Verify `vehicles` node exists with data
- Check browser console for errors
- Verify Firebase security rules allow read access

### Issue: Contact form submits but no data in Firebase
**Solution**:
- Check Firebase security rules
- Ensure `contact-messages` write permission is set
- Check browser console for errors

### Issue: Feedback page accessible without login
**Solution**:
- Verify `ProtectedRoute` is wrapping FeedbackPage in App.js
- Check AuthContext is working (sign out and try again)

### Issue: Vehicle images not loading
**Solution**:
- Images use placeholder URLs
- This is expected - real images would be uploaded to Firebase Storage
- Vehicle info still displays correctly

### Issue: Search/filter not working
**Solution**:
- Check browser console for errors
- Verify vehicle data has correct structure (type, model, features)
- Try refreshing the page

---

## Next Phase Preview

After testing Phase 3, you'll be ready for **Phase 4: Booking System**:
- Complete booking form with date/time pickers
- Address autocomplete using Google Places API
- Distance calculation
- Fare calculation based on vehicle pricing
- Driver assignment logic
- Booking confirmation

---

## Success Criteria

Phase 3 is successful if:
- ✅ Fleet page displays all vehicles
- ✅ Search and filters work correctly
- ✅ About page looks professional
- ✅ Contact form submits to Firebase
- ✅ Feedback form (protected) submits to Firebase
- ✅ All pages are responsive
- ✅ Navigation links work
- ✅ No console errors
- ✅ Toast notifications appear
- ✅ Data appears in Firebase Database

---

**Ready to test!** Follow the checklist and verify everything works! 🚀
