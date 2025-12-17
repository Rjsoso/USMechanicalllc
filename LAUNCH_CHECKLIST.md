# Website Launch Checklist - Go Live on All Domains

## Overview
This guide covers everything needed to launch your U.S. Mechanical website and make it live on custom domains.

---

## Prerequisites Checklist

### 1. GitHub Repository
- [x] Repository exists: `https://github.com/rjsoso/USMechanicalllc.git`
- [x] Code is pushed to `main` branch
- [x] All latest changes are committed

### 2. Vercel Project Setup
- [x] Project exists: `us-mechanicalllc`
- [ ] **Verify Root Directory**: Set to `react-site` in Vercel Dashboard
- [ ] **Verify Build Settings**:
  - Framework: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

**Check**: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings

### 3. Environment Variables (Vercel Dashboard)

Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/environment-variables

**Required Variables:**
- [ ] `VITE_SANITY_PROJECT_ID` = `3vpl3hho` (already hardcoded, but good to have)
- [ ] `VITE_SANITY_DATASET` = `production` (already hardcoded, but good to have)

**Optional (for Admin features):**
- [ ] `VITE_SANITY_WRITE_TOKEN` = Your Sanity write token (only if using Admin panel)

**How to add:**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Click "Add New"
3. Add each variable for Production, Preview, and Development
4. Save

---

## Domain Configuration

### Step 1: Add Custom Domain in Vercel

1. Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/domains
2. Click **"Add Domain"**
3. Enter your domain(s):
   - Primary: `Us-Mechanicalllc.com` (your main domain)
   - WWW: `www.Us-Mechanicalllc.com` (recommended - redirects to main)
   - Note: Vercel will handle case-insensitive matching, but use the exact format you own
4. Click **"Add"**

### Step 2: Configure DNS Records

Vercel will provide DNS instructions. Typically you need:

#### Option A: Use Vercel Nameservers (Recommended)
1. In your domain registrar (GoDaddy, Namecheap, etc.):
   - Change nameservers to Vercel's nameservers
   - Vercel will show you the exact nameservers to use
   - Example: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`

#### Option B: Add DNS Records (If keeping current nameservers)

**For Root Domain (Us-Mechanicalllc.com):**
- Type: `A`
- Name: `@` or blank
- Value: `76.76.21.21` (Vercel's IP - check Vercel dashboard for current IP)
- Note: Vercel will show you the exact IP address to use

**For WWW Subdomain (www.Us-Mechanicalllc.com):**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com` (or what Vercel shows in dashboard)
- Note: Vercel will provide the exact CNAME value after you add the domain

**For Other Subdomains:**
- Type: `CNAME`
- Name: `subdomain` (e.g., `staging`, `www`)
- Value: `cname.vercel-dns.com`

### Step 3: Wait for DNS Propagation
- DNS changes can take 24-48 hours to propagate globally
- Use https://dnschecker.org to check propagation status
- Vercel will show domain status in Dashboard

### Step 4: SSL Certificate (Automatic)
- ✅ Vercel automatically provisions SSL certificates
- ✅ HTTPS will be enabled automatically once DNS is configured
- ✅ No manual SSL setup needed

---

## Sanity CMS Setup

### 1. Sanity Studio Deployment
- [x] Sanity Studio URL: `https://sanity-henna.vercel.app`
- [ ] **Alternative**: Deploy to Sanity hosting (easier):
  ```bash
  cd sanity
  npx sanity deploy
  ```
  This gives you: `https://3vpl3hho.sanity.studio`

### 2. Sanity Content
- [ ] Create all required documents in Sanity Studio:
  - [ ] Header Section (logo)
  - [ ] Hero Section
  - [ ] About & Safety Section
  - [ ] Company Stats
  - [ ] Our Services Section
  - [ ] Portfolio Categories & Projects
  - [ ] Careers Section
  - [ ] Contact Section
  - [ ] Company Info (Footer)
  - [ ] Card Navigation

### 3. Sanity Webhook (Auto-rebuild on content changes)
- [ ] Create Vercel Deploy Hook:
  1. Go to: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks
  2. Click "Create Hook"
  3. Name: `Sanity Content Updates`
  4. Branch: `main`
  5. Copy the hook URL

- [ ] Add Webhook in Sanity:
  1. Go to: https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks
  2. Click "Create webhook"
  3. Name: `Vercel Deploy`
  4. URL: Paste the Vercel hook URL
  5. Dataset: `production`
  6. Trigger on: `create`, `update`, `delete`
  7. Save

---

## Pre-Launch Testing

