import { useEffect, useState, memo } from 'react'
import { client } from '../utils/sanity'

function Footer() {
  const [contactData, setContactData] = useState(null)

  useEffect(() => {
    const fetchInfo = () => {
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
        .then(res => setContactData(res))
        .catch(() => {
          // Component will return null if contactData is null, which is fine
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

  if (!contactData) return null

  // Use first office for footer info
  const mainOffice = contactData.offices?.[0]

  return (
    <footer className="bg-black text-gray-300 py-10 text-center">
      <div className="max-w-6xl mx-auto space-y-3">
        {mainOffice?.address && <p>{mainOffice.address}</p>}
        <p>
          {contactData.email && (
            <>
              <a href={`mailto:${contactData.email}`} className="hover:text-white">
                {contactData.email}
              </a>
              {mainOffice?.phone && ' | '}
            </>
          )}
          {mainOffice?.phone}
        </p>
        {contactData.licenseInfo && (
          <p className="text-sm text-gray-500">{contactData.licenseInfo}</p>
        )}
        <p className="text-sm mt-4">© {new Date().getFullYear()} U.S. Mechanical LLC</p>
      </div>
    </footer>
  )
}

export default memo(Footer)
