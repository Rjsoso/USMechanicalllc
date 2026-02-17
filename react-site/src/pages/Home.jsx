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
import Careers from '../components/Careers'
import { scrollToSection } from '../utils/scrollToSection'
import { client, urlFor } from '../utils/sanity'

export default function Home() {
  const location = useLocation()
  const [scrollSlide, setScrollSlide] = useState(0)
  const initialScrollDone = useRef(false)
  const [heroBackgroundUrl, setHeroBackgroundUrl] = useState(null)
  
  // Centralized data states for all components
  const [servicesData, setServicesData] = useState(null)
  const [portfolioData, setPortfolioData] = useState(null)
  const [statsData, setStatsData] = useState(null)
  const [aboutData, setAboutData] = useState(null)
  const [allDataLoaded, setAllDataLoaded] = useState(false)

  // DOM refs for direct manipulation (no React re-renders)
  const scrollAnimatedElementRef = useRef(null)
  const contactWrapperRef = useRef(null)

  // Refs for smooth scroll interpolation
  const lastScrollSlideRef = useRef(0)
  const targetScrollSlideRef = useRef(0)
  const animationFrameRef = useRef(null)

  // Contact slide animation state
  const [contactSlide, setContactSlide] = useState(-600)
  const contactAnimationComplete = useRef(false)
  const skipContactAnimationOnce = useRef(false)
  const buttonNavigationUsed = useRef(false) // Track if any button navigation happened
  
  // Contact interpolation refs for ultra-smooth motion
  const lastContactSlideRef = useRef(-600)
  const targetContactSlideRef = useRef(-600)
  const contactAnimationFrameRef = useRef(null)
  
  // Remove excessive debug logging - causes console flood

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
          const validSections = ['contact', 'services', 'portfolio', 'about', 'safety', 'careers', 'hero']
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
        const validSections = ['hero', 'about', 'safety', 'services', 'portfolio', 'careers', 'contact']
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

      const [heroResult, servicesResult, portfolioResult, statsResult, aboutResult] = await Promise.allSettled([
        heroPromise,
        servicesPromise,
        portfolioPromise,
        statsPromise,
        aboutPromise
      ])

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

      if (servicesResult.status === 'fulfilled' && servicesResult.value != null) setServicesData(servicesResult.value)
      else if (servicesResult.status === 'rejected') console.error('[Home] Services fetch error:', servicesResult.reason)

      if (portfolioResult.status === 'fulfilled' && portfolioResult.value != null) setPortfolioData(portfolioResult.value)
      else if (portfolioResult.status === 'rejected') console.error('[Home] Portfolio fetch error:', portfolioResult.reason)

      if (statsResult.status === 'fulfilled' && statsResult.value != null) setStatsData(statsResult.value)
      else if (statsResult.status === 'rejected') console.error('[Home] Stats fetch error:', statsResult.reason)

      if (aboutResult.status === 'fulfilled' && aboutResult.value != null) setAboutData(aboutResult.value)
      else if (aboutResult.status === 'rejected') console.error('[Home] About fetch error:', aboutResult.reason)

      setAllDataLoaded(true)
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  // Force contact wrapper to visible position (refs + DOM) when skipping/locking animation
  const setContactWrapperToZero = () => {
    targetContactSlideRef.current = 0
    lastContactSlideRef.current = 0
    if (contactWrapperRef.current) {
      contactWrapperRef.current.style.transform = 'translate3d(0, 0px, 0)'
      contactWrapperRef.current.style.webkitTransform = 'translate3d(0, 0px, 0)'
    }
  }

  // Skip contact animation ONCE when navigating directly
  useEffect(() => {
    const shouldSkipAnimation = 
      sessionStorage.getItem('skipContactAnimation') === 'true' ||
      location.state?.scrollTo === 'contact' || 
      window.location.hash === '#contact'
    
    if (shouldSkipAnimation && !skipContactAnimationOnce.current) {
      setContactSlide(0)
      setContactWrapperToZero()
      requestAnimationFrame(() => setContactWrapperToZero()) // in case wrapper not mounted yet
      skipContactAnimationOnce.current = true
      sessionStorage.removeItem('skipContactAnimation')
      
      if (process.env.NODE_ENV === 'development') {
        console.warn('[DEBUG] Contact: Animation skipped for direct navigation, contactSlide set to 0')
      }
      
      setTimeout(() => {
        skipContactAnimationOnce.current = false
        if (process.env.NODE_ENV === 'development') {
          console.warn('[DEBUG] Contact: Animation skip flag cleared')
        }
      }, 2000)
    }
  }, [location.state?.scrollTo, location.hash])
  
  // Listen for lock/unlock events (synchronous)
  useEffect(() => {
    const handleLock = () => {
      setContactSlide(0)
      setContactWrapperToZero()
      skipContactAnimationOnce.current = true
      contactAnimationComplete.current = true
      buttonNavigationUsed.current = true
      if (process.env.NODE_ENV === 'development') {
        console.warn('[DEBUG] Contact: Animation LOCKED (event), contactSlide FROZEN at 0')
        console.warn('[BUTTON-NAV] buttonNavigationUsed set to TRUE - animation permanently disabled')
      }
    }
    
    const handleUnlock = () => {
      skipContactAnimationOnce.current = false
      // Keep contactAnimationComplete and buttonNavigationUsed true - animation stays disabled
      if (process.env.NODE_ENV === 'development') {
        console.warn('[DEBUG] Contact: Animation UNLOCKED (event)')
      }
    }
    
    window.addEventListener('lockContactAnimation', handleLock)
    window.addEventListener('unlockContactAnimation', handleUnlock)
    
    return () => {
      window.removeEventListener('lockContactAnimation', handleLock)
      window.removeEventListener('unlockContactAnimation', handleUnlock)
    }
  }, [])
  
  // Event-based communication instead of polling for better performance
  useEffect(() => {
    const handleSkipAnimation = () => {
      if (!skipContactAnimationOnce.current) {
        setContactSlide(0)
        setContactWrapperToZero()
        skipContactAnimationOnce.current = true
        sessionStorage.removeItem('skipContactAnimation')
        if (process.env.NODE_ENV === 'development') {
          console.warn('[DEBUG] Contact: Animation skipped (event-based), contactSlide set to 0')
        }
        
        setTimeout(() => {
          skipContactAnimationOnce.current = false
          if (process.env.NODE_ENV === 'development') {
            console.warn('[DEBUG] Contact: Animation skip flag cleared')
          }
        }, 2000)
      }
    }
    
    window.addEventListener('skipContactAnimation', handleSkipAnimation)
    return () => window.removeEventListener('skipContactAnimation', handleSkipAnimation)
  }, [])
  
  // Listen for pre-set scroll slide values (for navigation)
  useEffect(() => {
    const handleSetScrollSlide = (event) => {
      const value = event.detail?.value
      if (typeof value === 'number') {
        setScrollSlide(value)
        lastScrollSlideRef.current = value
        targetScrollSlideRef.current = value
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[DEBUG] Scroll slide preset to ${value}px`)
        }
      }
    }
    
    window.addEventListener('setScrollSlide', handleSetScrollSlide)
    
    return () => {
      window.removeEventListener('setScrollSlide', handleSetScrollSlide)
    }
  }, [])

  // Scroll-triggered animation for Stats + Services sliding under Safety
  // Use setInterval for interpolation so RAF is left for stats + logo loop (no competing loops)
  useEffect(() => {
    let lastScrollTime = 0
    const THROTTLE = 16
    const INTERPOLATION_SPEED = 0.15
    const SCROLL_INTERP_MS = 40 // ~25fps - leaves RAF budget for stats and logo

    const cancelPendingScrollAnimations = () => {
      // Interval keeps running; lock just prevents updates
    }
    window.addEventListener('lockContactAnimation', cancelPendingScrollAnimations)

    const intervalId = setInterval(() => {
      if (document.hidden || window.__scrollNavigationLock) return
      const current = lastScrollSlideRef.current
      const target = targetScrollSlideRef.current
      const diff = target - current
      if (Math.abs(diff) > 0.1) {
        const newValue = current + diff * INTERPOLATION_SPEED
        lastScrollSlideRef.current = newValue
        if (scrollAnimatedElementRef.current) {
          scrollAnimatedElementRef.current.style.transform = `translate3d(0, ${newValue}px, 0)`
        }
      } else {
        lastScrollSlideRef.current = target
        if (scrollAnimatedElementRef.current) {
          scrollAnimatedElementRef.current.style.transform = `translate3d(0, ${target}px, 0)`
        }
      }
    }, SCROLL_INTERP_MS)

    const handleScroll = () => {
      if (document.hidden) return
      if (window.__scrollNavigationLock) return
      if (sessionStorage.getItem('scrollNavigationInProgress') === 'true') return
      const now = Date.now()
      if (now - lastScrollTime < THROTTLE) return
      lastScrollTime = now

      const safetySection = document.querySelector('#safety')
      if (!safetySection) return
      const rect = safetySection.getBoundingClientRect()
      const safetyBottom = rect.bottom
      const viewportHeight = window.innerHeight
      const slideStart = viewportHeight * 0.25
      const slideEnd = 0
      let targetValue = 0
      if (safetyBottom <= slideStart && safetyBottom >= slideEnd) {
        const progress = 1 - safetyBottom / slideStart
        const maxSlide = 150
        targetValue = -progress * maxSlide
      } else if (safetyBottom < slideEnd) {
        targetValue = -150
      }
      targetScrollSlideRef.current = targetValue
    }

    const safetySection = document.querySelector('#safety')
    let isNearViewport = true
    const observer = safetySection ? new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting
        if (isNearViewport) handleScroll()
      },
      { threshold: 0, rootMargin: '300px' }
    ) : null
    if (observer && safetySection) observer.observe(safetySection)

    const handleScrollOptimized = () => {
      if (!isNearViewport) return
      handleScroll()
    }
    const handleVisibilityChange = () => {
      if (!document.hidden) handleScroll()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('scroll', handleScrollOptimized, { passive: true })
    window.addEventListener('resize', handleScrollOptimized, { passive: true })
    handleScroll()

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (observer) observer.disconnect()
      window.removeEventListener('scroll', handleScrollOptimized)
      window.removeEventListener('resize', handleScrollOptimized)
      window.removeEventListener('lockContactAnimation', cancelPendingScrollAnimations)
    }
  }, [])

  // Contact section progressive slide - setInterval so RAF is left for stats + logo loop
  useEffect(() => {
    let lastScrollTime = 0
    const THROTTLE = 16
    const INTERPOLATION_SPEED = 0.15
    const CONTACT_INTERP_MS = 40

    const intervalId = setInterval(() => {
      if (document.hidden || window.__scrollNavigationLock) return
      const current = lastContactSlideRef.current
      const target = targetContactSlideRef.current
      const diff = target - current
      if (Math.abs(diff) > 1) {
        const newValue = current + diff * INTERPOLATION_SPEED
        lastContactSlideRef.current = newValue
        if (contactWrapperRef.current && !buttonNavigationUsed.current) {
          contactWrapperRef.current.style.transform = `translate3d(0, ${newValue}px, 0)`
        }
      } else {
        lastContactSlideRef.current = target
        if (contactWrapperRef.current && !buttonNavigationUsed.current) {
          contactWrapperRef.current.style.transform = `translate3d(0, ${target}px, 0)`
        }
      }
    }, CONTACT_INTERP_MS)

    const handleContactScroll = () => {
      if (document.hidden || window.__scrollNavigationLock) return
      if (sessionStorage.getItem('scrollNavigationInProgress') === 'true') return
      const now = Date.now()
      if (now - lastScrollTime < THROTTLE) return
      lastScrollTime = now

      const contactWrapper = document.querySelector('#contact-wrapper')
      if (!contactWrapper) return
      const rect = contactWrapper.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const animationStartDistance = viewportHeight * 2.5
      const animationEndDistance = 0
      let slideValue = -600
      if (rect.top <= animationStartDistance && rect.top >= animationEndDistance) {
        const progress = 1 - (rect.top / animationStartDistance)
        slideValue = -600 + (progress * 600)
      } else if (rect.top < animationEndDistance) {
        slideValue = 0
      } else {
        slideValue = -600
      }
      targetContactSlideRef.current = slideValue
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) handleContactScroll()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('scroll', handleContactScroll, { passive: true })
    window.addEventListener('resize', handleContactScroll, { passive: true })
    handleContactScroll()

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('scroll', handleContactScroll)
      window.removeEventListener('resize', handleContactScroll)
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
            className="has-scroll-animation scroll-animated-wrapper"
            style={{
              position: 'relative',
              transform: 'translate3d(0, 0px, 0)',
              WebkitTransform: 'translate3d(0, 0px, 0)',
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              zIndex: 2,
              willChange: 'transform',
              isolation: 'isolate',
            }}
          >
            <CompanyStats data={statsData} />
            <ServicesSection data={servicesData} />
            <Portfolio data={portfolioData} />
            <LogoLoopSection />
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 4,
            }}
          >
            <Careers />
          </div>

          <div
            ref={contactWrapperRef}
            id="contact-wrapper"
            className="scroll-animated-wrapper"
            style={{
              position: 'relative',
              zIndex: 2,
              transform: 'translate3d(0, -600px, 0)',
              WebkitTransform: 'translate3d(0, -600px, 0)',
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              willChange: 'transform',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              contain: 'layout style paint',
              isolation: 'isolate',
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
