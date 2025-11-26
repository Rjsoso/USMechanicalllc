// Script to create initial documents in Sanity if they don't exist
// Run with: npx ts-node sanity/scripts/createInitialDocuments.ts

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // You'll need to set this
})

const documentsToCreate = [
  {
    _id: 'headerSection',
    _type: 'headerSection',
    // Add default fields here
  },
  {
    _id: 'heroSection',
    _type: 'heroSection',
    headline: 'Trusted Mechanical Contractors Since 1963',
    subtext: 'Excellence in Plumbing, HVAC, and Mechanical Systems',
    buttonText: 'Request a Quote',
    buttonLink: '#contact',
  },
  {
    _id: 'aboutAndSafety',
    _type: 'aboutAndSafety',
    // Add default fields
  },
  {
    _id: 'companyStats',
    _type: 'companyStats',
    // Add default fields
  },
  {
    _id: 'ourServices',
    _type: 'ourServices',
    sectionTitle: 'Our Services',
    // Add default fields
  },
  {
    _id: 'contact',
    _type: 'contact',
    // Add default fields
  },
  {
    _id: 'companyInfo',
    _type: 'companyInfo',
    name: 'U.S. Mechanical LLC',
    // Add default fields
  },
  {
    _id: 'formSettings',
    _type: 'formSettings',
    // Add default fields
  },
]

async function createDocuments() {
  for (const doc of documentsToCreate) {
    try {
      // Check if document exists
      const existing = await client.fetch(`*[_id == "${doc._id}"][0]`)
      
      if (!existing) {
        console.log(`Creating ${doc._type}...`)
        await client.create(doc)
        console.log(`✅ Created ${doc._type}`)
      } else {
        console.log(`⏭️  ${doc._type} already exists`)
      }
    } catch (error) {
      console.error(`❌ Error creating ${doc._type}:`, error)
    }
  }
}

createDocuments()

