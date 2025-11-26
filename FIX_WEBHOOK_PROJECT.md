# 🔧 Fix Webhook: Wrong Vercel Project

## ❌ The Problem

You created the deploy hook in the **Sanity Studio** project (`us-mechanicalsanity`), but it needs to be in the **Website** project (`us-mechanicalllc`).

The webhook should trigger deployments of your **website**, not the Sanity Studio.

---

## ✅ The Fix

### Step 1: Go to the Correct Vercel Project

1. **Open this URL:**
   ```
   https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks
   ```
   
   ⚠️ **Important:** Make sure it says `us-mechanicalllc` (not `us-mechanicalsanity`)

### Step 2: Create Deploy Hook in Website Project

1. Click **"Create Hook"**
2. Configure:
   - **Name**: `Sanity Content Updates`
   - **Branch**: `main`
   - Click **"Create Hook"**
3. **Copy the Hook URL** (looks like: `https://api.vercel.com/v1/integrations/deploy/...`)

### Step 3: Update Sanity Webhook

1. Go to: **https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks**
2. Find your existing webhook (or create a new one)
3. **Update the URL** to match the hook URL from Step 2
4. Verify settings:
   - ✅ Dataset: `production`
   - ✅ Triggers: `create`, `update`, `delete` (all checked)
   - ✅ HTTP Method: `POST`
   - ✅ API Version: `v2021-03-25`
5. Click **"Save"**

### Step 4: Test It

1. Make a small change in Sanity Studio
2. Click **"Publish"**
3. Check: **https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments**
4. Within 30 seconds, you should see a new deployment starting!

---

## 📋 Quick Checklist

- [ ] Deploy hook created in `us-mechanicalllc` project (not `us-mechanicalsanity`)
- [ ] Hook URL copied correctly
- [ ] Sanity webhook URL matches the new hook URL
- [ ] Sanity webhook dataset: `production`
- [ ] Sanity webhook triggers: `create`, `update`, `delete`
- [ ] Test: Publish in Sanity → Check `us-mechanicalllc` deployments

---

## 🎯 Summary

**Wrong:** Deploy hook in `us-mechanicalsanity` (Sanity Studio project)  
**Correct:** Deploy hook in `us-mechanicalllc` (Website project)

The webhook triggers website rebuilds when Sanity content changes, so it needs to be in the website project!

