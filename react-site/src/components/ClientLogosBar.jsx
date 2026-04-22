import { memo, useMemo } from 'react'
import { urlFor } from '../utils/sanity'
import { useSanityLive } from '../hooks/useSanityLive'

/**
 * "Who we build for" — horizontal strip of featured client / GC / owner logos.
 *
 * Renders nothing until at least one featured logo exists in Sanity, so the
 * home page stays clean on a fresh install. Editors add logos via
 * Studio → Qualifications & Credentials → Client / Project Logos.
 *
 * Logos fade to grayscale by default and restore colour on hover so the
 * strip reads as one cohesive trust bar, not a jumble of mismatched brands.
 */
const CLIENT_LOGOS_QUERY = `*[_type == "clientLogo" && featured == true] | order(coalesce(order, 999) asc, name asc){
  _id,
  name,
  website,
  logo { asset-> { _id, url }, alt }
}`

function ClientLogosBar() {
  const { data } = useSanityLive(CLIENT_LOGOS_QUERY, {}, {
    listenFilter: `*[_type == "clientLogo"]`,
  })

  const logos = useMemo(() => (Array.isArray(data) ? data : []), [data])

  if (logos.length === 0) return null

  return (
    <section
      className="bg-white py-12 md:py-16"
      aria-labelledby="client-logos-heading"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2
          id="client-logos-heading"
          className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 md:text-sm"
        >
          Trusted by general contractors and owners across the West
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14 lg:gap-x-16">
          {logos.map((logo) => {
            const url = logo.logo?.asset?.url
              ? logo.logo.asset.url
              : logo.logo
              ? urlFor(logo.logo).width(320).fit('max').auto('format').url()
              : null

            if (!url) return null

            const alt = logo.logo?.alt || logo.name || 'Client logo'
            const img = (
              <img
                src={url}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="h-10 w-auto max-w-[160px] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-12 md:max-w-[180px]"
              />
            )

            return (
              <div key={logo._id} title={logo.name}>
                {logo.website ? (
                  <a
                    href={logo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${logo.name} (opens in a new tab)`}
                  >
                    {img}
                  </a>
                ) : (
                  img
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default memo(ClientLogosBar)
