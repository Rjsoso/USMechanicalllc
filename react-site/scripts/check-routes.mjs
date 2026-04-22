#!/usr/bin/env node
/**
 * Build-time guard: every React Router <Route path="..."> in App.jsx must
 * have a matching rewrite in vercel.json. Without this, a newly added
 * top-level route would work locally (client router handles it) but return
 * a soft 404 in production because Vercel wouldn't know to serve
 * index.html.
 *
 * Fails the build if drift is detected so deploys can't ship broken SEO.
 *
 * Exceptions:
 *   - The catch-all "*" route is skipped (handled by 404.html).
 *   - Hash-only fragments ("#services") aren't routes.
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = join(__dirname, '..')

const APP_PATH = join(root, 'src', 'App.jsx')
const VERCEL_PATH = join(root, 'vercel.json')

function extractAppRoutes() {
  const src = readFileSync(APP_PATH, 'utf8')
  const routes = new Set()
  const pattern = /<Route\s+path=(?:"([^"]+)"|\{["']([^"']+)["']\})/g
  let match
  while ((match = pattern.exec(src))) {
    const path = match[1] || match[2]
    if (!path || path === '*') continue
    routes.add(path)
  }
  return [...routes].sort()
}

function extractVercelRewrites() {
  const json = JSON.parse(readFileSync(VERCEL_PATH, 'utf8'))
  const sources = new Set()
  for (const r of json.rewrites || []) {
    if (r && r.source) sources.add(r.source)
  }
  return [...sources].sort()
}

function main() {
  const appRoutes = extractAppRoutes()
  const vercelRewrites = extractVercelRewrites()

  if (appRoutes.length === 0) {
    console.error('[check-routes] Could not parse any <Route path> from App.jsx')
    process.exit(1)
  }

  const missing = appRoutes.filter((p) => !vercelRewrites.includes(p))

  console.log(`[check-routes] App routes:     ${appRoutes.length}`)
  console.log(`[check-routes] Vercel rewrites: ${vercelRewrites.length}`)

  if (missing.length > 0) {
    console.error('\n[check-routes] ❌ Routes defined in App.jsx but missing from vercel.json rewrites:')
    for (const p of missing) {
      console.error(`   - ${p}`)
    }
    console.error('\nAdd each missing path to the "rewrites" array in react-site/vercel.json,')
    console.error('pointing it to "/index.html". Without this, production will soft-404 on reload.\n')
    process.exit(1)
  }

  // Warn (don't fail) if vercel.json has rewrites that no App route claims — these
  // might be stale or they might be legitimate redirect landing paths. Soft signal.
  const stale = vercelRewrites.filter((p) => !appRoutes.includes(p))
  if (stale.length > 0) {
    console.warn('\n[check-routes] ⚠  vercel.json rewrites with no matching App.jsx <Route>:')
    for (const p of stale) {
      console.warn(`   - ${p}`)
    }
    console.warn('   (Not a failure — verify these are still needed.)\n')
  }

  console.log('[check-routes] ✅ All React routes are covered by vercel.json rewrites.\n')
}

main()
