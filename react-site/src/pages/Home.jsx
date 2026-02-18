/* global process */
import { useEffect, useLayoutEffect, useState, useRef } from 'react'
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
import { client, urlFor } from '../utils/sanity'

export default function Home() {
  const location = useLocation()
  const initialScrollDone = useRef(false)
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState(null)
  
  // Centralized data states for all components
  const [servicesData, setServicesData] = useState(null)
  const [portfolioData, setPortfolioData] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [aboutData, setAboutData] = useState(null)
  const [allDataLoaded, setAllDataLoaded] = useState(false)

  // DOM refs for scroll-animated wrapper and contact (direct manipulation, no React re-renders)
  const scrollAnimatedElementRef = useRef(null)
  const contactWrapperRef = useRef(null)

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

  // Batched data fetch - use allSettled so one failed fetch does not wipe hero/portfolio/etc.
  useEffect(() => {
    let cancelled = false
    const fetchAll = async () => {
      const heroPromise = client.fetch(`*[_type == "heroSection"][0]{ _id, backgroundImage { asset-> { _id, url } } }`)
      const servicesPromise = client.fetch(`*[_type == "ourServices"][0]{
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
      }`)
      const portfolioPromise = Promise.all([
        client.fetch(`*[_type == "portfolioCategory"] | order(order asc) { _id, title, description, image { asset-> { _id, url }, alt }, order }`),
        client.fetch(`*[_id == "portfolioSection"][0]{ sectionTitle, sectionDescription }`)
      ]).then(([categories, section]) => ({ categories, section }))
      const statsPromise = client.fetch(`*[_type == "companyStats"][0]{ sectionTitle, stats[]{ label, value, highlighted } }`)
      const aboutPromise = client.fetch(`*[_type == "aboutAndSafety"] | order(_updatedAt desc)[0]{ aboutTitle, aboutText, aboutPhotos[] { asset-> { _id, url, originalFilename }, alt, caption }, safetyTitle, safetyText, safetyLogos[] { image { asset-> { _id, url, originalFilename }, alt, caption }, icon, title, href } }`)

      // First paint after hero + about so the page appears faster
      const [heroResult, aboutResult] = await Promise.allSettled([heroPromise, aboutPromise])

      if (cancelled) return

      if (heroResult.status === 'fulfilled' && heroResult.value) {
        const heroData = heroResult.value
        if (heroData?.backgroundImage?.asset?.url) {
          setHeroBackgroundUrl(`${heroData.backgroundImage.asset.url}?w=1920&q=85&auto=format`)
        } else if (heroData?.backgroundImage) {
          const url = urlFor(heroData.backgroundImage)?.width(1920).quality(85).auto('format').url()
          if (url) setHeroBackgroundUrl(url)
        }
      } else if (heroResult.status === 'rejected') {
        console.error('[Home] Hero fetch error:', heroResult.reason)
      }

      if (aboutResult.status === 'fulfilled' && aboutResult.value != null) setAboutData(aboutResult.value)
      else if (aboutResult.status === 'rejected') console.error('[Home] About fetch error:', aboutResult.reason)

      setAllDataLoaded(true)

      // Stream in services, portfolio, stats when ready (no longer block first paint)
      const [servicesResult, portfolioResult, statsResult] = await Promise.allSettled([
        servicesPromise,
        portfolioPromise,
        statsPromise
      ])

      if (cancelled) return

      if (servicesResult.status === 'fulfilled' && servicesResult.value != null) setServicesData(servicesResult.value)
      else if (servicesResult.status === 'rejected') console.error('[Home] Services fetch error:', servicesResult.reason)

      if (portfolioResult.status === 'fulfilled' && portfolioResult.value != null) setPortfolioData(portfolioResult.value)
      else if (portfolioResult.status === 'rejected') console.error('[Home] Portfolio fetch error:', portfolioResult.reason)

      if (statsResult.status === 'fulfilled' && statsResult.value != null) setStatsData(statsResult.value)
      else if (statsResult.status === 'rejected') console.error('[Home] Stats fetch error:', statsResult.reason)
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  // Scroll-driven animation
  // Phase 1 — safety parallax: scroll wrapper slides 0 → -150 px as safety exits
  // Phase 2 — contact reveal:  scroll wrapper slides an extra `overlap` px so it
  //           peels away and reveals the contact section sitting underneath.
  //           The overlap and contact wrapper transform are calculated dynamically
  //           from the viewport height so the effect scales to any screen size.
  useEffect(() => {
    const getDocTop = (el) => {
      let top = 0
      while (el) { top += el.offsetTop; el = el.offsetParent }
      return top
    }

    let safetyDocTop = 0
    let safetyHeight = 0
    let contactDocTop = 0
    let viewportHeight = window.innerHeight
    let overlap = 0          // dynamically calculated each resize/cache

    const cachePositions = () => {
      viewportHeight = window.innerHeight

      const safetyEl = document.querySelector('#safety')
      if (safetyEl) {
        safetyDocTop = getDocTop(safetyEl)
        safetyHeight = safetyEl.offsetHeight
      }

      const contactEl = document.querySelector('#contact-wrapper')
      if (contactEl) {
        contactDocTop = getDocTop(contactEl)
      }

      // Overlap = 45% of viewport, minimum 350px so the reveal is always noticeable
      overlap = Math.max(Math.round(viewportHeight * 0.45), 350)

      // Apply the overlap transform to the contact wrapper so it sits underneath
      if (contactWrapperRef.current) {
        contactWrapperRef.current.style.transform = `translate3d(0, -${overlap}px, 0)`
      }
    }

    const applyScrollAnimations = () => {
      if (document.hidden || window.__scrollNavigationLock) return

      const scrollY = window.scrollY

      // Phase 1 — safety parallax (scroll wrapper slides up to -150px)
      const safetyBottom = (safetyDocTop + safetyHeight) - scrollY
      const slideStart = viewportHeight * 0.25
      let safetyValue = 0
      if (safetyBottom <= slideStart && safetyBottom >= 0) {
        const progress = 1 - safetyBottom / slideStart
        safetyValue = -progress * 150
      } else if (safetyBottom < 0) {
        safetyValue = -150
      }

      // Phase 2 — contact reveal (scroll wrapper slides an additional `overlap` px)
      // Triggers when the contact wrapper's document position enters the lower
      // 90% of the viewport; completes when it reaches the top (animation spans full page).
      let revealValue = 0
      const contactTop = contactDocTop - scrollY
      const revealStart = viewportHeight * 0.9
      if (contactTop <= revealStart && contactTop >= 0) {
        const progress = 1 - contactTop / revealStart
        revealValue = -overlap * progress
      } else if (contactTop < 0) {
        revealValue = -overlap
      }

      const totalOffset = Math.round(safetyValue + revealValue)
      if (scrollAnimatedElementRef.current) {
        scrollAnimatedElementRef.current.style.transform = `translate3d(0, ${totalOffset}px, 0)`
      }
    }

    // Initial cache after React paint settles
    const handleMount = () => { cachePositions(); applyScrollAnimations() }
    requestAnimationFrame(() => requestAnimationFrame(handleMount))

    const onResize = () => { cachePositions(); applyScrollAnimations() }
    window.addEventListener('resize', onResize, { passive: true })

    // Recache periodically (catches lazy-loaded images shifting layout)
    const recacheId = setInterval(cachePositions, 2000)

    let scrollRafId = null
    const onScroll = () => {
      if (scrollRafId) return
      scrollRafId = requestAnimationFrame(() => { scrollRafId = null; applyScrollAnimations() })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const handleVisibilityChange = () => {
      if (!document.hidden) { cachePositions(); applyScrollAnimations() }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(recacheId)
      if (scrollRafId) cancelAnimationFrame(scrollRafId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      <SEO
        title="US Mechanical | Plumbing & HVAC Experts | Since 1963"
        description="Trusted mechanical contracting since 1963, serving Utah, Nevada, and beyond. Plumbing, HVAC, and design-build specialists. Licensed, bonded & insured."
        keywords="mechanical contractors, HVAC contractors, plumbing contractors, commercial HVAC, industrial plumbing, process piping, Utah contractors, Nevada contractors, Pleasant Grove HVAC, Las Vegas mechanical, design build, construction services"
        url="https://usmechanical.com/"
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

          <div
            ref={scrollAnimatedElementRef}
            className="has-scroll-animation"
            style={{
              position: 'relative',
              zIndex: 3,
              willChange: 'transform',
              transform: 'translate3d(0, 0px, 0)',
            }}
          >
            <CompanyStats data={statsData} />
            <ServicesSection data={servicesData} />
            <Portfolio data={portfolioData} />
            <LogoLoopSection />
          </div>

          <div
            id="contact-wrapper"
            ref={contactWrapperRef}
            style={{
              position: 'relative',
              zIndex: 1,
              transform: 'translate3d(0, 0px, 0)',
            }}
          >
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
