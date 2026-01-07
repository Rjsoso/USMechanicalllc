import './GradientText.css';

export default function GradientText({ children }) {
  console.log('🎨 Rendering GRADIENT (blue→red) on:', children);
  
  return (
    <span className="gradient-text-wrapper">
      <span>{children}</span>
    </span>
  );
}

