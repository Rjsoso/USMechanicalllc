// Example usage of GlassSurface component
import GlassSurface from './GlassSurface'

// Basic usage
export function BasicGlassExample() {
  return (
    <GlassSurface 
      width={300} 
      height={200}
      borderRadius={24}
      className="my-custom-class"
    >
      <h2>Glass Surface Content</h2>
    </GlassSurface>
  )
}

// Custom displacement effects
export function AdvancedGlassExample() {
  return (
    <GlassSurface
      displace={15}
      distortionScale={-150}
      redOffset={5}
      greenOffset={15}
      blueOffset={25}
      brightness={60}
      opacity={0.8}
      mixBlendMode="screen"
    >
      <span>Advanced Glass Distortion</span>
    </GlassSurface>
  )
}

