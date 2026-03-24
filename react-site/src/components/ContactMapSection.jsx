import { useState, memo } from 'react'
import { useSanityLive } from '../hooks/useSanityLive'
import { urlFor } from '../utils/sanity'

const CONTACT_MAP_QUERY = `*[_type == "contact" && _id == "contact"][0]{
  offices[]{ locationName, address, phone, fax },
  affiliates[]{ name, description, logo { asset-> { _id, url } } }
}`

/** Fixed header clearance — match Contact page / scroll offsets */
const HEADER_OFFSET_PX = 180

/**
 * Full-viewport map, gradient, and location card for the home page `#contact` section.
 * All office maps stay mounted so tab switches are instant (no iframe reload).
 */
function ContactMapSection() {
  const [activeOfficeTab, setActiveOfficeTab] = useState(0)
  const { data: contactData, loading } = useSanityLive(CONTACT_MAP_QUERY, {}, {
    listenFilter: `*[_type == "contact"]`,
  })

  const offices = contactData?.offices
  const affiliates = contactData?.affiliates
  const activeOffice =
    offices && offices.length > 0 ? offices[activeOfficeTab] : null

  if (loading || !contactData) {
    return (
      <section
        id="contact"
        className="scroll-mt-[5.5rem] border-t border-white/10 bg-neutral-950"
        aria-label="Contact"
      >
        <div className="flex min-h-[200px] items-center justify-center px-6 py-16 text-white/60">
          Loading map…
        </div>
      </section>
    )
  }

  return (
    <section
      id="contact"
      className="scroll-mt-[5.5rem] border-t border-white/10 bg-neutral-950"
      aria-label="Contact locations"
    >
      <div className="w-full">
        {offices && offices.length > 0 ? (
          <div
            className="relative w-full min-h-[320px] overflow-hidden"
            style={{ height: `calc(100svh - ${HEADER_OFFSET_PX}px)` }}
          >
            <div className="absolute left-0 right-0 top-0 z-20 flex justify-end px-4 pt-3 md:px-6">
              <div className="flex shrink-0 gap-1 rounded-lg bg-black/50 p-1 shadow-lg backdrop-blur-md">
                {offices.map((office, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveOfficeTab(index)}
                    className={`rounded-md px-3 py-2.5 text-sm font-semibold transition-all md:px-4 ${
                      activeOfficeTab === index
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {office.locationName}
                  </button>
                ))}
              </div>
            </div>

            {offices.map((office, index) =>
              office.address ? (
                <div
                  key={index}
                  className={`absolute inset-0 ${
                    activeOfficeTab === index
                      ? 'z-[1] opacity-100'
                      : 'pointer-events-none invisible z-0 opacity-0'
                  }`}
                  aria-hidden={activeOfficeTab !== index}
                >
                  <iframe
                    title={`${office.locationName} location`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(office.address)}&z=15&output=embed`}
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
              ) : null
            )}

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent via-black/55 to-black md:h-40"
              aria-hidden
            />
          </div>
        ) : (
          <div
            className="relative min-h-[40vh] w-full overflow-hidden"
            style={{ minHeight: 320 }}
          >
            <div className="flex items-center justify-center px-6 py-16 text-white/70">
              No office locations available.
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent via-black/55 to-black md:h-40"
              aria-hidden
            />
          </div>
        )}
      </div>

      {activeOffice && (
        <div className="border-t border-white/5 bg-black px-6 py-10">
          <div className="mx-auto max-w-6xl">
            <div
              className={`flex flex-col gap-8 ${
                affiliates?.length
                  ? 'md:flex-row md:items-start md:justify-between md:gap-12'
                  : ''
              }`}
            >
              <div
                className={`min-w-0 flex-1 ${
                  affiliates?.length ? 'text-center md:text-left' : 'text-center'
                }`}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                  Location
                </p>
                {activeOffice.address && (
                  <p className="text-base text-white/90">{activeOffice.address}</p>
                )}
                <p className="mt-3 text-white">
                  Phone:{' '}
                  <a
                    href={`tel:${activeOffice.phone}`}
                    className="text-blue-300 transition-colors hover:text-blue-200"
                  >
                    {activeOffice.phone}
                  </a>
                </p>
                {activeOffice.fax && (
                  <p className="mt-1 text-white/75">Fax: {activeOffice.fax}</p>
                )}
              </div>

              {affiliates && affiliates.length > 0 && (
                <div className="flex flex-col items-center gap-6 md:shrink-0 md:items-end">
                  {affiliates.map((affiliate, i) => (
                    <div
                      key={i}
                      className="flex max-w-md items-center gap-3 text-center md:max-w-sm md:text-right"
                    >
                      {affiliate.logo && urlFor(affiliate.logo) && (
                        <img
                          src={urlFor(affiliate.logo)
                            .width(200)
                            .quality(80)
                            .auto('format')
                            .url()}
                          alt={affiliate.name || ''}
                          className="h-10 shrink-0 object-contain md:h-11"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      <div className="min-w-0">
                        {affiliate.name && (
                          <p className="text-sm font-semibold text-white md:text-base">
                            {affiliate.name}
                          </p>
                        )}
                        {affiliate.description && (
                          <p className="mt-1 text-xs leading-snug text-white/70 md:text-sm">
                            {affiliate.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default memo(ContactMapSection)
