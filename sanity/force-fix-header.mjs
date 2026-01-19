// Force delete corrupted upload using dataset mutations
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function forceFixHeader() {
  console.log('🔧 Force removing corrupted logo upload...')
  
  try {
    const result = await client
      .patch('headerSection')
      .unset(['logo'])
      .commit({ autoGenerateArrayKeys: true })
    
    console.log('✅ Successfully removed corrupted logo!')
    console.log('Result:', result)
    console.log('\n🎉 Now refresh your browser and try uploading again!')
    console.log('📌 Remember: Upload PNG/JPG files only, NOT PDFs\n')
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n🔄 Alternative: Try this in Sanity Studio Vision tool:')
    console.log(`
// Copy and paste this into Vision (Tools > Vision):
import { getCliClient } from 'sanity/cli'
const client = getCliClient()
client.patch('headerSection').unset(['logo']).commit()
    `)
  }
}

forceFixHeader()
