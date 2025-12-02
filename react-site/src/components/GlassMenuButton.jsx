import GlassSurface from "./GlassSurface";

export default function GlassMenuButton({ onClick }) {
  return (
    <GlassSurface
      width={78}
      height={78}
      borderRadius={999}
      blur={20}
      brightness={70}
      opacity={0.92}
      backgroundOpacity={0.18}
      saturation={1.35}
      displace={6}
      distortionScale={-240}
      redOffset={8}
      greenOffset={14}
      blueOffset={26}
      mixBlendMode="screen"
      className="cursor-pointer"
    >
      <button
        onClick={onClick}
        className="flex items-center justify-center w-full h-full text-white text-4xl"
      >
        ☰
      </button>
    </GlassSurface>
  );
}

