/* global process */
/**
 * Scrolls to a section with retry mechanism
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
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NODE_ENV === 'development')
          console.log(`Attempt ${retryCount + 1}/${maxRetries} - Looking for #${sectionId}`)
      }
      const element = document.querySelector(`#${sectionId}`)

      if (element) {
        // Element found - check if it's actually visible and has dimensions
        const rect = element.getBoundingClientRect()
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development')
            console.log(
              `Found #${sectionId} - height: ${rect.height}, top: ${rect.top}, bottom: ${rect.bottom}`
            )
        }

        // Make sure element is actually rendered (has height)
        if (rect.height > 0) {
          // Special handling for contact section - scroll to bottom of page
          if (sectionId === 'contact') {
            // Get total page height
            const pageHeight = document.documentElement.scrollHeight
            const windowHeight = window.innerHeight

            if (process.env.NODE_ENV === 'development') {
              if (process.env.NODE_ENV === 'development')
                console.log(`Scrolling to contact (bottom of page): ${pageHeight - windowHeight}`)
            }

            window.scrollTo({
              top: pageHeight - windowHeight,
              behavior: 'smooth',
            })
          } else {
            // Normal scroll for other sections
            const currentScroll = window.scrollY || window.pageYOffset
            const elementPosition = rect.top
            const offsetPosition = currentScroll + elementPosition - headerOffset

            if (process.env.NODE_ENV === 'development') {
              if (process.env.NODE_ENV === 'development')
                console.log(`Scrolling to ${sectionId}: ${offsetPosition}`)
            }

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            })
          }

          if (process.env.NODE_ENV === 'development') {
            if (process.env.NODE_ENV === 'development')
              console.log(`✓ Successfully scrolled to section: ${sectionId}`)
          }
          resolve(true)
          return true
        } else {
          // Element exists but not rendered yet - keep retrying
          if (process.env.NODE_ENV === 'development') {
            if (process.env.NODE_ENV === 'development')
              console.log(`Element #${sectionId} found but height is 0, retrying...`)
          }
          if (retryCount < maxRetries) {
            retryCount++
            setTimeout(attemptScroll, retryDelay)
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.error(
                `✗ Section ${sectionId} found but not rendered after ${maxRetries} attempts`
              )
            }
            resolve(false)
          }
        }
      } else {
        // Element not found - retry if attempts remaining
        if (process.env.NODE_ENV === 'development') {
          if (process.env.NODE_ENV === 'development')
            console.log(`Element #${sectionId} not found in DOM, retrying...`)
        }
        if (retryCount < maxRetries) {
          retryCount++
          setTimeout(attemptScroll, retryDelay)
        } else {
          // Max retries reached - give up
          if (process.env.NODE_ENV === 'development') {
            console.error(`✗ Failed to find section: ${sectionId} after ${maxRetries} attempts`)
            if (process.env.NODE_ENV === 'development')
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

    // Start first attempt with delay for page to settle
    setTimeout(attemptScroll, 500)
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
