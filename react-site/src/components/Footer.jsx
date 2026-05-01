/* global process */
import { useEffect, useState, memo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Clock, Linkedin } from 'lucide-react'
import { client } from '../utils/sanity'
import { scrollToSection } from '../utils/scrollToSection'
import { openConsentBanner } from '../utils/openConsentBanner'
import './Footer.css'

// Fallback contact data in case Sanity fetch fails - Last updated: 2026-01-29
const FALLBACK_DATA = {
  address: '472 South 640 West\nPleasant Grove, UT 84062',
  phone: '(801) 785-6028',
  email: null,
  licenseInfo: 'Licensed in UT, NV, CA, AZ, WY',
  footerCompanyDescription: 'Providing exceptional mechanical contracting services with a commitment to quality, safety, and customer satisfaction primarily throughout Utah & Nevada',
  businessHours: {
    days: 'Monday - Friday',
    hours: '8:00 AM - 5:00 PM',
  },
  serviceArea: 'Serving Northern Utah',
  footerBadge: 'Fully Licensed & Insured',
}

function Footer() {
  const [contactData, setContactData] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
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
      .then((res) => {
        setContactData(res)
        if (!res && process.env.NODE_ENV === 'development') {
          console.warn('Footer: No contact data found in Sanity CMS. Using fallback data.')
        }
      })
      .catch((err) => {
        console.error('Footer: Failed to fetch contact data from Sanity:', err)
      })
  }, [])

  const displayLicense = contactData?.licenseInfo || FALLBACK_DATA.licenseInfo

  const displayCompanyDescription = contactData
    ? (contactData.footerCompanyDescription ?? '')
    : FALLBACK_DATA.footerCompanyDescription
  const displayBusinessHoursDays = contactData
    ? (contactData.businessHours?.days ?? '')
    : FALLBACK_DATA.businessHours.days
  const displayBusinessHoursTime = contactData
    ? (contactData.businessHours?.hours ?? '')
    : FALLBACK_DATA.businessHours.hours
  const displayServiceArea = contactData ? (contactData.serviceArea ?? '') : FALLBACK_DATA.serviceArea
  const displayFooterBadge = contactData ? (contactData.footerBadge ?? '') : FALLBACK_DATA.footerBadge

  const logoUrl = '/favicon.png'

  const handleNavClick = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 100)
    } else {
      scrollToSection(sectionId)
    }
  }

  return (
    <footer className="site-footer-editorial">
      <div className="site-footer-editorial__inner">
        <div className="site-footer-editorial__main">
          <div className="site-footer-editorial__grid">
            <div className="site-footer-editorial__col site-footer-editorial__col--brand">
              <h3 className="site-footer-editorial__brand-name">U.S. Mechanical LLC</h3>
              {displayCompanyDescription && (
                <p className="site-footer-editorial__brand-copy">{displayCompanyDescription}</p>
              )}
            </div>

            <div className="site-footer-editorial__col">
              <h3 className="site-footer-editorial__col-heading">About Us</h3>
              <ul className="site-footer-editorial__nav-list">
                <li>
                  <button type="button" onClick={() => handleNavClick('about')} className="site-footer-editorial__nav-btn">
                    About
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavClick('safety')} className="site-footer-editorial__nav-btn">
                    Safety & Risk Management
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavClick('careers')} className="site-footer-editorial__nav-btn">
                    Careers
                  </button>
                </li>
              </ul>
            </div>

            <div className="site-footer-editorial__col">
              <h3 className="site-footer-editorial__col-heading">Services</h3>
              <ul className="site-footer-editorial__nav-list">
                <li>
                  <button type="button" onClick={() => handleNavClick('services')} className="site-footer-editorial__nav-btn">
                    Services
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavClick('portfolio')} className="site-footer-editorial__nav-btn">
                    Portfolio
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleNavClick('contact')} className="site-footer-editorial__nav-btn">
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            <div className="site-footer-editorial__col">
              <h3 className="site-footer-editorial__col-heading">Business Hours</h3>
              {(displayBusinessHoursDays || displayBusinessHoursTime) && (
                <div className="site-footer-editorial__hours">
                  <Clock className="site-footer-editorial__hours-icon h-4 w-4" aria-hidden />
                  <div>
                    {displayBusinessHoursDays && (
                      <p className="site-footer-editorial__hours-days">{displayBusinessHoursDays}</p>
                    )}
                    {displayBusinessHoursTime && (
                      <p className="site-footer-editorial__hours-time">{displayBusinessHoursTime}</p>
                    )}
                  </div>
                </div>
              )}
              <p className="site-footer-editorial__social-heading">Follow Us</p>
              <a
                href="https://www.linkedin.com/company/usmechanicalllc/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-editorial__social-link"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer-editorial__bar">
          <div className="site-footer-editorial__bar-row">
            <div className="site-footer-editorial__bar-left">
              <div className="site-footer-editorial__bar-brand">
                <img src={logoUrl} alt="US Mechanical" className="h-6 w-auto object-contain" width={96} height={24} loading="lazy" decoding="async" />
                <p className="site-footer-editorial__bar-copy">© {new Date().getFullYear()} U.S. Mechanical LLC</p>
              </div>
              <div className="site-footer-editorial__bar-links">
                <Link to="/privacy">Privacy Policy</Link>
                <span aria-hidden="true">·</span>
                <Link to="/terms">Terms of Service</Link>
                <span aria-hidden="true">·</span>
                <button type="button" onClick={openConsentBanner} aria-label="Open cookie preferences to change your choice">
                  Cookie preferences
                </button>
              </div>
            </div>
            <div className="site-footer-editorial__bar-meta">
              {displayLicense && <span className="site-footer-editorial__bar-license">{displayLicense}</span>}
              {displayFooterBadge && (
                <>
                  {displayLicense ? <span className="site-footer-editorial__bar-dot" aria-hidden>·</span> : null}
                  <span className="site-footer-editorial__bar-badge">{displayFooterBadge}</span>
                </>
              )}
              {displayServiceArea && (
                <>
                  {(displayLicense || displayFooterBadge) ? (
                    <span className="site-footer-editorial__bar-dot" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <span className="site-footer-editorial__bar-area">{displayServiceArea}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
