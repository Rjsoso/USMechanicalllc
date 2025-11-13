import FadeInWhenVisible from './FadeInWhenVisible'

export default function About({ data }) {
  // Default content
  const defaultContent = {
    title: 'About U.S. Mechanical',
    paragraphs: [
      "U.S. Mechanical's foundation was laid in 1963 with the organization of Bylund Plumbing and Heating. Since that time, the Bylund family has continuously been in the mechanical contracting industry. The U.S. Mechanical name was adopted 25 years ago and continues to represent our company owners and employees.",
      'We pursue projects in the Intermountain and Southwest regions via hard bid, design build, CMAR, and cost plus. Our team includes journeyman and apprentice plumbers, sheet metal installers, pipefitters, welders, and administrative staff—all with unmatched experience.',
      'We maintain offices in Pleasant Grove, Utah, and Las Vegas, Nevada, as well as Snyder Mechanical in Elko, Nevada, which serves the mining industry. U.S. Mechanical is fully licensed, bonded, and insured in Nevada, Utah, Arizona, California, and Wyoming.',
    ],
    image: '/about-photo.jpg',
  }

  // Use data if provided, otherwise use defaults
  const title = data?.title || defaultContent.title
  const paragraphs =
    data?.paragraphs || data?.text
      ? (typeof data.text === 'string' ? data.text.split('\n\n') : data.paragraphs)
      : defaultContent.paragraphs
  const image = data?.image || defaultContent.image

  return (
    <section id="about" className="py-20 bg-white text-gray-800">
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
          <div className="flex justify-center md:justify-end">
            <img
              src={image}
              alt="U.S. Mechanical team at work"
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
