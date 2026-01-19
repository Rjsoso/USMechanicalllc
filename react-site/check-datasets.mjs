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

async function checkDocuments() {
  console.log('🔍 Checking document details...\n')
  
  try {
    // Check all documents with these old types
    const query = '*[_type in ["servicesSection", "servicesPage"]] {_id, _type, _rev, _createdAt, _updatedAt, title, sectionTitle}'
    const docs = await client.fetch(query)
    
    console.log(`Found ${docs.length} documents:\n`)
    console.log(JSON.stringify(docs, null, 2))
    
  } catch (err) {
    console.error('Error fetching documents:', err)
  }
}

checkDocuments()
