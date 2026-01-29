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
  const buttonNavigationUsed = useRef(false) // Track if any button navigation happened
  
  // Contact interpolation refs for ultra-smooth motion
  const lastContactSlideRef = useRef(-600)
  const targetContactSlideRef = useRef(-600)
  const contactAnimationFrameRef = useRef(null)
  
  // DEBUG: Track Contact wrapper renders
  useEffect(() => {
    console.warn('[RENDER-DEBUG] Contact wrapper rendered', {
      contactSlide,
      buttonNavigationUsed: buttonNavigationUsed.current,
      hasTransform: !buttonNavigationUsed.current,
      timestamp: Date.now()
    })
  }, [contactSlide])

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
  
  // Listen for lock/unlock events (synchronous)
  useEffect(() => {
    const handleLock = () => {
      // FREEZE contactSlide at 0 - do NOT allow it to change
      setContactSlide(0)
      skipContactAnimationOnce.current = true
      contactAnimationComplete.current = true // Mark as complete to prevent updates
      buttonNavigationUsed.current = true // Permanently disable animation after any button nav
      console.warn('[DEBUG] Contact: Animation LOCKED (event), contactSlide FROZEN at 0')
      console.warn('[BUTTON-NAV] buttonNavigationUsed set to TRUE - animation permanently disabled')
    }
    
    const handleUnlock = () => {
      skipContactAnimationOnce.current = false
      // Keep contactAnimationComplete and buttonNavigationUsed true - animation stays disabled
      console.warn('[DEBUG] Contact: Animation UNLOCKED (event)')
    }
    
    window.addEventListener('lockContactAnimation', handleLock)
    window.addEventListener('unlockContactAnimation', handleUnlock)
    
    return () => {
      window.removeEventListener('lockContactAnimation', handleLock)
      window.removeEventListener('unlockContactAnimation', handleUnlock)
    }
  }, [])
  
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
    
    // Cancel handler for lock event
    const cancelPendingScrollAnimations = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
    
    window.addEventListener('lockContactAnimation', cancelPendingScrollAnimations)

    // Smooth interpolation loop for buttery transforms
    const interpolate = () => {
      // Check lock inside interpolation loop
      if (window.__scrollNavigationLock) return
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
      // Skip scroll animations during navigation (check global flag FIRST - synchronous!)
      if (window.__scrollNavigationLock) {
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
        return
      }
      if (sessionStorage.getItem('scrollNavigationInProgress') === 'true') return
      
      const now = Date.now()
      if (now - lastScrollTime < THROTTLE) return
      lastScrollTime = now

      if (rafId) cancelAnimationFrame(rafId)

      rafId = requestAnimationFrame(() => {
        // Double-check lock inside RAF callback
        if (window.__scrollNavigationLock) return
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

    // Use Intersection Observer to only animate when Safety section is nearby
    const safetySection = document.querySelector('#safety')
    let isNearViewport = true // Start as true to handle initial render
    
    const observer = safetySection ? new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting
        if (!isNearViewport) {
          // Cleanup when section is far from viewport
          if (rafId) cancelAnimationFrame(rafId)
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
        } else {
          handleScroll() // Trigger update when becoming visible
        }
      },
      { threshold: 0, rootMargin: '300px' } // Generous margin for smooth animation
    ) : null
    
    if (observer && safetySection) {
      observer.observe(safetySection)
    }

    // Optimized scroll handler that checks visibility first
    const handleScrollOptimized = () => {
      if (!isNearViewport) return // Skip if section not nearby
      handleScroll()
    }

    window.addEventListener('scroll', handleScrollOptimized, { passive: true })
    window.addEventListener('resize', handleScrollOptimized, { passive: true })
    handleScroll()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (observer) observer.disconnect()
      window.removeEventListener('scroll', handleScrollOptimized)
      window.removeEventListener('resize', handleScrollOptimized)
      window.removeEventListener('lockContactAnimation', cancelPendingScrollAnimations)
    }
  }, [])

  // Contact section progressive slide animation
  useEffect(() => {
    let rafId = null
    let lastScrollTime = 0
    const THROTTLE = 8 // 120fps max - keep high for smooth animation
    let scrollListenerActive = true
    const INTERPOLATION_SPEED = 0.2 // Slightly faster than Stats (0.15) for Contact
    
    // Smooth interpolation loop for ultra-smooth Contact animation
    const interpolateContact = () => {
      if (window.__scrollNavigationLock || buttonNavigationUsed.current) return
      
      const current = lastContactSlideRef.current
      const target = targetContactSlideRef.current
      const diff = target - current

      if (Math.abs(diff) > 0.1) {
        // Smooth interpolation
        const newValue = current + diff * INTERPOLATION_SPEED
        lastContactSlideRef.current = newValue
        setContactSlide(newValue)
        contactAnimationFrameRef.current = requestAnimationFrame(interpolateContact)
      } else {
        // Snap to final value
        lastContactSlideRef.current = target
        setContactSlide(target)
        contactAnimationFrameRef.current = null
      }
    }
    
    const handleContactScroll = () => {
      // DEBUG: Log every scroll event
      console.warn('[SCROLL-EVENT] Fired', {
        buttonNavigationUsed: buttonNavigationUsed.current,
        contactSlide,
        scrollListenerActive,
        timestamp: Date.now()
      })
      
      // Skip scroll animations during navigation (check global flag FIRST - synchronous!)
      if (window.__scrollNavigationLock) {
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
        return
      }
      if (sessionStorage.getItem('scrollNavigationInProgress') === 'true') return
      
      const now = Date.now()
      if (now - lastScrollTime < THROTTLE) return
      lastScrollTime = now

      if (rafId) cancelAnimationFrame(rafId)

      rafId = requestAnimationFrame(() => {
        // Double-check lock inside RAF callback
        if (window.__scrollNavigationLock) {
          if (contactSlide !== 0) setContactSlide(0)
          return
        }
        // If any button navigation was used, permanently disable animation
        if (buttonNavigationUsed.current) {
          if (contactSlide !== 0) {
            setContactSlide(0)
            contactAnimationComplete.current = true
          }
          // Remove scroll listener to stop all processing
          if (scrollListenerActive) {
            window.removeEventListener('scroll', handleContactScroll)
            window.removeEventListener('resize', handleContactScroll)
            scrollListenerActive = false
            console.warn('[LISTENER] Scroll listener REMOVED', {
              contactSlide,
              buttonNavigationUsed: buttonNavigationUsed.current,
              timestamp: Date.now()
            })
          }
          return // Exit early - animation permanently disabled
        }
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

        // Set target and start interpolation for ultra-smooth motion
        targetContactSlideRef.current = slideValue
        if (!contactAnimationFrameRef.current) {
          contactAnimationFrameRef.current = requestAnimationFrame(interpolateContact)
        }
        
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

    // Cancel handler for lock event
    const cancelPendingAnimations = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      if (contactAnimationFrameRef.current) {
        cancelAnimationFrame(contactAnimationFrameRef.current)
        contactAnimationFrameRef.current = null
      }
      console.warn('[DEBUG] Contact: Cancelled pending animation frames')
    }
    
    // Use Intersection Observer to only animate when Contact section is nearby
    const contactSection = document.querySelector('#contact')
    let isNearViewport = true // Start as true to handle initial render
    
    const observer = contactSection ? new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting
        if (!isNearViewport) {
          // Cleanup when section is far from viewport
          if (rafId) cancelAnimationFrame(rafId)
          if (contactAnimationFrameRef.current) cancelAnimationFrame(contactAnimationFrameRef.current)
        } else {
          handleContactScroll() // Trigger update when becoming visible
        }
      },
      { threshold: 0, rootMargin: '400px' } // Large margin for Contact section
    ) : null
    
    if (observer && contactSection) {
      observer.observe(contactSection)
    }

    // Optimized scroll handler that checks visibility first
    const handleContactScrollOptimized = () => {
      if (!isNearViewport) return // Skip if section not nearby
      handleContactScroll()
    }

    window.addEventListener('lockContactAnimation', cancelPendingAnimations)
    window.addEventListener('scroll', handleContactScrollOptimized, { passive: true })
    window.addEventListener('resize', handleContactScrollOptimized, { passive: true })
    handleContactScroll() // Check initial state

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (contactAnimationFrameRef.current) cancelAnimationFrame(contactAnimationFrameRef.current)
      if (observer) observer.disconnect()
      if (scrollListenerActive) {
        window.removeEventListener('scroll', handleContactScrollOptimized)
        window.removeEventListener('resize', handleContactScrollOptimized)
      }
      window.removeEventListener('lockContactAnimation', cancelPendingAnimations)
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
        <section id="hero" style={{ position: 'relative', top: 0, left: 0, width: '100%', zIndex: 0 }}>
          <HeroSection />
        </section>
        <div style={{ marginTop: '100vh', position: 'relative', zIndex: 1 }}>
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
            style={
              buttonNavigationUsed.current
                ? {
                    // No transform - Contact in natural position after button nav
                    position: 'relative',
                    zIndex: 2,
                  }
                : {
                    // Animation active - use smooth sub-pixel values
                    transform: `translate3d(0, ${contactSlide}px, 0)`,
                    WebkitTransform: `translate3d(0, ${contactSlide}px, 0)`,
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    willChange: 'transform',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    contain: 'layout style paint',
                    isolation: 'isolate',
                    position: 'relative',
                    zIndex: 2,
                  }
            }
          >
            <Contact />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
