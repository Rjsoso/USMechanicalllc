import { useEffect, useState, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
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

  const handleCardClick = useCallback(
    (card) => {
      if (card.type === 'delivery-methods') {
        navigate('/delivery-methods')
      } else if (card.slug) {
        navigate(`/services/${card.slug}`)
      }
    },
    [navigate]
  )

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
            backgroundStyle: { backgroundColor: '#2d2d2d' },
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
          className="inline-block border border-white/30 bg-white/5 px-5 py-2.5"
          style={{ transform: 'rotate(-0.5deg)' }}
        >
          <span className="text-lg font-bold uppercase tracking-widest text-white/90">
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
        <div className="flex flex-wrap items-stretch justify-center gap-6">
          {cards.map((card, index) => {
            const rotation = ROTATIONS[index % ROTATIONS.length]

            return (
              <motion.div
                key={card.id}
                className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                style={{ transformStyle: 'preserve-3d' }}
                layout
              >
                <motion.div
                  layout
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardClick(card)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleCardClick(card)
                    }
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
                    <p
                      className="text-sm leading-relaxed opacity-80"
                      style={{ color: card.textColorMuted }}
                    >
                      {truncate(card.description || '', TEASER_LENGTH)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCardClick(card)
                      }}
                      className="absolute bottom-4 right-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/90 transition-opacity hover:opacity-100"
                      style={{ color: card.textColor }}
                    >
                      Learn more
                      <FiArrowRight className="h-4 w-4" />
                    </button>
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
