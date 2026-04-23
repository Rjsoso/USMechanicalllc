import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getSiteUrl } from '../utils/siteUrl'

export default function Attributions() {
  return (
    <>
      <SEO
        title="Attributions | US Mechanical"
        description="Attribution for third-party icons and media used on the U.S. Mechanical LLC website."
        url={`${getSiteUrl()}/attributions`}
      />
      <Header />
      <motion.main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-white text-black"
        style={{ paddingTop: '180px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="section-title mb-4 text-4xl font-bold text-black md:text-5xl">
            Attributions
          </h1>
          <p className="mb-10 leading-relaxed text-gray-600">
            The following third-party works are used on this site. We thank the authors.
          </p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-black">Why US Mechanical section (homepage)</h2>
              <ul className="list-disc space-y-3 pl-5 leading-relaxed">
                <li>
                  <span className="font-medium text-gray-800">Experience / family (60+ years)</span> — Family icons by{' '}
                  <a
                    className="text-primary-red underline hover:no-underline"
                    href="https://www.flaticon.com/free-icons/family"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Freepik
                  </a>
                  , available on{' '}
                  <a
                    className="text-primary-red underline hover:no-underline"
                    href="https://www.flaticon.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Flaticon
                  </a>
                  .
                </li>
                <li>
                  <span className="font-medium text-gray-800">Map location</span> — Map location icons by{' '}
                  <a
                    className="text-primary-red underline hover:no-underline"
                    href="https://www.flaticon.com/free-icons/map-location"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Manuel Viveros
                  </a>
                  , available on{' '}
                  <a
                    className="text-primary-red underline hover:no-underline"
                    href="https://www.flaticon.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Flaticon
                  </a>
                  .
                </li>
                <li>
                  <span className="font-medium text-gray-800">Coverage (service area)</span> — Coverage icons by{' '}
                  <a
                    className="text-primary-red underline hover:no-underline"
                    href="https://www.flaticon.com/free-icons/coverage"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Aranagraphics
                  </a>
                  , available on{' '}
                  <a
                    className="text-primary-red underline hover:no-underline"
                    href="https://www.flaticon.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Flaticon
                  </a>
                  .
                </li>
                <li>
                  <span className="font-medium text-gray-800">Parcel / delivery</span> — Parcel icons by{' '}
                  <a
                    className="text-primary-red underline hover:no-underline"
                    href="https://www.flaticon.com/free-icons/parcel"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Atif Arshad
                  </a>
                  , available on{' '}
                  <a
                    className="text-primary-red underline hover:no-underline"
                    href="https://www.flaticon.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Flaticon
                  </a>
                  .
                </li>
                <li>
                  <span className="font-medium text-gray-800">Safety (shield)</span> — Safe icons by{' '}
                  <a
                    className="text-primary-red underline hover:no-underline"
                    href="https://www.flaticon.com/free-icons/safe"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Arkinasi
                  </a>
                  , available on{' '}
                  <a
                    className="text-primary-red underline hover:no-underline"
                    href="https://www.flaticon.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Flaticon
                  </a>
                  .
                </li>
                <li>
                  <span className="font-medium text-gray-800">Capacity / bonding (economic)</span> — Economic icons by{' '}
                  <a
                    className="text-primary-red underline hover:no-underline"
                    href="https://www.flaticon.com/free-icons/economic"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Anggara
                  </a>
                  , available on{' '}
                  <a
                    className="text-primary-red underline hover:no-underline"
                    href="https://www.flaticon.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Flaticon
                  </a>
                  .
                </li>
              </ul>
            </section>

            <p>
              <Link
                to="/"
                className="text-primary-red font-medium underline transition hover:no-underline"
              >
                ← Back to home
              </Link>
            </p>
          </div>
        </div>
      </motion.main>
      <Footer />
    </>
  )
}
