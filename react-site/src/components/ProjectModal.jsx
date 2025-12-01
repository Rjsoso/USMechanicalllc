import { motion } from 'framer-motion'
import { urlFor } from '../utils/sanity'

export default function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {project.image && urlFor(project.image) && (
          <img
            src={urlFor(project.image).width(800).url()}
            alt={project.title}
            className="modal-img"
          />
        )}
        <h2 className="text-white">{project.title}</h2>
        {project.description && <p className="text-gray-300">{project.description}</p>}
      </motion.div>
    </div>
  )
}

