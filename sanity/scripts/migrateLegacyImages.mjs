import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

async function migrateLegacyImages() {
  console.log('Starting migration of legacy images...\n')

  try {
    // Fetch the current document
    const doc = await client.fetch(`
      *[_type == "aboutAndSafety"][0] {
        _id,
        _rev,
        photo1,
        safetyImage,
        safetyImage2,
        aboutPhotos,
        safetyLogos
      }
    `)

    if (!doc) {
      console.log('❌ No aboutAndSafety document found')
      return
    }

    console.log('Current document status:')
    console.log('  - aboutPhotos count:', doc.aboutPhotos?.length || 0)
    console.log('  - safetyLogos count:', doc.safetyLogos?.length || 0)
    console.log('')

    // Check if legacy images are already in modern arrays
    const legacyPhotoRef = doc.photo1?.asset?._ref
    const legacySafetyImageRef = doc.safetyImage?.asset?._ref
    const legacySafetyImage2Ref = doc.safetyImage2?.asset?._ref

    console.log('Legacy field references:')
    console.log('  - photo1:', legacyPhotoRef || 'none')
    console.log('  - safetyImage:', legacySafetyImageRef || 'none')
    console.log('  - safetyImage2:', legacySafetyImage2Ref || 'none')
    console.log('')

    // Check if these refs exist in modern arrays
    const aboutPhotoRefs = (doc.aboutPhotos || []).map(p => p.asset?._ref).filter(Boolean)
    const safetyLogoRefs = (doc.safetyLogos || []).map(l => l.image?.asset?._ref).filter(Boolean)

    console.log('Modern array references:')
    console.log('  - aboutPhotos refs:', aboutPhotoRefs)
    console.log('  - safetyLogos refs:', safetyLogoRefs)
    console.log('')

    const photo1InModern = legacyPhotoRef ? aboutPhotoRefs.includes(legacyPhotoRef) : true
    const safetyImageInModern = legacySafetyImageRef ? safetyLogoRefs.includes(legacySafetyImageRef) : true
    const safetyImage2InModern = legacySafetyImage2Ref ? safetyLogoRefs.includes(legacySafetyImage2Ref) : true

    console.log('Migration check:')
    console.log('  - photo1 in aboutPhotos:', photo1InModern ? '✅' : '❌ NEEDS MIGRATION')
    console.log('  - safetyImage in safetyLogos:', safetyImageInModern ? '✅' : '❌ NEEDS MIGRATION')
    console.log('  - safetyImage2 in safetyLogos:', safetyImage2InModern ? '✅' : '❌ NEEDS MIGRATION')
    console.log('')

    if (photo1InModern && safetyImageInModern && safetyImage2InModern) {
      console.log('✅ All legacy images are already migrated to modern arrays!')
      console.log('✅ Safe to remove legacy fields from schema and frontend.')
      return
    }

    console.log('⚠️  Some legacy images need migration.')
    console.log('Note: This script is read-only. Manual migration would be needed.')
    console.log('However, the frontend fallback logic will continue to work until fields are removed.')

  } catch (error) {
    console.error('Error during migration check:', error)
  }
}

migrateLegacyImages()
