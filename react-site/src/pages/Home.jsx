/* global process */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import SectionScrollSeam from '../components/SectionScrollSeam'
import ParallaxLayer from '../components/ParallaxLayer'
import SafetySection from '../components/SafetySection'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import CompanyStats from '../components/CompanyStats'
import ServicesSection from '../components/ServicesSection'
import Portfolio from '../components/Portfolio'
import ContactMapSection from '../components/ContactMapSection'
import WhyUsSection from '../components/WhyUsSection'
import { scrollToSection } from '../utils/scrollToSection'
import { getSiteUrlSlash } from '../utils/siteUrl'
import { urlFor } from '../utils/sanity'
import { useSanityLive } from '../hooks/useSanityLive'

const HERO_QUERY = `*[_type == "heroSection"][0]{ _id, backgroundImage { asset-> { _id, url } } }`
const SERVICES_QUERY = `*[_type == "ourServices"][0]{
  sectionTitle,
  descriptionText,
  deliveryMethodsHeading,
  deliveryMethodsFormHeadline,
  deliveryMethodsFormCopy,
  deliveryMethodsEmail,
  deliveryMethods[] {
    title, summary, badge, badgeTone,
    backgroundImage { asset-> { url, _id }, alt },
    body
  },
  servicesInfo[] {
    title, description, backgroundType, backgroundColor, textColor,
    backgroundImage { asset-> { _id, url }, alt },
    slug { current },
    fullDescription,
    images[] { asset-> { _id, url }, alt, caption },
    features[] { title, description }
  }
}`
const PORTFOLIO_CATEGORIES_QUERY = `*[_type == "portfolioCategory"] | order(order asc) { _id, title, description, image { asset-> { _id, url }, alt }, order }`
const PORTFOLIO_SECTION_QUERY = `*[_id == "portfolioSection"][0]{ sectionTitle, sectionDescription }`
const STATS_QUERY = `*[_type == "companyStats"][0]{ sectionTitle, stats[]{ label, value, highlighted } }`
const ABOUT_QUERY = `*[_type == "aboutAndSafety"] | order(_updatedAt desc)[0]{ aboutTitle, aboutText, aboutPhotos[] { asset-> { _id, url, originalFilename }, alt, caption }, safetyTitle, safetyText, safetyLogos[] { image { asset-> { _id, url, originalFilename }, alt, caption }, icon, title, href } }`
const WHY_US_QUERY = `*[_type == "whyUs" && _id == "whyUs"][0]{ _id, sectionTitle, sectionSubtitle, items[]{ title, description, icon } }`

// Hero ladder picked against viewport CSS pixels × DPR so retina + ultrawide
// screens get sharp pixels without overloading laptops/phones.
const HERO_WIDTH_LADDER = [1280, 1920, 2560, 3200]

// Used when Sanity API is unreachable (e.g. missing CORS origin on production).
const FALLBACK_HERO_BG_BASE =
  'https://cdn.sanity.io/images/3vpl3hho/production/cab5ddd9e21487005205aa1f34010f132feec6b2-585x350.jpg'

