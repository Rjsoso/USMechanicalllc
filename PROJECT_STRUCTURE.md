# U.S. Mechanical Website - Project Structure

## 📁 Project Overview
This is a professional mechanical contracting website with secure admin panel, built with modern web technologies and security best practices.

## 🗂️ File Structure

```
/Applications/US Mechanical Website/
├── 📄 Core Website Files
│   ├── index.html              # Main website (public)
│   ├── index-secure.html       # Secure version with enhanced security
│   ├── about.html              # About page
│   └── styles.css              # Custom CSS styles
│
├── 🔧 Admin Panel Files
│   ├── admin.html              # Original admin panel
│   ├── admin-live.html         # Live edit admin panel (mirrors website)
│   ├── admin-secure.html       # Secure admin with authentication
│   └── admin-simple.html       # Simple admin for testing
│
├── 📁 Services Directory
│   ├── hvac.html               # HVAC services page
│   ├── hydronic.html           # Hydronic services page
│   ├── process-piping.html     # Process piping services
│   └── design-build.html       # Design-build services
│
├── 🖼️ Images Directory
│   ├── us-mechanical-logo.png  # Company logo
│   ├── project-*.jpg          # Project photos
│   ├── hvac-*.jpg             # HVAC system images
│   ├── hydronic-*.jpg         # Hydronic system images
│   └── safety-*.jpg           # Safety and team photos
│
├── ⚙️ Configuration Files
│   ├── package.json            # Node.js dependencies and scripts
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── webpack.config.js       # Webpack build configuration
│   ├── .gitignore             # Git ignore rules
│   └── env.example            # Environment variables template
│
├── 📚 Documentation
│   ├── README.md               # Main project documentation
│   ├── IMAGE_SETUP_GUIDE.md    # Image management guide
│   └── PROJECT_STRUCTURE.md    # This file
│
└── 📊 Data Files
    ├── content-data.json       # Content data structure
    └── script.js              # JavaScript functionality
```

## 🚀 Quick Start

### 1. Start Development Server
```bash
# Using Python (current method)
python3 -m http.server 8003

# Using npm (if you install dependencies)
npm start
```

### 2. Access Your Website
- **Main Website**: http://localhost:8003/
- **Secure Website**: http://localhost:8003/index-secure.html
- **Live Edit Admin**: http://localhost:8003/admin-live.html
- **Secure Admin**: http://localhost:8003/admin-secure.html

## 🔧 Development Setup

### Install Dependencies (Optional)
```bash
npm install
```

### Available Scripts
```bash
npm start          # Start development server
npm run dev        # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Run linter
npm run security-scan  # Security scan
npm run backup     # Create backup
```

## 🛡️ Security Features

### Authentication
- **Username**: admin
- **Password**: usmechanical2024
- **Security Code**: 123456

### Security Layers
1. **Multi-factor authentication**
2. **Rate limiting** (60 requests/minute)
3. **Input sanitization**
4. **XSS protection**
5. **CSRF protection**
6. **Session management**
7. **Security logging**

## 📱 Admin Panel Features

### Live Edit Admin (admin-live.html)
- **Mirrors main website** design
- **Click-to-edit** any text
- **Real-time preview**
- **Auto-save functionality**

### Secure Admin (admin-secure.html)
- **Authentication required**
- **Security dashboard**
- **Activity logging**
- **Threat monitoring**
- **Access controls**

## 🎨 Styling & Design

### Tailwind CSS Configuration
- **Custom color palette** for U.S. Mechanical branding
- **Responsive design** for all devices
- **Security-focused** styling
- **Professional animations**

### Custom CSS Variables
```css
--accent-blue: #0b21d6
--accent-red: #ff6b35
--accent-orange: #ff6b35
--accent-black: #1a1a1a
--security-green: #059669
--security-red: #dc2626
```

## 📊 Content Management

### Dynamic Content Loading
- **localStorage** for data persistence
- **Real-time updates** across all pages
- **Image management** with categorization
- **Testimonials management**
- **Projects management**

### Content Structure
```json
{
  "websiteContent": {
    "homepage": { "hero": {...}, "about": {...} },
    "contact": { "phone": "...", "email": "..." }
  },
  "testimonials": [...],
  "projects": [...],
  "uploadedImages": [...]
}
```

## 🔒 Security Best Practices

### Implemented Protections
1. **Content Security Policy (CSP)**
2. **X-Frame-Options**
3. **X-Content-Type-Options**
4. **X-XSS-Protection**
5. **Input validation**
6. **Output encoding**
7. **Session security**
8. **Rate limiting**

### Security Headers
```html
<meta http-equiv="Content-Security-Policy" content="...">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
```

## 🚀 Deployment

### Production Checklist
- [ ] Update environment variables
- [ ] Change default passwords
- [ ] Configure SSL certificates
- [ ] Set up proper hosting
- [ ] Configure domain name
- [ ] Test all functionality
- [ ] Run security scan

### Environment Variables
Copy `env.example` to `.env` and update with your values:
- Admin credentials
- Database settings
- Email configuration
- Security keys

## 📈 Monitoring & Analytics

### Security Logging
- **All admin actions** logged
- **Security events** tracked
- **Threat detection** active
- **Session monitoring**

### Performance
- **Optimized images**
- **Minified CSS/JS**
- **CDN ready**
- **Mobile optimized**

## 🛠️ Maintenance

### Regular Tasks
1. **Update dependencies**
2. **Review security logs**
3. **Backup data**
4. **Test functionality**
5. **Update content**

### Backup Strategy
- **Content backups** via admin panel
- **Image backups** via export
- **Configuration backups**
- **Security log backups**

## 📞 Support

For technical support or questions about this website:
- **Documentation**: Check README.md and IMAGE_SETUP_GUIDE.md
- **Security**: Review security logs in admin panel
- **Content**: Use live edit admin for easy updates
- **Issues**: Check browser console for errors

---

**Built with ❤️ for U.S. Mechanical, LLC**
*Professional mechanical contracting since 1963*
