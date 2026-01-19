// Fix stuck header section upload
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN || '', // Will use CLI auth if no token
  useCdn: false
})

async function fixHeaderSection() {
  console.log('🔍 Checking header section document...')
  
  try {
    // Fetch the header section
    const header = await client.fetch(`*[_type == "headerSection"][0]`)
    
    if (!header) {
      console.log('❌ No header section found')
      return
    }
    
    console.log('📋 Current header:', JSON.stringify(header, null, 2))
    
    // Check if logo has incomplete upload
    if (header.logo && (!header.logo.asset || !header.logo.asset._ref)) {
      console.log('🔧 Found corrupted logo reference - removing it...')
      
      // Remove the broken logo field
      await client
        .patch(header._id)
        .unset(['logo'])
        .commit()
      
      console.log('✅ Removed corrupted logo - try uploading again in Studio')
    } else if (header.logo && header.logo.asset) {
      console.log('✅ Logo looks OK:', header.logo.asset._ref)
    } else {
      console.log('ℹ️ No logo uploaded yet')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

fixHeaderSection()
