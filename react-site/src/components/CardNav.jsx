import { useLayoutEffect, useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { client, urlFor } from '../utils/sanity';
import './CardNav.css';

// SVG Arrow Icon Component (replaces react-icons)
const ArrowIcon = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M4 12L12 4M12 4H6M12 4V10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CardNav = ({ className = '', ease = 'power3.out' }) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [navData, setNavData] = useState(null);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ============================================
  // DEFAULT COLORS - Edit colors here in code
  // ============================================
  const defaultColors = {
    // Colors for each navigation card (up to 3 sections)
    sections: [
      { bgColor: '#0D0716', textColor: '#ffffff' }, // Section 1: Dark purple background, white text
      { bgColor: '#170D27', textColor: '#ffffff' }, // Section 2: Darker purple background, white text
      { bgColor: '#271E37', textColor: '#ffffff' }, // Section 3: Darkest purple background, white text
    ],
    buttonBgColor: '#111111',      // CTA button background color
    buttonTextColor: '#ffffff',    // CTA button text color
    baseColor: '#7B7F85',           // Navigation bar background color (slight blue-grey to match logo)
    menuColor: '#ffffff',           // Hamburger icon color (white for visibility on grey)
  };

  // Fetch navigation data from Sanity (all from headerSection)
  useEffect(() => {
    const fetchNavData = async () => {
      try {
        // Fetch all navigation data from headerSection
        const headerData = await client.fetch(
          `*[_type == "headerSection"][0]{
            logo {
              asset-> {
                _id,
                url
              }
            },
            sections[] {
              label,
              links[] {
                label,
                href,
                ariaLabel
              }
            },
            ctaButtonText
          }`
        );

        // Set the data
        setNavData({
          logo: headerData?.logo,
          sections: headerData?.sections || [],
          buttonText: headerData?.ctaButtonText
        });
        console.log('CardNav sections loaded:', headerData?.sections?.length || 0);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      }
    };

    fetchNavData();
  }, []);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 60;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content');
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const handleLinkClick = (href) => {
    // Close menu
    if (isExpanded) {
      toggleMenu();
    }
    
    // If we're on a different page, navigate to home first
    if (location.pathname !== '/') {
      // Store the target section to prevent Home from scrolling to top
      const sectionName = href.replace('#', '');
      sessionStorage.setItem('scrollTo', sectionName);
      navigate('/');
      // Wait for navigation to complete, then scroll with retry mechanism
      let retryCount = 0;
      const maxRetries = 20;
      const scrollToElement = () => {
        const element = document.querySelector(href);
        if (element) {
          // Calculate offset to account for fixed header
          const headerOffset = 180;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          sessionStorage.removeItem('scrollTo');
        } else if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(scrollToElement, 150);
        }
      };
      setTimeout(scrollToElement, 300);
    } else {
      // Already on home page, just scroll with offset
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 180;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const setCardRef = i => el => {
    if (el) cardsRef.current[i] = el;
  };

  // Memoize logo URL to prevent recalculation
  const logoUrl = useMemo(() => {
    if (!navData?.logo || !urlFor(navData.logo)) return null;
    return urlFor(navData.logo).width(400).quality(90).auto('format').url();
  }, [navData?.logo]);

  // Map Sanity sections to navigation cards with hardcoded colors
  const sections = (navData?.sections || []).slice(0, 3).map((section, index) => ({
    ...section,
    bgColor: defaultColors.sections[index]?.bgColor || defaultColors.sections[0].bgColor,
    textColor: defaultColors.sections[index]?.textColor || defaultColors.sections[0].textColor,
  }));

  const buttonText = navData?.buttonText || 'Get Started';
  const buttonBgColor = defaultColors.buttonBgColor;
  const buttonTextColor = defaultColors.buttonTextColor;
  const baseColor = defaultColors.baseColor;
  const menuColor = defaultColors.menuColor;

  return (
    <div className={`card-nav-container ${className}`}>
      <nav 
        ref={navRef} 
        className={`card-nav ${isExpanded ? 'open' : ''}`} 
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
            style={{ color: menuColor }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div className="logo-container">
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt="Company Logo" 
                className="logo"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>

          <button
            type="button"
            className="card-nav-cta-button"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            onClick={() => handleLinkClick('#contact')}
          >
            {buttonText}
          </button>
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {sections.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map((lnk, i) => (
                  <button
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link"
                    onClick={() => handleLinkClick(lnk.href)}
                    aria-label={lnk.ariaLabel || lnk.label}
                  >
                    <ArrowIcon className="nav-card-link-icon" />
                    {lnk.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
