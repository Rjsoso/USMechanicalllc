import { useMemo, memo, useCallback, useLayoutEffect, useRef, useState } from 'react'
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

const STATS = [
  { number: '60+', label: 'Years serving' },
  { number: '5', label: 'Licensed states' },
  { number: '$150M+', label: 'Aggregate bonding' },
  { number: '1963', label: 'Year founded' },
]

/**
 * Minimum gap we keep between nav bottom + viewport bottom when fitting the panel.
 * (Otherwise `88vh` panel height can exceed the real window height from JS APIs.)
 */
const STICKY_VIEWPORT_MARGIN_PX = 48

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
  const [pinnedTop, setPinnedTop] = useState(null)

  const syncPinnedStickyTop = useCallback(() => {
    const section = sectionRef.current
    const panel = panelRef.current
    if (!section || !panel) return

    if (!window.matchMedia('(min-width: 901px)').matches) {
      setPinnedTop(null)
      section.style.removeProperty('--why-sticky-top-pinned')
      section.style.removeProperty('--why-panel-fit-cap')
      return
    }

    const nav = document.querySelector('.desktop-nav')
    // Fixed-position elements have offsetParent === null; never use that to test visibility.
    if (!nav || getComputedStyle(nav).display === 'none') {
      setPinnedTop(null)
      section.style.removeProperty('--why-sticky-top-pinned')
      section.style.removeProperty('--why-panel-fit-cap')
      return
    }

    const innerH = window.innerHeight

    const maxPanelH = Math.max(380, Math.floor(innerH - nav.getBoundingClientRect().bottom - STICKY_VIEWPORT_MARGIN_PX))
    section.style.setProperty('--why-panel-fit-cap', `${maxPanelH}px`)

    const applyCenteredTop = () => {
      const nb = nav.getBoundingClientRect().bottom
      const panelH = Math.ceil(panel.getBoundingClientRect().height)
      const slack = innerH - nb - panelH
      let topPx = slack > 0 ? nb + slack / 2 : nb
      topPx = Math.max(nb, Math.round(topPx * 1000) / 1000)
      const topStr = `${topPx}px`
      setPinnedTop(topStr)
      section.style.setProperty('--why-sticky-top-pinned', topStr)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!sectionRef.current || !panelRef.current) return
          const nb2 = nav.getBoundingClientRect().bottom
          const br = panel.getBoundingClientRect()
          const gapAbove = br.top - nb2
          const gapBelow = innerH - br.bottom
          if (gapBelow >= gapAbove - 8) return

          const delta = (gapBelow - gapAbove) / 2
          let adjTop = br.top + delta
          adjTop = Math.max(nb2, adjTop)
          const adjStr = `${Math.round(adjTop * 1000) / 1000}px`
          setPinnedTop(adjStr)
          section.style.setProperty('--why-sticky-top-pinned', adjStr)
        })
      })
    }

    requestAnimationFrame(applyCenteredTop)
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

    const mq = window.matchMedia('(min-width: 901px)')
    mq.addEventListener('change', schedule)

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      mq.removeEventListener('change', schedule)
      if (raf) cancelAnimationFrame(raf)
      setPinnedTop(null)
      sectionRef.current?.style.removeProperty('--why-sticky-top-pinned')
      sectionRef.current?.style.removeProperty('--why-panel-fit-cap')
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
            <span>What defines us</span>
          </div>
          {displayData.items.map((item, index) => {
            const themeTag = item.icon ? EYEBROW_BY_ICON[item.icon] : 'Partnership'

            return (
              <article
                key={item.title || String(index)}
                className="review-entry why-us-point"
              >
                <span className="why-us-point__theme">{themeTag}</span>
                <h3 className="review-title">{item.title}</h3>
                <p className="review-body">{item.description}</p>
              </article>
            )
          })}
        </div>

        <aside ref={panelRef} className="reviews-right" style={pinnedTop ? { top: pinnedTop } : undefined}>
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
