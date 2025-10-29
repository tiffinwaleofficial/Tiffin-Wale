# Firebase Analytics Setup - Geographic Tracking

## Overview
This implementation provides comprehensive analytics tracking including detailed geographic information (city, state, country) for the About page and Riya Tiwari page.

## Features

### Geographic Tracking
- **City-level data**: Automatically detects user's city
- **State/Region data**: Captures state or region information
- **Country data**: Tracks country with country code
- **IP-based geolocation**: Uses ipapi.co service for accurate location data
- **Additional data**: Captures timezone, latitude, longitude

### How It Works

1. **Automatic Detection**: On page load, the system automatically fetches geographic data from the user's IP address
2. **User Properties**: Geographic data is stored as user properties in Firebase
3. **Privacy Compliant**: IP address is NOT stored, only used for geolocation lookup

## Firebase Console - Where to Find Data

### Demographics Section
Navigate to: **Firebase Console → Analytics → Demographics**

You'll see:
- **Country**: E.g., "India"
- **State/Region**: E.g., "Karnataka", "Maharashtra", "Madhya Pradesh"
- **City**: E.g., "Bangalore", "Mumbai", "Indore"
- **Timezone**: E.g., "Asia/Kolkata"

### Events Section
Navigate to: **Firebase Console → Analytics → Events**

Look for:
- `geographic_data_detected`: Shows when location was detected
- `user_location_set`: Manual location setting event
- All other custom events with geographic context

### User Properties
Navigate to: **Firebase Console → Analytics → User Properties**

Available properties:
- `city` - User's city
- `state` - User's state/region
- `country` - User's country
- `country_code` - ISO country code (IN, US, etc.)
- `timezone` - User's timezone
- `latitude` - Approximate latitude
- `longitude` - Approximate longitude

## Data Collection

### Automatic Tracking
- Geographic data is fetched on first page load
- IP address is used ONLY for geolocation lookup
- Data is sent to Firebase Analytics

### API Used
- **Service**: ipapi.co
- **Type**: Free tier (1000 requests/day)
- **Data**: City, State, Country, Country Code, Timezone, Coordinates
- **Privacy**: No full IP stored

## Viewing City & State in Firebase

### Quick Steps:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `official-web-app`
3. Navigate to **Analytics** → **Demographics**
4. Click on **Geo** tab
5. You'll see breakdown by:
   - Country
   - State/Province
   - City

### Creating Custom Reports
You can create custom reports to see:
- Users by city
- Most active states
- Geographic distribution of page views
- City-level conversion rates

## API Functions

### Automatic Functions (Already Integrated)
```typescript
// Automatically called on page load
trackGeographicData()
```

### Manual Functions (If Needed)
```typescript
// Set user location manually
setUserLocation('Bangalore', 'Karnataka', 'India', 'South')

// Set user demographics with location
setUserDemographics(
  25,                    // age
  'Female',              // gender
  ['food', 'travel'],    // interests
  'Bangalore',          // city
  'Karnataka',          // state
  'India',              // country
  'South'               // region
)
```

## Troubleshooting

### If you're seeing only "India" without city/state:

1. **Check the API response** in browser console
2. **Verify ipapi.co is accessible** from your users
3. **Check Firebase Console** - data appears after 24-48 hours typically
4. **Look under Demographics → Geo tab** for detailed breakdown

### Common Issues:

**Issue**: No geographic data appearing
**Solution**: Wait 24-48 hours for Firebase to process the data

**Issue**: Only country showing, no city
**Solution**: Check API response in Network tab, verify ipapi.co is returning city data

**Issue**: City showing as "Unknown" 
**Solution**: User might be using VPN or proxy, API will still work

## Privacy & GDPR Compliance

- ✅ IP address is NOT stored
- ✅ Only approximate location is captured
- ✅ Users can continue to use site without location data
- ✅ Complies with GDPR requirements
- ✅ Data is anonymized by Firebase

## Next Steps

1. **Deploy** the updated code
2. **Wait 24-48 hours** for data to populate
3. **Check Firebase Console** under Demographics → Geo
4. **Create custom dashboards** for your geographic insights
5. **Set up alerts** for geographic insights

## Additional Resources

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [ipapi.co Documentation](https://ipapi.co/documentation/)
- [Geographic Events in Firebase](https://support.google.com/firebase/answer/9234069)


