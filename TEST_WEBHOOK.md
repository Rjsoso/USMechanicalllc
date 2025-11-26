# 🧪 Test Webhook: Sanity → Vercel

## Quick Test Steps

### Step 1: Make a Test Change in Sanity
1. Go to: **https://sanity-henna.vercel.app/structure**
2. Click: **"5. Our Services Section (CardSwap) ⭐"**
3. Change the **"Section Title"** field:
   - Current: (whatever it is now)
   - Change to: **"Our Services - TEST"** (or add "TEST" to the end)
4. Click **"Publish"** (top right)
5. Wait for the "Published" confirmation

### Step 2: Watch Vercel Dashboard
1. Go to: **https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments**
2. **Within 30 seconds**, you should see:
   - ✅ A new deployment starting automatically
   - ✅ Status: "Building..." then "Ready"
   - ✅ Trigger: Should show "Deploy Hook" or "Webhook"

### Step 3: Verify Website Updates
1. Wait for deployment to complete (usually 1-2 minutes)
2. Visit your website URL
3. **Hard refresh** (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
4. Check the "Our Services" section title
5. Should show your test change!

### Step 4: Revert Test Change (Optional)
1. Go back to Sanity Studio
2. Change title back to original
3. Click **"Publish"**
4. Watch Vercel deploy again
5. Verify website updates

---

## ✅ Success Indicators

- [ ] Sanity change published successfully
- [ ] Vercel deployment triggered within 30 seconds
- [ ] Deployment completes successfully
- [ ] Website shows updated content after hard refresh

---

## 🔧 If Webhook Doesn't Trigger

1. **Check webhook in Sanity:**
   - Go to: https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks
   - Verify webhook is active/enabled
   - Check webhook URL is correct

2. **Check Vercel deploy hook:**
   - Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks
   - Verify hook is active
   - Check branch matches (`main`)

3. **Check Sanity webhook logs:**
   - In Sanity webhook settings, look for "Recent deliveries"
   - Should show recent webhook calls
   - Check for any errors

4. **Manual test:**
   - Copy Vercel deploy hook URL
   - Use curl or Postman to POST to it
   - Should trigger a deployment

---

## 🎉 Once It Works

You're all set! Now:
- ✅ Any Sanity content update will auto-rebuild the website
- ✅ No manual deployments needed
- ✅ Team can update content without touching code

