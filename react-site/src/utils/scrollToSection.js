/* global process */
/**
 * Scrolls to a section with monitoring to handle content loading during scroll
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
          // Section-specific offset adjustments
          const sectionOffsets = {
            'services': 100,    // Services has pt-12, needs less offset
            'portfolio': 120,   // Portfolio has pt-24, needs less offset
            'contact': 180,     // Contact uses default
            'about': 180,
            'safety': 180,
            'careers': 180,
            'hero': 0,
          }
          const effectiveOffset = sectionOffsets[sectionId] || headerOffset

          // Calculate and perform initial scroll
          const scrollToTarget = () => {
            const currentRect = element.getBoundingClientRect()
            const currentScroll = window.scrollY || window.pageYOffset
            const targetPosition = currentScroll + currentRect.top - effectiveOffset
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            })
            
            return targetPosition
          }

          if (process.env.NODE_ENV === 'development') {
            console.log(`Starting monitored scroll to ${sectionId} with ${effectiveOffset}px offset`)
          }

          let lastTargetPosition = scrollToTarget()

          // Monitor the element during scroll to handle content shifts
          let monitorChecks = 0
          const maxMonitorChecks = 20 // Monitor for 2 seconds (20 * 100ms)
          
          const monitorInterval = setInterval(() => {
            monitorChecks++
            
            const currentRect = element.getBoundingClientRect()
            const currentScroll = window.scrollY || window.pageYOffset
            const currentTargetPos = currentScroll + currentRect.top - effectiveOffset
            
            // If target moved significantly (>20px), adjust scroll
            if (Math.abs(currentTargetPos - lastTargetPosition) > 20) {
              if (process.env.NODE_ENV === 'development') {
                console.log(`Target moved by ${Math.abs(currentTargetPos - lastTargetPosition).toFixed(0)}px, adjusting...`)
              }
              lastTargetPosition = scrollToTarget()
            }
            
            // Stop monitoring after max checks
            if (monitorChecks >= maxMonitorChecks) {
              clearInterval(monitorInterval)
              
              // Final position verification after scroll settles
              setTimeout(() => {
                const finalRect = element.getBoundingClientRect()
                const finalScroll = window.scrollY || window.pageYOffset
                const finalTargetPos = finalScroll + finalRect.top - effectiveOffset
                const positionError = Math.abs(finalScroll - finalTargetPos)
                
                // If still off by more than 10px, make final adjustment
                if (positionError > 10) {
                  if (process.env.NODE_ENV === 'development') {
                    console.log(`Final adjustment needed: ${positionError.toFixed(0)}px off`)
                  }
                  window.scrollTo({
                    top: finalTargetPos,
                    behavior: 'smooth',
                  })
                }
                
                if (process.env.NODE_ENV === 'development') {
                  console.log(`✓ Successfully scrolled to section: ${sectionId}`)
                }
                resolve(true)
              }, 300)
            }
          }, 100)

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
 * Navigate to a section with proper scroll behavior with monitoring
 * @param {string} sectionId - The ID of the section to scroll to (without #)
 * @param {function} navigate - React Router navigate function
 * @param {string} currentPath - Current pathname (default: '/')
 */
export function navigateToSection(sectionId, navigate, currentPath = '/') {
  // Section-specific offsets to account for padding
  const sectionOffsets = {
    'services': 100,
    'portfolio': 120,
    'contact': 180,
    'about': 180,
    'safety': 180,
    'careers': 180,
    'hero': 0,
  }
  
  const scrollWithOffsetAndMonitoring = () => {
    const element = document.querySelector(`#${sectionId}`)
    if (!element) return false
    
    const headerOffset = sectionOffsets[sectionId] || 180
    
    // Calculate and perform initial scroll
    const scrollToTarget = () => {
      const rect = element.getBoundingClientRect()
      const targetPosition = window.scrollY + rect.top - headerOffset
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })
      return targetPosition
    }
    
    let lastTargetPosition = scrollToTarget()
    
    // Monitor for content shifts during scroll
    let monitorChecks = 0
    const maxMonitorChecks = 20
    
    const monitorInterval = setInterval(() => {
      monitorChecks++
      
      const rect = element.getBoundingClientRect()
      const currentTargetPos = window.scrollY + rect.top - headerOffset
      
      // Adjust if target moved significantly
      if (Math.abs(currentTargetPos - lastTargetPosition) > 20) {
        lastTargetPosition = scrollToTarget()
      }
      
      // Stop monitoring and do final check
      if (monitorChecks >= maxMonitorChecks) {
        clearInterval(monitorInterval)
        
        setTimeout(() => {
          const finalRect = element.getBoundingClientRect()
          const finalTargetPos = window.scrollY + finalRect.top - headerOffset
          
          if (Math.abs(window.scrollY - finalTargetPos) > 10) {
            window.scrollTo({
              top: finalTargetPos,
              behavior: 'smooth',
            })
          }
        }, 300)
      }
    }, 100)
    
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
      if (scrollWithOffsetAndMonitoring()) {
        sessionStorage.removeItem('scrollTo')
      } else if (retryCount < maxRetries) {
        retryCount++
        setTimeout(attemptScroll, 100)
      }
    }
    setTimeout(attemptScroll, 150)
  } else {
    // Already on home page, scroll with monitoring
    scrollWithOffsetAndMonitoring()
  }
}
