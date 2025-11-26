# 🔍 Find or Deploy Sanity Studio

## Option 1: Find Your Existing Sanity Studio URL

### Check Vercel Dashboard
1. Go to: **https://vercel.com/dashboard**
2. Look for a project named:
   - `us-mechanicalsanity` OR
   - `sanity` OR
   - `us-mechanical-sanity`
3. Click on the project
4. Check the **"Domains"** section for the URL
5. The URL will look like: `https://[project-name].vercel.app`

### Alternative: Check Sanity Dashboard
1. Go to: **https://www.sanity.io/manage/personal/project/3vpl3hho**
2. Look for **"Studio Hosting"** or **"Deployments"** section
3. Should show your deployed Studio URL

---

## Option 2: Deploy Sanity Studio to Vercel

If it's not deployed yet, let's deploy it:

### Step 1: Check Vercel Projects
1. Go to: **https://vercel.com/dashboard**
2. Check if you have a project for Sanity Studio
3. If not, we'll create one

### Step 2: Deploy via Vercel Dashboard
1. Go to: **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select: **`rjsoso/USMechanicalllc`**
4. Configure:
   - **Project Name**: `us-mechanical-sanity` (or `sanity`)
   - **Root Directory**: `sanity` ⚠️ **IMPORTANT!**
   - **Framework Preset**: Sanity (or Vite)
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**

### Step 3: Verify Deployment
1. Wait for deployment to complete
2. Copy the deployment URL
3. Visit it to verify Sanity Studio loads

---

## Option 3: Use Sanity's Built-in Hosting (Easier!)

Sanity has built-in hosting that's easier to set up:

### Deploy via Sanity CLI
```bash
cd "/Applications/US Mechanical Website/sanity"
npm install
npx sanity deploy
```

This will:
- Deploy to Sanity's hosting
- Give you a URL like: `https://[your-project].sanity.studio`
- No Vercel configuration needed!

---

## ✅ Recommended: Use Sanity's Built-in Hosting

**Why?**
- ✅ Easier setup (one command)
- ✅ No Vercel configuration needed
- ✅ Free hosting from Sanity
- ✅ Automatic updates
- ✅ URL format: `https://[project-id].sanity.studio`

**Your URL would be**: `https://3vpl3hho.sanity.studio`

---

## 🔧 Quick Test

Try visiting: **https://3vpl3hho.sanity.studio**

If that works, you're all set! If not, we'll deploy it.

