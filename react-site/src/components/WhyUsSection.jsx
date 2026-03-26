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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  dollar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  tool: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <line x1="8" y1="6" x2="10" y2="6" />
      <line x1="14" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="10" y2="10" />
      <line x1="14" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="10" y2="14" />
      <line x1="14" y1="14" x2="16" y2="14" />
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
            rx="12"
            ry="12"
            fill="none"
            strokeWidth="1"
            pathLength="1"
            strokeDasharray="1"
          />
        </svg>
      )}
      <div className="draw-in-card__icon mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/10 text-red-500">
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
