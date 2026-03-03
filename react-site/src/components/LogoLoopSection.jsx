import { useEffect, useState, useMemo, memo } from 'react'
import { urlFor } from '../utils/sanity'
import { debounce } from '../utils/debounce'
import LogoLoop from './LogoLoop'
import { useSanityLive } from '../hooks/useSanityLive'

const LOGO_LOOP_QUERY = `*[_type == "logoLoop" && _id == "logoLoop"][0] {
  enabled,
  logos[] {
    companyName,
    logo { asset-> { _id, url }, alt },
    url,
    order
  }
}`

function LogoLoopSection() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  )

  const { data } = useSanityLive(LOGO_LOOP_QUERY, {}, {
    listenFilter: `*[_type == "logoLoop"]`,
  })

  const logoData = useMemo(() => {
    if (!data?.enabled || !data?.logos) return null
    return [...data.logos].sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [data])

  useEffect(() => {
    const handleResize = debounce(() => setWindowWidth(window.innerWidth), 150)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!logoData || logoData.length === 0) {
    return null
  }

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
