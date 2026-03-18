import { motion } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import SEO from '../components/SEO'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useSanityLive } from '../hooks/useSanityLive'

const PRIVACY_QUERY = `*[_id == "legalPrivacy" && !(_id in path("drafts.**"))][0]{
  title,
  lastUpdated,
  _updatedAt,
  body
}`

function PrivacyFallbackContent() {
  return (
    <div className="space-y-10 text-gray-700">
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">Information We Collect</h2>
        <p className="leading-relaxed">
          When you use our website, we may collect information you provide directly, such as when you fill out our contact form. That may include your name, email address, phone number, and the content of your message. We may also automatically collect certain technical information when you visit our site, such as your IP address, browser type, and pages visited. If we use cookies or similar technologies, we use them to operate and improve the site and, if applicable, to understand how visitors use our site.
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">How We Use Your Information</h2>
        <p className="leading-relaxed">
          We use the information we collect to respond to your inquiries, provide information about our mechanical contracting services, improve our website, and comply with applicable law. We do not sell your personal information. We may share information with service providers who assist us in operating our website or our business (for example, hosting or email delivery), subject to confidentiality obligations.
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">Cookies and Tracking</h2>
        <p className="leading-relaxed">
          Our website may use cookies and similar technologies to support functionality and, if applicable, analytics. You can control cookies through your browser settings. Disabling certain cookies may affect how the site works.
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">Data Retention and Security</h2>
        <p className="leading-relaxed">
          We retain your information for as long as needed to fulfill the purposes described in this policy or as required by law. We take reasonable steps to protect your information from unauthorized access, use, or disclosure.
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">Your Rights</h2>
        <p className="leading-relaxed">
          Depending on where you live, you may have rights to access, correct, or delete your personal information, or to opt out of certain uses. To exercise these rights or ask questions about our practices, please contact us using the information below.
        </p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold text-black">Contact</h2>
        <p className="leading-relaxed">
          For privacy-related questions or to exercise your rights, please contact us via our <a href="/contact" className="text-primary-red underline hover:no-underline">Contact</a> page or by mail at: U.S. Mechanical LLC, 472 South 640 West, Pleasant Grove, UT 84062.
        </p>
      </section>
    </div>
  )
}

export default function Privacy() {
  const { data, loading } = useSanityLive(PRIVACY_QUERY, {}, {
    listenFilter: '*[_id == "legalPrivacy"]',
  })

  const hasSanityContent = data?.body && Array.isArray(data.body) && data.body.length > 0
  const displayTitle = data?.title || 'Privacy Policy'
  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : data?._updatedAt
      ? new Date(data._updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      <SEO
        title="Privacy Policy | US Mechanical"
        description="Privacy policy for U.S. Mechanical LLC. Learn how we collect, use, and protect your information."
        url="https://usmechanical.com/privacy"
      />
      <Header />
      <motion.main
        className="min-h-screen bg-white text-black"
        style={{ paddingTop: '180px' }}
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
              <PortableText value={data.body} />
            </div>
          ) : (
            <PrivacyFallbackContent />
          )}
        </div>
      </motion.main>
      <Footer />
    </>
  )
}
