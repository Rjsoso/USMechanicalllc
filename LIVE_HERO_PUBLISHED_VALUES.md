# Live hero/header values (published Sanity)

This repo includes a helper script that prints the **published** (production dataset) hero + header values exactly as the website should be fetching them.

## Run

```bash
cd "sanity"
npm run -s print-hero-header
```

## Current output (captured)

```json
{
  "hero": {
    "_id": "heroSection",
    "_updatedAt": "2026-01-02T20:36:15Z",
    "backgroundUrl": "https://cdn.sanity.io/images/3vpl3hho/production/091af6955b1aeb202440f551459e8c5cd5a84789-2016x1134.jpg",
    "buttonLink": "#careers",
    "buttonText": "Apply Here",
    "carouselUrls": [
      "https://cdn.sanity.io/images/3vpl3hho/production/cab5ddd9e21487005205aa1f34010f132feec6b2-585x350.jpg"
    ],
    "headline": "Trusted Mechanical Contractors Since 1963",
    "subtext": null
  },
  "header": {
    "_id": "headerSection",
    "_updatedAt": "2026-01-20T20:27:58Z",
    "headerLogoUrl": "https://cdn.sanity.io/images/3vpl3hho/production/6f5344154524ea962ccc5fee5b3483aa8278cea3-1606x1068.png",
    "navLinksCount": 5
  }
}
```

## Important interpretation

- If **`carouselUrls` is non-empty**, the website uses the carousel images for the hero background (and `backgroundUrl` becomes a fallback).
- The **top-left site logo** is `headerSection.logo` (shown above as `headerLogoUrl`).

