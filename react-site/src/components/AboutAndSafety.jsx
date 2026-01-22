import { useEffect, useState, useMemo, useRef } from 'react'
import { client } from '../utils/sanity'
import { urlFor } from '../utils/sanity'
import { PortableText } from '@portabletext/react'
import FadeInNative from './FadeInNative'
import Carousel from './Carousel'
import LogoLoop from './LogoLoop'
import { FiArrowRight } from 'react-icons/fi'

export default function AboutAndSafety() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoopsHovered, setIsLoopsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)

  // Track window width for responsive logo sizing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Default content fallback
  const defaultData = {
    aboutTitle: 'About U.S. Mechanical',
    aboutText: `U.S. Mechanical's foundation was laid in 1963 with the organization of Bylund Plumbing and Heating. Since that time, the Bylund family has continuously been in the mechanical contracting industry. The U.S. Mechanical name was adopted 25 years ago and continues to represent our company owners and employees.

We pursue projects in the Intermountain and Southwest regions via hard bid, design build, CMAR, and cost plus. Our team includes journeyman and apprentice plumbers, sheet metal installers, pipefitters, welders, and administrative staff—all with unmatched experience.

We maintain offices in Pleasant Grove, Utah, and Las Vegas, Nevada, as well as Snyder Mechanical in Elko, Nevada, which serves the mining industry. U.S. Mechanical is fully licensed, bonded, and insured in Nevada, Utah, Arizona, California, and Wyoming.`,
    safetyTitle: 'Safety & Risk Management',
    safetyText: `U.S. Mechanical conducts all projects with safety as our top priority. We employ a company-wide safety program led by a full-time OSHA and MSHA accredited safety director. Our focus on safety ensures properly trained employees and a work environment that prioritizes everyone's well-being.

Our experience modification rate (EMR) remains below the national average, qualifying us for self-insured insurance programs that reduce risk management costs. These savings, combined with our dedication to safety, provide added value on every project.

Our goal is always simple: complete every project with zero safety issues.`,
    photo1: null,
    safetyImage: null,
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
            photo1 {
              asset-> {
                _id,
                url,
                originalFilename
              },
              alt
            },
            safetyTitle,
            safetyText,
            safetyImage {
              asset-> {
                _id,
                url,
                originalFilename
              },
              alt,
              caption
            },
            safetyImage2 {
              asset-> {
                _id,
                url,
                originalFilename
              },
              alt,
              caption
            },
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
      } catch (error) {
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
  }, [])

  // Map aboutPhotos to carousel items format
  const carouselItems = useMemo(() => {
    if (!data?.aboutPhotos || !Array.isArray(data.aboutPhotos) || data.aboutPhotos.length === 0) {
      // Fallback to photo1 if aboutPhotos is empty
      if (data?.photo1 && data.photo1.asset) {
        const imageUrl = data.photo1.asset.url 
          ? `${data.photo1.asset.url}?w=1000&q=82&auto=format`
          : urlFor(data.photo1).width(1000).quality(82).auto('format').url();
        return [{
          id: 'photo1',
          src: imageUrl,
          alt: data.photo1.alt || "About US Mechanical",
          caption: null
        }];
      }
      return [];
    }
    
    return data.aboutPhotos.map((photo, index) => {
      if (!photo || !photo.asset) return null;
      const imageUrl = photo.asset.url
        ? `${photo.asset.url}?w=1200&q=82&auto=format`
        : urlFor(photo).width(1200).quality(82).auto('format').url();
      return {
        id: `about-photo-${index}`,
        src: imageUrl,
        alt: photo.alt || `About US Mechanical ${index + 1}`,
        caption: photo.caption || null
      };
    }).filter(Boolean);
  }, [data?.aboutPhotos, data?.photo1]);

  // Transform safetyLogos to LogoLoop format
  const safetyLogoItems = useMemo(() => {
    if (!data?.safetyLogos || !Array.isArray(data.safetyLogos) || data.safetyLogos.length === 0) {
      // Fallback to safetyImage and safetyImage2 if safetyLogos is empty
      const fallbackItems = [];
      if (data?.safetyImage && data.safetyImage.asset) {
        const imageUrl = data.safetyImage.asset.url
          ? `${data.safetyImage.asset.url}?w=200&q=80&auto=format`
          : urlFor(data.safetyImage).width(200).quality(80).auto('format').url();
        fallbackItems.push({
          src: imageUrl,
          alt: data.safetyImage.alt || 'Safety image',
          title: data.safetyImage.caption || 'Safety image',
          href: undefined
        });
      }
      if (data?.safetyImage2 && data.safetyImage2.asset) {
        const imageUrl = data.safetyImage2.asset.url
          ? `${data.safetyImage2.asset.url}?w=200&q=80&auto=format`
          : urlFor(data.safetyImage2).width(200).quality(80).auto('format').url();
        fallbackItems.push({
          src: imageUrl,
          alt: data.safetyImage2.alt || 'Safety image 2',
          title: data.safetyImage2.caption || 'Safety image 2',
          href: undefined
        });
      }
      return fallbackItems;
    }

    return data.safetyLogos.map((item, index) => {
      if (!item) return null;
      
      // Handle image-based items
      if (item.image && item.image.asset) {
        const imageUrl = item.image.asset.url
          ? `${item.image.asset.url}?w=200&q=80&auto=format`
          : urlFor(item.image).width(200).quality(80).auto('format').url();
        return {
          src: imageUrl,
          alt: item.image.alt || item.title || `Safety logo ${index + 1}`,
          title: item.title || item.image.alt || `Safety logo ${index + 1}`,
          href: item.href || undefined
        };
      }
      
      // Handle icon-based items (for future use with react-icons)
      // For now, skip icon items if no image is provided
      // This can be extended later to support icon components
      return null;
    }).filter(Boolean);
  }, [data?.safetyLogos, data?.safetyImage, data?.safetyImage2]);

  // Responsive logo sizing for safety section
  const getSafetyLogoHeight = () => {
    if (windowWidth >= 2560) return 90; // 3xl
    if (windowWidth >= 1920) return 100; // 2xl
    if (windowWidth >= 1440) return 110; // xl
    return 120; // default
  };

  const getSafetyGap = () => {
    if (windowWidth >= 2560) return 28; // 3xl
    if (windowWidth >= 1920) return 32; // 2xl
    if (windowWidth >= 1440) return 36; // xl
    return 40; // default
  };

  if (loading || !data) {
    return (
      <div className="text-center py-20 text-white bg-black">Loading content...</div>
    )
  }

  return (
    <>
      <section id="about" className="py-20 text-white bg-black relative z-0 overflow-hidden">
        {/* ABOUT SECTION - Side-by-side carousel and text */}
        {carouselItems.length > 0 && (
          <div 
            className="flex flex-col md:flex-row items-stretch gap-0 w-full"
            style={isMobile ? {} : {
              perspective: '1000px', // 3D acceleration context
              isolation: 'isolate' // Creates stacking context for GPU
            }}
          >
            {/* Carousel container - slides left and shrinks when expanded */}
            <div 
              className={isMobile ? "w-full" : "overflow-hidden"}
              style={isMobile ? {} : {
                width: isExpanded ? '45%' : '75%',
                transform: isExpanded ? 'translate3d(-15%, 0, 0)' : 'translate3d(0, 0, 0)',
                transition: 'width 1400ms cubic-bezier(0.16, 1, 0.3, 1), transform 1400ms cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'width, transform',
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased',
                contain: 'layout style paint' // Isolate layout calculations
              }}
            >
                <Carousel
                  items={carouselItems}
                  baseWidth={isMobile ? windowWidth - 32 : 1100}
                  containerClassName={isMobile ? "h-[300px]" : "h-[380px] md:h-[450px] lg:h-[580px] xl:h-[680px]"}
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
              className={isMobile ? "w-full bg-black" : "bg-black flex items-start"}
              style={isMobile ? {} : {
                width: isExpanded ? '55%' : '25%',
                transition: 'width 1400ms cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'width',
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased',
                contain: 'layout style paint', // Isolate layout calculations
                isolation: 'isolate', // Creates stacking context
                transform: 'translate3d(0, 0, 0)' // Force GPU compositing layer
              }}
            >
              {/* Inner content container - flexible width allows reflow */}
              <div className="w-full px-6 lg:px-8 pt-8 pb-8">
                <FadeInNative delay={0.1}>
                  <h2 
                    className="section-title text-3xl md:text-4xl lg:text-5xl text-white mb-4"
                    style={isMobile ? {} : {
                      transform: 'translate3d(0, 0, 0)',
                      backfaceVisibility: 'hidden',
                      WebkitFontSmoothing: 'antialiased',
                      textRendering: 'optimizeLegibility'
                    }}
                  >
                    {data.aboutTitle}
                  </h2>
                </FadeInNative>
                
                <FadeInNative delay={0.2}>
                  <div>
                    {/* Text content with truncation - Using CSS Grid for smooth auto-height animation */}
                    <div 
                      className="relative" 
                      style={isMobile ? {} : { 
                        position: 'relative',
                        isolation: 'isolate' // Creates stacking context
                      }}
                    >
                      <div 
                        style={isMobile ? {} : {
                          display: 'grid',
                          gridTemplateRows: isExpanded ? '1fr' : '0fr',
                          transition: 'grid-template-rows 1400ms cubic-bezier(0.16, 1, 0.3, 1)',
                          willChange: 'grid-template-rows',
                          position: 'relative',
                          transform: 'translate3d(0, 0, 0)', // GPU acceleration
                          backfaceVisibility: 'hidden',
                          contain: 'layout' // Prevent layout thrashing
                        }}
                      >
                        <div style={isMobile ? {} : { 
                          overflow: 'hidden',
                          minHeight: isExpanded ? 'auto' : '28em',
                          transition: 'min-height 1400ms cubic-bezier(0.16, 1, 0.3, 1)',
                          transform: 'translate3d(0, 0, 0)', // GPU acceleration
                          backfaceVisibility: 'hidden'
                        }}>
                          <div 
                            className="text-sm md:text-base lg:text-lg text-gray-100 whitespace-pre-line"
                            style={isMobile ? {
                              lineHeight: '1.75'
                            } : {
                              lineHeight: '1.75',
                              transform: 'translate3d(0, 0, 0)',
                              backfaceVisibility: 'hidden',
                              WebkitFontSmoothing: 'antialiased',
                              textRendering: 'optimizeLegibility',
                              paddingBottom: isExpanded ? '2rem' : '0',
                              transition: 'padding-bottom 1400ms cubic-bezier(0.16, 1, 0.3, 1)',
                              contain: 'layout style'
                            }}
                          >
                            {data.aboutText}
                          </div>
                        </div>
                      </div>
                      
                      {/* Gradient fade overlay for truncated text */}
                      {!isMobile && (
                        <div 
                          className="absolute bottom-0 left-0 right-0 pointer-events-none"
                          style={{
                            height: '120px',
                            background: 'linear-gradient(to top, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.98) 20%, rgba(0, 0, 0, 0.95) 35%, rgba(0, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0.6) 70%, transparent 100%)',
                            opacity: isExpanded ? 0 : 1,
                            visibility: isExpanded ? 'hidden' : 'visible',
                            transition: `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${isExpanded ? '0ms' : '400ms'}, visibility 0ms ${isExpanded ? '800ms' : '0ms'}`,
                            transform: 'translate3d(0, 0, 0)', // GPU acceleration
                            backfaceVisibility: 'hidden',
                            willChange: 'opacity',
                            contain: 'layout paint' // Isolate paint operations
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
                              setIsAnimating(true);
                              setIsExpanded(true);
                              setTimeout(() => setIsAnimating(false), 1400);
                            }}
                            className="bg-transparent text-white px-4 py-2 text-sm font-bold flex items-center gap-2 hover:-translate-y-1 transition-all duration-300"
                            aria-label="Read more about U.S. Mechanical"
                            aria-expanded="false"
                            style={{
                              transform: 'translate3d(0, 0, 0)', // GPU acceleration
                              backfaceVisibility: 'hidden',
                              WebkitFontSmoothing: 'antialiased'
                            }}
                          >
                            Read More
                            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setIsAnimating(true);
                              setIsExpanded(false);
                              setTimeout(() => setIsAnimating(false), 1400);
                            }}
                            className="bg-transparent text-white px-4 py-2 text-sm font-bold flex items-center gap-2 hover:-translate-y-1 transition-all duration-300"
                            aria-label="Close expanded text"
                            aria-expanded="true"
                            style={{
                              transform: 'translate3d(0, 0, 0)', // GPU acceleration
                              backfaceVisibility: 'hidden',
                              WebkitFontSmoothing: 'antialiased'
                            }}
                          >
                            Close
                            <svg 
                              className="w-4 h-4 transition-transform duration-300" 
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
        className="py-20 bg-white text-gray-900 -mt-10"
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
        <div className="max-w-7xl mx-auto px-6">
          {/* SAFETY SECTION - Text + LogoLoops Horizontal (reversed layout, side-by-side on desktop, stacked on mobile) */}
          {/* All content (text and logos) comes from Sanity CMS */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative">
            {/* Text on left */}
            <div
              data-testid="safety-text"
              className={`${safetyLogoItems.length > 0 ? 'md:w-1/2' : 'w-full'} relative z-10 bg-white`}
            >
              <FadeInNative delay={0.3}>
                <h3 className="section-title text-5xl md:text-6xl mb-4 text-gray-900">
                  {data.safetyTitle}
                </h3>
              </FadeInNative>
              <FadeInNative delay={0.4}>
                <div className="text-lg text-gray-700 leading-relaxed">
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
              <div className={`${safetyLogoItems.length > 0 ? 'md:w-1/2' : 'w-full'} relative flex items-center`}>
                <div
                  data-testid="safety-ribbon"
                  className="w-full overflow-hidden z-0"
                  style={{
                    position: 'absolute',
                    left: 0,
                    width: '50vw'
                  }}
                  onMouseEnter={() => setIsLoopsHovered(true)}
                  onMouseLeave={() => setIsLoopsHovered(false)}
                >
                  <div className="space-y-8">
                    {/* Top loop - scrolls left */}
                    <div style={{ height: '160px', position: 'relative' }}>
                      <LogoLoop
                        logos={safetyLogoItems}
                        speed={120}
                        direction="left"
                        logoHeight={getSafetyLogoHeight()}
                        gap={getSafetyGap()}
                        fadeOut={true}
                        fadeOutColor="#ffffff"
                        hoverSpeed={20}
                        externalHoverState={isLoopsHovered}
                        scaleOnHover={true}
                        ariaLabel="Safety logos and certifications"
                      />
                    </div>
                    
                    {/* Bottom loop - scrolls right */}
                    <div style={{ height: '160px', position: 'relative' }}>
                      <LogoLoop
                        logos={safetyLogoItems}
                        speed={120}
                        direction="right"
                        logoHeight={getSafetyLogoHeight()}
                        gap={getSafetyGap()}
                        fadeOut={true}
                        fadeOutColor="#ffffff"
                        hoverSpeed={20}
                        externalHoverState={isLoopsHovered}
                        scaleOnHover={true}
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
