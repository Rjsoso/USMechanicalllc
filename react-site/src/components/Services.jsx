export default function Services() {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Our Services
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Plumbing</h3>
            <p className="text-gray-600">
              From installation to maintenance, we provide high-quality plumbing systems
              for commercial and industrial projects of all scales.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">HVAC</h3>
            <p className="text-gray-600">
              Our HVAC professionals design and install systems that meet performance
              and efficiency needs for a variety of environments.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sheet Metal</h3>
            <p className="text-gray-600">
              Custom fabrication and precise installation for high-performance
              mechanical systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
