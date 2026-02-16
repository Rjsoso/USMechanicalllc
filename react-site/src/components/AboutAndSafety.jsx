import { useEffect, useState, useMemo, memo } from 'react'
import { client } from '../utils/sanity'
import { urlFor } from '../utils/sanity'
import { PortableText } from '@portabletext/react'
import { debounce } from '../utils/debounce'
import FadeInNative from './FadeInNative'
import Carousel from './Carousel'
import LogoLoop from './LogoLoop'
import { FiArrowRight } from 'react-icons/fi'

function AboutAndSafety() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoopsHovered, setIsLoopsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  )
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  // Track window width for responsive logo sizing with debouncing
  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }, 150)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Default content fallback - Last updated: 2026-01-29
  const defaultData = {
    aboutTitle: 'ABOUT',
    aboutText: `U.S. Mechanical's foundation was laid in 1963 with the organization of Bylund Plumbing and Heating. Since that time, the Bylund family has continuously been in the mechanical contracting industry. U.S. Mechanical secures projects in the Intermountain and Southwest regions via open bid, design build, CMAR, and the cost-plus method. We employ experienced and competent project managers, superintendents, foreman,  journeyman, and apprentices in the professional fields of plumbing, sheet metal, pipefitting, and welding. We are confident that our employees at U.S. Mechanical are the key to our success, and we are proud to offer our teams experience and abilities to meet the needs of your projects.
U.S. Mechanical currently has offices in Pleasant Grove, Utah and Las Vegas, Nevada.  We also offer our expertise at Snyder Mechanical located in Elko, Nevada, where we predominately serve the mining industry in the northern Nevada area. U.S. Mechanical is fully licensed, bonded, and insured in the states of Nevada, Utah, Arizona, California, and Wyoming.
With over 60 years of project experience, we have built an undeniable reputation, enabling us to build an enviable list of clientele and business associates. In turn, U.S. Mechanical's current bonding capacity for a single project is $35,000,000, while its aggregate limit exceeds $150,000,000.`,
    safetyTitle: 'Safety & Risk Management',
    safetyText: `U.S. Mechanical conducts the design, installation, and completion of all projects with safety as our top priority. We employ a company-wide safety program manager that is OSHA and MSHA accredited, provide site specific safety programs, fall and operational programs and personal PPE incentives.  These measures ensure not only properly trained employees, but the required focus of safety from all our team members on our projects. 
The result of this commitment to safety is an Experience Modification Rate (EMR) lower than the national average. This accomplishment has enabled U.S. Mechanical to qualify for self-insured insurance programs that lower the overall risk management costs associated with the general construction industry. These financial savings coupled with our continued commitment to safety provide our client-base added value on every project.
All of us at U.S. Mechanical rank safety with the highest degree of importance, and completing projects with zero safety issues will always be our commitment.`,
  }

  // Fetch all content from Sanity (text and images)
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

  // Map aboutPhotos to carousel items format
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

  // Transform safetyLogos to LogoLoop format
  const safetyLogoItems = useMemo(() => {
    if (!data?.safetyLogos || !Array.isArray(data.safetyLogos) || data.safetyLogos.length === 0) {
      return []
    }

    return data.safetyLogos
      .map((item, index) => {
        if (!item) return null

        // Handle image-based items
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

        // Handle icon-based items (for future use with react-icons)
        // For now, skip icon items if no image is provided
        // This can be extended later to support icon components
        return null
      })
      .filter(Boolean)
  }, [data?.safetyLogos])

  // Responsive logo sizing for safety section
  const getSafetyLogoHeight = () => {
    if (windowWidth < 768) return 50 // Mobile - smaller for more copies
    if (windowWidth >= 2560) return 90 // 3xl
    if (windowWidth >= 1920) return 100 // 2xl
    if (windowWidth >= 1440) return 110 // xl
    return 120 // default
  }

  const getSafetyGap = () => {
    if (windowWidth < 768) return 30 // Mobile - more gap for visibility
    if (windowWidth >= 2560) return 28 // 3xl
    if (windowWidth >= 1920) return 32 // 2xl
    if (windowWidth >= 1440) return 36 // xl
    return 40 // default
  }

  if (loading || !data) {
    return <div className="bg-black py-20 text-center text-white">Loading content...</div>
  }

  return (
    <>
      <section id="about" className="relative z-0 overflow-hidden bg-black py-20 text-white">
        {/* ABOUT SECTION - Side-by-side carousel and text */}
        {carouselItems.length > 0 && (
          <div
            className="flex w-full flex-col items-stretch gap-0 md:flex-row"
            style={
              isMobile
                ? {}
                : {
                    perspective: '1000px', // 3D acceleration context
                    isolation: 'isolate', // Creates stacking context for GPU
                  }
            }
          >
            {/* Carousel container - slides left and shrinks when expanded */}
            <div
              className={isMobile ? 'w-full' : 'overflow-hidden'}
              style={
                isMobile
                  ? {}
                  : {
                      width: isExpanded ? '45%' : '75%',
                      transform: isExpanded ? 'translate3d(-15%, 0, 0)' : 'translate3d(0, 0, 0)',
                      transition:
                        'width 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                      willChange: 'width, transform',
                      backfaceVisibility: 'hidden',
                      WebkitFontSmoothing: 'antialiased',
                      contain: 'layout style paint', // Isolate layout calculations
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

            {/* Text container - expands to fill space with black background */}
            <div
              className={isMobile ? 'w-full bg-black' : 'flex items-start bg-black'}
              style={
                isMobile
                  ? {}
                  : {
                      width: isExpanded ? '55%' : '25%',
                      transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                      willChange: 'width',
                      backfaceVisibility: 'hidden',
                      WebkitFontSmoothing: 'antialiased',
                      contain: 'layout style paint', // Isolate layout calculations
                      isolation: 'isolate', // Creates stacking context
                      transform: 'translate3d(0, 0, 0)', // Force GPU compositing layer
                    }
              }
            >
              {/* Inner content container - flexible width allows reflow */}
              <div className="w-full px-6 pb-8 pt-8 lg:px-8">
                <FadeInNative delay={0.1}>
                  <h2
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
                  </h2>
                </FadeInNative>

                <FadeInNative delay={0.2}>
                  <div>
                    {/* Text content with truncation - Using CSS Grid for smooth auto-height animation */}
                    <div
                      className="relative"
                      style={
                        isMobile
                          ? {}
                          : {
                              position: 'relative',
                              isolation: 'isolate', // Creates stacking context
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
                                  'grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                                willChange: 'grid-template-rows',
                                position: 'relative',
                                transform: 'translate3d(0, 0, 0)', // GPU acceleration
                                backfaceVisibility: 'hidden',
                                contain: 'layout', // Prevent layout thrashing
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
                                  transition: 'min-height 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                                  transform: 'translate3d(0, 0, 0)', // GPU acceleration
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
                                      'padding-bottom 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                                    contain: 'layout style',
                                  }
                            }
                          >
                            {data.aboutText}
                          </div>
                        </div>
                      </div>

                      {/* Gradient fade overlay for truncated text */}
                      {!isMobile && (
                        <div
                          className="pointer-events-none absolute bottom-0 left-0 right-0"
                          style={{
                            height: '120px',
                            background:
                              'linear-gradient(to top, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.98) 20%, rgba(0, 0, 0, 0.95) 35%, rgba(0, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.6) 70%, transparent 100%)',
                            opacity: isExpanded ? 0 : 1,
                            visibility: isExpanded ? 'hidden' : 'visible',
                            transition: `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) ${isExpanded ? '0ms' : '200ms'}, visibility 0ms ${isExpanded ? '400ms' : '0ms'}`,
                            transform: 'translate3d(0, 0, 0)', // GPU acceleration
                            backfaceVisibility: 'hidden',
                            willChange: 'opacity',
                            contain: 'layout paint', // Isolate paint operations
                          }}
                        ></div>
                      )}
                    </div>

                    {/* Read More / Close buttons - positioned outside fade area */}
                    {/* Only show expand buttons on desktop */}
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
                              transform: 'translate3d(0, 0, 0)', // GPU acceleration
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
                              transform: 'translate3d(0, 0, 0)', // GPU acceleration
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
        id="safety"
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
        <div className={isMobile ? 'w-full px-0' : 'w-full px-6'}>
          {/* SAFETY SECTION - Text + LogoLoops Horizontal (reversed layout, side-by-side on desktop, stacked on mobile) */}
          {/* All content (text and logos) comes from Sanity CMS */}
          <div
            className={
              isMobile
                ? 'flex flex-col gap-8 px-6'
                : 'relative mx-auto flex max-w-7xl flex-col items-center gap-8 md:flex-row md:gap-12'
            }
          >
            {/* Text on left */}
            <div
              data-testid="safety-text"
              className={`${safetyLogoItems.length > 0 ? 'md:w-1/2' : 'w-full'} relative z-10 bg-white`}
            >
              <FadeInNative delay={0.3}>
                <h3 className="section-title mb-4 text-5xl text-gray-900 md:text-6xl">
                  {data.safetyTitle}
                </h3>
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

            {/* LogoLoops on right - extends to page edge, centered vertically */}
            {safetyLogoItems.length > 0 && (
              <div
                className={
                  isMobile
                    ? '-mx-6 w-full'
                    : `${safetyLogoItems.length > 0 ? 'md:w-1/2' : 'w-full'} relative flex items-center`
                }
              >
                <div
                  data-testid="safety-ribbon"
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
                    {/* Top loop - scrolls left */}
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
                            ? // Manually duplicate logos for mobile to ensure enough copies
                              [
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

                    {/* Bottom loop - scrolls right */}
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
                            ? // Manually duplicate logos for mobile to ensure enough copies
                              [
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
    </>
  )
}

export default memo(AboutAndSafety)
