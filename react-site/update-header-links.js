import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load .env file manually
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let token = process.env.VITE_SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN

// Try to load from .env file if not in environment
if (!token) {
  try {
    const envPath = join(__dirname, '.env')
    const envContent = readFileSync(envPath, 'utf-8')
    const envLines = envContent.split('\n')
    for (const line of envLines) {
      const match = line.match(/^VITE_SANITY_WRITE_TOKEN=(.+)$/)
      if (match) {
        token = match[1].trim().replace(/^["']|["']$/g, '') // Remove quotes if present
        break
      }
    }
  } catch (error) {
    // .env file not found or couldn't read, that's okay
  }
}

if (!token) {
  console.error('❌ Error: VITE_SANITY_WRITE_TOKEN not found!')
  console.log('Please set it in .env file or as environment variable')
  process.exit(1)
}

const writeClient = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: token,
})

async function updateHeaderLinks() {
  try {
    console.log('🔄 Fetching headerSection document...')
    
    // Fetch the headerSection document
    const headerDoc = await writeClient.fetch(`*[_type == "headerSection"][0]`)
    
    if (!headerDoc) {
      console.log('⚠️ No headerSection document found. Creating a new one...')
      
      const newDoc = await writeClient.create({
        _type: 'headerSection',
        _id: 'headerSection-auto',
        navLinks: [
          { label: 'About', href: '#about' },
          { label: 'Projects', href: '#projects' },
          { label: 'Contact', href: '#contact' },
        ],
        buttonText: 'Request a Quote',
        buttonLink: '#contact',
      })
      
      console.log('✅ Created new headerSection with navigation links!')
      console.log('Navigation links:', newDoc.navLinks)
      return
    }
    
    console.log('📝 Current navigation links:', headerDoc.navLinks)
    
    // Update the navigation links to match section IDs
    const updatedNavLinks = [
      { label: 'About', href: '#about' },
      { label: 'Projects', href: '#projects' },
      { label: 'Contact', href: '#contact' },
    ]
    
    // Update the document
    const updated = await writeClient
      .patch(headerDoc._id)
      .set({ navLinks: updatedNavLinks })
      .commit()
    
    console.log('✅ Successfully updated headerSection navigation links!')
    console.log('New navigation links:', updated.navLinks)
    
    // Also update buttonLink if it exists
    if (headerDoc.buttonLink && headerDoc.buttonLink !== '#contact') {
      await writeClient
        .patch(headerDoc._id)
        .set({ buttonLink: '#contact' })
        .commit()
      console.log('✅ Updated button link to #contact')
    }
    
  } catch (error) {
    if (error.statusCode === 403 || error.message?.includes('permission')) {
      console.error('❌ Permission Error: The token does not have write permissions.')
      console.log('\n📝 Please update the header links manually:')
      console.log('   Option 1: Use Admin Panel (http://localhost:3000/admin)')
      console.log('   Option 2: Use Sanity Studio (http://localhost:3333)')
      console.log('\n   Navigation links to set:')
      console.log('   - About → #about')
      console.log('   - Projects → #projects')
      console.log('   - Contact → #contact')
    } else {
      console.error('❌ Error updating header links:', error.message)
    }
    process.exit(1)
  }
}

updateHeaderLinks()

