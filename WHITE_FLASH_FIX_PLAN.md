# Plan to Eliminate White Flash on Mobile Loading

## Problem
White backgrounds (Portfolio's `bg-white`, Careers section) become visible during the 0.15s fade transition when the loading overlay disappears, causing a visible flash on mobile devices.

## Root Cause
- Loading overlay (`body::before`) fades out over 0.15s with `opacity: 0` transition
- White sections render immediately and are visible through the fading overlay
- Dark overlay (#1a1a1a) becomes semi-transparent during fade, revealing white content beneath

## Recommended Solution: Approach #2
**Keep white sections hidden with `opacity: 0` until overlay is completely gone**

### Implementation Steps

#### 1. Modify `react-site/index.html` (Critical CSS)

**Add CSS rule to hide white sections during loading:**
```css
/* Hide white sections until overlay is completely removed */
body:not(.loaded-complete) [class*="bg-white"],
body:not(.loaded-complete) .bg-white {
  opacity: 0 !important;
  visibility: hidden !important;
}

/* Show white sections after overlay is gone */
body.loaded-complete [class*="bg-white"],
body.loaded-complete .bg-white {
  opacity: 1 !important;
  visibility: visible !important;
  transition: opacity 0.1s ease-in, visibility 0.1s ease-in;
}
```

**Location:** Add after line 149 (after `body.loaded-complete::before` rule)

#### 2. Modify `react-site/src/main.jsx` (Loading Logic)

**Update timing to ensure white sections stay hidden:**
```javascript
// Mark body as loaded after React renders and content is in DOM
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
    // Remove overlay completely after fade completes
    // Then reveal white sections immediately after
    setTimeout(() => {
      document.body.classList.add('loaded-complete');
    }, 150); // Match transition duration (0.15s = 150ms)
  });
});
```

**Change:** Line 43 - Update timeout from `200` to `150` to match CSS transition duration

---

## Alternative Solutions

### Alternative #1: Eliminate Fade Transition (Instant Removal)
**Pros:** Simplest, no flash possible  
**Cons:** Abrupt transition, less polished UX

**Changes:**
- `index.html` line 143: Remove `transition: opacity 0.15s ease-out;`
- `main.jsx` line 42: Change timeout to `0` or remove `loaded` class entirely

### Alternative #3: Make Fade Imperceptible (1-2ms)
**Pros:** Maintains transition logic, virtually instant  
**Cons:** Still technically visible, may cause jank

**Changes:**
- `index.html` line 143: Change `transition: opacity 0.15s ease-out;` to `transition: opacity 0.001s ease-out;`
- `main.jsx` line 42: Change timeout to `5` (1ms + buffer)

### Alternative #4: Secondary Overlay for White Sections
**Pros:** Most control, can fade independently  
**Cons:** More complex, additional DOM/CSS overhead

**Changes:**
- Add `body::after` pseudo-element with white background
- Target white sections specifically with higher z-index overlay
- Fade out after main overlay completes

---

## Files to Modify

1. **react-site/index.html**
   - Add CSS rules to hide/show white sections (lines ~150-160)
   - Optionally adjust transition timing (line 143)

2. **react-site/src/main.jsx**
   - Adjust timeout to match transition duration (line 42-43)

## Testing Checklist

- [ ] Test on mobile device (iOS Safari, Chrome Android)
- [ ] Verify no white flash during page load
- [ ] Confirm white sections appear smoothly after overlay removal
- [ ] Check that dark sections remain visible throughout
- [ ] Verify no layout shift when white sections appear
- [ ] Test on slow network connection (throttled)
- [ ] Test page refresh and navigation

## Implementation Priority

**Recommended:** Approach #2 (Hide white sections until overlay gone)
- Cleanest solution
- Maintains smooth UX
- Minimal code changes
- No performance impact
