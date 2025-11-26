# ✅ Verification Checklist: Vercel + GitHub + Sanity Integration

## Step 1: Verify Vercel Settings ✅

### React Website (`us-mechanicalllc`)
- [x] Framework Preset: **Vite**
- [x] Root Directory: **`react-site`**
- [x] Build Command: **`npm run build`**
- [x] Output Directory: **`dist`**
- [x] Install Command: **`npm install`**

### Sanity Studio (`us-mechanicalsanity`)
- [x] Framework Preset: **Sanity** (or Vite)
- [x] Root Directory: **`sanity`** (or empty if building from root)
- [x] Build Command: **`npm install && npm run build`**
- [x] Output Directory: **`dist`**
- [x] Install Command: **`npm install`**

---

## Step 2: Verify GitHub Connection ✅

### Check Git Integration
1. Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/git**
2. Verify:
   - [x] Repository: **`rjsoso/USMechanicalllc`**
   - [x] Production Branch: **`main`**
   - [x] Root Directory: **`react-site`** (for React site)
   - [x] Auto-deployments: **Enabled**

---

## Step 3: Test GitHub → Vercel Deployment ✅

### Test Auto-Deployment
1. Make a small change locally:
   ```bash
   cd "/Applications/US Mechanical Website"
   echo "# Test deployment" >> TEST.md
   git add TEST.md
   git commit -m "Test: Verify GitHub auto-deployment"
   git push
   ```

2. Check Vercel Dashboard:
   - [ ] Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments**
   - [ ] Should see a new deployment starting automatically
   - [ ] Wait for it to complete (should show "Ready")

3. Verify website updates:
   - [ ] Visit your website URL
   - [ ] Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
   - [ ] Changes should appear

---

## Step 4: Set Up Sanity Webhook (Auto-Rebuild) ✅

### 4.1 Create Vercel Deploy Hook
1. Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks**
2. Click **"Create Hook"**
3. Configure:
   - Name: **`Sanity Content Updates`**
   - Git Branch: **`main`**
   - Click **"Create Hook"**
4. **Copy the Hook URL** (looks like: `https://api.vercel.com/v1/integrations/deploy/...`)

### 4.2 Add Webhook in Sanity
1. Go to: **https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks**
2. Click **"Create webhook"**
3. Configure:
   - Name: **`Trigger Vercel Rebuild`**
   - URL: **Paste your Vercel Deploy Hook URL**
   - Dataset: **`production`**
   - Trigger on: 
     - ✅ `create`
     - ✅ `update` 
     - ✅ `delete`
   - HTTP method: **`POST`**
   - API version: **`v2021-03-25`**
4. Click **"Save"**

---

## Step 5: Test Sanity → Vercel Webhook ✅

### Test Webhook Trigger
1. Go to Sanity Studio: **https://sanity-henna.vercel.app/structure**
2. Edit any content:
   - Go to **"5. Our Services Section (CardSwap) ⭐"**
   - Make a small change (e.g., update the section title)
   - Click **"Publish"**
3. Check Vercel Dashboard:
   - [ ] Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments**
   - [ ] Should see a new deployment triggered automatically within 30 seconds
   - [ ] Deployment should show "Triggered by Deploy Hook"
4. Wait for deployment to complete
5. Verify website updates:
   - [ ] Visit your website
   - [ ] Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
   - [ ] Changes from Sanity should appear

---

## Step 6: Verify Environment Variables ✅

### Check React Website Environment Variables
1. Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/environment-variables**
2. Verify these are set (for Production, Preview, Development):
   - [ ] `VITE_SANITY_PROJECT_ID` = `3vpl3hho`
   - [ ] `VITE_SANITY_DATASET` = `production`
   - [ ] (Optional) `VITE_SANITY_WRITE_TOKEN` = (if needed)

---

## Step 7: Final Verification ✅

### Test Complete Flow
1. **Edit content in Sanity Studio**
   - Update "Our Services" section title
   - Publish changes
   
2. **Verify webhook triggers deployment**
   - Check Vercel deployments page
   - Should see new deployment within 30 seconds
   
3. **Verify website shows updates**
   - Wait for deployment to complete
   - Visit website and hard refresh
   - Changes should be visible

---

## 🎉 Success Criteria

✅ GitHub pushes automatically deploy to Vercel  
✅ Sanity content updates trigger Vercel rebuilds  
✅ Website shows latest content from Sanity  
✅ No manual deployments needed  

---

## 🔧 Troubleshooting

### Issue: Webhook not triggering
- Check webhook URL is correct
- Verify webhook is enabled in Sanity
- Check Vercel deploy hook is active
- Look at Sanity webhook logs

### Issue: Changes not showing
- Check Vercel deployment logs
- Verify environment variables
- Hard refresh browser (Cmd+Shift+R)
- Check CDN cache settings

### Issue: Deployment fails
- Check build logs in Vercel
- Verify Root Directory is correct
- Check Build Command matches project structure
- Verify Output Directory exists after build

---

## 📞 Next Steps

Once everything is verified:
1. ✅ Remove test files (`TEST.md` if created)
2. ✅ Document any custom settings
3. ✅ Set up monitoring/alerts (optional)
4. ✅ Train team on Sanity Studio usage

