import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.8; // transition 80% down hero
      setIsScrolled(window.scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

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

      {/* Navigation Bar - Dropdown Menu */}
      <div className="fixed top-4 right-4 md:right-8 z-50">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`transition-colors duration-300 ${
            isScrolled ? "text-gray-900" : "text-white"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isDropdownOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute top-full mt-2 right-0 rounded-2xl shadow-xl min-w-[200px] overflow-hidden transition-all duration-300 ease-out ${
            isScrolled
              ? "bg-white/95 backdrop-blur-md border border-gray-200"
              : "bg-white/10 backdrop-blur-lg border border-white/20"
          } ${
            isDropdownOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
            <nav>
              <ul className="py-2">
                <li>
                  <a
                    href="#about"
                    onClick={handleLinkClick}
                    className={`block px-6 py-3 transition-colors duration-300 ${
                      isScrolled
                        ? "text-gray-900 hover:bg-gray-100"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={handleLinkClick}
                    className={`block px-6 py-3 transition-colors duration-300 ${
                      isScrolled
                        ? "text-gray-900 hover:bg-gray-100"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#portfolio"
                    onClick={handleLinkClick}
                    className={`block px-6 py-3 transition-colors duration-300 ${
                      isScrolled
                        ? "text-gray-900 hover:bg-gray-100"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    Portfolio
                  </a>
                </li>
                <li>
                  <a
                    href="#careers"
                    onClick={handleLinkClick}
                    className={`block px-6 py-3 transition-colors duration-300 ${
                      isScrolled
                        ? "text-gray-900 hover:bg-gray-100"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={handleLinkClick}
                    className={`block px-6 py-3 transition-colors duration-300 ${
                      isScrolled
                        ? "text-gray-900 hover:bg-gray-100"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
        </div>
      </div>
    </>
  );
}
