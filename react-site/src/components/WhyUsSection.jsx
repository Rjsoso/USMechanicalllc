import { useMemo, useState, useEffect, memo } from 'react'
import { useSanityLive } from '../hooks/useSanityLive'
import FadeInNative from './FadeInNative'
import FadeInWhenVisible from './FadeInWhenVisible'
import WhyUsTestimonialCarousel from './WhyUsTestimonialCarousel'
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
      src="/images/why-us-fast-delivery.png"
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
      className={`why-us-bar__chevron h-5 w-5 shrink-0 ${className || 'text-white/50'}`}
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

/** Stacked cards + accordion: shown below `lg` only. */
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
  const triggerId = `why-us-trigger-m-${index}`
  const panelId = `why-us-panel-m-${index}`

  return (
    <div
      className={`why-us-bar ${expanded ? 'why-us-bar--open' : ''}`}
      onMouseEnter={onBarEnter}
      onMouseLeave={onBarLeave}
    >
      <button
        type="button"
        id={triggerId}
        className="why-us-bar__summary flex min-h-[3.25rem] w-full flex-row items-center gap-3 px-3 py-3 text-left"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="why-us-bar__icon shrink-0 text-red-500 [&>img]:block [&>svg]:block">{icon}</span>
        <span className="why-us-bar__summary-text min-w-0 flex-1 text-left">
          {eyebrow ? (
            <span className="why-us-bar__eyebrow block text-xs font-semibold uppercase tracking-[0.2em] text-white/45 md:text-[13px]">
              {eyebrow}
            </span>
          ) : null}
          <span className="block text-xl font-bold tracking-tight text-white md:text-2xl">
            {title}
          </span>
        </span>
        <span className="shrink-0">
          <ChevronDown />
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="why-us-bar__panel"
      >
        <div className="why-us-bar__grid">
          <div className="why-us-bar__panel-inner" aria-hidden={!expanded}>
            <p className="text-lg leading-relaxed text-white/70">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Desktop: 2×3 grid of scannable value cards + testimonial in max-w-7xl (no full-bleed rail). */
function WhyUsDesktopValueGrid({ items }) {
  return (
    <div className="why-us-desktop-grid grid grid-cols-2 gap-4 xl:gap-5">
      {items.map((item, index) => {
        const icon = ICON_MAP[item.icon] || ICON_MAP.tool
        const eyebrow = item.icon ? EYEBROW_BY_ICON[item.icon] : null
        return (
          <FadeInWhenVisible
            key={item.title || String(index)}
            delay={index * 0.07}
            className="h-full min-h-0 min-w-0"
          >
            <article className="why-us-value-card flex h-full min-h-0 flex-col rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-none transition-[border-color,background-color] duration-200 sm:p-5">
              <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-red-500 [&>img]:h-8 [&>img]:w-8">
                {icon}
              </div>
              {eyebrow ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                  {eyebrow}
                </p>
              ) : null}
              <h3 className="mt-1.5 text-base font-bold leading-snug tracking-tight text-white sm:text-[17px]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70 line-clamp-4 sm:line-clamp-5">
                {item.description}
              </p>
            </article>
          </FadeInWhenVisible>
        )
      })}
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
    <section className="relative overflow-x-clip">
      <div className="bg-black pb-10 pt-16 md:pb-14 md:pt-22">
        <div className="mx-auto max-w-7xl px-6">
          <FadeInNative>
            <div className="text-center">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45 md:mb-4 md:text-xs">
                Why contractors pick us
              </p>
              <h2 className="section-title mx-auto mb-5 max-w-3xl text-4xl text-white md:mb-6 md:text-5xl lg:text-6xl">
                {displayData.sectionTitle}
              </h2>
              {displayData.sectionSubtitle && (
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
                  {displayData.sectionSubtitle}
                </p>
              )}
            </div>
          </FadeInNative>
        </div>
      </div>

      <div className="bg-transparent py-8 md:py-10 lg:py-0">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:hidden">
          <div className="why-us-columns--stacked flex flex-col gap-2 md:gap-2.5">
            {displayData.items.map((item, index) => (
              <FadeInWhenVisible key={item.title || index} delay={index * 0.07} className="w-full">
                <WhyUsExpandBar
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
              </FadeInWhenVisible>
            ))}
          </div>
          <FadeInWhenVisible delay={0.45} className="mt-8 w-full">
            <WhyUsTestimonialCarousel />
          </FadeInWhenVisible>
        </div>

        <div className="mt-0 hidden w-full overflow-x-clip border-t border-white/5 bg-zinc-950/20 py-10 lg:mt-0 lg:block lg:py-12 xl:py-14">
          <div className="mx-auto w-full max-w-7xl px-6">
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
              <div className="min-w-0 lg:col-span-7">
                <WhyUsDesktopValueGrid items={displayData.items} />
              </div>
              <FadeInWhenVisible
                delay={0.35}
                className="flex min-h-[min(20rem,50vh)] min-w-0 flex-col justify-center lg:col-span-5"
              >
                <WhyUsTestimonialCarousel />
              </FadeInWhenVisible>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(WhyUsSection)
