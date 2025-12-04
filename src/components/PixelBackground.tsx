import villageBackground from "@/assets/village-background.png";

const PixelBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${villageBackground})`,
          imageRendering: "pixelated",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />

      <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />
    </div>
  );
};

export default PixelBackground;
