import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

function Recognition({ data }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const getBadgeColor = certification => {
    if (!certification) return 'bg-blue-600'
    if (certification.includes('Platinum')) return 'bg-green-600'
    if (certification.includes('Gold')) return 'bg-yellow-600'
    if (certification.includes('Silver')) return 'bg-gray-400'
    return 'bg-blue-600'
  }

  // Handle both old structure (with title) and new structure (direct array)
  const recognitionData = data.projects || (Array.isArray(data) ? data : [])
  const sectionTitle = data.title || 'Project Recognition'

  return (
    <section id="recognition" ref={ref} className="bg-white py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <motion.h2
          className="mb-16 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {sectionTitle}
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recognitionData.map((project, index) => {
            // Handle both old structure (projects array) and new structure (direct array)
            const title = project.title || project.projectName
            const award = project.award || project.certification
            const description = project.description
            const image = project.image

            return (
              <motion.div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                {image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={image}
                      alt={title}
                      className="h-full w-full object-cover"
                      onError={e => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80'
                      }}
                    />
                    {award && (
                      <div
                        className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${getBadgeColor(
                          award
                        )}`}
                      >
                        {award}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
                  {award && !image && (
                    <div
                      className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${getBadgeColor(
                        award
                      )}`}
                    >
                      {award}
                    </div>
                  )}
                  {description && (
                    <p className="leading-relaxed text-gray-600">{description}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Recognition
