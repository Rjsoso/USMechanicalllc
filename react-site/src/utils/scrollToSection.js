/**
 * Scrolls to a section with retry mechanism
 * @param {string} sectionId - The ID of the section to scroll to (without #)
 * @param {number} headerOffset - Offset for fixed header (default: 180)
 * @param {number} maxRetries - Maximum retry attempts (default: 30)
 * @param {number} retryDelay - Delay between retries in ms (default: 200)
 * @returns {Promise<boolean>} - Resolves to true if successful
 */
export function scrollToSection(sectionId, headerOffset = 180, maxRetries = 30, retryDelay = 200) {
  return new Promise((resolve) => {
    let retryCount = 0;
    
    const attemptScroll = () => {
      const element = document.querySelector(`#${sectionId}`);
      
      if (element) {
        // Element found - scroll to it
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        resolve(true);
        return true;
      }
      
      // Element not found - retry if attempts remaining
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(attemptScroll, retryDelay);
      } else {
        // Max retries reached - give up
        console.warn(`Failed to scroll to section: ${sectionId} after ${maxRetries} attempts`);
        resolve(false);
      }
      
      return false;
    };
    
    // Start first attempt with small delay for page to settle
    setTimeout(attemptScroll, 300);
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
