import { forwardRef } from "react";
import GlassSurface from "./GlassSurface";

const GlassMenuButton = forwardRef(({ onClick, children, className = "", ...props }, ref) => {
  return (
    <GlassSurface
      width={150}
      height={65}
      borderRadius={45}
      blur={40}
      brightness={100}
      opacity={0.95}
      backgroundOpacity={0.25}
      saturation={2.2}
      displace={30}
      distortionScale={-550}
      redOffset={20}
      greenOffset={30}
      blueOffset={45}
      mixBlendMode="screen"
      className="cursor-pointer"
    >
      <button
        ref={ref}
        onClick={onClick}
        className={`flex items-center justify-center gap-2 w-full h-full text-white font-bold text-xl ${className}`}
        style={{
          textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)'
        }}
        {...props}
      >
        {children || (
          <>
            <span>Menu</span>
            <span className="text-2xl">+</span>
          </>
        )}
      </button>
    </GlassSurface>
  );
});

GlassMenuButton.displayName = "GlassMenuButton";

export default GlassMenuButton;

