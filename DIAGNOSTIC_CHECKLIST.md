# Sanity Data Not Showing - Diagnostic Checklist

## Issues Found & Fixes Applied

### ✅ Fix 1: CDN Caching (MOST LIKELY ISSUE)
**Problem**: In production (Vercel), Sanity uses CDN which caches responses for several minutes/hours.

**Fix Applied**: Temporarily disabled CDN (`useCdn: false`) to bypass cache and see fresh data immediately.

**Location**: `react-site/src/utils/sanity.js`

**Next Steps**: 
- Test if data now appears
- Once confirmed working, you can re-enable CDN: `useCdn: import.meta.env.PROD`

---

### ✅ Fix 2: Enhanced Debugging
**Problem**: No visibility into what data is being fetched.

**Fix Applied**: Added comprehensive console logging to see:
- Full data object
- Expandable boxes count
- First box content status
- Detailed error messages

**Location**: `react-site/src/components/ServicesSection.jsx`

**How to Use**: 
1. Open browser DevTools (F12)
2. Check Console tab
3. Look for messages starting with 🔍, ⚠️, or ❌

---

## Common Issues to Check

### Issue 3: Data Not Published in Sanity
**Problem**: You added data in Sanity Studio but didn't PUBLISH it.

**How to Fix**:
1. Go to Sanity Studio
2. Open "5. Our Services Section (CardSwap) ⭐"
3. Check top-right corner - you should see "Published" (green) not "Draft" (orange)
4. If it says "Draft", click "Publish" button

---

### Issue 4: Schema Not Deployed
**Problem**: Schema changes were pushed to git but Sanity Studio wasn't rebuilt.

**How to Fix**:
1. Check Vercel dashboard for Sanity Studio deployment
2. Verify latest commit is deployed: `35e6979 - Add expandable service boxes feature`
3. If not deployed, manually trigger rebuild in Vercel

---

### Issue 5: Wrong Dataset
**Problem**: Querying wrong dataset (production vs draft).

**Status**: ✅ Confirmed using `dataset: 'production'` - this is correct.

---

## Testing Steps

1. **Check Browser Console**:
   - Open DevTools (F12)
   - Go to Console tab
   - Refresh page
   - Look for debug messages

2. **Verify Sanity Data**:
   - Go to Sanity Studio
   - Open "5. Our Services Section (CardSwap) ⭐"
   - Verify fields exist:
     - Section Title ✅
     - First Box Content ✅
     - Expandable Service Boxes ✅ (should have 3 items)
   - Make sure document is PUBLISHED (green dot)

3. **Test Query Directly**:
   - Go to Sanity Studio
   - Click "Vision" tool (if available)
   - Run query:
     ```
     *[_type == "ourServices"][0]{
       sectionTitle,
       firstBoxContent,
       expandableBoxes[] {
         title,
         description
       },
       services[] {
         title,
         description,
         "imageUrl": image.asset->url
       }
     }
     ```
   - Verify data appears

4. **Check Vercel Deployment**:
   - Go to Vercel dashboard
   - Check React site deployment logs
   - Verify latest commit is deployed
   - Check for any build errors

---

## Expected Console Output (When Working)

```
🔍 ServicesSection - Full data received: {sectionTitle: "...", firstBoxContent: "...", expandableBoxes: [...], services: [...]}
🔍 Services count: 2
🔍 Section title: Our Services
🔍 First box content: EXISTS
🔍 Expandable boxes: 3
🔍 Expandable boxes data: [{title: "...", description: "..."}, ...]
```

---

## If Still Not Working

1. **Check Network Tab**:
   - Open DevTools → Network tab
   - Filter by "sanity"
   - Check if requests are successful
   - Check response data

2. **Verify Sanity Project ID**:
   - Should be: `3vpl3hho`
   - Check in `react-site/src/utils/sanity.js`

3. **Check API Version**:
   - Should be: `2023-05-03`
   - Check in `react-site/src/utils/sanity.js`

4. **Test with Fresh Query**:
   - Add cache-busting parameter
   - Or use `client.fetch()` with `{cache: 'no-store'}` option

---

## Quick Fixes Applied

✅ Disabled CDN cache temporarily
✅ Added comprehensive debugging
✅ Enhanced error logging
✅ Pushed changes to Vercel

**Next**: Check browser console and verify data appears!

