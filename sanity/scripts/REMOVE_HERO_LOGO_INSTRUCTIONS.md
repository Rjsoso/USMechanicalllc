# How to Remove the Logo Field from Hero Section

## Problem
The Hero Section in Sanity Studio shows a "Logo Image" field that shouldn't be there. This field exists in the stored data but is not in the schema definition.

## Solution: Remove via Sanity Studio UI

Since the field exists in the data, you can remove it directly through the Sanity Studio interface:

### Step 1: Open Hero Section in Sanity Studio
1. Go to http://localhost:3333 (or your Sanity Studio URL)
2. Click on "2. Hero Section" in the left sidebar

### Step 2: Delete the Logo Image
1. Find the "Logo Image" field
2. If there's an image uploaded, click the **X** or **Delete** button to remove it
3. The field will show as empty

### Step 3: Save and Publish
1. Click **Publish** button at the bottom
2. This saves the document without the logo field data

### Step 4: Verify the Field is Gone
1. **Hard refresh** your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Navigate back to Hero Section
3. The "Logo Image" field should now be **completely gone** from the UI

## Why This Works

Sanity Studio only shows fields that:
- Are defined in the schema, OR
- Exist in the stored data

Once you delete the logo image and publish, the field no longer has data, so Sanity Studio will stop displaying it.

## Alternative: Use Migration Script with Write Token

If you prefer to use the automated script (`removeHeroLogo.mjs`), you need to:

1. Get a write token from Sanity.io:
   - Go to https://sanity.io/manage
   - Select your project
   - Go to API settings
   - Create a token with "Editor" or "Administrator" permissions

2. Set the token as an environment variable:
   ```bash
   export SANITY_WRITE_TOKEN="your-token-here"
   ```

3. Run the migration script:
   ```bash
   cd /Applications/US\ Mechanical\ Website/sanity
   node scripts/removeHeroLogo.mjs
   ```

## Confirmation

After either method, you should verify:
- ✅ Hero Section in Sanity Studio no longer shows "Logo Image" field
- ✅ Website hero section still displays correctly (it will - the logo was never used)
- ✅ Only these fields remain in Hero Section:
  - Background Image
  - Carousel Images
  - Headline
  - Subtext
  - Button Text
  - Button Link
