import { useMemo, useState, useEffect, useRef, memo } from 'react'
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

/**
 * Desktop "Why" strip — six abutting flex columns:
 *
 * - **Width:** The row is `display: flex` (see `.why-us-skinny-cols`). Each column
 *   is `flex: 1 1 0` with a shared `flex-grow` transition. The active column gets
 *   `flex-grow: 2` (class `why-us-skinny-col--active`) so it takes 2/7 of the
 *   width and the other five 1/7 each — same ratios as the old 2fr / 1fr grid,
 *   but `flex-grow` eases more reliably in browsers than `grid-template-columns`.
 * - **Input:** `useFineHoverPointer` → on fine pointers, hover sets `hoveredIndex`
 *   on `mouseenter` per column; the rail `mouseleave` clears it after 80ms so
 *   quick moves across gutter/gaps do not flash. On coarse (touch) pointers,
 *   only `openIndex` from `click` toggles; hover state is ignored.
 * - **Copy:** Description sits in a centered overlay (`.why-us-skinny-col__copy`) with
 *   `pointer-events: none` so the hit target stays the button. It fades / scales
 *   in CSS — no in-flow block, so the flex width animation is not fighting layout.
 */
function WhyUsDesktopLeftRail({
  items,
  fineHover,
  hoveredIndex,
  setHoveredIndex,
  openIndex,
  setOpenIndex,
}) {
  const activeIdx = fineHover ? hoveredIndex : openIndex
  const leaveHoverTimerRef = useRef(null)

  const clearLeaveHoverTimer = () => {
    if (leaveHoverTimerRef.current != null) {
      clearTimeout(leaveHoverTimerRef.current)
      leaveHoverTimerRef.current = null
    }
  }

  useEffect(() => () => clearLeaveHoverTimer(), [])

  return (
    <div
      className="why-us-left-rail flex h-full min-h-0 w-full min-w-0 flex-1 flex-col"
      onMouseLeave={() => {
        if (fineHover) {
          clearLeaveHoverTimer()
          leaveHoverTimerRef.current = setTimeout(() => {
            setHoveredIndex(null)
            leaveHoverTimerRef.current = null
          }, 80)
        }
      }}
    >
      <div className="why-us-skinny-cols h-full min-h-0 w-full min-w-0">
        {items.map((item, index) => {
          const icon = ICON_MAP[item.icon] || ICON_MAP.tool
          const eyebrow = item.icon ? EYEBROW_BY_ICON[item.icon] : null
          const hot = activeIdx === index
          return (
            <div
              key={item.title || String(index)}
              className={`why-us-skinny-col relative flex min-h-0 min-w-0 flex-col overflow-hidden border-0 p-0 [isolation:isolate] ${hot ? 'why-us-skinny-col--active' : ''} `}
            >
              <button
                type="button"
                className={`why-us-skinny-col__hit relative z-0 flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-between gap-1 px-1.5 py-3 text-center sm:px-1.5 sm:py-4 ${
                  hot
                    ? 'bg-zinc-900 ring-1 ring-inset ring-red-500/50'
                    : 'bg-black/25 hover:bg-white/[0.06]'
                } `}
                onMouseEnter={() => {
                  if (fineHover) {
                    clearLeaveHoverTimer()
                    setHoveredIndex(index)
                  }
                }}
                onClick={() => {
                  setOpenIndex((prev) => (prev === index ? null : index))
                }}
                aria-pressed={hot}
              >
                <span className="why-us-bar__icon text-red-500 [&>img]:h-6 [&>img]:w-6 xl:[&>img]:h-7 xl:[&>img]:w-7 2xl:[&>img]:h-8 2xl:[&>img]:w-8">
                  {icon}
                </span>
                <div className="mt-0.5 flex min-h-0 w-full min-w-0 flex-1 flex-col items-center justify-start gap-0.5">
                  {eyebrow ? (
                    <span className="w-full break-words px-px text-[7px] font-semibold uppercase leading-tight tracking-[0.1em] text-white/40 sm:text-[8px] xl:text-[9px] xl:tracking-[0.14em] 2xl:text-[10px] 2xl:tracking-[0.16em]">
                      {eyebrow}
                    </span>
                  ) : null}
                  <span
                    className="line-clamp-5 w-full max-w-full break-words px-px text-[10px] font-bold leading-tight text-white sm:text-xs xl:text-sm 2xl:text-base"
                    title={item.title}
                  >
                    {item.title}
                  </span>
                </div>
                <span className="mt-1.5 [contain:layout]">
                  <ChevronDown
                    className={`h-3.5 w-3.5 flex-shrink-0 text-white/45 sm:h-4 sm:w-4 ${
                      hot ? 'why-us-skinny-col__chev why-us-skinny-col__chev--open' : 'why-us-skinny-col__chev'
                    } `}
                  />
                </span>
              </button>
              <div
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-1 pb-9 pt-2 sm:px-2.5 sm:pb-10"
                aria-hidden={!hot}
              >
                <div
                  className={`why-us-skinny-col__copy max-h-[60%] w-full max-w-full overflow-y-auto rounded-md border border-white/12 bg-zinc-950/96 px-1.5 py-1.5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.45)] sm:px-2 sm:py-2.5 ${
                    hot ? 'why-us-skinny-col__copy--open' : ''
                  } `}
                >
                  <p className="text-[10px] leading-snug text-white/90 sm:text-xs xl:leading-relaxed 2xl:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
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
    <section className="relative overflow-x-clip">
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

      <div className="bg-transparent py-8 md:py-10 lg:py-0">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:hidden">
          <div className="why-us-columns--stacked flex flex-col gap-2 md:gap-2.5">
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
          <div className="mt-8">
            <WhyUsTestimonialCarousel />
          </div>
        </div>

        <div className="mt-0 hidden w-full overflow-x-clip lg:mt-0 lg:block">
          {/*
            Full-bleed row: left 50% flush to viewport; title block above stays in max-w-7xl.
            w-full parent (section) + left-1/2 + w-screen - translate-x-1/2 aligns 100vw strip to viewport.
          */}
          <div
            className="relative left-1/2 grid min-h-[min(48vh,32rem)] w-screen max-w-[100vw] -translate-x-1/2 border-y border-white/5 bg-zinc-950/30 grid-cols-1 [contain:layout] lg:grid-cols-2"
          >
            <div className="flex min-h-[min(48vh,32rem)] min-w-0 self-stretch bg-[#0a0a0a]">
              <WhyUsDesktopLeftRail
                items={displayData.items}
                fineHover={fineHover}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
                openIndex={openIndex}
                setOpenIndex={setOpenIndex}
              />
            </div>
            <div
              className="flex min-h-0 min-w-0 flex-col justify-center self-stretch border-t border-l-0 border-white/10 bg-zinc-950/50 p-5 sm:p-6 lg:border-l lg:border-t-0 pl-4 sm:pl-6 2xl:pl-10 [padding-right:max(1.25rem,calc((100vw-80rem)/2+1.5rem))]"
            >
              <WhyUsTestimonialCarousel />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default memo(WhyUsSection)
