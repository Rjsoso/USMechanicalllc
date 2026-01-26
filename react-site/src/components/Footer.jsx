import { useEffect, useState, memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Phone, MapPin, Clock } from 'lucide-react'
import { client } from '../utils/sanity'
import { scrollToSection } from '../utils/scrollToSection'

// Fallback contact data in case Sanity fetch fails
const FALLBACK_DATA = {
  address: '472 South 640 West Pleasant Grove, UT 84062',
  phone: '(801) 785-6028',
  email: null,
  licenseInfo: null,
  footerCompanyDescription: 'Providing exceptional mechanical contracting services with a commitment to quality, safety, and customer satisfaction throughout Utah.',
  businessHours: {
    days: 'Monday - Friday',
    hours: '8:00 AM - 5:00 PM'
  },
  serviceArea: 'Serving Northern Utah',
  footerBadge: 'Fully Licensed & Insured'
}

function Footer() {
  const [contactData, setContactData] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true) // Tracks loading state for contact data
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchInfo = () => {
      setLoading(true)
      // Fetch contact data - exclude drafts to ensure consistency
      client
        .fetch(
          `*[_type == "contact" && !(_id in path("drafts.**"))][0]{
          email,
          licenseInfo,
          footerCompanyDescription,
          businessHours {
            days,
            hours
          },
          serviceArea,
          footerBadge,
          offices[] {
            locationName,
            address,
            phone
          }
        }`
        )
        .then(res => {
          setContactData(res)
          setLoading(false)
          if (!res) {
            console.warn('Footer: No contact data found in Sanity CMS. Using fallback data.')
          }
        })
        .catch(err => {
          console.error('Footer: Failed to fetch contact data from Sanity:', err)
          setLoading(false)
        })
    }

    fetchInfo()

    // Refresh data when window regains focus
    const handleFocus = () => {
      fetchInfo()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Use Sanity data if available, otherwise use fallback
  const mainOffice = contactData?.offices?.[0]
  const displayAddress = mainOffice?.address || FALLBACK_DATA.address
  const displayPhone = mainOffice?.phone || FALLBACK_DATA.phone
  const displayEmail = contactData?.email || FALLBACK_DATA.email
  const displayLicense = contactData?.licenseInfo || FALLBACK_DATA.licenseInfo
  const displayCompanyDescription = contactData?.footerCompanyDescription || FALLBACK_DATA.footerCompanyDescription
  const displayBusinessHoursDays = contactData?.businessHours?.days || FALLBACK_DATA.businessHours.days
  const displayBusinessHoursTime = contactData?.businessHours?.hours || FALLBACK_DATA.businessHours.hours
  const displayServiceArea = contactData?.serviceArea || FALLBACK_DATA.serviceArea
  const displayFooterBadge = contactData?.footerBadge || FALLBACK_DATA.footerBadge

  // Use favicon for footer logo
  const logoUrl = '/favicon.png'

  // Handle navigation link clicks
  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      // Navigate to home first, then scroll
      navigate('/')
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 100)
    } else {
      // Already on home page, just scroll
      scrollToSection(sectionId)
    }
  }

  return (
    <footer className="bg-black text-gray-300">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">U.S. Mechanical LLC</h3>
            <p className="text-sm leading-relaxed">
              {displayCompanyDescription}
            </p>
            <div className="space-y-2">
              {displayPhone && (
                <a 
                  href={`tel:${displayPhone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4" />
                  <span>{displayPhone}</span>
                </a>
              )}
              {displayAddress && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{displayAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: About Us Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">About Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleNavClick('about')}
                  className="transition-colors hover:text-white"
                >
                  Company Background
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('safety')}
                  className="transition-colors hover:text-white"
                >
                  Safety
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('about')}
                  className="transition-colors hover:text-white"
                >
                  Service Recognitions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Services Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleNavClick('services')}
                  className="transition-colors hover:text-white"
                >
                  Our Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('portfolio')}
                  className="transition-colors hover:text-white"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('contact')}
                  className="transition-colors hover:text-white"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Business Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Business Hours</h3>
            <div className="flex items-start gap-2 text-sm">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-medium text-white">{displayBusinessHoursDays}</p>
                <p>{displayBusinessHoursTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <img src={logoUrl} alt="US Mechanical" className="h-6 w-auto object-contain" />
              <p className="text-sm">© {new Date().getFullYear()} U.S. Mechanical LLC</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-sm md:flex-row md:gap-4">
              {displayLicense && (
                <span className="text-gray-400">{displayLicense}</span>
              )}
              <span className="font-medium text-primary-orange">{displayFooterBadge}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{displayServiceArea}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
