# Deploy from Vercel Dashboard (Recommended)

## Current Issue

Both CLI deployments are failing with Root Directory errors:
- React site: Looking for `react-site/react-site` ❌
- Sanity: Looking for `sanity/sanity` ❌

This suggests the Root Directory settings in Dashboard might not be properly saved or there's a caching issue.

## Solution: Deploy from Dashboard

Since your Dashboard settings are correct, deploy directly from there:

### React Website (us-mechanicalllc)

1. Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc
2. Click **"Deploy"** button (top right)
3. Select **"Create Deployment"**
4. Choose:
   - **GitHub Repository**: Your repo
   - **Branch**: `main`
   - **Root Directory**: Should auto-detect or use `react-site` from settings
5. Click **"Deploy"**
6. Dashboard will use the correct Root Directory from your saved settings

### Sanity Studio (us-mechanicalsanity)

1. Go to: https://vercel.com/rjsosos-projects/us-mechanicalsanity
2. Click **"Deploy"** button (top right)
3. Select **"Create Deployment"**
4. Choose:
   - **GitHub Repository**: Your repo
   - **Branch**: `main`
   - **Root Directory**: Should be `.` (root) or `sanity` depending on your setup
5. Click **"Deploy"**
6. Dashboard will use the correct settings

## Why Dashboard Deployment Works Better

- ✅ Uses saved Dashboard settings directly
- ✅ No CLI path resolution issues
- ✅ Respects Root Directory settings correctly
- ✅ More reliable for monorepo setups

## After Dashboard Deployment

Once deployed successfully from Dashboard:
- Future automatic deployments (from Git pushes) will use the same settings
- CLI deployments might start working after Dashboard sets the correct paths
- You can verify the deployment used correct settings in the build logs

## Alternative: Fix Root Directory in Dashboard Again

If Dashboard deployment also fails:

1. **React Site:**
   - Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/build-and-deployment
   - Clear Root Directory field completely
   - Type: `react-site` (no quotes, no slash)
   - Click **Save**
   - Wait 10 seconds
   - Try Dashboard deployment again

2. **Sanity:**
   - Go to: https://vercel.com/rjsosos-projects/us-mechanicalsanity/settings/build-and-deployment
   - Clear Root Directory field completely
   - Leave empty (if deploying from `sanity/` folder) OR type: `sanity`
   - Click **Save**
   - Wait 10 seconds
   - Try Dashboard deployment again

