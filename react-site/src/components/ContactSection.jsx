import { useEffect, useState } from 'react'
import { client, urlFor } from '../utils/sanity'

export default function ContactSection() {
  const [contact, setContact] = useState(null)

  useEffect(() => {
    client
      .fetch(`*[_type == "contactSection"][0]`)
      .then(res => setContact(res))
      .catch(error => {
        console.warn('Sanity fetch failed for contact section:', error)
        // Component will return null if contact is null, which is fine
      })
  }, [])

  if (!contact) return null

  return (
    <section
      className="relative py-24 text-white text-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${contact.backgroundImage && urlFor(contact.backgroundImage) ? urlFor(contact.backgroundImage).width(1600).url() : '/placeholder.jpg'})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-4">{contact.title}</h2>
        <p className="text-lg mb-10">{contact.description}</p>

        <a
          href="mailto:info@usmechanicalllc.com"
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-white text-lg font-semibold"
        >
          Contact Us
        </a>
      </div>
    </section>
  )
}

