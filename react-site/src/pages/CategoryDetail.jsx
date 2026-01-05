import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from '../utils/sanity';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FadeInWhenVisible from '../components/FadeInWhenVisible';

export default function CategoryDetail() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await client.fetch(
          `*[_type == "portfolioCategory" && _id == $categoryId][0]{
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
            "projects": projects[]-> {
              _id,
              title,
              description,
              images[] {
                asset-> {
                  _id,
                  url
                },
                alt
              },
              location,
              year,
              client,
              projectType,
              order
            } | order(order asc)
          }`,
          { categoryId }
        );

        if (!data) {
          setError('Category not found');
          setLoading(false);
          return;
        }

        setCategoryData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category');
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  // Sort projects by order
  const sortedProjects = useMemo(() => {
    if (!categoryData?.projects) return [];
    return [...categoryData.projects].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [categoryData?.projects]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white text-black flex items-center justify-center" style={{ paddingTop: '180px' }}>
          <p>Loading category...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !categoryData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white text-black flex items-center justify-center" style={{ paddingTop: '180px' }}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
            <p className="text-black mb-8">The category you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Go Back Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white text-black min-h-screen" style={{ paddingTop: '180px' }}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Back Button */}
          <button
            onClick={() => {
              sessionStorage.setItem('scrollTo', 'portfolio');
              navigate('/');
              let retryCount = 0;
              const maxRetries = 20;
              const scrollToPortfolio = () => {
                const portfolioElement = document.querySelector('#portfolio');
                if (portfolioElement) {
                  const headerOffset = 180;
                  const elementPosition = portfolioElement.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                  sessionStorage.removeItem('scrollTo');
                } else if (retryCount < maxRetries) {
                  retryCount++;
                  setTimeout(scrollToPortfolio, 150);
                }
              };
              setTimeout(scrollToPortfolio, 300);
            }}
            className="mb-8 text-black hover:text-gray-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
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
            Back to Portfolio
          </button>

          {/* Category Title */}
          <motion.h1
            className="section-title text-5xl md:text-6xl mb-6 text-black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {categoryData.title}
          </motion.h1>

          {/* Category Description */}
          {categoryData.description && (
            <motion.p
              className="text-xl text-gray-700 mb-12 leading-relaxed max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {categoryData.description}
            </motion.p>
          )}

          {/* Projects Grid */}
          {sortedProjects.length > 0 ? (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {sortedProjects.map((project, index) => (
                <FadeInWhenVisible key={project._id} delay={index * 0.1}>
                  <div
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group border border-gray-200"
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
                      <h3 className="text-2xl font-bold mb-3 text-black">{project.title}</h3>
                      {project.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                      )}
                      <div className="space-y-2 text-sm text-gray-500">
                        {project.year && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span><strong className="text-gray-700">Year:</strong> {project.year}</span>
                          </div>
                        )}
                        {project.location && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span><strong className="text-gray-700">Location:</strong> {project.location}</span>
                          </div>
                        )}
                        {project.client && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span><strong className="text-gray-700">Client:</strong> {project.client}</span>
                          </div>
                        )}
                        {project.projectType && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span><strong className="text-gray-700">Type:</strong> {project.projectType}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeInWhenVisible>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects in this category yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

