# Google Maps API Setup Guide

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: **"iCabs"**
5. Click **"Create"**

## Step 2: Enable Required APIs

You need to enable 4 APIs for the booking system:

1. In Google Cloud Console, go to **"APIs & Services" > "Library"**

2. Search and enable each of these APIs:
   - ✅ **Maps JavaScript API** (for displaying maps)
   - ✅ **Places API** (for address autocomplete)
   - ✅ **Distance Matrix API** (for distance calculation)
   - ✅ **Geocoding API** (for converting addresses to coordinates)

For each API:
- Click on the API name
- Click **"Enable"**
- Wait for it to enable

## Step 3: Create API Key

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"API key"**
4. Copy the API key (save it securely!)

## Step 4: Restrict API Key (Important for Security)

1. Click on your API key to edit it
2. Under **"Application restrictions"**:
   - Select **"HTTP referrers (web sites)"**
   - Add these referrers:
     - `http://localhost:3000/*` (for development)
     - `https://yourdomain.com/*` (for production - update later)

3. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check these APIs:
     - Maps JavaScript API
     - Places API
     - Distance Matrix API
     - Geocoding API

4. Click **"Save"**

## Step 5: Add to Environment Variables

1. Open or create `.env.local` in your project root
2. Add your API key:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=AIza...your_api_key_here
```

3. **IMPORTANT**: Restart your development server after adding the key:
```bash
# Stop the server (Ctrl+C)
npm start
```

## Step 6: Verify Setup

After starting the app, open browser console (F12) and check for:
- ✅ No "Google Maps API key is invalid" errors
- ✅ No "This API project is not authorized to use this API" errors

## Billing Information

**Important Notes:**
- Google Maps APIs require billing to be enabled
- You get **$200 free credits per month**
- This is usually enough for development and small-scale production
- Set up billing alerts to avoid unexpected charges

### To Enable Billing:
1. Go to **"Billing"** in Google Cloud Console
2. Click **"Link a billing account"**
3. Follow the steps to add a payment method

### Free Tier Limits (Monthly):
- **Maps JavaScript API**: 28,000 loads
- **Places API Autocomplete**: 2,800 requests
- **Distance Matrix API**: 40,000 elements
- **Geocoding API**: 40,000 requests

For development, these limits are more than sufficient.

## Testing the Integration

Once set up, test in your app:

1. **Address Autocomplete**:
   - Go to booking page
   - Start typing an address in source/destination field
   - Should see autocomplete suggestions

2. **Distance Calculation**:
   - Select source and destination
   - Should automatically calculate distance
   - Should display fare based on distance

## Troubleshooting

### "Google Maps API error: REQUEST_DENIED"
- Check if all required APIs are enabled
- Verify API key restrictions allow your domain
- Make sure billing is enabled

### "This API project is not authorized"
- Go to API restrictions and make sure all 4 APIs are checked
- Wait a few minutes after enabling APIs (can take time to propagate)

### "InvalidKeyMapError"
- Check if API key is correctly copied to `.env.local`
- Verify environment variable name is `REACT_APP_GOOGLE_MAPS_API_KEY`
- Restart development server after adding the key

### Autocomplete not working
- Verify Places API is enabled
- Check browser console for specific error messages
- Ensure API key has Places API in restrictions

## Alternative: Use Without Google Maps (For Testing)

If you want to test without Google Maps initially:
- The app will fall back to manual distance entry
- You can use the Haversine formula for basic distance calculation
- Address autocomplete will be disabled
- This is for development only - production needs Google Maps

## Cost Optimization Tips

1. **Restrict API Key**: Always restrict by HTTP referrer and API
2. **Implement Caching**: Cache frequently used results
3. **Set Up Billing Alerts**: Get notified if costs exceed limits
4. **Use Autocomplete Session Tokens**: Reduces Places API costs
5. **Monitor Usage**: Check usage in Google Cloud Console regularly

---

**Once you have your API key, add it to `.env.local` and restart the server!**
