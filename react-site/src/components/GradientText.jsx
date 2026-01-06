import './GradientText.css';

export default function GradientText({
  children,
  className = '',
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  animationSpeed = 8,
}) {
  // Create gradient with all colors
  const gradientColors = [...colors, colors[0]].join(', ');
  
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${gradientColors})`,
    backgroundSize: '200% 100%',
    '--animation-duration': `${animationSpeed}s`,
  };

  return (
    <span className={`animated-gradient-text ${className}`}>
      <span className="text-content" style={gradientStyle}>
        {children}
      </span>
    </span>
  );
}

