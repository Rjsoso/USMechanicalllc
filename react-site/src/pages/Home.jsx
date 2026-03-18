/* global process */
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutAndSafety from '../components/AboutAndSafety'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Contact from '../pages/Contact'
import CompanyStats from '../components/CompanyStats'
import ServicesSection from '../components/ServicesSection'
import Portfolio from '../components/Portfolio'
import LogoLoopSection from '../components/LogoLoopSection'
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

export default function Home() {
  const location = useLocation()
  const initialScrollDone = useRef(false)

  const hero = useSanityLive(HERO_QUERY, {}, { listenFilter: `*[_type == "heroSection"]` })
  const services = useSanityLive(SERVICES_QUERY, {}, { listenFilter: `*[_type == "ourServices"]` })
  const portfolioCat = useSanityLive(PORTFOLIO_CATEGORIES_QUERY, {}, { listenFilter: `*[_type == "portfolioCategory"]` })
  const portfolioSec = useSanityLive(PORTFOLIO_SECTION_QUERY, {}, { listenFilter: `*[_id == "portfolioSection"]` })
  const stats = useSanityLive(STATS_QUERY, {}, { listenFilter: `*[_type == "companyStats"]` })
  const about = useSanityLive(ABOUT_QUERY, {}, { listenFilter: `*[_type == "aboutAndSafety"]` })

  const heroBackgroundUrl = useMemo(() => {
    const heroData = hero.data
    if (!heroData) return null
    if (heroData?.backgroundImage?.asset?.url) {
      return `${heroData.backgroundImage.asset.url}?w=1920&q=85&auto=format`
    }
    if (heroData?.backgroundImage) {
      const url = urlFor(heroData.backgroundImage)?.width(1920).quality(85).auto('format').url()
      return url || null
    }
    return null
  }, [hero.data])

  const portfolioData = useMemo(() => {
    if (portfolioCat.data && portfolioSec.data) {
      return { categories: portfolioCat.data, section: portfolioSec.data }
    }
    return null
  }, [portfolioCat.data, portfolioSec.data])

  const servicesData = services.data
  const statsData = stats.data
  const aboutData = about.data
  const allDataLoaded = !hero.loading && !about.loading

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
      // On page reload, clear location state immediately
      if (isPageReload.current) {
        if (process.env.NODE_ENV === 'development')
          console.log('Home.jsx: Clearing location state on page reload')
        window.history.replaceState({}, document.title)
      }

      const scrollTo = location.state?.scrollTo
      const urlHash = window.location.hash.replace('#', '')
      
      if (!scrollTo || isPageReload.current) {
        // Clear any URL hash only if it's not a valid section
        if (window.location.hash) {
          const validSections = ['contact', 'services', 'portfolio', 'about', 'safety', 'hero']
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
      // We have a section to scroll to - wait for components to load
      if (process.env.NODE_ENV === 'development')
        console.log(`Home.jsx: Starting scroll to ${targetSection}`)
      
      // For lazy-loaded sections like contact, give time for Suspense to resolve
      const isLazySection = targetSection === 'contact'
      const initialDelay = isLazySection ? 150 : 0
      
      setTimeout(() => {
        // Use smooth scroll with retry mechanism for lazy sections
        scrollToSection(targetSection, 180, isLazySection ? 100 : 50, isLazySection ? 50 : 200).then(success => {
          if (process.env.NODE_ENV === 'development')
            console.log(`Scroll to ${targetSection} result: ${success}`)
          
          // Clear only the location.state, but keep the hash in the URL for direct navigation
          if (scrollTo) {
            const currentHash = window.location.hash
            window.history.replaceState({}, document.title, window.location.pathname + currentHash)
          }
          
          // If scroll failed for contact, try one more time with a longer delay
          if (!success && isLazySection) {
            if (process.env.NODE_ENV === 'development')
              console.log('Contact scroll failed, retrying once more...')
            setTimeout(() => {
              scrollToSection(targetSection, 180, 50, 300)
            }, 500)
          }
        })
      }, initialDelay)
    }
  }, [location.state?.scrollTo, location.hash])

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
          
          // Use scrollToSection with appropriate settings for the section
          const isLazySection = hash === 'contact'
          scrollToSection(hash, 180, isLazySection ? 100 : 50, isLazySection ? 50 : 200)
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

      {!allDataLoaded && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
          <div style={{ textAlign: 'center', color: '#ffffff' }}>
            <div style={{ width: '50px', height: '50px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#ffffff', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '16px', fontWeight: 500, opacity: 0.9 }}>Loading…</p>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {allDataLoaded && (
      <>
      <main
        className="main-with-fixed-bg"
        style={{
          '--bg-url': heroBackgroundUrl ? `url(${heroBackgroundUrl})` : 'none',
          position: 'relative',
          minHeight: '100vh',
        }}
      >
        <section id="hero" style={{ position: 'relative', top: 0, left: 0, width: '100%' }}>
          <HeroSection />
        </section>
        <div style={{ marginTop: 0, position: 'relative', zIndex: 1 }}>
          <AboutAndSafety data={aboutData} />

          <CompanyStats data={statsData} />
          <ServicesSection data={servicesData} />
          <Portfolio data={portfolioData} />
          <LogoLoopSection />
          <div id="contact-wrapper">
            <Contact />
          </div>
        </div>
      </main>
      <Footer />
      </>
      )}
    </>
  )
}
