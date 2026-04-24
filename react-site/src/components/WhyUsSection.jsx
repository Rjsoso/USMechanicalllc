import { useMemo, useState, useEffect, memo } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useSanityLive } from '../hooks/useSanityLive'
import FadeInNative from './FadeInNative'
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

/**
 * `lg+`: six skinny **columns** in one row (icon, eyebrow, title, chevron);
 * on hover (fine) or click, a **fully opaque** overlay covers this cluster only.
 * `pointer-events: none` on the overlay so columns stay hoverable underneath.
 * Copy cross-fades when the active item changes.
 */
function WhyUsDesktopLeftRail({
  items,
  fineHover,
  hoveredIndex,
  setHoveredIndex,
  openIndex,
  setOpenIndex,
}) {
  const reduceMotion = useReducedMotion()
  const showOverlay = fineHover ? hoveredIndex !== null : openIndex !== null
  const activeIdx = fineHover ? hoveredIndex : openIndex
  const activeItem =
    activeIdx !== null && items[activeIdx] ? items[activeIdx] : null
  const activeIcon = activeItem ? ICON_MAP[activeItem.icon] || ICON_MAP.tool : null
  const activeEyebrow = activeItem?.icon ? EYEBROW_BY_ICON[activeItem.icon] : null

  const tCross = reduceMotion ? 0.01 : 0.3

  return (
    <div
      className="why-us-left-rail h-full min-h-[min(58vh,640px)] w-full"
      onMouseLeave={() => {
        if (fineHover) setHoveredIndex(null)
      }}
    >
      <div className="relative min-h-inherit overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a]">
        <div className="why-us-skinny-cols relative z-10 flex min-h-[min(58vh,640px)] flex-row items-stretch">
          {items.map((item, index) => {
            const icon = ICON_MAP[item.icon] || ICON_MAP.tool
            const eyebrow = item.icon ? EYEBROW_BY_ICON[item.icon] : null
            const hot = fineHover ? hoveredIndex === index : openIndex === index
            return (
              <button
                key={item.title || String(index)}
                type="button"
                className={`why-us-skinny-col group flex min-h-0 min-w-0 flex-1 flex-col items-center justify-between gap-2 border-0 bg-black/20 px-1.5 py-4 text-center transition-[background-color,box-shadow] sm:px-2 ${
                  hot ? 'ring-1 ring-inset ring-red-500/50 bg-white/[0.04]' : 'hover:bg-white/[0.04]'
                } `}
                onMouseEnter={() => {
                  if (fineHover) setHoveredIndex(index)
                }}
                onClick={() => {
                  setOpenIndex((prev) => (prev === index ? null : index))
                }}
              >
                <span className="why-us-bar__icon text-red-500 [&>img]:h-7 [&>img]:w-7 md:[&>img]:h-8 md:[&>img]:w-8">
                  {icon}
                </span>
                <div className="mt-1 flex min-w-0 flex-1 flex-col items-center justify-start gap-0.5">
                  {eyebrow ? (
                    <span className="max-w-full break-words text-[9px] font-semibold uppercase leading-tight tracking-[0.12em] text-white/40 sm:text-[10px] sm:tracking-[0.18em]">
                      {eyebrow}
                    </span>
                  ) : null}
                  <span className="line-clamp-4 max-w-full text-balance break-words text-sm font-bold leading-tight text-white sm:text-base">
                    {item.title}
                  </span>
                </div>
                <span className="mt-auto">
                  <ChevronDown
                    className={hot ? 'text-red-400/80' : ''}
                  />
                </span>
              </button>
            )
          })}
        </div>
        {showOverlay && activeItem && activeIdx !== null && (
          <div
            className="absolute inset-0 z-20 flex min-h-0 flex-col pointer-events-none"
            role="presentation"
          >
            <div
              className="absolute inset-0 bg-zinc-950"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' }}
              aria-hidden
            />
            <div
              className="relative z-10 flex min-h-0 w-full max-w-full flex-1 items-center justify-center overflow-y-auto p-3 sm:p-4"
              role="status"
              aria-live="polite"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeIdx}
                  className="why-us-left-rail__panel mx-auto w-full max-w-prose"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                  transition={{ duration: tCross, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="why-us-bar__icon mt-0.5 shrink-0 text-red-500 [&>img]:h-8 [&>img]:w-8">
                      {activeIcon}
                    </span>
                    <div className="min-w-0 text-left">
                      {activeEyebrow ? (
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400/80 sm:tracking-[0.25em]">
                          {activeEyebrow}
                        </p>
                      ) : null}
                      <h3 className="section-title text-base text-white sm:text-lg">
                        {activeItem.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-white/90 sm:mt-3 sm:text-sm">
                        {activeItem.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
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
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/45 md:text-xs">
                Why contractors pick us
              </p>
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

      <div className="bg-transparent py-8 md:py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex min-h-0 flex-col gap-8 lg:min-h-[min(58vh,640px)] lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-8">
            <div className="col-span-12 min-h-0 w-full lg:col-span-5">
              <div className="why-us-columns--stacked flex flex-col gap-2 md:gap-2.5 lg:hidden">
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
              <div className="hidden lg:block">
                <WhyUsDesktopLeftRail
                  items={displayData.items}
                  fineHover={fineHover}
                  hoveredIndex={hoveredIndex}
                  setHoveredIndex={setHoveredIndex}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                />
              </div>
            </div>
            <div className="col-span-12 flex min-h-0 flex-col gap-0 lg:col-span-7">
              <WhyUsTestimonialCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(WhyUsSection)
