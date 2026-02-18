import { useEffect, useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiX } from 'react-icons/fi'
import { client } from '../utils/sanity'

const TEASER_LENGTH = 80
const ROTATIONS = [-2, 1.5, -1, 2, -1.5]
const FLOAT_SHADOW = '0 4px 12px rgba(0,0,0,0.25), 0 12px 28px rgba(0,0,0,0.2), 0 24px 48px rgba(0,0,0,0.15)'
const FLOAT_SHADOW_HOVER = '0 8px 24px rgba(0,0,0,0.35), 0 20px 40px rgba(0,0,0,0.25), 0 32px 64px rgba(0,0,0,0.2)'

function getBoxBackgroundStyle(box) {
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
    return { backgroundColor: box.backgroundColor }
  }
  return { backgroundColor: '#000000' }
}

function truncate(str, len) {
  if (!str || typeof str !== 'string') return ''
  return str.length <= len ? str : str.slice(0, len).trim() + '…'
}

const ServicesSection = ({ data: servicesDataProp }) => {
  const [servicesData, setServicesData] = useState(servicesDataProp || null)
  const [expandedId, setExpandedId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (servicesDataProp) setServicesData(servicesDataProp)
  }, [servicesDataProp])

  useEffect(() => {
    if (servicesDataProp) return
    let cancelled = false
    const timeoutId = setTimeout(() => {
      client
        .fetch(
          `*[_type == "ourServices"][0]{
            sectionTitle,
            descriptionText,
            deliveryMethodsHeading,
            deliveryMethods[] {
              title, summary, badge, badgeTone,
              backgroundImage { asset-> { url, _id }, alt },
              body
            },
            servicesInfo[] {
              title, description, backgroundType, backgroundColor, textColor,
              backgroundImage { asset-> { _id, url }, alt },
              slug { current },
              fullDescription,
              images[] { asset-> { _id, url }, alt, caption },
              features[] { title, description }
            }
          }`
        )
        .then(data => { if (!cancelled) setServicesData(data) })
        .catch(err => { if (!cancelled) console.error('[ServicesSection] Fallback fetch error:', err) })
    }, 800)
    return () => { cancelled = true; clearTimeout(timeoutId) }
  }, [servicesDataProp])

  const handleCardClick = useCallback((id) => {
    setExpandedId(prev => (prev === id ? null : id))
  }, [])

  const handleReadFullStory = useCallback(
    (slug) => {
      if (slug) navigate(`/services/${slug}`)
    },
    [navigate]
  )

  const handleDeliveryMethodsNav = useCallback(() => {
    navigate('/delivery-methods')
  }, [navigate])

  if (servicesData === null) {
    return (
      <section
        id="services"
        className="bg-transparent pb-20 pt-12 text-white"
        style={{ position: 'relative', minHeight: '200px' }}
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-center py-12">
          <p className="text-white/70 text-lg">Loading services…</p>
        </div>
      </section>
    )
  }

  if (!servicesData?.servicesInfo?.length) return null

  const services = servicesData.servicesInfo
  const hasDelivery = servicesData.deliveryMethods?.length > 0
  const deliverySummary =
    hasDelivery &&
    servicesData.deliveryMethods
      .map((m) => m.title)
      .filter(Boolean)
      .join(' · ')

  const cards = [
    ...services.map((s, i) => ({
      type: 'service',
      id: s.slug?.current ?? `service-${i}`,
      title: s.title,
      description: s.description,
      slug: s.slug?.current,
      backgroundStyle: getBoxBackgroundStyle(s),
      textColor: s.textColor || '#ffffff',
      textColorMuted: s.textColor || '#d1d5db',
    })),
    ...(hasDelivery
      ? [
          {
            type: 'delivery-methods',
            id: 'delivery-methods',
            title: servicesData.deliveryMethodsHeading || 'Delivery Methods',
            description: deliverySummary || 'Explore how we deliver projects.',
            backgroundStyle: { backgroundColor: '#111111' },
            textColor: '#ffffff',
            textColorMuted: '#d1d5db',
          },
        ]
      : []),
  ]

  return (
    <section
      id="services"
      className="bg-transparent pb-20 pt-12 text-white"
      style={{ position: 'relative' }}
    >
      {/* Compact sign label — no big centered title */}
      <div className="mx-auto max-w-7xl px-6 mb-8">
        <div
          className="inline-block border border-white/30 bg-white/5 px-4 py-2"
          style={{ transform: 'rotate(-0.5deg)' }}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-white/90">
            {servicesData.sectionTitle || 'Services'}
          </span>
        </div>
        {servicesData.descriptionText && (
          <p className="mt-3 max-w-2xl text-sm text-white/70">
            {truncate(servicesData.descriptionText, 120)}
          </p>
        )}
      </div>

      {/* Single staggered flow of 3D floating cards */}
      <div
        className="mx-auto max-w-7xl px-6"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div className="flex flex-wrap items-stretch gap-6">
          {cards.map((card, index) => {
            const isExpanded = expandedId === card.id
            const rotation = ROTATIONS[index % ROTATIONS.length]
            const staggerOffset = index % 2 === 0 ? { marginRight: 12 } : { marginLeft: 12 }

            return (
              <motion.div
                key={card.id}
                className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                style={{
                  ...staggerOffset,
                  transformStyle: 'preserve-3d',
                }}
                layout
              >
                <motion.div
                  layout
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardClick(card.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleCardClick(card.id)
                    }
                    if (e.key === 'Escape') setExpandedId(null)
                  }}
                  className="group relative cursor-pointer overflow-hidden rounded-lg border border-white/10"
                  style={{
                    ...card.backgroundStyle,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    boxShadow: FLOAT_SHADOW,
                    minHeight: 160,
                  }}
                  initial={{ rotate: rotation, rotateY: -2, rotateX: 1 }}
                  whileHover={{
                    y: -6,
                    z: 12,
                    rotateY: -4,
                    rotateX: 2,
                    rotate: rotation,
                    boxShadow: FLOAT_SHADOW_HOVER,
                    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                  }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative p-6 pb-12">
                    <h3
                      className="mb-2 text-xl font-semibold"
                      style={{ color: card.textColor }}
                    >
                      {card.title}
                    </h3>
                    {!isExpanded && (
                      <p
                        className="text-sm leading-relaxed opacity-80"
                        style={{ color: card.textColorMuted }}
                      >
                        {truncate(card.description || '', TEASER_LENGTH)}
                      </p>
                    )}
                    <AnimatePresence mode="wait">
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p
                            className="mb-4 text-sm leading-relaxed"
                            style={{ color: card.textColorMuted }}
                          >
                            {card.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3">
                            {card.type === 'delivery-methods' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeliveryMethodsNav()
                                }}
                                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                              >
                                Learn more
                                <FiArrowRight className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleReadFullStory(card.slug)
                                }}
                                className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                              >
                                Read full story
                                <FiArrowRight className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedId(null)
                              }}
                              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-white/70 transition-opacity hover:text-white"
                              aria-label="Close"
                            >
                              <FiX className="h-4 w-4" />
                              Close
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {!isExpanded && (
                      <span
                        className="absolute bottom-4 right-4 text-xs font-semibold uppercase tracking-wider text-white/80"
                        style={{ color: card.textColor }}
                      >
                        More
                      </span>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default memo(ServicesSection)
