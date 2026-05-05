import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { urlFor } from '../utils/sanity'
import { viewportPreset } from '../utils/viewport'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { getSiteUrl } from '../utils/siteUrl'
import { useSanityLive } from '../hooks/useSanityLive'

const CATEGORIES_QUERY = `*[_type == "portfolioCategory"] | order(order asc) {
  _id,
  title,
  description,
  image { asset-> { _id, url }, alt },
  order
}`
const SECTION_QUERY = `*[_id == "portfolioSection"][0]{ sectionTitle, sectionDescription }`

export default function PortfolioPage() {
  const navigate = useNavigate()
  const [loadedImages, setLoadedImages] = useState(new Set())

  const categoriesRes = useSanityLive(CATEGORIES_QUERY, {}, { listenFilter: `*[_type == "portfolioCategory"]` })
  const sectionRes = useSanityLive(SECTION_QUERY, {}, { listenFilter: `*[_id == "portfolioSection"]` })

  const categoriesData = categoriesRes.data
  const categories = useMemo(
    () => (Array.isArray(categoriesData) ? categoriesData : []),
    [categoriesData]
  )
  const sectionData = sectionRes.data
  const displayCategories = categories

  return (
    <>
      <SEO
        title="Portfolio - Our Projects | US Mechanical"
        description="Explore U.S. Mechanical's portfolio of completed commercial and industrial projects including manufacturing, healthcare, education, hospitality, and data centers throughout Utah, Nevada, and the Southwest."
        keywords="mechanical contractor portfolio, HVAC projects, plumbing projects, commercial construction, industrial projects, process piping projects, Utah construction, Nevada projects"
        url={`${getSiteUrl()}/portfolio`}
      />
      <Header />

      <main id="main-content" tabIndex={-1} className="bg-black pt-32 pb-0 text-white">
        <div className="mx-auto mb-12 max-w-7xl px-6">
          <motion.h1
            className="section-title text-center text-5xl text-white md:text-6xl"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportPreset}
            transition={{ duration: 0.25 }}
          >
            {sectionData?.sectionTitle || 'Portfolio'}
          </motion.h1>
          {sectionData?.sectionDescription && (
            <motion.p
              className="mx-auto mt-4 max-w-3xl text-center text-lg text-white opacity-90"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.9, y: 0 }}
              viewport={viewportPreset}
              transition={{ duration: 0.25 }}
            >
              {sectionData.sectionDescription}
            </motion.p>
          )}
          <motion.p
            className="mx-auto mt-6 max-w-3xl text-center text-base text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.9, y: 0 }}
            viewport={viewportPreset}
            transition={{ duration: 0.25, delay: 0.1 }}
          >
            Browse our completed projects by category to see examples of our work in manufacturing facilities, healthcare centers, educational institutions, hospitality venues, data centers, and more.
          </motion.p>
        </div>

        <div className="bg-white">
          <div
            className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            style={{ boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)', position: 'relative' }}
          >
            {displayCategories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportPreset}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div
                  onClick={() => navigate(`/portfolio/${category._id}`)}
                  className="portfolio-category-card relative cursor-pointer overflow-hidden bg-gray-100"
                  style={{ paddingBottom: '66.67%' }}
                >
                  {category.image?.asset && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="group relative inline-block max-h-full max-w-full align-middle">
                        <img
                          src={urlFor(category.image).width(800).quality(90).auto('format').url()}
                          srcSet={[400, 600, 800, 1200, 1600]
                            .map(
                              w =>
                                `${urlFor(category.image).width(w).quality(90).auto('format').url()} ${w}w`
                            )
                            .join(', ')}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          alt={category.title}
                          className="block max-h-full max-w-full object-contain transition-opacity duration-200"
                          loading="lazy"
                          decoding="async"
                          style={{
                            opacity: loadedImages.has(category._id) ? 1 : 0,
                          }}
                          onLoad={e => {
                            e.target.style.opacity = '1'
                            setLoadedImages(prev => new Set(prev).add(category._id))
                          }}
                        />
                        <div className="pointer-events-none absolute inset-0 flex min-h-0 min-w-0 flex-col items-center justify-center overflow-y-auto bg-black/70 px-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:px-4 md:px-5">
                          <h2 className="mb-3 w-full min-w-0 max-w-full break-words px-2 text-center text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                            {category.title}
                          </h2>
                          {category.description && (
                            <p className="mb-3 w-full min-w-0 max-w-full break-words px-2 text-center text-sm leading-snug text-gray-200 md:mb-4 md:text-base">
                              {category.description}
                            </p>
                          )}
                          <div className="flex shrink-0 items-center text-lg font-medium text-white">
                            <span>View Projects</span>
                            <svg
                              className="ml-2 h-6 w-6 transform transition-transform duration-150 group-hover:translate-x-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {categories.length === 0 && (
          <div className="px-6 py-20 text-center">
            <p className="text-white">No portfolio categories available yet.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
