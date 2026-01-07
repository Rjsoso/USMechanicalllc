export default function GradientText({ children }) {
  console.log('🔴 TESTING SOLID RED COLOR on:', children);
  
  return (
    <span style={{ 
      color: '#FF0000',
      fontWeight: 900,
      fontSize: '2em',
      backgroundColor: 'yellow',
      padding: '10px',
      display: 'inline-block',
      border: '5px solid green'
    }}>
      {children}
    </span>
  );
}

