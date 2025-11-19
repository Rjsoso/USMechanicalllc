import { useEffect, useState } from 'react'
import { client, urlFor } from '../utils/sanity'
import CardSwap, { Card } from './CardSwap'

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
    <section className="py-20 bg-gray-50 text-gray-800 relative">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-10">Portfolio Projects</h2>
        <div style={{ height: '600px', position: 'relative' }}>
          <CardSwap
            cardDistance={60}
            verticalDistance={70}
            delay={5000}
            pauseOnHover={false}
          >
            {projects.map(project => (
              <Card 
                key={project._id} 
                className="bg-white overflow-hidden"
                style={{ background: '#fff', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
              >
                <div className="p-6">
                  {project.image && urlFor(project.image) && (
                    <img
                      src={urlFor(project.image).width(600).url()}
                      alt={project.title || 'Project image'}
                      className="w-full h-56 object-cover mb-4 rounded-lg"
                    />
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{project.title}</h3>
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
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </section>
  )
}

