/**
 * Creates Privacy Policy and Terms of Service documents in Sanity if they don't exist.
 * Run from project root with: npx sanity exec scripts/createLegalDocuments.ts --with-user-token
 * Or: npm run create-legal-docs (from sanity folder)
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN, // Uses CLI token when run with --with-user-token
})

const legalDocs = [
  { _id: 'legalPrivacy', _type: 'legalPage', title: 'Privacy Policy' },
  { _id: 'legalTerms', _type: 'legalPage', title: 'Terms of Service' },
]

async function main() {
  for (const doc of legalDocs) {
    try {
      const existing = await client.fetch(`*[_id == $id][0]._id`, { id: doc._id })
      if (existing) {
        console.log(`⏭️  ${doc.title} already exists`)
        continue
      }
      await client.create(doc)
      console.log(`✅ Created ${doc.title} (${doc._id})`)
    } catch (e) {
      console.error(`❌ Error creating ${doc.title}:`, e)
    }
  }
}

main()
