# Sanity Studio Deployment Guide

## Recommended Setup: Dual Deployment

For the best stability and flexibility, your studio should be deployed to BOTH:

1. **Sanity Managed Hosting** (Primary) - Official, fast, no CORS issues
2. **Vercel** (Backup) - Auto-deploys with your code changes

## ✅ Current Status

- **Build:** ✅ Complete
- **CORS:** ✅ Properly configured for Vercel
- **Vercel Deployment:** ✅ Active at `https://sanity-henna.vercel.app`
- **Sanity Hosting:** ⚠️ Needs deployment

---

## 🚀 Deploy to Sanity Managed Hosting (RECOMMENDED)

### Why This is Best:
- ✅ No CORS configuration needed (ever)
- ✅ Hosted on Sanity's global CDN (faster)
- ✅ Separate from your website (studio updates independently)
- ✅ Professional `.sanity.studio` URL
- ✅ Automatic SSL and infrastructure management

### Deployment Steps:

```bash
cd "/Applications/US Mechanical Website/sanity"
npx sanity deploy
```

**When prompted:**
1. Select "Create new studio hostname" (use arrow keys)
2. Choose a hostname: `us-mechanical` or `usmechanical` (lowercase, no spaces)
3. Wait for deployment to complete (~30 seconds)

**You'll get a URL like:**
```
https://us-mechanical.sanity.studio
```

**Access your studio at this URL going forward.**

---

## 🔄 Vercel Deployment (Already Active)

Your studio is also on Vercel and auto-deploys when you push to GitHub.

**Access URLs:**
- With basePath: `https://sanity-henna.vercel.app/studio`
- Root: `https://sanity-henna.vercel.app`

**CORS Status:** ✅ Configured for:
- `https://sanity-henna.vercel.app`
- `https://*.vercel.app` (wildcard)
- `http://localhost:3333`

---

## 🔧 Local Development

```bash
cd "/Applications/US Mechanical Website/sanity"
npm run dev
```

Access at: `http://localhost:3333`

---

## 🎯 Best Practice Workflow

### For Daily Use:
1. **Edit content:** Use Sanity-hosted studio (`https://[your-hostname].sanity.studio`)
2. **Develop:** Use local studio (`npm run dev` → `http://localhost:3333`)
3. **Backup:** Vercel deployment auto-updates with code changes

### Updating the Studio:
1. Make changes to studio code locally
2. Test with `npm run dev`
3. Commit and push to GitHub → Vercel auto-deploys
4. Run `npx sanity deploy` → Updates Sanity hosting

---

## 🐛 Troubleshooting

### Issue: CORS Errors on Vercel Deployment
**Solution:** Already fixed! CORS is properly configured.

### Issue: Can't Access Sanity-Hosted Studio
**Solution:** Make sure you've run `npx sanity deploy` at least once.

### Issue: Studio Not Updating
**Solution:** 
- Vercel: Push to GitHub (auto-deploys)
- Sanity: Run `npx sanity deploy` again

---

## 📝 Configuration Files

- **Sanity Config:** `/Applications/US Mechanical Website/sanity/sanity.config.ts`
- **Vercel Config:** `/Applications/US Mechanical Website/sanity/vercel.json`
- **Project ID:** `3vpl3hho`
- **Dataset:** `production`

---

## 🔐 CORS Origins Configured

All these origins can access your Sanity project:
- `http://localhost:3333` (local development)
- `https://sanity-henna.vercel.app` (Vercel deployment)
- `https://*.vercel.app` (wildcard for all Vercel previews)
- `https://us-mechanicalllc.vercel.app` (main site)
- `https://us-mechanicalllc-sanity.vercel.app`

---

## 🎯 Next Steps

1. Run `npx sanity deploy` to set up Sanity hosting
2. Bookmark your `.sanity.studio` URL for daily use
3. Use local development for testing changes
4. Push to GitHub to auto-update Vercel deployment
