/* global process */
import { Resend } from 'resend'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const NAME_MAX = 100
const EMAIL_MAX = 254
const PHONE_MAX = 20
const MESSAGE_MAX = 5000
const MESSAGE_MIN = 10

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const SPAM_KEYWORDS = [
  'viagra', 'cialis', 'casino', 'lottery', 'prize', 'winner',
  'click here', 'buy now', 'limited time', 'act now',
  'cryptocurrency', 'bitcoin', 'investment opportunity',
  'work from home', 'make money fast', 'free money',
]
const SUSPICIOUS_EMAIL_FRAGMENTS = ['.ru', '.cn', 'tempmail', 'throwaway', 'guerrillamail']

let ratelimiter = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    analytics: true,
    prefix: 'ratelimit:contact',
  })
}

function stripHtml(value) {
  if (value == null) return ''
  return String(value).replace(/<[^>]*>/g, '').trim()
}

function isSpam({ name, email, message }) {
  const haystack = `${name} ${message}`.toLowerCase()
  if (SPAM_KEYWORDS.some(k => haystack.includes(k))) return true

  const linkCount = (message.match(/https?:\/\//gi) || []).length
  if (linkCount > 2) return true

  const lowerEmail = email.toLowerCase()
  if (SUSPICIOUS_EMAIL_FRAGMENTS.some(d => lowerEmail.includes(d))) return true

  const words = message.split(/\s+/).filter(Boolean)
  if (words.length > 20) {
    const unique = new Set(words)
    if (unique.size / words.length < 0.3) return true
  }
  return false
}

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (xff) {
    const first = Array.isArray(xff) ? xff[0] : String(xff).split(',')[0]
    return first.trim()
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}

/**
 * Structured log helper. Emits `[contact] {json}` to stderr so Vercel's log
 * explorer can search/filter. Intentionally never includes PII: no name,
 * email body, phone, or message content — only metadata + lengths/flags.
 */
function logEvent(event, details = {}) {
  const entry = {
    event,
    at: new Date().toISOString(),
    ...details,
  }
  console.error('[contact]', JSON.stringify(entry))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {}

  const clientIpEarly = getClientIp(req)

  if (typeof body.website === 'string' && body.website.trim() !== '') {
    logEvent('honeypot_hit', { ip: clientIpEarly })
    return res.status(200).json({ success: true })
  }

  const name = stripHtml(body.name)
  const email = stripHtml(body.email)
  const phone = stripHtml(body.phone)
  const message = stripHtml(body.message)
  const token = body['cf-turnstile-response']

  if (!name || name.length < 2 || name.length > NAME_MAX) {
    logEvent('validation_failed', { ip: clientIpEarly, field: 'name', nameLen: name.length })
    return res.status(400).json({ error: 'Please enter a valid name (2–100 characters).' })
  }
  if (!email || email.length > EMAIL_MAX || !EMAIL_REGEX.test(email)) {
    logEvent('validation_failed', { ip: clientIpEarly, field: 'email', emailLen: email.length })
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }
  if (phone) {
    if (phone.length > PHONE_MAX) {
      logEvent('validation_failed', { ip: clientIpEarly, field: 'phone', reason: 'too_long' })
      return res.status(400).json({ error: 'Phone number is too long.' })
    }
    const cleaned = phone.replace(/[\s\-()+.]/g, '')
    if (!/^\d{10,15}$/.test(cleaned)) {
      logEvent('validation_failed', { ip: clientIpEarly, field: 'phone', reason: 'bad_format' })
      return res.status(400).json({ error: 'Please enter a valid phone number.' })
    }
  }
  if (!message || message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    logEvent('validation_failed', {
      ip: clientIpEarly,
      field: 'message',
      messageLen: message.length,
    })
    return res.status(400).json({ error: 'Message must be between 10 and 5000 characters.' })
  }
  if (isSpam({ name, email, message })) {
    logEvent('spam_flagged', {
      ip: clientIpEarly,
      messageLen: message.length,
      emailDomain: email.split('@')[1] || 'unknown',
    })
    return res.status(400).json({
      error: 'Your message was flagged as potential spam. Please remove any suspicious content and try again.',
    })
  }

  const clientIp = clientIpEarly

  if (ratelimiter) {
    try {
      const { success, reset, remaining } = await ratelimiter.limit(clientIp)
      if (!success) {
        const retryAfterSec = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
        res.setHeader('Retry-After', String(retryAfterSec))
        logEvent('rate_limited', { ip: clientIp, retryAfterSec })
        return res.status(429).json({
          error: 'Too many submissions from this network. Please try again later.',
        })
      }
      res.setHeader('X-RateLimit-Remaining', String(remaining))
    } catch (err) {
      logEvent('ratelimit_error_fail_open', { ip: clientIp, message: err?.message })
    }
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    logEvent('config_missing', { which: 'TURNSTILE_SECRET_KEY' })
    return res.status(500).json({ error: 'Server configuration error: missing secret key' })
  }
  if (!token) {
    logEvent('turnstile_token_missing', { ip: clientIp })
    return res.status(400).json({ error: 'Verification token missing. Please complete the verification.' })
  }

  let verifyData
  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        remoteip: clientIp,
      }),
    })
    verifyData = await verifyRes.json()
  } catch (err) {
    logEvent('turnstile_network_error', { ip: clientIp, message: err?.message })
    return res.status(503).json({
      error: 'Verification service is unavailable. Please try again in a moment.',
    })
  }

  if (!verifyData || !verifyData.success) {
    logEvent('turnstile_failed', {
      ip: clientIp,
      errorCodes: (verifyData && verifyData['error-codes']) || [],
    })
    return res.status(400).json({ error: 'Verification failed. Please refresh and try again.' })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    logEvent('config_missing', { which: 'RESEND_API_KEY' })
    return res.status(500).json({ error: 'Server configuration error: email not configured' })
  }

  const toEmail = process.env.CONTACT_FORM_TO_EMAIL || 'info@usmechanicalllc.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'US Mechanical Contact <onboarding@resend.dev>'

  const resend = new Resend(resendKey)

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New contact form submission</title>
</head>
<body style="margin:0; font-family: system-ui, -apple-system, sans-serif; font-size: 16px; line-height: 1.5; color: #1a1a1a; background: #f5f5f5; padding: 24px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); overflow: hidden;">
    <div style="background: #0f172a; color: #fff; padding: 20px 24px;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 600;">New contact form submission</h1>
      <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">US Mechanical website</p>
    </div>
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; width: 100px;">Name</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">Email</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(email)}" style="color: #2563eb;">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">Phone</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${escapeHtml(phone || '—')}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; vertical-align: top; font-weight: 600;">Message</td>
          <td style="padding: 10px 0; white-space: pre-wrap;">${escapeHtml(message)}</td>
        </tr>
      </table>
      <p style="margin: 20px 0 0; font-size: 13px; color: #64748b;">Reply to this email to respond directly to the sender.</p>
    </div>
  </div>
</body>
</html>
`.trim()

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: email,
    subject: `Contact form: ${(name || 'Someone').slice(0, 50)}`,
    html,
  })

  if (error) {
    logEvent('resend_error', {
      ip: clientIp,
      name: error?.name || 'unknown',
      message: error?.message || String(error),
    })
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' })
  }

  logEvent('success', {
    ip: clientIp,
    nameLen: name.length,
    messageLen: message.length,
    hasPhone: Boolean(phone),
    emailDomain: email.split('@')[1] || 'unknown',
  })
  return res.status(200).json({ success: true })
}

function escapeHtml(text) {
  if (text == null) return ''
  const s = String(text)
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
