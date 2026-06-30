import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { urlFor } from '../utils/sanity'
import { viewportPreset } from '../utils/viewport'
import SEO from '../components/SEO'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Carousel from '../components/Carousel'
import { getSiteUrl } from '../utils/siteUrl'
import FadeInWhenVisible from '../components/FadeInWhenVisible'
import SmallSpinner from '../components/SmallSpinner'
import { useSanityLive } from '../hooks/useSanityLive'
import './ProjectDetailPage.css'

const PROJECT_QUERY = `*[_type == "portfolioProject" && _id == $projectId][0]{
  _id,
  title,
  description,
  images[] { asset-> { _id, url }, alt, caption },
  location,
  year,
  client,
  projectType,
  category-> { _id, title }
}`

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: projectData, loading, error: fetchError } = useSanityLive(
    PROJECT_QUERY,
    { projectId: id ?? '' },
    { listenFilter: `*[_type == "portfolioProject"]` },
  )

  const error = fetchError
    ? 'Failed to load project'
    : !projectData && !loading && id
      ? 'Project not found'
      : null

  const ogImageUrl = useMemo(() => {
    const first = projectData?.images?.find((p) => p && p.asset)
    if (!first) return undefined
    try {
      return urlFor(first).width(1200).height(630).fit('crop').auto('format').url()
    } catch {
      return undefined
    }
  }, [projectData])

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
        const imageUrl =
          (photo.asset &&
            urlFor(photo)?.width(800).fit('max').quality(85).auto('format').url()) ||
          ''
        const srcSet = [400, 600, 800, 1200, 1600]
          .map((w) => {
            const url = urlFor(photo).width(w).fit('max').quality(85).auto('format').url()
            return url ? `${url} ${w}w` : null
          })
          .filter(Boolean)
          .join(', ')
        return {
          id: `project-photo-${index}`,
          src: imageUrl,
          srcSet,
          sizes: '(max-width: 768px) 100vw, 50vw',
          alt: photo.alt || `${projectData.title} ${index + 1}`,
          caption: photo.caption || null,
        }
      })
      .filter(Boolean)
  }, [projectData])

  if (loading && !projectData) {
    return (
      <>
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          className="project-detail-page project-detail-page--centered min-h-screen"
        >
          <SmallSpinner label="Loading project…" variant="dark" />
        </main>
        <Footer />
      </>
    )
  }

  if (error || !projectData) {
    return (
      <>
        <SEO
          title="Project | US Mechanical"
          description="This project could not be loaded."
          url={`${getSiteUrl()}/projects/${id || ''}`}
        />
        <Header />
        <main id="main-content" tabIndex={-1} className="project-detail-page min-h-screen">
          <div className="project-detail-page__shell">
            <div className="project-detail-page__error-wrap">
              <div className="project-detail-page__error-panel">
                <h1 className="project-detail-page__error-title">Project unavailable</h1>
                <p className="project-detail-page__error-text">
                  {error || 'The project you are looking for does not exist or could not be loaded.'}
                </p>
                <button type="button" className="project-detail-page__error-btn" onClick={() => navigate('/')}>
                  Go back home
                </button>
              </div>
            </div>
          </div>
        </main>
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
        url={`${getSiteUrl()}/projects/${projectData._id}`}
        type="article"
        {...(ogImageUrl ? { ogImage: ogImageUrl } : {})}
      />
      <Header />
      <motion.main
        id="main-content"
        tabIndex={-1}
        className="project-detail-page min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="project-detail-page__shell">
          <nav className="project-detail-page__nav" aria-label="Project navigation">
            <button
              type="button"
              onClick={() => navigate('/', { state: { scrollTo: 'portfolio' } })}
              className="project-detail-page__text-link"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to portfolio
            </button>

            {projectData.category && (
              <button
                type="button"
                onClick={() => navigate(`/portfolio/${projectData.category._id}`)}
                className="project-detail-page__text-link"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to category
              </button>
            )}
          </nav>

          {projectData.category && (
            <motion.span
              className="project-detail-page__tag"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportPreset}
              transition={{ duration: 0.25 }}
            >
              {projectData.category.title}
            </motion.span>
          )}

          <motion.h1
            className="project-detail-page__title section-title text-5xl md:text-6xl"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportPreset}
            transition={{ duration: 0.25 }}
          >
            {projectData.title}
          </motion.h1>

          {projectData.description && (
            <motion.p
              className="project-detail-page__lead"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportPreset}
              transition={{ duration: 0.25 }}
            >
              {projectData.description}
            </motion.p>
          )}

          <motion.div
            className="project-detail-page__layout mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportPreset}
            transition={{ duration: 0.25 }}
          >
            {carouselItems.length > 0 && (
              <div className="project-detail-page__gallery">
                <FadeInWhenVisible>
                  <Carousel
                    items={carouselItems}
                    baseWidth={700}
                    containerClassName="h-[min(52svh,480px)] min-h-[200px] w-full sm:min-h-[360px] md:min-h-[500px] md:h-[500px]"
                    autoplay={true}
                    autoplayDelay={9000}
                    pauseOnHover={true}
                    loop={true}
                    round={false}
                    imageFit="contain"
                  />
                </FadeInWhenVisible>
              </div>
            )}

            <div
              className={
                carouselItems.length > 0
                  ? 'project-detail-page__aside'
                  : 'project-detail-page__aside project-detail-page__aside--full'
              }
            >
              <FadeInWhenVisible delay={0.16}>
                <h2 className="project-detail-page__aside-title">Project details</h2>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.32}>
                <div className="project-detail-page__detail-rows">
                  {projectData.year && (
                    <div className="project-detail-page__detail-row">
                      <div className="project-detail-page__detail-inner">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="project-detail-page__detail-label">Year completed</p>
                          <p className="project-detail-page__detail-value">{projectData.year}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {projectData.location && (
                    <div className="project-detail-page__detail-row">
                      <div className="project-detail-page__detail-inner">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
                          <p className="project-detail-page__detail-label">Location</p>
                          <p className="project-detail-page__detail-value">{projectData.location}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {projectData.client && (
                    <div className="project-detail-page__detail-row">
                      <div className="project-detail-page__detail-inner">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="project-detail-page__detail-label">Client</p>
                          <p className="project-detail-page__detail-value">{projectData.client}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {projectData.projectType && (
                    <div className="project-detail-page__detail-row">
                      <div className="project-detail-page__detail-inner">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <div>
                          <p className="project-detail-page__detail-label">Project type</p>
                          <p className="project-detail-page__detail-value">{projectData.projectType}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </FadeInWhenVisible>
            </div>
          </motion.div>
        </div>
      </motion.main>
      <Footer />
    </>
  )
}
