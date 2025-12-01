# Vercel Build Settings for Sanity Studio

## Required Vercel Dashboard Settings

Go to: https://vercel.com/rjsosos-projects/sanity/settings

### General Settings:
- **Framework Preset**: `Other` (or leave blank/unset)
- **Root Directory**: `.` (root level, or leave blank if deploying from sanity folder)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Current vercel.json Configuration

The `sanity/vercel.json` file is configured as:

```json
{
  "version": 2,
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Sanity Build Process

Sanity Studio uses:
- **Build Command**: `sanity build` (runs via `npm run build`)
- **Output Directory**: `dist` (created by `sanity build`)
- **Framework**: Uses Vite internally, but Framework Preset should be "Other" or unset

## Recommended Settings

### Option 1: Separate Install and Build (Recommended)
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Option 2: Combined (Current)
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dist`

Both options work, but Option 1 is cleaner and allows Vercel to cache dependencies better.

## Important Notes

1. **Root Directory**: Should be `.` (root) if deploying from the `sanity/` folder, or set to `sanity` if deploying from monorepo root
2. **Output Directory**: Always `dist` for Sanity Studio
3. **Framework**: Sanity uses Vite internally, but Vercel should detect it automatically or you can set to "Other"
4. **Base Path**: The studio is configured with `basePath: '/studio'` in `sanity.config.ts`, so it will be accessible at `your-domain.com/studio`

## Verification

After deployment, Sanity Studio should be accessible at:
- Production URL: `https://your-sanity-project.vercel.app/studio`
- The `/studio` path comes from the `basePath` setting in `sanity.config.ts`
