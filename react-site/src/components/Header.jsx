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
    <header
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl rounded-3xl px-8 py-3 z-50 transition-all duration-500 shadow-lg ${
        isScrolled
          ? "bg-white/90 backdrop-blur-none shadow-md"
          : "bg-white/10 backdrop-blur-lg border border-white/20"
      }`}
    >
      <nav className="flex items-center gap-8">
        {/* Logo Section - Separate */}
        <div className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="US Mechanical"
            className="h-20 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Visual Separator */}
        <div
          className={`h-12 w-px transition-colors duration-500 ${
            isScrolled ? "bg-gray-300" : "bg-white/30"
          }`}
        />

        {/* Navigation Links Section - Separate */}
        <ul
          className={`flex space-x-8 text-lg font-medium transition-colors duration-500 flex-1 justify-end ${
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
  );
}
