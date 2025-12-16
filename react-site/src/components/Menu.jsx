import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Menu({ items = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLightBackground, setIsLightBackground] = useState(false)
  const menuButtonRef = useRef(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    // Prevent body scroll when menu is open
    if (!isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  const closeMenu = () => {
    setIsOpen(false)
    document.body.style.overflow = ''
  }

  const handleMenuItemClick = (link) => {
    closeMenu()
    // Smooth scroll to section
    const element = document.querySelector(link)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Detect background color behind menu button with improved accuracy
  useEffect(() => {
    let timeoutId = null
    let rafId = null
    let lastState = false
    
    const getBackgroundLuminance = (element) => {
      if (!element) return null
      
      let currentElement = element
      let maxDepth = 10 // Limit depth to prevent infinite loops
      let depth = 0

      while (currentElement && currentElement !== document.body && depth < maxDepth) {
        depth++
        const computedStyle = window.getComputedStyle(currentElement)
        const bgColor = computedStyle.backgroundColor
        
        // Check for background classes first (more reliable)
        if (currentElement.classList) {
          const classes = Array.from(currentElement.classList)
          if (classes.some(cls => cls.includes('bg-gray-200') || cls.includes('bg-white') || cls.includes('bg-gray-100') || cls.includes('bg-gray-50'))) {
            return 0.8 // Light background
          }
          if (classes.some(cls => cls.includes('bg-gray-700') || cls.includes('bg-gray-800') || cls.includes('bg-gray-900') || cls.includes('bg-black'))) {
            return 0.2 // Dark background
          }
        }

        // Check computed background color
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          const rgbMatch = bgColor.match(/\d+/g)
          if (rgbMatch && rgbMatch.length >= 3) {
            const r = parseInt(rgbMatch[0])
            const g = parseInt(rgbMatch[1])
            const b = parseInt(rgbMatch[2])
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
            // Only return if luminance is clearly light or dark (avoid mid-tones)
            if (luminance > 0.6) return luminance // Clearly light
            if (luminance < 0.4) return luminance // Clearly dark
          }
        }

        // Check if it's a section element
        if (currentElement.tagName === 'SECTION') {
          const sectionStyle = window.getComputedStyle(currentElement)
          const sectionBg = sectionStyle.backgroundColor
          if (sectionBg && sectionBg !== 'rgba(0, 0, 0, 0)' && sectionBg !== 'transparent') {
            const rgbMatch = sectionBg.match(/\d+/g)
            if (rgbMatch && rgbMatch.length >= 3) {
              const r = parseInt(rgbMatch[0])
              const g = parseInt(rgbMatch[1])
              const b = parseInt(rgbMatch[2])
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
              if (luminance > 0.5) return luminance
              if (luminance < 0.5) return luminance
            }
          }
        }

        currentElement = currentElement.parentElement
      }
      
      return null
    }

    const checkBackground = () => {
      if (!menuButtonRef.current) return

      const buttonRect = menuButtonRef.current.getBoundingClientRect()
      const buttonCenterY = buttonRect.top + buttonRect.height / 2
      const buttonCenterX = buttonRect.left + buttonRect.width / 2

      // Sample multiple points for more accurate detection
      const samplePoints = [
        { x: buttonCenterX, y: buttonCenterY },
        { x: buttonRect.left + 5, y: buttonRect.top + 5 },
        { x: buttonRect.right - 5, y: buttonRect.bottom - 5 },
      ]

      const luminances = []
      for (const point of samplePoints) {
        const elementBelow = document.elementFromPoint(point.x, point.y)
        if (elementBelow) {
          const luminance = getBackgroundLuminance(elementBelow)
          if (luminance !== null) {
            luminances.push(luminance)
          }
        }
      }

      // Determine if light or dark based on average luminance
      let isLight = false
      if (luminances.length > 0) {
        const avgLuminance = luminances.reduce((a, b) => a + b, 0) / luminances.length
        isLight = avgLuminance > 0.5
      } else {
        // Default to dark if no background detected
        isLight = false
      }

      // Use hysteresis to prevent flickering - only change if significantly different
      const threshold = 0.15 // Require 15% difference to change state
      const shouldChange = lastState 
        ? (isLight && !lastState) // Changing to light
        : (!isLight && lastState) // Changing to dark
      
      // Only update if change is significant or if we're confident
      if (shouldChange || luminances.length >= 2) {
        setIsLightBackground(isLight)
        lastState = isLight
      }
    }

    // Throttled check function
    const throttledCheck = () => {
      if (rafId) return
      
      rafId = requestAnimationFrame(() => {
        checkBackground()
        rafId = null
      })
    }

    // Debounced check for scroll end
    const debouncedCheck = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        checkBackground()
      }, 100)
    }

    // Initial check
    checkBackground()

    // Use throttled check for scroll, debounced for scroll end
    window.addEventListener('scroll', throttledCheck, { passive: true })
    window.addEventListener('scroll', debouncedCheck, { passive: true })
    window.addEventListener('resize', debouncedCheck, { passive: true })

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', throttledCheck)
      window.removeEventListener('scroll', debouncedCheck)
      window.removeEventListener('resize', debouncedCheck)
    }
  }, [])

  return (
    <>
      {/* Menu Button - Fixed Floating */}
      <button
        ref={menuButtonRef}
        onClick={toggleMenu}
        className={`fixed top-6 right-6 z-50 px-6 py-3 flex items-center justify-center transition-all duration-300 overflow-hidden menu-glass relative ${isLightBackground ? 'menu-glass-light' : 'menu-glass-dark'}`}
        style={{ position: 'fixed' }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <span className={`text-xl md:text-2xl font-bold tracking-wide relative z-10 transition-colors duration-300 ${isLightBackground ? 'text-gray-900' : 'text-white'}`}>
          MENU
        </span>
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      {/* Slide-in Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-white z-50 shadow-2xl overflow-y-auto"
          >
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeMenu}
                className="w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <nav className="px-8 py-12">
              <ul className="space-y-6">
                {items.map((item, index) => (
                  <motion.li
                    key={item.link || index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <button
                      onClick={() => handleMenuItemClick(item.link)}
                      className="text-2xl md:text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 w-full text-left"
                      aria-label={item.ariaLabel || item.label}
                    >
                      {item.label}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glass surface styling for menu button - Floating Effect with Adaptive Colors */}
      <style>{`
        .menu-glass {
          position: fixed !important;
          top: 24px !important;
          right: 24px !important;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        /* Dark background variant (default - for dark sections) */
        .menu-glass-dark {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px) saturate(1.8) brightness(1.25);
          -webkit-backdrop-filter: blur(20px) saturate(1.8) brightness(1.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37),
                      0 4px 16px 0 rgba(0, 0, 0, 0.2),
                      inset 0 1px 1px rgba(255, 255, 255, 0.3);
        }
        
        .menu-glass-dark:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.45),
                      0 6px 20px 0 rgba(0, 0, 0, 0.3),
                      inset 0 1px 1px rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }
        
        .menu-glass-dark::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
          pointer-events: none;
        }
        
        .menu-glass-dark:hover::before {
          left: 100%;
        }
        
        /* Light background variant (for light sections like Company Stats) */
        .menu-glass-light {
          background: rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(20px) saturate(1.8) brightness(0.9);
          -webkit-backdrop-filter: blur(20px) saturate(1.8) brightness(0.9);
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2),
                      0 4px 16px 0 rgba(0, 0, 0, 0.15),
                      inset 0 1px 1px rgba(0, 0, 0, 0.1);
        }
        
        .menu-glass-light:hover {
          background: rgba(0, 0, 0, 0.2);
          border-color: rgba(0, 0, 0, 0.3);
          box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.25),
                      0 6px 20px 0 rgba(0, 0, 0, 0.2),
                      inset 0 1px 1px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        .menu-glass-light::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 0, 0, 0.15),
            transparent
          );
          transition: left 0.5s;
          pointer-events: none;
        }
        
        .menu-glass-light:hover::before {
          left: 100%;
        }
      `}</style>
    </>
  )
}
