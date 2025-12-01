# Vercel Settings for React Site

## Required Vercel Dashboard Settings

Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings

### General Settings:
- **Framework Preset**: `Vite`
- **Root Directory**: `react-site`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Current vercel.json Configuration

The `react-site/vercel.json` file is now configured correctly:

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

## Important Notes

1. **Root Directory MUST be set in Vercel Dashboard** - This cannot be set via vercel.json alone
2. The vercel.json file in `react-site/` will be used when Root Directory is set to `react-site`
3. Vercel will automatically run `npm install` before `npm run build` when `installCommand` is specified

## After Updating Settings

1. Save the settings in Vercel Dashboard
2. Trigger a new deployment (or push a commit)
3. The build should now work correctly

