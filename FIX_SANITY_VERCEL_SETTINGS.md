# Fix Sanity Vercel Settings Mismatch

## Current Issue

**Warning Banner:** "Configuration Settings in the current Production deployment differ from your current Project Settings."

### The Mismatch:

**Production Overrides:**
- Framework: `Vite` ✅

**Project Settings:**
- Framework Preset: `Sanity` ❌ (Should be `Vite` or `Other`)
- Build Command: `npm run build` ✅ CORRECT
- Output Directory: `dist` ✅ CORRECT
- Install Command: `npm install` ✅ CORRECT
- Development Command: `sanity start --port $PORT` ✅ CORRECT

## The Problem

Sanity Studio uses Vite internally, but the Framework Preset is set to "Sanity" which is causing a mismatch with Production Overrides that show "Vite".

## Solution

### Option 1: Change Framework Preset to Match Production (Recommended)

1. Go to: https://vercel.com/rjsosos-projects/us-mechanicalsanity/settings/build-and-deployment

2. In **Project Settings** section:
   - Find **Framework Preset** dropdown
   - Change from: `Sanity`
   - Change to: `Vite` (or `Other` if Vite isn't available)
   - This will match the Production Overrides

3. Click **Save**

4. The warning banner should disappear

### Option 2: Keep Sanity Preset but Match Production Settings

If you want to keep Framework Preset as "Sanity":
1. Make sure all other settings match Production Overrides
2. Redeploy to update Production Overrides to match Project Settings
3. This will sync them up

## Recommended Settings for Sanity Studio

| Setting | Value | Status |
|---------|-------|--------|
| **Framework Preset** | `Vite` or `Other` | ⚠️ Change from `Sanity` |
| **Build Command** | `npm run build` | ✅ Correct |
| **Output Directory** | `dist` | ✅ Correct |
| **Install Command** | `npm install` | ✅ Correct |
| **Development Command** | `sanity start --port $PORT` | ✅ Correct |

## Why This Matters

- Framework Preset affects how Vercel builds and optimizes your project
- Mismatch between Production and Project Settings can cause:
  - Build inconsistencies
  - Deployment warnings
  - Potential build failures

## After Fixing

1. Save the settings
2. Wait for the warning banner to disappear
3. Redeploy to ensure everything is synced
4. Future deployments will use consistent settings

