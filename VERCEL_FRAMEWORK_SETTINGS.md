# Vercel Framework Settings for US Mechanical Website

## ✅ Correct Settings (Verified)

Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings

### Build and Deployment Settings:

| Setting | Value | Status |
|---------|-------|--------|
| **Framework Preset** | `Vite` | ✅ Correct |
| **Root Directory** | `react-site` | ⚠️ Must be set in Dashboard |
| **Build Command** | `npm run build` | ✅ Correct |
| **Output Directory** | `dist` | ✅ Correct |
| **Install Command** | `npm install` | ✅ Correct |
| **Development Command** | `vite --port $PORT` (auto-detected) | ✅ Optional |

## Verification

### ✅ Project Type Confirmed:
- Uses **Vite** (confirmed by `vite.config.js`)
- Uses **React** (confirmed by `@vitejs/plugin-react`)
- Build script: `vite build` (runs via `npm run build`)
- Output: `dist/` folder (confirmed by build output)

### ✅ Current Configuration Files:

**`react-site/vercel.json`:**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**`react-site/package.json`:**
- Build script: `"build": "vite build"`
- Framework: Vite 5.0.8
- React: 18.2.0

## ⚠️ Critical Setting

**Root Directory MUST be set to `react-site` in Vercel Dashboard**

This cannot be set via `vercel.json` alone. The error you're seeing (`/Applications/US Mechanical Website/react-site/react-site`) indicates this setting is incorrect or missing.

## Steps to Fix

1. Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings
2. Scroll to "Build and Deployment Settings"
3. Set **Root Directory** to: `react-site`
4. Verify other settings match the table above
5. Click **Save**
6. Go to "Deployments" and click **Redeploy**

## Expected Behavior After Fix

- Vercel will look in `react-site/` folder for `package.json`
- Run `npm install` in `react-site/`
- Run `npm run build` (which runs `vite build`)
- Output will be in `react-site/dist/`
- Deployment will succeed ✅


