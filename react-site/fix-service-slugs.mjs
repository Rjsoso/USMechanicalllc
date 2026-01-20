import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.VITE_SANITY_WRITE_TOKEN,
});

// Function to create SEO-friendly slug
function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

// Mapping of current slugs to improved slugs
const slugMappings = {
  'plumbing services': 'plumbing-services',
  'HVAC': 'hvac',
  'Processed Piping': 'process-piping',
  'BIM': 'bim-modeling',
  'In House Fabrication': 'in-house-fabrication'
};

async function fixServiceSlugs() {
  try {
    console.log('🔍 Fetching current services from Sanity...\n');
    
    // Get the ourServices document
    const ourServices = await client.fetch(`
      *[_type == "ourServices"][0] {
        _id,
        servicesInfo[] {
          title,
          "slug": slug.current,
          _key
        }
      }
    `);

    if (!ourServices || !ourServices.servicesInfo) {
      console.log('❌ No services found');
      return;
    }

    console.log('📋 Current slugs:');
    ourServices.servicesInfo.forEach(service => {
      console.log(`   - "${service.slug}" (${service.title})`);
    });

    console.log('\n🔧 Updating slugs...\n');

    // Build the patch operations
    const updates = ourServices.servicesInfo.map((service, index) => {
      const currentSlug = service.slug;
      const newSlug = slugMappings[currentSlug] || createSlug(service.title);
      
      if (currentSlug !== newSlug) {
        console.log(`   ✓ "${currentSlug}" → "${newSlug}"`);
        return {
          index,
          key: service._key,
          newSlug
        };
      } else {
        console.log(`   - "${currentSlug}" (no change needed)`);
        return null;
      }
    }).filter(Boolean);

    if (updates.length === 0) {
      console.log('\n✅ All slugs are already optimized!');
      return;
    }

    // Apply the updates
    console.log(`\n📝 Applying ${updates.length} updates to Sanity...\n`);
    
    for (const update of updates) {
      await client
        .patch(ourServices._id)
        .set({
          [`servicesInfo[_key=="${update.key}"].slug.current`]: update.newSlug
        })
        .commit();
    }

    console.log('✅ All slugs updated successfully!\n');
    
    console.log('📋 New slugs:');
    const updatedServices = await client.fetch(`
      *[_type == "ourServices"][0].servicesInfo[] {
        title,
        "slug": slug.current
      }
    `);
    
    updatedServices.forEach(service => {
      console.log(`   - "${service.slug}" (${service.title})`);
    });

    console.log('\n⚠️  IMPORTANT NEXT STEPS:');
    console.log('   1. The sitemap needs to be regenerated with the new slugs');
    console.log('   2. The changes will be live after you regenerate and deploy');
    console.log('   3. Old URLs will return 404 - consider adding redirects\n');

  } catch (error) {
    console.error('❌ Error updating slugs:', error);
    throw error;
  }
}

fixServiceSlugs();
