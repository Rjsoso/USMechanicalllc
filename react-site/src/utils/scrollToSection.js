/* global process */

// Global flag to lock animations during navigation (synchronous, not async like sessionStorage)
window.__scrollNavigationLock = false

// Debug helper - only logs in development
const debug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
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

    const attemptScroll = () => {
      const element = document.querySelector(`#${sectionId}`)

      if (element) {
        const rect = element.getBoundingClientRect()

        // Make sure element is actually rendered (has height)
        if (rect.height > 0) {
          // Section-specific offset adjustments for optimal title visibility
          const sectionOffsets = {
            'services': () => {
              const scrollRange = rect.height - window.innerHeight
              return -(scrollRange * 0.7)
            },
            'portfolio': -65,
            'contact': 96,
            'about': 60,
            'safety': 90,
            'hero': 0,
          }
          const offsetEntry = sectionOffsets[sectionId]
          const effectiveOffset = typeof offsetEntry === 'function'
            ? offsetEntry()
            : (offsetEntry ?? headerOffset)
          const targetPosition = (window.scrollY || window.pageYOffset) + rect.top - effectiveOffset

          window.scrollTo({ top: targetPosition, behavior: 'instant' })

          // Release navigation lock after scroll settles
          const lockDuration = sectionId === 'portfolio' ? 800 : 500
          setTimeout(() => {
            window.__scrollNavigationLock = false
          }, lockDuration)

          window.history.pushState(null, '', `/#${sectionId}`)
          resolve(true)
          return true
        }
      }

      // Retry if element not found or not rendered yet
      if (retryCount < maxRetries) {
        retryCount++
        setTimeout(attemptScroll, retryDelay)
      } else {
        resolve(false)
      }
      return false
    }

    requestAnimationFrame(() => attemptScroll())
  })
}

/**
 * Navigate to a section with instant scroll (no animation)
 * @param {string} sectionId - The ID of the section to scroll to (without #)
 * @param {function} navigate - React Router navigate function
 * @param {string} currentPath - Current pathname (default: '/')
 */
export function navigateToSection(sectionId, navigate, currentPath = '/') {
  // If we're on a different page, navigate to home first
  if (currentPath !== '/') {
    navigate('/', { state: { scrollTo: sectionId } })
    return
  }

  // Already on homepage — scroll directly
  window.history.pushState(null, '', `/#${sectionId}`)
  window.__scrollNavigationLock = true

  scrollToSection(sectionId, 180, 50, 100).then(success => {
    debug(`Scroll to ${sectionId} ${success ? 'succeeded' : 'failed'}`)
  })
}
