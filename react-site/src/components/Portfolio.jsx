import { useState, useMemo, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { urlFor } from '../utils/sanity'

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
          {displayCategories.map((category) => (
            <div key={category._id}>
              <div
                onClick={() => navigate(`/portfolio/${category._id}`)}
                className="group relative cursor-pointer overflow-hidden bg-gray-100"
                style={{ paddingBottom: '66.67%' }} // 3:2 aspect ratio
              >
                {category.image?.asset && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
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
                      className="max-h-full max-w-full object-contain transition-opacity duration-200 transition-transform group-hover:scale-105"
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
                  </div>
                )}

                {/* Hover Overlay with Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <h3 className="mb-4 px-6 text-center text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                    {category.title}
                  </h3>
                  <div className="flex items-center text-lg font-medium text-white">
                    <span>Learn more</span>
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
