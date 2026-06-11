interface CustomScrollbarProps {
  scrollPct: number;
}

const CustomScrollbar = ({ scrollPct }: CustomScrollbarProps) => {
  const thumbHeightPx = 60; // Clean, elegant scrollbar thumb size

  return (
    <div className="custom-scrollbar-track" id="custom-scrollbar">
      <div
        className="custom-scrollbar-thumb"
        style={{
          height: `${thumbHeightPx}px`,
          top: `calc(${scrollPct} * (100% - ${thumbHeightPx}px))`
        }}
      />
    </div>
  );
};

export default CustomScrollbar;
