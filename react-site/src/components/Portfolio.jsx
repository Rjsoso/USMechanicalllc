import { useEffect, useState, useMemo, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { client, urlFor } from '../utils/sanity'

function Portfolio() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [sectionData, setSectionData] = useState(null)

  useEffect(() => {
    // Fetch both portfolio categories and section data
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

  // Limit to 6 categories for the grid
  const displayCategories = useMemo(() => categories.slice(0, 6), [categories])

  return (
    <section
      id="portfolio"
      className="bg-transparent pb-0 pt-24 text-white"
      style={{ position: 'relative', zIndex: 10 }}
    >
      {/* Portfolio Title */}
      <div className="mx-auto mb-12 max-w-7xl px-6">
        <motion.h2
          className="section-title text-center text-5xl text-white md:text-6xl"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '500px' }}
          transition={{ duration: 0.25 }}
        >
          {sectionData?.sectionTitle || 'Portfolio'}
        </motion.h2>
        {sectionData?.sectionDescription && (
          <motion.p
            className="mx-auto mt-4 max-w-3xl text-center text-lg text-white opacity-90"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.9, y: 0 }}
            viewport={{ once: true, margin: '500px' }}
            transition={{ duration: 0.25 }}
          >
            {sectionData.sectionDescription}
          </motion.p>
        )}
      </div>

      {/* Edge-to-edge category grid with white background */}
      <div className="bg-white">
        <div
          className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)', position: 'relative' }}
        >
          {displayCategories.map(category => (
            <div key={category._id}>
              <div
                onClick={() => navigate(`/portfolio/${category._id}`)}
                className="group relative cursor-pointer overflow-hidden"
                style={{ paddingBottom: '66.67%' }} // 3:2 aspect ratio
              >
                {/* Background Image */}
                {category.image && (
                  <img
                    src={urlFor(category.image).width(800).quality(90).auto('format').url()}
                    alt={category.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                )}

                {/* Hover Overlay with Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="mb-4 px-6 text-center text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                    {category.title}
                  </h3>
                  <div className="flex items-center text-lg font-medium text-white">
                    <span>Learn more</span>
                    <svg
                      className="ml-2 h-6 w-6 transform transition-transform duration-300 group-hover:translate-x-2"
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
          ))}
        </div>
      </div>

      {categories.length === 0 && (
        <div className="px-6 py-20 text-center">
          <p className="text-white">No portfolio categories available yet.</p>
        </div>
      )}
    </section>
  )
}

export default memo(Portfolio)
