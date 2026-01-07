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
  const [colors, setColors] = useState(['#3404f6', '#3404f6', '#3404f6', '#3404f6']);
  
  useEffect(() => {
    console.log('🎨 DISTINCT PER-DIGIT: blue↔red on:', children);
    
    const text = children.toString();
    const digits = text.split('');
    
    let progress = 0;
    const interval = setInterval(() => {
      // Slow progress (~10 seconds for full cycle)
      progress += 0.008;
      
      // Each digit gets a different phase offset
      const newColors = digits.map((_, index) => {
        // Offset each digit by 90 degrees (π/2)
        const offset = (index * Math.PI / 2);
        const sineValue = (Math.sin(progress + offset) + 1) / 2; // 0 to 1
        
        // Smooth transition: Blue → Red → Blue
        const blue = '#3404f6';
        const red = '#f40101';
        
        return interpolateColor(blue, red, sineValue);
      });
      
      setColors(newColors);
    }, 50);
    
    return () => clearInterval(interval);
  }, [children]);
  
  const text = children.toString();
  const digits = text.split('');
  
  return (
    <span style={{ display: 'inline' }}>
      {digits.map((digit, index) => (
        <span 
          key={index}
          style={{ 
            color: colors[index] || '#3404f6',
            display: 'inline'
          }}
        >
          {digit}
        </span>
      ))}
    </span>
  );
}

