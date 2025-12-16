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

  // Simple detection: check if background is white/light, change text to black
  useEffect(() => {
    const checkBackground = () => {
      if (!menuButtonRef.current) return

      const buttonRect = menuButtonRef.current.getBoundingClientRect()
      const buttonCenterY = buttonRect.top + buttonRect.height / 2
      const buttonCenterX = buttonRect.left + buttonRect.width / 2

      const elementBelow = document.elementFromPoint(buttonCenterX, buttonCenterY)
      
      if (!elementBelow) {
        setIsLightBackground(false)
        return
      }

      // Walk up DOM tree to find background
      let currentElement = elementBelow
      let isLight = false

      while (currentElement && currentElement !== document.body) {
        // Check for light background classes
        if (currentElement.classList) {
          const classes = Array.from(currentElement.classList)
          if (classes.some(cls => cls.includes('bg-gray-200') || cls.includes('bg-white') || cls.includes('bg-gray-100') || cls.includes('bg-gray-50'))) {
            isLight = true
            break
          }
        }

        // Check computed background color
        const computedStyle = window.getComputedStyle(currentElement)
        const bgColor = computedStyle.backgroundColor
        
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          const rgbMatch = bgColor.match(/\d+/g)
          if (rgbMatch && rgbMatch.length >= 3) {
            const r = parseInt(rgbMatch[0])
            const g = parseInt(rgbMatch[1])
            const b = parseInt(rgbMatch[2])
            // Check if it's a light color (white/light gray)
            if (r > 200 && g > 200 && b > 200) {
              isLight = true
              break
            }
          }
        }

        currentElement = currentElement.parentElement
      }

      setIsLightBackground(isLight)
    }

    // Throttle scroll events
    let rafId = null
    const throttledCheck = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        checkBackground()
        rafId = null
      })
    }

    checkBackground()
    window.addEventListener('scroll', throttledCheck, { passive: true })
    window.addEventListener('resize', throttledCheck, { passive: true })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', throttledCheck)
      window.removeEventListener('resize', throttledCheck)
    }
  }, [])

  return (
    <>
      {/* Menu Button - Fixed Floating */}
      <button
        ref={menuButtonRef}
        onClick={toggleMenu}
        className="fixed top-6 right-6 z-50 px-6 py-3 flex items-center justify-center transition-all duration-200 overflow-hidden menu-glass relative"
        style={{ position: 'fixed' }}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <span className={`text-xl md:text-2xl font-bold tracking-wide relative z-10 transition-colors duration-200 ${isLightBackground ? 'text-gray-900' : 'text-white'}`}>
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

      {/* Glass surface styling for menu button - Floating Effect */}
      <style>{`
        .menu-glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px) saturate(1.8) brightness(1.25);
          -webkit-backdrop-filter: blur(20px) saturate(1.8) brightness(1.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37),
                      0 4px 16px 0 rgba(0, 0, 0, 0.2),
                      inset 0 1px 1px rgba(255, 255, 255, 0.3);
          position: fixed !important;
          top: 24px !important;
          right: 24px !important;
        }
        
        .menu-glass:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.45),
                      0 6px 20px 0 rgba(0, 0, 0, 0.3),
                      inset 0 1px 1px rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }
        
        .menu-glass::before {
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
        
        .menu-glass:hover::before {
          left: 100%;
        }
      `}</style>
    </>
  )
}
