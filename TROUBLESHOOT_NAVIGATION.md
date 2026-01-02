# Troubleshooting Navigation Icons

## Problem
Navigation icons appear briefly (5 icons) then disappear or change to 3 identical icons.

## Root Cause
Your Sanity Header Section is either:
1. **Missing navLinks** - No navigation links configured in Sanity
2. **Incomplete navLinks** - Links missing required fields (label, icon, href, order)
3. **Wrong icon values** - Icon field doesn't match expected values

---

## Step 1: Check Browser Console

1. Open your website in Chrome/Firefox
2. Press `F12` to open Developer Tools
3. Click the **Console** tab
4. Reload the page (`Cmd+R` or `Ctrl+R`)
5. Look for these messages:

### What to Look For:

**If you see:**
```
🔍 Sanity Header Data: { logo: {...}, navLinks: null }
⚠️ No navLinks found in Sanity! Using fallback navigation.
⚠️ Using fallback navigation (5 icons)
```
**Problem:** No navLinks configured in Sanity
**Solution:** Go to Step 2 to add navLinks

---

**If you see:**
```
🔍 Sanity Header Data: { logo: {...}, navLinks: [{...}, {...}, {...}] }
📊 Nav Links from Sanity: [ {label: "...", icon: "...", ...}, ...]
✅ Using Sanity navLinks: [...]
  - Icon: "some_value", Label: "About"
⚠️ Icon type "some_value" not found, defaulting to "about" icon
```
**Problem:** Icon values don't match expected values
**Solution:** Go to Step 3 to fix icon values

---

## Step 2: Add Navigation Links in Sanity

1. Go to your Sanity Studio:
   **https://sanity-henna.vercel.app/structure**

2. Click on **"1. Header Section"**

3. Scroll down to **"Icon Navigation (Dock)"**

4. Click **"Add item"** to add navigation links

5. For each link, fill in:

### Example: About Link
- **Label**: `About`
- **Link Target**: `#about`
- **Icon**: Select `📋 About - For company info and details`
- **Display Order**: `0`

### Example: Safety Link
- **Label**: `Safety`
- **Link Target**: `#safety`
- **Icon**: Select `🛡️ Safety - For safety information`
- **Display Order**: `1`

### Example: Services Link
- **Label**: `Services`
- **Link Target**: `#services`
- **Icon**: Select `🔧 Services - For services and offerings`
- **Display Order**: `2`

### Example: Projects Link
- **Label**: `Projects`
- **Link Target**: `#portfolio`
- **Icon**: Select `🏢 Projects - For portfolio and projects`
- **Display Order**: `3`

### Example: Contact Link
- **Label**: `Contact`
- **Link Target**: `#contact`
- **Icon**: Select `📞 Contact - For contact information`
- **Display Order**: `4`

6. Click **"Publish"** when done

7. Wait 2-3 minutes for Vercel to rebuild (if webhook is configured)

8. Refresh your website with hard reload: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)

---

## Step 3: Fix Icon Values

The icon field must be **exactly** one of these values:
- `about`
- `safety`
- `services`
- `projects`
- `contact`

### Check Current Icon Values:

1. Open browser console (F12)
2. Look for the line: `  - Icon: "value", Label: "Label Name"`
3. Check if the icon value matches the list above

### Fix in Sanity:

