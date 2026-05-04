import { useEffect, useState, useMemo, memo } from 'react'
import {
  urlFor,
  buildSanitySrcSet,
  ABOUT_CAROUSEL_FALLBACK_W,
  ABOUT_CAROUSEL_QUALITY,
  ABOUT_CAROUSEL_SRC_WIDTHS,
} from '../utils/sanity'
import { useSanityLive } from '../hooks/useSanityLive'
import { debounce } from '../utils/debounce'
import FadeInNative from './FadeInNative'
import Carousel from './Carousel'
import { FiArrowRight } from 'react-icons/fi'

const ABOUT_QUERY = `*[_type == "aboutAndSafety"] | order(_updatedAt desc)[0]{
  aboutTitle,
  aboutText,
  aboutPhotos[] {
    asset-> { _id, url, originalFilename },
    alt,
    caption
  }
}`

const defaultData = {
  aboutTitle: 'ABOUT',
  aboutText: `U.S. Mechanical's foundation was laid in 1963 with the organization of Bylund Plumbing and Heating. Since that time, the Bylund family has continuously been in the mechanical contracting industry. U.S. Mechanical secures projects in the Intermountain and Southwest regions via open bid, design build, CMAR, and the cost-plus method. We employ experienced and competent project managers, superintendents, foreman,  journeyman, and apprentices in the professional fields of plumbing, sheet metal, pipefitting, and welding. We are confident that our employees at U.S. Mechanical are the key to our success, and we are proud to offer our teams experience and abilities to meet the needs of your projects.
U.S. Mechanical currently has offices in Pleasant Grove, Utah and Las Vegas, Nevada.  We also offer our expertise at Snyder Mechanical located in Elko, Nevada, where we predominately serve the mining industry in the northern Nevada area. U.S. Mechanical is fully licensed, bonded, and insured in the states of Nevada, Utah, Arizona, California, and Wyoming.
With over 60 years of project experience, we have built an undeniable reputation, enabling us to build an enviable list of clientele and business associates. In turn, U.S. Mechanical's current bonding capacity for a single project is $35,000,000, while its aggregate limit exceeds $150,000,000.`,
}

function AboutSection({ data: aboutDataProp }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [, setIsAnimating] = useState(false)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  )
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  const { data: liveData } = useSanityLive(ABOUT_QUERY, {}, {
    initialData: aboutDataProp,
    listenFilter: `*[_type == "aboutAndSafety"]`,
  })

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }, 150)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const displayData = useMemo(
    () => (liveData ? { ...defaultData, ...liveData } : defaultData),
    [liveData]
  )

  const aboutPhotos = displayData.aboutPhotos
  const carouselItems = useMemo(() => {
    if (!aboutPhotos || !Array.isArray(aboutPhotos) || aboutPhotos.length === 0) {
      return []
    }

    return aboutPhotos
      .map((photo, index) => {
        if (!photo || !photo.asset) return null
        const baseUrl =
          photo.asset.url ||
          (photo.asset && urlFor(photo)?.url()?.split('?')[0]) ||
          ''
        const imageUrl = baseUrl
          ? `${baseUrl}?w=${ABOUT_CAROUSEL_FALLBACK_W}&q=${ABOUT_CAROUSEL_QUALITY}&auto=format`
          : ''
        const srcSet = buildSanitySrcSet(baseUrl, ABOUT_CAROUSEL_SRC_WIDTHS, {
          quality: ABOUT_CAROUSEL_QUALITY,
        })
        return {
          id: `about-photo-${index}`,
          src: imageUrl,
          srcSet,
          sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 900px',
          alt: photo.alt || `About US Mechanical ${index + 1}`,
          caption: photo.caption || null,
        }
      })
      .filter(Boolean)
  }, [aboutPhotos])

  useEffect(() => {
    if (carouselItems.length > 0 && carouselItems[0].src) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = carouselItems[0].src
      link.fetchPriority = 'high'
      document.head.appendChild(link)
      return () => { document.head.removeChild(link) }
    }
  }, [carouselItems])

  return (
    <section id="about" className="relative z-0 overflow-hidden bg-black py-20 text-white">
      {carouselItems.length > 0 && (
        <div className="flex w-full flex-col items-stretch gap-0 md:flex-row">
          <div
            className={isMobile ? 'w-full' : 'overflow-hidden'}
            style={
              isMobile
                ? {}
                : {
                    width: isExpanded ? '45%' : '75%',
                    transition: 'width 600ms ease-in-out',
                    willChange: 'width',
                    backfaceVisibility: 'hidden',
                    WebkitFontSmoothing: 'antialiased',
                  }
            }
          >
            <FadeInNative delay={0} className="h-full w-full min-w-0">
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
            </FadeInNative>
          </div>

          <div
            className={isMobile ? 'w-full bg-black' : 'flex items-start bg-black'}
            style={
              isMobile
                ? {}
                : {
                    width: isExpanded ? '55%' : '25%',
                    transition: 'width 600ms ease-in-out',
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
              <FadeInNative delay={0.15}>
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
                  {displayData.aboutTitle}
                </h2>
              </FadeInNative>

              <FadeInNative delay={0.32}>
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
                                'grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1)',
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
                                transition: 'min-height 600ms cubic-bezier(0.16, 1, 0.3, 1)',
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
                                    'padding-bottom 600ms cubic-bezier(0.16, 1, 0.3, 1)',
                                  contain: 'layout style',
                                }
                          }
                        >
                          {displayData.aboutText}
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
                          transition: `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) ${isExpanded ? '0ms' : '200ms'}, visibility 0ms ${isExpanded ? '400ms' : '0ms'}`,
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
  )
}

export default memo(AboutSection)
