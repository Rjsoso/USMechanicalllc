import { useEffect, useState, useRef, memo } from 'react'
import { Link } from 'react-router-dom'
import { urlFor } from '../utils/sanity'
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

const CONTACT_QUERY = `*[_type == "contact" && _id == "contact"][0]{
  ...,
  backgroundImage { asset-> { _id, url } }
}`

function Contact() {
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
  })
  const [formErrors, setFormErrors] = useState({})
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  const [formError, setFormError] = useState(null)
  const [rateLimitError, setRateLimitError] = useState(null)
  const [turnstileError, setTurnstileError] = useState(null)
  const turnstileWidgetIdRef = useRef(null)

  useEffect(() => {
    if (!contactData) return

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

    const renderWidget = () => {
      const container = document.getElementById('turnstile-container')
      if (!container || turnstileWidgetIdRef.current !== null) return

      const widgetId = window.turnstile.render('#turnstile-container', {
        sitekey: siteKey,
        theme: 'dark',
      })
      turnstileWidgetIdRef.current = widgetId
    }

    const initTurnstile = () => {
      if (typeof window.turnstile !== 'undefined') {
        renderWidget()
        return true
      }
      return false
    }

    if (!initTurnstile()) {
      const poll = setInterval(() => {
        if (initTurnstile()) {
          clearInterval(poll)
        }
      }, 100)
      const timeout = setTimeout(() => clearInterval(poll), 10000)

      return () => {
        clearInterval(poll)
        clearTimeout(timeout)
        if (
          typeof window.turnstile !== 'undefined' &&
          turnstileWidgetIdRef.current !== null
        ) {
          window.turnstile.remove(turnstileWidgetIdRef.current)
          turnstileWidgetIdRef.current = null
        }
      }
    }

    return () => {
      if (
        typeof window.turnstile !== 'undefined' &&
        turnstileWidgetIdRef.current !== null
      ) {
        window.turnstile.remove(turnstileWidgetIdRef.current)
        turnstileWidgetIdRef.current = null
      }
    }
  }, [contactData])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null,
      }))
    }

    if (rateLimitError) {
      setRateLimitError(null)
    }
    if (turnstileError) {
      setTurnstileError(null)
    }
  }

  const handleSubmit = async e => {
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
      return
    }

    if (detectSpam(sanitizedData)) {
      setFormError(
        'Your message was flagged as potential spam. Please remove any suspicious content and try again.'
      )
      return
    }

    const turnstileToken =
      typeof window.turnstile !== 'undefined' &&
      turnstileWidgetIdRef.current !== null &&
      window.turnstile.getResponse(turnstileWidgetIdRef.current)
    if (!turnstileToken) {
      setTurnstileError('Please complete the verification before submitting.')
      return
    }

    setFormSubmitting(true)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sanitizedData,
          'cf-turnstile-response': turnstileToken,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        recordSubmission()
        setFormSuccess(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        })

        if (typeof window.turnstile !== 'undefined' && turnstileWidgetIdRef.current !== null) {
          window.turnstile.reset(turnstileWidgetIdRef.current)
        }

        setTimeout(() => {
          setFormSuccess(false)
        }, 5000)
      } else {
        throw new Error('Failed to submit form')
      }
    } catch (err) {
      clearTimeout(timeoutId)
      console.error('Form submission error:', err)
      if (err.name === 'AbortError') {
        setFormError('Request timed out. Please check your internet connection and try again.')
      } else {
        setFormError(
          'Failed to send message. Please try again later or contact us directly via email.'
        )
      }
    } finally {
      setFormSubmitting(false)
    }
  }

  const remainingSubmissions = getRemainingSubmissions()

  return (
    <>
      <SEO
        title="Contact Us | US Mechanical | Get a Quote"
        description="Contact US Mechanical for plumbing, HVAC, and mechanical contracting services in Utah and Nevada. Get a free quote today."
        keywords="contact US Mechanical, get quote, HVAC services, plumbing services, mechanical contractor contact"
        url={`${getSiteUrl()}/contact`}
      />
      <Header />
      <main className="min-h-screen bg-gray-900">
        {(error || !contactData) && (
          <section
            className="relative w-full px-6 py-20 pt-[180px]"
          >
            <div className="relative z-10 mx-auto max-w-6xl flex items-center justify-center py-12">
              <div className="max-w-2xl px-6 text-center">
                <h1 className="mb-4 text-2xl font-bold text-red-400">Contact Page Not Found</h1>
                <p className="mb-4 text-white">{error || 'No contact page data found.'}</p>
                <p className="text-sm text-gray-300">
                  Please create a &quot;Contact Page&quot; document in{' '}
                  <a
                    href="https://usmechanical.sanity.studio"
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Sanity Studio
                  </a>
                </p>
              </div>
            </div>
          </section>
        )}

        {contactData && (
          <section
            id="contact-form"
            className="relative w-full px-6 pb-16 pt-[180px]"
          >
            <div className="relative z-10 mx-auto max-w-6xl">
              <p className="mb-8 text-center text-sm text-white/60">
                Office locations and map:{' '}
                <Link to="/#contact" className="text-blue-300 underline hover:text-blue-200">
                  view on the home page
                </Link>
                .
              </p>

              <h1 className="section-title mb-6 text-center text-5xl text-white md:text-6xl">
                {contactData.heroTitle || 'Contact Us'}
              </h1>

              <p className="mb-12 text-center text-lg text-white/90">
                {contactData.description}
              </p>

              <div className="grid gap-12 md:grid-cols-2">
                <div className="min-w-0 rounded-xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-sm">
                  <h3 className="mb-4 text-2xl font-semibold text-white">
                    {contactData.formSettings?.headline || 'Send Us a Message'}
                  </h3>

                  {formSuccess && (
                    <div className="mb-4 rounded-lg border border-green-500/50 bg-green-500/20 p-4">
                      <p className="font-semibold text-white">✓ Message sent successfully!</p>
                      <p className="mt-1 text-sm text-white/80">We&apos;ll get back to you soon.</p>
                    </div>
                  )}

                  {rateLimitError && (
                    <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
                      <p className="font-semibold text-white">⚠ Rate Limit Exceeded</p>
                      <p className="mt-1 text-sm text-white/80">{rateLimitError}</p>
                    </div>
                  )}

                  {formError && (
                    <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
                      <p className="font-semibold text-white">⚠ Error</p>
                      <p className="mt-1 text-sm text-white/80">{formError}</p>
                    </div>
                  )}

                  {turnstileError && (
                    <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
                      <p className="font-semibold text-white">⚠ Verification Required</p>
                      <p className="mt-1 text-sm text-white/80">{turnstileError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name *"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full border ${formErrors.name ? 'border-red-500' : 'border-white/30'} rounded-lg bg-white/10 p-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50`}
                        maxLength="100"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-300">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email *"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full border ${formErrors.email ? 'border-red-500' : 'border-white/30'} rounded-lg bg-white/10 p-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50`}
                        maxLength="254"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-300">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone (optional)"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full border ${formErrors.phone ? 'border-red-500' : 'border-white/30'} rounded-lg bg-white/10 p-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50`}
                        maxLength="20"
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-300">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <textarea
                        name="message"
                        placeholder="Message * (minimum 10 characters)"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`w-full border ${formErrors.message ? 'border-red-500' : 'border-white/30'} h-32 resize-none rounded-lg bg-white/10 p-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50`}
                        maxLength="5000"
                      />
                      {formErrors.message && (
                        <p className="mt-1 text-sm text-red-300">{formErrors.message}</p>
                      )}
                      <p className="mt-1 text-xs text-white/60">
                        {formData.message.length}/5000 characters
                      </p>
                    </div>

                    <div
                      id="turnstile-container"
                      className="min-h-[78px]"
                      aria-label="Cloudflare Turnstile verification"
                    />

                    <button
                      type="submit"
                      disabled={formSubmitting || rateLimitError}
                      className={`rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 ${
                        formSubmitting || rateLimitError ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      {formSubmitting ? 'Sending...' : 'Submit'}
                    </button>

                    {remainingSubmissions < 3 && !rateLimitError && (
                      <p className="text-center text-xs text-white/60">
                        {remainingSubmissions > 0
                          ? `${remainingSubmissions} submission${remainingSubmissions !== 1 ? 's' : ''} remaining this hour`
                          : 'Maximum submissions reached for this hour'}
                      </p>
                    )}
                  </form>
                </div>

                <div className="min-w-0">
                  {contactData.affiliates && contactData.affiliates.length > 0 ? (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-8">
                      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">
                        Affiliate Companies
                      </h3>
                      <div className="flex flex-col gap-6">
                        {contactData.affiliates.map((affiliate, i) => (
                          <div key={i} className="flex items-center gap-3">
                            {affiliate.logo && urlFor(affiliate.logo) && (
                              <img
                                src={urlFor(affiliate.logo)
                                  .width(200)
                                  .quality(80)
                                  .auto('format')
                                  .url()}
                                alt={affiliate.name}
                                className="h-10 object-contain"
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                            <div>
                              <p className="text-sm font-semibold text-white">{affiliate.name}</p>
                              {affiliate.description && (
                                <p className="text-xs text-white/60">{affiliate.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-white/70">
                      <p className="text-sm leading-relaxed">
                        Visit our{' '}
                        <Link to="/#contact" className="text-blue-300 underline hover:text-blue-200">
                          locations on the home page
                        </Link>
                        .
                      </p>
                    </div>
                  )}
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
