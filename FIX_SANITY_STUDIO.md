# 🔧 Fix Sanity Studio Not Loading

## ✅ Good News: Build Works Locally!

The Sanity Studio builds successfully locally, so the code is fine. The issue is with the **Vercel deployment**.

---

## 🔍 Step 1: Check Vercel Deployment Status

1. Go to: **https://vercel.com/dashboard**
2. Look for a project named:
   - `sanity-henna` OR
   - `us-mechanicalsanity` OR
   - `sanity` OR
   - Any project with "sanity" in the name
3. Click on the project
4. Go to **"Deployments"** tab
5. Check the **latest deployment**:
   - ✅ **"Ready"** = Deployment succeeded (but site might still not work)
   - ❌ **"Error"** = Build failed (check logs)
   - ⏳ **"Building"** = Still deploying

---

## 🔧 Step 2: Check Build Logs

If deployment shows "Error":

1. Click on the failed deployment
2. Check **"Build Logs"**
3. Look for errors like:
   - "Cannot find module..."
   - "Build failed..."
   - "Output directory not found..."

---

## ✅ Step 3: Fix Vercel Settings

### Check Root Directory

1. Go to: **https://vercel.com/[your-sanity-project]/settings/git**
2. Verify **"Root Directory"** is set to: **`sanity`**
   - If empty or wrong, change it to `sanity`
   - Click **"Save"**

### Check Build Settings

1. Go to: **https://vercel.com/[your-sanity-project]/settings/build-and-deployment**
2. Verify:
   - **Framework Preset**: `Sanity` or `Vite`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

---

## 🚀 Step 4: Redeploy

### Option A: Redeploy from Vercel Dashboard

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait for it to complete
4. Try the URL again

### Option B: Trigger New Deployment via Git

```bash
cd "/Applications/US Mechanical Website"
git add sanity/
git commit -m "Fix Sanity Studio deployment"
git push
```

This will trigger a new Vercel deployment automatically.

---

## 🆕 Step 5: Create New Vercel Project (If None Exists)

If you don't see a Sanity project in Vercel:

1. Go to: **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select: **`rjsoso/USMechanicalllc`**
4. Configure:
   - **Project Name**: `us-mechanical-sanity`
   - **Root Directory**: **`sanity`** ⚠️ **CRITICAL!**
   - **Framework Preset**: `Sanity` (or `Vite`)
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**
6. Wait for deployment
7. Copy the URL

---

## 🎯 Alternative: Use Sanity's Built-in Hosting (Easier!)

Instead of Vercel, use Sanity's hosting (more reliable):

```bash
cd "/Applications/US Mechanical Website/sanity"
npx sanity deploy
```

When prompted:
- Select: **"Create new studio hostname"**
- Your URL will be: **`https://3vpl3hho.sanity.studio`**

**Benefits:**
- ✅ No Vercel configuration needed
- ✅ More reliable
- ✅ Automatic updates
- ✅ Free hosting

---

## 📝 Quick Checklist

- [ ] Check Vercel dashboard for Sanity project
- [ ] Verify Root Directory = `sanity`
- [ ] Check build logs for errors
- [ ] Redeploy if needed
- [ ] OR deploy to Sanity hosting (easier!)

---

## 🔍 What to Tell Me

1. **Do you see a Sanity project in Vercel dashboard?**
   - If yes: What's the project name?
   - If no: We'll create one

2. **What does the latest deployment show?**
   - Ready, Error, or Building?

3. **Any errors in build logs?**
   - Copy/paste any error messages

This will help me give you the exact fix!

