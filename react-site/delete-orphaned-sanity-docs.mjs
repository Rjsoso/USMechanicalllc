#!/usr/bin/env node
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load environment variables
const envPath = join(__dirname, '.env')
let token = process.env.VITE_SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN

if (!token) {
  try {
    const envFile = readFileSync(envPath, 'utf-8')
    envFile.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length) {
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
        if (key.trim() === 'VITE_SANITY_WRITE_TOKEN' || key.trim() === 'SANITY_WRITE_TOKEN' || key.trim() === 'SANITY_API_TOKEN') {
          token = value
        }
      }
    })
  } catch (err) {
    // No .env file
  }
}

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: token,
})

async function deleteOrphanedDocuments() {
  console.log('\n🔍 Searching for orphaned documents...\n')

  const orphanedDocIds = [
    '4b3afd35-8572-475b-82a7-d8d2fd98010e', // servicesSection
    'cdd58cfc-e3fd-4f9a-8f09-d91aece89a69'  // servicesPage
  ]

  let totalDeleted = 0
  let errors = []

  for (const docId of orphanedDocIds) {
    try {
      // First, try to fetch the document to confirm it exists
      const doc = await client.fetch(`*[_id == "${docId}"][0]`)
      
      if (doc) {
        console.log(`📄 Found document: ${docId}`)
        console.log(`   Type: ${doc._type}`)
        if (doc.title) console.log(`   Title: ${doc.title}`)
        
        // Delete the document
        await client.delete(docId)
        totalDeleted++
        console.log(`   ✅ DELETED successfully\n`)
      } else {
        console.log(`⚠️  Document ${docId} not found (may have been already deleted)\n`)
      }
    } catch (error) {
      console.error(`❌ Error processing document ${docId}:`)
      console.error(`   ${error.message}\n`)
      errors.push({ docId, error: error.message })
    }
  }

  console.log('='.repeat(60))
  console.log(`📊 Deletion Summary`)
  console.log('='.repeat(60))
  console.log(`✅ Successfully deleted: ${totalDeleted} document(s)`)
  if (errors.length > 0) {
    console.log(`❌ Errors: ${errors.length}`)
    errors.forEach(e => {
      console.log(`   - ${e.docId}: ${e.error}`)
    })
  }
  console.log('='.repeat(60) + '\n')

  if (totalDeleted > 0) {
    console.log('✨ Cleanup complete! The orphaned documents have been removed.')
    console.log('💡 These documents were using deleted schema types and causing content conflicts.\n')
  } else if (errors.length === 0) {
    console.log('✨ No orphaned documents found - your dataset is already clean!\n')
  }

  return { totalDeleted, errors }
}

// Run the deletion
console.log('═'.repeat(60))
console.log('🗑️  ORPHANED DOCUMENT CLEANUP')
console.log('═'.repeat(60))
console.log('Project: us-mechanicalllc (3vpl3hho)')
console.log('Dataset: production')
console.log('═'.repeat(60))

deleteOrphanedDocuments()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error.message)
    process.exit(1)
  })
