# Sanity CMS Setup Guide

## Step 1: Initialize Sanity

```bash
npm create sanity@latest
```

**During setup, choose:**
- **Output path**: `sanity`
- **Project name**: `us-mechanical` (or your preference)
- **Dataset**: `production`
- **Template**: `Blank (schema)`

## Step 2: Add Schemas

After Sanity is initialized, you'll have a `sanity` folder. Add these schemas to `sanity/schemas/`:

### `sanity/schemas/hero.js`
```javascript
export default {
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
    },
    {
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
}
```

### `sanity/schemas/about.js`
```javascript
export default {
  name: 'about',
  title: 'About Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'text',
      title: 'Text',
      type: 'text',
    },
  ],
}
```

### `sanity/schemas/safety.js`
```javascript
export default {
  name: 'safety',
  title: 'Safety Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'text',
      title: 'Text',
      type: 'text',
    },
  ],
}
```

### `sanity/schemas/recognition.js`
```javascript
export default {
  name: 'recognition',
  title: 'Recognition Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
    },
    {
      name: 'award',
      title: 'Award/Certification',
      type: 'string',
    },
  ],
}
```

## Step 3: Register Schemas

In `sanity/schemas/index.js`, add:
```javascript
import hero from './hero'
import about from './about'
import safety from './safety'
import recognition from './recognition'

export const schemaTypes = [hero, about, safety, recognition]
```

## Step 4: Deploy Studio

```bash
cd sanity
sanity deploy
```

This will give you a URL like: `https://your-project.sanity.studio`

## Step 5: Get Project ID

1. Go to https://www.sanity.io/manage
2. Select your project
3. Copy the Project ID

## Step 6: Configure Environment Variables

Create `.env` file:
```
VITE_SANITY_PROJECT_ID=your-project-id-here
VITE_SANITY_DATASET=production
```

## Step 7: Update Website Code

The website already has Sanity integration hooks ready in:
- `src/utils/sanity.js`
- `src/hooks/useSanityContent.js`

The `HomePage` component will automatically use Sanity if `VITE_SANITY_PROJECT_ID` is set, otherwise it falls back to `content.json`.

## Optional: Run Studio Locally

```bash
cd sanity
npm run dev
```

Studio will be available at: `http://localhost:3333`

