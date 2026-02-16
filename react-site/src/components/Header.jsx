import { useEffect, useState, useMemo, memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { client, urlFor } from '../utils/sanity'
import { navigateToSection } from '../utils/scrollToSection'
import DrawerMenu from './DrawerMenu'
import DesktopNav from './DesktopNav'
import './Header.css'

function Header() {
  const [logo, setLogo] = useState(null)
  const [logoLoading, setLogoLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // Fetch logo from Sanity headerSection
  useEffect(() => {
    client
      .fetch(
        `*[_type == "headerSection" && _id == "headerSection"][0]{
          logo
        }`
      )
      .then(data => {
        if (data?.logo) {
          setLogo(data.logo)
        }
      })
      .catch(error => {
        console.error('Error fetching header data:', error)
      })
  }, [])

  // Memoize logo URL for background image
  const logoUrl = useMemo(() => {
    if (!logo?.asset) return null
    return urlFor(logo).width(640).quality(95).auto('format').fit('max').url()
  }, [logo])

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      // Already on homepage - scroll to top and update hash
      window.history.pushState(null, '', '/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // On different page - navigate to homepage
      navigate('/')
    }
  }

  return (
    <>
      {/* Desktop Navigation Bar - Below logo, above content */}
      <DesktopNav />

      {/* Logo with 3D shadow effect - Overlaps the nav bar */}
      {logoUrl && (
        <div className="plaque-perspective fixed left-4 top-4 z-50">
          <div
            className="logo-3d-card"
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleLogoClick()
              }
            }}
            aria-label="Go to home page"
          >
            <img
              src={logoUrl}
              alt="US Mechanical"
              className="stamped-logo"
              loading="eager"
              onLoad={() => setLogoLoading(false)}
              style={{
                opacity: logoLoading ? 0 : 1,
                transition: 'opacity 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Drawer Menu - Mobile only */}
      <DrawerMenu />
    </>
  )
}

export default memo(Header)
