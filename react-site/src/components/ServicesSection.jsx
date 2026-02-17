import { useEffect, useState, useCallback, memo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { client } from '../utils/sanity'
import { canSubmitForm, recordSubmission, formatTimeRemaining } from '../utils/rateLimit'

const ServicesSection = ({ data: servicesDataProp }) => {
  const FORM_ENDPOINT = 'https://formspree.io/f/xgvrvody'
  const [servicesData, setServicesData] = useState(servicesDataProp || null)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle') // idle | loading | success | error
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const navigate = useNavigate()
  const rotationIntervalRef = useRef(null)
  const userInteractionTimeoutRef = useRef(null)

  // Update servicesData when prop changes
  useEffect(() => {
    if (servicesDataProp) {
      setServicesData(servicesDataProp)
    }
  }, [servicesDataProp])

  const handleLearnMore = useCallback(
    service => {
      if (service?.slug?.current) {
        navigate(`/services/${service.slug.current}`)
      }
    },
    [navigate]
  )

  const handleExpand = useCallback(index => {
    setActiveTab(index)
    setExpandedIndex(index)
    setSubmitStatus('idle')

    // Pause auto-rotation on user interaction
    setIsAutoRotating(false)

    // Clear any existing timeout
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current)
    }

    // Resume auto-rotation after 10 seconds of inactivity
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsAutoRotating(true)
    }, 10000)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedIndex(null)
    setSubmitStatus('idle')
    setSubmitting(false)
  }, [])

  useEffect(() => {
    if (expandedIndex === null) return undefined

    const onKeyDown = e => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expandedIndex, handleClose])

  // Auto-rotation effect for delivery methods tabs (disabled on mobile)
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (!isAutoRotating || !servicesData?.deliveryMethods?.length || isMobile) {
      return undefined
    }

    const maxTabIndex = servicesData.deliveryMethods.length - 1 // Exclude "Request a Quote" tab

    rotationIntervalRef.current = setInterval(() => {
      setActiveTab(prevTab => {
        // If we're on the last delivery method tab or beyond, go back to 0
        if (prevTab >= maxTabIndex) {
          return 0
        }
        // Otherwise, advance to next tab
        return prevTab + 1
      })
    }, 5000) // Rotate every 5 seconds

    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current)
      }
    }
  }, [isAutoRotating, servicesData])

  // Cleanup user interaction timeout on unmount
  useEffect(() => {
    return () => {
      if (userInteractionTimeoutRef.current) {
        clearTimeout(userInteractionTimeoutRef.current)
      }
    }
  }, [])

  const badgeToneClasses = {
    sky: 'bg-sky-500/15 text-sky-50 border-sky-500/40',
    amber: 'bg-amber-400/15 text-amber-50 border-amber-400/40',
    emerald: 'bg-emerald-400/15 text-emerald-50 border-emerald-400/40',
    pink: 'bg-pink-400/15 text-pink-50 border-pink-400/40',
    slate: 'bg-white/5 text-slate-100 border-white/10',
  }

  const extractPlainText = (blocks = []) => {
    if (!Array.isArray(blocks)) return ''
    return blocks
      .filter(block => block?._type === 'block' && Array.isArray(block.children))
      .map(block => block.children.map(child => child.text || '').join(''))
      .join(' ')
      .trim()
  }

  const handleQuoteSubmit = async (event, methodTitle = '') => {
    event.preventDefault()
    if (!servicesData) return

    // Check rate limiting
    const rateLimitCheck = canSubmitForm()
    if (!rateLimitCheck.allowed) {
      setSubmitStatus('error')
      alert(
        `Rate limit exceeded. Please wait ${formatTimeRemaining(rateLimitCheck.timeUntilReset)} before submitting again.`
      )
      return
    }

    const emailTarget = servicesData.deliveryMethodsEmail || 'info@usmechanicalllc.com'
    setSubmitting(true)
    setSubmitStatus('loading')

    // Add timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const formData = new FormData(event.target)
      formData.set('deliveryMethod', methodTitle)
      formData.set('targetEmail', emailTarget)

      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      // Record successful submission for rate limiting
      recordSubmission()
      setSubmitStatus('success')
      event.target.reset()
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Quote request failed:', error)
      if (error.name === 'AbortError') {
        alert('Request timed out. Please check your internet connection and try again.')
      }
      setSubmitStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!servicesData) {
    return (
      <section id="services" className="bg-transparent pb-0 pt-12 text-center text-white" style={{ minHeight: '936px' }}>
        <p>Loading services...</p>
      </section>
    )
  }

  if (!servicesData?.servicesInfo || servicesData.servicesInfo.length === 0) {
    return (
      <section id="services" className="bg-transparent pb-1 pt-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="section-title mb-12 text-center text-5xl text-white md:text-6xl">
            {servicesData.sectionTitle || 'Our Services'}
          </h2>
          <p className="text-center text-white">No services available.</p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="services"
      className="bg-transparent pb-20 pt-12 text-white"
      style={{ position: 'relative' }}
    >
      {/* Title and Description - Centered */}
      <div className="mx-auto max-w-7xl px-6 mb-12">
        <motion.h2
          className="section-title mb-12 text-center text-5xl text-white md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {servicesData.sectionTitle || 'Our Services'}
        </motion.h2>
        <motion.p
          className="mb-0 text-left text-lg text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {servicesData.descriptionText}
        </motion.p>
      </div>

      {/* Service Boxes and Delivery Methods - Full Width */}
      <div className="flex flex-col items-stretch justify-center gap-10 md:flex-row md:gap-8">
        {/* LEFT — SERVICE BOXES (full-bleed to the left edge) */}
        <div className="flex-1 space-y-4 md:w-1/2">
          {servicesData.servicesInfo &&
            servicesData.servicesInfo.map((box, index) => {
                // Calculate background style based on type
                const getBoxBackgroundStyle = () => {
                  if (box.backgroundType === 'image' && box.backgroundImage?.asset?.url) {
                    const imageUrl = `${box.backgroundImage.asset.url}?w=1200&q=80&auto=format`
                    return {
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }
                  }

                  if (box.backgroundType === 'color' && box.backgroundColor) {
                    return {
                      backgroundColor: box.backgroundColor,
                    }
                  }

                  // Fallback to default black background
                  return {
                    backgroundColor: '#000000',
                  }
                }

                const backgroundStyle = getBoxBackgroundStyle()

                return (
                  <motion.div
                    key={index}
                    className="group relative overflow-hidden p-8 shadow transition-opacity duration-150 ease-out hover:opacity-90"
                    style={{
                      ...backgroundStyle,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                      delay: index * 0.1
                    }}
                  >
                    <h3
                      className="mb-3 text-xl font-semibold"
                      style={{ color: box.textColor || '#ffffff' }}
                    >
                      {box.title}
                    </h3>
                    {box.description && (
                      <p
                        className="mb-4 line-clamp-2 text-sm leading-relaxed opacity-75"
                        style={{ color: box.textColor || '#d1d5db' }}
                      >
                        {box.description}
                      </p>
                    )}
                    <button
                      onClick={() => handleLearnMore(box)}
                      className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-80"
                    >
                      Learn More
                      <FiArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                )
              })}
        </div>

        {/* RIGHT — DELIVERY METHODS CONTENT */}
        {servicesData.deliveryMethods?.length > 0 && (
          <div className="flex flex-1 flex-col md:w-1/2">
            {/* Horizontal Split Layout: 25% Nav | 75% Content */}
            <div className="relative flex flex-1 flex-col overflow-hidden border border-gray-200 bg-white shadow-2xl">
              {/* HEADER - Full Width Centered */}
              {servicesData.deliveryMethodsHeading && (
                <div className="w-full border-b border-gray-200 bg-white px-8 py-6">
                  <motion.h2
                    className="section-title text-center text-4xl text-gray-900 md:text-5xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  >
                    {servicesData.deliveryMethodsHeading || 'Delivery Methods'}
                  </motion.h2>
                </div>
              )}

              {/* CONTENT AREA - Horizontal Split */}
              <div className="flex flex-1 flex-row">
                {/* LEFT SIDEBAR - 25% Navigation */}
                <div className="flex w-1/4 flex-col border-r border-gray-200 bg-gray-50">
                  {[
                    ...servicesData.deliveryMethods,
                    { title: 'Request a Quote', isQuote: true },
                  ].map((method, idx) => {
                    const isActive = activeTab === idx

                    return (
                      <button
                        key={idx}
                        onClick={() => handleExpand(idx)}
                        className={`flex w-full items-center justify-center border-b border-gray-200 px-4 py-6 text-center transition-all ${
                          isActive
                            ? 'bg-gray-200 font-bold text-gray-900'
                            : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <span className="text-2xl font-bold">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* RIGHT CONTENT AREA - 75% */}
                <div className="w-3/4 overflow-y-auto bg-white">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.15,
                        ease: 'easeInOut',
                      }}
                      className="flex-1"
                    >
                      {(() => {
                        const allMethods = [
                          ...servicesData.deliveryMethods,
                          { title: 'Request a Quote', isQuote: true },
                        ]
                        const method = allMethods[activeTab]
                        const badgeClass =
                          badgeToneClasses[method?.badgeTone] || badgeToneClasses.slate
                        const bodyPreview = extractPlainText(method?.body)
                        const bgUrl = method?.backgroundImage?.asset?.url
                          ? `${method.backgroundImage.asset.url}?w=900&q=80&auto=format`
                          : null
                        const emailTarget =
                          servicesData.deliveryMethodsEmail || 'info@usmechanicalllc.com'

                        return (
                          <div
                            className="relative flex h-full flex-col p-6 sm:p-8"
                            style={
                              bgUrl
                                ? {
                                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.90)), url(${bgUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                  }
                                : undefined
                            }
                          >
                            {/* Method Title and Badge */}
                            <div className="mb-6">
                              <div className="mb-2 flex items-center gap-3">
                                <h3 className="text-2xl font-bold text-gray-900">
                                  {method?.title}
                                </h3>
                                {!method?.isQuote && method?.badge && (
                                  <span
                                    className={`inline-flex items-center border px-2.5 py-0.5 text-[11px] font-semibold ${badgeClass}`}
                                    style={{
                                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                  >
                                    {method.badge}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            {!method?.isQuote ? (
                              <div className="flex-1 space-y-4">
                                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gray-600">
                                  Delivery Method Details
                                </p>
                                {method?.summary && (
                                  <p className="text-lg leading-relaxed text-gray-900">
                                    {method.summary}
                                  </p>
                                )}
                                {bodyPreview && (
                                  <p className="text-base leading-relaxed text-gray-700">
                                    {bodyPreview}
                                  </p>
                                )}

                                <div className="mt-6 border border-gray-200 bg-gray-50 p-5">
                                  <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gray-600">
                                    Interested?
                                  </p>
                                  <p className="text-sm text-gray-900">
                                    Click &quot;5&quot; tab to inquire about this method.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1">
                                <div className="border border-gray-200 bg-gray-50 p-5 shadow-sm">
                                  <div className="mb-4">
                                    <p className="mb-1 text-xs uppercase tracking-[0.25em] text-gray-600">
                                      Request a Quote
                                    </p>
                                    <h5 className="text-xl font-semibold text-gray-900">
                                      {servicesData.deliveryMethodsFormHeadline ||
                                        'Tell us about your project'}
                                    </h5>
                                    <p className="mt-2 text-sm text-gray-700">
                                      {servicesData.deliveryMethodsFormCopy ||
                                        'Share a few details and we will follow up quickly.'}
                                    </p>
                                  </div>
                                  <form
                                    onSubmit={e => handleQuoteSubmit(e, 'Request a Quote')}
                                    className="grid gap-3"
                                  >
                                    <input
                                      name="name"
                                      type="text"
                                      required
                                      placeholder="Name"
                                      className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                    <input
                                      name="email"
                                      type="email"
                                      required
                                      placeholder="Email"
                                      className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                    <input
                                      name="phone"
                                      type="tel"
                                      placeholder="Phone"
                                      className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                    <select
                                      name="deliveryMethod"
                                      defaultValue="General Inquiry"
                                      className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    >
                                      <option value="General Inquiry">General Inquiry</option>
                                      {servicesData.deliveryMethods.map((m, optionIdx) => (
                                        <option
                                          key={optionIdx}
                                          value={m.title || `Method ${optionIdx + 1}`}
                                        >
                                          {m.title || `Method ${optionIdx + 1}`}
                                        </option>
                                      ))}
                                    </select>
                                    <textarea
                                      name="message"
                                      required
                                      rows="4"
                                      placeholder="Project details, timelines, and any specifics"
                                      className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                    <input type="hidden" name="targetEmail" value={emailTarget} />
                                    <div className="flex flex-wrap items-center gap-3">
                                      <button
                                        type="submit"
                                        disabled={submitting}
                                        className="inline-flex items-center justify-center gap-2 bg-white px-5 py-3 font-semibold text-gray-900 transition hover:bg-white/90 disabled:opacity-60"
                                      >
                                        {submitting ? 'Sending...' : 'Send Request'}
                                      </button>
                                      {submitStatus === 'success' && (
                                        <span className="text-sm font-semibold text-emerald-600">
                                          Sent! We&apos;ll respond shortly.
                                        </span>
                                      )}
                                      {submitStatus === 'error' && (
                                        <span className="text-sm font-semibold text-amber-600">
                                          There was an issue. Please try again.
                                        </span>
                                      )}
                                    </div>
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default memo(ServicesSection)
