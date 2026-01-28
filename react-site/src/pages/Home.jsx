/* global process */
import { useEffect, useLayoutEffect, useState, Suspense, lazy, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutAndSafety from '../components/AboutAndSafety'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { scrollToSection } from '../utils/scrollToSection'

// Lazy load below-fold components for better initial load performance
const CompanyStats = lazy(() => import('../components/CompanyStats'))
const ServicesSection = lazy(() => import('../components/ServicesSection'))
const Portfolio = lazy(() => import('../components/Portfolio'))
const LogoLoopSection = lazy(() => import('../components/LogoLoopSection'))
const Careers = lazy(() => import('../components/Careers'))
const Contact = lazy(() => import('../pages/Contact'))

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
      const now = Date.now()
      if (now - lastScrollTime < THROTTLE) return
      lastScrollTime = now

      if (rafId) cancelAnimationFrame(rafId)

      rafId = requestAnimationFrame(() => {
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
        }

        setContactSlide(slideValue)
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Contact scroll:', {
            scrollPosition,
            animationStart,
            animationEnd,
            progress: scrollPosition > animationStart ? 
              ((scrollPosition - animationStart) / (animationEnd - animationStart)).toFixed(2) : 0,
            slideValue: slideValue.toFixed(0)
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
            <Suspense fallback={<div className="bg-black" style={{ minHeight: '200px' }}></div>}>
              <CompanyStats />
            </Suspense>

            <Suspense 
              fallback={
                <section 
                  id="services" 
                  className="bg-transparent pt-12 text-center text-white" 
                  style={{ minHeight: '600px' }}
                >
                  <div className="animate-pulse">
                    <div className="mx-auto h-8 w-64 bg-white/10 rounded mb-4"></div>
                    <div className="mx-auto h-4 w-96 bg-white/10 rounded"></div>
                  </div>
                </section>
              }
            >
              <ServicesSection />
            </Suspense>

            <Suspense
              fallback={
                <section 
                  id="portfolio" 
                  className="bg-transparent pt-24 pb-0 text-white" 
                  style={{ minHeight: '700px' }}
                >
                  <div className="animate-pulse text-center">
                    <div className="mx-auto h-10 w-48 bg-white/10 rounded mb-6"></div>
                    <div className="mx-auto h-4 w-80 bg-white/10 rounded"></div>
                  </div>
                </section>
              }
            >
              <Portfolio />
            </Suspense>

            <Suspense fallback={<div className="bg-black" style={{ minHeight: '300px' }}></div>}>
              <LogoLoopSection />
            </Suspense>
          </div>

          <Suspense
            fallback={
              <section 
                id="careers" 
                className="bg-white pt-0 pb-24 text-black" 
                style={{ minHeight: '800px' }}
              >
                <div className="animate-pulse text-center pt-20">
                  <div className="mx-auto h-10 w-64 bg-gray-200 rounded mb-6"></div>
                  <div className="mx-auto h-4 w-96 bg-gray-200 rounded"></div>
                </div>
              </section>
            }
          >
            <div
              style={{
                position: 'relative',
                zIndex: 4,
              }}
            >
              <Careers />
            </div>
          </Suspense>

          <Suspense
            fallback={
              <section
                id="contact"
                className="bg-black py-20 text-white"
                style={{ minHeight: '80vh' }}
              >
                <div className="animate-pulse text-center">
                  <div className="mx-auto h-10 w-72 bg-white/10 rounded mb-6"></div>
                  <div className="mx-auto h-4 w-96 bg-white/10 rounded mb-8"></div>
                  <div className="mx-auto max-w-2xl space-y-4">
                    <div className="h-12 bg-white/10 rounded"></div>
                    <div className="h-12 bg-white/10 rounded"></div>
                    <div className="h-32 bg-white/10 rounded"></div>
                    <div className="h-12 bg-white/10 rounded w-40"></div>
                  </div>
                </div>
              </section>
            }
          >
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
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  )
}
