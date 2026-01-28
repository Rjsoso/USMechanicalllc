import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
dotenv.config()

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '3vpl3hho',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function checkHeroButtons() {
  const hero = await client.fetch(`*[_type == "heroSection"][0]{
    _id,
    buttonText,
    buttonLink,
    secondButtonText,
    secondButtonLink
  }`)
  
  console.log('\n=== CURRENT HERO BUTTON CONFIGURATION ===\n')
  console.log('First Button (REQUEST A QUOTE):')
  console.log(`  Text: "${hero.buttonText}"`)
  console.log(`  Link: "${hero.buttonLink}"`)
  console.log(`  Expected: "#contact"`)
  console.log(`  Status: ${hero.buttonLink === '#contact' ? '✅ CORRECT' : '❌ WRONG'}`)
  console.log('\nSecond Button (APPLY TO WORK WITH US):')
  console.log(`  Text: "${hero.secondButtonText}"`)
  console.log(`  Link: "${hero.secondButtonLink}"`)
  console.log(`  Expected: "#careers"`)
  console.log(`  Status: ${hero.secondButtonLink === '#careers' ? '✅ CORRECT' : '❌ WRONG'}`)
  console.log('\n')
}

checkHeroButtons().catch(console.error)
