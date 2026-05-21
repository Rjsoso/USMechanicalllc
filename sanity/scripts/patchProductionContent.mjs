/**
 * Patch published Sanity production documents so live site matches
 * fallbacks.json / local React defaults (about licensing, careers benefits, etc.).
 *
 * Run from sanity/: npm run patch-production
 */
import { getCliClient } from 'sanity/cli'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fallbacks = JSON.parse(readFileSync(join(__dirname, 'fallbacks.json'), 'utf8'))

const client = getCliClient()

async function patchDoc(id, fields) {
  const existing = await client.fetch(`*[_id == $id][0]{ _id, _rev }`, { id })
  if (!existing?._id) {
    console.warn(`⚠  Skipping ${id} — document not found`)
    return false
  }

  await client.patch(id).set(fields).commit()
  console.log(`✅ Patched ${id}`)
  return true
}

async function main() {
  console.log('🔄 Patching Sanity production content from fallbacks.json…\n')

  await patchDoc('aboutAndSafety', {
    aboutText: fallbacks.about.aboutText,
    aboutTitle: fallbacks.about.aboutTitle,
    safetyTitle: fallbacks.about.safetyTitle,
    safetyText: fallbacks.about.safetyText,
  })

  await patchDoc('careers', {
    benefits: fallbacks.careers.benefits,
  })

  console.log('\n✨ Done. Live site should reflect updates within ~1 minute (Sanity CDN).')
}

main().catch((err) => {
  console.error('❌ Patch failed:', err.message)
  process.exit(1)
})
