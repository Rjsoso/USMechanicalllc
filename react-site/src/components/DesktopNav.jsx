import { memo, useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiMapPin, FiChevronDown, FiPhone } from 'react-icons/fi'
import { navigateToSection } from '../utils/scrollToSection'
import './DesktopNav.css'

const offices = [
  { name: 'Pleasant Grove, UT', phone: '(801) 785-6028', href: 'tel:+18017856028' },
  { name: 'Las Vegas, NV', phone: '(702) 870-9609', href: 'tel:+17028709609' },
]

const DesktopNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [locationsOpen, setLocationsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const timeoutRef = useRef(null)

  const navLinks = [
    { label: 'About Us', sectionId: 'about' },
    { label: 'Safety', sectionId: 'safety' },
    { label: 'Services', sectionId: 'services' },
    { label: 'Portfolio', sectionId: 'portfolio' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', sectionId: 'contact' },
  ]

  const handleNavClick = (link) => {
    if (link.path) {
      navigate(link.path)
    } else {
      navigateToSection(link.sectionId, navigate, location.pathname)
    }
  }

  const openDropdown = useCallback(() => {
    clearTimeout(timeoutRef.current)
    setLocationsOpen(true)
  }, [])

  const closeDropdown = useCallback(() => {
    timeoutRef.current = setTimeout(() => setLocationsOpen(false), 150)
  }, [])

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLocationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="desktop-nav" role="navigation" aria-label="Main navigation">
      <div className="desktop-nav-container">
        <ul className="desktop-nav-list">
          {/* Locations dropdown */}
          <li
            className="desktop-nav-item"
            ref={dropdownRef}
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            <button
              className="desktop-nav-link desktop-nav-locations-trigger"
              onClick={() => setLocationsOpen((v) => !v)}
              aria-expanded={locationsOpen}
              aria-haspopup="true"
              aria-label="Office locations"
            >
              <FiMapPin className="desktop-nav-locations-icon" />
              Locations
              <FiChevronDown className={`desktop-nav-chevron ${locationsOpen ? 'open' : ''}`} />
            </button>

            {locationsOpen && (
              <div className="desktop-nav-dropdown" role="menu">
                {offices.map((office) => (
                  <a
                    key={office.name}
                    href={office.href}
                    className="desktop-nav-dropdown-item"
                    role="menuitem"
                  >
                    <span className="desktop-nav-dropdown-name">{office.name}</span>
                    <span className="desktop-nav-dropdown-phone">
                      <FiPhone className="desktop-nav-dropdown-phone-icon" />
                      {office.phone}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </li>

          {navLinks.map((link) => (
            <li key={link.sectionId || link.path} className="desktop-nav-item">
              <button
                className="desktop-nav-link"
                onClick={() => handleNavClick(link)}
                aria-label={`Navigate to ${link.label}`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default memo(DesktopNav)
