# Firebase Analytics - Quick Reference Guide

## 🎯 What You're Tracking Now

### For About Page & Riya Tiwari Page:

✅ **User Demographics**
- City (e.g., Bangalore, Mumbai, Indore)
- State (e.g., Karnataka, Maharashtra, Madhya Pradesh)
- Country (India)
- Age & Gender (if set)

✅ **Page Engagement**
- Time on page (with milestones: 30s, 1min, 2min, 3min+)
- Scroll depth (25%, 50%, 75%, 90%+)
- Page views & exits

✅ **User Interactions**
- Button clicks (All CTAs tracked)
- Link clicks (Navigation, breadcrumbs)
- Social media clicks (LinkedIn, Twitter)
- Section impressions (When user views each section)

✅ **Geographic Data**
- City-level tracking
- State-level tracking
- Country tracking
- Timezone information
- Approximate coordinates

✅ **Conversion Events**
- CTA clicks (For Corporates, Partner With Us)
- Download intent
- Navigation to other pages

---

## 📍 Where to See Your Data in Firebase Console

### Step 1: Access Firebase Console
1. Go to: https://console.firebase.google.com/project/official-web-app
2. Click on **Analytics** in the left sidebar

### Step 2: View Demographics with City/State

**Navigation**: Analytics → Demographics → Geo

You'll see:
```
Country: India (100%)
  ├─ Karnataka (30%)
  │   ├─ Bangalore (80%)
  │   ├─ Mysore (15%)
  │   └─ Hubli (5%)
  ├─ Maharashtra (25%)
  │   ├─ Mumbai (70%)
  │   └─ Pune (30%)
  └─ Madhya Pradesh (20%)
      ├─ Indore (60%)
      └─ Bhopal (40%)
```

### Step 3: View Custom Events

**Navigation**: Analytics → Events

Key events to look for:

| Event Name | What It Tracks |
|------------|---------------|
| `page_view` | Every page visit |
| `scroll_25_percent` | User scrolled 25% |
| `scroll_50_percent` | User scrolled 50% |
| `scroll_75_percent` | User scrolled 75% |
| `scroll_90_percent` | User scrolled 90%+ |
| `time_30_seconds` | User spent 30+ seconds |
| `time_1_minute` | User spent 1+ minute |
| `time_3_plus_minutes` | User spent 3+ minutes |
| `button_click` | Any button click |
| `cta_click` | Call-to-action clicks |
| `link_click` | Navigation link clicks |
| `section_impression` | Section was viewed |
| `user_engagement` | User interactions |
| `geographic_data_detected` | Location captured |
| `social_media_click` | Social link clicks |

### Step 4: View User Properties

**Navigation**: Analytics → User Properties

You'll see properties like:
- `city`: Bangalore
- `state`: Karnataka
- `country`: India
- `country_code`: IN
- `timezone`: Asia/Kolkata
- `latitude`: 12.9716
- `longitude`: 77.5946

---

## 🎨 Creating Custom Dashboards

### View Users by City
1. Analytics → Insights
2. Create New Insight
3. Select "Users" as metric
4. Group by: User Property → city
5. Filter: country = "India"

### Track Conversion by State
1. Analytics → Conversion Events
2. Set "cta_click" as conversion event
3. View by: Group by state
4. See which states have highest conversions

### Geographic Distribution Chart
1. Analytics → Demographics → Geo
2. Toggle to "Map View"
3. See visual distribution of users across India
4. Click on any state to drill down to cities

---

## 📊 Sample Queries You Can Run

### "Show me users from Bangalore who clicked the CTA"
1. Analytics → Events
2. Filter: Event = "cta_click"
3. User Segment: city contains "Bangalore"
4. Analyze results

### "What states are most engaged?"
1. Analytics → Engagement → Time in App
2. Group by: User Property → state
3. Sort by average time
4. See top engaging states

### "Track Riya Tiwari page visitors by city"
1. Analytics → Events → page_view
2. Filter: page_path = "/riya-tiwari"
3. Group by: User Property → city
4. See city-wise breakdown

---

## 🔥 Pro Tips

### 1. Real-time Monitoring
**Navigation**: Analytics → StreamView (Beta)

See live users:
- Current active users
- Their city/state
- What they're clicking
- Pages they're visiting

### 2. Export Data
**Navigation**: Analytics → Reports

Click "Export" to get:
- CSV files with geographic data
- Excel reports by city/state
- Custom date ranges

### 3. Set Up Alerts
1. Go to Analytics Settings
2. Create alerts for:
   - When users from specific cities spike
   - When conversions exceed threshold
   - When engagement rates change

### 4. Compare Demographics
**Navigation**: Analytics → Demographics → Geo

Compare:
- Current period vs previous
- Different states performance
- City-level engagement rates

---

## 🚨 Troubleshooting

### "I only see India, not cities"

**Why**: Data takes 24-48 hours to appear
**Solution**: Wait for data to process

### "Cities showing as 'Unknown'"

**Why**: User might be on VPN or API couldn't resolve
**Solution**: Check Network tab for ipapi.co response

### "No geographic data at all"

**Possible causes**:
1. API rate limit (1000 requests/day free)
2. Network blocking ipapi.co
3. Data not processed yet

**Solution**: Check browser console for errors

---

## 📈 Expected Data After Deployment

### Immediate (First Visit)
- ✅ Page views
- ✅ Button clicks
- ✅ Geographic detection trigger

### After 24 Hours
- ✅ City data
- ✅ State data
- ✅ Basic demographics

### After 48 Hours
- ✅ Full geographic breakdown
- ✅ Historical comparisons
- ✅ Trends analysis

---

## 🎯 Next Steps

1. ✅ **Deploy** your code
2. ✅ **Wait 24-48 hours**
3. ✅ **Check Firebase Console** → Analytics → Demographics → Geo
4. ✅ **Create custom reports** for city/state insights
5. ✅ **Set up alerts** for geographic trends
6. ✅ **Export data** for deeper analysis

---

## 📞 Need Help?

- Check browser console for any API errors
- Verify ipapi.co is accessible: https://ipapi.co/json/
- Firebase Documentation: https://firebase.google.com/docs/analytics
- Contact me for any issues!

---

**Your analytics are now tracking city AND state data, not just country! 🎉**


