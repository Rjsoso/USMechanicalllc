/* global process */
import { useEffect, useState, useMemo } from 'react'
import { client } from '../utils/sanity'
import { urlFor } from '../utils/sanity'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import { validateContactForm, sanitizeFormData, detectSpam } from '../utils/validation'
import {
  canSubmitForm,
  recordSubmission,
  formatTimeRemaining,
  getRemainingSubmissions,
} from '../utils/rateLimit'

export default function Contact() {
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/9705fb86-1c33-4819-90c1-c4bb10602baa',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Contact.jsx:16',message:'Contact component MOUNTED',data:{contactElExists:!!document.getElementById('contact')},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'B'})}).catch(()=>{});
  }, []);
  // #endregion
  const [contactData, setContactData] = useState(null)
  const [heroBackgroundImage, setHeroBackgroundImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const headerOffset = 180

  // Form state
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

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true)
        // Fetch contact data - explicitly target published document (not drafts)
        // This ensures webhooks fire correctly when content is published
        let contactQuery = `*[_type == "contact" && _id == "contact"][0]{
          ...,
          backgroundImage {
            asset-> {
              _id,
              url
            }
          }
        }`
        let contactData = await client.fetch(contactQuery)

        // Fallback: If specific ID not found, get first published document (exclude drafts)
        if (!contactData) {
          contactQuery = `*[_type == "contact" && !(_id in path("drafts.**"))][0]{
            ...,
            backgroundImage {
              asset-> {
                _id,
                url
              }
            }
          }`
          contactData = await client.fetch(contactQuery)
        }

        setContactData(contactData)

        // Fetch hero background image as fallback
        const heroQuery = `*[_type == "heroSection"][0]{
          backgroundImage {
            asset-> {
              _id,
              url
            }
          },
          carouselImages[0] {
            image {
              asset-> {
                _id,
                url
              }
            },
            "imageUrl": image.asset->url
          }
        }`
        const heroData = await client.fetch(heroQuery)

        // Use carousel image if available, otherwise use backgroundImage
        const heroImageUrl =
          heroData?.carouselImages?.imageUrl ||
          heroData?.carouselImages?.image?.asset?.url ||
          heroData?.backgroundImage?.asset?.url
        setHeroBackgroundImage(heroImageUrl)

        if (!contactData) {
          setError(
            'No contact page data found. Please create a Contact Page document in Sanity Studio.'
          )
        }
      } catch (err) {
        console.error('Error fetching contact data:', err)
        setError('Failed to load contact page. Please check your Sanity connection.')
      } finally {
        setLoading(false)
      }
    }
    fetchContact()
  }, [])

  // Attempt smooth scroll to contact when this component is ready
  useEffect(() => {
    // Don't scroll on page reload - only on navigation from other pages
    const isPageReload =
      performance.getEntriesByType('navigation')[0]?.type === 'reload' ||
      performance.navigation?.type === 1

    if (isPageReload) {
      if (process.env.NODE_ENV === 'development')
        console.log('Contact: Page reload detected, skipping auto-scroll')
      return undefined
    }

    const shouldScroll =
      sessionStorage.getItem('scrollTo') === 'contact' || window.location.hash === '#contact'

    if (!shouldScroll) return undefined

    const scrollToContact = () => {
      const element = document.getElementById('contact')
      if (!element) return false
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      sessionStorage.removeItem('scrollTo')
      return true
    }

    let attempts = 0
    const maxRetries = 20
    const timer = setInterval(() => {
      attempts += 1
      if (scrollToContact() || attempts >= maxRetries) {
        clearInterval(timer)
      }
    }, 150)

    // Try immediately in case everything is already mounted
    scrollToContact()

    return () => clearInterval(timer)
  }, [loading, contactData, headerOffset])

  // Determine which background image to use (contact's own or hero's as fallback)
  // Note: Currently not used but kept for future implementation
  // eslint-disable-next-line no-unused-vars
  const _backgroundImageUrl = useMemo(() => {
    const sanityImage = contactData?.backgroundImage
    if (sanityImage && urlFor(sanityImage)) {
      return urlFor(sanityImage).width(1400).quality(80).auto('format').url()
    }
    if (heroBackgroundImage?.includes('cdn.sanity.io')) {
      return `${heroBackgroundImage}?w=1400&q=80&auto=format`
    }
    return heroBackgroundImage || null
  }, [contactData?.backgroundImage, heroBackgroundImage])

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null,
      }))
    }

    // Clear rate limit error when user modifies form
    if (rateLimitError) {
      setRateLimitError(null)
    }
  }

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault()

    // Clear previous errors
    setFormErrors({})
    setFormError(null)
    setRateLimitError(null)

    // Check rate limiting
    const rateLimitCheck = canSubmitForm()
    if (!rateLimitCheck.allowed) {
      setRateLimitError(
        `${rateLimitCheck.reason} Please try again in ${formatTimeRemaining(rateLimitCheck.timeUntilNext)}.`
      )
      return
    }

    // Sanitize form data
    const sanitizedData = sanitizeFormData(formData)

    // Validate form data
    const validation = validateContactForm(sanitizedData)
    if (!validation.valid) {
      setFormErrors(validation.errors)
      return
    }

    // Check for spam
    if (detectSpam(sanitizedData)) {
      setFormError(
        'Your message was flagged as potential spam. Please remove any suspicious content and try again.'
      )
      return
    }

    // Submit form
    setFormSubmitting(true)

    // Add timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch('https://formspree.io/f/xgvrvody', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        // Record successful submission for rate limiting
        recordSubmission()

        // Show success message
        setFormSuccess(true)

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        })

        // Hide success message after 5 seconds
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

  // Get remaining submissions for display
  const remainingSubmissions = getRemainingSubmissions()

  return (
    <>
      <SEO
        title="Contact Us | US Mechanical | Get a Quote"
        description="Contact US Mechanical for plumbing, HVAC, and mechanical contracting services in Utah and Nevada. Get a free quote today."
        keywords="contact US Mechanical, get quote, HVAC services, plumbing services, mechanical contractor contact"
        url="https://usmechanical.com/contact"
      />
      <section
        id="contact"
        className="relative w-full px-6 py-20"
        style={{
          backgroundColor: '#1a1a1a',
          minHeight: '100vh',
        }}
      >
        {/* Background removed - hero's fixed background shows through */}
        <div className="relative z-10 mx-auto max-w-6xl">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <p className="text-center text-lg text-white">Loading contact...</p>
            </div>
          )}

          {!loading && (error || !contactData) && (
            <div className="flex items-center justify-center py-12">
              <div className="max-w-2xl px-6 text-center">
                <h1 className="mb-4 text-2xl font-bold text-red-400">Contact Page Not Found</h1>
                <p className="mb-4 text-white">{error || 'No contact page data found.'}</p>
                <p className="text-sm text-gray-300">
                  Please create a &quot;Contact Page&quot; document in Sanity Studio at{' '}
                  <a
                    href="http://localhost:3333"
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    http://localhost:3333
                  </a>
                </p>
              </div>
            </div>
          )}

          {!loading && contactData && (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px' }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="section-title mb-8 text-center text-5xl text-white md:text-6xl"
              >
                {contactData.heroTitle || 'Contact Us'}
              </motion.h1>

              <motion.p
                className="mb-12 text-center text-white"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px' }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {contactData.description}
              </motion.p>

              <div className="grid gap-12 md:grid-cols-2">
                {/* LEFT SIDE — OFFICE INFO */}
                <div>
                  {contactData.offices && contactData.offices.length > 0 ? (
                    contactData.offices.map((office, index) => (
                      <motion.div
                        key={index}
                        className="mb-8"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '0px' }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                          {office.locationName}
                        </h2>
                        <p className="text-white">{office.address}</p>
                        <p className="text-white">
                          Phone: <span className="text-blue-300">{office.phone}</span>
                        </p>
                        {office.fax && <p className="text-white">Fax: {office.fax}</p>}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-white">No office locations available.</p>
                  )}

                  {/* AFFILIATES */}
                  {contactData.affiliates && contactData.affiliates.length > 0 && (
                    <motion.div
                      className="mt-8"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '0px' }}
                      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <h2 className="mb-4 text-2xl font-semibold text-white">
                        Affiliate Companies
                      </h2>
                      {contactData.affiliates.map((affiliate, i) => (
                        <motion.div
                          key={i}
                          className="mb-6"
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '0px' }}
                          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                          {affiliate.logo && urlFor(affiliate.logo) && (
                            <img
                              src={urlFor(affiliate.logo)
                                .width(200)
                                .quality(80)
                                .auto('format')
                                .url()}
                              alt={affiliate.name}
                              className="mb-2 h-12 object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                          <p className="font-semibold text-white">{affiliate.name}</p>
                          {affiliate.description && (
                            <p className="text-white">{affiliate.description}</p>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* RIGHT SIDE — FORM */}
                <motion.div
                  className="rounded-xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-sm"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px' }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <h3 className="mb-4 text-2xl font-semibold text-white">
                    {contactData.formSettings?.headline || 'Send Us a Message'}
                  </h3>

                  {/* Success Message */}
                  {formSuccess && (
                    <div className="mb-4 rounded-lg border border-green-500/50 bg-green-500/20 p-4">
                      <p className="font-semibold text-white">✓ Message sent successfully!</p>
                      <p className="mt-1 text-sm text-white/80">We&apos;ll get back to you soon.</p>
                    </div>
                  )}

                  {/* Rate Limit Error */}
                  {rateLimitError && (
                    <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
                      <p className="font-semibold text-white">⚠ Rate Limit Exceeded</p>
                      <p className="mt-1 text-sm text-white/80">{rateLimitError}</p>
                    </div>
                  )}

                  {/* General Form Error */}
                  {formError && (
                    <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
                      <p className="font-semibold text-white">⚠ Error</p>
                      <p className="mt-1 text-sm text-white/80">{formError}</p>
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

                    <button
                      type="submit"
                      disabled={formSubmitting || rateLimitError}
                      className={`rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 ${
                        formSubmitting || rateLimitError ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      {formSubmitting ? 'Sending...' : 'Submit'}
                    </button>

                    {/* Rate limit info */}
                    {remainingSubmissions < 3 && !rateLimitError && (
                      <p className="text-center text-xs text-white/60">
                        {remainingSubmissions > 0
                          ? `${remainingSubmissions} submission${remainingSubmissions !== 1 ? 's' : ''} remaining this hour`
                          : 'Maximum submissions reached for this hour'}
                      </p>
                    )}
                  </form>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
