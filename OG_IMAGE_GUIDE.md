# Open Graph (OG) Image Creation Guide

This guide will help you create a professional social media preview image for US Mechanical that appears when someone shares your website on Facebook, LinkedIn, Twitter, and other platforms.

---

## 📐 Image Specifications

### Required Dimensions
- **Size:** 1200px × 630px (exact)
- **Aspect Ratio:** 1.91:1
- **Format:** PNG or JPG
- **File Size:** Under 8 MB (aim for under 1 MB)
- **Color Mode:** RGB

### Safe Zones
- **Facebook/LinkedIn:** Keep important content within 1200×630px
- **Twitter:** Center 800×418px area is safest
- **Mobile:** Keep text readable at small sizes

---

## 🎨 Design Recommendations

### Content to Include
1. **Company Logo** - US Mechanical logo prominently displayed
2. **Company Name** - "U.S. Mechanical LLC" or "US Mechanical"
3. **Tagline** - "Plumbing & HVAC Experts Since 1963" or similar
4. **Service Areas** - "Utah • Nevada • Arizona" (optional)
5. **Background** - Professional, branded design

### Design Best Practices
- ✅ Use high contrast (light text on dark background or vice versa)
- ✅ Keep text large and readable (minimum 48px for body text)
- ✅ Use brand colors (likely red #c43821 and black)
- ✅ Leave margins (at least 50px from edges)
- ✅ Center important elements
- ❌ Avoid cluttered designs
- ❌ Don't use too much text
- ❌ Avoid tiny text that won't be readable when scaled down

---

## 🛠️ Option 1: Use Canva (Easiest)

### Step 1: Access Canva
1. Go to [Canva.com](https://www.canva.com)
2. Sign up for free account (if needed)

### Step 2: Create Custom Size
1. Click **"Create a design"**
2. Click **"Custom size"**
3. Enter: **1200 × 630 pixels**
4. Click **"Create new design"**

### Step 3: Design Your Image

**Simple Template Option:**
```
┌─────────────────────────────────────────┐
│                                         │
│        [US MECHANICAL LOGO]             │
│                                         │
│     Plumbing & HVAC Experts            │
│          Since 1963                     │
│                                         │
│   Serving Utah • Nevada • Beyond       │
│                                         │
│   Licensed, Bonded & Insured           │
│                                         │
└─────────────────────────────────────────┘
```

**Professional Option:**
```
┌─────────────────────────────────────────┐
│  [LOGO]    U.S. MECHANICAL LLC          │
│                                         │
│            Mechanical                   │
│            Contracting                  │
│            Experts                      │
│                                         │
│  • Commercial HVAC  • Plumbing          │
│  • Industrial       • Process Piping    │
│                                         │
│        Trusted Since 1963               │
└─────────────────────────────────────────┘
```

### Step 4: Design Elements
1. Set background color to black or dark color
2. Add text in white or #c43821 red
3. Upload your logo (`/react-site/public/logo.png`)
4. Add company name and tagline
5. Include contact info or service areas (optional)

### Step 5: Download
1. Click **"Share"** → **"Download"**
2. Select **PNG** format
3. Click **"Download"**
4. Save as `og-image.png`

---

## 🛠️ Option 2: Use Figma (Professional)

### Step 1: Create Frame
1. Open [Figma.com](https://www.figma.com)
2. Create new file
3. Press **F** for Frame tool
4. Set frame to **1200 × 630px**
5. Name it "OG Image"

### Step 2: Design
1. Add rectangle for background (use brand colors)
2. Import logo image
3. Add text layers for:
   - Company name
   - Tagline
   - Services
   - Contact info
4. Use brand fonts if available

### Step 3: Export
1. Select frame
2. Add export settings (right panel)
3. Format: **PNG**
4. Scale: **1x**
5. Click **"Export"**

---

## 🛠️ Option 3: Use Photoshop

1. **File → New**
2. Width: **1200px**, Height: **630px**, Resolution: **72 DPI**
3. Design your image with layers
4. **File → Export → Export As**
5. Format: **PNG** or **JPG**
6. Quality: **80-100%**
7. Save as `og-image.png`

---

## 🛠️ Option 4: Quick Online Tools

### Remove.bg + Simple Edit
1. Use existing company marketing materials
2. Crop/resize to 1200×630px
3. Use free tools like:
   - [Pixlr](https://pixlr.com/editor/) - Free photo editor
   - [Photopea](https://www.photopea.com/) - Free Photoshop alternative
   - [Remove.bg](https://www.remove.bg/) - Remove backgrounds

---

## 📥 Upload to Your Website

### Step 1: Save the File
1. Name it exactly: `og-image.png` or `og-image.jpg`
2. Ensure it's 1200×630px

### Step 2: Add to Project
1. Place file in: `/react-site/public/og-image.png`
2. Commit to GitHub:
   ```bash
   git add react-site/public/og-image.png
   git commit -m "Add Open Graph social media preview image"
   git push origin main
   ```

### Step 3: Verify
After deployment, test your image:
1. Go to [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your website URL
3. Click **"Debug"**
4. You should see your image preview

Or use:
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

---

## 🎨 Design Templates & Examples

### Minimal Design
- Black background
- White logo centered
- White text: company name and tagline
- Clean, professional

### Bold Design
- Red (#c43821) background
- White logo and text
- High contrast, attention-grabbing
- Service icons or badges

### Photo Background
- Industrial/construction background image
- Dark overlay (50-70% opacity)
- White text on top
- Professional, shows expertise

---

## ✅ Testing Your OG Image

### Before You Deploy
1. **Size Check:** Exactly 1200×630px
2. **File Size:** Under 1 MB ideally
3. **Readability:** Can you read text on mobile?
4. **Brand Consistency:** Matches your website design?

### After Deploy
Test on these tools:
- [Facebook Debugger](https://developers.facebook.com/tools/debug/) - Shows how it looks on Facebook
- [Twitter Card Validator](https://cards-dev.twitter.com/validator) - Twitter preview
- [LinkedIn Inspector](https://www.linkedin.com/post-inspector/) - LinkedIn preview
- [OpenGraph.xyz](https://www.opengraph.xyz/) - Multi-platform preview

---

## 🔄 Updating Your OG Image

If you change the image:
1. Replace the file at `react-site/public/og-image.png`
2. Clear cache in social platforms:
   - Facebook: Use Sharing Debugger and click "Scrape Again"
   - LinkedIn: Use Post Inspector
   - Twitter: Clear cache (may take up to 7 days)

---

## 💡 Quick Start Template

If you need something ASAP, here's a simple design you can create in 5 minutes:

**Black Background + White Text:**
```
Background: #000000 (black)
Logo: Center top (300px wide)
Title: "U.S. MECHANICAL LLC" (72px, white, bold)
Subtitle: "Plumbing & HVAC Experts Since 1963" (36px, white)
Footer: "Utah • Nevada • Arizona" (24px, white, 50% opacity)
```

---

## 📱 What It Looks Like When Shared

### Facebook
```
┌──────────────────────────────────┐
│  [Your 1200×630 Image]           │
├──────────────────────────────────┤
│ US MECHANICAL LLC                │
│ Trusted mechanical contracting   │
│ since 1963...                    │
│ usmechanicalllc.com              │
└──────────────────────────────────┘
```

### Twitter
```
┌──────────────────────────────┐
│  [Your Image - cropped]      │
├──────────────────────────────┤
│ US MECHANICAL LLC            │
│ Trusted mechanical...        │
│ 🔗 usmechanicalllc.com       │
└──────────────────────────────┘
```

### LinkedIn
```
┌──────────────────────────────────┐
│  [Your 1200×630 Image]           │
├──────────────────────────────────┤
│ US Mechanical | Plumbing & HVAC  │
│ usmechanicalllc.com              │
│ Trusted mechanical contracting   │
│ since 1963...                    │
└──────────────────────────────────┘
```

---

## 🎯 Key Takeaways

1. **Exact size matters:** 1200×630px is critical
2. **Keep it simple:** Less is more for readability
3. **Brand consistency:** Match your website colors/fonts
4. **Test on mobile:** Most shares are viewed on phones
5. **Update regularly:** Refresh for holidays, promotions, etc.

---

## 📚 Additional Resources

- [Facebook Design Guide](https://developers.facebook.com/docs/sharing/webmasters/images)
- [Twitter Card Docs](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [LinkedIn Sharing Guide](https://www.linkedin.com/help/linkedin/answer/a521928)
- [Open Graph Protocol](https://ogp.me/)

---

**Need Help?** If you're not comfortable designing, consider:
- Hiring a designer on Fiverr ($10-50)
- Using AI image generators (DALL-E, Midjourney)
- Asking your marketing team
- Using a pre-made template from Canva

---

**Last Updated:** January 8, 2026  
**File Location:** `/react-site/public/og-image.png`
