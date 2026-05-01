import { useMemo, memo, useCallback, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSanityLive } from '../hooks/useSanityLive'
import './WhyUsEditorial.css'

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
    description:
      'Aggregate bonding capacity exceeding $150M demonstrates our financial strength and reliability.',
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
    description:
      'Serving the Intermountain and Southwest regions from Pleasant Grove, UT and Las Vegas, NV.',
  },
]

const EYEBROW_BY_ICON = {
  clock: 'Since 1963',
  map: 'Coverage',
  dollar: 'Capacity',
  shield: 'Safety',
  tool: 'Delivery',
  building: 'Presence',
}

/** Last word italicized — matches reference headline treatment */
function italicizeLastWord(phrase) {
  const p = phrase?.trim()
  if (!p) return { plain: '', italic: '' }
  const i = p.lastIndexOf(' ')
  if (i <= 0) return { plain: '', italic: p }
  return { plain: p.slice(0, i), italic: p.slice(i + 1) }
}

const REVIEW_META = [
  { name: 'Jordan M.', role: 'Senior PM, healthcare GC', date: 'Jan 2025' },
  { name: 'Alicia R.', role: 'Preconstruction Director', date: 'Mar 2025' },
  { name: 'Devon T.', role: 'Owner Representative', date: 'Oct 2024' },
  { name: 'Chris P.', role: 'Construction Manager', date: 'Aug 2024' },
]

function RatingPips({ filled = 5, total = 5 }) {
  return (
    <div className="review-rating" role="img" aria-label={`${filled} out of ${total} stars`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={String(i)} className={i < filled ? 'pip' : 'pip empty'} aria-hidden={true} />
      ))}
    </div>
  )
}

const STATS = [
  { number: '60+', label: 'Years serving' },
  { number: '5', label: 'Licensed states' },
  { number: '$150M+', label: 'Aggregate bonding' },
  { number: '1963', label: 'Year founded' },
]

/** Optical / layout tweak when sticky is pinned (smaller `top` = panel moves up). */
const PINNED_PANEL_NUDGE_UP_PX = 30

function WhyUsSection() {
  const { data } = useSanityLive(WHY_US_QUERY, {}, {
    listenFilter: `*[_type == "whyUs"]`,
  })

  const displayData = useMemo(() => {
    if (!data) {
      return {
        sectionTitle: 'Why US Mechanical',
        sectionSubtitle:
          'The strength, experience, and commitment GCs rely on—from preconstruction through commissioning.',
        items: DEFAULT_ITEMS,
      }
    }
    return {
      sectionTitle: data.sectionTitle || 'Why US Mechanical',
      sectionSubtitle:
        data.sectionSubtitle ||
        'The strength, experience, and commitment GCs rely on—from preconstruction through commissioning.',
      items: data.items?.length > 0 ? data.items : DEFAULT_ITEMS,
    }
  }, [data])

  const headline = italicizeLastWord(displayData.sectionTitle)

  const sectionRef = useRef(null)
  const panelRef = useRef(null)

  const syncPinnedStickyTop = useCallback(() => {
    const section = sectionRef.current
    const panel = panelRef.current
    if (!section || !panel) return

    if (!window.matchMedia('(min-width: 901px)').matches) {
      section.style.removeProperty('--why-sticky-top-pinned')
      return
    }

    const nav = document.querySelector('.desktop-nav')
    if (!nav || nav.offsetParent === null) {
      section.style.removeProperty('--why-sticky-top-pinned')
      return
    }

    const navBottom = nav.getBoundingClientRect().bottom
    const vh = window.visualViewport?.height ?? window.innerHeight
    const panelH = panel.offsetHeight
    const slack = vh - navBottom - panelH
    let topPx = slack > 0 ? navBottom + slack / 2 : navBottom
    topPx -= PINNED_PANEL_NUDGE_UP_PX
    topPx = Math.max(navBottom, topPx)

    section.style.setProperty('--why-sticky-top-pinned', `${Math.round(topPx * 1000) / 1000}px`)
  }, [])

  useLayoutEffect(() => {
    let raf = 0
    const schedule = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        syncPinnedStickyTop()
      })
    }

    schedule()

    const ro = new ResizeObserver(schedule)
    const panel = panelRef.current
    if (panel) ro.observe(panel)

    const nav = document.querySelector('.desktop-nav')
    if (nav) ro.observe(nav)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const vv = window.visualViewport
    if (vv) {
      vv.addEventListener('resize', schedule)
      vv.addEventListener('scroll', schedule)
    }

    const mq = window.matchMedia('(min-width: 901px)')
    mq.addEventListener('change', schedule)

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (vv) {
        vv.removeEventListener('resize', schedule)
        vv.removeEventListener('scroll', schedule)
      }
      mq.removeEventListener('change', schedule)
      if (raf) cancelAnimationFrame(raf)
      sectionRef.current?.style.removeProperty('--why-sticky-top-pinned')
    }
  }, [syncPinnedStickyTop])

  return (
    <section
      ref={sectionRef}
      id="reviews-section"
      className="why-us-editorial"
      aria-labelledby="why-us-heading"
      data-section="why-us"
    >
      <div className="reviews-inner">
        <div className="reviews-left">
          <div className="section-label">
            <span>Trusted on complex work</span>
          </div>
          {displayData.items.map((item, index) => {
            const meta = REVIEW_META[index % REVIEW_META.length]
            const serviceTag = item.icon ? EYEBROW_BY_ICON[item.icon] : 'Partnership'

            return (
              <article
                key={item.title || String(index)}
                className="review-entry"
              >
                <div className="review-meta">
                  <div>
                    <span className="reviewer-name">{meta.name}</span>
                    <span className="review-role">{meta.role}</span>
                  </div>
                  <span className="review-date">{meta.date}</span>
                </div>
                <RatingPips filled={index % 5 === 2 ? 4 : 5} />
                <h3 className="review-title">&ldquo;{item.title}&rdquo;</h3>
                <p className="review-body">{item.description}</p>
                <span className="review-service">{serviceTag}</span>
              </article>
            )
          })}
        </div>

        <aside ref={panelRef} className="reviews-right">
          <div className="panel-main">
            <div className="panel-eyebrow">
              <span>Why US Mechanical</span>
            </div>
            <h2 id="why-us-heading" className="panel-headline">
              {headline.plain}{' '}
              {headline.italic ? <em>{headline.italic}</em> : null}
            </h2>
            <p className="panel-desc">{displayData.sectionSubtitle}</p>

            <div className="panel-stats">
              {STATS.map((s) => (
                <div key={s.number + s.label} className="stat-cell">
                  <div className="stat-number">{s.number}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <Link className="panel-cta" to="/contact">
              Schedule a consultation
            </Link>
          </div>

          <p className="panel-license">
            Licensed, bonded &amp; insured. Utah, Nevada, Arizona, California &amp; Wyoming. MC / plumbing /
            HVAC &amp; process scope as applicable—verify licenses with each office.
          </p>
        </aside>
      </div>
    </section>
  )
}

export default memo(WhyUsSection)
