import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from '../utils/sanity';
import { navigateAndScroll } from '../utils/scrollToSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import FadeInWhenVisible from '../components/FadeInWhenVisible';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await client.fetch(
          `*[_type == "portfolioProject" && _id == $projectId][0]{
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
            category-> {
              _id,
              title
            }
          }`,
          { projectId: id }
        );

        if (!data) {
          setError('Project not found');
          setLoading(false);
          return;
        }

        setProjectData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleRequestQuote = () => {
    navigateAndScroll('contact', navigate);
  };

  // Map images to carousel items format
  const carouselItems = useMemo(() => {
    if (!projectData?.images || !Array.isArray(projectData.images) || projectData.images.length === 0) {
      return [];
    }
    
    return projectData.images.map((photo, index) => {
      if (!photo || !photo.asset) return null;
      const imageUrl = photo.asset.url
        ? `${photo.asset.url}?w=800&q=85&auto=format`
        : urlFor(photo).width(800).quality(85).auto('format').url();
      return {
        id: `project-photo-${index}`,
        src: imageUrl,
        alt: photo.alt || `${projectData.title} ${index + 1}`,
        caption: photo.caption || null
      };
    }).filter(Boolean);
  }, [projectData?.images, projectData?.title]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white text-black flex items-center justify-center" style={{ paddingTop: '180px' }}>
          <p>Loading project...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !projectData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white text-black flex items-center justify-center" style={{ paddingTop: '180px' }}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <p className="text-black mb-8">The project you're looking for doesn't exist.</p>
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
            onClick={() => navigateAndScroll('portfolio', navigate)}
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
            Back to Projects
          </button>

          {/* Project Category Badge */}
          {projectData.category && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "500px" }}
              transition={{ duration: 0.25 }}
            >
              <span className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                {projectData.category.title}
              </span>
            </motion.div>
          )}

          {/* Project Title */}
          <motion.h1
            className="section-title text-5xl md:text-6xl mb-8 text-black"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "500px" }}
            transition={{ duration: 0.25 }}
          >
            {projectData.title}
          </motion.h1>

          {/* Project Description */}
          {projectData.description && (
            <motion.p
              className="text-xl text-black mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "500px" }}
              transition={{ duration: 0.25 }}
            >
              {projectData.description}
            </motion.p>
          )}

          {/* Images Carousel and Details Side by Side */}
          <motion.div
            className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "500px" }}
            transition={{ duration: 0.25 }}
          >
            {/* Carousel on left */}
            {carouselItems.length > 0 && (
              <div className="lg:w-2/3 w-full">
                <FadeInWhenVisible>
                  <Carousel
                    items={carouselItems}
                    baseWidth={700}
                    containerClassName="h-[500px]"
                    autoplay={true}
                    autoplayDelay={4000}
                    pauseOnHover={true}
                    loop={true}
                    round={false}
                  />
                </FadeInWhenVisible>
              </div>
            )}

            {/* Project Details on Right */}
            <div className={`${carouselItems.length > 0 ? 'lg:w-1/3' : 'w-full'}`}>
              <FadeInWhenVisible delay={0.1}>
                <h2 className="text-3xl font-bold mb-6 text-black">Project Details</h2>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.2}>
                <div className="space-y-6">
                  {projectData.year && (
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-start">
                        <svg className="w-6 h-6 text-gray-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Year Completed</p>
                          <p className="text-lg text-black font-semibold mt-1">{projectData.year}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {projectData.location && (
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-start">
                        <svg className="w-6 h-6 text-gray-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Location</p>
                          <p className="text-lg text-black font-semibold mt-1">{projectData.location}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {projectData.client && (
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-start">
                        <svg className="w-6 h-6 text-gray-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Client</p>
                          <p className="text-lg text-black font-semibold mt-1">{projectData.client}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {projectData.projectType && (
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-start">
                        <svg className="w-6 h-6 text-gray-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Project Type</p>
                          <p className="text-lg text-black font-semibold mt-1">{projectData.projectType}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </FadeInWhenVisible>
            </div>
          </motion.div>

          {/* Request a Quote Button */}
          <motion.div
            className="flex justify-center mt-16 mb-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "500px" }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={handleRequestQuote}
              className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Request a Quote
            </button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

