import './GradientText.css';
import { useState, useEffect } from 'react';

export default function GradientText({ children }) {
  const [color, setColor] = useState('#3404f6');
  
  useEffect(() => {
    console.log('🎨 DIRECT INLINE COLOR ANIMATION on:', children);
    
    let hue = 0;
    const interval = setInterval(() => {
      // Alternate between blue and red
      hue = (hue + 1) % 360;
      const newColor = hue < 180 ? '#3404f6' : '#f40101';
      setColor(newColor);
    }, 50);
    
    return () => clearInterval(interval);
  }, [children]);
  
  return (
    <span style={{ 
      color: color, 
      fontWeight: 900,
      display: 'inline-block'
    }}>
      {children}
    </span>
  );
}

