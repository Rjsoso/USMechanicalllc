import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { client } from '../utils/sanity'
import { navigateToSection, scrollToSection } from '../utils/scrollToSection'
import LoadingScreen from './LoadingScreen'
import './DrawerMenu.css'

const DrawerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [sections, setSections] = useState([])
  const [showLoader, setShowLoader] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const hamburgerRef = useRef(null)
  const drawerRef = useRef(null)

  // Default fallback navigation structure - Last updated: 2026-01-29
  const defaultSections = [
    {
      label: 'COMPANY',
      links: [
        { label: 'About Us', href: '#about', ariaLabel: null },
        { label: 'Safety', href: '#safety', ariaLabel: null },
      ],
    },
    {
      label: 'SERVICES',
      links: [
        { label: 'Our Services', href: '#services', ariaLabel: null },
        { label: 'Portfolio', href: '#portfolio', ariaLabel: null },
      ],
    },
    {
      label: 'CONNECT',
      links: [
        { label: 'Careers at US Mechanical', href: '#careers', ariaLabel: null },
        { label: 'Contact', href: '#contact', ariaLabel: null },
      ],
    },
  ]

  // Fetch navigation data from Sanity
  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const headerData = await client.fetch(
          `*[_type == "headerSection"][0]{
            sections[] {
              label,
              links[] {
                label,
                href,
                ariaLabel
              }
            }
          }`
        )

        const fetchedSections =
          headerData?.sections && headerData.sections.length > 0
            ? headerData.sections
            : defaultSections

        setSections(fetchedSections)
      } catch (error) {
        console.error('Error fetching navigation data:', error)
        setSections(defaultSections)
      }
    }

    fetchNavData()
  }, [])

  // Preload Contact component on hover for faster navigation
  const preloadContact = () => {
    import('../pages/Contact').catch(() => {})
  }

  // Handle scroll to section or page navigation with 1-second loading screen
  const handleLinkClick = href => {
    // Close drawer first
    setIsOpen(false)
    
    // Small delay to let drawer close animation complete (250ms)
    // Then show loading screen with fade-in
    setTimeout(() => {
      setShowLoader(true)
      
      setTimeout(() => {
      // Check if it's a full page link (starts with /) or an anchor link (starts with #)
      if (href.startsWith('/') && !href.includes('#')) {
        // Full page navigation (e.g., /about, /careers, /portfolio, /contact)
        navigate(href)
        // Hide loader immediately for page routes
        setShowLoader(false)
      } else if (href.startsWith('/#')) {
        // Link to section on home page (e.g., /#services)
        const sectionId = href.replace('/#', '')
        navigateToSection(sectionId, navigate, location.pathname)
        // Keep loader visible during scroll
        setTimeout(() => setShowLoader(false), 300)
      } else if (href.startsWith('/') && href.includes('#')) {
        // Link to section on specific page (e.g., /about#safety)
        const [path, section] = href.split('#')
        
        // Navigate to the page first
        navigate(path)
        
        // Use scrollToSection utility for proper offset handling
        setTimeout(() => {
          scrollToSection(section, 180, 50, 200)
            .then(() => {
              console.log(`Successfully scrolled to ${section}`)
            })
            .catch(err => {
              console.error(`Error scrolling to ${section}:`, err)
            })
        }, 300) // Increased delay for page render
        // Keep loader visible during page load and scroll
        setTimeout(() => setShowLoader(false), 600)
      } else if (href.startsWith('#')) {
        // Legacy anchor link - treat as home page section
        const sectionId = href.replace('#', '')
        navigateToSection(sectionId, navigate, location.pathname)
        // Keep loader visible during scroll
        setTimeout(() => setShowLoader(false), 300)
      }
      }, 1000)
    }, 250) // Delay to let drawer close smoothly
  }

  // Toggle drawer open/closed
  const toggleDrawer = () => {
    setIsOpen(prev => !prev)
  }

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        // Return focus to hamburger button
        hamburgerRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Focus trap when drawer is open
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      const handleTab = e => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              e.preventDefault()
              lastElement?.focus()
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault()
              firstElement?.focus()
            }
          }
        }
      }

      document.addEventListener('keydown', handleTab)
      return () => document.removeEventListener('keydown', handleTab)
    }
  }, [isOpen])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Loading Screen Overlay */}
      {showLoader && <LoadingScreen />}
      
      {/* Hamburger Button */}
      <button
        ref={hamburgerRef}
        className={`drawer-hamburger ${isOpen ? 'open' : ''}`}
        onClick={toggleDrawer}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="drawer-menu"
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={toggleDrawer}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            ref={drawerRef}
            id="drawer-menu"
            className="drawer-panel"
            role="navigation"
            aria-label="Main navigation"
            aria-hidden={!isOpen}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 32,
              mass: 0.8,
              duration: 0.3,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.2 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) {
                setIsOpen(false)
              }
            }}
          >
            <div className="drawer-content">
              {sections.map((section, idx) => (
                <motion.div
                  key={`${section.label}-${idx}`}
                  className="drawer-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 + 0.05, duration: 0.3, ease: 'easeOut' }}
                >
                  <h3 className="drawer-section-label">{section.label}</h3>
                  <div className="drawer-section-links">
                    {section.links?.map((link, i) => (
                      <button
                        key={`${link.label}-${i}`}
                        className="drawer-link"
                        onClick={() => handleLinkClick(link.href)}
                        onMouseEnter={link.href === '#contact' || link.href === '#careers' ? preloadContact : undefined}
                        aria-label={link.ariaLabel || link.label}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

export default DrawerMenu
