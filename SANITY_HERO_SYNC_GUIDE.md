# Sanity Hero Sync Guide (make Studio match live site)

If Sanity Studio doesn’t appear to match the live website, the fastest way to remove ambiguity is to **inspect the published singleton documents** and understand which field “wins” on the website.

## 1) Confirm the published values (source of truth)

Run:

```bash
cd "sanity"
npm run -s print-hero-header
```

This prints the published `heroSection` + `headerSection` values for the `production` dataset.

## 2) Understand which hero background is actually used

The website’s logic is:

- If `heroSection.carouselImages` has at least one valid image → **carousel is used**
- Else → `heroSection.backgroundImage` is used

So if you set a `backgroundImage` in Studio but **also** have carousel images set, you’ll still see the carousel on the site.

## 3) Fix “Studio looks wrong” cases

### Case A: Studio shows a “Background Image” you don’t see on the site

- Check if `carouselImages` is populated.
- If you want the background image to be used, **clear `carouselImages`** (and publish).

### Case B: “Hero logo is empty” but you do see a logo on the site

That logo is the **Header** logo.

- **Header logo (top-left)** is `headerSection.logo`
 
There is no separate “Hero logo” field anymore; this avoids confusion and keeps the header as the single logo source.

## 4) Publish + verify

After publishing, hard refresh the site (`Cmd+Shift+R`) and wait ~30–60 seconds (the site uses Sanity CDN via `useCdn: true`).

