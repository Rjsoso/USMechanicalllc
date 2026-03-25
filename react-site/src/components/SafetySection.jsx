import { useEffect, useState, useMemo, memo } from 'react'
import { urlFor } from '../utils/sanity'
import { useSanityLive } from '../hooks/useSanityLive'
import { PortableText } from '@portabletext/react'
import { debounce } from '../utils/debounce'
import FadeInNative from './FadeInNative'
import LogoLoop from './LogoLoop'

const SAFETY_QUERY = `*[_type == "aboutAndSafety"] | order(_updatedAt desc)[0]{
  safetyTitle,
  safetyText,
  safetyLogos[] {
    image { asset-> { _id, url, originalFilename }, alt, caption },
    icon,
    title,
    href
  }
}`

const defaultData = {
  safetyTitle: 'Safety & Risk Management',
  safetyText: `U.S. Mechanical conducts the design, installation, and completion of all projects with safety as our top priority. We employ a company-wide safety program manager that is OSHA and MSHA accredited, provide site specific safety programs, fall and operational programs and personal PPE incentives.  These measures ensure not only properly trained employees, but the required focus of safety from all our team members on our projects. 
The result of this commitment to safety is an Experience Modification Rate (EMR) lower than the national average. This accomplishment has enabled U.S. Mechanical to qualify for self-insured insurance programs that lower the overall risk management costs associated with the general construction industry. These financial savings coupled with our continued commitment to safety provide our client-base added value on every project.
All of us at U.S. Mechanical rank safety with the highest degree of importance, and completing projects with zero safety issues will always be our commitment.`,
}

function SafetySection({ data: safetyDataProp }) {
  const [isLoopsHovered, setIsLoopsHovered] = useState(false)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  )
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  const { data: liveData } = useSanityLive(SAFETY_QUERY, {}, {
    initialData: safetyDataProp,
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

  const displayData = liveData ? { ...defaultData, ...liveData } : defaultData

  const safetyLogoItems = useMemo(() => {
    if (!displayData?.safetyLogos || !Array.isArray(displayData.safetyLogos) || displayData.safetyLogos.length === 0) {
      return []
    }

    return displayData.safetyLogos
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
  }, [displayData, displayData?.safetyLogos])

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

  return (
    <section
      id="safety"
      className="bg-white py-20 text-gray-900"
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
        <div
          className={
            isMobile
              ? 'flex flex-col gap-8 px-6'
              : 'relative mx-auto flex max-w-7xl flex-col items-center gap-8 md:flex-row md:gap-12'
          }
        >
          <div
            data-testid="safety-text"
            className={`${safetyLogoItems.length > 0 ? 'md:w-1/2' : 'w-full'} relative z-10 bg-white`}
          >
            <FadeInNative delay={0}>
              <h3 className="section-title mb-4 text-5xl text-gray-900 md:text-6xl">
                {displayData.safetyTitle}
              </h3>
            </FadeInNative>
            <FadeInNative delay={0.05}>
              <div className="text-lg leading-relaxed text-gray-700">
                {Array.isArray(displayData.safetyText) ? (
                  <PortableText value={displayData.safetyText} />
                ) : (
                  <p className="whitespace-pre-line">{displayData.safetyText}</p>
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
                      logos={safetyLogoItems}
                      speed={isMobile ? 180 : 120}
                      direction="left"
                      logoHeight={getSafetyLogoHeight()}
                      gap={getSafetyGap()}
                      fadeOut={!isMobile}
                      fadeOutColor="#ffffff"
                      hoverSpeed={isMobile ? undefined : 20}
                      pauseOnHover={isMobile ? false : undefined}
                      externalHoverState={isMobile ? undefined : isLoopsHovered}
                      scaleOnHover={false}
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
                      logos={safetyLogoItems}
                      speed={isMobile ? 180 : 120}
                      direction="right"
                      logoHeight={getSafetyLogoHeight()}
                      gap={getSafetyGap()}
                      fadeOut={!isMobile}
                      fadeOutColor="#ffffff"
                      hoverSpeed={isMobile ? undefined : 20}
                      pauseOnHover={isMobile ? false : undefined}
                      externalHoverState={isMobile ? undefined : isLoopsHovered}
                      scaleOnHover={false}
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
  )
}

export default memo(SafetySection)
