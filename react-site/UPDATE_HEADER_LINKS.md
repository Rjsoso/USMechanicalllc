# Update Header Navigation Links

## Option 1: Update via Admin Panel (Recommended)

1. Go to your admin panel: `http://localhost:3000/admin`
2. Click on the **Header** section in the preview
3. In the right panel, find the `navLinks` field
4. Update each navigation link to match the section IDs:

   - **Link 1:**
     - Label: `About`
     - href: `#about`
   
   - **Link 2:**
     - Label: `Projects`
     - href: `#projects`
   
   - **Link 3:**
     - Label: `Contact`
     - href: `#contact`

5. Also update the button link:
   - Button Text: `Request a Quote` (or your preferred text)
   - Button Link: `#contact`

6. Click "Save Changes"

## Option 2: Update via Sanity Studio

1. Go to Sanity Studio: `http://localhost:3333`
2. Open the **Header Section** document
3. Edit the **Navigation Links** array:
   - Add/Edit link 1: Label: `About`, Link Target: `#about`
   - Add/Edit link 2: Label: `Projects`, Link Target: `#projects`
   - Add/Edit link 3: Label: `Contact`, Link Target: `#contact`
4. Update the **Button Link** to: `#contact`
5. Click **Publish**

## Option 3: Run Script (Requires Token)

If you have your Sanity write token set up, you can run:

```bash
cd "/Applications/US Mechanical Website/react-site"
export VITE_SANITY_WRITE_TOKEN="your-token-here"
node update-header-links.js
```

## Section IDs Reference

- `#hero` - Hero Section
- `#about` - About & Safety Section
- `#projects` - Recognition Projects Section
- `#contact` - Contact Section

