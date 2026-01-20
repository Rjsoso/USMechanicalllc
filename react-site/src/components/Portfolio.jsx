import { useEffect, useState, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from '../utils/sanity';

function Portfolio() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      client.fetch(`*[_id == "portfolioSection"][0]{ sectionTitle, sectionDescription }`)
    ])
      .then(([categoriesData, sectionInfo]) => {
        setCategories(categoriesData);
        setSectionData(sectionInfo);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching portfolio data:', error);
        setLoading(false);
      });
  }, []);

  // Limit to 6 categories for the grid
  const displayCategories = useMemo(() => categories.slice(0, 6), [categories]);

  return (
    <section id="portfolio" className="pt-24 pb-0 bg-transparent text-white" style={{ position: 'relative', zIndex: 10 }}>
      {/* Portfolio Title */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.h2 
          className="section-title text-5xl md:text-6xl text-center text-white"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {sectionData?.sectionTitle || 'Portfolio'}
        </motion.h2>
        {sectionData?.sectionDescription && (
          <motion.p 
            className="text-white text-lg text-center mt-4 opacity-90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.9, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {sectionData.sectionDescription}
          </motion.p>
        )}
      </div>

      {/* Edge-to-edge category grid with white background */}
      <div className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full" style={{ boxShadow: '0 12px 24px rgba(0, 0, 0, 0.4)', position: 'relative' }}>
          {displayCategories.map((category, index) => (
            <div key={category._id}>
              <div
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
            </div>
          ))}
        </div>
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
