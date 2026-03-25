import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiPhone } from 'react-icons/fi'
import { navigateToSection, scrollToSection } from '../utils/scrollToSection'
import { useSanityLive } from '../hooks/useSanityLive'
import './DrawerMenu.css'

const offices = [
  { name: 'Pleasant Grove, UT', phone: '(801) 785-6028', address: '472 S 640 W, Pleasant Grove, UT 84062' },
  { name: 'Las Vegas, NV', phone: '(702) 870-9609', address: '4344 E Alexander Rd, Las Vegas, NV 89115' },
]

const HEADER_QUERY = `*[_type == "headerSection"][0]{
  sections[] { label, links[] { label, href, ariaLabel } }
}`

const defaultSections = [
  { label: 'COMPANY', links: [{ label: 'About Us', href: '#about', ariaLabel: null }, { label: 'Safety', href: '#safety', ariaLabel: null }] },
  { label: 'SERVICES', links: [{ label: 'Our Services', href: '#services', ariaLabel: null }, { label: 'Portfolio', href: '#portfolio', ariaLabel: null }] },
  { label: 'CONNECT', links: [{ label: 'Careers at US Mechanical', href: '/careers', ariaLabel: null }, { label: 'Contact', href: '/contact', ariaLabel: null }] },
]

const DrawerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const hamburgerRef = useRef(null)
  const drawerRef = useRef(null)

  const { data: headerData } = useSanityLive(HEADER_QUERY, {}, {
    listenFilter: `*[_type == "headerSection"]`,
  })
  const sections =
    headerData?.sections && headerData.sections.length > 0
      ? headerData.sections
      : defaultSections

  // Preload Contact component on hover for faster navigation
  const preloadContact = () => {
    import('../pages/Contact').catch(() => {})
  }

  // Handle scroll to section or page navigation
  const handleLinkClick = href => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[DRAWER NAV] Click detected:', href)
    }
    
    // Close drawer first
    setIsOpen(false)
    if (process.env.NODE_ENV === 'development') {
      console.log('[DRAWER NAV] Drawer closing...')
    }
    
    // Small delay to let drawer close animation start (100ms for visual feedback)
    setTimeout(() => {
      // Check if it's a full page link (starts with /) or an anchor link (starts with #)
      if (href.startsWith('/') && !href.includes('#')) {
        // Full page navigation (e.g., /about, /careers, /portfolio, /contact)
        navigate(href)
      } else if (href.startsWith('/#')) {
        // Link to section on home page (e.g., /#services)
        const sectionId = href.replace('/#', '')
        navigateToSection(sectionId, navigate, location.pathname)
      } else if (href.startsWith('/') && href.includes('#')) {
        // Link to section on specific page (e.g., /about#safety)
        const [path, section] = href.split('#')
        navigate(path)
        
        // Scroll to section after page loads
        setTimeout(() => {
          scrollToSection(section, 180, 50, 200)
        }, 100)
      } else if (href.startsWith('#')) {
        // Simple anchor link on current page (e.g., #services)
        const sectionId = href.replace('#', '')
        navigateToSection(sectionId, navigate, location.pathname)
      }
    }, 100)
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
              stiffness: 500,
              damping: 28,
              mass: 0.6,
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
                  transition={{ delay: idx * 0.05 + 0.05, duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
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

              <motion.div
                className="drawer-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sections.length * 0.05 + 0.05, duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="drawer-section-label">
                  <FiMapPin style={{ display: 'inline', width: 14, height: 14, marginRight: 6, verticalAlign: '-2px' }} />
                  LOCATIONS
                </h3>
                <div className="drawer-section-links">
                  {offices.map((office) => (
                    <a
                      key={office.name}
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="drawer-link drawer-location-link"
                      aria-label={`View ${office.name} on Google Maps`}
                    >
                      <span>{office.name}</span>
                      <span className="drawer-location-phone">
                        <FiPhone style={{ width: 12, height: 12 }} />
                        {office.phone}
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}

export default DrawerMenu
