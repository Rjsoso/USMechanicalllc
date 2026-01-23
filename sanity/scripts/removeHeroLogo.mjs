import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

async function removeHeroLogo() {
  console.log('Removing logo field from heroSection...\n')

  try {
    // First, check current state
    const current = await client.fetch(`*[_id == "heroSection"][0]`)
    
    if (!current) {
      console.log('No heroSection document found')
      return
    }

    console.log('Current hero document has these fields:')
    console.log(Object.keys(current).join(', '))
    
    if (!current.logo) {
      console.log('\nNo logo field found. Already clean!')
      return
    }

    console.log('\nFound logo field. Removing...')
    
    // Use unset to remove the logo field
    const result = await client
      .patch('heroSection')
      .unset(['logo'])
      .commit()

    console.log('\nSuccess! Logo field removed.')
    console.log('Updated document revision:', result._rev)
    
    // Verify removal
    const updated = await client.fetch(`*[_id == "heroSection"][0]`)
    console.log('\nVerification - Remaining fields:')
    console.log(Object.keys(updated).filter(k => !k.startsWith('_')).join(', '))
    
  } catch (error) {
    console.error('Error:', error)
  }
}

removeHeroLogo()
