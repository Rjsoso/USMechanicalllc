import { useEffect, useState } from 'react'
import { client, urlFor } from '../utils/sanity'
import ProjectModal from './ProjectModal'

export default function Portfolio() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [projects, setProjects] = useState([])
  const [openProject, setOpenProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch categories with their projects
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
        setCategories(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching portfolio categories:', error)
        setLoading(false)
      })
  }, [])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    // Sort projects by order
    const sortedProjects = [...(category.projects || [])].sort((a, b) => (a.order || 0) - (b.order || 0))
    setProjects(sortedProjects)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setProjects([])
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 text-gray-800" style={{ paddingTop: '80px' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">Loading portfolio...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50 text-gray-800" style={{ paddingTop: '80px' }}>
      <div className="max-w-7xl mx-auto px-6">
        {!selectedCategory ? (
          <>
            <h2 className="text-4xl font-bold text-center mb-4">
              Our Portfolio
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Explore our completed projects by category
            </p>

            {/* Categories Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div
                  key={category._id}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                >
                  {category.image && (
                    <div className="relative overflow-hidden">
                      <img
                        src={urlFor(category.image).width(600).quality(85).auto('format').url()}
                        alt={category.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-2">{category.title}</h3>
                    {category.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                    )}
                    <div className="flex items-center text-blue-600 font-medium">
                      <span>View Projects</span>
                      <svg
                        className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    {category.projects && category.projects.length > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        {category.projects.length} {category.projects.length === 1 ? 'project' : 'projects'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No portfolio categories available yet.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Projects View */}
            <div className="mb-8">
              <button
                onClick={handleBackToCategories}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
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
              <h2 className="text-4xl font-bold mb-2">{selectedCategory.title}</h2>
              {selectedCategory.description && (
                <p className="text-gray-600 max-w-2xl">{selectedCategory.description}</p>
              )}
            </div>

            {/* Projects Grid */}
            {projects.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    onClick={() => setOpenProject(project)}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer overflow-hidden group"
                  >
                    {project.images && project.images.length > 0 && (
                      <div className="relative overflow-hidden">
                        <img
                          src={urlFor(project.images[0]).width(600).quality(85).auto('format').url()}
                          alt={project.images[0]?.alt || project.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {project.images.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                            +{project.images.length - 1} more
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      {project.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                        {project.location && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {project.location}
                          </span>
                        )}
                        {project.year && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {project.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No projects in this category yet.</p>
              </div>
            )}
          </>
        )}

        {openProject && (
          <ProjectModal
            project={openProject}
            onClose={() => setOpenProject(null)}
          />
        )}
      </div>
    </section>
  )
}
