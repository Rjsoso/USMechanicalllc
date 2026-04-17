import { useState, memo, Fragment, useEffect, useRef } from 'react'
import { useSanityLive } from '../hooks/useSanityLive'
import { urlFor } from '../utils/sanity'

const CONTACT_MAP_QUERY = `*[_type == "contact" && _id == "contact"][0]{
  offices[]{ locationName, address, phone, fax },
  affiliates[]{ name, description, logo { asset-> { _id, url } } }
}`

/** Fixed header clearance — match Contact page / scroll offsets */
const HEADER_OFFSET_PX = 180

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

/** Split tagline / addresses: use `|` in Sanity or separate lines */
function affiliateDescriptionSegments(description) {
  if (!description?.trim()) return []
  const raw = description.trim()
  const byPipe = raw.split('|').map(s => s.trim()).filter(Boolean)
  if (byPipe.length > 1) return byPipe
  return raw.split(/\n+/).map(s => s.trim()).filter(Boolean)
}

/**
 * Full-viewport map, gradient, and location card for the home page `#contact` section.
 * All office maps stay mounted so tab switches are instant (no iframe reload).
 */
function ContactMapSection() {
  const [activeOfficeTab, setActiveOfficeTab] = useState(0)
  const [mapsEnabled, setMapsEnabled] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const sectionRef = useRef(null)
  const { data: contactData, loading } = useSanityLive(CONTACT_MAP_QUERY, {}, {
    listenFilter: `*[_type == "contact"]`,
  })

  const offices = contactData?.offices
  const affiliates = contactData?.affiliates
  const activeOffice =
    offices && offices.length > 0 ? offices[activeOfficeTab] : null

  useEffect(() => {
    setMapLoaded(false)
  }, [activeOfficeTab])

  useEffect(() => {
    const el = sectionRef.current
    if (!el || mapsEnabled) return

    // If we jumped directly to this section (hash navigation), enable immediately.
    const rect = el.getBoundingClientRect()
    const alreadyVisible = rect.bottom > 0 && rect.top < window.innerHeight
    if (alreadyVisible) {
      setMapsEnabled(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapsEnabled(true)
          io.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '200px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mapsEnabled])

  if (loading || !contactData) {
    return (
      <section
        id="contact"
        className="scroll-mt-[5.5rem] bg-black"
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
      ref={sectionRef}
      className="scroll-mt-[5.5rem] bg-black"
      aria-label="Contact locations"
    >
      <div className="w-full">
        {offices && offices.length > 0 ? (
          <div
            className="relative w-full min-h-[320px] overflow-hidden"
            style={{ height: `calc(100svh - ${HEADER_OFFSET_PX}px)` }}
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

            <div className="absolute inset-0 z-[1]">
              {activeOffice?.address ? (
                mapsEnabled ? (
                  <iframe
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
                    onLoad={() => setMapLoaded(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-black">
                    <div className="mx-auto max-w-xl px-6 text-center">
                      <p className="text-sm font-semibold uppercase tracking-wider text-white/50">
                        Map preview
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {officeTabButtonLabel(activeOffice.locationName)}
                      </p>
                      <p className="mt-2 text-sm text-white/70">{activeOffice.address}</p>
                      <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => setMapsEnabled(true)}
                          className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90"
                        >
                          Load interactive map
                        </button>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeOffice.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-blue-300 hover:text-blue-200"
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  </div>
                )
              ) : null}
            </div>

            {mapsEnabled && !mapLoaded && (
              <div
                className="absolute inset-0 z-[2] flex items-center justify-center bg-black/30 backdrop-blur-[1px]"
                aria-hidden
              >
                <div className="text-center text-white/80">
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      border: '3px solid rgba(255,255,255,0.18)',
                      borderTopColor: '#ffffff',
                      borderRadius: '50%',
                      margin: '0 auto 14px',
                      animation: 'mapSpinner 0.9s linear infinite',
                    }}
                  />
                  <p className="text-sm font-semibold">Loading map…</p>
                  <style>{`@keyframes mapSpinner { to { transform: rotate(360deg); } }`}</style>
                </div>
              </div>
            )}

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 md:h-40"
              style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.75) 60%, black 100%)' }}
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
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 md:h-40"
              style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.75) 60%, black 100%)' }}
              aria-hidden
            />
          </div>
        )}
      </div>

      {activeOffice && affiliates && affiliates.length > 0 && (
        <div className="bg-black px-4 py-5 md:px-8 md:py-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-5">
            {affiliates.map((affiliate, i) => {
              const segments = affiliateDescriptionSegments(affiliate.description)
              return (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm leading-snug md:justify-center md:gap-x-4 md:text-[15px]"
                >
                  <span
                    className="inline-flex h-5 w-4 shrink-0 items-center justify-start"
                    aria-hidden
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 md:text-xs">
                    Affiliate
                  </span>
                  {affiliate.logo && urlFor(affiliate.logo) && (
                    <img
                      src={urlFor(affiliate.logo)
                        .width(200)
                        .quality(80)
                        .auto('format')
                        .url()}
                      alt={affiliate.name ? `${affiliate.name} logo` : ''}
                      className="h-7 w-auto shrink-0 object-contain md:h-8"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  {affiliate.name && (
                    <span className="shrink-0 font-semibold text-white">{affiliate.name}</span>
                  )}
                  {segments.map((seg, j) => (
                    <Fragment key={j}>
                      <span className="text-neutral-500 select-none" aria-hidden>
                        ·
                      </span>
                      <span className="min-w-0 text-neutral-400">{seg}</span>
                    </Fragment>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

export default memo(ContactMapSection)
