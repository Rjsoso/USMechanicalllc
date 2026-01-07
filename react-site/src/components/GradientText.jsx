import { useState, useEffect } from 'react';

export default function GradientText({ children }) {
  const [color, setColor] = useState('#3404f6');
  
  useEffect(() => {
    console.log('🎨 ANIMATING BIG 1963 (blue↔red):', children);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02;
      
      // Smooth transition between blue and red
      const ratio = (Math.sin(progress) + 1) / 2; // 0 to 1
      
      if (ratio < 0.5) {
        setColor('#3404f6'); // Blue
      } else {
        setColor('#f40101'); // Red
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [children]);
  
  return (
    <span style={{ 
      color: color,
      display: 'inline',
      transition: 'color 1s ease'
    }}>
      {children}
    </span>
  );
}

