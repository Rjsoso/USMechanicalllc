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

  // Fetch hero background image from Sanity
  useEffect(() => {
    client
      .fetch(
        `*[_type == "heroSection"][0]{
          _id,
          backgroundImage {
            asset-> {
              _id,
              url
            }
          }
        }`
      )
      .then(data => {
        if (data?.backgroundImage?.asset?.url) {
          const bgUrl = `${data.backgroundImage.asset.url}?w=1920&q=85&auto=format`
          setHeroBackgroundUrl(bgUrl)
        } else if (data?.backgroundImage) {
          const url = urlFor(data.backgroundImage)?.width(1920).quality(85).auto('format').url()
          if (url) setHeroBackgroundUrl(url)
        }
      })
      .catch(error => {
        console.error('Error fetching hero background:', error)
      })
  }, [])

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
  
  // Listen for pre-set scroll slide values (for navigation)
  useEffect(() => {
    const handleSetScrollSlide = (event) => {
      const value = event.detail?.value
      if (typeof value === 'number') {
        setScrollSlide(value)
        lastScrollSlideRef.current = value
        targetScrollSlideRef.current = value
        console.warn(`[DEBUG] Scroll slide preset to ${value}px`)
      }
    }
    
    window.addEventListener('setScrollSlide', handleSetScrollSlide)
    
    return () => {
      window.removeEventListener('setScrollSlide', handleSetScrollSlide)
    }
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
    const INTERPOLATION_SPEED = 0.15 // Match stats animation for consistency
    
    // Smooth interpolation loop for ultra-smooth Contact animation
    const interpolateContact = () => {
      if (window.__scrollNavigationLock) return
      
      const current = lastContactSlideRef.current
      const target = targetContactSlideRef.current
      const diff = target - current

      if (Math.abs(diff) > 1) {
        // Smooth interpolation - using 1px threshold to prevent micro-updates
        const newValue = current + diff * INTERPOLATION_SPEED
        lastContactSlideRef.current = newValue
        setContactSlide(newValue)
        contactAnimationFrameRef.current = requestAnimationFrame(interpolateContact)
      } else {
        // Snap to exact final value when within 1px
        lastContactSlideRef.current = target
        setContactSlide(target)
        contactAnimationFrameRef.current = null
      }
    }
    
    const handleContactScroll = () => {
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
        // Skip calculations during navigation lock
        if (window.__scrollNavigationLock) return
        
        const contactWrapper = document.querySelector('#contact-wrapper')
        if (!contactWrapper) {
          console.log('[Contact] ERROR: Wrapper not found!')
          return
        }

        const rect = contactWrapper.getBoundingClientRect()
        const viewportHeight = window.innerHeight

        // Animate over a LARGE range - start when wrapper is far below viewport
        const animationStartDistance = viewportHeight * 2.5  // Start when 2.5x viewport below (e.g., 2142px)
        const animationEndDistance = 0  // Complete when wrapper reaches top of viewport

        let slideValue = -600 // Default: hidden (top portion behind careers)

        if (rect.top <= animationStartDistance && rect.top >= animationEndDistance) {
          // Progressive animation as wrapper scrolls from far below into viewport
          // Contact slides DOWN from behind careers (-600px → 0px)
          const progress = 1 - (rect.top / animationStartDistance)
          slideValue = -600 + (progress * 600) // -600px -> 0px (slide DOWN to reveal)
        } else if (rect.top < animationEndDistance) {
          slideValue = 0 // Fully visible at natural position
        } else {
          slideValue = -600 // Hidden (top behind careers when scrolled back up)
        }

        // ALWAYS set target, never call setContactSlide directly
        targetContactSlideRef.current = slideValue
        if (!contactAnimationFrameRef.current) {
          contactAnimationFrameRef.current = requestAnimationFrame(interpolateContact)
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
    
    window.addEventListener('lockContactAnimation', cancelPendingAnimations)
    window.addEventListener('scroll', handleContactScroll, { passive: true })
    window.addEventListener('resize', handleContactScroll, { passive: true })
    handleContactScroll() // Check initial state

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (contactAnimationFrameRef.current) cancelAnimationFrame(contactAnimationFrameRef.current)
      window.removeEventListener('scroll', handleContactScroll)
      window.removeEventListener('resize', handleContactScroll)
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
            id="contact-wrapper"
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
