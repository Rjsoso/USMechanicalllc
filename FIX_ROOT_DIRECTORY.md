# Fix Vercel Root Directory - EXACT STEPS

## The Problem
Vercel is looking for: `/Applications/US Mechanical Website/react-site/react-site` ❌
But it should look for: `/Applications/US Mechanical Website/react-site` ✅

## The Solution
The Root Directory in Vercel Dashboard is set incorrectly.

## EXACT Steps to Fix:

### 1. Open Vercel Dashboard
Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings**

### 2. Find "Build and Deployment Settings"
- Click "Settings" in left sidebar
- Scroll to "Build and Deployment Settings" section

### 3. Locate "Root Directory" Field
Look for a field labeled **"Root Directory"** or **"Root Directory Override"**

### 4. Check Current Value
The field might show:
- `react-site/react-site` ❌ (WRONG - this causes the error)
- `react-site/` ❌ (WRONG - trailing slash)
- Something else that's not exactly `react-site`

### 5. Fix It
1. **Click** on the Root Directory field
2. **Delete everything** in the field (clear it completely)
3. **Type exactly:** `react-site`
   - No quotes
   - No trailing slash (`/`)
   - No duplicates (`react-site/react-site`)
   - Just: `react-site`

### 6. Verify
After typing, the field should show exactly:
```
react-site
```

NOT:
- ❌ `react-site/`
- ❌ `react-site/react-site`
- ❌ `/react-site`
- ❌ `./react-site`

### 7. Check for Overrides
Scroll down and look for:
- **"Production Overrides"** section
- **"Environment Overrides"** section
- **"Preview Overrides"** section

If any of these have Root Directory set, make sure they also say `react-site` (not `react-site/react-site`)

### 8. Save
- Click the **"Save"** button at the bottom of the page
- Wait for confirmation message

### 9. Deploy
After saving:
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
3. OR push a new commit to trigger automatic deployment

## What Should Happen After Fix

When Root Directory is set to `react-site`, Vercel will:
1. ✅ Look in `/Applications/US Mechanical Website/react-site/` for `package.json`
2. ✅ Run `npm install` in that directory
3. ✅ Run `npm run build` in that directory  
4. ✅ Find output in `react-site/dist/`
5. ✅ Deploy successfully

## If Still Not Working

Take a screenshot of:
1. The Root Directory field showing `react-site`
2. The error message you're seeing
3. The "Build and Deployment Settings" section

Then the issue might be:
- Cached deployment settings
- Multiple projects with similar names
- Need to create a fresh deployment from Dashboard


