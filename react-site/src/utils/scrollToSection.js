/**
 * Scrolls to a section with retry mechanism
 * @param {string} sectionId - The ID of the section to scroll to (without #)
 * @param {number} headerOffset - Offset for fixed header (default: 180)
 * @param {number} maxRetries - Maximum retry attempts (default: 50)
 * @param {number} retryDelay - Delay between retries in ms (default: 200)
 * @returns {Promise<boolean>} - Resolves to true if successful
 */
export function scrollToSection(sectionId, headerOffset = 180, maxRetries = 50, retryDelay = 200) {
  return new Promise((resolve) => {
    let retryCount = 0;
    
    const attemptScroll = () => {
      const element = document.querySelector(`#${sectionId}`);
      
      if (element) {
        // Element found - check if it's actually visible and has dimensions
        const rect = element.getBoundingClientRect();
        
        // Make sure element is actually rendered (has height)
        if (rect.height > 0) {
          // Use window.scrollY (modern) or fallback to pageYOffset
          const currentScroll = window.scrollY || window.pageYOffset;
          const elementPosition = rect.top;
          const offsetPosition = currentScroll + elementPosition - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          console.log(`Scrolled to section: ${sectionId}`);
          resolve(true);
          return true;
        } else {
          // Element exists but not rendered yet - keep retrying
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(attemptScroll, retryDelay);
          } else {
            console.warn(`Section ${sectionId} found but not rendered after ${maxRetries} attempts`);
            resolve(false);
          }
        }
      } else {
        // Element not found - retry if attempts remaining
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(attemptScroll, retryDelay);
        } else {
          // Max retries reached - give up
          console.warn(`Failed to find section: ${sectionId} after ${maxRetries} attempts`);
          resolve(false);
        }
      }
      
      return false;
    };
    
    // Start first attempt with delay for page to settle
    setTimeout(attemptScroll, 500);
  });
}

/**
 * Navigates to home page and scrolls to a section
 * @param {string} sectionId - The ID of the section to scroll to
 * @param {function} navigate - React Router navigate function
 */
export function navigateAndScroll(sectionId, navigate) {
  // Store the section to scroll to
  sessionStorage.setItem('scrollTo', sectionId);
  
  // Navigate to home page
  navigate('/');
}
