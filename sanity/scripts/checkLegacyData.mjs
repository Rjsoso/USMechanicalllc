import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
})

async function checkLegacyData() {
  console.log('Checking for legacy data in aboutAndSafety...\n')

  try {
    const data = await client.fetch(`
      *[_type == "aboutAndSafety"][0] {
        _id,
        "hasPhoto1": defined(photo1.asset._ref),
        "hasSafetyImage": defined(safetyImage.asset._ref),
        "hasSafetyImage2": defined(safetyImage2.asset._ref),
        "aboutPhotosCount": count(aboutPhotos),
        "safetyLogosCount": count(safetyLogos),
        photo1,
        safetyImage,
        safetyImage2
      }
    `)

    if (!data) {
      console.log('❌ No aboutAndSafety document found')
      return
    }

    console.log('📊 Legacy Field Status:')
    console.log('========================')
    console.log(`Photo1 field has data: ${data.hasPhoto1 ? '✅ YES' : '❌ NO'}`)
    console.log(`SafetyImage field has data: ${data.hasSafetyImage ? '✅ YES' : '❌ NO'}`)
    console.log(`SafetyImage2 field has data: ${data.hasSafetyImage2 ? '✅ YES' : '❌ NO'}`)
    console.log('')
    console.log('📊 Modern Field Status:')
    console.log('========================')
    console.log(`AboutPhotos array count: ${data.aboutPhotosCount || 0}`)
    console.log(`SafetyLogos array count: ${data.safetyLogosCount || 0}`)
    console.log('')

    const hasLegacyData = data.hasPhoto1 || data.hasSafetyImage || data.hasSafetyImage2
    
    if (hasLegacyData) {
      console.log('⚠️  WARNING: Legacy fields contain data!')
      console.log('   Migration required before removing these fields from schema.')
      console.log('')
      console.log('Legacy data details:')
      if (data.hasPhoto1) {
        console.log('  - photo1:', data.photo1?.asset?._ref || 'undefined')
      }
      if (data.hasSafetyImage) {
        console.log('  - safetyImage:', data.safetyImage?.asset?._ref || 'undefined')
      }
      if (data.hasSafetyImage2) {
        console.log('  - safetyImage2:', data.safetyImage2?.asset?._ref || 'undefined')
      }
    } else {
      console.log('✅ No legacy data found. Safe to remove legacy fields from schema!')
    }

  } catch (error) {
    console.error('Error checking legacy data:', error)
  }
}

checkLegacyData()
