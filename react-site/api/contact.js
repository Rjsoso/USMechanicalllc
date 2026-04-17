import { Resend } from 'resend'

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX = 10
const ipBuckets = new Map()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', code: 'method_not_allowed' })
  }

  const { name, email, phone, message, 'cf-turnstile-response': token } = req.body

  const ip =
    (req.headers['x-forwarded-for']?.split(',')?.[0] || req.socket?.remoteAddress || '').trim() ||
    'unknown'
  const now = Date.now()
  const bucket = ipBuckets.get(ip) || []
  const recent = bucket.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) {
    ipBuckets.set(ip, recent)
    return res.status(429).json({
      error: 'Too many requests. Please try again later.',
      code: 'rate_limited',
    })
  }
  recent.push(now)
  ipBuckets.set(ip, recent)

  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    return res
      .status(500)
      .json({ error: 'Server configuration error: missing secret key', code: 'server_misconfigured' })
  }

  if (!token) {
    return res.status(400).json({
      error: 'Verification token missing. Please complete the verification.',
      code: 'turnstile_missing',
    })
  }

  const normalizedName = normalizeText(name, 100)
  const normalizedEmail = normalizeEmail(email)
  const normalizedPhone = normalizeText(phone, 20)
  const normalizedMessage = normalizeText(message, 5000)

  const validationError = validatePayload({
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
    message: normalizedMessage,
  })
  if (validationError) {
    return res.status(400).json({
      error: validationError.message,
      code: validationError.code,
    })
  }

  // Validate Turnstile token server-side (Cloudflare recommends form-encoded)
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    const body = new URLSearchParams({
      secret: secretKey,
      response: token,
    })
    if (ip && ip !== 'unknown') {
      body.set('remoteip', ip)
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!verifyRes.ok) {
      return res.status(502).json({
        error: 'Verification service unavailable. Please try again.',
        code: 'turnstile_unavailable',
      })
    }

    const verifyData = await verifyRes.json()
    if (!verifyData.success) {
      return res.status(400).json({
        error: 'Verification failed. Please refresh and try again.',
        code: 'turnstile_failed',
      })
    }
  } catch (err) {
    const isAbort = err && typeof err === 'object' && err.name === 'AbortError'
    return res.status(502).json({
      error: isAbort
        ? 'Verification timed out. Please try again.'
        : 'Verification service unavailable. Please try again.',
      code: isAbort ? 'turnstile_timeout' : 'turnstile_unavailable',
    })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    return res
      .status(500)
      .json({ error: 'Server configuration error: email not configured', code: 'server_misconfigured' })
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
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${escapeHtml(normalizedName)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">Email</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(normalizedEmail)}" style="color: #2563eb;">${escapeHtml(normalizedEmail)}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">Phone</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${escapeHtml(normalizedPhone || '—')}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; vertical-align: top; font-weight: 600;">Message</td>
          <td style="padding: 10px 0; white-space: pre-wrap;">${escapeHtml(normalizedMessage)}</td>
        </tr>
      </table>
      <p style="margin: 20px 0 0; font-size: 13px; color: #64748b;">Reply to this email to respond directly to the sender.</p>
    </div>
  </div>
</body>
</html>
`.trim()

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: normalizedEmail,
    subject: `Contact form: ${(name || 'Someone').slice(0, 50)}`,
    html,
  })

  if (error) {
    console.error('Resend error:', error)
    return res.status(500).json({ error: 'Failed to send message. Please try again later.', code: 'send_failed' })
  }

  return res.status(200).json({ success: true })
}

function normalizeText(value, maxLen) {
  if (value == null) return ''
  const s = String(value).replace(/\s+/g, ' ').trim()
  if (!maxLen) return s
  return s.slice(0, maxLen)
}

function normalizeEmail(value) {
  if (value == null) return ''
  return String(value).trim().toLowerCase().slice(0, 254)
}

function validatePayload({ name, email, phone, message }) {
  if (!name) return { code: 'invalid_name', message: 'Name is required.' }
  if (name.length < 2) return { code: 'invalid_name', message: 'Please enter your full name.' }
  if (!email) return { code: 'invalid_email', message: 'Email is required.' }
  if (!looksLikeEmail(email)) return { code: 'invalid_email', message: 'Please enter a valid email address.' }
  if (phone && phone.length > 20) return { code: 'invalid_phone', message: 'Phone number is too long.' }
  if (!message) return { code: 'invalid_message', message: 'Message is required.' }
  if (message.length < 10)
    return { code: 'invalid_message', message: 'Message must be at least 10 characters.' }
  if (message.length > 5000)
    return { code: 'invalid_message', message: 'Message is too long.' }
  return null
}

function looksLikeEmail(email) {
  // Simple sanity check; avoids heavy regex and handles most real-world emails.
  if (!email || typeof email !== 'string') return false
  if (email.length > 254) return false
  const at = email.indexOf('@')
  if (at <= 0 || at !== email.lastIndexOf('@')) return false
  const domain = email.slice(at + 1)
  if (!domain || domain.startsWith('.') || domain.endsWith('.')) return false
  return domain.includes('.')
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
