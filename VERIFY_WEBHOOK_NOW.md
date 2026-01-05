# Verify Webhook is Deploying to Vercel

## Step 1: Get Your Vercel Deploy Hook URL

1. Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks**

2. You should see a deploy hook (if not, create one):
   - Click **"Create Hook"**
   - Name: `Sanity Content Updates`
   - Branch: `main`
   - Click **"Create Hook"**

3. **Copy the webhook URL** - it should look like:
   ```
   https://api.vercel.com/v1/integrations/deploy/prj_XXXXXXXXXXXXX/YYYYYYYYYYYYY
   ```

---

## Step 2: Verify Sanity Webhook Points to Vercel

1. Go to: **https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks**

2. Look at your webhook configuration

3. **CRITICAL CHECK:** The URL field should match EXACTLY the Vercel Deploy Hook URL from Step 1

   ✅ **CORRECT:**
   ```
   https://api.vercel.com/v1/integrations/deploy/prj_XXXXX/YYYYY
   ```

   ❌ **WRONG (if it's a GitHub URL):**
   ```
   https://github.com/...
   https://api.github.com/...
   ```

4. If the URL is wrong or doesn't match:
   - Click **"Edit"** on the webhook
   - Replace the URL with the correct Vercel Deploy Hook URL
   - Click **"Save"**

---

## Step 3: Check Webhook Settings

While editing the webhook in Sanity, verify:

- ✅ **Dataset**: `production`
- ✅ **Trigger on**: 
  - ✅ `create` (checked)
  - ✅ `update` (checked)
  - ✅ `delete` (checked)
- ✅ **HTTP method**: `POST`
- ✅ **HTTP Headers**: Empty (not needed)
- ✅ **Filter**: Empty (or leave as is if you have one)

---

## Step 4: Test the Webhook

### Test from Sanity:

1. Go to your Sanity Studio: **https://us-mechanicalsanity.vercel.app/structure**
2. Click **"1. Header Section"**
3. Make any small change (add a space, change a word)
4. Click **"Publish"**

### Check if it worked:

**In Sanity (within 5 seconds):**
1. Go back to: https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks
2. Click on your webhook
3. Look at **"Logs"** or **"Recent deliveries"**
4. You should see a new entry with:
   - ✅ **Green checkmark** = Success! Webhook fired
   - ❌ **Red X** = Failed (click to see error)
   - ⚪ **Nothing** = Webhook didn't fire at all

**In Vercel (within 30 seconds):**
1. Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments**
2. Look for a new deployment starting
3. The "Source" should say: **"Hook: Sanity Content Updates"**
4. Wait 2-3 minutes for it to finish building

**On Your Website (after Vercel finishes):**
1. Go to your live website
2. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)
3. Your changes should be visible

---

## Common Problems:

### Problem 1: Webhook URL is Wrong
**Symptom:** Green checkmark in Sanity, but no deployment in Vercel

**Fix:** 
- The URL must be EXACTLY the Vercel Deploy Hook URL
- No extra spaces, characters, or wrong URL
- Must start with `https://api.vercel.com/v1/integrations/deploy/`

### Problem 2: Wrong Vercel Project
**Symptom:** Deployment happens but wrong site updates

**Fix:**
- Make sure the Deploy Hook is for `us-mechanicalllc` project
- NOT for the Sanity Studio project

### Problem 3: Webhook Not Firing
**Symptom:** No logs in Sanity, nothing happens

**Fix:**
- Make sure "Trigger on" has `create`, `update`, `delete` checked
- Dataset is set to `production`
- Try deleting and recreating the webhook

---

## Manual Test (Emergency)

If automatic webhook isn't working, you can manually trigger deployments:

1. Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc**
2. Click **"Deployments"** tab
3. Click **"..."** menu on latest deployment
4. Click **"Redeploy"**
5. Wait for rebuild to complete

This is temporary - fix the webhook for automatic updates!

