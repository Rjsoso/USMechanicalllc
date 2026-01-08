import { useEffect, useState, memo } from 'react'
import { client } from '../utils/sanity'

// Fallback contact data in case Sanity fetch fails
const FALLBACK_DATA = {
  address: '472 South 640 West Pleasant Grove, UT 84062',
  phone: '(801) 785-6028',
  email: null,
  licenseInfo: null
}

function Footer() {
  const [contactData, setContactData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInfo = () => {
      setLoading(true)
      client
        .fetch(`*[_type == "contact"][0]{
          email,
          licenseInfo,
          offices[] {
            locationName,
            address,
            phone
          }
        }`)
        .then(res => {
          setContactData(res)
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
        <p className="text-sm mt-4">© {new Date().getFullYear()} U.S. Mechanical LLC</p>
      </div>
    </footer>
  )
}

export default memo(Footer)
