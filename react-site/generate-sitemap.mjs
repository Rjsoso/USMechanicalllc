#!/usr/bin/env node
/**
 * Dynamic Sitemap Generator for US Mechanical
 * 
 * This script queries Sanity CMS and generates sitemap.xml automatically.
 * Run this whenever you add new content to Sanity.
 * 
 * Usage:
 *   npm run generate-sitemap
 *   or
 *   node generate-sitemap.mjs
 */

import { createClient } from '@sanity/client';
import { writeFileSync, existsSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

// Use VITE_SITE_URL or SITE_URL from env (no trailing slash). Set when running: VITE_SITE_URL=https://yourdomain.com node generate-sitemap.mjs
const DOMAIN = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://www.usmechanicalllc.com').replace(/\/$/, '');
const TODAY = new Date().toISOString().split('T')[0];

async function generateSitemap() {
  console.log('🔍 Fetching data from Sanity...\n');

  try {
    // Fetch all data in parallel
    const [services, categories, projects] = await Promise.all([
      // Get service slugs
      client.fetch(`
        *[_type == "ourServices"][0].servicesInfo[] {
          "slug": slug.current,
          title
        }
      `),
      
      // Get portfolio categories
      client.fetch(`
        *[_type == "portfolioCategory"] {
          _id,
          title
        }
      `),
      
      // Get portfolio projects (only those with titles)
      client.fetch(`
        *[_type == "portfolioProject" && defined(title)] {
          _id,
          title
        }
      `)
    ]);

    console.log('📊 Found:');
    console.log(`   - ${services?.length || 0} services`);
    console.log(`   - ${categories?.length || 0} portfolio categories`);
    console.log(`   - ${projects?.length || 0} portfolio projects\n`);

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Homepage -->
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Contact Page -->
  <url>
    <loc>${DOMAIN}/contact</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- About Page -->
  <url>
    <loc>${DOMAIN}/about</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Old-site About subpages (kept for parity) -->
  <url>
    <loc>${DOMAIN}/about/company-background</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${DOMAIN}/about/safety-and-risk-management</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${DOMAIN}/about/recognition</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Careers Page -->
  <url>
    <loc>${DOMAIN}/careers</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Portfolio Page -->
  <url>
    <loc>${DOMAIN}/portfolio</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Delivery Methods Page -->
  <url>
    <loc>${DOMAIN}/delivery-methods</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Privacy Page -->
  <url>
    <loc>${DOMAIN}/privacy</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Terms Page -->
  <url>
    <loc>${DOMAIN}/terms</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Attributions Page -->
  <url>
    <loc>${DOMAIN}/attributions</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Service Pages -->
${services?.map(service => {
  if (!service.slug) return '';
  const encodedSlug = encodeURIComponent(service.slug);
  return `  <url>
    <loc>${DOMAIN}/services/${encodedSlug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).filter(Boolean).join('\n') || '  <!-- No services found -->'}

  <!-- Portfolio Category Pages -->
${categories?.map(category => `  <url>
    <loc>${DOMAIN}/portfolio/${category._id}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n') || '  <!-- No categories found -->'}

  <!-- Portfolio Project Pages -->
${projects?.map(project => `  <url>
    <loc>${DOMAIN}/projects/${project._id}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n') || '  <!-- No projects found -->'}

</urlset>
`;

    // Write to file
    const sitemapPath = join(__dirname, 'public', 'sitemap.xml');
    writeFileSync(sitemapPath, sitemap, 'utf-8');

    console.log('✅ Sitemap generated successfully!');
    console.log(`📁 Saved to: ${sitemapPath}\n`);
    
    console.log('📋 URLs included:');
    const totalUrls = 12 + (services?.length || 0) + (categories?.length || 0) + (projects?.length || 0);
    console.log(`   - Total: ${totalUrls} URLs`);
    console.log(
      `   - Core pages: 12 (home, contact, about, about subpages, careers, portfolio, delivery-methods, privacy, terms, attributions)`
    );
    console.log(`   - Services: ${services?.length || 0}`);
    console.log(`   - Categories: ${categories?.length || 0}`);
    console.log(`   - Projects: ${projects?.length || 0}\n`);
    
    console.log('🚀 Next steps:');
    console.log('   1. Review the generated sitemap');
    console.log('   2. Commit and push to GitHub');
    console.log('   3. Re-submit to Google Search Console (if URLs changed)\n');

  } catch (error) {
    // Fail-soft: if a previously-generated sitemap.xml is still on disk, keep
    // it and warn. This prevents a transient Sanity outage from breaking a
    // production deploy. If no sitemap exists at all, we fail hard so the
    // problem is obvious.
    const sitemapPath = join(__dirname, 'public', 'sitemap.xml');
    const hasExistingSitemap = existsSync(sitemapPath);

    console.error('❌ Error generating sitemap:', error?.message || error);

    if (process.env.SKIP_SITEMAP === '1') {
      console.warn('⚠  SKIP_SITEMAP=1 set — skipping sitemap generation, continuing build.');
      return;
    }

    if (hasExistingSitemap) {
      const stat = statSync(sitemapPath);
      const ageDays = Math.round((Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24));
      console.warn(
        `⚠  Keeping existing sitemap.xml (${ageDays} day${ageDays === 1 ? '' : 's'} old). ` +
          'Re-run `npm run generate-sitemap` once Sanity is reachable.'
      );
      return;
    }

    console.error('No existing sitemap.xml to fall back on. Failing build.');
    process.exit(1);
  }
}

generateSitemap();
