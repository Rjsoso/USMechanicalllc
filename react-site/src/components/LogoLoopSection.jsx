import { useEffect, useState, memo } from 'react'
import { client, urlFor } from '../utils/sanity'
import { debounce } from '../utils/debounce'
import LogoLoop from './LogoLoop'

function LogoLoopSection() {
  const [logoData, setLogoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  )

  // Track window width for responsive logo sizing with debouncing
  useEffect(() => {
    const handleResize = debounce(() => setWindowWidth(window.innerWidth), 150)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    client
      .fetch(
        `*[_type == "logoLoop" && _id == "logoLoop"][0] {
          enabled,
          logos[] {
            companyName,
            logo {
              asset-> {
                _id,
                url
              },
              alt
            },
            url,
            order
          }
        }`
      )
      .then(data => {
        if (data && data.enabled && data.logos) {
          // Sort logos by order field
          const sortedLogos = [...data.logos].sort((a, b) => (a.order || 0) - (b.order || 0))
          setLogoData(sortedLogos)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching logo loop data:', error)
        setLoading(false)
      })
  }, [])

  // Don't render anything if loading, disabled, or no logos
  if (loading || !logoData || logoData.length === 0) {
    return null
  }

  // Transform Sanity data to LogoLoop format
  const logos = logoData.map((item, index) => ({
    src: urlFor(item.logo).width(800).url(),
    alt: item.logo.alt || item.companyName,
    title: item.companyName,
    href: item.url || undefined,
    key: `logo-${index}`,
  }))

  // Responsive logo sizing based on screen width
  const getLogoHeight = () => {
    if (windowWidth < 768) return 60 // Mobile
    if (windowWidth >= 2560) return 80 // 3xl
    if (windowWidth >= 1920) return 90 // 2xl
    if (windowWidth >= 1440) return 100 // xl
    return 120 // default
  }

  const getGap = () => {
    if (windowWidth < 768) return 40 // Mobile
    if (windowWidth >= 2560) return 60 // 3xl
    if (windowWidth >= 1920) return 70 // 2xl
    if (windowWidth >= 1440) return 80 // xl
    return 100 // default
  }

  return (
    <section className="bg-white py-8 xl:py-6 2xl:py-4">
      <div className="w-full overflow-hidden">
        <LogoLoop
          logos={logos}
          speed={120}
          direction="left"
          width="100%"
          logoHeight={getLogoHeight()}
          gap={getGap()}
          hoverSpeed={30}
          fadeOut={false}
          scaleOnHover={false}
          ariaLabel="Partner and client logos"
        />
      </div>
    </section>
  )
}

export default memo(LogoLoopSection)
