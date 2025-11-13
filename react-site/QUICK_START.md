# Quick Start Guide: Connect Sanity CMS

## Your Sanity Studio
**URL**: https://us-mechanical.sanity.studio

## Step 1: Get Project ID
1. Go to https://www.sanity.io/manage
2. Click "us-mechanical" project
3. Copy the **Project ID** (e.g., `abc123xyz`)

## Step 2: Add Environment Variable
Create `.env` file in `react-site/`:

```bash
VITE_SANITY_PROJECT_ID=paste-your-project-id-here
VITE_SANITY_DATASET=production
```

## Step 3: Add Schemas to Sanity Studio

The schema files are ready in `/sanity/schemas/`:
- ✅ `hero.js`
- ✅ `about.js`
- ✅ `safety.js`
- ✅ `recognition.js`

**If your Sanity Studio is in a different location**, copy these files to your studio's `schemas/` folder and make sure they're registered in `sanity/schemas/index.js`.

## Step 4: Add Content
1. Go to https://us-mechanical.sanity.studio
2. Create documents:
   - **Hero** (1 document)
   - **About** (1 document)
   - **Safety** (1 document)
   - **Recognition** (multiple documents - one per project)

## Step 5: Restart Dev Server
```bash
npm run dev
```

The website will now load content from Sanity! 🎉

## How It Works
- ✅ **With Sanity**: Content loads from CMS
- ✅ **Without Sanity**: Falls back to `content.json` / localStorage
- ✅ **Admin Panel**: Still works for quick edits via localStorage

