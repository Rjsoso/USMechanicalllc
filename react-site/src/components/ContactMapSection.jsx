import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

            <AnimatePresence mode="wait">
              {offices.map((office, index) =>
                activeOfficeTab === index && office.address ? (
                  <motion.div
                    key={index}
                    className="absolute inset-0 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <iframe
                      title={`${office.locationName} location`}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(office.address)}&z=15&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0, display: 'block' }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                      className="h-full w-full"
                    />
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>

            {affiliates && affiliates.length > 0 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-4 pt-8 md:px-6 md:pb-6">
                <div className="pointer-events-auto mx-auto flex max-w-6xl flex-wrap items-end justify-end gap-x-8 gap-y-4">
                  {affiliates.map((affiliate, i) => (
                    <div
                      key={i}
                      className="flex max-w-[min(100%,280px)] items-center gap-3 rounded-lg bg-black/45 px-3 py-2 shadow-lg backdrop-blur-md"
                    >
                      {affiliate.logo && urlFor(affiliate.logo) && (
                        <img
                          src={urlFor(affiliate.logo)
                            .width(200)
                            .quality(80)
                            .auto('format')
                            .url()}
                          alt={affiliate.name || ''}
                          className="h-9 shrink-0 object-contain md:h-10"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      <div className="min-w-0 text-right">
                        {affiliate.name && (
                          <p className="text-xs font-semibold text-white md:text-sm">
                            {affiliate.name}
                          </p>
                        )}
                        {affiliate.description && (
                          <p className="mt-0.5 text-[10px] leading-snug text-white/75 md:text-xs">
                            {affiliate.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-6 text-center md:px-8">
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
          </div>
        </div>
      )}
    </section>
  )
}

export default memo(ContactMapSection)
