import React, { useRef, forwardRef, useState, useEffect } from "react";

const GlassMenuButton = forwardRef(({ onClick, children, className = "", ...props }, ref) => {
  const [isOverWhite, setIsOverWhite] = useState(false);

  // Detect when button is over white backgrounds
  useEffect(() => {
    const checkBackground = () => {
      if (!ref?.current) return;
      
      const rect = ref.current.getBoundingClientRect();
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
  }, [ref]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 w-[165px] h-[70px] bg-black hover:bg-gray-800 rounded-lg font-semibold text-2xl select-none transition-colors duration-300 ${isOverWhite ? 'text-black' : 'text-white'} ${className}`}
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
  );
});

GlassMenuButton.displayName = "GlassMenuButton";

export default GlassMenuButton;
