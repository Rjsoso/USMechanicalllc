import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
const envPath = join(process.cwd(), '.env')
try {
  const envFile = readFileSync(envPath, 'utf-8')
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length) {
      process.env[key.trim()] = valueParts.join('=').trim()
    }
  })
} catch (err) {
  console.log('No .env file found, using environment variables')
}

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.VITE_SANITY_WRITE_TOKEN,
})

async function migrateServicesSection() {
  if (!process.env.VITE_SANITY_WRITE_TOKEN) {
    console.error('❌ VITE_SANITY_WRITE_TOKEN not found in environment variables')
    console.error('   Please add it to your .env file in the react-site directory')
    process.exit(1)
  }

  try {
    console.log('📦 Fetching existing servicesSection document...')
    
    // Fetch the existing servicesSection document
    const existingData = await client.fetch(`*[_type == "servicesSection"][0]{
      _id,
      title,
      services[] {
        name,
        description,
        icon
      }
    }`)

    if (!existingData) {
      console.log('⚠️  No servicesSection document found. Nothing to migrate.')
      return
    }

    console.log(`✅ Found servicesSection document with title: "${existingData.title}"`)
    console.log(`   Services count: ${existingData.services?.length || 0}`)

    // Check if ourServices document already exists
    const existingOurServices = await client.fetch(`*[_type == "ourServices"][0]`)

    const newDocument = {
      _type: 'ourServices',
      title: existingData.title || 'Our Services',
      services: existingData.services || [],
    }

    if (existingOurServices) {
      console.log('📝 Updating existing ourServices document...')
      newDocument._id = existingOurServices._id
      await client.createOrReplace(newDocument)
      console.log('✅ Successfully updated ourServices document!')
    } else {
      console.log('✨ Creating new ourServices document...')
      await client.create(newDocument)
      console.log('✅ Successfully created ourServices document!')
    }

    console.log('\n🎉 Migration complete!')
    console.log('   Your services data is now available under "Our Services Section" in Sanity Studio.')
    console.log('   You can now delete the old "Our Services Section" (servicesSection) document if desired.')

  } catch (error) {
    console.error('❌ Error during migration:', error.message)
    if (error.message.includes('token') || error.message.includes('401')) {
      console.error('\n⚠️  Authentication failed. Please check your VITE_SANITY_WRITE_TOKEN')
    }
    process.exit(1)
  }
}

migrateServicesSection()

