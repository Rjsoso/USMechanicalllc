# Vercel Settings Comparison - What Needs to Change

## Project 1: us-mechanicalllc (React Website) ✅

### Current Settings (from screenshot):
- **Framework Preset**: `Vite` ✅ CORRECT
- **Root Directory**: `react-site` ✅ CORRECT
- **Build Command**: `npm run build` ✅ CORRECT
- **Output Directory**: `dist` ✅ CORRECT
- **Install Command**: `npm install` ✅ CORRECT

### Status: ✅ ALL SETTINGS ARE CORRECT!

**Action Required:** 
- Make sure to click **"Save"** button if you haven't already
- Then try deploying again

---

## Project 2: us-mechanicalsanity (Sanity Studio) ⚠️

### Current Settings (from screenshot):

**Production Overrides:**
- Framework: `Vite` ✅
- Build Command: `npm run build` ✅

**Project Settings:**
- **Framework Preset**: `Sanity` ✅ CORRECT
- **Build Command**: `npm install && npm run build` ❌ WRONG
- **Output Directory**: `dist` ✅ CORRECT
- **Install Command**: `npm install` ✅ CORRECT
- **Development Command**: `sanity start --port $PORT` ✅ CORRECT

### ⚠️ Issue Found:

**Build Command** in Project Settings should be: `npm run build` (not `npm install && npm run build`)

Since you have a separate **Install Command** field set to `npm install`, the Build Command should only run the build, not install.

### What to Change:

1. Go to: https://vercel.com/rjsosos-projects/us-mechanicalsanity/settings/build-and-deployment

2. In **Project Settings** section:
   - Find **Build Command** field
   - Change from: `npm install && npm run build`
   - Change to: `npm run build`
   - Keep the "Override" toggle ON

3. Click **Save** button

4. This will match the Production Overrides and remove the warning banner

---

## Summary

### us-mechanicalllc (React Website):
- ✅ All settings correct
- ✅ Root Directory is `react-site` (correct!)
- Action: Click Save if not saved, then redeploy

### us-mechanicalsanity (Sanity Studio):
- ⚠️ Build Command needs fixing
- Change: `npm install && npm run build` → `npm run build`
- Action: Update Build Command, Save, then redeploy

