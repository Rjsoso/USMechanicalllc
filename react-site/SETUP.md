# Professional Setup Guide

This guide will help you set up the professional design studio stack for the U.S. Mechanical website.

## 🛠️ Tools Included

✅ **Tailwind CSS** - Utility-first CSS framework  
✅ **Framer Motion** - Smooth animations  
✅ **React Router** - Client-side routing  
✅ **Sanity CMS** - Headless CMS (optional)  
✅ **ESLint & Prettier** - Code quality  
✅ **Vercel** - Deployment ready  

## 📦 Installation

### 1. Install Dependencies

```bash
cd react-site
npm install
```

### 2. Code Formatting (ESLint & Prettier)

**Format code:**
```bash
npm run format
```

**Check formatting:**
```bash
npm run format:check
```

**Lint code:**
```bash
npm run lint
```

**Auto-fix linting issues:**
```bash
npm run lint:fix
```

### 3. Sanity CMS Setup (Optional but Recommended)

Sanity allows non-developers to edit content easily through a visual interface.

#### Step 1: Install Sanity CLI
```bash
npm install -g @sanity/cli
```

#### Step 2: Create Sanity Project
```bash
cd react-site
sanity init
```

Follow the prompts:
- Create new project
- Project name: `us-mechanical`
- Use default dataset: `production`
- Output path: `sanity`

#### Step 3: Get Your Project ID
1. Go to https://www.sanity.io/manage
2. Select your project
3. Copy the Project ID

#### Step 4: Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add:
```
VITE_SANITY_PROJECT_ID=your-project-id-here
VITE_SANITY_DATASET=production
```

#### Step 5: Add Schemas
Copy the schema from `sanity/schema.js` to your Sanity studio's schemas folder.

#### Step 6: Deploy Sanity Studio
```bash
cd sanity
sanity deploy
```

This will give you a URL like `https://your-project.sanity.studio`

### 4. Vercel Deployment

#### Option A: Deploy via Vercel Dashboard
1. Go to https://vercel.com
2. Import your Git repository
3. Vercel will auto-detect Vite and deploy

#### Option B: Deploy via CLI
```bash
npm install -g vercel
vercel
```

#### Environment Variables in Vercel
Add your Sanity credentials in Vercel dashboard:
- `VITE_SANITY_PROJECT_ID`
- `VITE_SANITY_DATASET`

## 🎨 Development Workflow

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📝 Code Quality

### Pre-commit Setup (Recommended)

Create `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint:fix
npm run format
```

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## 🔄 Content Management

### Using Sanity CMS (Recommended)
1. Go to your Sanity Studio URL
2. Edit content visually
3. Changes appear on the website instantly

### Using Local Admin Panel
1. Go to `http://localhost:3000/admin`
2. Edit content
3. Click "Save Changes"
4. Content saved to localStorage

## 🚀 Deployment Checklist

- [ ] Run `npm run build` locally to test
- [ ] Set up Sanity CMS (optional but recommended)
- [ ] Configure environment variables
- [ ] Deploy to Vercel
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (optional)

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Sanity Docs](https://www.sanity.io/docs)
- [Vercel Docs](https://vercel.com/docs)

## 🎯 Next Steps

1. **Set up Sanity CMS** for easy content editing
2. **Customize design** in Tailwind config
3. **Add your content** via admin panel or Sanity
4. **Deploy to Vercel** for production
5. **Set up analytics** (Google Analytics, etc.)

Your website is now production-ready with professional tools! 🎉

