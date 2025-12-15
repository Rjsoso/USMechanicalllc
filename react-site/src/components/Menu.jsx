import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { client, urlFor } from '../utils/sanity'

// SVG Fallback Icon Component
const MenuIconSVG = ({ isOpen }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transition-transform duration-200"
    style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
  >
    {isOpen ? (
      // X icon when open
      <>
        <line x1="8" y1="8" x2="24" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="8" x2="8" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ) : (
      // Hamburger icon when closed
      <>
        <line x1="6" y1="10" x2="26" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="6" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="6" y1="22" x2="26" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </>
    )}
  </svg>
)

export default function Menu({ items = [] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuIcon, setMenuIcon] = useState(null)
  const [iconSource, setIconSource] = useState(null) // 'sanity', 'local', or 'svg'

  // Fetch menu icon from Sanity CMS
  useEffect(() => {
    const fetchMenuIcon = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "headerSection"][0]{
            menuIcon
          }`
        )
        if (data?.menuIcon) {
          setMenuIcon(data.menuIcon)
          setIconSource('sanity')
          return
        }
      } catch (error) {
        console.error('Error fetching menu icon from Sanity:', error)
      }

      // Try local image asset (check both .png and .svg)
      const checkLocalIcon = (path) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.onload = () => resolve(path)
          img.onerror = () => resolve(null)
          img.src = path
        })
      }

      const pngIcon = await checkLocalIcon('/menu-icon.png')
      if (pngIcon) {
        setMenuIcon(pngIcon)
        setIconSource('local')
      } else {
        const svgIcon = await checkLocalIcon('/menu-icon.svg')
        if (svgIcon) {
          setMenuIcon(svgIcon)
          setIconSource('local')
        } else {
          setIconSource('svg')
        }
      }
    }

    fetchMenuIcon()
  }, [])

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

  // Render menu icon based on source
  const renderMenuIcon = () => {
    if (iconSource === 'sanity' && menuIcon) {
      return (
        <motion.img
          src={urlFor(menuIcon).width(64).quality(90).auto('format').url()}
          alt="Menu"
          className="w-8 h-8 object-contain"
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        />
      )
    } else if (iconSource === 'local' && menuIcon) {
      return (
        <motion.img
          src={menuIcon}
          alt="Menu"
          className="w-8 h-8 object-contain"
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        />
      )
    } else {
      return <MenuIconSVG isOpen={isOpen} />
    }
  }

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 w-12 h-12 flex items-center justify-center bg-black/80 hover:bg-black rounded-lg transition-colors duration-200 text-white"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {renderMenuIcon()}
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
            className="fixed top-0 right-0 h-full w-full md:w-96 bg-gray-900 z-50 shadow-2xl overflow-y-auto"
          >
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeMenu}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-800 rounded-lg transition-colors"
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
                      className="text-2xl md:text-3xl font-semibold text-white hover:text-blue-400 transition-colors duration-200 w-full text-left"
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
    </>
  )
}
