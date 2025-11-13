import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
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
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.VITE_SANITY_WRITE_TOKEN,
})

async function seedServicesSection() {
  if (!process.env.VITE_SANITY_WRITE_TOKEN) {
    console.error('❌ VITE_SANITY_WRITE_TOKEN not found in environment variables')
    console.error('   Please add it to your .env file in the react-site directory')
    process.exit(1)
  }

  try {
    // Check if document already exists
    const existing = await client.fetch(`*[_type == "servicesSection"][0]`)
    
    const document = {
      _type: 'servicesSection',
      title: 'Our Services',
      services: [
        {
          _type: 'object',
          name: 'Plumbing',
          description: 'Full-service plumbing for commercial and industrial projects.',
        },
        {
          _type: 'object',
          name: 'HVAC',
          description: 'Installation and maintenance of large-scale systems.',
        },
        {
          _type: 'object',
          name: 'Sheet Metal',
          description: 'Custom fabrication and design solutions.',
        },
      ],
    }

    if (existing) {
      console.log('Updating existing Services Section document...')
      document._id = existing._id
      await client.createOrReplace(document)
      console.log('✅ Services Section updated successfully!')
    } else {
      console.log('Creating new Services Section document...')
      await client.create(document)
      console.log('✅ Services Section created successfully!')
    }
  } catch (error) {
    console.error('❌ Error seeding Services Section:', error.message)
    if (error.message.includes('token') || error.message.includes('401')) {
      console.error('\n⚠️  Authentication failed. Please check your VITE_SANITY_WRITE_TOKEN')
    }
    process.exit(1)
  }
}

seedServicesSection()

