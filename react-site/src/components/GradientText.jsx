import './GradientText.css';

export default function GradientText({ children }) {
  console.log('🎨 Rendering gradient on:', children);
  
  // First test: just make it a different color to confirm override works
  const inlineStyle = {
    color: '#FF00FF',
    WebkitTextFillColor: '#FF00FF',
    fontWeight: '900',
  };
  
  return (
    <span className="gradient-text-1963" style={inlineStyle}>
      {children}
    </span>
  );
}

