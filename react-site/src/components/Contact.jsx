import { motion } from 'framer-motion'

export default function Contact({ data, companyInfo }) {
  // Default offices
  const defaultOffices = [
    {
      location: 'Pleasant Grove, Utah',
      address: '123 Main St\nPleasant Grove, UT 84062',
      phone: '(801) 555-1234',
    },
    {
      location: 'Las Vegas, Nevada',
      address: '456 Desert Rd\nLas Vegas, NV 89109',
      phone: '(702) 555-9876',
    },
  ]

  // Get offices from companyInfo or use defaults
  let offices = defaultOffices
  if (companyInfo?.offices && companyInfo.offices.length > 0) {
    // If offices are provided as strings, convert to objects
    if (typeof companyInfo.offices[0] === 'string') {
      offices = companyInfo.offices.map((office, index) => ({
        location: office,
        address: office,
        phone: index === 0 ? '(801) 555-1234' : '(702) 555-9876',
      }))
    } else {
      offices = companyInfo.offices
    }
  }

  // Support custom offices from data prop
  if (data?.offices && data.offices.length > 0) {
    offices = data.offices
  }

  const sectionTitle = data?.title || 'Contact Us'

  return (
    <section id="contact" className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">{sectionTitle}</h2>
        <div className="flex flex-col md:flex-row justify-center gap-10">
          {offices.map((office, index) => {
            const location = office.location || office.city || office.name || office
            const address = office.address || office.fullAddress || office
            const phone = office.phone || office.telephone || ''

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-md w-full md:w-1/2"
              >
                <h3 className="text-xl font-semibold mb-4">{location}</h3>
                <p className="whitespace-pre-line">{address}</p>
                {phone && (
                  <p className="mt-2">
                    📞 <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:underline">
                      {phone}
                    </a>
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
