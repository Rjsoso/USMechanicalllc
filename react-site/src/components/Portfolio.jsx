import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { client, urlFor } from '../utils/sanity';

function Portfolio() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [projects, setProjects] = useState([]);
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
          order,
          "projects": projects[]-> {
            _id,
            title,
            description,
            images[] {
              asset-> {
                _id,
                url
              },
              alt,
              caption
            },
            location,
            year,
            client,
            projectType,
            order
          } | order(order asc)
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

  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
    const sortedProjects = [...(category.projects || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    setProjects(sortedProjects);
  }, []);

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
    setProjects([]);
  }, []);

  // Memoize sorted projects to avoid recalculation
  const sortedProjects = useMemo(() => {
    if (!selectedCategory?.projects) return [];
    return [...selectedCategory.projects].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [selectedCategory]);

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
    <section id="portfolio" className="pt-20 pb-16 bg-black text-white">
      {!selectedCategory ? (
        <>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
            {displayCategories.map((category) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category)}
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
                
                {/* Default Overlay */}
                <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:opacity-0" />
                
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
        </>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Projects View */}
          <div className="mb-8">
            <button
              onClick={handleBackToCategories}
              className="flex items-center text-blue-400 hover:text-blue-300 font-medium mb-6 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Categories
            </button>
            <h2 className="section-title text-4xl md:text-5xl lg:text-6xl mb-4 text-white">{selectedCategory.title}</h2>
            {selectedCategory.description && (
              <p className="text-gray-300 text-lg max-w-3xl">{selectedCategory.description}</p>
            )}
          </div>

          {/* Projects Grid */}
          {sortedProjects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProjects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="bg-zinc-900 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
                >
                  {project.images && project.images.length > 0 && (
                    <div className="relative overflow-hidden">
                      <img
                        src={urlFor(project.images[0]).width(600).quality(85).auto('format').url()}
                        alt={project.images[0]?.alt || project.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                      {project.images.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                          +{project.images.length - 1} more
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-white">{project.title}</h3>
                    {project.description && (
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{project.description}</p>
                    )}
                    <div className="space-y-2 text-sm text-gray-400">
                      {project.year && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span><strong className="text-gray-300">Year:</strong> {project.year}</span>
                        </div>
                      )}
                      {project.location && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span><strong className="text-gray-300">Location:</strong> {project.location}</span>
                        </div>
                      )}
                      {project.client && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span><strong className="text-gray-300">Client:</strong> {project.client}</span>
                        </div>
                      )}
                      {project.projectType && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span><strong className="text-gray-300">Type:</strong> {project.projectType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No projects in this category yet.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default memo(Portfolio);
