# Vercel & Sanity Connection Issues - Diagnosis

## 🔍 Issues Found

### 1. **Separate Vercel Projects (Not Connected)**
You have **THREE separate Vercel projects** that don't communicate:

- **Root Project**: `us-mechanicalllc` (prj_ObMgg3GNFQ8CPVzHbpogb4Y2xCfd)
- **Sanity Studio**: `sanity` (prj_DLBaCz0yVzxFPTJU2PcVTeB8rPgr) - **SEPARATE PROJECT**
- **React Site**: `us-mechanicalllc` (same as root)

**Problem**: When you update content in Sanity Studio, it doesn't trigger a rebuild of the React site. They're completely disconnected.

---

### 2. **CDN Caching Issue**
**Location**: `react-site/src/utils/sanity.js`

**Current Setting**:
```javascript
useCdn: false, // Temporarily disabled
```

**Problem**: 
- CDN is disabled, which means you're hitting Sanity API directly
- But in production (Vercel), this might still cache responses
- Updates from Sanity won't show immediately

**Solution**: Need to properly configure CDN with cache-busting or revalidation.

---

### 3. **Multiple Sanity Client Files (Inconsistency)**
You have **3 different Sanity client configurations**:

1. `react-site/src/utils/sanity.js` - **Main one** (CDN disabled)
2. `react-site/src/sanityClient.js` - CDN enabled for production
3. `react-site/src/lib/sanityClient.js` - CDN enabled for production

**Problem**: Different components might be using different clients, causing inconsistent behavior.

---

### 4. **Vercel Deployment Configuration**
**Root `vercel.json`**:
```json
{
  "buildCommand": "cd react-site && npm install && npm run build",
  "outputDirectory": "react-site/dist"
}
```

**Problem**: 
- Only builds React site, not Sanity Studio
- Sanity Studio is deployed separately, so they're not synced

---

## ✅ Solutions

### Solution 1: Enable CDN with Proper Cache Control
Update `react-site/src/utils/sanity.js`:

```javascript
export const client = createClient({
  ...SANITY_CONFIG,
  useCdn: import.meta.env.PROD, // Enable CDN in production
  // Add cache control headers
  perspective: 'published',
  apiVersion: '2023-05-03',
})
```

### Solution 2: Add Revalidation/Webhook
Set up a Sanity webhook to trigger Vercel rebuilds when content changes:

1. Go to Sanity Dashboard → API → Webhooks
2. Create webhook pointing to: `https://api.vercel.com/v1/integrations/deploy/[DEPLOY_HOOK_ID]`
3. Trigger on: `create`, `update`, `delete` events

### Solution 3: Consolidate Sanity Clients
Remove duplicate Sanity client files and use only `react-site/src/utils/sanity.js`.

### Solution 4: Check Vercel Environment Variables
Ensure Sanity project ID and dataset are set in Vercel:
- `VITE_SANITY_PROJECT_ID` = `3vpl3hho`
- `VITE_SANITY_DATASET` = `production`

---

## 🔧 Immediate Fixes Needed

1. **Enable CDN properly** in `react-site/src/utils/sanity.js`
2. **Set up Sanity webhook** to trigger Vercel rebuilds
3. **Remove duplicate Sanity client files**
4. **Verify Vercel environment variables** are set correctly

---

## 📊 Current Status

- ✅ Sanity Studio: Deployed separately (not connected)
- ✅ React Site: Deployed separately (not connected)
- ❌ No automatic rebuilds when Sanity content changes
- ❌ CDN caching may be preventing updates from showing

