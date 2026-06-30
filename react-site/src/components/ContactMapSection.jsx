import { useState, memo } from 'react'
import { useSanityLive } from '../hooks/useSanityLive'
import SmallSpinner from './SmallSpinner'

const CONTACT_MAP_QUERY = `*[_type == "contact" && _id == "contact"][0]{
  offices[]{ locationName, address, phone, fax }
}`

/**
 * Map block height: use dynamic viewport height minus ~nav band (5.5rem matches scroll-mt).
 * `100dvh` uses the visible viewport on mobile; `max(..., 36rem)` keeps a tall map on short screens.
 */
const MAP_BLOCK_HEIGHT = 'max(36rem, calc(100dvh - 5.5rem))'

/** Matches `.site-footer-editorial` `--fe-bg` (Footer.css) for section background. */
const EDITORIAL_CHARCOAL = '#111111'

/** Tab labels with state; falls back to Sanity `locationName` */
const OFFICE_TAB_LABEL = {
  'pleasant grove': 'Pleasant Grove, Utah',
  'las vegas': 'Las Vegas, Nevada',
}

function officeTabButtonLabel(locationName) {
  if (!locationName) return ''
  const key = locationName.trim().toLowerCase()
  return OFFICE_TAB_LABEL[key] ?? locationName
}

/**
 * Full-viewport map and location card for the home page `#contact` section.
 * Only the active office iframe is mounted (tab switch remounts iframe for that office).
 */
function ContactMapSection() {
  const [activeOfficeTab, setActiveOfficeTab] = useState(0)
  const { data: contactData, loading } = useSanityLive(CONTACT_MAP_QUERY, {}, {
    listenFilter: `*[_type == "contact"]`,
  })

  const offices = contactData?.offices
  const activeOffice =
    offices && offices.length > 0 ? offices[activeOfficeTab] : null

  if (loading || !contactData) {
    return (
      <section
        id="contact"
        className="scroll-mt-[5.5rem]"
        style={{ backgroundColor: EDITORIAL_CHARCOAL }}
        aria-label="Contact"
      >
        <div
          className="flex items-center justify-center px-6 py-16"
          style={{ minHeight: MAP_BLOCK_HEIGHT }}
        >
          <SmallSpinner label="Loading map…" variant="dark" />
        </div>
      </section>
    )
  }

  return (
    <section
      id="contact"
      className="scroll-mt-[5.5rem]"
      style={{ backgroundColor: EDITORIAL_CHARCOAL }}
      aria-label="Contact locations"
    >
      <div className="w-full">
        {offices && offices.length > 0 ? (
          <div
            className="relative w-full min-h-[320px] overflow-hidden"
            style={{ height: MAP_BLOCK_HEIGHT, minHeight: MAP_BLOCK_HEIGHT }}
          >
            <div className="absolute left-0 right-0 top-0 z-20 flex flex-col items-end gap-2 px-4 pt-3 md:gap-3 md:px-6">
              {activeOffice && (
                <div className="max-w-[min(100%,20rem)] rounded-lg bg-black/50 px-3 py-2.5 text-right shadow-lg backdrop-blur-md md:max-w-sm md:px-4 md:py-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-white/50 md:text-xs">
                    Location
                  </p>
                  {activeOffice.address && (
                    <p className="text-xs leading-snug text-white/90 md:text-sm">
                      {activeOffice.address}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-white md:text-sm">
                    Phone:{' '}
                    <a
                      href={`tel:${activeOffice.phone}`}
                      className="text-blue-300 transition-colors hover:text-blue-200"
                    >
                      {activeOffice.phone}
                    </a>
                  </p>
                  {activeOffice.fax && (
                    <p className="mt-1 text-[11px] text-white/75 md:text-xs">Fax: {activeOffice.fax}</p>
                  )}
                </div>
              )}
              <div className="flex shrink-0 gap-1 rounded-lg bg-black/50 p-1 shadow-lg backdrop-blur-md">
                {offices.map((office, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveOfficeTab(index)}
                    className={`max-w-[11rem] rounded-md px-2.5 py-2 text-left text-xs font-semibold leading-tight transition-all sm:max-w-none sm:px-3 sm:py-2.5 sm:text-sm md:px-4 ${
                      activeOfficeTab === index
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {officeTabButtonLabel(office.locationName)}
                  </button>
                ))}
              </div>
            </div>

            {/* Only mount the active office map iframe (saves network/CPU vs hidden iframes). */}
            {activeOffice?.address ? (
              <div className="absolute inset-0 z-[1]">
                <iframe
                  key={`${activeOfficeTab}-${activeOffice.address}`}
                  title={`${activeOffice.locationName} location`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(activeOffice.address)}&z=15&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="eager"
                  referrerPolicy="no-referrer-when-downgrade"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  className="h-full w-full"
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div
            className="relative w-full overflow-hidden"
            style={{ minHeight: MAP_BLOCK_HEIGHT, height: MAP_BLOCK_HEIGHT }}
          >
            <div className="flex items-center justify-center px-6 py-16 text-white/70">
              No office locations available.
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default memo(ContactMapSection)
