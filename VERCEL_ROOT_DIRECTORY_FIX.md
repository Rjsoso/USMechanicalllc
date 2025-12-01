# Fix Vercel Root Directory Issue

## Current Error
```
Error: The provided path "/Applications/US Mechanical Website/react-site/react-site" does not exist.
```

This error means Vercel's Root Directory setting is **incorrect** in the Dashboard.

## Step-by-Step Fix

### 1. Go to Vercel Dashboard Settings
**URL:** https://vercel.com/rjsosos-projects/us-mechanicalllc/settings

### 2. Navigate to "Build and Deployment Settings"
- Click on "Settings" in the left sidebar
- Scroll down to "Build and Deployment Settings" section

### 3. Check Root Directory Setting
Look for the **"Root Directory"** field. It might be showing:
- ❌ `react-site/react-site` (WRONG - causes the error)
- ❌ `react-site/` (WRONG - trailing slash)
- ❌ Empty but Vercel is auto-detecting wrong path
- ✅ `react-site` (CORRECT - no trailing slash, no duplicates)

### 4. Fix the Root Directory
1. **Clear the Root Directory field completely** (delete everything)
2. **Type exactly:** `react-site` (no quotes, no trailing slash)
3. **Verify** it shows: `react-site` (not `react-site/` or `react-site/react-site`)

### 5. Check for Overrides
Look for any **"Production Overrides"** or **"Environment Overrides"** sections that might have a different Root Directory set. If found:
- Either remove the override, OR
- Set it to `react-site` as well

### 6. Save Settings
- Click **"Save"** button at the bottom
- Wait for confirmation

### 7. Verify Other Settings
While you're there, verify these settings match:

| Setting | Should Be |
|---------|-----------|
| Framework Preset | `Vite` |
| Root Directory | `react-site` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### 8. Trigger New Deployment
After saving:
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click **"Redeploy"** (three dots menu)
4. OR push a new commit to trigger automatic deployment

## Alternative: Deploy from Dashboard

If CLI still doesn't work after fixing Root Directory:

1. Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc
2. Click **"Deploy"** button (top right)
3. Select **"Create Deployment"**
4. Choose your GitHub repository
5. Select branch: `main`
6. Vercel should now use the correct Root Directory from settings

## Verification

After fixing, the deployment should:
- ✅ Find `package.json` in `react-site/` folder
- ✅ Run `npm install` successfully
- ✅ Run `npm run build` successfully
- ✅ Output to `react-site/dist/`
- ✅ Deploy without errors

## Still Not Working?

If it still fails after following these steps:

1. **Double-check** the Root Directory shows exactly `react-site` (screenshot it)
2. **Check** if there are multiple projects with similar names
3. **Try** creating a fresh deployment from the Dashboard
4. **Contact** Vercel support with the exact error message

