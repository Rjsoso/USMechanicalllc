import { useEffect, useState } from 'react'
import { client } from '../utils/sanity'

export default function Footer() {
  const [info, setInfo] = useState(null)

  useEffect(() => {
    client
      .fetch(`*[_type == "companyInfo"][0]`)
      .then(res => setInfo(res))
      .catch(error => {
        console.warn('Sanity fetch failed for footer info:', error)
        // Component will return null if info is null, which is fine
      })
  }, [])

  if (!info) return null

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 text-center">
      <div className="max-w-6xl mx-auto space-y-3">
        <p>{info.address}</p>
        <p>
          <a href={`mailto:${info.email}`} className="hover:text-white">
            {info.email}
          </a>{' '}
          | {info.phone}
        </p>
        <p className="text-sm text-gray-500">{info.licenseInfo}</p>
        <p className="text-sm mt-4">© {new Date().getFullYear()} U.S. Mechanical LLC</p>
      </div>
    </footer>
  )
}
