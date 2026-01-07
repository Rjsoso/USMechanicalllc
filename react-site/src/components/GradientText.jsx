import './GradientText.css';

export default function GradientText({ children }) {
  console.log('🎨 Rendering gradient on:', children);
  
  return (
    <span className="gradient-text-1963">
      {children}
    </span>
  );
}

