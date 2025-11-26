# Complete Setup Guide: Connect Vercel + GitHub + Sanity

## 🎯 Goal
Connect everything so that:
1. ✅ GitHub pushes automatically deploy to Vercel
2. ✅ Sanity content updates trigger Vercel rebuilds
3. ✅ Website shows latest content from Sanity

---

## STEP 1: Verify GitHub Repository

**Repository URL**: `https://github.com/rjsoso/USMechanicalllc.git`

**Check if accessible**:
- Open: https://github.com/rjsoso/USMechanicalllc
- Verify you can see the repository
- Check if it's Public or Private

---

## STEP 2: Connect Vercel to GitHub

### 2.1 Authorize Vercel GitHub Integration

1. Go to: **https://vercel.com/account/integrations**
2. Find **GitHub** in the list
3. Click **"Add New..."** or **"Configure"**
4. Authorize Vercel to access your GitHub account
5. Grant access to:
   - ✅ All repositories, OR
   - ✅ Specific repository: `rjsoso/USMechanicalllc`

### 2.2 Link Project to Repository

1. Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/git**
2. Under **"Git Repository"**:
   - If not connected: Click **"Connect Git Repository"**
   - Search for: `USMechanicalllc` or `rjsoso/USMechanicalllc`
   - Select the repository
   - Click **"Connect"**
3. Verify settings:
   - **Production Branch**: `main`
   - **Root Directory**: Leave empty (or set to `react-site` if needed)
   - **Build Command**: `cd react-site && npm install && npm run build`
   - **Output Directory**: `react-site/dist`

---

## STEP 3: Set Up Sanity Webhook (Auto-Rebuild)

### 3.1 Create Vercel Deploy Hook

1. Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks**
2. Click **"Create Hook"**
3. Configure:
   - **Name**: `Sanity Content Updates`
   - **Git Branch**: `main`
   - Click **"Create Hook"**
4. **Copy the Hook URL** (looks like: `https://api.vercel.com/v1/integrations/deploy/...`)

### 3.2 Add Webhook in Sanity

1. Go to: **https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks**
2. Click **"Create webhook"**
3. Configure:
   - **Name**: `Trigger Vercel Rebuild`
   - **URL**: Paste your Vercel Deploy Hook URL
   - **Dataset**: `production`
   - **Trigger on**: 
     - ✅ `create`
     - ✅ `update` 
     - ✅ `delete`
   - **Filter**: Leave empty (or use: `_type == "ourServices"`)
   - **HTTP method**: `POST`
   - **API version**: `v2021-03-25`
4. Click **"Save"**

### 3.3 Test the Webhook

1. Go to Sanity Studio: **https://sanity-henna.vercel.app/structure**
2. Edit any content (e.g., "Our Services Section")
3. Click **"Publish"**
4. Check Vercel Dashboard → Deployments
5. You should see a new deployment triggered automatically! 🎉

---

## STEP 4: Verify Environment Variables

### 4.1 Check Vercel Environment Variables

1. Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/environment-variables**
2. Verify these are set:
   - `VITE_SANITY_PROJECT_ID` = `3vpl3hho`
   - `VITE_SANITY_DATASET` = `production`
   - (Optional) `VITE_SANITY_WRITE_TOKEN` = (your write token if needed)

### 4.2 Add if Missing

If variables are missing:
1. Click **"Add New"**
2. Add each variable:
   - **Key**: `VITE_SANITY_PROJECT_ID`
   - **Value**: `3vpl3hho`
   - **Environment**: Production, Preview, Development (select all)
3. Repeat for other variables

---

## STEP 5: Test Everything

### 5.1 Test GitHub → Vercel

1. Make a small change locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push
   ```
3. Check Vercel Dashboard → should auto-deploy

### 5.2 Test Sanity → Vercel

1. Edit content in Sanity Studio
2. Publish changes
3. Check Vercel Dashboard → should auto-rebuild

### 5.3 Verify Website Updates

1. Wait for deployment to complete
2. Visit your website
3. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
4. Verify changes appear

---

## 🔧 Troubleshooting

### Issue: Vercel can't find repository
**Solution**: 
- Re-authorize GitHub integration
- Check repository is accessible
- Verify repository name matches exactly

### Issue: Webhook not triggering
**Solution**:
- Verify webhook URL is correct
- Check Sanity webhook logs
- Test webhook manually (use curl or Postman)

### Issue: Changes not showing
**Solution**:
- Check Vercel deployment logs
- Verify environment variables
- Hard refresh browser
- Check CDN cache settings

---

## ✅ Success Checklist

- [ ] GitHub repository accessible
- [ ] Vercel connected to GitHub
- [ ] Project linked to repository
- [ ] Deploy hook created
- [ ] Sanity webhook configured
- [ ] Environment variables set
- [ ] Test deployment works
- [ ] Test webhook works
- [ ] Website shows latest content

---

## 📞 Need Help?

If you get stuck at any step, let me know which step and I'll help troubleshoot!

