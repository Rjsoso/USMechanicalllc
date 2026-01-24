import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '../utils/sanity'

export default function ProjectModal({ project, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!project) return null

  const images = project.images || []
  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)
  }

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          className="modal mx-4 w-full max-w-4xl"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.25 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black/90"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="relative mb-6">
              <div className="relative h-96 w-full overflow-hidden rounded-t-lg bg-black md:h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={urlFor(images[currentImageIndex])
                      .width(1200)
                      .quality(90)
                      .auto('format')
                      .url()}
                    alt={
                      images[currentImageIndex]?.alt ||
                      project.title ||
                      `Project image ${currentImageIndex + 1}`
                    }
                    className="h-full w-full object-contain"
                    loading="eager"
                    decoding="async"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black/90"
                      aria-label="Previous image"
                    >
                      <svg
                        className="h-6 w-6"
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
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black/90"
                      aria-label="Next image"
                    >
                      <svg
                        className="h-6 w-6"
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
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Thumbnail Strip */}
                {hasMultipleImages && images.length <= 6 && (
                  <div className="absolute bottom-0 left-0 right-0 flex gap-2 overflow-x-auto bg-zinc-900 p-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-white'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={urlFor(img).width(100).height(100).quality(80).auto('format').url()}
                          alt={img?.alt || `Thumbnail ${index + 1}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="px-6 pb-6">
            <h2 className="mb-4 text-3xl font-bold text-white">{project.title}</h2>

            {project.description && (
              <p className="mb-6 leading-relaxed text-white">{project.description}</p>
            )}

            {/* Project Metadata */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              {project.location && (
                <div className="flex items-start">
                  <svg
                    className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-blue-400"
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
                  <div>
                    <p className="text-sm text-gray-300">Location</p>
                    <p className="text-white">{project.location}</p>
                  </div>
                </div>
              )}

              {project.year && (
                <div className="flex items-start">
                  <svg
                    className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-blue-400"
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
                  <div>
                    <p className="text-sm text-gray-300">Year Completed</p>
                    <p className="text-white">{project.year}</p>
                  </div>
                </div>
              )}

              {project.client && (
                <div className="flex items-start">
                  <svg
                    className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-300">Client</p>
                    <p className="text-white">{project.client}</p>
                  </div>
                </div>
              )}

              {project.projectType && (
                <div className="flex items-start">
                  <svg
                    className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-300">Project Type</p>
                    <p className="text-white">{project.projectType}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
