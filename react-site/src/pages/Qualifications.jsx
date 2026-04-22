import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { urlFor } from '../utils/sanity'
import { useSanityLive } from '../hooks/useSanityLive'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { getSiteUrl } from '../utils/siteUrl'

/**
 * Pre-qualification landing page. Built for general contractors, owners, and
 * surety agents who need to vet U.S. Mechanical quickly. Every data point
 * on this page is editable in Sanity Studio under:
 *   Qualifications & Credentials → Company Credentials / Key Personnel.
 *
 * Safety logos reuse the existing `aboutAndSafety` document so there's a
 * single source of truth for them.
 */

const CREDENTIALS_QUERY = `*[_type == "companyCredentials" && _id == "companyCredentials"][0]{
  pageTitle,
  pageSubtitle,
  stateLicenses[]{
    state, stateFullName, licenseNumber, classification
  },
  bondingSinglePerProject,
  bondingAggregate,
  suretyCompany,
  suretyAgent,
  emr,
  emrYear,
  safetyNarrative,
  insuranceSummary[]{
    label, limit
  },
  prequalContactName,
  prequalContactTitle,
  prequalContactEmail,
  prequalContactPhone,
  prequalNotes
}`

const PERSONNEL_QUERY = `*[_type == "keyPerson" && featured == true] | order(coalesce(order, 999) asc, name asc){
  _id, name, title, bio, certifications, yearsExperience, email,
  photo { asset-> { _id, url }, alt }
}`

const SAFETY_LOGOS_QUERY = `*[_type == "aboutAndSafety"] | order(_updatedAt desc)[0]{
  safetyLogos[]{ image { asset-> { _id, url }, alt }, icon, title, href }
}`

const COMPANY_STATS_QUERY = `*[_type == "companyStats" && _id == "companyStats"][0]{
  stats[]{ label, value }
}`

function StatCard({ value, label }) {
  if (!value) return null
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
      <div className="text-3xl font-extrabold tracking-tight text-red-500 md:text-4xl">
        {value}
      </div>
      <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 md:text-sm">
        {label}
      </div>
    </div>
  )
}

