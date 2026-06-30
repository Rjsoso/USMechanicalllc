import { urlFor } from '../utils/sanity'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { getSiteUrl } from '../utils/siteUrl'
import { useSanityLive } from '../hooks/useSanityLive'

const CAREERS_QUERY = `*[_type == "careers"][0]{
  mainHeading,
  jobTitle,
  jobOverview,
  jobDescription,
  qualifications,
  benefits,
  indeedUrl,
  "applicationPdfUrl": applicationPdf.asset->url,
  submissionEmail,
  submissionFax,
  backgroundImage,
  badgeImage {
    ...,
    asset->
  }
}`

export default function CareersPage() {
  const { data: careersData } = useSanityLive(CAREERS_QUERY, {}, {
    listenFilter: `*[_type == "careers"]`,
  })

  const heading = careersData?.mainHeading || 'Careers at U.S. Mechanical'
  const jobTitle = careersData?.jobTitle || 'Now hiring Plumbing and HVAC Installers'
  const jobOverview = careersData?.jobOverview || [
    'Full-time',
    'Entry- to mid-level experience',
    'Competitive pay and benefits',
  ]
  const jobDescription =
    careersData?.jobDescription ||
    'Demolish and install plumbing and HVAC systems in new commercial and institutional construction throughout the Intermountain West including Utah, Nevada and Wyoming.'
  const qualifications = careersData?.qualifications || [
    { item: '18 years or older (Required)', required: true },
    { item: 'US work authorization (Required)', required: true },
    { item: 'High school or equivalent (Preferred)', required: false },
    {
      item: 'Interest in plumbing, pipe fitting or sheet metal career (Preferred)',
      required: false,
    },
    { item: 'OSHA 10/30 card holder', required: false },
  ]
  const benefits = careersData?.benefits || [
    '$500 referral bonus',
    'Tuition reimbursement for apprentices',
    'Paid time off',
    'Free employee medical, dental, vision, and life insurance',
  ]
  const indeedUrl = careersData?.indeedUrl || 'https://www.indeed.com/cmp/U.s.-Mechanical,-LLC/jobs'
  const pdfUrl = careersData?.applicationPdfUrl || '/application.pdf'
  const submissionEmail = careersData?.submissionEmail || 'admin@usmechanicalllc.com'
  const submissionFax = careersData?.submissionFax || '(801) 785-6029'
  const backgroundImage = careersData?.backgroundImage
  const badgeImage = careersData?.badgeImage
  const badgeAlt = (badgeImage && badgeImage.alt) || 'PHCC Educational Foundation badge'

  // 1x / 2x variants keep the careers hero crisp on retina without bloating
  // bandwidth for standard-DPR clients.
  const backgroundImage1x = backgroundImage
    ? urlFor(backgroundImage).width(1920).quality(85).auto('format').fit('max').url()
    : null
  const backgroundImage2x = backgroundImage
    ? urlFor(backgroundImage).width(2880).quality(80).auto('format').fit('max').url()
    : null

  const badgeImage1x = badgeImage
    ? urlFor(badgeImage).width(400).quality(90).auto('format').fit('max').url()
    : '/images/phcc-education-foundation.png'
  const badgeImage2x = badgeImage
    ? urlFor(badgeImage).width(800).quality(85).auto('format').fit('max').url()
    : null

  // Render immediately - no loading check
  if (!careersData) {
    return (
      <>
        <SEO
          title="Careers - Join Our Team | US Mechanical"
          description="Join the U.S. Mechanical team. We're hiring skilled plumbing and HVAC installers. Competitive pay, great benefits, and career growth opportunities."
          keywords="mechanical contractor jobs, HVAC jobs Utah, plumbing jobs Nevada, construction careers, pipefitter jobs, sheet metal jobs, apprentice positions"
          url={`${getSiteUrl()}/careers`}
        />
        <Header />
        <div className="min-h-screen bg-white py-40 text-center text-black">Loading careers...</div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SEO
        title="Careers - Join Our Team | US Mechanical"
        description="Join the U.S. Mechanical team. We're hiring skilled plumbing and HVAC installers. Competitive pay, great benefits, and career growth opportunities in Utah, Nevada, and beyond."
        keywords="mechanical contractor jobs, HVAC jobs Utah, plumbing jobs Nevada, construction careers, pipefitter jobs, sheet metal jobs, apprentice positions, welding jobs"
        url={`${getSiteUrl()}/careers`}
      />
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="relative pb-24 pt-32 text-black"
        style={{
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          ...(backgroundImage1x && {
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), image-set(url("${backgroundImage1x}") 1x, url("${backgroundImage2x}") 2x)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }),
        }}
      >
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <h1 className="section-title mb-4 text-center text-5xl text-black md:text-6xl">
            {heading}
          </h1>

          <h2 className="mb-8 text-center text-2xl font-bold text-black md:text-3xl">
            {jobTitle}
          </h2>

          <div className="mb-8 text-center">
            <ul className="inline-block space-y-2 text-left text-lg">
              {jobOverview.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          <p className="mx-auto mb-10 max-w-3xl text-center text-lg leading-relaxed text-black">
            {jobDescription}
          </p>

          <div className="mb-10 grid gap-8 text-left md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xl font-bold text-black">Qualifications:</h3>
              <ul className="space-y-2 text-lg">
                {qualifications.map((qual, idx) => (
                  <li key={idx}>
                    • {qual.item} {qual.required ? '(Required)' : '(Preferred)'}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-bold text-black">Benefits:</h3>
              <ul className="space-y-2 text-lg">
                {benefits.map((benefit, idx) => (
                  <li key={idx}>• {benefit}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-6 flex flex-col justify-center gap-4 sm:flex-row">
            {indeedUrl && (
              <a
                href={indeedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-button-3d inline-block bg-black px-8 py-3 font-semibold text-white hover:bg-zinc-800"
              >
                Apply on Indeed
              </a>
            )}
            {pdfUrl && (
              <a
                href={pdfUrl}
                download
                className="hero-button-3d inline-block bg-black px-8 py-3 font-semibold text-white hover:bg-zinc-800"
              >
                Download Fillable PDF
              </a>
            )}
          </div>

          {badgeImage1x && (
            <div className="mt-10 flex flex-col items-center gap-3 text-center">
              <p className="text-sm uppercase tracking-wide text-gray-700">
                Training & Apprenticeships
              </p>
              <img
                src={badgeImage1x}
                srcSet={
                  badgeImage2x ? `${badgeImage1x} 1x, ${badgeImage2x} 2x` : undefined
                }
                alt={badgeAlt}
                className="h-24 w-auto rounded-md bg-white p-3 shadow-sm ring-1 ring-gray-200"
                loading="lazy"
              />
            </div>
          )}

          {(submissionEmail || submissionFax) && (
            <p className="text-center text-sm text-gray-600">
              {submissionEmail && `Email to ${submissionEmail}`}
              {submissionEmail && submissionFax && ' or '}
              {submissionFax && `fax to ${submissionFax}`}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
