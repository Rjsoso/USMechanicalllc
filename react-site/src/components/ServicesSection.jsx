import { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { useSanityLive } from '../hooks/useSanityLive'
import FadeInNative from './FadeInNative'
import { StaggerContainer, StaggerItem } from './animations/StaggerContainer'
import './ServicesEditorial.css'

function getBoxBackgroundStyle(box) {
  if (box.backgroundType === 'image' && box.backgroundImage?.asset?.url) {
    const imageUrl = `${box.backgroundImage.asset.url}?w=800&q=80&auto=format`
    return {
      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45)), url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }
  }
  if (box.backgroundType === 'color' && box.backgroundColor) {
    return { backgroundColor: box.backgroundColor }
  }
  return { backgroundColor: '#2a2a2a' }
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
      <div id="services" className="services-editorial">
        <div className="services-editorial__shell">
          <p className="services-editorial__loading">Loading services…</p>
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
            backgroundStyle: { backgroundColor: '#111111' },
            textColor: '#ffffff',
            methods: servicesData.deliveryMethods,
          },
        ]
      : []),
  ]

  const activeCard = cards.find((c) => c.id === hoveredId) ?? cards[0]
  const dimOthers = Boolean(hoveredId)

  return (
    <section
      id="services"
      className="services-editorial"
      style={{
        opacity: navigatingTo ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      <div className="services-editorial__shell">
        <FadeInNative>
          <header className="services-editorial__intro">
            <div className="services-editorial__section-label">
              <span>What we deliver</span>
            </div>
            <h2 className="services-editorial__title">{servicesData.sectionTitle || 'Services'}</h2>
            {servicesData.descriptionText && (
              <p className="services-editorial__lead">{servicesData.descriptionText}</p>
            )}
          </header>
        </FadeInNative>

        <div className="services-editorial__split">
          <div className="services-editorial__left">
            <StaggerContainer className="services-editorial__nav" intensity="strong">
              {cards.map((card) => {
                const isActive = card.id === (hoveredId ?? cards[0].id)
                return (
                  <StaggerItem key={card.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredId(card.id)}
                      onFocus={() => setHoveredId(card.id)}
                      onClick={() => handleNavigate(card)}
                      className={`services-editorial__list-btn ${isActive ? 'services-editorial__list-btn--active' : ''} ${dimOthers && !isActive ? 'services-editorial__list-btn--inactive' : ''} ${card.type === 'delivery-methods' ? 'services-editorial__list-btn--passive' : ''}`}
                    >
                      <span className="services-editorial__list-title">{card.title}</span>
                      {card.type !== 'delivery-methods' && (
                        <FiArrowRight className="services-editorial__list-arrow h-4 w-4" aria-hidden />
                      )}
                    </button>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </div>

          <div className="services-editorial__preview-col">
            <div className="services-editorial__preview-frame">
              <AnimatePresence mode="wait">
                {activeCard?.type === 'delivery-methods' ? (
                  <motion.div
                    key={activeCard.id}
                    className="services-editorial__delivery"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    <h3 className="services-editorial__delivery-title">{activeCard.title}</h3>
                    <div className="services-editorial__delivery-grid">
                      {activeCard.methods?.map((method, i) => (
                        <div key={i} className="services-editorial__delivery-cell">
                          <div className="services-editorial__delivery-num">{String(i + 1).padStart(2, '0')}</div>
                          <h4 className="services-editorial__delivery-cell-title">{method.title}</h4>
                          {method.summary && (
                            <p className="services-editorial__delivery-cell-desc">{method.summary}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : activeCard ? (
                  <motion.div
                    key={activeCard.id}
                    className="services-editorial__preview-inner"
                    style={activeCard.backgroundStyle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.26 }}
                  >
                    <div className="services-editorial__preview-gradient" aria-hidden />
                    <div className="services-editorial__preview-body">
                      <h3 className="services-editorial__preview-title">{activeCard.title}</h3>
                      {activeCard.description && (
                        <p className="services-editorial__preview-desc">{truncate(activeCard.description, 160)}</p>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNavigate(activeCard)
                        }}
                        className="services-editorial__cta"
                      >
                        View service
                        <FiArrowRight className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <StaggerContainer className="services-editorial__mobile" intensity="strong">
          {cards.map((card) =>
            card.type === 'delivery-methods' ? (
              <StaggerItem key={card.id}>
                <div className="services-editorial__mobile-delivery">
                  <h3>{card.title}</h3>
                  <div className="services-editorial__mobile-delivery-grid">
                    {card.methods?.map((method, i) => (
                      <div key={i}>
                        <div className="services-editorial__delivery-num">{String(i + 1).padStart(2, '0')}</div>
                        <h4 className="services-editorial__delivery-cell-title">{method.title}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ) : (
              <StaggerItem key={card.id}>
                <button
                  type="button"
                  onClick={() => handleNavigate(card)}
                  className="services-editorial__mobile-card services-editorial__mobile-card-btn"
                  style={{ ...card.backgroundStyle, minHeight: 140 }}
                >
                  <div className="services-editorial__preview-gradient" aria-hidden />
                  <div className="services-editorial__mobile-inner">
                    <h3 className="services-editorial__preview-title services-editorial__preview-title--mobile">
                      {card.title}
                    </h3>
                    <span className="services-editorial__mobile-cta">
                      View service
                      <FiArrowRight className="h-3 w-3" aria-hidden />
                    </span>
                  </div>
                </button>
              </StaggerItem>
            )
          )}
        </StaggerContainer>
      </div>
    </section>
  )
}

export default memo(ServicesSection)
