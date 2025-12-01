# CLI Root Directory Issue - Final Solution

## The Problem

Vercel CLI fetches `rootDirectory: "react-site"` from Dashboard settings. When running CLI from inside `/Applications/US Mechanical Website/react-site/`, it tries to go into `react-site` again, resulting in `react-site/react-site`.

## Root Cause

Vercel CLI always fetches settings from the API/Dashboard, ignoring local `.vercel/project.json` overrides. The `rootDirectory` setting is relative to the **repository root**, but CLI doesn't account for running from inside the subdirectory.

## The Solution

**Use Dashboard Deployment** - This is the recommended approach because:
- ✅ Dashboard correctly handles Root Directory
- ✅ No CLI path resolution issues  
- ✅ More reliable for monorepo setups
- ✅ Settings are applied correctly

## Workaround for CLI (If Needed)

If you must use CLI, you have two options:

### Option 1: Deploy from Repository Root
```bash
cd "/Applications/US Mechanical Website"
npx vercel --prod --yes ./react-site
npx vercel --prod --yes ./sanity
```

### Option 2: Temporarily Change Dashboard Root Directory
1. Go to Dashboard settings
2. **Temporarily** set Root Directory to `.` (empty/root)
3. Run CLI from inside `react-site/` or `sanity/`
4. **Restore** Root Directory to `react-site` after deployment

⚠️ **Warning:** Option 2 will break Dashboard deployments until you restore the setting.

## Recommended Workflow

**For Production Deployments:**
- Use **Dashboard** → "Deploy" → "Create Deployment"
- Or push to GitHub and let automatic deployment handle it

**For Testing:**
- Use `npm run dev` locally
- Or use Dashboard preview deployments

## Why This Happens

```
Dashboard Setting (correct for Dashboard):
Root Directory: react-site  ← Relative to repo root

CLI Behavior (bug):
Current dir: /.../react-site/
+ Fetches rootDirectory: "react-site" from API
= Tries: /.../react-site/react-site ❌

Should be:
Current dir: /.../react-site/
+ rootDirectory should be "." when running from subdirectory
= Uses: /.../react-site/ ✅
```

## Status

This appears to be a limitation/bug in Vercel CLI when dealing with monorepos. The Dashboard handles it correctly, but CLI doesn't account for running from inside the Root Directory folder.

**Recommendation:** Use Dashboard deployment for now, or wait for Vercel to fix CLI Root Directory handling for monorepos.

