import { forwardRef } from "react";
import GlassSurface from "./GlassSurface";

const GlassMenuButton = forwardRef(({ onClick, children, className = "", ...props }, ref) => {
  return (
    <GlassSurface
      width={150}
      height={65}
      borderRadius={45}
      blur={30}
      brightness={95}
      opacity={0.98}
      backgroundOpacity={0.35}
      saturation={1.8}
      displace={15}
      distortionScale={-320}
      redOffset={15}
      greenOffset={22}
      blueOffset={35}
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

