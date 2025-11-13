import { useEffect, useState } from "react";
import { client } from "../utils/sanity";
import { urlFor } from "../utils/sanity";
import "../styles/ContactPage.css";

const ContactPage = () => {
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      const query = `*[_type == "contact"][0]`;
      const data = await client.fetch(query);
      setContactData(data);
    };
    fetchContact();
  }, []);

  if (!contactData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h1 className="contact-title">{contactData.heroTitle}</h1>
        <p className="contact-description">{contactData.description}</p>

        <div className="contact-layout">
          {/* LEFT SIDE — FORM */}
          <div className="contact-form-wrapper">
            <h2>{contactData.formSettings?.headline || "Send us a message"}</h2>
            <form
              action="https://formspree.io/f/xgvrvody"
              method="POST"
              className="contact-form"
            >
              <label>
                Name:
                <input type="text" name="name" required />
              </label>
              <label>
                Email:
                <input type="email" name="email" required />
              </label>
              <label>
                Phone:
                <input type="tel" name="phone" />
              </label>
              <label>
                Message:
                <textarea name="message" rows="5" required></textarea>
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>

          {/* RIGHT SIDE — OFFICE INFO */}
          <div className="contact-info-wrapper">
            {contactData.offices?.map((office, index) => (
              <div key={index} className="office-block">
                <h3>{office.locationName}</h3>
                <p>{office.address}</p>
                <p>
                  <strong>Phone:</strong> {office.phone}
                </p>
                <p>
                  <strong>Fax:</strong> {office.fax}
                </p>
              </div>
            ))}

            {/* AFFILIATES */}
            {contactData.affiliates && contactData.affiliates.length > 0 && (
              <div className="affiliates-section">
                <h3>Affiliate Companies</h3>
                <div className="affiliates-grid">
                  {contactData.affiliates.map((aff, i) => (
                    <div key={i} className="affiliate-item">
                      {aff.logo && urlFor(aff.logo) && (
                        <img
                          src={urlFor(aff.logo).width(200).url()}
                          alt={aff.name}
                          className="affiliate-logo"
                        />
                      )}
                      <p><strong>{aff.name}</strong></p>
                      <p>{aff.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;

