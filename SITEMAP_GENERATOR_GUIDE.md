# Dynamic Sitemap Generator Guide

## Overview

Your sitemap is now generated automatically from Sanity CMS. Whenever you add new content (services, portfolio projects, etc.), simply regenerate the sitemap and Google will discover your new pages.

---

## How to Use

### Generate Sitemap

Whenever you add or update content in Sanity:

```bash
cd "/Applications/US Mechanical Website/react-site"
npm run generate-sitemap
```

This will:
1. Query all content from Sanity
2. Generate a fresh `sitemap.xml` file
3. Include all services, portfolio categories, and projects
4. Exclude incomplete content (projects without titles)

---

## When to Regenerate

Run the generator after:
- ✅ Adding new services
- ✅ Creating new portfolio categories
- ✅ Publishing new portfolio projects
- ✅ Updating service slugs
- ✅ Any major content changes

---

## After Regenerating

### 1. Review the sitemap
Check `react-site/public/sitemap.xml` to verify all URLs are correct

### 2. Commit and Push
```bash
git add react-site/public/sitemap.xml
git commit -m "Update sitemap with latest content from Sanity"
git push
```

### 3. Re-submit to Google (if URLs changed)
- Go to Google Search Console → Sitemaps
- If you added/removed pages, Google will auto-detect on next crawl
- Or manually re-submit: Remove old sitemap, then add `sitemap.xml` again

---

## Current Status

**Total URLs**: 15

**Breakdown:**
- Core pages: 2 (home, contact)
- Service pages: 5
- Portfolio categories: 6
- Portfolio projects: 2 (4 incomplete projects excluded)

---

## Incomplete Projects

The following projects are missing titles/categories and won't appear in sitemap:
- 4 untitled projects (complete these in Sanity Studio)

**To fix:**
1. Open Sanity Studio when it's back online
2. Find these portfolio projects
3. Add titles and assign categories
4. Publish the changes
5. Run `npm run generate-sitemap` again

---

## Technical Details

**Script location:** `react-site/generate-sitemap.mjs`

**How it works:**
1. Connects to Sanity via API
2. Queries all published content
3. Filters out incomplete items
4. Generates XML following sitemap.org standards
5. URL-encodes slugs with spaces/special characters
6. Sets appropriate priorities and change frequencies

**Dependencies:**
- `@sanity/client` (already installed)
- Node.js (already configured)

---

## Automation Ideas (Future)

### Option 1: Git Hook
Run automatically before every commit:
```bash
# Add to .git/hooks/pre-commit
npm run generate-sitemap
git add react-site/public/sitemap.xml
```

### Option 2: Build Integration
Add to Vercel build process:
```json
// vercel.json
{
  "buildCommand": "npm run generate-sitemap && npm run build"
}
```

### Option 3: Sanity Webhook
Trigger regeneration automatically when Sanity content changes (requires server endpoint)

---

## Troubleshooting

### "Cannot find module @sanity/client"
```bash
cd react-site
npm install
```

### "Insufficient permissions"
The read-only token in `.env` is fine for generating sitemaps (no write access needed)

### "0 services found"
Check that:
- Sanity is accessible
- Project ID is correct (3vpl3hho)
- Dataset is 'production'
- Content is published (not in draft)

---

## Support

If you have questions or issues:
1. Check the console output for error messages
2. Verify Sanity Studio is accessible
3. Ensure all content is published
4. Check that service slugs don't contain invalid characters

---

**Last Updated:** January 20, 2026  
**Sitemap URL:** https://us-mechanicalllc.vercel.app/sitemap.xml
