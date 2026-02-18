import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { client } from '../utils/sanity'
import { viewportPreset } from '../utils/viewport'
import { PortableText } from '@portabletext/react'
import SEO from '../components/SEO'
import Header from '../components/Header'
import Footer from '../components/Footer'

const badgeToneClasses = {
  sky: 'bg-sky-100 text-sky-800 border-sky-300',
  amber: 'bg-amber-100 text-amber-800 border-amber-300',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  pink: 'bg-pink-100 text-pink-800 border-pink-300',
  slate: 'bg-gray-100 text-gray-700 border-gray-300',
}

export default function DeliveryMethodsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "ourServices"][0]{
          deliveryMethodsHeading,
          deliveryMethods[] {
            title, summary, badge, badgeTone,
            backgroundImage { asset-> { url, _id }, alt },
            body
          }
        }`
      )
      .then(result => {
        if (!result) {
          setError('Could not load delivery methods.')
          return
        }
        setData(result)
      })
      .catch(err => {
        console.error('[DeliveryMethodsPage] Fetch error:', err)
        setError('Failed to load delivery methods.')
      })
  }, [])

  if (error) {
    return (
      <>
        <Header />
        <div
          className="flex min-h-screen items-center justify-center bg-white text-black"
          style={{ paddingTop: '180px' }}
        >
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">Something went wrong</h1>
            <p className="mb-8 text-gray-600">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Go Back Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const heading = data?.deliveryMethodsHeading || 'Delivery Methods'
  const methods = data?.deliveryMethods || []

  return (
    <>
      <SEO
        title={`${heading} | US Mechanical`}
        description="Explore our delivery methods — from design-build and design-bid-build to integrated project delivery. US Mechanical has the right approach for every project."
        url="https://usmechanical.com/delivery-methods"
      />
      <Header />
      <motion.main
        className="min-h-screen bg-white text-black"
        style={{ paddingTop: '180px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          {/* Back navigation */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/', { state: { scrollTo: 'services' } })}
              className="flex items-center gap-2 text-black transition-colors hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Services
            </button>
          </div>

          {/* Page heading */}
          <motion.h1
            className="section-title mb-4 text-5xl text-black md:text-6xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {heading}
          </motion.h1>
          <motion.p
            className="mb-16 text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            Choose the project delivery approach that fits your goals, timeline, and team structure.
          </motion.p>

          {/* Delivery method cards */}
          {!data ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-gray-400 text-lg">Loading…</p>
            </div>
          ) : (
            <div className="space-y-10">
              {methods.map((method, index) => {
                const bgUrl = method?.backgroundImage?.asset?.url
                  ? `${method.backgroundImage.asset.url}?w=1400&q=80&auto=format`
                  : null
                const badgeClass =
                  badgeToneClasses[method?.badgeTone] || badgeToneClasses.slate

                return (
                  <motion.div
                    key={index}
                    className="overflow-hidden border border-gray-200 shadow-sm"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportPreset}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                  >
                    {/* Card header with optional background image */}
                    <div
                      className="relative flex items-end px-8 py-10"
                      style={
                        bgUrl
                          ? {
                              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${bgUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              minHeight: '180px',
                            }
                          : { backgroundColor: '#111111', minHeight: '120px' }
                      }
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-5xl font-bold text-white/30 leading-none select-none">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h2 className="text-2xl font-bold text-white md:text-3xl">
                            {method.title}
                          </h2>
                          {method.badge && (
                            <span
                              className={`mt-2 inline-flex items-center border px-2.5 py-0.5 text-[11px] font-semibold ${badgeClass}`}
                            >
                              {method.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="bg-white px-8 py-8">
                      {method.summary && (
                        <p className="mb-4 text-lg leading-relaxed text-gray-900">
                          {method.summary}
                        </p>
                      )}
                      {method.body && method.body.length > 0 && (
                        <div className="prose prose-gray max-w-none text-gray-700">
                          <PortableText value={method.body} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </motion.main>
      <Footer />
    </>
  )
}
