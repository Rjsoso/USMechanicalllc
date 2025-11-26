# 📝 How to Populate Sanity with Current Website Content

## The Problem

The website is showing content, but it's not appearing in Sanity Studio because the documents don't exist in Sanity yet. The website uses fallback/default data when Sanity returns null.

## ✅ Solution: Create Documents in Sanity Studio

### Step 1: Open Sanity Studio
Go to: `http://localhost:3333` (local) or your deployed Sanity Studio URL

### Step 2: Create Each Document

Click on each section in the left sidebar and create the document with this content:

#### 1. Hero Section
- **Headline:** `Building the Future of Mechanical Contracting`
- **Subtext:** `Excellence in Plumbing, HVAC, and Mechanical Systems since 1963.`
- **Button Text:** `Request a Quote`
- **Button Link:** `#contact`

#### 2. About & Safety Section
- **About Title:** `About U.S. Mechanical`
- **About Text:** 
```
U.S. Mechanical's foundation was laid in 1963 with the organization of Bylund Plumbing and Heating. Since that time, the Bylund family has continuously been in the mechanical contracting industry. The U.S. Mechanical name was adopted 25 years ago and continues to represent our company owners and employees.

We pursue projects in the Intermountain and Southwest regions via hard bid, design build, CMAR, and cost plus. Our team includes journeyman and apprentice plumbers, sheet metal installers, pipefitters, welders, and administrative staff—all with unmatched experience.

We maintain offices in Pleasant Grove, Utah, and Las Vegas, Nevada, as well as Snyder Mechanical in Elko, Nevada, which serves the mining industry. U.S. Mechanical is fully licensed, bonded, and insured in Nevada, Utah, Arizona, California, and Wyoming.
```

#### 3. Safety Section (separate document)
- **Title:** `Safety & Risk Management`
- **Content:**
```
U.S. Mechanical conducts all projects with safety as our top priority. We employ a company-wide safety program led by a full-time OSHA and MSHA accredited safety director. Our focus on safety ensures properly trained employees and a work environment that prioritizes everyone's well-being.

Our experience modification rate (EMR) remains below the national average, qualifying us for self-insured insurance programs that reduce risk management costs. These savings, combined with our dedication to safety, provide added value on every project.

Our goal is always simple: complete every project with zero safety issues.
```

#### 4. Company Stats
- **Stats:**
  - Label: `Years of Experience`, Value: `62`
  - Label: `Projects Completed`, Value: `1500+`
  - Label: `Team Members`, Value: `150+`

#### 5. Our Services Section
- **Section Title:** `Our Services`
- **Description Text:** (leave empty for now)
- **Service Info Boxes:**
  - Title: `HVAC`, Description: `Heating, ventilation, and air conditioning services for commercial and industrial projects.`
  - Title: `Plumbing`, Description: `Complete plumbing solutions including installation, maintenance, and repair services.`
  - Title: `Process Piping`, Description: `Specialized process piping systems for industrial and manufacturing facilities.`

#### 6. Company Information (Footer)
- **Name:** `U.S. Mechanical LLC`
- **Address:** `Pleasant Grove, UT & Las Vegas, NV`
- **Email:** `info@usmechanicalllc.com`
- **Phone:** `(801) 555-0123`
- **License Info:** `Licensed, Bonded & Insured in NV, UT, AZ, CA, WY`

#### 7. Contact Section
- **Title:** `Get in Touch`
- **Description:** `Ready to start your next project? Contact us today for a quote.`

### Step 3: Publish Each Document

After creating each document, click the **"Publish"** button in the top right.

### Step 4: Verify

After publishing all documents:
1. Refresh your website
2. The content should now come from Sanity instead of fallback data
3. You can edit it in Sanity Studio and it will update on the website

---

## 🚀 Alternative: Use Script (Requires Write Token)

If you have a Sanity write token, you can run:

```bash
cd react-site
node sync-all-content.mjs
```

But you'll need to get a write token from: https://www.sanity.io/manage/personal/project/3vpl3hho/api/tokens

---

## 💡 Why This Happened

The website components have default/fallback content that shows when Sanity returns null. Since the documents didn't exist in Sanity, the website was using these defaults. Now that we've fixed the deskStructure, you can create the documents directly in Sanity Studio.

