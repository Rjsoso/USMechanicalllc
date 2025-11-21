import { useState, useEffect } from 'react'
import { client, urlFor } from '../utils/sanity'
import CardSwap, { Card } from './CardSwap'

export default function ServicesSection() {
  const [data, setData] = useState(null)
  const [openBox, setOpenBox] = useState(null)

  useEffect(() => {
    client
      .fetch(
        `*[_type == "servicesSection"][0]{
          sectionTitle,
          serviceBoxes,
          services[] {
            title,
            description,
            "imageUrl": image.asset->url
          }
        }`
      )
      .then(setData)
      .catch(console.error)
  }, [])

  if (!data) return null

  return (
    <section className="py-24 bg-gray-50" id="services">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
        {/* LEFT SIDE — CLICKABLE BOXES */}
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            {data.sectionTitle}
          </h2>

          <div className="space-y-6">
            {data.serviceBoxes?.map((box, i) => (
              <button
                key={i}
                onClick={() => setOpenBox(box)}
                className="w-full text-left bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition"
              >
                <div className="flex items-center gap-4">
                  {box.icon && (
                    <img
                      src={urlFor(box.icon).width(60).url()}
                      className="w-14 h-14 object-contain"
                    />
                  )}
                  <h3 className="text-2xl font-bold">{box.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE — CARDSWAP GALLERY */}
        <div
          style={{
            height: '500px',
            width: '100%',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CardSwap
            cardDistance={65}
            verticalDistance={80}
            width={500}
            height={380}
            enableHoverSpread={true}
          >
            {data.services?.map((service, i) => (
              <Card key={i} className="gallery-card">
                <img
                  src={service.imageUrl}
                  alt={service.title || ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                />
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>

      {/* MODAL DESCRIPTION */}
      {openBox && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-xl">
            <h2 className="text-3xl font-bold mb-4">{openBox.title}</h2>
            <p className="text-gray-700 mb-6">{openBox.description}</p>

            <button
              onClick={() => setOpenBox(null)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
