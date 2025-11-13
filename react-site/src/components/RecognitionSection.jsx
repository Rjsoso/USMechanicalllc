import { useEffect, useState } from 'react'
import { client, urlFor } from '../utils/sanity'

export default function RecognitionSection() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    client
      .fetch(`*[_type == "recognitionProject"]`)
      .then(res => setProjects(res || []))
      .catch(error => {
        console.warn('Sanity fetch failed for recognition projects:', error)
        setProjects([]) // Set empty array on error
      })
  }, [])

  if (!projects.length) return null

  return (
    <section className="py-20 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-10">Recognition & Projects</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {projects.map(project => (
            <div
              key={project._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              {project.image && urlFor(project.image) && (
                <img
                  src={urlFor(project.image).width(600).url()}
                  alt={project.projectName}
                  className="h-56 w-full object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.projectName}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

