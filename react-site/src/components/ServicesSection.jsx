import { useEffect, useState } from 'react'
import CardSwap, { Card } from './CardSwap'

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(null)

  // Services data - HVAC plus 2 placeholder cards
  const services = [
    {
      title: 'HVAC',
      description: 'Heating, Ventilation, and Air Conditioning services for residential and commercial properties.'
    },
    {
      title: 'Service 2',
      description: 'Add your service description here.'
    },
    {
      title: 'Service 3',
      description: 'Add your service description here.'
    }
  ]

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">
          Our Services
        </h2>

        <div style={{ height: '600px', position: 'relative' }}>
          <CardSwap
            cardDistance={60}
            verticalDistance={70}
            delay={5000}
            pauseOnHover={false}
            onCardClick={(index) => setActiveService(services[index])}
          >
            {services.map((service, i) => (
              <Card key={i}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </Card>
            ))}
          </CardSwap>
        </div>

        {activeService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-10 rounded-xl w-[500px] shadow-xl relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
                onClick={() => setActiveService(null)}
              >
                ×
              </button>

              <h3 className="text-2xl font-bold mb-4">{activeService.title}</h3>
              <p className="text-gray-700">{activeService.description}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
