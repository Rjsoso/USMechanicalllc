import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { urlFor } from '../utils/sanity'
import { viewportPreset } from '../utils/viewport'
import { PortableText } from '@portabletext/react'
import SEO from '../components/SEO'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Carousel from '../components/Carousel'
import { getSiteUrl } from '../utils/siteUrl'
import FadeInWhenVisible from '../components/FadeInWhenVisible'
import SmallSpinner from '../components/SmallSpinner'
import { useSanityLive } from '../hooks/useSanityLive'

const SERVICES_INFO_QUERY = `*[_type == "ourServices"][0]{
  servicesInfo[] {
    title,
    description,
    slug { current },
    fullDescription,
    images[] { asset-> { _id, url }, alt, caption },
    features[] { title, description }
  }
}`

export default function ServiceDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data, loading } = useSanityLive(SERVICES_INFO_QUERY, {}, {
    listenFilter: `*[_type == "ourServices"]`,
  })

  const servicesList = useMemo(() => Array.isArray(data?.servicesInfo) ? data.servicesInfo : [], [data])
  const serviceData = useMemo(() => {
    if (!slug || !data?.servicesInfo) return null
    return data.servicesInfo.find(s => s.slug?.current === slug) ?? null
  }, [data, slug])

  // Derive "not found" state from inputs rather than managing it in state.
  // Treats "still loading" as not-an-error, and only flags missing data
  // once the Sanity fetch has resolved.
  const error = !loading && slug && data && !serviceData ? 'Service not found' : null

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])


  const { prevService, nextService } = useMemo(() => {
    if (!Array.isArray(servicesList) || servicesList.length === 0) {
      return { prevService: null, nextService: null }
    }
    const currentIndex = servicesList.findIndex(s => s.slug?.current === slug)
    if (currentIndex < 0) return { prevService: null, nextService: null }
    return {
      prevService: currentIndex > 0 ? servicesList[currentIndex - 1] : null,
      nextService: currentIndex < servicesList.length - 1 ? servicesList[currentIndex + 1] : null,
    }
  }, [servicesList, slug])

  // Build a 1200x630 social preview image from the first service image
  const ogImageUrl = useMemo(() => {
    const first = serviceData?.images?.find((p) => p && p.asset)
    if (!first) return undefined
    try {
      return urlFor(first).width(1200).height(630).fit('crop').auto('format').url()
    } catch {
      return undefined
    }
  }, [serviceData])

  const carouselItems = useMemo(() => {
    if (
      !serviceData?.images ||
      !Array.isArray(serviceData.images) ||
      serviceData.images.length === 0
    ) {
      return []
    }

    return serviceData.images
      .map((photo, index) => {
        if (!photo || !photo.asset) return null
        const imageUrl =
          (photo.asset && urlFor(photo)?.width(800).quality(85).auto('format').url()) || ''
        const srcSet = [400, 600, 800, 1200, 1600]
          .map((w) => {
            const url = urlFor(photo).width(w).quality(85).auto('format').url()
            return url ? `${url} ${w}w` : null
          })
          .filter(Boolean)
          .join(', ')
        return {
          id: `service-photo-${index}`,
          src: imageUrl,
          srcSet,
          sizes: '(max-width: 768px) 100vw, 50vw',
          alt: photo.alt || `${serviceData.title} ${index + 1}`,
          caption: photo.caption || null,
        }
      })
      .filter(Boolean)
  }, [serviceData])

  if (loading) {
    return (
      <>
        <Header />
        <main
          className="flex min-h-screen items-center justify-center bg-white text-black"
          style={{ paddingTop: '180px' }}
        >
          <SmallSpinner label="Loading service…" variant="light" />
        </main>
        <Footer />
      </>
    )
  }

  if (error || !serviceData) {
    return (
      <>
        <Header />
        <div
          className="flex min-h-screen items-center justify-center bg-white text-black"
          style={{ paddingTop: '180px' }}
        >
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">Service Not Found</h1>
            <p className="mb-8 text-black">
              The service you&apos;re looking for doesn&apos;t exist.
            </p>
            <button
              onClick={() => navigate('/')}
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Go Back Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SEO
        title={`${serviceData.title} | US Mechanical`}
        description={
          serviceData.metaDescription ||
          `Professional ${serviceData.title} services by US Mechanical. Serving Utah, Nevada, and beyond since 1963.`
        }
        keywords={`${serviceData.title}, mechanical services, HVAC, plumbing, ${serviceData.title} Utah, ${serviceData.title} Nevada`}
        url={`${getSiteUrl()}/services/${serviceData.slug.current}`}
        {...(ogImageUrl ? { ogImage: ogImageUrl } : {})}
      />
      <Header />
      <motion.main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-white text-black"
        style={{ paddingTop: '180px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          {/* Back + Prev/Next */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/', { state: { scrollTo: 'services' } })}
              className="flex items-center gap-2 text-black transition-colors hover:text-gray-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Services
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  prevService?.slug?.current && navigate(`/services/${prevService.slug.current}`)
                }
                disabled={!prevService?.slug?.current}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous service"
              >
                <FiChevronLeft className="text-lg" />
                Previous Service
              </button>

              <button
                type="button"
                onClick={() =>
                  nextService?.slug?.current && navigate(`/services/${nextService.slug.current}`)
                }
                disabled={!nextService?.slug?.current}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next service"
              >
                Next Service
                <FiChevronRight className="text-lg" />
              </button>
            </div>
          </div>

          {/* Service Title */}
          <motion.h1
            className="section-title mb-8 text-5xl text-black md:text-6xl"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportPreset}
            transition={{ duration: 0.25 }}
          >
            {serviceData.title}
          </motion.h1>

          {/* Preview Description */}
          {serviceData.description && (
            <motion.p
              className="mb-12 text-xl leading-relaxed text-black"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportPreset}
              transition={{ duration: 0.25 }}
            >
              {serviceData.description}
            </motion.p>
          )}

          {/* Full Description (Rich Text) */}
          {serviceData.fullDescription && serviceData.fullDescription.length > 0 && (
            <motion.div
              className="prose prose-lg mb-12 max-w-none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportPreset}
              transition={{ duration: 0.25 }}
            >
              <PortableText value={serviceData.fullDescription} />
            </motion.div>
          )}

          {/* Images Carousel and Features Side by Side */}
          {(serviceData.images && serviceData.images.length > 0) ||
          (serviceData.features && serviceData.features.length > 0) ? (
            <motion.div
              className="mb-6 flex flex-col items-center gap-8 md:flex-row md:gap-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportPreset}
              transition={{ duration: 0.25 }}
            >
              {/* Carousel on left, features on right (or reverse on mobile) */}
              {carouselItems.length > 0 && (
                <div className="order-2 flex w-full justify-center md:order-1 md:w-1/2">
                  <FadeInWhenVisible>
                    <Carousel
                      items={carouselItems}
                      baseWidth={550}
                      containerClassName="h-[min(40svh,360px)] min-h-[260px] w-full md:h-[400px]"
                      compactNav={true}
                      autoplay={true}
                      autoplayDelay={4000}
                      pauseOnHover={true}
                      loop={true}
                      round={false}
                      imageFit="contain"
                    />
                  </FadeInWhenVisible>
                </div>
              )}

              {/* Features List on Right */}
              {serviceData.features && serviceData.features.length > 0 && (
                <div
                  className={`${carouselItems.length > 0 ? 'md:w-1/2' : 'w-full'} order-1 md:order-2`}
                >
                  <FadeInWhenVisible delay={0.16}>
                    <h2 className="mb-6 text-3xl font-bold text-black">Key Features</h2>
                  </FadeInWhenVisible>
                  <FadeInWhenVisible delay={0.32}>
                    <div className="space-y-4">
                      {serviceData.features.map((feature, index) => (
                        <div key={index} className="rounded-xl border border-gray-300 bg-white p-6">
                          {feature.title && (
                            <h3 className="mb-2 text-xl font-semibold text-black">
                              {feature.title}
                            </h3>
                          )}
                          {feature.description && (
                            <p className="leading-relaxed text-black">{feature.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </FadeInWhenVisible>
                </div>
              )}
            </motion.div>
          ) : null}

        </div>
      </motion.main>
      <Footer />
    </>
  )
}
