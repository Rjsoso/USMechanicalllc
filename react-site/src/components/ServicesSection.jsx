import { useEffect, useState } from 'react';
import { client } from '../utils/sanity';

const ServicesSection = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "ourServices"][0]{
          sectionTitle,
          services[] {
            title,
            description,
            "imageUrl": image.asset->url
          }
        }`
      )
      .then((data) => setServices(data))
      .catch(console.error);
  }, []);

  if (!services?.services) return null;

  return (
    <section id="services" className="py-20 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold mb-12">{services.sectionTitle}</h2>
      <div className="grid md:grid-cols-3 gap-10 px-6 md:px-16">
        {services.services.map((service, index) => (
          <div
            key={index}
            className="rounded-2xl bg-white shadow-lg hover:-translate-y-2 transition-transform duration-300 p-6"
          >
            {service.imageUrl && (
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-20 h-20 object-contain mx-auto mb-6"
              />
            )}
            <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
