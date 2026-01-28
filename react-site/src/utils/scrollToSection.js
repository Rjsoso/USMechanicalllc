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
        // Element found - check if it's actually visible and has dimensions
        const rect = element.getBoundingClientRect()
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `Found #${sectionId} - height: ${rect.height}, top: ${rect.top}, bottom: ${rect.bottom}`
          )
        }

        // Make sure element is actually rendered (has height)
        if (rect.height > 0) {
          // Section-specific offset adjustments for optimal title visibility
          // Precise offsets calculated to position titles at 20-25px from viewport top
          const sectionOffsets = {
            'services': 25,     // pt-12 (48px padding) → title at ~23px from viewport top
            'portfolio': 72,    // pt-24 (96px padding) → title at ~24px from viewport top
            'contact': -60,     // py-20 (80px padding) - negative offset to scroll INTO section → title at ~20px from top
            'about': 10,        // py-20 but title near top → title at ~20px from viewport top
            'safety': 10,       // same structure as about → title at ~20px from viewport top
            'careers': 328,     // pt-8 (32px) + negative margin -20rem (320px) = 352px, adjusted to ~328px for 20-25px from top
            'hero': 0,          // full viewport, no adjustment needed
          }
          const effectiveOffset = sectionOffsets[sectionId] || headerOffset

          const currentScroll = window.scrollY || window.pageYOffset
          const targetPosition = currentScroll + rect.top - effectiveOffset

          if (process.env.NODE_ENV === 'development') {
            console.log(`Scrolling instantly to ${sectionId} with ${effectiveOffset}px offset`)
          }

          // Use instant scroll for immediate, clean navigation
          window.scrollTo({
            top: targetPosition,
            behavior: 'instant',
          })

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
    'contact': -60,     // py-20 (80px padding) - negative offset to scroll INTO section → title at ~20px from top
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
    // Already on home page - use robust scroll with retry mechanism
    if (sectionId === 'contact') {
      // Flag to skip Contact animation
      sessionStorage.setItem('skipContactAnimation', 'true')
      
      // Give React time to process the animation skip (check Home.jsx useLayoutEffect)
      // This ensures contactSlide is set to 0 before we calculate scroll position
      setTimeout(() => {
        const headerOffset = sectionOffsets[sectionId] || 180
        scrollToSection(sectionId, headerOffset, 100, 150).then(success => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Same-page scroll to ${sectionId} ${success ? 'succeeded' : 'failed'}`)
          }
        })
      }, 100) // 100ms delay for animation state to update
    } else {
      // For other sections, scroll immediately
      const headerOffset = sectionOffsets[sectionId] || 180
      scrollToSection(sectionId, headerOffset, 100, 150).then(success => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Same-page scroll to ${sectionId} ${success ? 'succeeded' : 'failed'}`)
        }
      })
    }
  }
}
