import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Mail, Phone } from 'lucide-react';

const Contact = ({ data }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  if (!data) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 md:py-32 lg:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="inline-block bg-accent-orange/10 text-accent-orange px-5 py-2 rounded-full text-sm font-semibold mb-6">
            {data.badge}
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-16 leading-tight">
            {data.title}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xl text-muted mb-8 leading-relaxed">
              {data.description}
            </p>
            <div className="space-y-6">
              <motion.a
                href={`tel:${data.phone}`}
                className="flex items-center gap-4 text-xl font-semibold text-gray-900 group"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 bg-accent-orange/10 rounded-full flex items-center justify-center group-hover:bg-accent-orange transition-colors">
                  <Phone className="w-6 h-6 text-accent-orange" />
                </div>
                {data.phone}
              </motion.a>
              <motion.a
                href={`mailto:${data.email}`}
                className="flex items-center gap-4 text-xl font-semibold text-gray-900 group"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center group-hover:bg-accent-blue transition-colors">
                  <Mail className="w-6 h-6 text-accent-blue" />
                </div>
                {data.email}
              </motion.a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name or Company"
                required
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 bg-white text-lg text-gray-900 placeholder-muted/60 focus:border-accent-orange focus:outline-none transition-all"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 bg-white text-lg text-gray-900 placeholder-muted/60 focus:border-accent-orange focus:outline-none transition-all"
              />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 bg-white text-lg text-gray-900 placeholder-muted/60 focus:border-accent-blue focus:outline-none transition-all"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              placeholder="Project details / scope"
              required
              className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 bg-white text-lg text-gray-900 placeholder-muted/60 focus:border-accent-blue focus:outline-none transition-all resize-none"
            />
            <div className="flex gap-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-accent-orange text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Request
                  </>
                )}
              </motion.button>
              <motion.a
                href={`mailto:${data.email}`}
                className="px-8 py-4 rounded-xl border-2 border-accent-blue text-accent-blue font-semibold text-lg hover:bg-accent-blue/10 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Email Directly
              </motion.a>
            </div>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800"
              >
                Thank you! Your message has been sent. We'll contact you shortly.
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

