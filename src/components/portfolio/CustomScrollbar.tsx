interface CustomScrollbarProps {
  currentSection: number;
  totalSections: number;
}

const CustomScrollbar = ({ currentSection, totalSections }: CustomScrollbarProps) => {
  const thumbHeightPct = 100 / totalSections;
  const thumbTopPct = (currentSection / (totalSections - 1)) * (100 - thumbHeightPct);

  return (
    <div className="custom-scrollbar-track" id="custom-scrollbar">
      <div
        className="custom-scrollbar-thumb"
        style={{
          height: `${thumbHeightPct}%`,
          top: `${thumbTopPct}%`
        }}
      />
    </div>
  );
};

export default CustomScrollbar;
