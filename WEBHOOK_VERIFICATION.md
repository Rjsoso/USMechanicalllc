# 🔍 Webhook Verification Guide

Use this guide to verify your webhook is set up correctly.

## ✅ Step 1: Verify Vercel Deploy Hook

1. **Go to Vercel Deploy Hooks:**
   - URL: **https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks**

2. **Check for a hook with these settings:**
   - ✅ **Name**: `Sanity Content Updates` (or similar)
   - ✅ **Branch**: `main`
   - ✅ **Status**: Active/Enabled
   - ✅ **Hook URL**: Should look like `https://api.vercel.com/v1/integrations/deploy/...`

3. **If hook exists:**
   - ✅ Copy the hook URL (you'll need it for Step 2)
   - ✅ Note: Make sure it's pointing to the **correct project** (`us-mechanicalllc`)

4. **If hook doesn't exist:**
   - Click **"Create Hook"**
   - Name: `Sanity Content Updates`
   - Branch: `main`
   - Click **"Create Hook"**
   - Copy the URL

---

## ✅ Step 2: Verify Sanity Webhook

1. **Go to Sanity Webhooks:**
   - URL: **https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks**

2. **Check for a webhook with these settings:**
   - ✅ **Name**: `Trigger Vercel Rebuild` (or similar)
   - ✅ **URL**: Should match your Vercel Deploy Hook URL from Step 1
   - ✅ **Dataset**: `production`
   - ✅ **Trigger on**: 
     - ✅ `create`
     - ✅ `update`
     - ✅ `delete`
   - ✅ **HTTP method**: `POST`
   - ✅ **API version**: `v2021-03-25` (or `v2021-03-25`)
   - ✅ **Status**: Active/Enabled

3. **Check webhook logs:**
   - Look for **"Recent deliveries"** or **"Webhook logs"**
   - Should show recent webhook calls when you publish in Sanity
   - Check for any error messages

4. **If webhook doesn't exist:**
   - Click **"Create webhook"**
   - Name: `Trigger Vercel Rebuild`
   - URL: Paste your Vercel Deploy Hook URL
   - Dataset: `production`
   - Trigger on: `create`, `update`, `delete`
   - HTTP method: `POST`
   - API version: `v2021-03-25`
   - Click **"Save"**

---

## ✅ Step 3: Test the Webhook

### Quick Test:

1. **Make a test change in Sanity:**
   - Go to: **https://sanity-henna.vercel.app/structure**
   - Click: **"5. Our Services Section (CardSwap) ⭐"**
   - Change the **"Section Title"** to: `Our Services - TEST`
   - Click **"Publish"**

2. **Watch Vercel Dashboard:**
   - Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments**
   - **Within 30 seconds**, you should see:
     - ✅ A new deployment starting automatically
     - ✅ Status: "Building..." then "Ready"
     - ✅ Trigger: Should show **"Deploy Hook"** or **"Webhook"**

3. **If deployment starts:**
   - ✅ **Webhook is working correctly!**
   - Wait for deployment to complete
   - Visit your website and hard refresh (Cmd+Shift+R)
   - Changes should appear

4. **If deployment doesn't start:**
   - ❌ Webhook may not be configured correctly
   - See troubleshooting below

---

## 🔧 Troubleshooting

### Issue 1: Vercel Deploy Hook Not Found
**Solution:**
- Make sure you're in the correct Vercel project (`us-mechanicalllc`)
- Check you're looking at the right team/account
- Create a new hook if needed

### Issue 2: Sanity Webhook Not Found
**Solution:**
- Make sure you're in the correct Sanity project (`3vpl3hho`)
- Check the project ID matches
- Create a new webhook if needed

### Issue 3: Webhook URL Mismatch
**Solution:**
- Copy the exact URL from Vercel Deploy Hooks
- Paste it into Sanity webhook URL field
- Make sure there are no extra spaces or characters
- URL should start with `https://api.vercel.com/v1/integrations/deploy/...`

### Issue 4: Webhook Not Triggering
**Check these:**
1. **Sanity webhook logs:**
   - Go to Sanity webhook settings
   - Look for "Recent deliveries"
   - Check if webhook is being called
   - Look for error messages

2. **Vercel deploy hook:**
   - Make sure hook is active/enabled
   - Check branch matches (`main`)
   - Try manually triggering the hook URL (use curl or Postman)

3. **Sanity webhook settings:**
   - Make sure triggers are set: `create`, `update`, `delete`
   - Check dataset is `production`
   - Verify HTTP method is `POST`

### Issue 5: Wrong Project/Branch
**Solution:**
- Vercel hook should point to: `us-mechanicalllc` project, `main` branch
- Sanity webhook should use dataset: `production`
- Double-check both are correct

---

## ✅ Correct Configuration Summary

### Vercel Deploy Hook:
```
Name: Sanity Content Updates
Branch: main
URL: https://api.vercel.com/v1/integrations/deploy/[YOUR_HOOK_ID]
Project: us-mechanicalllc
```

### Sanity Webhook:
```
Name: Trigger Vercel Rebuild
URL: [Your Vercel Deploy Hook URL]
Dataset: production
Triggers: create, update, delete
HTTP Method: POST
API Version: v2021-03-25
Project: 3vpl3hho
```

---

## 🎯 Quick Checklist

- [ ] Vercel Deploy Hook exists and is active
- [ ] Vercel hook URL is copied correctly
- [ ] Sanity webhook exists and is active
- [ ] Sanity webhook URL matches Vercel hook URL
- [ ] Sanity webhook triggers: create, update, delete
- [ ] Sanity webhook dataset: production
- [ ] Test: Publish in Sanity → Vercel deployment starts
- [ ] Webhook logs show successful calls

---

## 📞 Need Help?

If webhook still doesn't work after checking everything:
1. Check Sanity webhook logs for error messages
2. Try manually triggering Vercel deploy hook URL
3. Verify both services are using correct project IDs
4. Make sure webhook is enabled/active (not disabled)

