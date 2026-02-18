import { useEffect, useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { client } from '../utils/sanity'

function getBoxBackgroundStyle(box) {
  if (box.backgroundType === 'image' && box.backgroundImage?.asset?.url) {
    const imageUrl = `${box.backgroundImage.asset.url}?w=1200&q=80&auto=format`
    return {
      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.65)), url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }
  }
  if (box.backgroundType === 'color' && box.backgroundColor) {
    return { backgroundColor: box.backgroundColor }
  }
  return { backgroundColor: '#3d3d3d' }
}

function truncate(str, len) {
  if (!str || typeof str !== 'string') return ''
  return str.length <= len ? str : str.slice(0, len).trim() + '…'
}

const ServicesSection = ({ data: servicesDataProp }) => {
  const [servicesData, setServicesData] = useState(servicesDataProp || null)
  const [hoveredId, setHoveredId] = useState(null)
  const [navigatingTo, setNavigatingTo] = useState(null)
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

  const handleNavigate = useCallback((card) => {
    const target =
      card.type === 'delivery-methods'
        ? '/delivery-methods'
        : `/services/${card.slug}`
    setNavigatingTo(target)
    setTimeout(() => navigate(target), 200)
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
    })),
    ...(hasDelivery
      ? [
          {
            type: 'delivery-methods',
            id: 'delivery-methods',
            title: servicesData.deliveryMethodsHeading || 'Delivery Methods',
            description: deliverySummary || 'Explore how we deliver projects.',
            backgroundStyle: { backgroundColor: '#3d3d3d' },
            textColor: '#ffffff',
          },
        ]
      : []),
  ]

  const activeCard = cards.find(c => c.id === hoveredId) ?? cards[0]

  return (
    <section
      id="services"
      className="bg-transparent pb-20 pt-12 text-white"
      style={{
        position: 'relative',
        opacity: navigatingTo ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section heading */}
        <div className="mb-10">
          <h2 className="section-title text-3xl text-white md:text-4xl">
            {servicesData.sectionTitle || 'Services'}
          </h2>
          {servicesData.descriptionText && (
            <p className="mt-2 max-w-xl text-sm text-white/60">
              {truncate(servicesData.descriptionText, 120)}
            </p>
          )}
        </div>

        {/* Split: list left, preview right */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[5fr_6fr] lg:gap-0">

          {/* LEFT — numbered list */}
          <div className="flex flex-col border-t border-white/10">
            {cards.map((card, index) => {
              const isActive = card.id === (hoveredId ?? cards[0].id)
              return (
                <motion.button
                  key={card.id}
                  type="button"
                  onMouseEnter={() => setHoveredId(card.id)}
                  onFocus={() => setHoveredId(card.id)}
                  onClick={() => handleNavigate(card)}
                  className="group flex w-full items-center gap-5 border-b border-white/10 px-2 py-5 text-left outline-none"
                  animate={{ opacity: hoveredId && !isActive ? 0.3 : 1 }}
                  transition={{ duration: 0.18 }}
                >
                  {/* Index number */}
                  <span className="w-8 shrink-0 text-xs font-mono text-white/40 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <span
                    className="flex-1 text-lg font-semibold leading-tight tracking-tight"
                    style={{ color: '#ffffff' }}
                  >
                    <motion.span
                      className="inline-block"
                      animate={{ x: isActive ? 6 : 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {card.title}
                    </motion.span>
                  </span>

                  {/* Arrow */}
                  <motion.span
                    className="shrink-0"
                    animate={{ x: isActive ? 4 : 0, opacity: isActive ? 1 : 0.3 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <FiArrowRight className="h-4 w-4 text-white" />
                  </motion.span>
                </motion.button>
              )
            })}
          </div>

          {/* RIGHT — preview panel (desktop only) */}
          <div className="relative hidden overflow-hidden rounded-lg lg:block" style={{ minHeight: 440 }}>
            <AnimatePresence mode="wait">
              {activeCard && (
                <motion.div
                  key={activeCard.id}
                  className="absolute inset-0 flex flex-col justify-end p-10"
                  style={activeCard.backgroundStyle}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Gradient overlay so text is always readable */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                    }}
                  />
                  <div className="relative">
                    <p className="mb-1 text-xs font-mono text-white/50 uppercase tracking-widest">
                      {String((cards.findIndex(c => c.id === activeCard.id) + 1)).padStart(2, '0')}
                    </p>
                    <h3 className="mb-3 text-3xl font-bold text-white leading-tight">
                      {activeCard.title}
                    </h3>
                    {activeCard.description && (
                      <p className="mb-6 max-w-sm text-sm leading-relaxed text-white/75">
                        {truncate(activeCard.description, 140)}
                      </p>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNavigate(activeCard)
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                    >
                      {activeCard.type === 'delivery-methods' ? 'Explore methods' : 'View service'}
                      <FiArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MOBILE — thumbnail cards (shown below md breakpoint instead of list) */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleNavigate(card)}
              className="relative overflow-hidden rounded-lg text-left"
              style={{ ...card.backgroundStyle, minHeight: 140 }}
            >
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
              />
              <div className="relative flex h-full flex-col justify-end p-5" style={{ minHeight: 140 }}>
                <h3 className="text-base font-semibold text-white">{card.title}</h3>
                <span className="mt-1 flex items-center gap-1 text-xs text-white/70">
                  View <FiArrowRight className="h-3 w-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(ServicesSection)
