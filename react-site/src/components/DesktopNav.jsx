import { memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { navigateToSection } from '../utils/scrollToSection'
import './DesktopNav.css'

const DesktopNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation links for all main sections
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
      if (process.env.NODE_ENV === 'development') {
        console.log('[DESKTOP NAV] Navigating to page:', link.path)
      }
      navigate(link.path)
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('[DESKTOP NAV] Navigating to section:', link.sectionId)
      }
      navigateToSection(link.sectionId, navigate, location.pathname)
    }
  }

  return (
    <nav className="desktop-nav" role="navigation" aria-label="Main navigation">
      <div className="desktop-nav-container">
        <ul className="desktop-nav-list">
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
