import { useMemo, useState, useEffect, memo } from 'react'
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
      <circle cx="12" cy="9" r="6" />
      <polyline points="9 9 11 11 15 7" />
      <polyline points="8 15 6 22 12 19 18 22 16 15" />
    </svg>
  ),
  dollar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
      <path d="M2 20h20" />
      <path d="M2 10l10-6 10 6" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="10" x2="6" y2="20" />
      <line x1="10" y1="10" x2="10" y2="20" />
      <line x1="14" y1="10" x2="14" y2="20" />
      <line x1="18" y1="10" x2="18" y2="20" />
    </svg>
  ),
  tool: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
      <path d="M15 5l4 4" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
      <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M9 11c0 4-5 8-5 8h10s-5-4-5-8z" />
      <path d="M17 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M17 8c0 3-3.5 5.5-3.5 5.5h7S17 11 17 8z" />
    </svg>
  ),
}

const EYEBROW_BY_ICON = {
  clock: 'Since 1963',
  map: 'Coverage',
  dollar: 'Capacity',
  shield: 'Safety',
  tool: 'Delivery',
  building: 'Presence',
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

function useFineHoverPointer() {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return matches
}

function ChevronDown({ className = '' }) {
  return (
    <svg
      className={`why-us-bar__chevron h-5 w-5 shrink-0 text-white/55 md:h-6 md:w-6 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={true}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function WhyUsExpandBar({
  index,
  icon,
  title,
  description,
  eyebrow,
  expanded,
  onBarEnter,
  onBarLeave,
  onToggle,
}) {
  const triggerId = `why-us-trigger-${index}`
  const panelId = `why-us-panel-${index}`

  return (
    <div
      className={`why-us-bar ${expanded ? 'why-us-bar--open' : ''} lg:flex lg:min-h-0 lg:min-w-0 lg:flex-1 lg:flex-col`}
      onMouseEnter={onBarEnter}
      onMouseLeave={onBarLeave}
    >
      <button
        type="button"
        id={triggerId}
        className="why-us-bar__summary flex min-h-[3.25rem] w-full flex-row items-center gap-3 px-3 py-3 text-left lg:min-h-0 lg:flex-1 lg:flex-col lg:items-center lg:justify-start lg:gap-4 lg:px-3 lg:py-6 lg:text-center"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="why-us-bar__icon shrink-0 text-red-500 [&>svg]:block">{icon}</span>
        <span className="why-us-bar__summary-text min-w-0 flex-1 text-left lg:flex lg:w-full lg:flex-none lg:flex-col lg:items-center lg:justify-center lg:gap-1.5 lg:text-center">
          {eyebrow ? (
            <span className="why-us-bar__eyebrow block text-xs font-semibold uppercase tracking-[0.18em] text-white/70 md:text-sm lg:text-[13px] lg:leading-tight">
              {eyebrow}
            </span>
          ) : null}
          <span className="block min-w-0 max-lg:truncate text-base font-bold leading-snug tracking-tight text-white md:text-lg lg:line-clamp-5 lg:text-lg lg:leading-snug xl:text-xl">
            {title}
          </span>
        </span>
        <span className="shrink-0 lg:mt-auto">
          <ChevronDown className="lg:mx-auto" />
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="why-us-bar__panel lg:px-2"
      >
        <div className="why-us-bar__grid">
          <div className="why-us-bar__panel-inner" aria-hidden={!expanded}>
            <p className="text-base leading-relaxed text-white/80 lg:text-center lg:text-base lg:leading-relaxed xl:text-lg">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function WhyUsSection() {
  const fineHover = useFineHoverPointer()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [openIndex, setOpenIndex] = useState(null)

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

  const isExpanded = (i) =>
    openIndex === i || (fineHover && hoveredIndex === i)

  return (
    <section className="relative overflow-x-hidden">
      <div className="bg-black pb-12 pt-16 md:pb-16 md:pt-22">
        <div className="mx-auto max-w-7xl px-6">
          <FadeInNative>
            <div className="text-center">
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
        </div>
      </div>

      <div className="bg-transparent py-8 md:py-10 lg:py-0">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:relative lg:left-1/2 lg:mx-0 lg:w-screen lg:max-w-none lg:-translate-x-1/2 lg:px-0">
          <div className="flex flex-col gap-2 md:gap-2.5 lg:min-h-[min(58vh,640px)] lg:flex-row lg:items-stretch lg:gap-0">
            {displayData.items.map((item, index) => (
              <WhyUsExpandBar
                key={item.title || index}
                index={index}
                icon={ICON_MAP[item.icon] || ICON_MAP.tool}
                title={item.title}
                description={item.description}
                eyebrow={item.icon ? EYEBROW_BY_ICON[item.icon] : undefined}
                expanded={isExpanded(index)}
                onBarEnter={() => {
                  if (fineHover) setHoveredIndex(index)
                }}
                onBarLeave={() => {
                  if (fineHover) setHoveredIndex(null)
                }}
                onToggle={() => {
                  setOpenIndex((prev) => (prev === index ? null : index))
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(WhyUsSection)
