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

  // Forward clean data to Formspree (no token)
  const formspreeRes = await fetch('https://formspree.io/f/xgvrvody', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, message }),
  })

  if (!formspreeRes.ok) {
    return res.status(500).json({ error: 'Failed to submit form. Please try again.' })
  }

  return res.status(200).json({ success: true })
}
