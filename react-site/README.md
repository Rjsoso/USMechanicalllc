# U.S. Mechanical Website

A modern, professional website for U.S. Mechanical built with React, Tailwind CSS, and Framer Motion, inspired by Awardco.com's clean design aesthetic.

## 🚀 Features

- **Modern React Architecture**: Built with React 18 and Vite for fast development
- **Beautiful UI**: Clean, spacious design inspired by Awardco.com
- **Smooth Animations**: Framer Motion fade/slide effects on scroll
- **Fully Responsive**: Mobile-first design with hamburger menu
- **Admin Dashboard**: Password-protected CMS interface
- **Content Management**: Edit all text, images, and links via admin panel
- **Image Upload Preview**: Preview images before saving in admin
- **Local Storage**: Changes saved to localStorage (ready for backend integration)
- **Smooth Scrolling**: Elegant section-to-section navigation
- **Loading Animation**: Professional loading state

## 📦 Quick Start

### 1. Install Dependencies
```bash
cd react-site
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access the Website
- **Main Website**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin`
  - Password: `admin123`

## 🏗️ Website Structure

### Main Pages
- **Home** (`/`) - Complete website with all sections
- **Admin** (`/admin`) - Content management dashboard

### Sections
1. **Navbar** - Sticky navigation with smooth scroll
2. **Hero** - Large background image with headline and CTA
3. **About** - Company history with expandable content
4. **Safety** - Two-column layout with text and image
5. **Recognition** - Project cards with certifications
6. **Contact** - Request a quote form
7. **Footer** - Company info and quick links

## 🎨 Design Features

- **Typography**: Inter & Poppins fonts (Google Fonts)
- **Colors**: Clean whites, grays, navy, and accent blue
- **Spacing**: Generous whitespace for Awardco-inspired look
- **Cards**: Rounded corners (rounded-2xl) with soft shadows
- **Animations**: Framer Motion fade-ins on scroll
- **Responsive**: Mobile, tablet, and desktop layouts

## 📝 Content Management

All content is stored in `/src/data/content.json` and can be edited via:

### Admin Dashboard
1. Go to `/admin`
2. Enter password: `admin123`
3. Select a section from sidebar
4. Edit text, images, or URLs
5. Upload images or paste image URLs
6. Click "Save Changes"
7. Refresh main website to see changes

### Direct JSON Editing
Edit `/src/data/content.json` directly for bulk changes.

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 📁 Project Structure

```
react-site/
├── public/
│   └── logo.png           # Company logo
├── src/
│   ├── components/        # React components
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Safety.jsx
│   │   ├── Recognition.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Loading.jsx
│   │   └── AdminNavbar.jsx
│   ├── pages/
│   │   ├── Home.jsx       # Main website page
│   │   └── Admin.jsx      # Admin dashboard
│   ├── data/
│   │   └── content.json   # All website content
│   ├── utils/
│   │   └── content.js     # Content management utilities
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json            # Vercel deployment config
```

## 🚀 Deployment

### Deploy to Vercel

1. **Via Vercel Dashboard**:
   - Push code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel auto-detects Vite and deploys

2. **Via Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel
   ```

The `vercel.json` is already configured for optimal deployment.

## 🎯 Features Breakdown

### Animations
- Framer Motion fade-ins on scroll
- Staggered animations for lists
- Hover effects on buttons and cards
- Loading spinner animation

### Admin Features
- Password protection (`admin123`)
- Image upload with preview
- URL-based image input
- Real-time preview
- Save to localStorage
- Section-based editing

### Responsive Design
- Mobile hamburger menu
- Tablet-optimized layouts
- Desktop full-width sections
- Touch-friendly buttons

## 📚 Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation

## 🔒 Admin Access

- **URL**: `/admin`
- **Password**: `admin123`
- Changes saved to `localStorage`

For production, replace the simple password check with proper authentication.

## 📞 Contact Information

Default contact info (editable in admin):
- **Email**: info@usmechanicalllc.com
- **Phone**: (801) 785-6028
- **Offices**: Pleasant Grove, UT | Las Vegas, NV

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change color scheme.

### Fonts
Fonts are loaded from Google Fonts in `index.html`.

### Content
All content in `/src/data/content.json` - edit directly or via admin panel.

## 📝 Notes

- Logo should be placed in `/public/logo.png`
- Images can be uploaded via admin or added as URLs
- All content is saved to localStorage (simulates CMS)
- Ready for backend API integration

## 🐛 Troubleshooting

**Server won't start?**
- Make sure port 3000 is available
- Run `npm install` to ensure dependencies are installed

**Changes not showing?**
- Clear browser cache
- Check localStorage in browser DevTools
- Verify content.json structure

**Admin not working?**
- Clear localStorage: `localStorage.clear()` in console
- Check password: `admin123`

---

Built with ❤️ for U.S. Mechanical