function pickHeroWidth() {
  if (typeof window === 'undefined') return 1920
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const target = (window.innerWidth || 1280) * dpr
  return HERO_WIDTH_LADDER.find((w) => w >= target) || HERO_WIDTH_LADDER[HERO_WIDTH_LADDER.length - 1]
}

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialScrollDone = useRef(false)

  const hero = useSanityLive(HERO_QUERY, {}, { listenFilter: `*[_type == "heroSection"]` })
  const services = useSanityLive(SERVICES_QUERY, {}, { listenFilter: `*[_type == "ourServices"]` })
  const portfolioCat = useSanityLive(PORTFOLIO_CATEGORIES_QUERY, {}, { listenFilter: `*[_type == "portfolioCategory"]` })
  const portfolioSec = useSanityLive(PORTFOLIO_SECTION_QUERY, {}, { listenFilter: `*[_id == "portfolioSection"]` })
  const stats = useSanityLive(STATS_QUERY, {}, { listenFilter: `*[_type == "companyStats"]` })
  const about = useSanityLive(ABOUT_QUERY, {}, { listenFilter: `*[_type == "aboutAndSafety"]` })
  const whyUs = useSanityLive(WHY_US_QUERY, {}, { listenFilter: `*[_type == "whyUs"]` })

  const [heroWidth, setHeroWidth] = useState(() => pickHeroWidth())

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    let rafId = 0
    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const next = pickHeroWidth()
        setHeroWidth((prev) => (prev === next ? prev : next))
      })
    }
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('orientationchange', onResize, { passive: true })
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  const heroBackgroundUrl = useMemo(() => {
    const heroData = hero.data
    if (heroData?.backgroundImage?.asset?.url) {
      return `${heroData.backgroundImage.asset.url}?w=${heroWidth}&q=85&auto=format&fit=max`
    }
    if (heroData?.backgroundImage) {
      const url = urlFor(heroData.backgroundImage)
        ?.width(heroWidth)
        .quality(85)
        .auto('format')
        .fit('max')
        .url()
      if (url) return url
    }
    return `${FALLBACK_HERO_BG_BASE}?w=${heroWidth}&q=85&auto=format&fit=max`
  }, [hero.data, heroWidth])

  const portfolioData = useMemo(() => {
    if (portfolioCat.data && portfolioSec.data) {
      return { categories: portfolioCat.data, section: portfolioSec.data }
    }
    return null
  }, [portfolioCat.data, portfolioSec.data])

  const servicesData = services.data
  const statsData = stats.data
  const aboutData = about.data
  const whyUsData = whyUs.data

  // Preload the hero background as soon as its URL is known so the browser can
  // start fetching in parallel with component JS/CSS. The CSS background-image
  // wouldn't otherwise kick off the network request until paint.
  useEffect(() => {
    if (!heroBackgroundUrl) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = heroBackgroundUrl
    link.fetchPriority = 'high'
    document.head.appendChild(link)
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link)
    }
  }, [heroBackgroundUrl])

  // Detect if this is a page reload (not navigation)
  const isPageReload = useRef(
    !location.state?.scrollTo &&
      (performance.getEntriesByType('navigation')[0]?.type === 'reload' ||
        performance.navigation?.type === 1)
  )

  // Disable browser scroll restoration
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Scroll to top IMMEDIATELY before paint (unless navigating to a section)
  useLayoutEffect(() => {
    if (!initialScrollDone.current) {
      const scrollTo = location.state?.scrollTo
      const urlHash = window.location.hash.replace('#', '')

      // On page reload, clear location state immediately
      if (isPageReload.current) {
        if (process.env.NODE_ENV === 'development')
          console.log('Home.jsx: Clearing location state on page reload')
        window.history.replaceState({}, document.title)
      }

      if (!scrollTo || isPageReload.current) {
        // Clear any URL hash only if it's not a valid section
        if (window.location.hash) {
          const validSections = ['services', 'portfolio', 'about', 'safety', 'hero', 'contact']
          if (!validSections.includes(urlHash)) {
            if (process.env.NODE_ENV === 'development')
              console.log('Clearing invalid hash:', window.location.hash)
            window.history.replaceState({}, '', window.location.pathname)
          } else {
            if (process.env.NODE_ENV === 'development')
              console.log('Valid hash detected, allowing browser to handle:', window.location.hash)
            // Don't clear valid hashes - let browser handle the scroll
            return
          }
        }
        // Force scroll to top immediately before browser paints (only if no valid hash)
        window.scrollTo(0, 0)
      }
      initialScrollDone.current = true
    }
    // Note: location.state dependency intentionally omitted to prevent re-runs on state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle navigation to specific sections (runs after paint)
  // BUT: Skip on page reload to prevent unwanted scrolling
  useEffect(() => {
    const scrollTo = location.state?.scrollTo
    const urlHash = window.location.hash.replace('#', '')
    const targetSection = scrollTo || urlHash
    
    if (process.env.NODE_ENV === 'development')
      console.log('Home.jsx useEffect - scrollTo from location.state:', scrollTo, 'urlHash:', urlHash)

    // If this is a page reload, don't run any scroll logic
    if (isPageReload.current) {
      if (process.env.NODE_ENV === 'development')
        console.log('Home.jsx: Page reload detected, skipping scroll logic')
      // Clear location state to prevent it from persisting
      if (scrollTo) {
        window.history.replaceState({}, document.title)
      }
      return
    }

    if (targetSection) {
      if (process.env.NODE_ENV === 'development')
        console.log(`Home.jsx: Starting scroll to ${targetSection}`)

      const isContactSection = targetSection === 'contact'
      const initialDelay = isContactSection ? 200 : 0

      setTimeout(() => {
        scrollToSection(
          targetSection,
          180,
          isContactSection ? 120 : 50,
          isContactSection ? 80 : 200
        ).then(success => {
          if (process.env.NODE_ENV === 'development')
            console.log(`Scroll to ${targetSection} result: ${success}`)

          if (scrollTo) {
            const currentHash = window.location.hash
            window.history.replaceState({}, document.title, window.location.pathname + currentHash)
          }

          if (!success && isContactSection) {
            setTimeout(() => {
              scrollToSection('contact', 180, 50, 300)
            }, 400)
          }
        })
      }, initialDelay)
    }
  }, [location.state?.scrollTo, location.hash, navigate])

  // Handle browser back/forward navigation with hash URLs
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        const validSections = ['hero', 'about', 'safety', 'services', 'portfolio', 'contact']
        if (validSections.includes(hash)) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Hash changed to #${hash}, scrolling to section`)
          }

          scrollToSection(hash, 180, 50, 200)
        }
      } else {
        // No hash means scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    // Listen for hashchange events (browser back/forward buttons)
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [navigate])

  // Keep --safety-actual-height in sync with Safety's real rendered height.
  // That height varies a lot by breakpoint (measured ~910px at 1024px wide
  // down to ~733px at 1280px+, since the cert-logo row and paragraph reflow)
  // and even by content edits in Sanity — a fixed px value in CSS can't
  // track that. The Safety/Stats sticky "cover" effect in index.css reads
  // this custom property via calc() so the stats card's rise-and-cover
  // timing always matches Safety's actual height instead of a stale guess
  // (a mismatch here is what let Safety peek out from under the cover, or
  // produced huge cover-panel padding, at particular viewport widths).
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined
    const safetyEl = document.getElementById('safety')
    if (!safetyEl) return undefined

    const updateSafetyHeight = () => {
      const height = safetyEl.getBoundingClientRect().height
      if (height > 0) {
        document.documentElement.style.setProperty('--safety-actual-height', `${height}px`)
      }
    }

    updateSafetyHeight()
    // { box: 'border-box' } is required — ResizeObserver defaults to
    // watching the content-box only, so height changes that come from
    // padding/border (or, in some browsers, from sub-pixel layout/paint
    // settling after logos/fonts finish loading) can silently fail to
    // trigger the callback, leaving --safety-actual-height stale even
    // though getBoundingClientRect() (border-box) has already changed.
    const observer = new ResizeObserver(updateSafetyHeight)
    observer.observe(safetyEl, { box: 'border-box' })

    // Belt-and-suspenders for the two other realistic causes of a late
    // height change ResizeObserver could plausibly miss: web fonts
    // swapping in (reflows text) and the logo images finishing load.
    document.fonts?.ready?.then(updateSafetyHeight).catch(() => {})
    window.addEventListener('load', updateSafetyHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('load', updateSafetyHeight)
    }
  }, [])

  // Keep --stats-panel-height in sync with .stats-cover-panel's real
  // rendered height (CompanyStats' own content, ~165-215px across
  // breakpoints per its internal padding). index.css's .stats-cover-spacer
  // uses this to compute the exact minimum dwell needed after the stats
  // panel fully covers Safety before releasing into Services — the wrapper's
  // black background has to keep tracking Safety all the way until Safety
  // itself clears the viewport (Safety's sticky positioning keeps it
  // effectively glued to the bottom of .safety-pin-wrapper as it releases,
  // so this can't be shortened by, say, hiding Safety early — the coverage
  // requirement is a hard geometric consequence of the sticky containing
  // block, confirmed by testing). Using the *real* panel height here instead
  // of a fixed conservative guess is what safely tightens the spacer as much
  // as possible without reopening the "Safety peeks through" bug.
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined
    const panelEl = document.querySelector('.stats-cover-panel')
    if (!panelEl) return undefined

    const updatePanelHeight = () => {
      const height = panelEl.getBoundingClientRect().height
      if (height > 0) {
        document.documentElement.style.setProperty('--stats-panel-height', `${height}px`)
      }
    }

    updatePanelHeight()
    const observer = new ResizeObserver(updatePanelHeight)
    observer.observe(panelEl, { box: 'border-box' })
    document.fonts?.ready?.then(updatePanelHeight).catch(() => {})
    window.addEventListener('load', updatePanelHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('load', updatePanelHeight)
    }
  }, [])

  // Parallax scroll animation removed — sections now scroll naturally

  return (
    <>
      <SEO
        title="US Mechanical | Plumbing & HVAC Experts | Since 1963"
        description="Trusted mechanical contracting since 1963, serving Utah, Nevada, and beyond. Plumbing, HVAC, and design-build specialists. Licensed, bonded & insured."
        keywords="mechanical contractors, HVAC contractors, plumbing contractors, commercial HVAC, industrial plumbing, process piping, Utah contractors, Nevada contractors, Pleasant Grove HVAC, Las Vegas mechanical, design build, construction services"
        url={getSiteUrlSlash()}
      />
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="main-with-fixed-bg"
        style={{
          '--bg-url': `url(${heroBackgroundUrl})`,
          position: 'relative',
          minHeight: '100vh',
        }}
      >
        {/* Each section renders its own content (with graceful defaults) as
            data arrives — no full-page blocking spinner. The hero always renders
            immediately using its fallback copy; the background image fades in
            once Sanity resolves it. */}
        <div style={{ position: 'relative', top: 0, left: 0, width: '100%' }}>
          <HeroSection data={hero.data} />
        </div>
        <div style={{ marginTop: 0, position: 'relative', zIndex: 1 }}>
          <AboutSection data={aboutData} />
          <SectionScrollSeam />
          <div className="safety-pin-wrapper">
            <SafetySection data={aboutData} />
            <div className="safety-pin-spacer" aria-hidden="true" />
          </div>
          <div className="stats-cover-wrapper">
            <div className="stats-cover-panel">
              <ParallaxLayer>
                <CompanyStats data={statsData} />
              </ParallaxLayer>
            </div>
            <div className="stats-cover-spacer" aria-hidden="true" />
          </div>
          <ServicesSection data={servicesData} />
          <Portfolio data={portfolioData} />
          <WhyUsSection data={whyUsData} />
          <div className="border-t border-[#d8d5d0] bg-[#f7f6f3] px-6 pb-16 pt-20 text-center md:pb-20 md:pt-24">
            <p className="mx-auto mb-6 max-w-2xl font-serif text-2xl font-normal leading-snug text-[#111111] md:text-3xl">
              Ready to discuss your next project?
            </p>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#111111] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.12em] text-[#f7f6f3] transition-colors duration-200 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
            >
              Contact Us
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          <ContactMapSection />
        </div>
      </main>
      <Footer />
    </>
  )
}
