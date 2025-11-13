import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = href => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/#about' },
    { name: 'Safety', href: '/#safety' },
    { name: 'Recognition', href: '/#recognition' },
    { name: 'Contact', href: '/#contact' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 shadow-lg backdrop-blur-md' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3"
          >
            <img
              src="/logo.png"
              alt="U.S. Mechanical Logo"
              className="h-16 w-auto rounded-lg object-contain"
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'block'
              }}
            />
            <span className="hidden text-2xl font-bold text-gray-900" style={{ display: 'none' }}>
              U.S. Mechanical
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.href}
                onClick={e => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault()
                    if (location.pathname !== '/') {
                      window.location.href = link.href
                    } else {
                      handleLinkClick(link.href)
                    }
                  }
                }}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/#contact"
              onClick={e => {
                e.preventDefault()
                handleLinkClick('#contact')
              }}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Request a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-gray-700 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pb-6 md:hidden"
            >
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={e => {
                    if (link.href.startsWith('#')) {
                      e.preventDefault()
                      handleLinkClick(link.href)
                    } else {
                      setIsMobileMenuOpen(false)
                    }
                  }}
                  className="block text-base font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/#contact"
                onClick={e => {
                  e.preventDefault()
                  handleLinkClick('#contact')
                }}
                className="block rounded-lg bg-blue-600 px-6 py-2.5 text-center font-semibold text-white"
              >
                Request a Quote
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
