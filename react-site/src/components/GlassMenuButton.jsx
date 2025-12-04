import React, { useRef, forwardRef, useState, useEffect } from "react";

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
        const classes = current.className || '';
        
        // Check if it's a white/gray background section by ID
        if (current.id === 'services' || current.id === 'portfolio' || current.id === 'contact' || current.id === 'about') {
          foundWhite = true;
          break;
        }
        
        // Check for Tailwind white/light gray background classes
        if (typeof classes === 'string' && (
          classes.includes('bg-gray-50') || 
          classes.includes('bg-white') || 
          classes.includes('bg-gray-100') ||
          classes.includes('bg-gray-200')
        )) {
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
            // Check if it's a light color (white/light gray) - lowered threshold for better detection
            if (r > 180 && g > 180 && b > 180) {
              foundWhite = true;
              break;
            }
          }
        }
        
        current = current.parentElement;
      }
      
      setIsOverWhite(foundWhite);
    };

    // Check on scroll, resize, and with a small delay for initial render
    const timeoutId = setTimeout(checkBackground, 100);
    window.addEventListener('scroll', checkBackground, { passive: true });
    window.addEventListener('resize', checkBackground);
    checkBackground(); // Initial check
    
    return () => {
      clearTimeout(timeoutId);
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
        borderRadius={8}
        borderWidth={0.008}
        blur={11}
        brightness={51}
        opacity={0.92}
        saturation={1.3}
        backgroundOpacity={0.15}
        displace={0.5}
        distortionScale={-180}
        redOffset={0}
        greenOffset={10}
        blueOffset={20}
        mixBlendMode="screen"
        className="cursor-pointer relative overflow-hidden"
      >
        {/* Shiny reflective layer */}
        <div
          ref={shineRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 40%, transparent 70%)",
            mixBlendMode: "overlay",
            transition: "transform 0.15s ease-out",
          }}
        />

        {/* Top glossy highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-2/5 pointer-events-none rounded-t-[8px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
            mixBlendMode: "screen",
          }}
        />

        {/* Bottom reflective edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/4 pointer-events-none rounded-b-[8px]"
          style={{
            background:
              "linear-gradient(0deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* CONTENT */}
        <button
          ref={ref}
          onClick={onClick}
          className={`flex items-center justify-center gap-2 w-full h-full font-semibold text-2xl relative z-10 select-none transition-colors duration-300 ${isOverWhite ? 'text-black' : 'text-white'} ${className}`}
          style={{
            color: isOverWhite ? '#000000' : '#ffffff',
            ...props.style
          }}
          {...props}
        >
          {children ? (
            <div 
              style={{ 
                color: isOverWhite ? '#000000' : '#ffffff',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child, {
                    style: {
                      color: isOverWhite ? '#000000' : '#ffffff',
                      ...(child.props.style || {})
                    }
                  });
                }
                return child;
              })}
            </div>
          ) : (
            <>
              <span className="text-2xl" style={{ color: isOverWhite ? '#000000' : '#ffffff' }}>Menu</span>
              <span className="text-3xl" style={{ color: isOverWhite ? '#000000' : '#ffffff' }}>+</span>
            </>
          )}
        </button>
      </GlassSurface>
    </div>
  );
});

GlassMenuButton.displayName = "GlassMenuButton";

export default GlassMenuButton;
