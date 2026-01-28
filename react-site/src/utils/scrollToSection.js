/* global process */
/**
 * Scrolls to a section with instant behavior (no animation)
 * @param {string} sectionId - The ID of the section to scroll to (without #)
 * @param {number} headerOffset - Offset for fixed header (default: 180)
 * @param {number} maxRetries - Maximum retry attempts (default: 50)
 * @param {number} retryDelay - Delay between retries in ms (default: 200)
 * @returns {Promise<boolean>} - Resolves to true if successful
 */
export function scrollToSection(sectionId, headerOffset = 180, maxRetries = 50, retryDelay = 200) {
  return new Promise(resolve => {
    let retryCount = 0

    // Enhanced retry parameters for lazy-loaded components like contact
    const isLazySection = sectionId === 'contact'
    const effectiveMaxRetries = isLazySection ? Math.max(maxRetries, 100) : maxRetries

    const attemptScroll = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Attempt ${retryCount + 1}/${effectiveMaxRetries} - Looking for #${sectionId}`)
      }

      // Check if we're waiting for a Suspense fallback to complete
      const suspenseFallbacks = document.querySelectorAll('[data-suspense-fallback]')
      if (suspenseFallbacks.length > 0 && isLazySection) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Suspense fallback detected, waiting for lazy components to load...`)
        }
        if (retryCount < effectiveMaxRetries) {
          retryCount++
          setTimeout(attemptScroll, retryDelay)
          return false
        }
      }

      const element = document.querySelector(`#${sectionId}`)

      if (element) {
        // For contact section with animation transform, verify it's at 0 before scrolling
        if (sectionId === 'contact') {
          const parentElement = element.parentElement
          if (parentElement) {
            const computedStyle = window.getComputedStyle(parentElement)
            const transform = computedStyle.transform
            console.warn(`[DEBUG] Contact transform check: ${transform}`)
            
            // Check if transform is at identity (no translation)
            // transform will be "none" or "matrix(1, 0, 0, 1, 0, 0)" when at 0
            if (transform !== 'none' && transform !== 'matrix(1, 0, 0, 1, 0, 0)') {
              console.warn(`[DEBUG] Contact transform not ready, retrying... (current: ${transform})`)
              if (retryCount < effectiveMaxRetries) {
                retryCount++
                setTimeout(attemptScroll, retryDelay)
                return false
              }
            } else {
              console.warn(`[DEBUG] Contact transform ready: ${transform}`)
            }
          }
        }

        // Element found - check if it's actually visible and has dimensions
        const rect = element.getBoundingClientRect()
        
          // Enhanced debug logging for contact section
        if (sectionId === 'contact') {
          console.warn(`[DEBUG] Contact rect:`, {
            top: rect.top,
            height: rect.height,
            bottom: rect.bottom,
            currentScroll: window.scrollY,
            retryCount: retryCount,
          })
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `Found #${sectionId} - height: ${rect.height}, top: ${rect.top}, bottom: ${rect.bottom}`
          )
        }

        // Make sure element is actually rendered (has height)
        if (rect.height > 0) {
          // For contact section, verify position stability
          if (sectionId === 'contact') {
            // Store position from previous check
            if (!attemptScroll.lastContactTop) {
              attemptScroll.lastContactTop = rect.top
              attemptScroll.lastContactHeight = rect.height
              console.warn(`[DEBUG] Contact: First position check, storing baseline`)
              if (retryCount < effectiveMaxRetries) {
                retryCount++
                setTimeout(attemptScroll, retryDelay)
                return false
              }
            }
            
            // Check if position has stabilized
            const topDiff = Math.abs(rect.top - attemptScroll.lastContactTop)
            const heightDiff = Math.abs(rect.height - attemptScroll.lastContactHeight)
            
            if (topDiff > 5 || heightDiff > 10) {
              // Position still changing - content still loading
              console.warn(`[DEBUG] Contact position unstable, retrying...`, {
                topDiff,
                heightDiff,
                previousTop: attemptScroll.lastContactTop,
                currentTop: rect.top,
                previousHeight: attemptScroll.lastContactHeight,
                currentHeight: rect.height
              })
              attemptScroll.lastContactTop = rect.top
              attemptScroll.lastContactHeight = rect.height
              if (retryCount < effectiveMaxRetries) {
                retryCount++
                setTimeout(attemptScroll, retryDelay)
                return false
              }
            } else {
              console.warn(`[DEBUG] Contact position stable, proceeding with scroll`)
            }
          }
          
          // Section-specific offset adjustments for optimal title visibility
          // Precise offsets calculated to position titles at 20-25px from viewport top
          const sectionOffsets = {
            'services': 25,     // pt-12 (48px padding) → title at ~23px from viewport top
            'portfolio': 72,    // pt-24 (96px padding) → title at ~24px from viewport top
            'contact': 170,     // Calibrated: 165→-76.5px, 185→+309px, ratio 19.275px/unit, target +20px
            'about': 10,        // py-20 but title near top → title at ~20px from viewport top
            'safety': 10,       // same structure as about → title at ~20px from viewport top
            'careers': 328,     // pt-8 (32px) + negative margin -20rem (320px) = 352px, adjusted to ~328px for 20-25px from top
            'hero': 0,          // full viewport, no adjustment needed
          }
          const effectiveOffset = sectionOffsets[sectionId] || headerOffset

          const currentScroll = window.scrollY || window.pageYOffset
          const targetPosition = currentScroll + rect.top - effectiveOffset

          // Enhanced debug for contact scroll calculation
          if (sectionId === 'contact') {
            console.warn(`[DEBUG] Contact scroll calculation:`, {
              currentScroll,
              rectTop: rect.top,
              effectiveOffset,
              targetPosition,
              calculation: `${currentScroll} + ${rect.top} - ${effectiveOffset} = ${targetPosition}`
            })
          }

          if (process.env.NODE_ENV === 'development') {
            console.log(`Scrolling instantly to ${sectionId} with ${effectiveOffset}px offset`)
          }

          // Use instant scroll for immediate, clean navigation
          window.scrollTo({
            top: targetPosition,
            behavior: 'instant',
          })
          
          // For contact, verify where we actually landed
          if (sectionId === 'contact') {
            setTimeout(() => {
              const finalScrollY = window.scrollY
              const heading = document.querySelector('#contact h1, #contact h2')
              const headingTop = heading ? heading.getBoundingClientRect().top : 'not found'
              console.warn(`[LANDING] Scrolled to ${finalScrollY}px | Contact heading is ${headingTop}px from viewport top`)
            }, 100)
          }

          if (process.env.NODE_ENV === 'development') {
            console.log(`✓ Successfully scrolled to section: ${sectionId}`)
          }
          resolve(true)
          return true
        } else {
          // Element exists but not rendered yet - keep retrying
          if (process.env.NODE_ENV === 'development') {
            console.log(`Element #${sectionId} found but height is 0, retrying...`)
          }
          if (retryCount < effectiveMaxRetries) {
            retryCount++
            setTimeout(attemptScroll, retryDelay)
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.error(
                `✗ Section ${sectionId} found but not rendered after ${effectiveMaxRetries} attempts`
              )
            }
            resolve(false)
          }
        }
      } else {
        // Element not found - retry if attempts remaining
        if (process.env.NODE_ENV === 'development') {
          console.log(`Element #${sectionId} not found in DOM, retrying...`)
        }
        if (retryCount < effectiveMaxRetries) {
          retryCount++
          setTimeout(attemptScroll, retryDelay)
        } else {
          // Max retries reached - give up
          if (process.env.NODE_ENV === 'development') {
            console.error(`✗ Failed to find section: ${sectionId} after ${effectiveMaxRetries} attempts`)
            console.log(
              'Available sections:',
              Array.from(document.querySelectorAll('[id]')).map(el => el.id)
            )
          }
          resolve(false)
        }
      }

      return false
    }

    // Start first attempt immediately with requestAnimationFrame for faster execution
    requestAnimationFrame(() => attemptScroll())
  })
}

