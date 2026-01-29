/* global process */

// Global flag to lock animations during navigation (synchronous, not async like sessionStorage)
window.__scrollNavigationLock = false

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
            'portfolio': 42,    // Adjusted -30px (72→42) to move title closer to top
            'contact': 190,     // User-guided: 180→-61.38px, adding +10 more per user observation
            'about': 60,        // Adjusted +50px total (10→25→45→60) for optimal logo clearance
            'safety': 90,       // Adjusted +40px total (50→65→80→90) for optimal logo clearance
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

          // For contact section, add additional diagnostics
          if (sectionId === 'contact') {
            const beforeScrollY = window.scrollY
            const beforePageHeight = document.documentElement.scrollHeight
            const beforeContactRect = element.getBoundingClientRect()
            
            console.warn(`[PRE-SCROLL] About to scroll to ${targetPosition}px`, {
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
                console.warn(`[SETTLE] Scroll stable for ${stableFrames} frames at ${currentScrollY}px`)
                
                if (stableFrames >= requiredStableFrames) {
                  // Scroll has settled, now measure and correct
                  const heading = document.querySelector('#contact h1, #contact h2')
                  if (!heading) {
                    console.warn(`[CORRECTION] Heading not found`)
                    return
                  }
                  
                  const headingRect = heading.getBoundingClientRect()
                  const desiredHeadingPos = 110
                  const correctedTarget = currentScrollY + headingRect.top - desiredHeadingPos
                  
                  console.warn(`[CORRECTION] Scroll settled, measuring`, {
                    currentHeadingPos: headingRect.top,
                    desiredPos: desiredHeadingPos,
                    currentScroll: currentScrollY,
                    correctedTarget,
                    discrepancy: headingRect.top - desiredHeadingPos
                  })
                  
                  // Only correct if heading is not at desired position
                  if (Math.abs(headingRect.top - desiredHeadingPos) > 10) {
                    console.warn(`[CORRECTION] Applying correction to ${correctedTarget}px`)
                    window.scrollTo({
                      top: correctedTarget,
                      behavior: 'instant',
                    })
                    
                    // Verify final position
                    requestAnimationFrame(() => {
                      const finalRect = heading.getBoundingClientRect()
                      console.warn(`[CORRECTION] Final position: ${finalRect.top}px from top`)
                    })
                  } else {
                    console.warn(`[CORRECTION] No correction needed, already at ${headingRect.top}px`)
                  }
                  return // Done
                }
              } else {
                // Scroll still moving, reset counter
                stableFrames = 0
                console.warn(`[SETTLE] Scroll moving: ${lastScrollY}px -> ${currentScrollY}px`)
              }
              
              lastScrollY = currentScrollY
              requestAnimationFrame(checkScrollSettled)
            }
            
            // Start checking after initial scroll initiates
            requestAnimationFrame(checkScrollSettled)
          }
          
          // For careers section, wait for scroll to settle then apply correction
          if (sectionId === 'careers') {
            // Wait for scroll to settle using stability detection
            let lastScrollY = -1
            let stableFrames = 0
            const requiredStableFrames = 2 // Need 2 consecutive frames with same scrollY
            
            const checkScrollSettled = () => {
              const currentScrollY = window.scrollY
              
              if (currentScrollY === lastScrollY) {
                stableFrames++
                console.warn(`[SETTLE-CAREERS] Scroll stable for ${stableFrames} frames at ${currentScrollY}px`)
                
                if (stableFrames >= requiredStableFrames) {
                  // Scroll has settled, now measure and correct
                  const heading = document.querySelector('#careers h2')
                  if (!heading) {
                    console.warn(`[CORRECTION-CAREERS] Heading not found`)
                    return
                  }
                  
                  const headingRect = heading.getBoundingClientRect()
                  const desiredHeadingPos = 70
                  const correctedTarget = currentScrollY + headingRect.top - desiredHeadingPos
                  
                  console.warn(`[CORRECTION-CAREERS] Scroll settled, measuring`, {
                    currentHeadingPos: headingRect.top,
                    desiredPos: desiredHeadingPos,
                    currentScroll: currentScrollY,
                    correctedTarget,
                    discrepancy: headingRect.top - desiredHeadingPos
                  })
                  
                  // Only correct if heading is not at desired position
                  if (Math.abs(headingRect.top - desiredHeadingPos) > 10) {
                    console.warn(`[CORRECTION-CAREERS] Applying correction to ${correctedTarget}px`)
                    window.scrollTo({
                      top: correctedTarget,
                      behavior: 'instant',
                    })
                    
                    // Verify final position
                    requestAnimationFrame(() => {
                      const finalRect = heading.getBoundingClientRect()
                      console.warn(`[CORRECTION-CAREERS] Final position: ${finalRect.top}px from top`)
                    })
                  } else {
                    console.warn(`[CORRECTION-CAREERS] No correction needed, already at ${headingRect.top}px`)
                  }
                  return // Done
                }
              } else {
                // Scroll still moving, reset counter
                stableFrames = 0
                console.warn(`[SETTLE-CAREERS] Scroll moving: ${lastScrollY}px -> ${currentScrollY}px`)
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
              
              console.warn(`[POST-SCROLL] Landed at ${finalScrollY}px (target was ${targetPosition}px)`, {
                discrepancy: targetPosition - finalScrollY,
                pageHeight: finalPageHeight,
                contactTop: finalContactRect.top,
                maxScroll: finalPageHeight - window.innerHeight
              })
              
              console.warn(`[LANDING] Scrolled to ${finalScrollY}px | Contact heading is ${headingTop}px from viewport top`)
            }, 100)
          }
          
          // Release lock and unlock animation for ALL sections after scroll completes
          setTimeout(() => {
            sessionStorage.removeItem('scrollNavigationInProgress')
            window.__scrollNavigationLock = false
            window.dispatchEvent(new CustomEvent('unlockContactAnimation'))
            console.warn(`[DEBUG] Navigation lock released for ${sectionId}`)
          }, 500) // Extended delay to ensure all scroll events have settled

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
    'portfolio': 42,    // Adjusted -30px (72→42) to move title closer to top
    'contact': 190,     // User-guided: 180→-61.38px, adding +10 more per user observation
    'about': 60,        // Adjusted +50px total (10→25→45→60) for optimal logo clearance
    'safety': 90,       // Adjusted +40px total (50→65→80→90) for optimal logo clearance
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
    // LOCK ANIMATIONS IMMEDIATELY (synchronous global flag)
    window.__scrollNavigationLock = true
    console.warn(`[DEBUG] Navigation lock SET for section: ${sectionId}`)
    
    // Dispatch lock event for ALL button navigations to disable Contact animation
    window.dispatchEvent(new CustomEvent('lockContactAnimation'))
    console.warn(`[DEBUG] lockContactAnimation event dispatched for ${sectionId} navigation`)
    
    // For contact, set flag to skip animation during scroll
    if (sectionId === 'contact') {
      sessionStorage.setItem('skipContactAnimation', 'true')
      sessionStorage.setItem('scrollNavigationInProgress', 'true')
      
      // Diagnostic: Log section heights at button click
      const sections = ['hero', 'about', 'services', 'portfolio', 'careers', 'contact'].map(id => {
        const el = document.querySelector(`#${id}`)
        return `${id}: ${el ? el.offsetHeight + 'px' : 'NOT FOUND'}`
      }).join(', ')
      console.warn(`[DIAG] Page height: ${document.documentElement.scrollHeight}px | Sections: ${sections}`)
      console.warn(`[DEBUG] Contact navigation: Dispatched lock event, waiting for React to flush state...`)
      
      // Wait longer for React to flush the setContactSlide(0) state update to DOM
      setTimeout(() => {
        // Verify BOTH transforms are at 0 before scrolling
        const contactWrapper = document.querySelector('#contact')?.parentElement
        const scrollAnimWrapper = document.querySelector('.has-scroll-animation')
        
        let contactTransform = 'not found'
        let scrollTransform = 'not found'
        
        if (contactWrapper) {
          contactTransform = window.getComputedStyle(contactWrapper).transform
        }
        if (scrollAnimWrapper) {
          scrollTransform = window.getComputedStyle(scrollAnimWrapper).transform
        }
        
        console.warn(`[DEBUG] Transforms after React flush:`, {
          contactWrapper: contactTransform,
          scrollAnimWrapper: scrollTransform
        })
        
        const headerOffset = sectionOffsets[sectionId] || 180
        console.warn(`[DEBUG] Contact navigation: Starting scroll with offset ${headerOffset}`)
        scrollToSection(sectionId, headerOffset, 100, 150).then(success => {
          console.warn(`[DEBUG] Contact scroll ${success ? 'succeeded' : 'failed'}`)
        })
      }, 300) // Increased from 150ms to 300ms to ensure React has time to flush state
    } else {
      // For non-contact sections, still need to clear lock after scroll
      const headerOffset = sectionOffsets[sectionId] || 180
      scrollToSection(sectionId, headerOffset, 100, 150).then(success => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Same-page scroll to ${sectionId} ${success ? 'succeeded' : 'failed'}`)
        }
        
        // Clear lock after non-contact scroll completes
        setTimeout(() => {
          window.__scrollNavigationLock = false
          console.warn(`[DEBUG] Navigation lock CLEARED for section: ${sectionId}`)
        }, 500)
      })
    }
  }
}
