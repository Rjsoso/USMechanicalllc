import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = ({ data }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'px-4' : 'px-4'
      }`}
    >
      <div className={`max-w-7xl mx-auto rounded-2xl backdrop-blur-md shadow-xl border transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 border-white/20' 
          : 'bg-white/90 border-white/20'
      }`}>
        <nav className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <img 
              src={data?.logo || '/images/us-mechanical-logo.png'} 
              alt="U.S. Mechanical logo" 
              className="h-16 w-auto rounded-md object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <div className="font-semibold text-xl text-gray-900">
                {data?.companyName || 'U.S. Mechanical, LLC'}
              </div>
              <div className="text-xs text-accent-orange">
                {data?.tagline || 'Mechanical Contracting • Plumbing • HVAC'}
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {data?.links?.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-accent-orange transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.a>
            ))}
            <motion.a
              href="#portfolio"
              className="hidden sm:inline-block px-4 py-2 rounded-lg border border-accent-orange text-sm font-semibold text-accent-orange hover:bg-accent-orange/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Portfolio
            </motion.a>
            <motion.a
              href="#contact"
              className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-accent-orange hover:brightness-95 shadow transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request a Quote
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent-orange/20 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 pb-4 border-t border-gray-200 mt-2"
          >
            <div className="flex flex-col gap-3 pt-4">
              {data?.links?.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="py-2 text-sm font-medium text-gray-700 hover:text-accent-orange transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#portfolio"
                className="py-2 px-4 rounded-lg border border-accent-blue text-sm font-semibold text-accent-blue hover:bg-accent-blue/10 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                View Portfolio
              </a>
              <a
                href="#contact"
                className="py-2 px-4 rounded-lg bg-accent-orange text-sm font-bold text-white text-center hover:brightness-95"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Request a Quote
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;

