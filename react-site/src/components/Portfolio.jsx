import { useState, useMemo, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { urlFor } from '../utils/sanity'
import './PortfolioHome.css'

function Portfolio({ data: portfolioDataProp }) {
  const navigate = useNavigate()
  const [loadedImages, setLoadedImages] = useState(new Set())

  // Derive from props directly — no intermediate state needed.
  const categoriesRaw = portfolioDataProp?.categories
  const categories = useMemo(
    () => (Array.isArray(categoriesRaw) ? categoriesRaw : []),
    [categoriesRaw]
  )
  const sectionData = portfolioDataProp?.section || null

  // Limit to 6 categories for the grid
  const displayCategories = useMemo(() => categories.slice(0, 6), [categories])

  // Subtle height variation for a jigsaw-like mosaic feel
  const CELL_HEIGHTS = ['80%', '72%', '82%', '70%', '78%', '74%']

  return (
    <section
      id="portfolio"
      className="bg-black pb-0 pt-12 text-white"
      style={{ position: 'relative', zIndex: 10 }}
    >
      {/* Portfolio Title */}
      <div className="mx-auto mb-12 max-w-7xl px-6">
        <h2 className="section-title text-center text-5xl text-white md:text-6xl">
          {sectionData?.sectionTitle || 'Portfolio'}
        </h2>
        {sectionData?.sectionDescription && (
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-white opacity-90">
            {sectionData.sectionDescription}
          </p>
        )}
      </div>

      {/* Edge-to-edge category grid with white background */}
      <div className="bg-white">
        <div
          className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{ boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)', position: 'relative' }}
        >
          {displayCategories.map((category, index) => (
            <div key={category._id}>
              <div
                onClick={() => navigate(`/portfolio/${category._id}`)}
                className="portfolio-category-card relative cursor-pointer overflow-hidden bg-gray-100"
                style={{ paddingBottom: CELL_HEIGHTS[index % CELL_HEIGHTS.length] }}
              >
                {category.image?.asset && (
                  <div
                    className={`portfolio-home__frame portfolio-home__frame--${Math.min(index, 5)}`}
                  >
                    <div className="portfolio-home__frame-inner">
                      <div className="group portfolio-home__media">
                        <img
                          src={urlFor(category.image).width(800).quality(85).auto('format').url()}
                          srcSet={[400, 600, 800, 1200, 1600]
                            .map(
                              (w) =>
                                `${urlFor(category.image).width(w).quality(85).auto('format').url()} ${w}w`
                            )
                            .join(', ')}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          alt={category.title}
                          className="portfolio-home__img block transition-opacity duration-200"
                          loading="lazy"
                          decoding="async"
                          style={{
                            opacity: loadedImages.has(category._id) ? 1 : 0,
                          }}
                          onLoad={(e) => {
                            e.target.style.opacity = '1'
                            setLoadedImages(prev => new Set(prev).add(category._id))
                          }}
                        />
                        <div className="portfolio-home__scrim pointer-events-none">
                          <h3 className="portfolio-home__scrim-title">{category.title}</h3>
                          <div className="portfolio-home__scrim-cta">
                            <span>Learn more</span>
                            <svg
                              className="portfolio-home__scrim-icon"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
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
                  </div>
                )}
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
