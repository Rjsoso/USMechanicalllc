import { useEffect, useState, useRef, useCallback, memo } from 'react'
import { useLocation } from 'react-router-dom'
import SEO from '../components/SEO'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useSanityLive } from '../hooks/useSanityLive'
import { validateContactForm, sanitizeFormData, detectSpam } from '../utils/validation'
import {
  canSubmitForm,
  recordSubmission,
  formatTimeRemaining,
  getRemainingSubmissions,
} from '../utils/rateLimit'
import { getSiteUrl } from '../utils/siteUrl'
import { trackEvent } from '../utils/analytics'
import './ContactPage.css'

const CONTACT_QUERY = `*[_type == "contact" && _id == "contact"][0]{
  ...,
  backgroundImage { asset-> { _id, url } }
}`

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/**
 * Ensure the Turnstile API script is present exactly once and returns a
 * promise that resolves when `window.turnstile` is ready. Handles the case
 * where index.html already inserted the script (the common path).
 */
function loadTurnstile() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  if (window.turnstile) return Promise.resolve(window.turnstile)

  return new Promise((resolve, reject) => {
    let existing = document.querySelector(`script[src^="${TURNSTILE_SRC.split('?')[0]}"]`)
    if (!existing) {
      existing = document.createElement('script')
      existing.src = TURNSTILE_SRC
      existing.async = true
      existing.defer = true
      document.head.appendChild(existing)
    }

    const start = Date.now()
    const MAX_WAIT = 10000
    const check = () => {
      if (window.turnstile) return resolve(window.turnstile)
      if (Date.now() - start > MAX_WAIT) {
        return reject(new Error('Turnstile failed to load'))
      }
      setTimeout(check, 100)
    }
    check()
  })
}

