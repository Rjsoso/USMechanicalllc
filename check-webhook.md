# 🔍 Quick Webhook Check

## Step 1: Check Vercel Deploy Hook

1. **Open this URL:**
   ```
   https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks
   ```

2. **Look for a hook with:**
   - ✅ Name: `Sanity Content Updates` (or similar)
   - ✅ Branch: `main`
   - ✅ Status: Active/Enabled
   - ✅ URL format: `https://api.vercel.com/v1/integrations/deploy/...`

3. **If you see it:** ✅ Vercel hook is set up!
   - Copy the URL (you'll need it for Step 2)

4. **If you don't see it:** ❌ Create one now
   - Click "Create Hook"
   - Name: `Sanity Content Updates`
   - Branch: `main`
   - Copy the URL

---

## Step 2: Check Sanity Webhook

1. **Open this URL:**
   ```
   https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks
   ```

2. **Look for a webhook with:**
   - ✅ Name: `Trigger Vercel Rebuild` (or similar)
   - ✅ URL: Should match your Vercel hook URL exactly
   - ✅ Dataset: `production`
   - ✅ Triggers: `create`, `update`, `delete` (all checked)
   - ✅ HTTP Method: `POST`
   - ✅ Status: Active/Enabled

3. **If you see it:** ✅ Sanity webhook is set up!
   - Check that the URL matches your Vercel hook URL exactly

4. **If you don't see it:** ❌ Create one now
   - Click "Create webhook"
   - Name: `Trigger Vercel Rebuild`
   - URL: Paste your Vercel hook URL
   - Dataset: `production`
   - Triggers: Check `create`, `update`, `delete`
   - HTTP Method: `POST`
   - API Version: `v2021-03-25`

---

## Step 3: Test It!

1. **Make a test change:**
   - Go to: https://sanity-henna.vercel.app/structure
   - Edit any content (e.g., "Our Services Section")
   - Click "Publish"

2. **Watch Vercel:**
   - Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments
   - Within 30 seconds, you should see a new deployment starting
   - It should say "Triggered by Deploy Hook"

3. **If deployment starts:** ✅ Webhook is working!
4. **If nothing happens:** ❌ Check the settings above

---

## Common Issues

### ❌ URL Mismatch
- **Problem:** Sanity webhook URL doesn't match Vercel hook URL
- **Fix:** Copy the exact URL from Vercel and paste into Sanity

### ❌ Wrong Dataset
- **Problem:** Sanity webhook dataset is not `production`
- **Fix:** Change dataset to `production`

### ❌ Missing Triggers
- **Problem:** Not all triggers are checked (`create`, `update`, `delete`)
- **Fix:** Check all three triggers

### ❌ Wrong HTTP Method
- **Problem:** HTTP method is not `POST`
- **Fix:** Change to `POST`

---

## ✅ Correct Setup Summary

**Vercel:**
- Hook Name: `Sanity Content Updates`
- Branch: `main`
- URL: `https://api.vercel.com/v1/integrations/deploy/[ID]`

**Sanity:**
- Webhook Name: `Trigger Vercel Rebuild`
- URL: Same as Vercel hook URL
- Dataset: `production`
- Triggers: `create`, `update`, `delete`
- Method: `POST`

