import { useRef, forwardRef, useState, useEffect } from "react";

import GlassSurface from "./GlassSurface";

const GlassMenuButton = forwardRef(({ onClick, children, className = "", ...props }, ref) => {
  const containerRef = useRef(null);
  const shineRef = useRef(null);
  const [isOverWhite, setIsOverWhite] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // 3D tilt
    containerRef.current.style.transform = `
      perspective(700px)
      rotateX(${y * 10}deg)
      rotateY(${x * 10}deg)
      scale3d(1.04, 1.04, 1.04)
    `;

    // Move the shine/refraction highlight
    if (shineRef.current) {
      shineRef.current.style.transform = `
        translate(${x * 12}px, ${y * 12}px)
        rotate(${x * 10}deg)
      `;
    }
  };

  const resetTilt = () => {
    if (containerRef.current) {
      containerRef.current.style.transform =
        "perspective(700px) scale3d(1,1,1)";
    }
    if (shineRef.current) {
      shineRef.current.style.transform = "translate(0,0)";
    }
  };

  // Detect when button is over white backgrounds
  useEffect(() => {
    const checkBackground = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const centerX = rect.left + rect.width / 2;
      
      // Get element at button position
      const elementBelow = document.elementFromPoint(centerX, centerY);
      if (!elementBelow) return;
      
      // Walk up the DOM tree to find section with background
      let current = elementBelow;
      let foundWhite = false;
      
      while (current && current !== document.body) {
        const computedStyle = window.getComputedStyle(current);
        const bgColor = computedStyle.backgroundColor;
        const bgImage = computedStyle.backgroundImage;
        
        // Check if it's a white/gray background section
        if (current.id === 'services' || current.id === 'portfolio' || current.id === 'contact') {
          foundWhite = true;
          break;
        }
        
        // Check computed background color (white or light gray)
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          const rgb = bgColor.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0]);
            const g = parseInt(rgb[1]);
            const b = parseInt(rgb[2]);
            // Check if it's a light color (white/light gray)
            if (r > 200 && g > 200 && b > 200) {
              foundWhite = true;
              break;
            }
          }
        }
        
        current = current.parentElement;
      }
      
      setIsOverWhite(foundWhite);
    };

    // Check on scroll and resize
    window.addEventListener('scroll', checkBackground);
    window.addEventListener('resize', checkBackground);
    checkBackground(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', checkBackground);
      window.removeEventListener('resize', checkBackground);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className="transition-transform duration-200 ease-out"
    >
      <GlassSurface
        width={165}
        height={70}
        borderRadius={40}
        blur={26}
        brightness={81}
        opacity={0.92}
        saturation={1.65}
        backgroundOpacity={0.18}
        displace={10}
        distortionScale={-310}
        redOffset={18}
        greenOffset={28}
        blueOffset={40}
        mixBlendMode="screen"
        className="cursor-pointer relative overflow-hidden"
      >
        {/* LIQUID METAL REFLECTION LAYER */}
        <div
          ref={shineRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 10%, rgba(255,255,255,0.65), rgba(255,255,255,0.0) 60%)",
            filter: "blur(18px)",
            mixBlendMode: "soft-light",
            transition: "transform 0.15s ease-out",
          }}
        />

        {/* SPECTRAL REFRACTION MICRO-EDGES */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, rgba(255,0,0,0.35), rgba(0,255,255,0.22), rgba(255,0,255,0.28), rgba(255,0,0,0.35))",
            opacity: 0.25,
            mixBlendMode: "color-dodge",
            filter: "blur(10px)",
          }}
        />

        {/* CONTENT */}
        <button
          ref={ref}
          onClick={onClick}
          className={`flex items-center justify-center gap-2 w-full h-full font-semibold text-lg relative z-10 select-none transition-colors duration-300 ${isOverWhite ? 'text-black' : 'text-white'} ${className}`}
          {...props}
        >
          {children || (
            <>
              <span>Menu</span>
              <span className="text-xl">+</span>
            </>
          )}
        </button>
      </GlassSurface>
    </div>
  );
});

GlassMenuButton.displayName = "GlassMenuButton";

export default GlassMenuButton;
