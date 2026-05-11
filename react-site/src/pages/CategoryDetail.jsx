import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { urlFor } from '../utils/sanity'
import { viewportPreset } from '../utils/viewport'
import SEO from '../components/SEO'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FadeInWhenVisible from '../components/FadeInWhenVisible'
import SmallSpinner from '../components/SmallSpinner'
import { getSiteUrl } from '../utils/siteUrl'
import { useSanityLive } from '../hooks/useSanityLive'
import './CategoryDetailPage.css'

const CATEGORY_QUERY = `*[_type == "portfolioCategory" && _id == $categoryId][0]{
  _id,
  title,
  description,
  image { asset-> { _id, url }, alt }
}`
const PROJECTS_QUERY = `*[_type == "portfolioProject" && category._ref == $categoryId] | order(order asc) {
  _id,
  title,
  description,
  images[] { asset-> { _id, url }, alt },
  location,
  year,
  client,
  projectType,
  order
}`
const CATEGORIES_LIST_QUERY = `*[_type == "portfolioCategory"] | order(order asc) { _id, title, order }`

export default function CategoryDetail() {
  const { categoryId } = useParams()
  const navigate = useNavigate()

  const params = { categoryId: categoryId ?? '' }
  const category = useSanityLive(CATEGORY_QUERY, params, { listenFilter: `*[_type == "portfolioCategory"]` })
  const projects = useSanityLive(PROJECTS_QUERY, params, { listenFilter: `*[_type == "portfolioProject"]` })
  const categories = useSanityLive(CATEGORIES_LIST_QUERY, {}, { listenFilter: `*[_type == "portfolioCategory"]` })

  const loading = category.loading || projects.loading || categories.loading
  const errorMsg = category.error
    ? 'Failed to load category'
    : !category.loading && !category.data && categoryId
      ? 'Category not found'
      : null

  const categoriesList = useMemo(
    () => (Array.isArray(categories.data) ? categories.data.slice(0, 6) : []),
    [categories.data],
  )
  const categoryData = useMemo(() => {
    if (!category.data) return null
    return { ...category.data, projects: projects.data || [] }
  }, [category.data, projects.data])

  const { prevCategory, nextCategory } = useMemo(() => {
    if (!Array.isArray(categoriesList) || categoriesList.length === 0) {
      return { prevCategory: null, nextCategory: null }
    }
    const currentIndex = categoriesList.findIndex((c) => c._id === categoryId)
    if (currentIndex < 0) return { prevCategory: null, nextCategory: null }
    return {
      prevCategory: currentIndex > 0 ? categoriesList[currentIndex - 1] : null,
      nextCategory:
        currentIndex < categoriesList.length - 1 ? categoriesList[currentIndex + 1] : null,
    }
  }, [categoriesList, categoryId])

  const ogImageUrl = useMemo(() => {
    const pickImage = () => {
      if (categoryData?.image?.asset) return categoryData.image
      const firstProj = Array.isArray(categoryData?.projects)
        ? categoryData.projects.find((p) => Array.isArray(p?.images) && p.images[0]?.asset)
        : null
      return firstProj?.images?.[0] ?? null
    }
    const src = pickImage()
    if (!src) return undefined
    try {
      return urlFor(src).width(1200).height(630).fit('crop').auto('format').url()
    } catch {
      return undefined
    }
  }, [categoryData])

  const projectsList = projects.data
  const sortedProjects = useMemo(() => {
    if (!Array.isArray(projectsList)) return []
    return [...projectsList].sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [projectsList])

  if (loading) {
    return (
      <>
        <Header />
        <main
          id="main-content"
          tabIndex={-1}
          className="portfolio-category-page portfolio-category-page--centered min-h-screen"
        >
          <SmallSpinner label="Loading portfolio…" variant="dark" />
        </main>
        <Footer />
      </>
    )
  }

  if (errorMsg || !categoryData) {
    return (
      <>
        <SEO
          title="Portfolio category | US Mechanical"
          description="This portfolio category could not be loaded."
          url={`${getSiteUrl()}/portfolio/${categoryId || ''}`}
        />
        <Header />
        <main id="main-content" tabIndex={-1} className="portfolio-category-page min-h-screen">
          <div className="portfolio-category-page__shell">
            <div className="portfolio-category-page__error-wrap">
              <div className="portfolio-category-page__error-panel">
                <h1 className="portfolio-category-page__error-title">Category unavailable</h1>
                <p className="portfolio-category-page__error-text">
                  {errorMsg || 'The category you are looking for does not exist.'}
                </p>
                <button
                  type="button"
                  className="portfolio-category-page__error-btn"
                  onClick={() => navigate('/')}
                >
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
        title={`${categoryData.title} Portfolio | US Mechanical`}
        description={
          categoryData.metaDescription ||
          `View ${categoryData.title} projects by US Mechanical. Professional mechanical contracting services since 1963.`
        }
        keywords={`${categoryData.title}, US Mechanical portfolio, mechanical projects, ${categoryData.title} projects`}
        url={`${getSiteUrl()}/portfolio/${categoryData._id}`}
        {...(ogImageUrl ? { ogImage: ogImageUrl } : {})}
      />
      <Header />
      <motion.main
        id="main-content"
        tabIndex={-1}
        className="portfolio-category-page min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="portfolio-category-page__shell">
          <nav className="portfolio-category-page__nav" aria-label="Category navigation">
            <button
              type="button"
              onClick={() => navigate('/', { state: { scrollTo: 'portfolio' } })}
              className="portfolio-category-page__text-link"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to portfolio
            </button>

            <button
              type="button"
              onClick={() => prevCategory?._id && navigate(`/portfolio/${prevCategory._id}`)}
              disabled={!prevCategory?._id}
              className="portfolio-category-page__pill-btn"
              aria-label="Previous category"
            >
              <FiChevronLeft className="text-lg" />
              Previous
            </button>

            <button
              type="button"
              onClick={() => nextCategory?._id && navigate(`/portfolio/${nextCategory._id}`)}
              disabled={!nextCategory?._id}
              className="portfolio-category-page__pill-btn"
              aria-label="Next category"
            >
              Next
              <FiChevronRight className="text-lg" />
            </button>
          </nav>

          <motion.h1
            className="portfolio-category-page__title section-title text-5xl md:text-6xl"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportPreset}
            transition={{ duration: 0.25 }}
          >
            {categoryData.title}
          </motion.h1>

          {categoryData.description && (
            <motion.p
              className="portfolio-category-page__desc"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportPreset}
              transition={{ duration: 0.25 }}
            >
              {categoryData.description}
            </motion.p>
          )}

          {sortedProjects.length > 0 ? (
            <motion.div
              className="portfolio-category-page__grid"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportPreset}
              transition={{ duration: 0.25 }}
            >
              {sortedProjects.map((project, index) => (
                <FadeInWhenVisible key={project._id} delay={index * 0.14}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        navigate(`/projects/${project._id}`)
                      }
                    }}
                    className="portfolio-category-page__card"
                  >
                    {project.images && project.images.length > 0 && (
                      <div className="portfolio-category-page__card-media">
                        <img
                          src={urlFor(project.images[0])
                            .width(900)
                            .fit('max')
                            .quality(85)
                            .auto('format')
                            .url()}
                          alt={project.images[0]?.alt || project.title}
                          className="portfolio-category-page__card-img"
                          loading="lazy"
                          decoding="async"
                        />
                        {project.images.length > 1 && (
                          <div className="portfolio-category-page__card-badge">
                            +{project.images.length - 1} photos
                          </div>
                        )}
                      </div>
                    )}
                    <div className="portfolio-category-page__card-body">
                      <h3 className="portfolio-category-page__card-title">{project.title}</h3>
                      {project.description && (
                        <p className="portfolio-category-page__card-desc">{project.description}</p>
                      )}
                      <div className="portfolio-category-page__meta">
                        {project.year && (
                          <div className="portfolio-category-page__meta-block">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <div>
                              <p className="portfolio-category-page__meta-label">Year</p>
                              <p className="portfolio-category-page__meta-value">{project.year}</p>
                            </div>
                          </div>
                        )}
                        {project.location && (
                          <div className="portfolio-category-page__meta-block">
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
                              <p className="portfolio-category-page__meta-label">Location</p>
                              <p className="portfolio-category-page__meta-value">{project.location}</p>
                            </div>
                          </div>
                        )}
                        {project.client && (
                          <div className="portfolio-category-page__meta-block">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <div>
                              <p className="portfolio-category-page__meta-label">Client</p>
                              <p className="portfolio-category-page__meta-value">{project.client}</p>
                            </div>
                          </div>
                        )}
                        {project.projectType && (
                          <div className="portfolio-category-page__meta-block">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                            <div>
                              <p className="portfolio-category-page__meta-label">Type</p>
                              <p className="portfolio-category-page__meta-value">{project.projectType}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeInWhenVisible>
              ))}
            </motion.div>
          ) : (
            <p className="portfolio-category-page__empty">No projects in this category yet.</p>
          )}
        </div>
      </motion.main>
      <Footer />
    </>
  )
}
