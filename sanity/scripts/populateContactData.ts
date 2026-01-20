import { createClient } from '@sanity/client'

// Create write client for populating data
const writeClient = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN, // Uses CLI token when run with --with-user-token
})

async function populateContactData() {
  console.log('🔄 Starting Contact Page data population...')
  console.log('Project: 3vpl3hho, Dataset: production')

  const contactData = {
    _id: 'contact',
    _type: 'contact',
    heroTitle: 'Contact U.S. Mechanical',
    description: 'Get in touch with our team for all your mechanical contracting needs.',
    
    // Main office
    offices: [
      {
        _type: 'office',
        _key: 'pleasant-grove',
        locationName: 'Pleasant Grove Office',
        address: '472 South 640 West\nPleasant Grove, UT 84062',
        phone: '(801) 785-6028',
        fax: '(801) 785-3849'
      }
    ],
    
    // Affiliate companies (empty for now, can be added later in Sanity Studio)
    affiliates: [],
    
    // Form settings
    formSettings: {
      _type: 'formSettings',
      headline: 'Send Us a Message',
      submitButtonText: 'Submit'
    },
    
    // Company info for footer
    email: 'info@usmechanicalllc.com',
    licenseInfo: 'Licensed in UT, NV, AZ'
  }

  try {
    // Step 1: Check for existing contact documents
    console.log('\n📋 Checking for existing contact documents...')
    const existing = await writeClient.fetch(`*[_type == "contact"]._id`)
    
    if (existing.length > 0) {
      console.log(`Found ${existing.length} existing document(s):`, existing)
      
      // Delete all existing contact documents (both draft and published)
      for (const id of existing) {
        await writeClient.delete(id)
        console.log(`✓ Deleted: ${id}`)
      }
    } else {
      console.log('No existing contact documents found.')
    }

    // Step 2: Create fresh contact document
    console.log('\n📝 Creating fresh Contact document...')
    const result = await writeClient.create(contactData)
    console.log(`✓ Document created with ID: ${result._id}`)
    console.log(`✓ Type: ${result._type}`)
    console.log(`✓ Title: ${result.heroTitle}`)
    console.log(`✓ Office count: ${result.offices?.length || 0}`)
    
    console.log('\n✅ Contact Page data populated successfully!')
    console.log('\n📌 NEXT STEPS:')
    console.log('1. Go to Sanity Studio: https://us-mechanicalsanity.vercel.app/studio')
    console.log('2. Open "9. Contact Page (Footer + Contact)"')
    console.log('3. Review the populated data')
    console.log('4. Click the green "Publish" button (top-right)')
    console.log('5. This will trigger the webhook and deploy to Vercel')
    console.log('\n⏰ After publishing, check Vercel deployments in 30 seconds.')
    
  } catch (error) {
    console.error('\n❌ Error populating contact data:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Stack:', error.stack)
    }
    process.exit(1)
  }
}

// Run the population
populateContactData()
  .then(() => {
    console.log('\n✨ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })
