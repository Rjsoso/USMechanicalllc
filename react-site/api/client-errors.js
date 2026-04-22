/* global process */
/**
 * Lightweight client error sink for the ErrorBoundary. Emits one structured
 * JSON log line per accepted event so operators can grep Vercel logs for
 * `[client-error]` and see what users are actually hitting.
 *
 * Intentionally minimal: no storage, no PII. Rate-limited per IP via Upstash
 * when available so one bad client can't flood the logs.
 */
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const MAX_FIELD = 1000
const MAX_STACK = 4000

let ratelimiter = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    // Allow some bursts — a crash loop will naturally send a handful.
    limiter: Ratelimit.slidingWindow(30, '1 h'),
    analytics: false,
    prefix: 'ratelimit:client-errors',
  })
}

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (xff) {
    const first = Array.isArray(xff) ? xff[0] : String(xff).split(',')[0]
    return first.trim()
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}

function truncate(value, max) {
  if (value == null) return ''
  const s = String(value)
  return s.length > max ? s.slice(0, max) + '…[truncated]' : s
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const clientIp = getClientIp(req)

  if (ratelimiter) {
    try {
      const { success } = await ratelimiter.limit(clientIp)
      if (!success) {
        // Silently swallow — we never want the ErrorBoundary to see retries.
        return res.status(200).json({ ok: true, rateLimited: true })
      }
    } catch {
      // fail open
    }
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {}

  const entry = {
    level: 'error',
    source: 'client',
    at: new Date().toISOString(),
    ip: clientIp,
    message: truncate(body.message, MAX_FIELD),
    name: truncate(body.name, 200),
    stack: truncate(body.stack, MAX_STACK),
    componentStack: truncate(body.componentStack, MAX_STACK),
    url: truncate(body.url, MAX_FIELD),
    userAgent: truncate(req.headers['user-agent'], 500),
    release: truncate(body.release, 100),
  }

  // Vercel/Node logs capture stderr → searchable in the dashboard.
  console.error('[client-error]', JSON.stringify(entry))

  return res.status(200).json({ ok: true })
}
