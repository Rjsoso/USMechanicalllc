#!/usr/bin/env node
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { join } from 'path'

console.log('🔍 Loading Sanity credentials...\n')

// Try multiple token sources
let token = process.env.VITE_SANITY_WRITE_TOKEN || 
            process.env.SANITY_WRITE_TOKEN || 
            process.env.SANITY_API_TOKEN

// Load from .env file if not in environment
if (!token) {
  try {
    const envPath = join(process.cwd(), '.env')
    const envFile = readFileSync(envPath, 'utf-8')
    
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length) {
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
        if (key.trim() === 'VITE_SANITY_WRITE_TOKEN') {
          token = value
        }
      }
    })
  } catch (err) {
    console.error('❌ Could not read .env file:', err.message)
  }
}

if (!token) {
  console.error('❌ No Sanity write token found!')
  console.log('💡 Make sure VITE_SANITY_WRITE_TOKEN is in react-site/.env\n')
  process.exit(1)
}

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: token,
})

const documentIds = [
  '4b3afd35-8572-475b-82a7-d8d2fd98010e', // servicesSection
  'cdd58cfc-e3fd-4f9a-8f09-d91aece89a69', // servicesPage
]

async function deleteOrphanedDocs() {
  console.log('🔍 Checking for orphaned documents...\n')
  
  for (const docId of documentIds) {
    try {
      // First check if document exists
      const doc = await client.getDocument(docId)
      
      if (doc) {
        console.log(`📄 Found: ${doc._type} (ID: ${docId})`)
        console.log(`   Title: ${doc.title || doc.sectionTitle || 'N/A'}`)
        
        // Delete the document
        await client.delete(docId)
        console.log(`✅ Deleted successfully!\n`)
      }
    } catch (err) {
      if (err.statusCode === 404) {
        console.log(`✓ Document ${docId} already deleted or doesn't exist\n`)
      } else {
        console.error(`❌ Error with document ${docId}:`, err.message, '\n')
      }
    }
  }
  
  console.log('✅ Cleanup complete!')
}

deleteOrphanedDocs().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
