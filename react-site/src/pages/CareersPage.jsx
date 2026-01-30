import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { client, urlFor } from '../utils/sanity'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function CareersPage() {
  const [careersData, setCareersData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "careers"][0]{
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
        backgroundImage
      }`
      )
      .then(data => {
        setCareersData(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching careers data:', error)
        setLoading(false)
      })
  }, [])

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
    'Paid time off starts accruing after 90 days',
    'Free employee medical, dental, vision, and life insurance',
    'Up to 3.5% 401(k) match',
  ]
  const indeedUrl = careersData?.indeedUrl || 'https://www.indeed.com/cmp/U.s.-Mechanical,-LLC/jobs'
  const pdfUrl = careersData?.applicationPdfUrl || '/application.pdf'
  const submissionEmail = careersData?.submissionEmail || 'admin@usmechanicalllc.com'
  const submissionFax = careersData?.submissionFax || '(801) 785-6029'
  const backgroundImage = careersData?.backgroundImage

  const backgroundImageUrl = backgroundImage
    ? urlFor(backgroundImage).width(1920).quality(90).url()
    : null

  if (loading) {
    return (
      <>
        <SEO
          title="Careers - Join Our Team | US Mechanical"
          description="Join the U.S. Mechanical team. We're hiring skilled plumbing and HVAC installers. Competitive pay, great benefits, and career growth opportunities."
          keywords="mechanical contractor jobs, HVAC jobs Utah, plumbing jobs Nevada, construction careers, pipefitter jobs, sheet metal jobs, apprentice positions"
          url="https://usmechanical.com/careers"
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
        url="https://usmechanical.com/careers"
      />
      <Header />

      <main
        className="relative pb-24 pt-32 text-black"
        style={{
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
          ...(backgroundImageUrl && {
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }),
        }}
      >
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <motion.h1
            className="section-title mb-4 text-center text-5xl text-black md:text-6xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {heading}
          </motion.h1>

          <motion.h2
            className="mb-8 text-center text-2xl font-bold text-black md:text-3xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {jobTitle}
          </motion.h2>

          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="inline-block space-y-2 text-left text-lg">
              {jobOverview.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.p
            className="mx-auto mb-10 max-w-3xl text-center text-lg leading-relaxed text-black"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {jobDescription}
          </motion.p>

          <div className="mb-10 grid gap-8 text-left md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="mb-4 text-xl font-bold text-black">Qualifications:</h3>
              <ul className="space-y-2 text-lg">
                {qualifications.map((qual, idx) => (
                  <li key={idx}>
                    • {qual.item} {qual.required ? '(Required)' : '(Preferred)'}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="mb-4 text-xl font-bold text-black">Benefits:</h3>
              <ul className="space-y-2 text-lg">
                {benefits.map((benefit, idx) => (
                  <li key={idx}>• {benefit}</li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="mb-6 flex flex-col justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
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
          </motion.div>

          {(submissionEmail || submissionFax) && (
            <motion.p
              className="text-center text-sm text-gray-600"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {submissionEmail && `Email to ${submissionEmail}`}
              {submissionEmail && submissionFax && ' or '}
              {submissionFax && `fax to ${submissionFax}`}
            </motion.p>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
