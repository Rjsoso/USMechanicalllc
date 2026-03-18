import { Resend } from 'resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, message, 'cf-turnstile-response': token } = req.body

  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    return res.status(500).json({ error: 'Server configuration error: missing secret key' })
  }

  if (!token) {
    return res.status(400).json({ error: 'Verification token missing. Please complete the verification.' })
  }

  // Validate Turnstile token server-side
  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: secretKey,
      response: token,
    }),
  })

  const verifyData = await verifyRes.json()

  if (!verifyData.success) {
    return res.status(400).json({ error: 'Verification failed. Please refresh and try again.' })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
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

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: email,
    subject: `Contact form: ${(name || 'Someone').slice(0, 50)}`,
    html,
  })

  if (error) {
    console.error('Resend error:', error)
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' })
  }

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
