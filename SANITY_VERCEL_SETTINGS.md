# ✅ Correct Vercel Settings for Sanity Studio

## Current Issues Found:
1. ❌ **Output Directory**: Shows `react-site/dist` (WRONG - this is the React site's output)
2. ⚠️ **Build Command**: Has redundant `--output dist` flag
3. ✅ **Framework Preset**: "Sanity" is correct (Vercel auto-detects it)

---

## ✅ Correct Settings for Sanity Project:

### **Project Settings:**

**Framework Preset:** 
- ✅ **Sanity** (keep as-is, Vercel auto-detects this correctly)

**Build Command:**
- ✅ **`npm install && npm run build`** OR
- ✅ **`sanity build`** (without `--output dist` flag)
- The `vercel.json` already has: `npm install && npm run build`
- This runs `sanity build` which outputs to `dist` by default

**Output Directory:**
- ✅ **`dist`** (NOT `react-site/dist`!)
- This is relative to the Sanity project root (`/sanity` folder)
- Sanity Studio builds to `dist` by default

**Install Command:**
- ✅ **Default** (leave as-is: `npm install`, `yarn install`, etc.)

**Development Command:**
- ✅ **`sanity dev`** OR **`sanity start --port $PORT`**
- This is for local development, not critical for production

---

## 🔧 How to Fix in Vercel Dashboard:

1. Go to: **https://vercel.com/rjsosos-projects/us-mechanicalsanity/settings/build-and-deployment**

2. **In "Project Settings" section:**

   **Output Directory:**
   - Click the "Override" toggle to **ON** (if not already)
   - Change from: `react-site/dist` ❌
   - Change to: `dist` ✅
   - Click **Save**

   **Build Command:**
   - Click the "Override" toggle to **ON** (if not already)
   - Change from: `sanity build --output dist`
   - Change to: `npm install && npm run build` ✅
   - OR keep: `sanity build` (remove the `--output dist` part)
   - Click **Save**

3. **Framework Preset:**
   - Keep as **"Sanity"** ✅
   - Vercel correctly detects Sanity Studio

---

## 📝 Why This Matters:

- **Wrong Output Directory** (`react-site/dist`) means Vercel is looking in the wrong place for built files
- This could cause deployment failures or serve the wrong files
- The correct `dist` folder is inside `/sanity/dist` (relative to repo root)

---

## ✅ After Fixing:

Your `vercel.json` already has the correct settings:
```json
{
  "version": 2,
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

But Vercel Dashboard overrides might be conflicting. Make sure the Dashboard settings match!

