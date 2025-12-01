import { useEffect, useState } from 'react'
import { client, urlFor } from '../utils/sanity'
import ProjectModal from './ProjectModal'

export default function Portfolio() {
  const [projects, setProjects] = useState([])
  const [openProject, setOpenProject] = useState(null)

  useEffect(() => {
    client
      .fetch(`*[_type == "portfolioProject"] | order(order asc)`)
      .then(setProjects)
      .catch(error => {
        console.error('Error fetching portfolio projects:', error)
      })
  }, [])

  return (
    <section className="py-20 bg-black text-white" style={{ paddingTop: '80px' }}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Portfolio Projects
        </h2>

        {/* Grid Layout */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((p, i) => (
            <div
              key={i}
              onClick={() => setOpenProject(p)}
              className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer overflow-hidden"
            >
              {p.image && (
                <img
                  src={urlFor(p.image).width(600).url()}
                  alt={p.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-white">{p.title}</h3>
              </div>
            </div>
          ))}
        </div>

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
