# Google Search Console Setup Guide

This guide will help you get your US Mechanical website indexed and visible on Google search results.

## 📊 Why This Matters

Google Search Console (GSC) is **essential** for:
- Getting your site indexed by Google
- Monitoring search performance
- Identifying and fixing SEO issues
- Submitting your sitemap
- Seeing what keywords bring visitors
- Understanding how Google sees your site

---

## 🚀 Step 1: Access Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account (use a business Google account if you have one)

---

## 🔐 Step 2: Add Your Property

### Option A: Domain Property (Recommended)
This verifies the entire domain including all subdomains and protocols (http/https).

1. Click **"Add Property"**
2. Select **"Domain"** option
3. Enter your domain: `usmechanicalllc.com`
4. Click **Continue**

### Option B: URL Prefix
This verifies only the specific URL you enter.

1. Click **"Add Property"**
2. Select **"URL prefix"** option
3. Enter: `https://usmechanicalllc.com`
4. Click **Continue**

---

## ✅ Step 3: Verify Ownership

Google offers several verification methods. Here are the easiest ones:

### Method 1: HTML File Upload (Easiest for Vercel)

1. Google will provide a verification file (e.g., `google1234567890abcdef.html`)
2. Download this file
3. Upload it to your repository:
   - Path: `react-site/public/google1234567890abcdef.html`
4. Commit and push to GitHub
5. Wait for Vercel to deploy (usually 1-2 minutes)
6. Return to Google Search Console and click **"Verify"**

### Method 2: HTML Meta Tag

1. Google will provide a meta tag like:
   ```html
   <meta name="google-site-verification" content="your-verification-code" />
   ```
2. Add this tag to `react-site/index.html` in the `<head>` section
3. Commit and push to GitHub
4. Wait for Vercel to deploy
5. Return to Google Search Console and click **"Verify"**

### Method 3: DNS Verification (If you control DNS)

1. Google will provide a TXT record
2. Add this TXT record to your domain's DNS settings
3. Wait 10-15 minutes for DNS propagation
4. Return to Google Search Console and click **"Verify"**

---

## 📋 Step 4: Submit Your Sitemap

After verification:

1. In Google Search Console, click **"Sitemaps"** in the left menu
2. Enter your sitemap URL: `sitemap.xml`
3. Click **"Submit"**

Google will now know about all your pages!

---

## 🔍 Step 5: Request Indexing (Critical!)

For immediate indexing of important pages:

1. In GSC, click **"URL Inspection"** in the left menu
2. Enter your homepage URL: `https://usmechanicalllc.com`
3. Click **"Request Indexing"**
4. Wait for Google to process (can take a few minutes)
5. Repeat for other important pages:
   - Contact page: `https://usmechanicalllc.com/contact`
   - Key service pages
   - Portfolio pages

**Note:** You can request indexing for up to 10 pages per day.

---

## 📈 Step 6: Monitor Performance

Check your GSC dashboard regularly:

### Coverage Report
- Shows which pages are indexed
- Identifies errors preventing indexing
- Path: **Index → Coverage**

### Performance Report
- Shows search queries that bring visitors
- Displays click-through rates
- Shows average position in search results
- Path: **Performance**

### URL Inspection
- Test how Google sees specific pages
- Check if pages are mobile-friendly
- Path: **URL Inspection**

---

## 🎯 Step 7: Set Up Additional Features

### Link Google Analytics (Optional)
1. In GSC, click **Settings** (gear icon)
2. Click **"Link Google Analytics property"**
3. Follow prompts to connect

### Add Additional Users
1. Click **Settings**
2. Click **"Users and permissions"**
3. Add team members who need access

---

## 🐛 Common Issues & Solutions

### "URL is not on Google"
- **Solution:** Request indexing for that URL
- **Timeframe:** Can take 24-48 hours

### "Crawled - currently not indexed"
- **Reason:** Page quality or duplicate content
- **Solution:** Improve content uniqueness and quality

### "Sitemap could not be read"
- **Solution:** Check that `sitemap.xml` is accessible at `https://usmechanicalllc.com/sitemap.xml`
- **Solution:** Ensure XML syntax is correct

### "robots.txt file blocks indexing"
- **Solution:** Check `robots.txt` doesn't have `Disallow: /` for your pages

---

## ⏱️ Expected Timeline

| Action | Timeframe |
|--------|-----------|
| Verification | Immediate |
| Sitemap processing | 24-48 hours |
| First pages indexed | 2-7 days |
| Full site indexed | 1-4 weeks |
| Appear in search results | 2-8 weeks |
| Competitive ranking | 3-6 months |

---

## 🎓 Best Practices

1. **Check GSC Weekly** - Look for new issues or errors
2. **Submit New Pages** - Request indexing when you add content
3. **Fix Errors Promptly** - Address coverage issues quickly
4. **Monitor Mobile Usability** - Ensure mobile-friendliness
5. **Watch Core Web Vitals** - Page speed affects rankings
6. **Update Sitemap** - Keep it current when you add pages

---

## 🔗 Additional Tools to Submit Your Site

Don't stop at Google! Submit to other search engines:

### Bing Webmaster Tools
- URL: https://www.bing.com/webmasters
- Similar process to Google
- Covers Bing, Yahoo, DuckDuckGo

### Yandex Webmaster
- URL: https://webmaster.yandex.com
- Good for international reach

---

## 📞 Need Help?

Common GSC Resources:
- [GSC Help Center](https://support.google.com/webmasters)
- [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

## ✨ Pro Tips

1. **Fetch as Google** - Use URL Inspection tool to see how Google renders your page
2. **Rich Results Test** - Verify your Schema.org markup works: https://search.google.com/test/rich-results
3. **Set Up Alerts** - Enable email notifications for critical issues
4. **Check Backlinks** - Monitor who's linking to your site
5. **Track Keywords** - See which search terms drive traffic

---

## 🎉 You're All Set!

Once everything is set up:
- ✅ Google knows your site exists
- ✅ Your pages are being crawled
- ✅ You can monitor performance
- ✅ Search visibility will improve over time

**Remember:** SEO is a marathon, not a sprint. Consistent quality content and technical optimization will improve your rankings over time.

---

**Last Updated:** January 8, 2026  
**Questions?** Contact your web developer or SEO specialist.
