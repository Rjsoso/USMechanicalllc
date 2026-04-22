# Fix Localhost Sanity CORS Issue

## Problem

Localhost is showing "Loading services..." and "Contact Page Not Found" because Sanity's API is blocking requests from localhost due to CORS policy.

## Root Cause

Your Sanity project needs to explicitly allow `localhost` origins for API requests. By default, Sanity only allows requests from your production domain (usmechanical.com).

## Solution: Add Localhost to Sanity CORS Origins

### Step 1: Log into Sanity Dashboard

1. Go to https://www.sanity.io/manage
2. Log in with your account
3. Select the "US Mechanical" project (Project ID: 3vpl3hho)

### Step 2: Configure CORS Origins

1. Click on **"API"** in the left sidebar
2. Scroll down to **"CORS origins"** section
3. Click **"Add CORS origin"**
4. Add the following origins:
   - `http://localhost:3000`
   - `http://localhost:3001`
   - `http://localhost:3002`
   - `http://localhost:3003`
   - `http://localhost:3004`
   - `http://localhost:3005`
   - `http://localhost:3006`
   
   (Or you can use `http://localhost:*` wildcard if Sanity supports it)

5. Check **"Allow credentials"** if the option appears
6. Click **"Save"**

### Step 3: Restart Your Dev Server

```bash
cd react-site
npm run dev
```

### Step 4: Hard Refresh Browser

Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux) to clear cache and reload.

## Result

After adding localhost to CORS origins, all Sanity content will load properly on localhost:
- Hero section with background image
- Services with delivery methods
- Portfolio with all 6 categories
- Contact form with office locations
- About & Safety content

## Technical Details

### What We Fixed in Code:

1. **Disabled CDN for Development** (`react-site/src/utils/sanity.js`)
   - Changed `useCdn: false` for dev mode
   - This makes requests go to `api.sanity.io` instead of `apicdn.sanity.io`
   - Ensures fresh data without CDN caching delays

2. **Added Published Perspective**
   - Set `perspective: 'published'` to only fetch published documents
   - Prevents draft content from appearing in development

### Why CORS Configuration is Needed:

Sanity's security model requires explicit origin whitelisting. Your production domain is already whitelisted, but localhost needs to be added manually through the dashboard.

## Alternative: Use Sanity Studio Locally

If you can't access the Sanity dashboard to configure CORS, you can run Sanity Studio locally:

```bash
cd sanity
npm run dev
```

This will start Sanity Studio on `http://localhost:3333` where you can edit content directly, bypassing the CORS issue.
