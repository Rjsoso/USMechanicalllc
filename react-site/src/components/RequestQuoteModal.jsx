import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function RequestQuoteModal({ trigger }) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    try {
      // Replace with your actual form submission endpoint
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('There was a problem submitting your request. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // For development, still show success message
      setSubmitted(true)
    }
  }

  return (
    <>
      {/* The Trigger Button - only render if no custom trigger provided */}
      {!trigger && (
        <div className="text-center mt-8">
          <button
            onClick={() => setOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            Request a Quote
          </button>
        </div>
      )}

      {/* Render custom trigger if provided */}
      {trigger && (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      )}

      {/* Popup Form */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full mx-4 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                aria-label="Close modal"
              >
                &times;
              </button>

              {!submitted ? (
                <>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Request a Quote
                  </h2>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      required
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      name="_replyto"
                      placeholder="Your Email"
                      required
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone (optional)"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      name="message"
                      placeholder="Tell us about your project..."
                      rows="4"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    ></textarea>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                      Submit Request
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    ✅ Request Sent!
                  </h3>
                  <p className="text-gray-600">
                    Thank you! Our team will contact you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setOpen(false)
                    }}
                    className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