### 1. Test Vercel Deployment
- [ ] Visit: `https://us-mechanicalllc.vercel.app` (your Vercel preview URL)
- [ ] Verify site works correctly before adding custom domain
- [ ] Verify all sections load correctly
- [ ] Test navigation (CardNav menu)
- [ ] Test smooth scrolling to sections
- [ ] Check images load from Sanity
- [ ] Test responsive design (mobile/tablet/desktop)

### 2. Test Sanity Integration
- [ ] Verify content loads from Sanity
- [ ] Test editing content in Sanity Studio
- [ ] Verify webhook triggers Vercel rebuild
- [ ] Check content updates appear on site

### 3. Test All Sections
- [ ] Hero section displays correctly
- [ ] About & Safety section shows images
- [ ] Company Stats animate correctly
- [ ] Services section displays cards
- [ ] Portfolio shows projects
- [ ] Careers section displays
- [ ] Contact form works (if applicable)
- [ ] Footer displays company info

### 4. Performance Check
- [ ] Run Lighthouse audit (Chrome DevTools)
- [ ] Check Core Web Vitals
- [ ] Verify images are optimized
- [ ] Check page load speed

---

## Domain-Specific Steps

### For Multiple Domains

If you want the site on multiple domains (e.g., `Us-Mechanicalllc.com`, `usmechanical.com`):

1. **Add each domain in Vercel:**
   - Go to Project Settings → Domains
   - Add each domain separately
   - Vercel will provide DNS instructions for each

2. **Configure DNS for each domain:**
   - Follow DNS setup steps above for each domain
   - Each domain needs its own DNS records

3. **Redirects (Optional):**
   - Set up redirects in Vercel if you want one domain to redirect to another
   - Go to: Project Settings → Redirects

---

## Post-Launch Checklist

### 1. Verify Live Site
- [ ] Visit: `https://Us-Mechanicalllc.com` (your custom domain)
- [ ] Visit: `https://www.Us-Mechanicalllc.com` (should redirect or work)
- [ ] Verify HTTPS is working (green lock icon)
- [ ] Test all functionality
- [ ] Check mobile responsiveness
- [ ] Verify domain shows correct content (not Vercel default page)

### 2. SEO Setup
- [ ] Add meta tags (title, description)
- [ ] Set up Google Search Console
- [ ] Submit sitemap.xml (if generated)
- [ ] Verify robots.txt

### 3. Analytics (Optional)
- [ ] Set up Google Analytics
- [ ] Add tracking code to site
- [ ] Verify tracking works

### 4. Monitoring
- [ ] Set up Vercel monitoring/alerts
- [ ] Monitor error logs
- [ ] Check deployment status regularly

---

## Quick Reference Links

**Vercel Dashboard:**
- Project: https://vercel.com/rjsosos-projects/us-mechanicalllc
- Settings: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings
- Domains: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/domains
- Environment Variables: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/environment-variables
- Deploy Hooks: https://vercel.com/rjsosos-projects/us-mechanicalllc/settings/deploy-hooks

**Sanity:**
- Project: https://www.sanity.io/manage/personal/project/3vpl3hho
- Studio: https://sanity-henna.vercel.app or https://3vpl3hho.sanity.studio
- Webhooks: https://www.sanity.io/manage/personal/project/3vpl3hho/api/webhooks

**GitHub:**
- Repository: https://github.com/rjsoso/USMechanicalllc

---

## Common Issues & Solutions

### Issue: Domain not resolving
**Solution:**
- Check DNS records are correct
- Wait 24-48 hours for DNS propagation
- Verify nameservers are correct (if using Vercel nameservers)

### Issue: SSL certificate not issued
**Solution:**
- Wait for DNS to fully propagate
- Vercel automatically issues SSL once DNS is verified
- Can take up to 24 hours after DNS is correct

### Issue: Content not updating
**Solution:**
- Check Sanity webhook is configured
- Verify Vercel deploy hook URL is correct
- Manually trigger deployment if needed

### Issue: Build fails
**Solution:**
- Check Root Directory is set to `react-site`
- Verify environment variables are set
- Check build logs in Vercel Dashboard

---

## Summary

**Minimum Requirements to Go Live:**
1. ✅ Code pushed to GitHub
2. ✅ Vercel project configured correctly
3. ✅ Domain added in Vercel Dashboard
4. ✅ DNS records configured
5. ✅ Sanity content populated
6. ✅ Testing completed

**Estimated Time:**
- DNS Configuration: 5-10 minutes
- DNS Propagation: 24-48 hours
- SSL Certificate: Automatic (24 hours after DNS)
- Total: ~2-3 days for full propagation

**Once DNS propagates, your site will be live!**