export default function Qualifications() {
  const { data: credentials } = useSanityLive(CREDENTIALS_QUERY, {}, {
    listenFilter: `*[_type == "companyCredentials"]`,
  })
  const { data: personnel } = useSanityLive(PERSONNEL_QUERY, {}, {
    listenFilter: `*[_type == "keyPerson"]`,
  })
  const { data: safety } = useSanityLive(SAFETY_LOGOS_QUERY, {}, {
    listenFilter: `*[_type == "aboutAndSafety"]`,
  })
  const { data: statsDoc } = useSanityLive(COMPANY_STATS_QUERY, {}, {
    listenFilter: `*[_type == "companyStats"]`,
  })

  const pageTitle = credentials?.pageTitle || 'Qualifications & Credentials'
  const pageSubtitle =
    credentials?.pageSubtitle ||
    'Everything a general contractor, owner, or surety agent needs to pre-qualify U.S. Mechanical for your next project.'

  // Default fallbacks for a brand-new install. Real values are edited in Sanity.
  const licenses = useMemo(() => {
    if (Array.isArray(credentials?.stateLicenses) && credentials.stateLicenses.length > 0) {
      return credentials.stateLicenses
    }
    return [
      { state: 'UT', stateFullName: 'Utah', licenseNumber: '' },
      { state: 'NV', stateFullName: 'Nevada', licenseNumber: '' },
      { state: 'AZ', stateFullName: 'Arizona', licenseNumber: '' },
      { state: 'CA', stateFullName: 'California', licenseNumber: '' },
      { state: 'WY', stateFullName: 'Wyoming', licenseNumber: '' },
    ]
  }, [credentials?.stateLicenses])

  const single = credentials?.bondingSinglePerProject || '$35 Million'
  const aggregate = credentials?.bondingAggregate || '$150 Million'
  const emr = credentials?.emr || null
  const emrYear = credentials?.emrYear || null
  const surety = credentials?.suretyCompany
  const suretyAgent = credentials?.suretyAgent

  const safetyLogos = Array.isArray(safety?.safetyLogos) ? safety.safetyLogos : []
  const insurance = Array.isArray(credentials?.insuranceSummary)
    ? credentials.insuranceSummary
    : []

  const statsRaw = statsDoc?.stats
  const statsFromDoc = useMemo(
    () => (Array.isArray(statsRaw) ? statsRaw : []),
    [statsRaw]
  )

  const featuredStats = useMemo(() => {
    // Show up to four headline facts at the top of the page. Prefer the
    // explicit Sanity stats (so the office can control the exact wording)
    // and fall back to hard-coded credentials-derived facts.
    if (statsFromDoc.length >= 3) return statsFromDoc.slice(0, 4)
    return [
      { value: '60+', label: 'Years in business' },
      { value: single, label: 'Single-project bond' },
      { value: aggregate, label: 'Aggregate bonding' },
      { value: `${licenses.length}`, label: 'State licenses' },
    ]
  }, [statsFromDoc, single, aggregate, licenses.length])

  return (
    <>
      <SEO
        title="Qualifications & Credentials | US Mechanical"
        description="Pre-qualification data for U.S. Mechanical: state licensing, bonding capacity, EMR, insurance coverage, key personnel, and how to request a bid."
        keywords="mechanical contractor qualifications, bonding capacity, EMR, state licensed mechanical contractor, prequalification, Utah Nevada mechanical contractor"
        url={`${getSiteUrl()}/qualifications`}
      />
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="bg-neutral-950 text-white"
      >
        {/* HERO */}
        <section className="border-b border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
              For General Contractors, Owners & Surety Agents
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              {pageTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base text-white/80 md:text-lg">
              {pageSubtitle}
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {featuredStats.map((stat, i) => (
                <StatCard key={i} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </section>

        {/* LICENSING */}
        <section className="bg-white px-6 py-16 text-neutral-900 md:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Licensing</h2>
            <p className="mt-2 text-neutral-600">
              U.S. Mechanical is fully licensed, bonded, and insured in the following jurisdictions.
            </p>

            <div className="mt-8 overflow-hidden rounded-xl border border-neutral-200">
              <table className="w-full text-left">
                <thead className="bg-neutral-100 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  <tr>
                    <th className="px-5 py-3">State</th>
                    <th className="px-5 py-3">License #</th>
                    <th className="hidden px-5 py-3 md:table-cell">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-sm">
                  {licenses.map((lic, i) => (
                    <tr key={i}>
                      <td className="px-5 py-3 font-semibold text-neutral-900">
                        {lic.stateFullName || lic.state}
                      </td>
                      <td className="px-5 py-3 font-mono text-neutral-800">
                        {lic.licenseNumber || <span className="text-neutral-400">—</span>}
                      </td>
                      <td className="hidden px-5 py-3 text-neutral-700 md:table-cell">
                        {lic.classification || <span className="text-neutral-400">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* BONDING */}
        <section className="bg-neutral-950 px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Bonding Capacity</h2>
              <p className="mt-3 text-white/75">
                Current bonding capacity on single and aggregate projects. Surety verification
                available upon request.
              </p>

              <dl className="mt-8 space-y-5">
                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Single project
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-red-500">{single}</dd>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-white/60">
                    Aggregate
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-red-500">{aggregate}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">Surety</h3>
              {surety ? (
                <p className="mt-2 text-white/80">{surety}</p>
              ) : (
                <p className="mt-2 text-white/60">Available upon request.</p>
              )}
              {suretyAgent && (
                <div className="mt-6 whitespace-pre-line rounded-lg border border-white/10 bg-white/5 p-5 text-sm text-white/85">
                  {suretyAgent}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SAFETY */}
        <section className="bg-white px-6 py-16 text-neutral-900 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Safety Record</h2>
                {emr ? (
                  <div className="mt-6 rounded-lg bg-neutral-100 p-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      Experience Modification Rate
                    </div>
                    <div className="mt-1 text-4xl font-extrabold text-red-600">{emr}</div>
                    {emrYear && (
                      <div className="mt-1 text-sm text-neutral-500">Effective {emrYear}</div>
                    )}
                  </div>
                ) : (
                  <p className="mt-6 text-neutral-600">
                    Experience Modification Rate available upon request.
                  </p>
                )}

                {credentials?.safetyNarrative ? (
                  <p className="mt-6 whitespace-pre-line text-neutral-700">
                    {credentials.safetyNarrative}
                  </p>
                ) : (
                  <p className="mt-6 text-neutral-700">
                    U.S. Mechanical employs a full-time safety manager accredited by OSHA and
                    MSHA, with site-specific safety programs and company-wide PPE incentives
                    that have held our EMR below the national average.
                  </p>
                )}
              </div>

              {safetyLogos.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold">Safety Credentials</h3>
                  <p className="mt-2 text-sm text-neutral-600">
                    Programs and certifications we maintain.
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4">
                    {safetyLogos.map((logo, i) => {
                      const url = logo.image?.asset?.url
                      if (!url) return null
                      const content = (
                        <img
                          src={url}
                          alt={logo.image?.alt || logo.title || 'Safety credential'}
                          loading="lazy"
                          decoding="async"
                          className="h-16 w-auto object-contain"
                        />
                      )
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-center rounded-lg border border-neutral-200 bg-white p-4"
                          title={logo.title || ''}
                        >
                          {logo.href ? (
                            <a href={logo.href} target="_blank" rel="noopener noreferrer">
                              {content}
                            </a>
                          ) : (
                            content
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* INSURANCE */}
        {insurance.length > 0 && (
          <section className="bg-neutral-950 px-6 py-16 md:py-20">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Insurance Coverage</h2>
              <p className="mt-2 text-white/75">
                Certificate of insurance available upon request.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {insurance.map((row, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-white/10 bg-white/5 p-5"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      {row.label}
                    </div>
                    <div className="mt-1 text-lg font-semibold text-white">
                      {row.limit || 'Upon request'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* KEY PERSONNEL */}
        {Array.isArray(personnel) && personnel.length > 0 && (
          <section className="bg-white px-6 py-16 text-neutral-900 md:py-20">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Key Personnel</h2>
              <p className="mt-2 max-w-2xl text-neutral-600">
                The senior team responsible for preconstruction, execution, and safety on every
                U.S. Mechanical project.
              </p>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {personnel.map((p) => {
                  const photoUrl = p.photo?.asset?.url
                    ? p.photo.asset.url
                    : p.photo
                    ? urlFor(p.photo).width(600).height(600).fit('crop').auto('format').url()
                    : null
                  return (
                    <article
                      key={p._id}
                      className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={p.photo?.alt || `${p.name}, ${p.title}`}
                          loading="lazy"
                          decoding="async"
                          className="aspect-square w-full object-cover"
                          width={600}
                          height={600}
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="flex aspect-square w-full items-center justify-center bg-neutral-100 text-4xl font-bold text-neutral-400"
                        >
                          {(p.name || '?').charAt(0)}
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-neutral-900">{p.name}</h3>
                        <p className="mt-1 text-sm font-medium text-red-600">{p.title}</p>

                        {typeof p.yearsExperience === 'number' && p.yearsExperience > 0 && (
                          <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
                            {p.yearsExperience}+ years in industry
                          </p>
                        )}

                        {p.bio && (
                          <p className="mt-3 text-sm leading-relaxed text-neutral-700">{p.bio}</p>
                        )}

                        {Array.isArray(p.certifications) && p.certifications.length > 0 && (
                          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Certifications">
                            {p.certifications.map((cert, i) => (
                              <li
                                key={i}
                                className="rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-800"
                              >
                                {cert}
                              </li>
                            ))}
                          </ul>
                        )}

                        {p.email && (
                          <a
                            href={`mailto:${p.email}`}
                            className="mt-5 inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700"
                          >
                            {p.email}
                          </a>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* PREQUAL CTA */}
        <section className="bg-gradient-to-b from-neutral-950 to-black px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Request a Prequalification Packet
            </h2>
            <p className="mt-3 text-white/80">
              Need W-9, certificates of insurance, bond letter, safety manual, or a signed
              prequalification questionnaire? Contact our prequalification desk directly.
            </p>

            {(credentials?.prequalContactName ||
              credentials?.prequalContactEmail ||
              credentials?.prequalContactPhone) && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {credentials.prequalContactName && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      Contact
                    </div>
                    <div className="mt-1 text-lg font-semibold text-white">
                      {credentials.prequalContactName}
                    </div>
                    {credentials.prequalContactTitle && (
                      <div className="text-sm text-white/70">{credentials.prequalContactTitle}</div>
                    )}
                  </div>
                )}
                <div className="space-y-1 text-sm">
                  {credentials.prequalContactEmail && (
                    <div>
                      <span className="text-white/60">Email: </span>
                      <a
                        href={`mailto:${credentials.prequalContactEmail}`}
                        className="font-semibold text-red-400 hover:text-red-300"
                      >
                        {credentials.prequalContactEmail}
                      </a>
                    </div>
                  )}
                  {credentials.prequalContactPhone && (
                    <div>
                      <span className="text-white/60">Phone: </span>
                      <a
                        href={`tel:${credentials.prequalContactPhone.replace(/[^0-9+]/g, '')}`}
                        className="font-semibold text-white hover:text-red-300"
                      >
                        {credentials.prequalContactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {credentials?.prequalNotes && (
              <p className="mt-6 whitespace-pre-line text-sm text-white/75">
                {credentials.prequalNotes}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-red-700"
              >
                Start a project inquiry
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                See our work
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
