import { useMemo, useState, useEffect, memo } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useSanityLive } from '../hooks/useSanityLive'
import FadeInNative from './FadeInNative'
import FadeInWhenVisible from './FadeInWhenVisible'
import WhyUsTestimonialCarousel from './WhyUsTestimonialCarousel'
import WhyUsDesktopScrollStage from './WhyUsDesktopScrollStage'
import { EYEBROW_BY_ICON, ICON_MAP } from './whyUsConstants'
import WhyUsValueCard from './WhyUsValueCard'
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
        <span className="why-us-bar__icon shrink-0 [&>img]:block [&>svg]:block">{icon}</span>
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

/** Desktop reduced motion: 2×3 grid on the right, testimonial on the left. */
function WhyUsDesktopValueGrid({ items }) {
  return (
    <div className="why-us-desktop-grid grid grid-cols-2 gap-4 xl:gap-5">
      {items.map((item, index) => (
        <FadeInWhenVisible
          key={item.title || String(index)}
          delay={index * 0.12}
          className="h-full min-h-0 min-w-0"
        >
          <WhyUsValueCard item={item} />
        </FadeInWhenVisible>
      ))}
    </div>
  )
}

function WhyUsSection() {
  const fineHover = useFineHoverPointer()
  const reduceMotion = useReducedMotion()
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
      <div className="bg-black pb-8 pt-12 md:pb-10 md:pt-14">
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

      <div className="bg-transparent py-8 md:py-8 lg:py-0">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:hidden">
          <div className="why-us-columns--stacked flex flex-col gap-2 md:gap-2.5">
            {displayData.items.map((item, index) => (
              <FadeInWhenVisible key={item.title || index} delay={index * 0.12} className="w-full">
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
          <FadeInWhenVisible delay={0.58} className="mt-8 w-full">
            <WhyUsTestimonialCarousel />
          </FadeInWhenVisible>
        </div>

        <div className="mt-0 hidden w-full overflow-x-clip border-t border-white/5 bg-black py-4 lg:mt-0 lg:block lg:py-5 xl:py-6">
          {reduceMotion ? (
            <div className="why-us-desktop-hero-offset mx-auto w-full max-w-7xl px-4 sm:px-5">
              <div className="relative overflow-hidden rounded-xl">
                <div className="why-us-scroll-stage__photo-band rounded-xl" aria-hidden />
                <div className="relative z-[1] grid grid-cols-1 items-stretch gap-4 px-3 py-3 sm:gap-5 sm:p-4 lg:grid-cols-2 lg:gap-4 lg:p-5">
                  <FadeInWhenVisible
                    delay={0.12}
                    className="flex min-h-0 min-w-0 flex-col lg:h-full"
                  >
                    <WhyUsTestimonialCarousel embeddedDesktop />
                  </FadeInWhenVisible>
                  <div className="flex min-h-0 min-w-0 flex-col lg:h-full">
                    <WhyUsDesktopValueGrid items={displayData.items} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <WhyUsDesktopScrollStage items={displayData.items} />
          )}
        </div>
      </div>
    </section>
  )
}

export default memo(WhyUsSection)
