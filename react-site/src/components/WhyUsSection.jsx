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
    <img
      src="/images/why-us-family-excellence.png"
      alt=""
      className="h-8 w-8 object-contain md:h-9 md:w-9"
      decoding="async"
      draggable={false}
      aria-hidden={true}
    />
  ),
  shield: (
    <img
      src="/images/why-us-safety-safe.png"
      alt=""
      className="h-8 w-8 object-contain md:h-9 md:w-9"
      decoding="async"
      draggable={false}
      aria-hidden={true}
    />
  ),
  map: (
    <img
      src="/images/why-us-coverage.png"
      alt=""
      className="h-8 w-8 object-contain md:h-9 md:w-9"
      decoding="async"
      draggable={false}
      aria-hidden={true}
    />
  ),
  dollar: (
    <img
      src="/images/why-us-capacity-economic.png"
      alt=""
      className="h-8 w-8 object-contain md:h-9 md:w-9"
      decoding="async"
      draggable={false}
      aria-hidden={true}
    />
  ),
  tool: (
    <img
      src="/images/why-us-parcel.png"
      alt=""
      className="h-8 w-8 object-contain md:h-9 md:w-9"
      decoding="async"
      draggable={false}
      aria-hidden={true}
    />
  ),
  building: (
    <img
      src="/images/why-us-map-location.png"
      alt=""
      className="h-8 w-8 object-contain md:h-9 md:w-9"
      decoding="async"
      draggable={false}
      aria-hidden={true}
    />
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
      className={`why-us-bar__chevron h-5 w-5 shrink-0 text-white/50 ${className}`}
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
        className="why-us-bar__summary flex min-h-[3.25rem] w-full flex-row items-center gap-3 px-3 py-3 text-left lg:min-h-0 lg:flex-1 lg:flex-col lg:items-center lg:justify-between lg:gap-3 lg:px-2 lg:py-5 lg:text-center"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="why-us-bar__icon shrink-0 text-red-500 [&>img]:block [&>svg]:block">{icon}</span>
        <span className="why-us-bar__summary-text min-w-0 flex-1 text-left lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:text-center">
          {eyebrow ? (
            <span className="why-us-bar__eyebrow block text-xs font-semibold uppercase tracking-[0.2em] text-white/45 lg:leading-tight md:text-[13px]">
              {eyebrow}
            </span>
          ) : null}
          <span className="block truncate text-xl font-bold tracking-tight text-white lg:line-clamp-4 lg:text-lg lg:leading-snug lg:tracking-tight md:text-2xl">
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
            <p className="text-lg leading-relaxed text-white/70 lg:text-center lg:text-sm lg:leading-relaxed">
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
          <div className="why-us-columns flex flex-col gap-2 md:gap-2.5 lg:min-h-[min(58vh,640px)] lg:flex-row lg:items-stretch lg:gap-0">
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
