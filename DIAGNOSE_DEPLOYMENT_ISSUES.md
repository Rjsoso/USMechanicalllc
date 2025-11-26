# 🔍 Diagnose: Deployments Rebuilding But No Changes Showing

## Common Causes

### 1. ❌ Documents Don't Exist in Sanity
**Problem:** The website shows default/fallback content because documents don't exist in Sanity yet.

**Solution:** Create documents in Sanity Studio:
1. Go to Sanity Studio
2. Click each section (Hero, About, Services, etc.)
3. Create and publish each document
4. See `POPULATE_SANITY_CONTENT.md` for content to add

### 2. ❌ Browser Cache
**Problem:** Browser is showing cached version.

**Solution:** 
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear browser cache
- Try incognito/private window

### 3. ❌ Deployment Failed
**Problem:** Vercel shows "rebuilding" but deployment actually failed.

**Solution:**
1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Check "Build Logs" for errors
4. Fix any errors and redeploy

### 4. ❌ Wrong Project Deploying
**Problem:** Changes pushed but wrong project is deploying.

**Solution:**
- **Website:** Should deploy `us-mechanicalllc` project
- **Sanity Studio:** Should deploy `us-mechanicalsanity` or `sanity-henna` project
- Verify Root Directory is correct in Vercel settings

### 5. ❌ CDN Cache (Even with useCdn: false)
**Problem:** Vercel's CDN might still cache.

**Solution:**
- Wait 1-2 minutes after deployment
- Hard refresh browser
- Check if `useCdn: false` is actually in the deployed code

---

## ✅ Quick Fix Steps

### Step 1: Verify Deployments Succeeded
1. Go to: https://vercel.com/dashboard
2. Check both projects:
   - `us-mechanicalllc` (website)
   - `us-mechanicalsanity` or `sanity-henna` (Sanity Studio)
3. Latest deployment should show ✅ "Ready" (not ❌ "Error")

### Step 2: Check Build Logs
1. Click on latest deployment
2. Check "Build Logs" tab
3. Look for errors or warnings
4. If errors found, fix them

### Step 3: Verify Documents Exist
1. Go to Sanity Studio
2. Check if you see sections in left sidebar
3. Click each section - if it says "Document not found", create it
4. See `POPULATE_SANITY_CONTENT.md` for what to add

### Step 4: Force Fresh Content
1. Hard refresh browser: `Cmd+Shift+R`
2. Check browser console (F12) for errors
3. Verify network requests are hitting Sanity API

### Step 5: Test Sanity Connection
Open browser console and run:
```javascript
fetch('https://3vpl3hho.api.sanity.io/v2023-05-03/data/query/production?query=*[_type == "heroSection"][0]&perspective=published')
  .then(r => r.json())
  .then(console.log)
```

If this returns `null`, the document doesn't exist in Sanity yet.

---

## 🚀 Force Redeploy

### Option 1: Via Git (Recommended)
```bash
cd "/Applications/US Mechanical Website"
git commit --allow-empty -m "Force redeploy"
git push
```

### Option 2: Via Vercel Dashboard
1. Go to Vercel Dashboard → Deployments
2. Click "Redeploy" on latest deployment
3. Wait for it to complete

---

## 📋 Checklist

- [ ] Latest deployment shows ✅ "Ready" (not Error)
- [ ] No errors in build logs
- [ ] Documents exist in Sanity Studio
- [ ] Hard refreshed browser (Cmd+Shift+R)
- [ ] Checked browser console for errors
- [ ] Verified network requests are working
- [ ] Tested Sanity API query directly

---

## 🆘 Still Not Working?

1. **Check Vercel deployment logs** - Look for actual errors
2. **Check browser console** - Look for JavaScript errors
3. **Check network tab** - Verify Sanity API calls are working
4. **Verify documents exist** - Create them in Sanity Studio if missing

