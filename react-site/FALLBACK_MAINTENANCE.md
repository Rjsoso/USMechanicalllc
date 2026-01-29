# Fallback Content Maintenance Guide

## Overview

This website uses fallback values throughout components to ensure the site remains functional even when Sanity CMS is unavailable. This guide explains how to keep these fallback values synchronized with your production content.

## Why Fallbacks Matter

Fallback values are displayed when:
- Sanity CMS is temporarily unavailable
- Network connection is lost
- API rate limits are exceeded
- Browser is offline

Having current fallbacks ensures users never see outdated placeholder content.

## When to Update Fallbacks

Update fallbacks whenever you make significant content changes to:

- ✅ Hero section headlines or call-to-action buttons
- ✅ Company contact information (address, phone, email)
- ✅ About Us or Safety & Risk Management text
- ✅ Navigation menu structure
- ✅ Career posting details
- ✅ Footer information

## How to Update Fallbacks

### Step 1: Make Changes in Sanity CMS

1. Log into Sanity Studio
2. Make your content changes
3. **Publish** all changes (drafts won't be exported)

### Step 2: Export Current Production Content

```bash
cd sanity
node scripts/exportFallbacks.mjs
```

This will:
- Fetch all current published content from Sanity
- Generate `sanity/scripts/fallbacks.json` with production values
- Display a summary of exported content

### Step 3: Update React Components

Using the generated `fallbacks.json` as reference, update the fallback constants in these files:

| Component | File Path | Constant Name | What to Update |
|-----------|-----------|---------------|----------------|
| Hero Section | `src/components/HeroSection.jsx` | `defaultHeroData` | Headlines, button text |
| Footer | `src/components/Footer.jsx` | `FALLBACK_DATA` | Contact info, hours |
| About/Safety | `src/components/AboutAndSafety.jsx` | `defaultData` | Company info, safety text |
| About Page | `src/pages/About.jsx` | `defaultData` | Same as above |
| Navigation | `src/components/DrawerMenu.jsx` | `defaultSections` | Menu structure |
| Careers | `src/components/Careers.jsx` | Multiple variables | Job postings |
| Error Pages | `src/components/ErrorBoundary.jsx` | Hardcoded email | Contact email |

### Step 4: Add Timestamp

Update or add the "Last updated" comment:

```javascript
// Last updated: 2026-01-29
const defaultHeroData = {
  // ... your fallback values
}
```

### Step 5: Test

1. Temporarily disconnect from network or disable Sanity API
2. Navigate through your website
3. Verify all content displays correctly
4. Ensure no "Loading..." placeholders remain visible

## Quick Reference: File Locations

```
react-site/
├── src/
│   ├── components/
│   │   ├── HeroSection.jsx        (lines 7-17)
│   │   ├── Footer.jsx             (lines 7-20)
│   │   ├── AboutAndSafety.jsx     (lines 34-48)
│   │   ├── DrawerMenu.jsx         (lines 16-39)
│   │   ├── Careers.jsx            (lines 47-78)
│   │   └── ErrorBoundary.jsx      (line 141)
│   └── pages/
│       └── About.jsx              (lines 35-48)
```

## Example: Updating Hero Section

```javascript
// BEFORE (outdated)
const defaultHeroData = {
  headline: 'Old Headline',
  buttonText: '',
  // ...
}

// AFTER (current)
// Last updated: 2026-01-29
const defaultHeroData = {
  headline: 'Trusted Mechanical Contractors Since 1963',
  buttonText: 'REQUEST A QUOTE',
  // ...
}
```

## Automated Script Details

The `exportFallbacks.mjs` script:

- **Location:** `sanity/scripts/exportFallbacks.mjs`
- **Purpose:** Exports current Sanity content as structured fallback data
- **Output:** `sanity/scripts/fallbacks.json`
- **No Auth Required:** Uses public read-only API access

### Generated JSON Structure

```json
{
  "generatedAt": "2026-01-29T22:59:26.910Z",
  "hero": { ... },
  "footer": { ... },
  "about": { ... },
  "drawer": { ... },
  "careers": { ... }
}
```

## Best Practices

1. **Update Regularly:** Update fallbacks whenever content changes significantly
2. **Test Offline:** Always test in offline mode after updating
3. **Keep Timestamps:** Maintain "Last updated" comments for tracking
4. **Version Control:** Commit fallback updates with clear messages
5. **Document Changes:** Note what was updated in commit messages

## Common Issues

### Issue: Export script fails with ENOTFOUND error
**Solution:** Ensure you have network access and Sanity project ID is correct

### Issue: Fallback values don't match production
**Solution:** Make sure you published (not just saved as draft) in Sanity before exporting

### Issue: Script generates empty or null values
**Solution:** Check that the Sanity document exists and is published

## Support

For questions or issues:
- Review the full summary: `FALLBACK_UPDATE_SUMMARY.md`
- Check Sanity documentation: https://www.sanity.io/docs
- Contact your development team

---

**Last Updated:** January 29, 2026
**Script Version:** 1.0
