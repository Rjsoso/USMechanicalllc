import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  memo,
} from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { useSanityLive } from '../hooks/useSanityLive'

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

function getServiceImageUrl(s) {
  if (s.backgroundType === 'image' && s.backgroundImage?.asset?.url) {
    return `${s.backgroundImage.asset.url}?w=1600&q=85&auto=format`
  }
  return null
}

function getDeliveryImageUrl(methods) {
  if (!methods?.length) return null
  const m = methods.find((x) => x.backgroundImage?.asset?.url)
  return m ? `${m.backgroundImage.asset.url}?w=1600&q=85&auto=format` : null
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

function ServiceBlockContent({ card, onNavigate, headingId }) {
  if (card.type === 'delivery-methods') {
    return (
      <>
        <h3
          id={headingId}
          className="mb-5 text-2xl font-bold text-white leading-tight"
        >
          {card.title}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {card.methods?.map((method, i) => (
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
      </>
    )
  }

  return (
    <>
      <h3
        id={headingId}
        className="mb-4 text-3xl font-bold text-white leading-tight"
      >
        {card.title}
      </h3>
      {card.description && (
        <p className="mb-8 max-w-md text-base leading-relaxed text-white/75">
          {card.description}
        </p>
      )}
      <button
        type="button"
        onClick={() => onNavigate(card)}
        className="inline-flex items-center gap-2 rounded-md bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        View service
        <FiArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </>
  )
}

const ServicesSection = ({ data: servicesDataProp }) => {
  const [activeId, setActiveId] = useState(null)
  const [navigatingTo, setNavigatingTo] = useState(null)
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const introRef = useRef(null)
  const itemRefs = useRef({})
  const rafRef = useRef(0)

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

  const cards = useMemo(() => {
    if (!servicesData?.servicesInfo?.length) return []
    const services = servicesData.servicesInfo
    const hasDelivery = servicesData.deliveryMethods?.length > 0
    const deliverySummary =
      hasDelivery &&
      servicesData.deliveryMethods
        .map((m) => m.title)
        .filter(Boolean)
        .join(' · ')

    return [
      ...services.map((s, i) => ({
        type: 'service',
        id: s.slug?.current ?? `service-${i}`,
        title: s.title,
        description: s.description,
        slug: s.slug?.current,
        imageUrl: getServiceImageUrl(s),
        imageAlt: s.backgroundImage?.alt || s.title || 'Service',
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
              imageUrl: getDeliveryImageUrl(servicesData.deliveryMethods),
              imageAlt: 'Delivery methods',
              backgroundStyle: { backgroundColor: '#1a1a1a' },
              textColor: '#ffffff',
              methods: servicesData.deliveryMethods,
            },
          ]
        : []),
    ]
  }, [servicesData])

  const firstId = cards[0]?.id
  const resolvedActiveId = activeId ?? firstId
  const activeCard = cards.find((c) => c.id === resolvedActiveId) ?? cards[0]

  const transitionDuration = reduceMotion ? 0 : 0.32

  useEffect(() => {
    if (!firstId) return

    const measure = () => {
      const viewportCenter = window.innerHeight * 0.42
      let bestDist = Infinity
      let bestId = firstId

      const candidates = [
        { el: introRef.current, id: firstId },
        ...cards.map((c) => ({
          el: itemRefs.current[c.id],
          id: c.id,
        })),
      ]

      candidates.forEach(({ el, id }) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.bottom < 40 || rect.top > window.innerHeight - 40) return
        const center = rect.top + rect.height / 2
        const dist = Math.abs(center - viewportCenter)
        if (dist < bestDist) {
          bestDist = dist
          bestId = id
        }
      })

      setActiveId(bestId)
    }

    const onScrollOrResize = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(measure)
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    measure()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [cards, firstId])

  if (loading || servicesData === null) {
    return (
      <div id="services" style={{ position: 'relative', minHeight: '200px' }}>
        <div className="bg-transparent pb-20 pt-12 text-white">
          <div className="mx-auto max-w-7xl px-6 flex items-center justify-center py-12">
            <p className="text-white/70 text-lg">Loading services…</p>
          </div>
        </div>
      </div>
    )
  }

  if (!servicesData?.servicesInfo?.length) return null

  return (
    <div
      id="services"
      className="relative scroll-mt-[5.5rem] text-white"
      style={{
        opacity: navigatingTo ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Desktop: 50% sticky images | 50% scroll-driven copy */}
      <div className="hidden lg:flex lg:flex-row">
        <div
          className="lg:sticky lg:top-0 lg:self-start lg:h-screen lg:w-1/2 lg:shrink-0 relative overflow-hidden bg-neutral-900"
          aria-hidden="true"
        >
          {cards.map((c) =>
            c.imageUrl ? (
              <img
                key={`preload-${c.id}`}
                src={c.imageUrl}
                alt=""
                loading="eager"
                decoding="async"
                className="pointer-events-none absolute h-px w-px opacity-0"
                aria-hidden
              />
            ) : null
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard?.id}
              className="absolute inset-0"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: transitionDuration, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeCard?.imageUrl ? (
                <img
                  src={activeCard.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={activeCard?.backgroundStyle}
                />
              )}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
                aria-hidden
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:w-1/2 lg:min-w-0 px-6 lg:pl-10 lg:pr-10 xl:pr-16 py-16 lg:py-24">
          <div ref={introRef} className="mb-4 max-w-xl">
            <h2 className="section-title text-3xl text-white md:text-4xl">
              {servicesData.sectionTitle || 'Services'}
            </h2>
            {servicesData.descriptionText && (
              <p className="mt-3 text-lg text-white/75 leading-relaxed">
                {servicesData.descriptionText}
              </p>
            )}
          </div>

          {cards.map((card) => (
            <section
              key={card.id}
              ref={(el) => {
                itemRefs.current[card.id] = el
              }}
              className="min-h-[85vh] flex flex-col justify-center py-12 border-t border-white/10 first:border-t-0 first:pt-8"
              aria-labelledby={`service-heading-${card.id}`}
            >
              <ServiceBlockContent
                card={card}
                onNavigate={handleNavigate}
                headingId={`service-heading-${card.id}`}
              />
            </section>
          ))}
        </div>
      </div>

      {/* Mobile / tablet: stacked intro + card grid */}
      <div className="lg:hidden px-6 py-14">
        <div className="mb-10 max-w-xl">
          <h2 className="section-title text-3xl text-white md:text-4xl">
            {servicesData.sectionTitle || 'Services'}
          </h2>
          {servicesData.descriptionText && (
            <p className="mt-3 text-lg text-white/75 leading-relaxed">
              {servicesData.descriptionText}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((card) =>
            card.type === 'delivery-methods' ? (
              <div
                key={card.id}
                className="relative overflow-hidden rounded-lg text-left sm:col-span-2"
                style={{ backgroundColor: '#1a1a1a' }}
              >
                <div className="p-5">
                  <h3 className="text-base font-semibold text-white mb-3">
                    {card.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {card.methods?.map((method, i) => (
                      <div key={i} className="rounded bg-white/[0.07] p-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-xs font-semibold text-white mt-0.5">
                          {method.title}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button
                key={card.id}
                type="button"
                onClick={() => handleNavigate(card)}
                className="relative overflow-hidden rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-white/40"
                style={
                  card.imageUrl
                    ? { minHeight: 160, backgroundColor: '#1a1a1a' }
                    : { ...card.backgroundStyle, minHeight: 160 }
                }
              >
                {card.imageUrl && (
                  <img
                    src={card.imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)',
                  }}
                />
                <div
                  className="relative flex h-full min-h-[160px] flex-col justify-end p-5"
                >
                  <h3 className="text-base font-semibold text-white">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-white/70">
                      {truncate(card.description, 100)}
                    </p>
                  )}
                  <span className="mt-2 flex items-center gap-1 text-xs text-white/80">
                    View <FiArrowRight className="h-3 w-3" aria-hidden />
                  </span>
                </div>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(ServicesSection)
