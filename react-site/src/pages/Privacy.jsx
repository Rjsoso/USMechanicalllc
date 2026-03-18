import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Privacy() {
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
            Privacy Policy
          </h1>
          <p className="mb-12 text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-10 text-gray-700">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Information We Collect</h2>
              <p className="leading-relaxed">
                [Placeholder: Describe what information you collect—e.g., contact form (name, email, phone, message), analytics, cookies—and the legal basis if applicable.]
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">How We Use Your Information</h2>
              <p className="leading-relaxed">
                [Placeholder: Describe how you use the data—e.g., to respond to inquiries, improve the site, comply with legal obligations.]
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Cookies and Tracking</h2>
              <p className="leading-relaxed">
                [Placeholder: Describe use of cookies, analytics (e.g., Google Analytics), and any third-party tools. Include how users can manage preferences if applicable.]
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Data Retention and Security</h2>
              <p className="leading-relaxed">
                [Placeholder: How long you keep data and what security measures you take.]
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Your Rights</h2>
              <p className="leading-relaxed">
                [Placeholder: User rights under applicable law (e.g., access, correction, deletion, opt-out). Mention jurisdiction if relevant—e.g., CCPA, GDPR.]
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Contact</h2>
              <p className="leading-relaxed">
                [Placeholder: How to contact you for privacy-related questions or to exercise rights. You may link to the Contact page or provide an email.]
              </p>
            </section>
          </div>
        </div>
      </motion.main>
      <Footer />
    </>
  )
}
