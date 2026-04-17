import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import SEO from '../components/SEO'
import PageShell from '../components/PageShell'
import { getSiteUrl } from '../utils/siteUrl'
import { useSanityLive } from '../hooks/useSanityLive'

const TERMS_QUERY = `*[_id == "legalTerms" && !(_id in path("drafts.**"))][0]{
  title,
  lastUpdated,
  _updatedAt,
  body
}`

function TermsFallbackContent() {
  return (
    <div className="space-y-10 text-gray-700">
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">Acceptance of Terms</h2>
        <p className="leading-relaxed">
          By accessing or using the website of U.S. Mechanical LLC (“we,” “us,” or “our”) at usmechanical.com (the “Site”), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">Use of the Website</h2>
        <p className="leading-relaxed">
          You may use the Site for lawful purposes only, including to learn about our mechanical contracting services and to contact us. You may not use the Site to transmit any harmful, offensive, or unlawful material; to attempt to gain unauthorized access to any systems or data; to scrape or harvest data without permission; or to misrepresent your identity or affiliation. We reserve the right to restrict or terminate access for any reason.
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">Intellectual Property</h2>
        <p className="leading-relaxed">
          The Site and its content, including text, graphics, logos, and images, are owned by U.S. Mechanical LLC or its licensors and are protected by copyright and other intellectual property laws. You may view and use the Site for personal or business inquiry purposes only. You may not copy, modify, distribute, or use our content for commercial purposes without our prior written consent.
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">Disclaimers</h2>
        <p className="leading-relaxed">
          The Site and its content are provided “as is.” We do not warrant that the Site will be uninterrupted, error-free, or free of viruses. Information on the Site is for general purposes only and may not be complete or current. Contracting services are subject to separate agreements and are not governed by these Terms.
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">Limitation of Liability</h2>
        <p className="leading-relaxed">
          To the fullest extent permitted by applicable law, U.S. Mechanical LLC and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of the Site. Our total liability for any claims related to the Site shall not exceed one hundred dollars ($100).
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">Governing Law</h2>
        <p className="leading-relaxed">
          These Terms are governed by the laws of the State of Utah, United States, without regard to conflict of law principles. Any disputes shall be resolved in the state or federal courts located in Utah.
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">Changes and Contact</h2>
        <p className="leading-relaxed">
          We may update these Terms from time to time. The “Last updated” date at the top of this page will reflect the most recent changes. Continued use of the Site after changes constitutes acceptance of the revised Terms. For questions about these Terms, please contact us via our <Link to="/contact" className="text-primary-red underline hover:no-underline">Contact</Link> page or at U.S. Mechanical LLC, 472 South 640 West, Pleasant Grove, UT 84062.
        </p>
      </section>
    </div>
  )
}

export default function Terms() {
  const { data, loading } = useSanityLive(TERMS_QUERY, {}, {
    listenFilter: '*[_id == "legalTerms"]',
  })

  const hasSanityContent = data?.body && Array.isArray(data.body) && data.body.length > 0
  const displayTitle = data?.title || 'Terms of Service'
  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : data?._updatedAt
      ? new Date(data._updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      <SEO
        title="Terms of Service | US Mechanical"
        description="Terms of service for use of the U.S. Mechanical LLC website."
        url={`${getSiteUrl()}/terms`}
      />
      <PageShell
        Main={motion.main}
        className="min-h-screen bg-white text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="section-title mb-2 text-4xl font-bold text-black md:text-5xl">
            {displayTitle}
          </h1>
          <p className="mb-12 text-gray-600">
            Last updated: {lastUpdated}
          </p>

          {loading ? (
            <p className="text-gray-500">Loading…</p>
          ) : hasSanityContent ? (
            <div className="prose prose-lg max-w-none text-gray-700">
              <PortableText
                value={data.body}
                components={{
                  marks: {
                    link: ({ value, children }) => {
                      const href = value?.href || ''
                      if (href.startsWith('/') && !href.startsWith('//')) {
                        return <Link to={href} className="text-primary-red underline hover:no-underline">{children}</Link>
                      }
                      return <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-red underline hover:no-underline">{children}</a>
                    },
                  },
                }}
              />
            </div>
          ) : (
            <TermsFallbackContent />
          )}
        </div>
      </PageShell>
    </>
  )
}
