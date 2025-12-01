import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.8; // transition 80% down hero
      setIsScrolled(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Logo - Separate, positioned in top-left corner */}
      <div className="fixed top-4 left-4 z-50">
        <img
          src="/logo.png"
          alt="US Mechanical"
          className="h-32 md:h-40 w-auto object-contain transition-all duration-500"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      {/* Navigation Bar - Centered between logo and right edge */}
      <header
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 rounded-3xl px-6 md:px-8 py-3 z-50 transition-all duration-500 shadow-lg ${
          isScrolled
            ? "bg-white/90 backdrop-blur-none shadow-md"
            : "bg-white/10 backdrop-blur-lg border border-white/20"
        }`}
        style={{ 
          marginLeft: 'calc(160px + 1rem)' // Account for logo width + padding
        }}
      >
        <nav>
          <ul
            className={`flex space-x-6 md:space-x-8 text-base md:text-lg font-medium transition-colors duration-500 ${
              isScrolled ? "text-gray-900" : "text-white"
            }`}
          >
            <li>
              <a href="#about" className="hover:text-blue-500 transition-colors duration-300">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-blue-500 transition-colors duration-300">
                Services
              </a>
            </li>
            <li>
              <a href="#portfolio" className="hover:text-blue-500 transition-colors duration-300">
                Portfolio
              </a>
            </li>
            <li>
              <a href="#careers" className="hover:text-blue-500 transition-colors duration-300">
                Careers
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-500 transition-colors duration-300">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
