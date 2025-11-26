# How to Create Documents in Sanity Studio

## The Problem
You can only see Portfolio Projects because those documents exist. Other sections (Hero, About, Services, etc.) don't show up because the documents don't exist yet.

## Solution: Create Documents by Clicking

### Step 1: Click on Each Section
1. Open Sanity Studio
2. Click on each section in the list:
   - "1. Header Section"
   - "2. Hero Section"  
   - "3. About & Safety Section"
   - "4. Company Stats"
   - "5. Our Services Section (CardSwap) ⭐"
   - "7. Contact Section"
   - "8. Company Information (Footer)"
   - "9. Form Settings"

### Step 2: Create the Document
When you click on a section:
- If the document doesn't exist, Sanity will show a "Create" button
- Click "Create" to create the document
- Fill in the fields
- Click "Publish" (important!)

### Step 3: Use Vision Tool to See All Documents
1. Click the **Vision** icon (eye) in the toolbar
2. Run this query to see ALL documents:
   ```
   *[]
   ```
3. This will show you what exists and what doesn't

## Quick Fix: Use Vision Tool to Create Documents

1. Open Vision tool
2. Run this query to create a document:
   ```groq
   *[_type == "heroSection"][0]
   ```
3. If it returns nothing, the document doesn't exist
4. Go back to the list and click "2. Hero Section" to create it

## Important Notes

- **Documents MUST be PUBLISHED** to appear on the website
- Draft documents won't show on the website
- After creating and publishing, the website will auto-update via webhook

## What Content to Add

Based on your website, you should create:

1. **Hero Section**: Headline, subtext, button text, background image, logo
2. **About & Safety**: About title/text, safety title/text, photos
3. **Our Services**: Section title, description text, service boxes, CardSwap services with images
4. **Company Info**: Name, logo, offices, email, phone, address
5. **Contact**: Contact form settings
6. **Company Stats**: Statistics numbers

Once you create and publish these documents, they'll appear in Sanity Studio and on your website!


