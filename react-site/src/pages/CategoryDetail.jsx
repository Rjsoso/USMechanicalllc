import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { client, urlFor } from '../utils/sanity'
import SEO from '../components/SEO'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FadeInWhenVisible from '../components/FadeInWhenVisible'

export default function CategoryDetail() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [categoryData, setCategoryData] = useState(null)
  const [categoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)

        // Fetch category and all projects that reference this category
        const [category, projects, categories] = await Promise.all([
          client.fetch(
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
              }
            }`,
            { categoryId }
          ),
          client.fetch(
            `*[_type == "portfolioProject" && category._ref == $categoryId] | order(order asc) {
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
            }`,
            { categoryId }
          ),
          client.fetch(
            `*[_type == "portfolioCategory"] | order(order asc) {
              _id,
              title,
              order
            }`
          ),
        ])

        if (!category) {
          setError('Category not found')
          setLoading(false)
          return
        }

        const navCategories = Array.isArray(categories) ? categories.slice(0, 6) : []
        setCategoriesList(navCategories)

        // Combine category data with projects
        setCategoryData({
          ...category,
          projects: projects || [],
        })
        setLoading(false)
      } catch (err) {
        console.error('Error fetching category:', err)
        setError('Failed to load category')
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId])

  const { prevCategory, nextCategory } = useMemo(() => {
    if (!Array.isArray(categoriesList) || categoriesList.length === 0) {
      return { prevCategory: null, nextCategory: null }
    }
    const currentIndex = categoriesList.findIndex(c => c._id === categoryId)
    if (currentIndex < 0) return { prevCategory: null, nextCategory: null }
    return {
      prevCategory: currentIndex > 0 ? categoriesList[currentIndex - 1] : null,
      nextCategory:
        currentIndex < categoriesList.length - 1 ? categoriesList[currentIndex + 1] : null,
    }
  }, [categoriesList, categoryId])

  // Sort projects by order
  const sortedProjects = useMemo(() => {
    if (!categoryData?.projects) return []
    return [...categoryData.projects].sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [categoryData?.projects])

  if (loading) {
    return (
      <>
        <Header />
        <div
          className="flex min-h-screen items-center justify-center bg-white text-black"
          style={{ paddingTop: '180px' }}
        >
          <p>Loading category...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !categoryData) {
    return (
      <>
        <Header />
        <div
          className="flex min-h-screen items-center justify-center bg-white text-black"
          style={{ paddingTop: '180px' }}
        >
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">Category Not Found</h1>
            <p className="mb-8 text-black">
              The category you&apos;re looking for doesn&apos;t exist.
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
        title={`${categoryData.title} Portfolio | US Mechanical`}
        description={
          categoryData.metaDescription ||
          `View ${categoryData.title} projects by US Mechanical. Professional mechanical contracting services since 1963.`
        }
        keywords={`${categoryData.title}, US Mechanical portfolio, mechanical projects, ${categoryData.title} projects`}
        url={`https://usmechanical.com/portfolio/${categoryData._id}`}
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
          {/* Back + Prev/Next */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => prevCategory?._id && navigate(`/portfolio/${prevCategory._id}`)}
                disabled={!prevCategory?._id}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous category"
              >
                <FiChevronLeft className="text-lg" />
                Previous Category
              </button>

              <button
                type="button"
                onClick={() => nextCategory?._id && navigate(`/portfolio/${nextCategory._id}`)}
                disabled={!nextCategory?._id}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next category"
              >
                Next Category
                <FiChevronRight className="text-lg" />
              </button>
            </div>
          </div>

          {/* Category Title */}
          <motion.h1
            className="section-title mb-6 text-5xl text-black md:text-6xl"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '500px' }}
            transition={{ duration: 0.25 }}
          >
            {categoryData.title}
          </motion.h1>

          {/* Category Description */}
          {categoryData.description && (
            <motion.p
              className="mb-12 max-w-3xl text-xl leading-relaxed text-gray-700"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '500px' }}
              transition={{ duration: 0.25 }}
            >
              {categoryData.description}
            </motion.p>
          )}

          {/* Projects Grid */}
          {sortedProjects.length > 0 ? (
            <motion.div
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '500px' }}
              transition={{ duration: 0.25 }}
            >
              {sortedProjects.map((project, index) => (
                <FadeInWhenVisible key={project._id} delay={index * 0.1}>
                  <div
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all hover:shadow-2xl"
                  >
                    {project.images && project.images.length > 0 && (
                      <div className="relative overflow-hidden">
                        <img
                          src={urlFor(project.images[0])
                            .width(600)
                            .quality(85)
                            .auto('format')
                            .url()}
                          alt={project.images[0]?.alt || project.title}
                          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        {project.images.length > 1 && (
                          <div className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-1 text-sm font-medium text-white">
                            +{project.images.length - 1} more
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="mb-3 text-2xl font-bold text-black">{project.title}</h3>
                      {project.description && (
                        <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                          {project.description}
                        </p>
                      )}
                      <div className="space-y-2 text-sm text-gray-500">
                        {project.year && (
                          <div className="flex items-center">
                            <svg
                              className="mr-2 h-4 w-4 flex-shrink-0"
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
                            <span>
                              <strong className="text-gray-700">Year:</strong> {project.year}
                            </span>
                          </div>
                        )}
                        {project.location && (
                          <div className="flex items-center">
                            <svg
                              className="mr-2 h-4 w-4 flex-shrink-0"
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
                            <span>
                              <strong className="text-gray-700">Location:</strong>{' '}
                              {project.location}
                            </span>
                          </div>
                        )}
                        {project.client && (
                          <div className="flex items-center">
                            <svg
                              className="mr-2 h-4 w-4 flex-shrink-0"
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
                            <span>
                              <strong className="text-gray-700">Client:</strong> {project.client}
                            </span>
                          </div>
                        )}
                        {project.projectType && (
                          <div className="flex items-center">
                            <svg
                              className="mr-2 h-4 w-4 flex-shrink-0"
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
                            <span>
                              <strong className="text-gray-700">Type:</strong> {project.projectType}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeInWhenVisible>
              ))}
            </motion.div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No projects in this category yet.</p>
            </div>
          )}
        </div>
      </motion.main>
      <Footer />
    </>
  )
}
