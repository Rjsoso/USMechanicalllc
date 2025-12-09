# Fix Vercel Not Deploying from GitHub

## Quick Diagnosis Steps

### 1. Check if Vercel is Connected to GitHub
Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/git**

**What to check:**
- ✅ **Git Repository** should show: `rjsoso/USMechanicalllc` or similar
- ✅ **Production Branch** should be: `main`
- ✅ **Auto-deploy** should be **enabled** (toggle should be ON)

**If repository is missing or wrong:**
1. Click **"Disconnect"** if connected to wrong repo
2. Click **"Connect Git Repository"**
3. Select the correct repository: `USMechanicalllc`
4. Select branch: `main`
5. Click **"Connect"**

### 2. Check Deployment Settings
Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings**

**Verify these settings:**
- **Root Directory**: `react-site` (no trailing slash)
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Check if Webhooks are Working
Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/git**

**Look for:**
- **Deploy Hooks** section
- Should show webhook URL if configured
- Check if webhook is enabled

**To test webhook:**
1. Go to GitHub: **https://github.com/Rjsoso/USMechanicalllc/settings/hooks**
2. Look for Vercel webhook
3. Check recent deliveries - should show successful deliveries when you push

### 4. Manual Trigger Deployment
If auto-deploy isn't working:

**Option A: Redeploy from Vercel Dashboard**
1. Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments**
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. This will trigger a new build with latest code

**Option B: Push an Empty Commit**
```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin main
```

**Option C: Use Vercel CLI**
```bash
cd "/Applications/US Mechanical Website"
npx vercel --prod
```

### 5. Check Build Logs
Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments**

1. Click on the latest deployment
2. Check **"Build Logs"** tab
3. Look for errors or warnings
4. Common issues:
   - Build command failing
   - Missing dependencies
   - Root directory incorrect
   - Environment variables missing

### 6. Verify GitHub Repository Connection
Go to GitHub: **https://github.com/Rjsoso/USMechanicalllc/settings/hooks**

**Check:**
- Is there a Vercel webhook configured?
- Is it active/enabled?
- Are there recent successful deliveries?

**If no webhook exists:**
1. Go back to Vercel Dashboard
2. Settings → Git
3. Click "Connect Git Repository" if not connected
4. Or check "Deploy Hooks" section

### 7. Check Branch Protection
Go to GitHub: **https://github.com/Rjsoso/USMechanicalllc/settings/branches**

**Verify:**
- `main` branch doesn't have restrictions blocking Vercel
- If branch protection is enabled, Vercel needs proper permissions

## Common Issues & Solutions

### Issue 1: Repository Not Connected
**Symptom:** No deployments happening automatically
**Solution:** Connect repository in Vercel Settings → Git

### Issue 2: Wrong Branch
**Symptom:** Deployments from wrong branch
**Solution:** Set Production Branch to `main` in Vercel Settings → Git

### Issue 3: Auto-deploy Disabled
**Symptom:** Manual deployments work but auto-deploy doesn't
**Solution:** Enable "Auto-deploy" toggle in Vercel Settings → Git

### Issue 4: Build Failing
**Symptom:** Deployments triggered but failing
**Solution:** Check build logs, fix errors, verify Root Directory is `react-site`

### Issue 5: Webhook Not Working
**Symptom:** GitHub pushes don't trigger deployments
**Solution:** 
- Reconnect repository
- Check GitHub webhook settings
- Verify webhook URL is correct

## Quick Fix Checklist

- [ ] Vercel project connected to GitHub repo
- [ ] Production branch set to `main`
- [ ] Auto-deploy enabled
- [ ] Root Directory set to `react-site`
- [ ] Build settings correct (Vite, npm run build, dist)
- [ ] Webhook exists and is active
- [ ] No build errors in deployment logs
- [ ] Branch protection not blocking Vercel

## Test After Fixing

1. Make a small change (add a comment to a file)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```
3. Check Vercel Dashboard → Deployments
4. Should see new deployment starting within seconds
5. Wait for build to complete
6. Verify site is updated

## Still Not Working?

If deployments still don't trigger automatically:
1. Use manual redeploy from Vercel Dashboard
2. Check Vercel support/docs
3. Verify GitHub repository permissions
4. Check if Vercel app has access to the repository