/**
 * Navigates to home page and scrolls to a section
 * @param {string} sectionId - The ID of the section to scroll to
 * @param {function} navigate - React Router navigate function
 */
export function navigateAndScroll(sectionId, navigate) {
  if (process.env.NODE_ENV === 'development') {
    if (process.env.NODE_ENV === 'development')
      console.log(`navigateAndScroll called with sectionId: ${sectionId}`)
  }

  // Use React Router state to pass the section (more reliable than sessionStorage)
  navigate('/', { state: { scrollTo: sectionId } })
  if (process.env.NODE_ENV === 'development') {
    if (process.env.NODE_ENV === 'development')
      console.log(`Navigated with state: { scrollTo: ${sectionId} }`)
  }
}

/**
 * Navigate to a section with instant scroll (no animation)
 * @param {string} sectionId - The ID of the section to scroll to (without #)
 * @param {function} navigate - React Router navigate function
 * @param {string} currentPath - Current pathname (default: '/')
 */
export function navigateToSection(sectionId, navigate, currentPath = '/') {
  // Section-specific offsets for optimal title visibility
  // Precise offsets calculated to position titles at 20-25px from viewport top
  const sectionOffsets = {
    'services': 25,     // pt-12 (48px padding) → title at ~23px from viewport top
    'portfolio': 72,    // pt-24 (96px padding) → title at ~24px from viewport top
    'contact': 170,     // Calibrated: 165→-76.5px, 185→+309px, ratio 19.275px/unit, target +20px
    'about': 10,        // py-20 but title near top → title at ~20px from viewport top
    'safety': 10,       // same structure as about → title at ~20px from viewport top
    'careers': 328,     // pt-8 (32px) + negative margin -20rem (320px) = 352px, adjusted to ~328px for 20-25px from top
    'hero': 0,          // full viewport, no adjustment needed
  }
  
  const scrollWithInstant = () => {
    const element = document.querySelector(`#${sectionId}`)
    if (!element) return false
    
    const headerOffset = sectionOffsets[sectionId] || 180
    const rect = element.getBoundingClientRect()
    const targetPosition = window.scrollY + rect.top - headerOffset
    
    // Use instant scroll for immediate, clean navigation
    window.scrollTo({
      top: targetPosition,
      behavior: 'instant',
    })
    
    return true
  }

  // If we're on a different page, navigate to home first
  if (currentPath !== '/') {
    sessionStorage.setItem('scrollTo', sectionId)
    navigate('/')

    // Retry mechanism for lazy-loaded sections
    let retryCount = 0
    const maxRetries = 20
    const attemptScroll = () => {
      if (scrollWithInstant()) {
        sessionStorage.removeItem('scrollTo')
      } else if (retryCount < maxRetries) {
        retryCount++
        setTimeout(attemptScroll, 100)
      }
    }
    setTimeout(attemptScroll, 150)
  } else {
    // Already on home page - use robust scroll with retry mechanism for all sections
    // For contact, set flag to skip animation during scroll
    if (sectionId === 'contact') {
      sessionStorage.setItem('skipContactAnimation', 'true')
      
      // Diagnostic: Log section heights at button click
      const sections = ['hero', 'about', 'services', 'portfolio', 'careers', 'contact'].map(id => {
        const el = document.querySelector(`#${id}`)
        return `${id}: ${el ? el.offsetHeight + 'px' : 'NOT FOUND'}`
      }).join(', ')
      console.warn(`[DIAG] Page height: ${document.documentElement.scrollHeight}px | Sections: ${sections}`)
      
      setTimeout(() => {
        const headerOffset = sectionOffsets[sectionId] || 180
        scrollToSection(sectionId, headerOffset, 100, 150).then(success => {
          console.warn(`[DEBUG] Contact scroll ${success ? 'succeeded' : 'failed'}`)
        })
      }, 150)
    } else {
      const headerOffset = sectionOffsets[sectionId] || 180
      scrollToSection(sectionId, headerOffset, 100, 150).then(success => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Same-page scroll to ${sectionId} ${success ? 'succeeded' : 'failed'}`)
        }
      })
    }
  }
}
