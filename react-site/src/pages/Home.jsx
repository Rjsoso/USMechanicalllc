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

export default function Home() {
  const location = useLocation()
  const [scrollSlide, setScrollSlide] = useState(0)
  const initialScrollDone = useRef(false)

  // Refs for smooth scroll interpolation
  const lastScrollSlideRef = useRef(0)
  const targetScrollSlideRef = useRef(0)
  const animationFrameRef = useRef(null)

  // Contact slide animation state
  const [contactSlide, setContactSlide] = useState(-600)
  const contactAnimationComplete = useRef(false)
  const skipContactAnimationOnce = useRef(false)

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

  // Skip contact animation ONCE when navigating directly
  useEffect(() => {
    const shouldSkipAnimation = 
      sessionStorage.getItem('skipContactAnimation') === 'true' ||
      location.state?.scrollTo === 'contact' || 
      window.location.hash === '#contact'
    
    if (shouldSkipAnimation && !skipContactAnimationOnce.current) {
      // Set slide to 0 for direct navigation
      setContactSlide(0)
      skipContactAnimationOnce.current = true
      sessionStorage.removeItem('skipContactAnimation')
      
      console.warn('[DEBUG] Contact: Animation skipped for direct navigation, contactSlide set to 0')
      
      // Clear the flag after a delay to allow animation on subsequent scrolls
      setTimeout(() => {
        skipContactAnimationOnce.current = false
        console.warn('[DEBUG] Contact: Animation skip flag cleared')
      }, 2000) // 2 second delay
    }
  }, [location.state?.scrollTo, location.hash])
  
  // Poll for sessionStorage flag changes (for same-page navigation)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (sessionStorage.getItem('skipContactAnimation') === 'true' && !skipContactAnimationOnce.current) {
        setContactSlide(0)
        skipContactAnimationOnce.current = true
        sessionStorage.removeItem('skipContactAnimation')
        console.warn('[DEBUG] Contact: Animation skipped (polling detected), contactSlide set to 0')
        
        setTimeout(() => {
          skipContactAnimationOnce.current = false
          console.warn('[DEBUG] Contact: Animation skip flag cleared after polling')
        }, 2000)
      }
    }, 50) // Poll every 50ms
    
    return () => clearInterval(pollInterval)
  }, [])

  // Scroll-triggered animation for Stats + Services sliding under Safety
  // Hypersmooth with interpolation for 120Hz displays
  useEffect(() => {
    let rafId = null
    let lastScrollTime = 0
    const THROTTLE = 8 // 120fps max for high refresh rate displays
    const INTERPOLATION_SPEED = 0.15 // Smooth interpolation factor

    // Smooth interpolation loop for buttery transforms
    const interpolate = () => {
      const current = lastScrollSlideRef.current
      const target = targetScrollSlideRef.current
      const diff = target - current

      if (Math.abs(diff) > 0.1) {
        // Smooth interpolation
        const newValue = current + diff * INTERPOLATION_SPEED
        lastScrollSlideRef.current = newValue
        setScrollSlide(newValue)
        animationFrameRef.current = requestAnimationFrame(interpolate)
      } else {
        // Snap to final value
        lastScrollSlideRef.current = target
        setScrollSlide(target)
        animationFrameRef.current = null
      }
    }

    const handleScroll = () => {
      // Skip scroll animations during navigation
      if (sessionStorage.getItem('scrollNavigationInProgress') === 'true') return
      
      const now = Date.now()
      if (now - lastScrollTime < THROTTLE) return
      lastScrollTime = now

      if (rafId) cancelAnimationFrame(rafId)

      rafId = requestAnimationFrame(() => {
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
          const maxSlide = 300
          targetValue = -progress * maxSlide
        } else if (safetyBottom < slideEnd) {
          targetValue = -300
        }

        // Set target and start interpolation
        targetScrollSlideRef.current = targetValue
        if (!animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(interpolate)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    handleScroll()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // Contact section progressive slide animation
  useEffect(() => {
    let rafId = null
    let lastScrollTime = 0
    const THROTTLE = 8 // 120fps max

    const handleContactScroll = () => {
      // Skip scroll animations during navigation
      if (sessionStorage.getItem('scrollNavigationInProgress') === 'true') return
      
      const now = Date.now()
      if (now - lastScrollTime < THROTTLE) return
      lastScrollTime = now

      if (rafId) cancelAnimationFrame(rafId)

      rafId = requestAnimationFrame(() => {
        // If we're skipping animation for direct navigation, keep at 0
        if (skipContactAnimationOnce.current) {
          if (contactSlide !== 0) {
            setContactSlide(0)
          }
          return // Don't run animation logic while skip is active
        }
        
        // If animation already completed, keep it locked at 0
        if (contactAnimationComplete.current) {
          if (contactSlide !== 0) {
            setContactSlide(0)
          }
          return // Exit early - no more calculations
        }

        const contactSection = document.querySelector('#contact')
        if (!contactSection) return

        const rect = contactSection.getBoundingClientRect()
        const contactTop = rect.top + window.scrollY
        const contactHeight = rect.height
        const scrollPosition = window.scrollY + window.innerHeight
        const viewportHeight = window.innerHeight

        // Animation starts when Contact enters viewport
        const animationStart = contactTop + viewportHeight * 0.2 // 20% into viewport
        // Animation completes at 95% through Contact section
        const animationEnd = contactTop + (contactHeight * 0.95)

        let slideValue = -600 // Start hidden behind Careers

        if (scrollPosition >= animationStart && scrollPosition <= animationEnd) {
          // Progressive animation - interpolate from -600 to 0
          const progress = (scrollPosition - animationStart) / (animationEnd - animationStart)
          slideValue = -600 + (progress * 600) // -600 -> 0
        } else if (scrollPosition > animationEnd) {
          slideValue = 0 // Fully visible
          contactAnimationComplete.current = true // Lock it!
          console.log('Contact animation LOCKED at final position')
        }

        setContactSlide(slideValue)
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Contact scroll:', {
            scrollPosition,
            animationStart,
            animationEnd,
            progress: scrollPosition > animationStart ? 
              ((scrollPosition - animationStart) / (animationEnd - animationStart)).toFixed(2) : 0,
            slideValue: slideValue.toFixed(0),
            locked: contactAnimationComplete.current
          })
        }
      })
    }

    window.addEventListener('scroll', handleContactScroll, { passive: true })
    window.addEventListener('resize', handleContactScroll)
    handleContactScroll() // Check initial state

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
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

      <main>
        <section id="hero" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 0 }}>
          <HeroSection />
        </section>
        <div style={{ marginTop: 'calc(100vh - 600px)', position: 'relative', zIndex: 1 }}>
          <AboutAndSafety />

          <div
            className="has-scroll-animation"
            style={{
              position: 'relative',
              transform: `translate3d(0, ${scrollSlide}px, 0)`,
              WebkitTransform: `translate3d(0, ${scrollSlide}px, 0)`,
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              zIndex: 2,
              willChange: 'transform',
              isolation: 'isolate',
            }}
          >
            <CompanyStats />
            <ServicesSection />
            <Portfolio />
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
            style={{
              transform: `translate3d(0, ${contactSlide}px, 0)`,
              WebkitTransform: `translate3d(0, ${contactSlide}px, 0)`,
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Contact />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
