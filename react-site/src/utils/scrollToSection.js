/* global process */

// Global flag to lock animations during navigation (synchronous, not async like sessionStorage)
window.__scrollNavigationLock = false

// Debug helper - only logs in development
const debug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}

const debugWarn = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(...args)
  }
}

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
      debug(`Attempt ${retryCount + 1}/${effectiveMaxRetries} - Looking for #${sectionId}`)

      // Check if we're waiting for a Suspense fallback to complete
      const suspenseFallbacks = document.querySelectorAll('[data-suspense-fallback]')
      if (suspenseFallbacks.length > 0 && isLazySection) {
        debug(`Suspense fallback detected, waiting for lazy components to load...`)
        if (retryCount < effectiveMaxRetries) {
          retryCount++
          setTimeout(attemptScroll, retryDelay)
          return false
        }
      }

      const element = document.querySelector(`#${sectionId}`)

      if (element) {
        // Element found - check if it's actually visible and has dimensions
        const rect = element.getBoundingClientRect()
        
          // Enhanced debug logging for contact section
        if (sectionId === 'contact') {
          debugWarn(`[DEBUG] Contact rect:`, {
            top: rect.top,
            height: rect.height,
            bottom: rect.bottom,
            currentScroll: window.scrollY,
            retryCount: retryCount,
          })
        }
        
        debug(
          `Found #${sectionId} - height: ${rect.height}, top: ${rect.top}, bottom: ${rect.bottom}`
        )

        // Make sure element is actually rendered (has height)
        if (rect.height > 0) {
          // Section-specific offset adjustments for optimal title visibility
          // Precise offsets calculated to position titles at 20-25px from viewport top
          const sectionOffsets = {
            'services': 25,     // pt-12 (48px padding) → title at ~23px from viewport top
            'portfolio': -65,   // Negative offset to scroll past title and show grid prominently
            'contact': 80,      // 80px from top - optimal positioning with correction loop
            'about': 60,        // Adjusted +50px total (10→25→45→60) for optimal logo clearance
            'safety': 90,       // Adjusted +40px total (50→65→80→90) for optimal logo clearance
            'hero': 0,          // full viewport, no adjustment needed
          }
          const effectiveOffset = sectionOffsets[sectionId] || headerOffset

          const currentScroll = window.scrollY || window.pageYOffset
          const targetPosition = currentScroll + rect.top - effectiveOffset

          // Enhanced debug for contact scroll calculation
          if (sectionId === 'contact') {
            debugWarn(`[DEBUG] Contact scroll calculation:`, {
              currentScroll,
              rectTop: rect.top,
              effectiveOffset,
              targetPosition,
              calculation: `${currentScroll} + ${rect.top} - ${effectiveOffset} = ${targetPosition}`
            })
          }

          debug(`Scrolling instantly to ${sectionId} with ${effectiveOffset}px offset`)

          // For contact section, add additional diagnostics
          if (sectionId === 'contact') {
            const beforeScrollY = window.scrollY
            const beforePageHeight = document.documentElement.scrollHeight
            const beforeContactRect = element.getBoundingClientRect()
            
            debugWarn(`[PRE-SCROLL] About to scroll to ${targetPosition}px`, {
              currentScroll: beforeScrollY,
              pageHeight: beforePageHeight,
              contactTop: beforeContactRect.top,
              maxScroll: beforePageHeight - window.innerHeight
            })
          }
          
          // Use instant scroll for immediate, clean navigation
          window.scrollTo({
            top: targetPosition,
            behavior: 'instant',
          })
          
          // For contact section, wait for scroll to settle then apply correction
          if (sectionId === 'contact') {
            // Wait for scroll to settle using stability detection
            let lastScrollY = -1
            let stableFrames = 0
            const requiredStableFrames = 4 // Need 4 consecutive frames to ensure all transforms settled
            
            const checkScrollSettled = () => {
              const currentScrollY = window.scrollY
              
              if (currentScrollY === lastScrollY) {
                stableFrames++
                debugWarn(`[SETTLE] Scroll stable for ${stableFrames} frames at ${currentScrollY}px`)
                
                if (stableFrames >= requiredStableFrames) {
                  // Scroll has settled, now measure and correct
                  const heading = document.querySelector('#contact h1, #contact h2')
                  if (!heading) {
                    debugWarn(`[CORRECTION] Heading not found`)
                    return
                  }
                  
                  const headingRect = heading.getBoundingClientRect()
                  const desiredHeadingPos = 80
                  const correctedTarget = currentScrollY + headingRect.top - desiredHeadingPos
                  
                  debugWarn(`[CORRECTION] Scroll settled, measuring`, {
                    currentHeadingPos: headingRect.top,
                    desiredPos: desiredHeadingPos,
                    currentScroll: currentScrollY,
                    correctedTarget,
                    discrepancy: headingRect.top - desiredHeadingPos
                  })
                  
                  // Only correct if heading is not at desired position
                  if (Math.abs(headingRect.top - desiredHeadingPos) > 10) {
                    debugWarn(`[CORRECTION] Applying correction to ${correctedTarget}px`)
                    window.scrollTo({
                      top: correctedTarget,
                      behavior: 'smooth',
                    })
                    
                    // Verify final position
                    requestAnimationFrame(() => {
                      const finalRect = heading.getBoundingClientRect()
                      debugWarn(`[CORRECTION] Final position: ${finalRect.top}px from top`)
                    })
                  } else {
                    debugWarn(`[CORRECTION] No correction needed, already at ${headingRect.top}px`)
                  }
                  return // Done
                }
              } else {
                // Scroll still moving, reset counter
                stableFrames = 0
                debugWarn(`[SETTLE] Scroll moving: ${lastScrollY}px -> ${currentScrollY}px`)
              }
              
              lastScrollY = currentScrollY
              requestAnimationFrame(checkScrollSettled)
            }
            
            // Start checking after initial scroll initiates
            requestAnimationFrame(checkScrollSettled)
          }
          
          // For contact, verify where we actually landed
          if (sectionId === 'contact') {
            setTimeout(() => {
              const finalScrollY = window.scrollY
              const finalPageHeight = document.documentElement.scrollHeight
              const finalContactRect = element.getBoundingClientRect()
              const heading = document.querySelector('#contact h1, #contact h2')
              const headingTop = heading ? heading.getBoundingClientRect().top : 'not found'
              
              debugWarn(`[POST-SCROLL] Landed at ${finalScrollY}px (target was ${targetPosition}px)`, {
                discrepancy: targetPosition - finalScrollY,
                pageHeight: finalPageHeight,
                contactTop: finalContactRect.top,
                maxScroll: finalPageHeight - window.innerHeight
              })
              
              debugWarn(`[LANDING] Scrolled to ${finalScrollY}px | Contact heading is ${headingTop}px from viewport top`)
            }, 100)
          }
          
          // Release lock and unlock animation for ALL sections after scroll completes
          // Extended delay for portfolio to allow scroll animation to settle
          const lockDuration = sectionId === 'portfolio' ? 800 : 500
          setTimeout(() => {
            sessionStorage.removeItem('scrollNavigationInProgress')
            window.__scrollNavigationLock = false
            window.dispatchEvent(new CustomEvent('unlockContactAnimation'))
            debugWarn(`[DEBUG] Navigation lock released for ${sectionId}`)
          }, lockDuration)

          // Update URL hash to reflect current section
          window.history.pushState(null, '', `/#${sectionId}`)
          
          debug(`✓ Successfully scrolled to section: ${sectionId}`)
          resolve(true)
          return true
        } else {
          // Element exists but not rendered yet - keep retrying
          debug(`Element #${sectionId} found but height is 0, retrying...`)
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
        debug(`Element #${sectionId} not found in DOM, retrying...`)
        if (retryCount < effectiveMaxRetries) {
          retryCount++
          setTimeout(attemptScroll, retryDelay)
        } else {
          // Max retries reached - give up
          if (process.env.NODE_ENV === 'development') {
            console.error(`✗ Failed to find section: ${sectionId} after ${effectiveMaxRetries} attempts`)
            debug(
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
  debug(`navigateAndScroll called with sectionId: ${sectionId}`)

  // Use React Router state to pass the section (more reliable than sessionStorage)
  navigate('/', { state: { scrollTo: sectionId } })
  debug(`Navigated with state: { scrollTo: ${sectionId} }`)
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
    'portfolio': -65,   // Negative offset to scroll past title and show grid prominently
    'contact': 190,     // User-guided: 180→-61.38px, adding +10 more per user observation
    'about': 60,        // Adjusted +50px total (10→25→45→60) for optimal logo clearance
    'safety': 90,       // Adjusted +40px total (50→65→80→90) for optimal logo clearance
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
    // Navigate to home with hash
    navigate(`/#${sectionId}`)
    
    // The hash will be picked up by Home.jsx's useEffect
    // which will handle the scroll with proper timing
  } else {
    // Already on homepage - update hash immediately and scroll
    window.history.pushState(null, '', `/#${sectionId}`)
    
    // Already on home page - use robust scroll with retry mechanism for all sections
    // LOCK ANIMATIONS IMMEDIATELY (synchronous global flag)
    window.__scrollNavigationLock = true
    debugWarn(`[DEBUG] Navigation lock SET for section: ${sectionId}`)
    
    // Dispatch lock event for ALL button navigations to disable Contact animation
    window.dispatchEvent(new CustomEvent('lockContactAnimation'))
    debugWarn(`[DEBUG] lockContactAnimation event dispatched for ${sectionId} navigation`)
    
    // For contact, set flag to skip animation during scroll
    if (sectionId === 'contact') {
      sessionStorage.setItem('scrollNavigationInProgress', 'true')
      
      // Reset contact wrapper transform via DOM for accurate position measurement
      const contactWrapper = document.querySelector('#contact-wrapper')
      if (contactWrapper) {
        contactWrapper.style.transform = 'translate3d(0, 0px, 0)'
        contactWrapper.style.webkitTransform = 'translate3d(0, 0px, 0)'
      }
      
      // Scroll after next paint so the transform reset is applied before measuring
      requestAnimationFrame(() => {
        const headerOffset = sectionOffsets[sectionId] || 180
        scrollToSection(sectionId, headerOffset, 50, 100).then(success => {
          debug(`Contact scroll ${success ? 'succeeded' : 'failed'}`)
        })
      })
    } else if (sectionId === 'portfolio') {
      // For portfolio, pre-calculate scroll animation state to prevent aggressive pop
      // Portfolio is below Safety, so scroll animation should be at max (-300px)
      window.dispatchEvent(new CustomEvent('setScrollSlide', { detail: { value: -300 } }))
      debugWarn(`[DEBUG] Portfolio navigation: Pre-set scroll slide to -300px`)
      
      const headerOffset = sectionOffsets[sectionId] || 180
      scrollToSection(sectionId, headerOffset, 100, 150).then(success => {
        debug(`Same-page scroll to ${sectionId} ${success ? 'succeeded' : 'failed'}`)
        
        // Clear lock after portfolio scroll completes (extended duration)
        setTimeout(() => {
          window.__scrollNavigationLock = false
          debugWarn(`[DEBUG] Navigation lock CLEARED for section: ${sectionId}`)
        }, 800)
      })
    } else {
      // For other non-contact sections, still need to clear lock after scroll
      const headerOffset = sectionOffsets[sectionId] || 180
      scrollToSection(sectionId, headerOffset, 100, 150).then(success => {
        debug(`Same-page scroll to ${sectionId} ${success ? 'succeeded' : 'failed'}`)
        
        // Clear lock after non-contact scroll completes
        setTimeout(() => {
          window.__scrollNavigationLock = false
          debugWarn(`[DEBUG] Navigation lock CLEARED for section: ${sectionId}`)
        }, 500)
      })
    }
  }
}
