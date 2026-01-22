# Hero + Logo: Source of Truth (Sanity → Website)

This repo has **two different “logo” concepts** and multiple background/slider concepts. This doc maps each visual on `https://us-mechanicalllc.vercel.app/` to its Sanity document + field(s).

## Header (top-left logo + dock nav)

- **Top-left logo (plaque)**: Sanity document **`headerSection`** → field **`logo`**
  - Frontend fetch: `react-site/src/components/Header.jsx`
  - Sanity Studio singleton: `sanity/deskStructure.ts` (“1. Header Section”)

## Hero (full-screen background + headline + optional hero-logo)

- **Hero background (single image)**: Sanity document **`heroSection`** → field **`backgroundImage`**
- **Hero background (carousel)**: Sanity document **`heroSection`** → field **`carouselImages[][].image`**
  - The website prefers **carousel** when `carouselImages` has at least one valid image; otherwise it uses `backgroundImage`.

Frontend component: `react-site/src/components/HeroSection.jsx`  
Sanity Studio singleton: `sanity/deskStructure.ts` (“2. Hero Section”)

## About section (carousel next to About text)

- **About carousel images**: Sanity document **`aboutAndSafety`** → field **`aboutPhotos[]`**
  - Fallback: `aboutAndSafety.photo1`

Frontend component: `react-site/src/components/AboutAndSafety.jsx`

## Why Studio can look “out of sync” with the website

Common causes:

- You are viewing a different Studio deployment than the one configured for project `3vpl3hho` / dataset `production`.
- You’re editing a **draft** or a **different document** (not the singleton `_id: "heroSection"` / `_id: "headerSection"`).
- You’re editing the “hero logo” expecting it to affect the header logo (or vice versa).
- CDN caching (`useCdn: true`) can delay updates briefly; hard refresh after publishing.

