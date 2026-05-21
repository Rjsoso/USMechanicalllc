/**
 * Ensure production domains can fetch Sanity content in the browser.
 * Without these CORS origins the live site shows no logo, hero background,
 * portfolio, services, etc. (only hardcoded fallbacks).
 *
 * Run from sanity/: npm run ensure-cors
 */
import { getCliClient } from 'sanity/cli'

const REQUIRED_ORIGINS = [
  'https://www.usmechanicalllc.com',
  'https://usmechanicalllc.com',
  'http://localhost:3000',
  'http://localhost:5173',
]

const client = getCliClient()

async function listOrigins() {
  // sanity cors list is CLI-only; use management API via client if available
  const { execSync } = await import('node:child_process')
  const out = execSync('npx sanity cors list', { encoding: 'utf8', cwd: process.cwd() })
  return out
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

async function main() {
  console.log('🔍 Checking Sanity CORS origins…\n')
  const existing = await listOrigins()

  for (const origin of REQUIRED_ORIGINS) {
    if (existing.includes(origin)) {
      console.log(`✓ ${origin}`)
      continue
    }
    const { execSync } = await import('node:child_process')
    execSync(`npx sanity cors add ${origin} --credentials`, {
      encoding: 'utf8',
      cwd: process.cwd(),
      stdio: 'inherit',
    })
    console.log(`✅ Added ${origin}`)
  }

  console.log('\n✨ CORS origins are configured for production and local dev.')
}

main().catch((err) => {
  console.error('❌ ensure-cors failed:', err.message)
  process.exit(1)
})
