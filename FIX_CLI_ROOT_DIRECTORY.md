# Fix CLI Root Directory Issue

## The Problem

When running `npx vercel` from inside `react-site/` or `sanity/` folders, Vercel CLI is looking for:
- `react-site/react-site` ❌ (should be just `react-site`)
- `sanity/sanity` ❌ (should be just `sanity`)

## Root Cause

The Root Directory setting in Vercel Dashboard is relative to the **repository root**, not the current working directory. When you run CLI from inside a subdirectory, Vercel tries to apply the Root Directory setting again, causing the double path.

## Solutions

### Solution 1: Run CLI from Repository Root (Recommended)

Instead of running from inside `react-site/` or `sanity/`, run from the repository root:

```bash
# From repository root
cd "/Applications/US Mechanical Website"

# Deploy React site
npx vercel --prod --yes --cwd react-site

# Deploy Sanity
npx vercel --prod --yes --cwd sanity
```

### Solution 2: Temporarily Remove Root Directory in Dashboard

1. Go to Dashboard settings
2. **Temporarily** clear Root Directory (set to empty)
3. Run CLI from inside `react-site/` or `sanity/`
4. **Restore** Root Directory setting after deployment

⚠️ **Note:** This will break Dashboard deployments, so only do this temporarily.

### Solution 3: Use Dashboard Deployment (Best for Now)

Since Dashboard settings are correct, use Dashboard deployment:
- Dashboard respects Root Directory correctly
- No CLI path issues
- More reliable for monorepo setups

## Why This Happens

```
Repository Structure:
/US Mechanical Website/
  ├── react-site/          ← You run CLI here
  └── sanity/

Dashboard Setting:
Root Directory: react-site  ← Relative to repo root

CLI Behavior:
Current dir: /.../react-site/
+ Root Directory: react-site
= Looking for: /.../react-site/react-site ❌
```

## Recommended Approach

**For now:** Use Dashboard deployment until Vercel fixes CLI Root Directory handling for monorepos.

**For CLI:** Run from repository root with `--cwd` flag:
```bash
npx vercel --prod --yes --cwd react-site
npx vercel --prod --yes --cwd sanity
```

