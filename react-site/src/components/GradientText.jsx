import './GradientText.css';

export default function GradientText({ children }) {
  console.log('🎨 Rendering TEST COLOR on:', children);
  
  return (
    <span className="gradient-text-wrapper">
      <span>{children}</span>
    </span>
  );
}

