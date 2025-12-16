import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Menu({ items = [] }) {
  const [isOpen, setIsOpen] = useState(false)

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

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 px-6 py-3 flex items-center justify-center transition-all duration-200 overflow-hidden menu-glass relative"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <span className="text-xl md:text-2xl font-bold text-white tracking-wide relative z-10">
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

      {/* Glass surface styling for menu button */}
      <style>{`
        .menu-glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px) saturate(1.8) brightness(1.25);
          -webkit-backdrop-filter: blur(20px) saturate(1.8) brightness(1.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37),
                      inset 0 1px 1px rgba(255, 255, 255, 0.3);
        }
        
        .menu-glass:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4),
                      inset 0 1px 1px rgba(255, 255, 255, 0.4);
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
        }
        
        .menu-glass:hover::before {
          left: 100%;
        }
      `}</style>
    </>
  )
}
