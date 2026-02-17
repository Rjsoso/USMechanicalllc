import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { client, urlFor } from '../utils/sanity'
import { viewportPreset } from '../utils/viewport'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function PortfolioPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [sectionData, setSectionData] = useState(null)
  const [loadedImages, setLoadedImages] = useState(new Set())

  useEffect(() => {
    Promise.all([
      client.fetch(
        `*[_type == "portfolioCategory"] | order(order asc) {
          _id,
          title,
          description,
          image {
            asset-> {
              _id,
              url
            },
            alt
          },
          order
        }`
      ),
      client.fetch(`*[_id == "portfolioSection"][0]{ sectionTitle, sectionDescription }`),
    ])
      .then(([categoriesData, sectionInfo]) => {
        setCategories(categoriesData)
        setSectionData(sectionInfo)
      })
      .catch(error => {
        console.error('Error fetching portfolio data:', error)
      })
  }, [])

  const displayCategories = useMemo(() => categories, [categories])

  return (
    <>
      <SEO
        title="Portfolio - Our Projects | US Mechanical"
        description="Explore U.S. Mechanical's portfolio of completed commercial and industrial projects including manufacturing, healthcare, education, hospitality, and data centers throughout Utah, Nevada, and the Southwest."
        keywords="mechanical contractor portfolio, HVAC projects, plumbing projects, commercial construction, industrial projects, process piping projects, Utah construction, Nevada projects"
        url="https://usmechanical.com/portfolio"
      />
      <Header />

      <main className="bg-black pt-32 pb-0 text-white">
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
                  className="group relative cursor-pointer overflow-hidden bg-gray-200"
                  style={{ paddingBottom: '66.67%' }}
                >
                  {category.image?.asset && (
                    <img
                      src={urlFor(category.image).width(800).quality(90).auto('format').url()}
                      alt={category.title}
                      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200"
                      loading="lazy"
                      decoding="async"
                      style={{
                        opacity: loadedImages.has(category._id) ? 1 : 0,
                        backgroundColor: '#e5e7eb',
                      }}
                      onLoad={e => {
                        e.target.style.opacity = '1'
                        setLoadedImages(prev => new Set(prev).add(category._id))
                      }}
                    />
                  )}

                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <h2 className="mb-4 px-6 text-center text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                      {category.title}
                    </h2>
                    {category.description && (
                      <p className="mb-4 px-6 text-center text-sm text-gray-200 md:text-base max-w-md">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center text-lg font-medium text-white">
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
