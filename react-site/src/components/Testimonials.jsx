import { motion } from 'framer-motion'

export default function Testimonials({ data }) {
  // Default testimonials
  const defaultTestimonials = [
    {
      quote:
        'U.S. Mechanical consistently delivers on time and on budget. Their attention to detail is unmatched.',
      name: 'Project Manager, Okland Construction',
      company: 'Okland Construction',
    },
    {
      quote:
        'Professional, reliable, and quality-focused — our go-to for all major HVAC projects.',
      name: 'Facilities Director, UNLV',
      company: 'UNLV',
    },
  ]

  // Get testimonials from data or use defaults
  const testimonials =
    data?.testimonials && data.testimonials.length > 0 ? data.testimonials : defaultTestimonials

  return (
    <section id="testimonials" className="py-20 bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Client Testimonials</h2>
        <div className="grid md:grid-cols-2 gap-10">
          {testimonials.map((t, i) => {
            const quote = t.quote || t.text
            const name = t.name || t.author
            const company = t.company

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-8 rounded-2xl shadow-lg"
              >
                <p className="italic text-gray-300 mb-4">&ldquo;{quote}&rdquo;</p>
                <h4 className="font-semibold text-blue-400">
                  {name}
                  {company && `, ${company}`}
                </h4>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
