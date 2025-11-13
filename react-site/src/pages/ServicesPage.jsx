import { useEffect, useState } from "react";
import { client, urlFor } from "../utils/sanity";
import "../styles/ServicesPage.css";

const ServicesPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await client.fetch(`*[_type == "servicesPage"][0]`);
        setData(res);
        if (!res) {
          setError('No services page data found. Please create a Services Page document in Sanity Studio.');
        }
      } catch (err) {
        console.error('Error fetching services data:', err);
        setError('Failed to load services page. Please check your Sanity connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-center text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-2xl px-6">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Services Page Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'No services page data found.'}</p>
          <p className="text-sm text-gray-500">
            Please create a "Services Page" document in Sanity Studio at{' '}
            <a href="http://localhost:3333" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              http://localhost:3333
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <h1 className="services-title">{data.heroTitle}</h1>
        <p className="services-intro">{data.introText}</p>

        <div className="services-grid">
          {data.services?.map((service, idx) => (
            <div key={idx} className="service-card">
              {service.icon && urlFor(service.icon) && (
                <img
                  src={urlFor(service.icon).url()}
                  alt={service.title}
                  className="service-icon"
                />
              )}
              <h2>{service.title}</h2>
              <p>{service.shortDescription}</p>

              {service.showMore && (
                <details className="service-details">
                  <summary>Learn more</summary>
                  <p>{service.fullDescription}</p>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;

