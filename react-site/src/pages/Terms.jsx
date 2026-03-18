import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms of Service | US Mechanical"
        description="Terms of service for use of the U.S. Mechanical LLC website."
        url="https://usmechanical.com/terms"
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
            Terms of Service
          </h1>
          <p className="mb-12 text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-10 text-gray-700">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Acceptance of Terms</h2>
              <p className="leading-relaxed">
                [Placeholder: By using this website, you agree to these terms. Describe scope (e.g., use of usmechanical.com).]
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Use of the Website</h2>
              <p className="leading-relaxed">
                [Placeholder: Permitted use (e.g., informational, contacting the company). Prohibited uses (e.g., unlawful activity, scraping, misrepresentation).]
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Intellectual Property</h2>
              <p className="leading-relaxed">
                [Placeholder: Ownership of content, logos, and materials on the site. Limited license to view/use for personal or business inquiry purposes.]
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Disclaimers</h2>
              <p className="leading-relaxed">
                [Placeholder: Site provided “as is.” No warranty as to accuracy or completeness of information. Contracting services are subject to separate agreements.]
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Limitation of Liability</h2>
              <p className="leading-relaxed">
                [Placeholder: To the extent permitted by law, limitation of liability for use of the website. Jurisdiction-specific language may be required.]
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Governing Law</h2>
              <p className="leading-relaxed">
                [Placeholder: State/country whose laws govern (e.g., Utah, United States).]
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Changes and Contact</h2>
              <p className="leading-relaxed">
                [Placeholder: We may update these terms; continued use constitutes acceptance. How to contact for questions (e.g., link to Contact page).]
              </p>
            </section>
          </div>
        </div>
      </motion.main>
      <Footer />
    </>
  )
}
