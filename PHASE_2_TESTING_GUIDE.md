# Phase 2: Testing Guide

## Prerequisites

Before testing, ensure:
1. All packages are installed (see `PHASE_2_INSTALLATION.md`)
2. Firebase project is set up
3. `.env.local` file is configured with Firebase credentials
4. Development server is running: `npm start`

## Testing Checklist

### ✅ 1. Visual/UI Testing

**Navbar**:
- [ ] Logo and brand name visible
- [ ] Navigation links work (Home, Fleet, About, Contact)
- [ ] Mobile menu works on small screens
- [ ] Sign In/Sign Up buttons visible when logged out
- [ ] User menu visible when logged in
- [ ] Admin Portal link visible only for admin users

**Footer**:
- [ ] All links navigate correctly
- [ ] Social media icons present
- [ ] Contact information displayed
- [ ] Copyright year is current

**Home Page**:
- [ ] Hero section displays correctly
- [ ] Features cards display in grid
- [ ] Hover effects work on feature cards
- [ ] CTA buttons change based on login status
- [ ] Responsive on mobile devices

### ✅ 2. Sign Up Flow

**Test Case 1: Successful Sign Up**
1. Navigate to Sign Up page (`/signup`)
2. Fill in all fields correctly:
   - Full Name: "John Doe"
   - Email: "john.doe@example.com"
   - Mobile: "9876543210"
   - Gender: Select "Male"
   - Password: "password123"
   - Confirm Password: "password123"
3. Click "Sign Up"
4. **Expected**: 
   - Success toast appears
   - Redirected to Sign In page
   - User created in Firebase Auth
   - User data stored in Firebase Database with `userType: NORMAL_USER`

**Test Case 2: Validation Errors**
- [ ] Empty fields show "required" errors
- [ ] Invalid email format shows error
- [ ] Mobile number not 10 digits shows error
- [ ] Password less than 6 characters shows error
- [ ] Passwords don't match shows error
- [ ] Full name less than 2 characters shows error

**Test Case 3: Duplicate Email**
1. Try to sign up with an existing email
2. **Expected**: Error toast "This email is already registered"

### ✅ 3. Sign In Flow

**Test Case 1: Successful Sign In (Normal User)**
1. Navigate to Sign In page (`/signin`)
2. Enter valid credentials
3. Click "Sign In"
4. **Expected**:
   - Success toast with user name
   - Redirected to Home page
   - Navbar shows user menu
   - "Book a Cab" button visible

**Test Case 2: Successful Sign In (Admin User)**
1. Sign in with admin credentials
2. **Expected**:
   - Success toast
   - Redirected to Admin Dashboard
   - Navbar shows "Admin Portal" link

**Test Case 3: Invalid Credentials**
- [ ] Wrong email shows error
- [ ] Wrong password shows "Invalid email or password"
- [ ] Invalid email format shows error

**Test Case 4: Empty Fields**
- [ ] Empty email shows validation error
- [ ] Empty password shows validation error

### ✅ 4. Forgot Password Flow

**Test Case 1: Successful Password Reset**
1. Navigate to Forgot Password page (`/forgot-password`)
2. Enter registered email
3. Click "Send Reset Link"
4. **Expected**:
   - Success message appears
   - Success toast notification
   - Password reset email sent to inbox
   - Check email and verify reset link works

**Test Case 2: Invalid Email**
1. Enter non-existent email
2. **Expected**: Error "No account found with this email"

**Test Case 3: Empty Email**
1. Leave email field empty
2. **Expected**: Validation error "Email is required"

### ✅ 5. Change Password Flow

**Test Case 1: Successful Password Change**
1. Sign in first
2. Navigate to Change Password (`/change-password`)
3. Enter:
   - Current Password: correct password
   - New Password: "newpassword123"
   - Confirm New Password: "newpassword123"
4. Click "Change Password"
5. **Expected**:
   - Success toast
   - Redirected to home
   - Can sign in with new password

**Test Case 2: Wrong Current Password**
1. Enter incorrect current password
2. **Expected**: Error "Current password is incorrect"

**Test Case 3: Passwords Don't Match**
1. New password and confirm don't match
2. **Expected**: Validation error "Passwords must match"

**Test Case 4: Weak New Password**
1. Enter password less than 6 characters
2. **Expected**: Validation error

### ✅ 6. Navigation Testing

**Test Case 1: Protected Routes (Logged Out)**
1. Try to access `/booking` while logged out
2. **Expected**: Redirected to `/signin`

**Test Case 2: Protected Routes (Logged In)**
1. Sign in as normal user
2. Access `/booking`
3. **Expected**: Page loads successfully

**Test Case 3: Admin Routes (Normal User)**
1. Sign in as normal user
2. Try to access `/admin`
3. **Expected**: Redirected to home page

**Test Case 4: Admin Routes (Admin)**
1. Sign in as admin
2. Access `/admin`
3. **Expected**: Admin dashboard loads

### ✅ 7. Logout Testing

**Test Case 1: Logout**
1. Sign in
2. Click user menu in navbar
3. Click "Logout"
4. **Expected**:
   - Success toast "Logged out successfully"
   - Redirected to home
   - Navbar shows Sign In/Sign Up buttons
   - Protected routes no longer accessible

### ✅ 8. Responsive Design Testing

**Test on different screen sizes**:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Check**:
- [ ] Navbar collapses to mobile menu
- [ ] Forms are usable on mobile
- [ ] Buttons are tappable
- [ ] Text is readable
- [ ] No horizontal scrolling

### ✅ 9. Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### ✅ 10. Firebase Integration

**Verify in Firebase Console**:
1. Go to Firebase Console > Authentication
2. **Check**: New users appear in Users list
3. Go to Realtime Database
4. **Check**: User data stored with correct structure:
   ```
   users/
     {userId}/
       uid: string
       email: string
       fullName: string
       mobileNumber: string
       gender: string
       userType: "NORMAL_USER"
       createdAt: timestamp
       updatedAt: timestamp
   ```

## Creating an Admin User (For Testing)

Since sign up always creates `NORMAL_USER`, to test admin functionality:

1. Sign up a new account normally
2. Go to Firebase Console > Realtime Database
3. Find the user under `users/{userId}`
4. Change `userType` from `"NORMAL_USER"` to `"ADMIN"`
5. Sign out and sign in again
6. **Expected**: User now has admin access

## Common Issues & Solutions

**Issue**: "Firebase not configured"
- **Solution**: Check `.env.local` file exists and has correct credentials

**Issue**: Sign up fails silently
- **Solution**: Check browser console for errors, verify Firebase Auth is enabled

**Issue**: "User data not found" after sign in
- **Solution**: Check Firebase Realtime Database security rules allow read access

**Issue**: Toast notifications don't appear
- **Solution**: Verify ToastContainer is in index.js and react-toastify CSS is imported

**Issue**: Password reset email not received
- **Solution**: Check spam folder, verify email is registered, check Firebase email templates

---

## Success Criteria

Phase 2 is successful if:
- ✅ All sign up validations work
- ✅ Users can register and sign in
- ✅ userType is correctly set to NORMAL_USER
- ✅ Password reset works
- ✅ Change password works
- ✅ Protected routes work
- ✅ Admin routes work
- ✅ Navbar and Footer display correctly
- ✅ Responsive on mobile
- ✅ Toast notifications appear
- ✅ No console errors

---

**Ready to Test?** Start the development server and go through each test case! 🚀
