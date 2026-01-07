import './GradientText.css';

export default function GradientText({ children }) {
  console.log('🎨 Rendering gradient on:', children);
  
  // Inline styles to override parent's text-white with maximum specificity
  const inlineStyle = {
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    background: 'linear-gradient(90deg, #FF00FF 0%, #00FFFF 25%, #FFFF00 50%, #00FFFF 75%, #FF00FF 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    backgroundSize: '200% auto',
  };
  
  return (
    <span className="gradient-text-1963" style={inlineStyle}>
      {children}
    </span>
  );
}

