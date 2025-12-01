# Vercel Project Linking - Fixed

## Problem
Vercel CLI was creating NEW projects (`react-site`) instead of deploying to existing projects (`us-mechanicalllc`, `us-mechanicalsanity`).

## Solution Applied

### React Site (us-mechanicalllc)
✅ **Linked to correct project:**
- Project: `us-mechanicalllc`
- Project ID: `prj_ObMgg3GNFQ8CPVzHbpogb4Y2xCfd`
- Location: `/Applications/US Mechanical Website/react-site/.vercel/`

### Sanity Studio (us-mechanicalsanity)
✅ **Linked to correct project:**
- Project: `us-mechanicalsanity` (updated from `sanity`)
- Location: `/Applications/US Mechanical Website/sanity/.vercel/`

## Current Status

### React Site Deployment
- ✅ Correctly linked to `us-mechanicalllc`
- ⚠️ Still has Root Directory error (`react-site/react-site`)
- **Action Required:** Root Directory must be set to `react-site` in Dashboard AND saved

### Sanity Studio Deployment
- ✅ Correctly linked to `us-mechanicalsanity`
- ✅ Deployments working correctly

## To Deploy Correctly

### Option 1: Fix Root Directory in Dashboard (Recommended)
1. Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/build-and-deployment
2. Verify Root Directory is set to: `react-site`
3. Click **Save** (even if it already shows `react-site`)
4. Wait a few seconds for settings to propagate
5. Then deploy via CLI or Dashboard

### Option 2: Deploy from Dashboard
1. Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc
2. Click **"Deploy"** → **"Create Deployment"**
3. Select GitHub repository
4. Select branch: `main`
5. Dashboard will use correct Root Directory from settings

## Verification

Check project linking:
```bash
# React site
cd react-site
cat .vercel/project.json
# Should show: "projectName": "us-mechanicalllc"

# Sanity
cd sanity
cat .vercel/project.json
# Should show: "projectName": "us-mechanicalsanity"
```

