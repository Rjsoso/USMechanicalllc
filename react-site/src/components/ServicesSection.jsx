import { useEffect, useState } from 'react'
import { client } from '../utils/sanity'
import CardSwap, { Card } from './CardSwap'

export default function ServicesSection() {
  const [servicesData, setServicesData] = useState(null)
  const [activeService, setActiveService] = useState(null)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "servicesPage"][0]{
          sectionTitle,
          services[] {
            title,
            description,
            "imageUrl": image.asset->url
          }
        }`
      )
      .then(setServicesData)
      .catch(console.error)
  }, [])

  if (!servicesData?.services) return null

  const { sectionTitle, services } = servicesData

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-12">
          {sectionTitle}
        </h2>

        <div
          style={{
            height: '600px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CardSwap
            width={650}
            height={480}
            cardDistance={85}
            verticalDistance={100}
            enableHoverSpread={true}
            onCardClick={(index) => setActiveService(services[index])}
          >
            {services.map((service, i) => (
              <Card key={i} className="service-card">
                {service.imageUrl && (
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    style={{
                      width: '100%',
                      height: '70%',
                      borderRadius: '10px',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <h3 className="card-title text-xl font-semibold mt-3">
                  {service.title}
                </h3>
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
