import { useEffect, useState, useMemo } from 'react'
import { client, urlFor } from '../utils/sanity'
import { PortableText } from '@portabletext/react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import FadeInNative from '../components/FadeInNative'
import Carousel from '../components/Carousel'
import LogoLoop from '../components/LogoLoop'
import { FiArrowRight } from 'react-icons/fi'

export default function About() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoopsHovered, setIsLoopsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [isAnimating, setIsAnimating] = useState(false)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  )
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const defaultData = {
    aboutTitle: 'About U.S. Mechanical',
    aboutText: `U.S. Mechanical's foundation was laid in 1963 with the organization of Bylund Plumbing and Heating. Since that time, the Bylund family has continuously been in the mechanical contracting industry. The U.S. Mechanical name was adopted 25 years ago and continues to represent our company owners and employees.

We pursue projects in the Intermountain and Southwest regions via hard bid, design build, CMAR, and cost plus. Our team includes journeyman and apprentice plumbers, sheet metal installers, pipefitters, welders, and administrative staff—all with unmatched experience.

We maintain offices in Pleasant Grove, Utah, and Las Vegas, Nevada, as well as Snyder Mechanical in Elko, Nevada, which serves the mining industry. U.S. Mechanical is fully licensed, bonded, and insured in Nevada, Utah, Arizona, California, and Wyoming.`,
    safetyTitle: 'Safety & Risk Management',
    safetyText: `U.S. Mechanical conducts all projects with safety as our top priority. We employ a company-wide safety program led by a full-time OSHA and MSHA accredited safety director. Our focus on safety ensures properly trained employees and a work environment that prioritizes everyone's well-being.

Our experience modification rate (EMR) remains below the national average, qualifying us for self-insured insurance programs that reduce risk management costs. These savings, combined with our dedication to safety, provide added value on every project.

Our goal is always simple: complete every project with zero safety issues.`,
  }

  useEffect(() => {
    let isCancelled = false

    const fetchData = async () => {
      try {
        const aboutData = await client.fetch(
          `*[_type == "aboutAndSafety"] | order(_updatedAt desc)[0]{
            aboutTitle,
            aboutText,
            aboutPhotos[] {
              asset-> {
                _id,
                url,
                originalFilename
              },
              alt,
              caption
            },
            safetyTitle,
            safetyText,
            safetyLogos[] {
              image {
                asset-> {
                  _id,
                  url,
                  originalFilename
                },
                alt,
                caption
              },
              icon,
              title,
              href
            }
          }`
        )

        if (isCancelled) return

        if (!aboutData) {
          setData(defaultData)
        } else {
          setData({ ...defaultData, ...aboutData })
        }
      } catch {
        if (!isCancelled) {
          setData(defaultData)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isCancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const carouselItems = useMemo(() => {
    if (!data?.aboutPhotos || !Array.isArray(data.aboutPhotos) || data.aboutPhotos.length === 0) {
      return []
    }

    return data.aboutPhotos
      .map((photo, index) => {
        if (!photo || !photo.asset) return null
        const imageUrl = photo.asset.url
          ? `${photo.asset.url}?w=1200&q=82&auto=format`
          : (photo.asset && urlFor(photo)?.width(1200).quality(82).auto('format').url()) || ''
        return {
          id: `about-photo-${index}`,
          src: imageUrl,
          alt: photo.alt || `About US Mechanical ${index + 1}`,
          caption: photo.caption || null,
        }
      })
      .filter(Boolean)
  }, [data?.aboutPhotos])

  const safetyLogoItems = useMemo(() => {
    if (!data?.safetyLogos || !Array.isArray(data.safetyLogos) || data.safetyLogos.length === 0) {
      return []
    }

    return data.safetyLogos
      .map((item, index) => {
        if (!item) return null

        if (item.image && item.image.asset) {
          const imageUrl = item.image.asset.url
            ? `${item.image.asset.url}?w=200&q=80&auto=format`
            : (item.image.asset &&
                urlFor(item.image)?.width(200).quality(80).auto('format').url()) ||
              ''
          return {
            src: imageUrl,
            alt: item.image.alt || item.title || `Safety logo ${index + 1}`,
            title: item.title || item.image.alt || `Safety logo ${index + 1}`,
            href: item.href || undefined,
          }
        }

        return null
      })
      .filter(Boolean)
  }, [data?.safetyLogos])

  const getSafetyLogoHeight = () => {
    if (windowWidth < 768) return 50
    if (windowWidth >= 2560) return 90
    if (windowWidth >= 1920) return 100
    if (windowWidth >= 1440) return 110
    return 120
  }

  const getSafetyGap = () => {
    if (windowWidth < 768) return 30
    if (windowWidth >= 2560) return 28
    if (windowWidth >= 1920) return 32
    if (windowWidth >= 1440) return 36
    return 40
  }

  if (loading || !data) {
    return (
      <>
        <SEO
          title="About Us - Company Background | US Mechanical"
          description="Learn about U.S. Mechanical's history since 1963, our team, offices, and commitment to safety in mechanical contracting."
          keywords="US Mechanical history, company background, mechanical contractor Utah, HVAC company Nevada, plumbing contractor history, construction company about"
          url="https://usmechanical.com/about"
        />
        <Header />
        <div className="min-h-screen bg-black py-20 text-center text-white">Loading content...</div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SEO
        title="About Us - Company Background | US Mechanical"
        description="Learn about U.S. Mechanical's history since 1963, our team, offices, and commitment to safety in mechanical contracting throughout Utah, Nevada, and beyond."
        keywords="US Mechanical history, company background, mechanical contractor Utah, HVAC company Nevada, plumbing contractor history, construction company about, safety management, OSHA certified"
        url="https://usmechanical.com/about"
      />
      <Header />

      <main className="bg-black pt-20">
        <section className="relative z-0 overflow-hidden bg-black py-20 text-white">
          {carouselItems.length > 0 && (
            <div
              className="flex w-full flex-col items-stretch gap-0 md:flex-row"
              style={
                isMobile
                  ? {}
                  : {
                      perspective: '1000px',
                      isolation: 'isolate',
                    }
              }
            >
              <div
                className={isMobile ? 'w-full' : 'overflow-hidden'}
                style={
                  isMobile
                    ? {}
                    : {
                        width: isExpanded ? '45%' : '75%',
                        transform: isExpanded ? 'translate3d(-15%, 0, 0)' : 'translate3d(0, 0, 0)',
                        transition:
                          'width 1400ms cubic-bezier(0.16, 1, 0.3, 1), transform 1400ms cubic-bezier(0.16, 1, 0.3, 1)',
                        willChange: 'width, transform',
                        backfaceVisibility: 'hidden',
                        WebkitFontSmoothing: 'antialiased',
                        contain: 'layout style paint',
                      }
                }
              >
                <Carousel
                  items={carouselItems}
                  baseWidth={isMobile ? windowWidth - 32 : 1100}
                  containerClassName={
                    isMobile ? 'h-[300px]' : 'h-[380px] md:h-[450px] lg:h-[580px] xl:h-[680px]'
                  }
                  arrowsInside={true}
                  autoplay={isMobile ? false : !isExpanded}
                  autoplayDelay={4000}
                  pauseOnHover={true}
                  loop={true}
                  round={false}
                />
              </div>

              <div
                className={isMobile ? 'w-full bg-black' : 'flex items-start bg-black'}
                style={
                  isMobile
                    ? {}
                    : {
                        width: isExpanded ? '55%' : '25%',
                        transition: 'width 1400ms cubic-bezier(0.16, 1, 0.3, 1)',
                        willChange: 'width',
                        backfaceVisibility: 'hidden',
                        WebkitFontSmoothing: 'antialiased',
                        contain: 'layout style paint',
                        isolation: 'isolate',
                        transform: 'translate3d(0, 0, 0)',
                      }
                }
              >
                <div className="w-full px-6 pb-8 pt-8 lg:px-8">
                  <FadeInNative delay={0.1}>
                    <h1
                      className="section-title mb-4 text-3xl text-white md:text-4xl lg:text-5xl"
                      style={
                        isMobile
                          ? {}
                          : {
                              transform: 'translate3d(0, 0, 0)',
                              backfaceVisibility: 'hidden',
                              WebkitFontSmoothing: 'antialiased',
                              textRendering: 'optimizeLegibility',
                            }
                      }
                    >
                      {data.aboutTitle}
                    </h1>
                  </FadeInNative>

                  <FadeInNative delay={0.2}>
                    <div>
                      <div
                        className="relative"
                        style={
                          isMobile
                            ? {}
                            : {
                                position: 'relative',
                                isolation: 'isolate',
                              }
                        }
                      >
                        <div
                          style={
                            isMobile
                              ? {}
                              : {
                                  display: 'grid',
                                  gridTemplateRows: isExpanded ? '1fr' : '0fr',
                                  transition:
                                    'grid-template-rows 1400ms cubic-bezier(0.16, 1, 0.3, 1)',
                                  willChange: 'grid-template-rows',
                                  position: 'relative',
                                  transform: 'translate3d(0, 0, 0)',
                                  backfaceVisibility: 'hidden',
                                  contain: 'layout',
                                }
                          }
                        >
                          <div
                            style={
                              isMobile
                                ? {}
                                : {
                                    overflow: 'hidden',
                                    minHeight: isExpanded ? 'auto' : '28em',
                                    transition: 'min-height 1400ms cubic-bezier(0.16, 1, 0.3, 1)',
                                    transform: 'translate3d(0, 0, 0)',
                                    backfaceVisibility: 'hidden',
                                  }
                            }
                          >
                            <div
                              className="whitespace-pre-line text-sm text-gray-100 md:text-base lg:text-lg"
                              style={
                                isMobile
                                  ? {
                                      lineHeight: '1.75',
                                    }
                                  : {
                                      lineHeight: '1.75',
                                      transform: 'translate3d(0, 0, 0)',
                                      backfaceVisibility: 'hidden',
                                      WebkitFontSmoothing: 'antialiased',
                                      textRendering: 'optimizeLegibility',
                                      paddingBottom: isExpanded ? '2rem' : '0',
                                      transition:
                                        'padding-bottom 1400ms cubic-bezier(0.16, 1, 0.3, 1)',
                                      contain: 'layout style',
                                    }
                              }
                            >
                              {data.aboutText}
                            </div>
                          </div>
                        </div>

                        {!isMobile && (
                          <div
                            className="pointer-events-none absolute bottom-0 left-0 right-0"
                            style={{
                              height: '120px',
                              background:
                                'linear-gradient(to top, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.98) 20%, rgba(0, 0, 0, 0.95) 35%, rgba(0, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.6) 70%, transparent 100%)',
                              opacity: isExpanded ? 0 : 1,
                              visibility: isExpanded ? 'hidden' : 'visible',
                              transition: `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${isExpanded ? '0ms' : '400ms'}, visibility 0ms ${isExpanded ? '800ms' : '0ms'}`,
                              transform: 'translate3d(0, 0, 0)',
                              backfaceVisibility: 'hidden',
                              willChange: 'opacity',
                              contain: 'layout paint',
                            }}
                          ></div>
                        )}
                      </div>

                      {!isMobile && (
                        <div className="mt-3 flex justify-start">
                          {!isExpanded ? (
                            <button
                              onClick={() => {
                                setIsAnimating(true)
                                setIsExpanded(true)
                                setTimeout(() => setIsAnimating(false), 1400)
                              }}
                              className="flex items-center gap-2 bg-transparent px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1"
                              aria-label="Read more about U.S. Mechanical"
                              aria-expanded="false"
                              style={{
                                transform: 'translate3d(0, 0, 0)',
                                backfaceVisibility: 'hidden',
                                WebkitFontSmoothing: 'antialiased',
                              }}
                            >
                              Read More
                              <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setIsAnimating(true)
                                setIsExpanded(false)
                                setTimeout(() => setIsAnimating(false), 1400)
                              }}
                              className="flex items-center gap-2 bg-transparent px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1"
                              aria-label="Close expanded text"
                              aria-expanded="true"
                              style={{
                                transform: 'translate3d(0, 0, 0)',
                                backfaceVisibility: 'hidden',
                                WebkitFontSmoothing: 'antialiased',
                              }}
                            >
                              Close
                              <svg
                                className="h-4 w-4 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </FadeInNative>
                </div>
              </div>
            </div>
          )}
        </section>

        <section
          className="-mt-10 bg-white py-20 text-gray-900"
          style={{
            position: 'relative',
            zIndex: 20,
            isolation: 'isolate',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div className={isMobile ? 'w-full px-0' : 'mx-auto max-w-7xl px-6'}>
            <div
              className={
                isMobile
                  ? 'flex flex-col gap-8 px-6'
                  : 'relative flex flex-col items-center gap-8 md:flex-row md:gap-12'
              }
            >
              <div
                className={`${safetyLogoItems.length > 0 ? 'md:w-1/2' : 'w-full'} relative z-10 bg-white`}
              >
                <FadeInNative delay={0.3}>
                  <h2 className="section-title mb-4 text-5xl text-gray-900 md:text-6xl">
                    {data.safetyTitle}
                  </h2>
                </FadeInNative>
                <FadeInNative delay={0.4}>
                  <div className="text-lg leading-relaxed text-gray-700">
                    {Array.isArray(data.safetyText) ? (
                      <PortableText value={data.safetyText} />
                    ) : (
                      <p className="whitespace-pre-line">{data.safetyText}</p>
                    )}
                  </div>
                </FadeInNative>
              </div>

              {safetyLogoItems.length > 0 && (
                <div
                  className={
                    isMobile
                      ? '-mx-6 w-full'
                      : `${safetyLogoItems.length > 0 ? 'md:w-1/2' : 'w-full'} relative flex items-center`
                  }
                >
                  <div
                    className="z-0 w-full overflow-hidden"
                    style={
                      isMobile
                        ? {
                            width: '100vw',
                          }
                        : {
                            position: 'absolute',
                            left: 0,
                            width: '50vw',
                          }
                    }
                    onMouseEnter={() => setIsLoopsHovered(true)}
                    onMouseLeave={() => setIsLoopsHovered(false)}
                  >
                    <div className={isMobile ? 'space-y-4' : 'space-y-8'}>
                      <div
                        style={{
                          height: isMobile ? '100px' : '160px',
                          position: 'relative',
                          width: isMobile ? '100vw' : '100%',
                          maxWidth: isMobile ? 'none' : '100%',
                          overflow: 'hidden',
                        }}
                      >
                        <LogoLoop
                          logos={
                            isMobile && safetyLogoItems.length > 0
                              ? [
                                  ...safetyLogoItems,
                                  ...safetyLogoItems,
                                  ...safetyLogoItems,
                                  ...safetyLogoItems,
                                ]
                              : safetyLogoItems
                          }
                          speed={isMobile ? 200 : 120}
                          direction="left"
                          logoHeight={getSafetyLogoHeight()}
                          gap={getSafetyGap()}
                          fadeOut={!isMobile}
                          fadeOutColor="#ffffff"
                          hoverSpeed={isMobile ? undefined : 20}
                          pauseOnHover={isMobile ? false : undefined}
                          externalHoverState={isMobile ? undefined : isLoopsHovered}
                          scaleOnHover={!isMobile}
                          useCssAnimation={isMobile}
                          ariaLabel="Safety logos and certifications"
                        />
                      </div>

                      <div
                        style={{
                          height: isMobile ? '100px' : '160px',
                          position: 'relative',
                          width: isMobile ? '100vw' : '100%',
                          maxWidth: isMobile ? 'none' : '100%',
                          overflow: 'hidden',
                        }}
                      >
                        <LogoLoop
                          logos={
                            isMobile && safetyLogoItems.length > 0
                              ? [
                                  ...safetyLogoItems,
                                  ...safetyLogoItems,
                                  ...safetyLogoItems,
                                  ...safetyLogoItems,
                                ]
                              : safetyLogoItems
                          }
                          speed={isMobile ? 200 : 120}
                          direction="right"
                          logoHeight={getSafetyLogoHeight()}
                          gap={getSafetyGap()}
                          fadeOut={!isMobile}
                          fadeOutColor="#ffffff"
                          hoverSpeed={isMobile ? undefined : 20}
                          pauseOnHover={isMobile ? false : undefined}
                          externalHoverState={isMobile ? undefined : isLoopsHovered}
                          scaleOnHover={!isMobile}
                          useCssAnimation={isMobile}
                          ariaLabel="Safety logos and certifications"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
