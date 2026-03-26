import { useMemo, memo } from 'react'
import { useSanityLive } from '../hooks/useSanityLive'
import FadeInNative from './FadeInNative'

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
            <FadeInNative key={item.title || index} delay={0.05 * index}>
              <div className="group rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 transition-colors duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] md:p-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/10 text-red-500">
                  {ICON_MAP[item.icon] || ICON_MAP.tool}
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/60">
                  {item.description}
                </p>
              </div>
            </FadeInNative>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(WhyUsSection)
