import { useState, useEffect } from 'react';

// Helper function to interpolate between colors
function interpolateColor(color1, color2, ratio) {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function GradientText({ children }) {
  const [color, setColor] = useState('#f40101');
  
  useEffect(() => {
    console.log('🎨 SMOOTH GRADIENT: red→purple→blue on:', children);
    
    // Define color stops: Red → Purple → Blue
    const colors = [
      '#f40101', // Red
      '#8B00FF', // Purple
      '#3404f6'  // Blue
    ];
    
    let progress = 0;
    const interval = setInterval(() => {
      // Slow smooth progress (completes cycle in ~15 seconds)
      progress += 0.005;
      
      // Use sine wave for smooth back-and-forth motion
      const sineValue = (Math.sin(progress) + 1) / 2; // 0 to 1
      
      // Map sine value to color transitions
      let newColor;
      if (sineValue < 0.5) {
        // Transition from Red to Purple (first half)
        const ratio = sineValue * 2; // 0 to 1
        newColor = interpolateColor(colors[0], colors[1], ratio);
      } else {
        // Transition from Purple to Blue (second half)
        const ratio = (sineValue - 0.5) * 2; // 0 to 1
        newColor = interpolateColor(colors[1], colors[2], ratio);
      }
      
      setColor(newColor);
    }, 50); // Update every 50ms for smooth animation
    
    return () => clearInterval(interval);
  }, [children]);
  
  return (
    <span style={{ 
      color: color,
      display: 'inline'
    }}>
      {children}
    </span>
  );
}

