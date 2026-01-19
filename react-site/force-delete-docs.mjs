#!/usr/bin/env node
import { createClient } from '@sanity/client'

const token = "skexJH7UPy24LixFAGVID0J28j7St7b4hAfq9Ch6F6ru5hbjDC02V6ikSFV2PLnpc3OVmLBemQ8N6Q4qnOg1mss3R4Zvcs692ltxxFsVieQ8ooUEaokTiMRala7oPJsZ6EPhpVFENrTj3yDLdsK28AT9gHOjOSDox7aQOTtWZvna68SeBBFf"

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: token,
})

const documentIds = [
  '4b3afd35-8572-475b-82a7-d8d2fd98010e',
  'cdd58cfc-e3fd-4f9a-8f09-d91aece89a69',
]

async function forceDelete() {
  console.log('🔍 Attempting force delete with mutations...\n')
  
  for (const docId of documentIds) {
    try {
      console.log(`Deleting document: ${docId}`)
      
      // Try using mutations API
      const result = await client
        .transaction()
        .delete(docId)
        .commit()
      
      console.log(`✅ Successfully deleted: ${docId}\n`)
    } catch (err) {
      console.error(`❌ Error deleting ${docId}:`)
      console.error(`   Status: ${err.statusCode}`)
      console.error(`   Message: ${err.message}`)
      console.error(`   Details: ${JSON.stringify(err.details, null, 2)}\n`)
    }
  }
}

forceDelete().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
