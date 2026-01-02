# Sanity to Vercel Webhook Setup Guide

## Problem
When you publish changes in Sanity, they don't automatically appear on your live website.

## Why This Happens
Your website fetches data from Sanity at runtime (`useCdn: false`), but:
1. Vercel may cache the built pages
2. Browsers cache the pages
3. Without a webhook, Vercel doesn't know to rebuild when Sanity content changes

## Solution: Set Up Automatic Webhooks

### Step 1: Create Vercel Deploy Hook

1. Go to your Vercel project deploy hooks:
   **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks**

2. Click **"Create Hook"** button

3. Configure the hook:
   - **Hook Name**: `Sanity Content Updates`
   - **Git Branch to Deploy**: `main`
   - Click **"Create Hook"**

4. **IMPORTANT**: Copy the webhook URL that appears
   - It will look like: `https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx`
   - Save this URL - you'll need it in the next step

### Step 2: Add Webhook to Sanity

1. Go to your Sanity project webhooks:
   **https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks**

2. Click **"Create webhook"** or **"Add webhook"**

3. Configure the webhook:
   - **Name**: `Trigger Vercel Rebuild`
   - **URL**: Paste the Vercel Deploy Hook URL from Step 1
   - **Dataset**: `production`
   - **Trigger on**:
     - ✅ Check `create`
     - ✅ Check `update`
     - ✅ Check `delete`
   - **Filter**: Leave empty (or add specific filter if you only want certain documents to trigger)
   - **HTTP method**: `POST`
   - **HTTP Headers**: Leave empty (not needed)
   - **Projection**: Leave empty
   - **API version**: `v2021-03-25` (or latest)
   - **Include drafts**: Unchecked (only published content triggers rebuild)

4. Click **"Save"** or **"Create"**

### Step 3: Test the Webhook

1. Go to your Sanity Studio:
   **https://sanity-henna.vercel.app/structure**

2. Edit any content (e.g., "Header Section")
   - Change the logo or edit navigation links
   - Click **"Publish"**

3. Check if webhook triggered:
   - Go to Vercel Deployments: **https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments**
   - Within 30 seconds, you should see a new deployment starting
   - Source should show: "Hook: Sanity Content Updates"

4. Wait for deployment to complete (usually 2-3 minutes)

5. Visit your website and hard refresh:
   - **Mac**: `Cmd + Shift + R`
   - **Windows/Linux**: `Ctrl + Shift + F5`

6. Your changes should now be visible! 🎉

---

## Troubleshooting

### Changes Still Not Appearing?

#### 1. Check Webhook Status in Sanity
- Go to: https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks
- Click on your webhook
- Check the "Recent deliveries" or "Logs" section
- Look for:
  - ✅ Green checkmarks = webhook fired successfully
  - ❌ Red X or errors = webhook failed

#### 2. Check Vercel Deployments
- Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments
- Look for deployments triggered by "Hook: Sanity Content Updates"
- If no hook deployments appear after publishing in Sanity, the webhook isn't working

#### 3. Verify Webhook URL is Correct
- The Sanity webhook URL MUST match the Vercel Deploy Hook URL exactly
- Go to Vercel deploy hooks: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks
- Copy the URL again
- Go to Sanity webhooks and update the URL if different

#### 4. Clear All Caches
Even with webhook working, you might see old content due to caching:

**Browser Cache:**
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)
- Or open in Incognito/Private window

**Vercel Cache:**
- The webhook triggers a fresh build, which clears Vercel's cache
- If needed, you can manually redeploy from Vercel dashboard

#### 5. Check Sanity Dataset
- Make sure you're editing content in the `production` dataset
- Your webhook should be configured for `production` dataset
- Your website is configured to fetch from `production` dataset

#### 6. Verify Environment Variables in Vercel
Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/environment-variables

Ensure these exist:
- `VITE_SANITY_PROJECT_ID` = `3vpl3hho`
- `VITE_SANITY_DATASET` = `production`

---

## How It Works (Technical Overview)

### Without Webhook:
```
You edit in Sanity → Publish → Nothing happens on Vercel
→ Website still shows old content (even with useCdn: false)
→ Need manual rebuild or wait for cache to expire
```

### With Webhook:
```
You edit in Sanity → Publish → Sanity webhook fires
→ Calls Vercel Deploy Hook
→ Vercel rebuilds site automatically
→ New content appears in ~2-3 minutes
```

### Cache Configuration:
Your `react-site/vercel.json` now includes:
```json
"headers": [{
  "source": "/(.*)",
  "headers": [{
    "key": "Cache-Control",
    "value": "public, max-age=0, must-revalidate"
  }]
}]
```

This tells browsers and CDNs to always revalidate content, ensuring users get fresh data.

---

## Quick Reference

### Important URLs

**Vercel Project:**
- Dashboard: https://vercel.com/rjsosos-projects/us-mechanicalllc
- Deploy Hooks: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks
- Deployments: https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments

**Sanity Project:**
- Manage: https://www.sanity.io/manage/personal/project/3vpl3hho
- Webhooks: https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks
- Studio: https://sanity-henna.vercel.app/structure

**Your Website:**
- Live Site: https://us-mechanicalllc.vercel.app (or your custom domain)

### Webhook Testing Script

You can also use the included webhook verification script:
```bash
cd "/Applications/US Mechanical Website"
node verify-webhook.js
```

This will guide you through verifying your webhook setup.

---

## Manual Rebuild (Emergency Option)

If webhook isn't working and you need to update the site immediately:

1. Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc
2. Click the **"Deployments"** tab
3. Click the three dots (...) on the most recent deployment
4. Click **"Redeploy"**
5. Wait for rebuild to complete

This is a temporary workaround - fix the webhook for automatic updates!

---

## Need Help?

If webhook still doesn't work after following this guide:
1. Check the Sanity webhook logs for error messages
2. Verify the Vercel deploy hook URL is still valid
3. Try deleting and recreating both the Vercel hook and Sanity webhook
4. Ensure your Sanity project has API access enabled

