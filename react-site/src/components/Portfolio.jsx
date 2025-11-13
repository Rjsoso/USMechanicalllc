import { useEffect, useState } from 'react'
import { client, urlFor } from '../utils/sanity'

export default function Portfolio() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .fetch(`*[_type == "portfolioProject"] | order(year desc, _createdAt desc)`)
      .then(res => {
        setProjects(res || [])
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching portfolio projects:', error)
        setProjects([])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 text-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-gray-500">Loading portfolio projects...</div>
        </div>
      </section>
    )
  }

  if (!projects.length) {
    return null
  }

  return (
    <section className="py-20 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-10">Portfolio Projects</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {projects.map(project => (
            <div
              key={project._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              {project.image && urlFor(project.image) && (
                <img
                  src={urlFor(project.image).width(600).url()}
                  alt={project.title || 'Project image'}
                  className="h-56 w-full object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                {project.description && (
                  <p className="text-gray-600 mb-4">{project.description}</p>
                )}
                <div className="flex flex-col gap-1 text-sm text-gray-500">
                  {project.location && (
                    <p>
                      <span className="font-medium">Location:</span> {project.location}
                    </p>
                  )}
                  {project.year && (
                    <p>
                      <span className="font-medium">Year:</span> {project.year}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