1. Go to Sanity Studio: **https://sanity-henna.vercel.app/structure**
2. Click **"1. Header Section"**
3. Scroll to **"Icon Navigation (Dock)"**
4. For each link, click to expand it
5. **Re-select the Icon** from the dropdown (don't type it manually)
6. The dropdown shows:
   - 📋 About - For company info and details → value: `about`
   - 🛡️ Safety - For safety information → value: `safety`
   - 🔧 Services - For services and offerings → value: `services`
   - 🏢 Projects - For portfolio and projects → value: `projects`
   - 📞 Contact - For contact information → value: `contact`
7. Click **"Publish"**
8. Wait for rebuild and hard refresh browser

---

## Step 4: Verify It's Working

After publishing changes in Sanity:

1. Wait 2-3 minutes for Vercel rebuild (check: https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments)
2. Hard refresh your website: `Cmd+Shift+R` or `Ctrl+Shift+F5`
3. Open console (F12)
4. You should see:
   ```
   ✅ Using Sanity navLinks: [...]
     - Icon: "about", Label: "About"
     - Icon: "safety", Label: "Safety"
     - Icon: "services", Label: "Services"
     - Icon: "projects", Label: "Projects"
     - Icon: "contact", Label: "Contact"
   ```
5. No warning messages about icons not found
6. All 5 icons should display correctly with different icons

---

## Common Issues

### Issue: Icons Still Not Showing After Publishing

**Possible Causes:**
1. **Webhook not configured** - Vercel isn't rebuilding when you publish
   - See: [SANITY_WEBHOOK_SETUP.md](SANITY_WEBHOOK_SETUP.md)
2. **Browser cache** - Your browser is showing old cached version
   - Solution: Hard refresh (`Cmd+Shift+R` or `Ctrl+Shift+F5`)
3. **Vercel cache** - Vercel is serving cached version
   - Solution: Wait for webhook rebuild or manually redeploy

### Issue: Only 3 Icons Show (Instead of 5)

**Cause:** You only configured 3 navLinks in Sanity

**Solution:** 
- Add more navigation links in Sanity (see Step 2)
- Or this is intentional if you only want 3 icons

### Issue: All Icons Look the Same

**Cause:** Icon values in Sanity don't match expected values

**Solution:**
- Follow Step 3 to fix icon values
- Make sure you're selecting from the dropdown, not typing manually

### Issue: Icons Flash and Disappear

**Cause:** Sanity data is loading but has errors (empty array, wrong format)

**Solution:**
- Check browser console for specific error messages
- Follow Step 2 to properly configure navLinks

---

## Quick Test Checklist

- [ ] Browser console shows no errors
- [ ] Console shows: `✅ Using Sanity navLinks`
- [ ] Each icon logs with correct value (`about`, `safety`, etc.)
- [ ] No warnings about icons not found
- [ ] All icons display with different visuals
- [ ] Clicking each icon scrolls to correct section

---

## Need More Help?

If you've followed all steps and it still doesn't work:

1. **Take a screenshot of:**
   - Your browser console output
   - Your Sanity Header Section (with navLinks visible)

2. **Check:**
   - Vercel deployments: https://vercel.com/rjsosos-projects/us-mechanicalllc/deployments
   - Latest deployment succeeded (green checkmark)
   - Deployment was triggered recently

3. **Verify webhook:**
   - Follow: [SANITY_WEBHOOK_SETUP.md](SANITY_WEBHOOK_SETUP.md)
   - Make sure webhook is configured and firing

---

## Technical Details

### Expected Sanity Data Structure:

```json
{
  "logo": { /* image reference */ },
  "navLinks": [
    {
      "label": "About",
      "href": "#about",
      "icon": "about",
      "order": 0
    },
    {
      "label": "Safety",
      "href": "#safety",
      "icon": "safety",
      "order": 1
    },
    // ... more items
  ]
}
```

### Icon Mapping:

| Icon Value | Visual | Use For |
|-----------|--------|---------|
| `about` | 📋 Document icon | Company info, About section |
| `safety` | 🛡️ Shield icon | Safety information |
| `services` | 🔧 Wrench icon | Services, offerings |
| `projects` | 🏢 Building icon | Portfolio, projects |
| `contact` | 📞 Phone icon | Contact information |

### Fallback Behavior:

- **If no navLinks in Sanity:** Shows 5 default icons (About, Safety, Services, Projects, Contact)
- **If navLinks exist:** Uses data from Sanity
- **If icon value doesn't match:** Defaults to "about" icon (📋)

