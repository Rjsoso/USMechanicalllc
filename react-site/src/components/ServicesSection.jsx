import { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { useSanityLive } from '../hooks/useSanityLive'
import FadeInNative from './FadeInNative'

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

const SERVICES_QUERY = `*[_type == "ourServices"][0]{
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

const ServicesSection = ({ data: servicesDataProp }) => {
  const [hoveredId, setHoveredId] = useState(null)
  const [navigatingTo, setNavigatingTo] = useState(null)
  const navigate = useNavigate()

  const { data: servicesData, loading } = useSanityLive(SERVICES_QUERY, {}, {
    initialData: servicesDataProp,
    listenFilter: `*[_type == "ourServices"]`,
  })

  const handleNavigate = useCallback((card) => {
    if (card.type === 'delivery-methods') return
    const target = `/services/${card.slug}`
    setNavigatingTo(target)
    setTimeout(() => navigate(target), 200)
  }, [navigate])

  if (loading || servicesData === null) {
    return (
      <div id="services" className="bg-black py-20">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-center py-12">
          <p className="text-white/70 text-lg">Loading services…</p>
        </div>
      </div>
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
            methods: servicesData.deliveryMethods,
          },
        ]
      : []),
  ]

  const activeCard = cards.find(c => c.id === hoveredId) ?? cards[0]

  return (
    <section
      id="services"
      className="bg-black py-20 text-white md:py-28"
      style={{
        opacity: navigatingTo ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <FadeInNative>
          <div className="mb-12">
            <h2 className="section-title text-3xl text-white md:text-4xl">
              {servicesData.sectionTitle || 'Services'}
            </h2>
            {servicesData.descriptionText && (
              <p className="mt-3 max-w-xl text-lg text-white/70">
                {servicesData.descriptionText}
              </p>
            )}
          </div>
        </FadeInNative>

        {/* Desktop: list left, preview right */}
        <div className="hidden lg:grid lg:grid-cols-[5fr_6fr] lg:gap-0">
          <div className="flex flex-col">
            {cards.map((card) => {
              const isActive = card.id === (hoveredId ?? cards[0].id)
              return (
                <FadeInNative key={card.id}>
                  <motion.button
                    type="button"
                    onMouseEnter={() => setHoveredId(card.id)}
                    onFocus={() => setHoveredId(card.id)}
                    onClick={() => handleNavigate(card)}
                    className="group flex w-full items-center gap-5 border-b border-white/20 px-2 py-5 text-left outline-none"
                    style={{ cursor: card.type === 'delivery-methods' ? 'default' : 'pointer' }}
                    animate={{ opacity: hoveredId && !isActive ? 0.55 : 1 }}
                    transition={{ duration: 0.18 }}
                  >
                    <span
                      className="flex-1 text-lg font-semibold leading-tight tracking-tight text-white"
                    >
                      <motion.span
                        className="inline-block"
                        animate={{ x: isActive ? 6 : 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {card.title}
                      </motion.span>
                    </span>
                    {card.type !== 'delivery-methods' && (
                      <motion.span
                        className="shrink-0"
                        animate={{ x: isActive ? 4 : 0, opacity: isActive ? 1 : 0.3 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <FiArrowRight className="h-4 w-4 text-white" />
                      </motion.span>
                    )}
                  </motion.button>
                </FadeInNative>
              )
            })}
          </div>

          {/* Preview panel */}
          <div
            className="relative overflow-hidden rounded-lg"
            style={{ minHeight: 440 }}
          >
            <AnimatePresence mode="wait">
              {activeCard && activeCard.type === 'delivery-methods' ? (
                <motion.div
                  key={activeCard.id}
                  className="absolute inset-0 flex flex-col p-8"
                  style={{ backgroundColor: '#1a1a1a' }}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="mb-5 text-2xl font-bold text-white leading-tight">
                    {activeCard.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {activeCard.methods?.map((method, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-white/[0.07] p-4 flex flex-col"
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-1">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-sm font-semibold text-white mb-1.5">
                          {method.title}
                        </h4>
                        {method.summary && (
                          <p className="text-xs leading-relaxed text-white/60 line-clamp-3">
                            {method.summary}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : activeCard && (
                <motion.div
                  key={activeCard.id}
                  className="absolute inset-0 flex flex-col justify-end p-10"
                  style={activeCard.backgroundStyle}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                    }}
                  />
                  <div className="relative">
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
                      className="inline-flex items-center gap-2 rounded-md bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                    >
                      View service
                      <FiArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: thumbnail cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {cards.map((card) =>
            card.type === 'delivery-methods' ? (
              <FadeInNative key={card.id}>
                <div
                  className="relative overflow-hidden rounded-lg text-left sm:col-span-2"
                  style={{ backgroundColor: '#1a1a1a' }}
                >
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-white mb-3">{card.title}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {card.methods?.map((method, i) => (
                        <div key={i} className="rounded bg-white/[0.07] p-3">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <h4 className="text-xs font-semibold text-white mt-0.5">{method.title}</h4>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeInNative>
            ) : (
              <FadeInNative key={card.id}>
                <button
                  type="button"
                  onClick={() => handleNavigate(card)}
                  className="relative w-full overflow-hidden rounded-lg text-left"
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
              </FadeInNative>
            )
          )}
        </div>
      </div>
    </section>
  )
}

export default memo(ServicesSection)
