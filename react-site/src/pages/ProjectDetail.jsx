import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { client, urlFor } from '../utils/sanity'
import { viewportPreset } from '../utils/viewport'
import SEO from '../components/SEO'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Carousel from '../components/Carousel'
import FadeInWhenVisible from '../components/FadeInWhenVisible'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [projectData, setProjectData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
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
        )

        if (!data) {
          setError('Project not found')
          return
        }

        setProjectData(data)
      } catch (err) {
        console.error('Error fetching project:', err)
        setError('Failed to load project')
      }
    }

    if (id) {
      fetchProject()
    }
  }, [id])


  // Map images to carousel items format
  const carouselItems = useMemo(() => {
    if (
      !projectData?.images ||
      !Array.isArray(projectData.images) ||
      projectData.images.length === 0
    ) {
      return []
    }

    return projectData.images
      .map((photo, index) => {
        if (!photo || !photo.asset) return null
        const imageUrl = photo.asset.url
          ? `${photo.asset.url}?w=800&q=85&auto=format`
          : (photo.asset && urlFor(photo)?.width(800).quality(85).auto('format').url()) || ''
        return {
          id: `project-photo-${index}`,
          src: imageUrl,
          alt: photo.alt || `${projectData.title} ${index + 1}`,
          caption: photo.caption || null,
        }
      })
      .filter(Boolean)
  }, [projectData])

  // Render immediately - no loading check
  if (!projectData && error) {
    return (
      <>
        <Header />
        <div
          className="flex min-h-screen items-center justify-center bg-white text-black"
          style={{ paddingTop: '180px' }}
        >
          <p>Loading project...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !projectData) {
    return (
      <>
        <Header />
        <div
          className="flex min-h-screen items-center justify-center bg-white text-black"
          style={{ paddingTop: '180px' }}
        >
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">Project Not Found</h1>
            <p className="mb-8 text-black">
              The project you&apos;re looking for doesn&apos;t exist.
            </p>
            <button
              onClick={() => navigate('/')}
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Go Back Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SEO
        title={`${projectData.title} | Portfolio | US Mechanical`}
        description={
          projectData.metaDescription ||
          `View the ${projectData.title} project by US Mechanical. Professional mechanical contracting services.`
        }
        keywords={`${projectData.title}, US Mechanical portfolio, mechanical project, ${projectData.category?.title || 'construction'}`}
        url={`https://usmechanical.com/projects/${projectData._id}`}
      />
      <Header />
      <motion.main 
        className="min-h-screen bg-white text-black" 
        style={{ paddingTop: '180px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          {/* Back Buttons */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate('/', { state: { scrollTo: 'portfolio' } })}
              className="flex items-center gap-2 text-black transition-colors hover:text-gray-700"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Portfolio
            </button>

            {projectData.category && (
              <button
                onClick={() => navigate(`/portfolio/${projectData.category._id}`)}
                className="flex items-center gap-2 text-black transition-colors hover:text-gray-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Projects
              </button>
            )}
          </div>

          {/* Project Category Badge */}
          {projectData.category && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportPreset}
              transition={{ duration: 0.25 }}
            >
              <span className="inline-block rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800">
                {projectData.category.title}
              </span>
            </motion.div>
          )}

          {/* Project Title */}
          <motion.h1
            className="section-title mb-8 text-5xl text-black md:text-6xl"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportPreset}
            transition={{ duration: 0.25 }}
          >
            {projectData.title}
          </motion.h1>

          {/* Project Description */}
          {projectData.description && (
            <motion.p
              className="mb-12 text-xl leading-relaxed text-black"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportPreset}
              transition={{ duration: 0.25 }}
            >
              {projectData.description}
            </motion.p>
          )}

          {/* Images Carousel and Details Side by Side */}
          <motion.div
            className="mb-12 flex flex-col items-start gap-8 lg:flex-row lg:gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportPreset}
            transition={{ duration: 0.25 }}
          >
            {/* Carousel on left */}
            {carouselItems.length > 0 && (
              <div className="w-full lg:w-2/3">
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
                <h2 className="mb-6 text-3xl font-bold text-black">Project Details</h2>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.2}>
                <div className="space-y-6">
                  {projectData.year && (
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-start">
                        <svg
                          className="mr-3 mt-1 h-6 w-6 flex-shrink-0 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium uppercase tracking-wide text-gray-600">
                            Year Completed
                          </p>
                          <p className="mt-1 text-lg font-semibold text-black">
                            {projectData.year}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {projectData.location && (
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-start">
                        <svg
                          className="mr-3 mt-1 h-6 w-6 flex-shrink-0 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium uppercase tracking-wide text-gray-600">
                            Location
                          </p>
                          <p className="mt-1 text-lg font-semibold text-black">
                            {projectData.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {projectData.client && (
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-start">
                        <svg
                          className="mr-3 mt-1 h-6 w-6 flex-shrink-0 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium uppercase tracking-wide text-gray-600">
                            Client
                          </p>
                          <p className="mt-1 text-lg font-semibold text-black">
                            {projectData.client}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {projectData.projectType && (
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-start">
                        <svg
                          className="mr-3 mt-1 h-6 w-6 flex-shrink-0 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium uppercase tracking-wide text-gray-600">
                            Project Type
                          </p>
                          <p className="mt-1 text-lg font-semibold text-black">
                            {projectData.projectType}
                          </p>
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
            className="mb-8 mt-16 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportPreset}
            transition={{ duration: 0.25 }}
          >
            <a
              href="mailto:info@usmechanicalllc.com?subject=Quote%20Request%20from%20US%20Mechanical%20Website"
              className="transform rounded-lg bg-black px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-gray-800"
            >
              Request a Quote
            </a>
          </motion.div>
        </div>
      </motion.main>
      <Footer />
    </>
  )
}
