import { useMemo, useRef, useState, useEffect, memo } from 'react'
import { useSanityLive } from '../hooks/useSanityLive'
import FadeInNative from './FadeInNative'
import './WhyUsSection.css'

const WHY_US_QUERY = `*[_type == "whyUs" && _id == "whyUs"][0]{
  _id,
  sectionTitle,
  sectionSubtitle,
  items[]{
    title,
    description,
    icon
  }
}`

const ICON_MAP = {
  clock: (
    // Gear/cog — mechanical industry
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  shield: (
    // Hard hat — construction safety
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <path d="M2 18h20" />
      <path d="M4 18v-1a8 8 0 0 1 16 0v1" />
      <path d="M12 5V2" />
      <path d="M8 14h8" />
    </svg>
  ),
  map: (
    // Certificate/stamp — official licensing
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <rect x="3" y="3" width="18" height="14" rx="1" />
      <path d="M3 8h18" />
      <path d="M8 21l4-4 4 4" />
      <path d="M12 17V12" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  dollar: (
    // Handshake — trust and partnership
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <path d="M11 17l-1.5 1.5a2.12 2.12 0 0 1-3-3L10 12l2-2" />
      <path d="M14 7l1.5-1.5a2.12 2.12 0 0 1 3 3L15 12l-2 2" />
      <path d="M7 8H3v4l4.5 4.5" />
      <path d="M17 16h4v-4l-4.5-4.5" />
    </svg>
  ),
  tool: (
    // Blueprint/drafting — design-build process
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <path d="M4 2v20" />
      <path d="M4 4h16v14H4" />
      <path d="M8 8h4" />
      <path d="M8 12h8" />
      <path d="M4 2l2 2-2 2" />
      <path d="M4 18l2-2-2-2" />
    </svg>
  ),
  building: (
    // Two map pins — two regional office locations
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M9 11c0 4-5 8-5 8h10s-5-4-5-8z" />
      <path d="M17 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M17 8c0 3-3.5 5.5-3.5 5.5h7S17 11 17 8z" />
    </svg>
  ),
}

const DEFAULT_ITEMS = [
  {
    icon: 'clock',
    title: '60+ Years of Excellence',
    description: 'Family-owned since 1963 with multi-generational expertise in mechanical contracting.',
  },
  {
    icon: 'map',
    title: 'Licensed in 5 States',
    description: 'Fully licensed, bonded, and insured across Utah, Nevada, Arizona, California, and Wyoming.',
  },
  {
    icon: 'dollar',
    title: '$35M Single-Project Bonding',
    description: 'Aggregate bonding capacity exceeding $150M demonstrates our financial strength and reliability.',
  },
  {
    icon: 'shield',
    title: 'Industry-Leading Safety',
    description: 'EMR below the national average with OSHA and MSHA accredited safety programs.',
  },
  {
    icon: 'tool',
    title: 'Design-Build Specialists',
    description: 'Delivering projects through open bid, design-build, CMAR, and cost-plus methods.',
  },
  {
    icon: 'building',
    title: 'Two Regional Offices',
    description: 'Serving the Intermountain and Southwest regions from Pleasant Grove, UT and Las Vegas, NV.',
  },
]

function DrawInCard({ index, icon, title, description }) {
  const cardRef = useRef(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isSettled, setIsSettled] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect()
      setDims({ w: Math.round(width), h: Math.round(height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    let triggered = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true
          io.disconnect()
          setTimeout(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setIsVisible(true)
              })
            })
          }, index * 150)
        }
      },
      { threshold: 0.15, rootMargin: '50px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [index])

  useEffect(() => {
    if (!isVisible) return
    const timer = setTimeout(() => setIsSettled(true), 1400)
    return () => clearTimeout(timer)
  }, [isVisible])

  const cls = [
    'draw-in-card',
    isVisible && 'draw-in-card--visible',
    isSettled && 'draw-in-card--settled',
  ].filter(Boolean).join(' ')

  return (
    <div ref={cardRef} className={cls}>
      {dims.w > 0 && (
        <svg className="draw-in-card__border" aria-hidden="true">
          <rect
            x="0.5"
            y="0.5"
            width={dims.w - 1}
            height={dims.h - 1}
            rx="2"
            ry="2"
            fill="none"
            strokeWidth="1"
            pathLength="1"
            strokeDasharray="1"
          />
        </svg>
      )}
      <div className="draw-in-card__icon mb-4 inline-flex h-12 w-12 items-center justify-center rounded-none border border-red-500/30 text-red-500">
        {icon}
      </div>
      <h3 className="draw-in-card__title mb-2 text-lg font-bold text-white">
        {title}
      </h3>
      <p className="draw-in-card__description text-sm leading-relaxed text-white/60">
        {description}
      </p>
    </div>
  )
}

function WhyUsSection() {
  const { data } = useSanityLive(WHY_US_QUERY, {}, {
    listenFilter: `*[_type == "whyUs"]`,
  })

  const displayData = useMemo(() => {
    if (!data) {
      return {
        sectionTitle: 'Why US Mechanical',
        sectionSubtitle: 'The strength, experience, and commitment behind every project.',
        items: DEFAULT_ITEMS,
      }
    }
    return {
      sectionTitle: data.sectionTitle || 'Why US Mechanical',
      sectionSubtitle: data.sectionSubtitle || 'The strength, experience, and commitment behind every project.',
      items: data.items?.length > 0 ? data.items : DEFAULT_ITEMS,
    }
  }, [data])

  return (
    <section className="relative bg-black py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInNative>
          <div className="mb-14 text-center md:mb-20">
            <h2 className="section-title mb-4 text-4xl text-white md:text-5xl lg:text-6xl">
              {displayData.sectionTitle}
            </h2>
            {displayData.sectionSubtitle && (
              <p className="mx-auto max-w-2xl text-lg text-white/70">
                {displayData.sectionSubtitle}
              </p>
            )}
          </div>
        </FadeInNative>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayData.items.map((item, index) => (
            <DrawInCard
              key={item.title || index}
              index={index}
              icon={ICON_MAP[item.icon] || ICON_MAP.tool}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(WhyUsSection)
