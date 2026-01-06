import { useEffect, useState, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { client, urlFor } from '../utils/sanity';

function Portfolio() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(
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
      )
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching portfolio categories:', error);
        setLoading(false);
      });
  }, []);

  // Limit to 6 categories for the grid
  const displayCategories = useMemo(() => categories.slice(0, 6), [categories]);

  if (loading) {
    return (
      <section id="portfolio" className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">Loading portfolio...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="pt-20 pb-0 bg-black text-white" style={{ position: 'relative', zIndex: 10 }}>
      {/* Section Title */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="section-title text-5xl md:text-6xl mb-4 text-white">
          Our Projects
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Explore our completed projects by category
        </p>
      </div>

      {/* Edge-to-edge category grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full" style={{ boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)', position: 'relative' }}>
        {displayCategories.map((category) => (
          <div
            key={category._id}
            onClick={() => navigate(`/portfolio/${category._id}`)}
            className="relative cursor-pointer group overflow-hidden"
            style={{ paddingBottom: '66.67%' }} // 3:2 aspect ratio
          >
            {/* Background Image */}
            {category.image && (
              <img
                src={urlFor(category.image).width(800).quality(90).auto('format').url()}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}
            
            {/* Hover Overlay with Text */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-6 text-center">
                {category.title}
              </h3>
              <div className="flex items-center text-white text-lg font-medium">
                <span>Learn more</span>
                <svg
                  className="w-6 h-6 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
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
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-20 px-6">
          <p className="text-white">No portfolio categories available yet.</p>
        </div>
      )}
    </section>
  );
}

export default memo(Portfolio);
