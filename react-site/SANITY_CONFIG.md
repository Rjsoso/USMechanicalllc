# Sanity CMS Configuration

Your Sanity Studio is deployed at: **https://us-mechanical.sanity.studio**

## Step 1: Get Your Project ID

1. Go to https://www.sanity.io/manage
2. Click on your "us-mechanical" project
3. In Project Settings, copy the **Project ID** (it looks like: `abc123xyz`)

## Step 2: Configure Environment Variables

Create a `.env` file in the root of `react-site/`:

```bash
VITE_SANITY_PROJECT_ID=your-actual-project-id-here
VITE_SANITY_DATASET=production
```

Replace `your-actual-project-id-here` with the Project ID from Step 1.

## Step 3: Set Up Schemas in Sanity Studio

Go to https://us-mechanical.sanity.studio and add these schemas:

### In `sanity/schemas/hero.js`:
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

### In `sanity/schemas/about.js`:
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

### In `sanity/schemas/safety.js`:
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

### In `sanity/schemas/recognition.js`:
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

### Register schemas in `sanity/schemas/index.js`:
```javascript
import hero from './hero'
import about from './about'
import safety from './safety'
import recognition from './recognition'

export const schemaTypes = [hero, about, safety, recognition]
```

## Step 4: Add Content in Sanity Studio

1. Go to https://us-mechanical.sanity.studio
2. Create one document for each:
   - **Hero** (single document)
   - **About** (single document)
   - **Safety** (single document)
   - **Recognition** (multiple documents - one for each project)

## Step 5: Restart Dev Server

After adding `.env` file:
```bash
npm run dev
```

The website will now automatically fetch content from Sanity instead of `content.json`.

## How It Works

- **With Sanity configured**: Website loads content from Sanity CMS
- **Without Sanity**: Website falls back to `content.json` from localStorage
- **Admin Panel**: Still works with localStorage for quick edits
- **Best of both**: Use Sanity for production, localStorage admin for quick fixes

