import { useEffect, useState, memo } from 'react'
import { client } from '../utils/sanity'

// Fallback contact data in case Sanity fetch fails
const FALLBACK_DATA = {
  address: '472 South 640 West Pleasant Grove, UT 84062',
  phone: '(801) 785-6028',
  email: null,
  licenseInfo: null,
}

function Footer() {
  const [contactData, setContactData] = useState(null)
  // eslint-disable-next-line no-unused-vars  
  const [loading, setLoading] = useState(true) // Tracks loading state for contact data

  useEffect(() => {
    const fetchInfo = () => {
      setLoading(true)
      // Fetch contact data - exclude drafts to ensure consistency
      client
        .fetch(
          `*[_type == "contact" && !(_id in path("drafts.**"))][0]{
          email,
          licenseInfo,
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

  // Use favicon for footer logo
  const logoUrl = '/favicon.png'

  return (
    <footer className="bg-black py-10 text-center text-gray-300">
      <div className="mx-auto max-w-6xl space-y-3">
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
        {displayLicense && <p className="text-sm text-gray-500">{displayLicense}</p>}
        <div className="mt-4 flex items-center justify-center gap-2">
          <img src={logoUrl} alt="US Mechanical" className="h-6 w-auto object-contain" />
          <p className="text-sm">© {new Date().getFullYear()} U.S. Mechanical LLC</p>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