function Contact() {
  const location = useLocation()
  const { data: contactData, loading: contactLoading, error: contactError } = useSanityLive(CONTACT_QUERY, {}, {
    listenFilter: `*[_type == "contact"]`,
  })

  const error = contactError
    ? 'Failed to load contact page. Please check your Sanity connection.'
    : (!contactLoading && !contactData ? 'No contact page data found. Please create a Contact Page document in Sanity Studio.' : null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    website: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState(null)
  const [rateLimitError, setRateLimitError] = useState(null)
  const [turnstileError, setTurnstileError] = useState(null)
  const [turnstileReady, setTurnstileReady] = useState(false)
  const turnstileWidgetIdRef = useRef(null)
  const turnstileTokenRef = useRef(null)

  useEffect(() => {
    if (location.state?.scrollTo !== 'contact-form') return
    const el = document.getElementById('contact-form')
    if (!el) return
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }, [location.state?.scrollTo])

  useEffect(() => {
    if (!contactData) return

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
    if (!siteKey) {
      setTurnstileError('Verification is temporarily unavailable. Please email us directly.')
      return
    }

    let cancelled = false

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled) return
        const container = document.getElementById('turnstile-container')
        if (!container || turnstileWidgetIdRef.current !== null) return

        turnstileWidgetIdRef.current = turnstile.render('#turnstile-container', {
          sitekey: siteKey,
          theme: 'dark',
          callback: (token) => {
            turnstileTokenRef.current = token
            setTurnstileError(null)
          },
          'expired-callback': () => {
            turnstileTokenRef.current = null
            setTurnstileError('Verification expired. Please confirm you are human again.')
          },
          'error-callback': () => {
            turnstileTokenRef.current = null
            setTurnstileError('Verification failed to load. Please refresh the page.')
          },
          'timeout-callback': () => {
            turnstileTokenRef.current = null
            setTurnstileError('Verification timed out. Please try again.')
          },
        })
        setTurnstileReady(true)
      })
      .catch(() => {
        if (cancelled) return
        setTurnstileError('Verification failed to load. Please refresh the page.')
      })

    return () => {
      cancelled = true
      if (
        typeof window.turnstile !== 'undefined' &&
        turnstileWidgetIdRef.current !== null
      ) {
        try { window.turnstile.remove(turnstileWidgetIdRef.current) } catch { /* ignore */ }
        turnstileWidgetIdRef.current = null
        turnstileTokenRef.current = null
      }
    }
  }, [contactData])

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    setFormErrors(prev => (prev[name] ? { ...prev, [name]: null } : prev))
    setRateLimitError(null)
    setTurnstileError(null)
    setFormError(null)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setFormErrors({})
    setFormError(null)
    setRateLimitError(null)
    setTurnstileError(null)

    const rateLimitCheck = canSubmitForm()
    if (!rateLimitCheck.allowed) {
      setRateLimitError(
        `${rateLimitCheck.reason} Please try again in ${formatTimeRemaining(rateLimitCheck.timeUntilNext)}.`
      )
      return
    }

    const sanitizedData = sanitizeFormData(formData)

    const validation = validateContactForm(sanitizedData)
    if (!validation.valid) {
      setFormErrors(validation.errors)
      const firstErrorField = Object.keys(validation.errors)[0]
      if (firstErrorField) {
        const el = document.getElementById(`contact-${firstErrorField}`)
        if (el) el.focus({ preventScroll: false })
      }
      return
    }

    if (detectSpam(sanitizedData)) {
      setFormError(
        'Your message was flagged as potential spam. Please remove any suspicious content and try again.'
      )
      return
    }

    const turnstileToken =
      turnstileTokenRef.current ||
      (typeof window.turnstile !== 'undefined' &&
        turnstileWidgetIdRef.current !== null &&
        window.turnstile.getResponse(turnstileWidgetIdRef.current)) ||
      null

    if (!turnstileToken) {
      setTurnstileError('Please complete the verification before submitting.')
      return
    }

    setFormSubmitting(true)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sanitizedData,
          'cf-turnstile-response': turnstileToken,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      let payload = null
      try { payload = await response.json() } catch { /* non-JSON response */ }

      if (response.ok) {
        recordSubmission()
        setFormSuccess(true)
        setFormData({ name: '', email: '', phone: '', message: '', website: '' })

        // GA4 conversion event — fires only when the user has granted analytics
        // consent. No PII, just a lead counter with a form identifier so we can
        // tell contact leads apart from any future forms (e.g. careers).
        trackEvent('generate_lead', { form_id: 'contact' })

        if (typeof window.turnstile !== 'undefined' && turnstileWidgetIdRef.current !== null) {
          try { window.turnstile.reset(turnstileWidgetIdRef.current) } catch { /* ignore */ }
          turnstileTokenRef.current = null
        }

        setTimeout(() => setFormSuccess(false), 6000)
      } else if (response.status === 429) {
        const retryAfter = Number(response.headers.get('Retry-After')) || 0
        const mins = retryAfter > 0 ? Math.ceil(retryAfter / 60) : null
        setRateLimitError(
          payload?.error ||
            (mins
              ? `Too many submissions. Please try again in about ${mins} minute${mins === 1 ? '' : 's'}.`
              : 'Too many submissions. Please try again later.')
        )
      } else {
        setFormError(
          payload?.error ||
            (response.status >= 500
              ? 'We couldn’t send your message because of a server issue. Please try again later.'
              : 'We couldn’t send your message. Please check the form and try again.')
        )
      }
    } catch (err) {
      clearTimeout(timeoutId)
      if (err?.name === 'AbortError') {
        setFormError('Request timed out. Please check your internet connection and try again.')
      } else {
        setFormError(
          'Failed to send message. Please try again later or email us directly at info@usmechanicalllc.com.'
        )
      }
    } finally {
      setFormSubmitting(false)
    }
  }

  const remainingSubmissions = getRemainingSubmissions()

  const isSubmitDisabled =
    formSubmitting || Boolean(rateLimitError) || !turnstileReady

  return (
    <>
      <SEO
        title="Contact Us | US Mechanical | Get a Quote"
        description="Contact US Mechanical for plumbing, HVAC, and mechanical contracting services in Utah and Nevada. Get a free quote today."
        keywords="contact US Mechanical, get quote, HVAC services, plumbing services, mechanical contractor contact"
        url={`${getSiteUrl()}/contact`}
      />
      <Header />
      <main id="main-content" tabIndex={-1} className="contact-page min-h-screen">
        {!contactLoading && (error || !contactData) && (
          <section className="contact-page__fallback">
            <div className="contact-page__fallback-inner">
              <h1 className="contact-page__fallback-title">Contact page not found</h1>
              <p className="contact-page__fallback-text">{error || 'No contact page data found.'}</p>
              <p className="contact-page__fallback-text">
                Please create a &quot;Contact Page&quot; document in{' '}
                <a
                  href="https://usmechanical.sanity.studio"
                  className="contact-page__fallback-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sanity Studio
                </a>
              </p>
            </div>
          </section>
        )}

        {contactData && (
          <section id="contact-form" className="contact-page__section">
            <div className="contact-page__inner">
              <header className="contact-page__intro">
                <div className="contact-page__eyebrow">
                  <span>Get in touch</span>
                </div>
                <h1 className="contact-page__title section-title text-5xl md:text-6xl">
                  {contactData.heroTitle || 'Contact Us'}
                </h1>
                {contactData.description && (
                  <p className="contact-page__subtitle">{contactData.description}</p>
                )}
              </header>

              <div className="contact-page__form-column">
                <div className="contact-page__panel">
                  <h2 className="contact-page__panel-title">
                    {contactData.formSettings?.headline || 'Send us a message'}
                  </h2>

                  {formSuccess && (
                    <div role="status" aria-live="polite" className="contact-page__banner contact-page__banner--success">
                      <strong>Message sent</strong>
                      <span>We&apos;ll get back to you soon.</span>
                    </div>
                  )}

                  {rateLimitError && (
                    <div role="alert" className="contact-page__banner contact-page__banner--error">
                      <strong>Too many submissions</strong>
                      <span>{rateLimitError}</span>
                    </div>
                  )}

                  {formError && (
                    <div role="alert" className="contact-page__banner contact-page__banner--error">
                      <strong>We couldn&apos;t send your message</strong>
                      <span>{formError}</span>
                    </div>
                  )}

                  {turnstileError && (
                    <div role="alert" className="contact-page__banner contact-page__banner--error">
                      <strong>Verification required</strong>
                      <span>{turnstileError}</span>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="contact-page__form"
                    noValidate
                    aria-busy={formSubmitting ? 'true' : 'false'}
                  >
                    <div className="min-w-0">
                      <label htmlFor="contact-name" className="contact-page__field-label">
                        Name{' '}
                        <span aria-hidden="true" className="contact-page__req">
                          *
                        </span>
                        <span className="sr-only"> (required)</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        aria-invalid={formErrors.name ? 'true' : 'false'}
                        aria-describedby={formErrors.name ? 'contact-name-error' : undefined}
                        className={`contact-page__input ${formErrors.name ? 'contact-page__input--error' : ''}`}
                        maxLength={100}
                      />
                      {formErrors.name && (
                        <p id="contact-name-error" className="contact-page__field-error">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div className="min-w-0">
                      <label htmlFor="contact-email" className="contact-page__field-label">
                        Email{' '}
                        <span aria-hidden="true" className="contact-page__req">
                          *
                        </span>
                        <span className="sr-only"> (required)</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        aria-invalid={formErrors.email ? 'true' : 'false'}
                        aria-describedby={formErrors.email ? 'contact-email-error' : undefined}
                        className={`contact-page__input ${formErrors.email ? 'contact-page__input--error' : ''}`}
                        maxLength={254}
                      />
                      {formErrors.email && (
                        <p id="contact-email-error" className="contact-page__field-error">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="min-w-0">
                      <label htmlFor="contact-phone" className="contact-page__field-label">
                        Phone{' '}
                        <span className="contact-page__optional">(optional)</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        inputMode="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        aria-invalid={formErrors.phone ? 'true' : 'false'}
                        aria-describedby={formErrors.phone ? 'contact-phone-error' : undefined}
                        className={`contact-page__input ${formErrors.phone ? 'contact-page__input--error' : ''}`}
                        maxLength={20}
                      />
                      {formErrors.phone && (
                        <p id="contact-phone-error" className="contact-page__field-error">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div className="min-w-0">
                      <label htmlFor="contact-message" className="contact-page__field-label">
                        Message{' '}
                        <span aria-hidden="true" className="contact-page__req">
                          *
                        </span>
                        <span className="sr-only"> (required)</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        aria-invalid={formErrors.message ? 'true' : 'false'}
                        aria-describedby={`contact-message-count${formErrors.message ? ' contact-message-error' : ''}`}
                        className={`contact-page__textarea ${formErrors.message ? 'contact-page__textarea--error' : ''}`}
                        maxLength={5000}
                        minLength={10}
                      />
                      {formErrors.message && (
                        <p id="contact-message-error" className="contact-page__field-error">
                          {formErrors.message}
                        </p>
                      )}
                      <p id="contact-message-count" className="contact-page__hint">
                        {formData.message.length}/5000 characters (minimum 10)
                      </p>
                    </div>

                    {/* Honeypot field — hidden from real users, bots will fill it in. */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        left: '-10000px',
                        top: 'auto',
                        width: '1px',
                        height: '1px',
                        overflow: 'hidden',
                      }}
                    >
                      <label htmlFor="website-field">
                        Website (leave blank)
                        <input
                          id="website-field"
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          value={formData.website}
                          onChange={handleInputChange}
                        />
                      </label>
                    </div>

                    <div
                      id="turnstile-container"
                      className="contact-page__turnstile-wrap"
                      aria-label="Human verification"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitDisabled}
                      aria-disabled={isSubmitDisabled ? 'true' : 'false'}
                      className="contact-page__submit"
                    >
                      {formSubmitting
                        ? 'Sending…'
                        : !turnstileReady
                          ? 'Loading verification…'
                          : 'Submit'}
                    </button>

                    {remainingSubmissions < 3 && !rateLimitError && (
                      <p className="contact-page__rate-hint">
                        {remainingSubmissions > 0
                          ? `${remainingSubmissions} submission${remainingSubmissions !== 1 ? 's' : ''} remaining this hour`
                          : 'Maximum submissions reached for this hour'}
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

export default memo(Contact)
