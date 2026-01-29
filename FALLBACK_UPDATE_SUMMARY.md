# Fallback Content Update Summary

**Date:** January 29, 2026  
**Purpose:** Ensure all hardcoded fallback values match current Sanity CMS production content

## Updates Completed

### 1. HeroSection.jsx ✅
**Location:** `react-site/src/components/HeroSection.jsx` (lines 7-17)

**Updated Values:**
- `buttonText`: '' → 'REQUEST A QUOTE'
- `secondButtonText`: '' → 'APPLY TO WORK WITH US'
- `secondButtonLink`: '' → '#careers'
- Added timestamp comment: "Last updated: 2026-01-29"

### 2. Footer.jsx ✅
**Location:** `react-site/src/components/Footer.jsx` (lines 7-20)

**Updated Values:**
- `address`: Single line → Multi-line format with newline
- `licenseInfo`: null → 'Licensed in UT, NV, CA, AZ, WY'
- `footerCompanyDescription`: Updated to include "primarily throughout Utah & Nevada"
- Added timestamp comment: "Last updated: 2026-01-29"

### 3. AboutAndSafety.jsx ✅
**Location:** `react-site/src/components/AboutAndSafety.jsx` (lines 34-48)

**Updated Values:**
- `aboutTitle`: 'About U.S. Mechanical' → 'ABOUT'
- `aboutText`: Completely updated with current production content including bonding capacity details ($35M single project, $150M+ aggregate)
- `safetyText`: Updated with more specific details about safety programs and OSHA/MSHA accreditation
- Added timestamp comment: "Last updated: 2026-01-29"

### 4. About.jsx ✅
**Location:** `react-site/src/pages/About.jsx` (lines 35-48)

**Updated Values:**
- Same updates as AboutAndSafety.jsx to maintain consistency
- `aboutTitle`: 'About U.S. Mechanical' → 'ABOUT'
- Updated `aboutText` and `safetyText` to match current production content

### 5. DrawerMenu.jsx ✅
**Location:** `react-site/src/components/DrawerMenu.jsx` (lines 16-39)

**Updated Values:**
- All section labels now uppercase: 'Company' → 'COMPANY', 'Services' → 'SERVICES', 'Connect' → 'CONNECT'
- Updated hrefs to use hash anchors instead of full paths:
  - '/about' → '#about'
  - '/about#safety' → '#safety'
  - '/#services' → '#services'
  - '/portfolio' → '#portfolio'
  - '/careers' → '#careers'
  - '/contact' → '#contact'
- 'Careers' → 'Careers at US Mechanical'
- Changed all `ariaLabel` values from descriptive text to `null` (matches Sanity)
- Added timestamp comment: "Last updated: 2026-01-29"

### 6. Careers.jsx ✅
**Location:** `react-site/src/components/Careers.jsx` (lines 47-78)

**Updated Values:**
- `qualifications`: Removed "(Required)" and "(Preferred)" suffixes from item text (handled separately in code)
- `indeedUrl`: 'https://www.indeed.com/cmp/U.s.-Mechanical,-LLC/jobs' → 'https://www.indeed.com/cmp/US-Mechanical'
- `submissionEmail`: 'admin@usmechanicalllc.com' → 'info@usmechanicalllc.com'
- Added timestamp comment: "Last updated: 2026-01-29"

### 7. ErrorBoundary.jsx ✅
**Location:** `react-site/src/components/ErrorBoundary.jsx` (line 141)

**Status:** No update needed - already using correct email (info@usmechanicalllc.com)

## Export Script Created ✅

**Location:** `sanity/scripts/exportFallbacks.mjs`

**Purpose:** 
- Fetches current published Sanity content
- Generates `fallbacks.json` with production data
- Can be re-run anytime to sync fallbacks with CMS

**Usage:**
```bash
cd sanity
node scripts/exportFallbacks.mjs
```

**Output:** `sanity/scripts/fallbacks.json`

## Key Benefits

1. **Consistency:** Fallbacks now exactly match production Sanity content
2. **No Outdated Content:** Users will never see old placeholder text when CMS is unavailable
3. **Easy Maintenance:** Script can be re-run to refresh fallbacks whenever content is updated
4. **Documentation:** All fallbacks now include "Last updated" timestamps
5. **Offline Resilience:** Website maintains full functionality even if Sanity is unreachable

## Maintenance Guide

### When to Update Fallbacks

Update fallbacks whenever you make significant changes to:
- Hero section headlines or buttons
- Company description or contact information
- About/Safety section content
- Navigation structure
- Career posting details

### How to Update

1. Make your changes in Sanity CMS and publish them
2. Run the export script:
   ```bash
   cd sanity
   node scripts/exportFallbacks.mjs
   ```
3. Review the generated `fallbacks.json`
4. Update the corresponding React component fallback constants
5. Add/update the "Last updated" comment with current date

### Files with Fallback Data

| File | Fallback Constant | Lines |
|------|------------------|-------|
| `HeroSection.jsx` | `defaultHeroData` | 7-17 |
| `Footer.jsx` | `FALLBACK_DATA` | 7-20 |
| `AboutAndSafety.jsx` | `defaultData` | 34-48 |
| `About.jsx` | `defaultData` | 35-48 |
| `DrawerMenu.jsx` | `defaultSections` | 16-39 |
| `Careers.jsx` | Multiple variables | 47-78 |
| `ErrorBoundary.jsx` | Hardcoded email | 141 |

## Testing

All fallback values have been verified to match the current production Sanity content as of January 29, 2026.

To test fallbacks:
1. Temporarily disable Sanity API access or use offline mode
2. Navigate through the website
3. Verify all content displays correctly without "Loading..." or placeholder text

## Notes

- Loading states ("Loading services...", "Loading careers...") remain unchanged as they are appropriate temporary states
- Empty states ("No portfolio categories available yet.") remain unchanged as they handle genuine empty data scenarios
- All fallbacks maintain the same data structure and format as live Sanity data
