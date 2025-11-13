import FadeInWhenVisible from './FadeInWhenVisible'

export default function Safety({ data }) {
  // Default content
  const defaultContent = {
    title: 'Safety & Risk Management',
    text: 'Safety is our top priority. A full-time OSHA and MSHA accredited safety director oversees our company-wide program, ensuring every employee receives proper training and support to maintain a safe work environment. With an EMR below the national average, U.S. Mechanical qualifies for self-insured insurance programs that reduce overall costs while protecting our employees and clients. Our ultimate goal is to complete every project with zero safety incidents.',
    image: '/safety-photo.jpg',
  }

  // Use data if provided, otherwise use defaults
  const title = data?.title || defaultContent.title
  const text = data?.text || data?.content?.join('\n\n') || defaultContent.text
  const paragraphs = typeof text === 'string' ? text.split('\n\n').filter(p => p.trim()) : []
  const image = data?.image || defaultContent.image

  return (
    <section id="safety" className="py-20 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* LEFT SIDE – TEXT */}
        <div className="space-y-8">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold mb-6">{title}</h2>
          </FadeInWhenVisible>

          {paragraphs.map((paragraph, index) => (
            <FadeInWhenVisible key={index} delay={0.1 + index * 0.05}>
              <p className="text-lg leading-relaxed">{paragraph}</p>
            </FadeInWhenVisible>
          ))}
        </div>

        {/* RIGHT SIDE – IMAGE */}
        <FadeInWhenVisible delay={0.2}>
          <div className="flex justify-center md:justify-start">
            <img
              src={image}
              alt="Safety and Risk Management"
              className="rounded-2xl shadow-lg w-full max-w-md object-cover"
              loading="lazy"
              onError={e => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  )
}
