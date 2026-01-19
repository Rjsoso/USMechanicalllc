import { useEffect, useState, memo, useMemo } from 'react'
import { client, urlFor } from '../utils/sanity'

// Fallback contact data in case Sanity fetch fails
const FALLBACK_DATA = {
  address: '472 South 640 West Pleasant Grove, UT 84062',
  phone: '(801) 785-6028',
  email: null,
  licenseInfo: null
}

function Footer() {
  const [contactData, setContactData] = useState(null)
  const [logo, setLogo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInfo = () => {
      setLoading(true)
      
      // Fetch contact data including footer logo
      client
        .fetch(`*[_type == "contact"][0]{
          email,
          licenseInfo,
          footerLogo,
          offices[] {
            locationName,
            address,
            phone
          }
        }`)
        .then(res => {
          setContactData(res)
          // Set footer logo from contact data
          if (res?.footerLogo) {
            setLogo(res.footerLogo)
          } else {
            // Fallback: try to get logo from header section
            client
              .fetch(`*[_type == "headerSection" && _id == "headerSection"][0]{
                logo
              }`)
              .then(headerRes => {
                if (headerRes?.logo) {
                  setLogo(headerRes.logo)
                }
              })
              .catch((err) => {
                console.error('Footer: Failed to fetch header logo fallback:', err)
              })
          }
          setLoading(false)
          if (!res) {
            console.warn('Footer: No contact data found in Sanity CMS. Using fallback data.')
          }
        })
        .catch((err) => {
          console.error('Footer: Failed to fetch contact data from Sanity:', err)
          setLoading(false)
        })
    };

    fetchInfo();

    // Refresh data when window regains focus
    const handleFocus = () => {
      fetchInfo();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [])

  // Use Sanity data if available, otherwise use fallback
  const mainOffice = contactData?.offices?.[0]
  const displayAddress = mainOffice?.address || FALLBACK_DATA.address
  const displayPhone = mainOffice?.phone || FALLBACK_DATA.phone
  const displayEmail = contactData?.email || FALLBACK_DATA.email
  const displayLicense = contactData?.licenseInfo || FALLBACK_DATA.licenseInfo

  // Memoize logo URL
  const logoUrl = useMemo(() => {
    if (!logo) return '/logo.png' // Fallback to public logo
    try {
      return urlFor(logo).width(120).quality(90).auto('format').url()
    } catch (err) {
      console.error('Footer: Error generating logo URL:', err)
      return '/logo.png'
    }
  }, [logo])

  return (
    <footer className="bg-black text-gray-300 py-10 text-center">
      <div className="max-w-6xl mx-auto space-y-3">
        {displayAddress && <p>{displayAddress}</p>}
        <p>
          {displayEmail && (
            <>
              <a href={`mailto:${displayEmail}`} className="hover:text-white">
                {displayEmail}
              </a>
              {displayPhone && ' | '}
            </>
          )}
          {displayPhone}
        </p>
        {displayLicense && (
          <p className="text-sm text-gray-500">{displayLicense}</p>
        )}
        <div className="flex items-center justify-center gap-2 mt-4">
          <img 
            src={logoUrl} 
            alt="US Mechanical" 
            className="h-6 w-auto object-contain"
          />
          <p className="text-sm">© {new Date().getFullYear()} U.S. Mechanical LLC</p>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
