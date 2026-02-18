import { useEffect, useState, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { client } from '../utils/sanity'

const ServicesSection = ({ data: servicesDataProp }) => {
  const [servicesData, setServicesData] = useState(servicesDataProp || null)
  const navigate = useNavigate()

  // Update servicesData when prop changes
  useEffect(() => {
    if (servicesDataProp) {
      setServicesData(servicesDataProp)
    }
  }, [servicesDataProp])

  // Fallback fetch when prop is null (e.g. Home fetch failed or is slow)
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
        .then(data => {
          if (!cancelled) setServicesData(data)
        })
        .catch(err => {
          if (!cancelled) console.error('[ServicesSection] Fallback fetch error:', err)
        })
    }, 800)
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
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

  // Loading: reserve space and keep id="services" for nav/scroll targets
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

  // No services content after data loaded
  if (!servicesData?.servicesInfo || servicesData?.servicesInfo.length === 0) {
    return null
  }

  return (
    <section
      id="services"
      className="bg-transparent pb-20 pt-12 text-white"
      style={{ position: 'relative' }}
    >
      {/* Title and Description - Centered */}
      <div className="mx-auto max-w-7xl px-6 mb-12">
        <h2 className="section-title mb-12 text-center text-5xl text-white md:text-6xl">
          {servicesData.sectionTitle || 'Our Services'}
        </h2>
        <p className="mb-0 text-left text-lg text-white">
          {servicesData.descriptionText}
        </p>
      </div>

      {/* Service Boxes and Delivery Methods - Full Width */}
      <div className="flex flex-col items-stretch justify-center gap-10 md:flex-row md:gap-8">
        {/* LEFT — SERVICE BOXES (full-bleed to the left edge) */}
        <div className="flex-1 space-y-4 md:w-1/2">
          {servicesData.servicesInfo &&
            servicesData.servicesInfo.map((box, index) => {
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

                  return {
                    backgroundColor: '#000000',
                  }
                }

                const backgroundStyle = getBoxBackgroundStyle()

                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden p-8 shadow transition-opacity duration-150 ease-out hover:opacity-90"
                    style={{
                      ...backgroundStyle,
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
                  </div>
                )
              })}
        </div>

        {/* RIGHT — DELIVERY METHODS CARD */}
        {servicesData.deliveryMethods?.length > 0 && (
          <div className="flex flex-1 flex-col md:w-1/2">
            <div
              className="group relative cursor-pointer overflow-hidden p-8 shadow transition-opacity duration-150 ease-out hover:opacity-90"
              style={{ backgroundColor: '#111111' }}
              onClick={() => navigate('/delivery-methods')}
            >
              <h3 className="mb-3 text-xl font-semibold text-white">
                {servicesData.deliveryMethodsHeading || 'Delivery Methods'}
              </h3>
              <button
                onClick={e => { e.stopPropagation(); navigate('/delivery-methods') }}
                className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-80"
              >
                Learn More
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default memo(ServicesSection)
