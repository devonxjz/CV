interface SectionDotsProps {
  currentSection: number;
  totalSections: number;
  goToSection: (index: number) => void;
}

const SectionDots = ({ currentSection, totalSections, goToSection }: SectionDotsProps) => {
  return (
    <div className="section-dots">
      {Array.from({ length: totalSections }, (_, i) => (
        <button
          key={i}
          className={`section-dot${currentSection === i ? ' active' : ''}`}
          onClick={() => goToSection(i)}
          aria-label={`Go to section ${i + 1}`}
        />
      ))}
    </div>
  );
};

export default SectionDots;
