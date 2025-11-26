# 🔧 Fix "Failed to fetch iframe URL" Error

## The Problem

You're seeing "Unable to load studio" with "Failed to fetch iframe URL" error. This happens when:
1. The studio configuration changed but wasn't redeployed
2. There's a mismatch between Sanity-hosted and Vercel-hosted studios
3. The studio needs to be redeployed after configuration changes

---

## ✅ Solution 1: Redeploy to Sanity Hosting (Recommended)

Since you're accessing `sanity.io/@...`, you need to deploy to Sanity's hosting:

### Step 1: Deploy to Sanity

```bash
cd "/Applications/US Mechanical Website/sanity"
npx sanity deploy
```

When prompted:
- Select: **"Create new studio hostname"**
- It will give you: `https://3vpl3hho.sanity.studio`

### Step 2: Access the New URL

1. Use the new URL: `https://3vpl3hho.sanity.studio`
2. The error should be gone!

---

## ✅ Solution 2: Use Vercel-Deployed Studio

If you prefer to use the Vercel-deployed version:

### Step 1: Access Vercel Studio

Go to: **https://sanity-henna.vercel.app/structure**

### Step 2: If It Doesn't Work, Redeploy

1. Go to: **https://vercel.com/dashboard**
2. Find project: `sanity-henna` or `us-mechanicalsanity`
3. Go to **"Deployments"**
4. Click **"Redeploy"** on latest deployment
5. Wait for it to complete
6. Try the URL again

---

## ✅ Solution 3: Fix Configuration Issue

I've already updated your `sanity.config.ts` to add `basePath: '/studio'`. Now you need to:

### Option A: Deploy to Sanity (Easiest)
```bash
cd "/Applications/US Mechanical Website/sanity"
npx sanity deploy
# Select "Create new studio hostname"
```

### Option B: Redeploy to Vercel
1. Commit the config change:
   ```bash
   cd "/Applications/US Mechanical Website"
   git add sanity/sanity.config.ts
   git commit -m "Fix Sanity Studio iframe error"
   git push
   ```
2. Vercel will auto-deploy
3. Wait for deployment to complete
4. Access: `https://sanity-henna.vercel.app/structure`

---

## 🔍 Why This Happened

The error occurred because:
- The studio configuration was updated but not redeployed
- Sanity Studio needs to be rebuilt and redeployed after config changes
- The iframe URL needs to match the current deployment

---

## ✅ Quick Fix Steps

1. **Deploy to Sanity hosting** (recommended):
   ```bash
   cd "/Applications/US Mechanical Website/sanity"
   npx sanity deploy
   ```
   - Select "Create new studio hostname"
   - Use the new URL: `https://3vpl3hho.sanity.studio`

2. **OR use Vercel-deployed version**:
   - Go to: `https://sanity-henna.vercel.app/structure`
   - If it doesn't work, redeploy in Vercel dashboard

---

## 📝 After Fixing

Once the studio loads:
1. Test your webhook by making a change in Sanity
2. Check Vercel deployments to see if it triggers
3. Verify the website updates automatically

---

## 🆘 Still Not Working?

If you still see the error:
1. Clear your browser cache (Cmd+Shift+Delete)
2. Try a different browser
3. Check browser console for errors (F12)
4. Make sure you're using the correct URL

