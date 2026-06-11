interface NavigationProps {
  currentSection: number;
  goToSection: (index: number) => void;
}

const NAV_ITEMS = ['Home', 'Skills', 'Timeline', 'Projects', 'Contact'];

const Navigation = ({ currentSection, goToSection }: NavigationProps) => {
  return (
    <nav className={`portfolio-nav ${currentSection > 0 ? 'pill-nav' : ''}`}>
      <div
        className="nav-logo"
        onClick={() => goToSection(0)}
        data-cursor-hover
      >
        Devonxjz
      </div>
      <ul className="nav-links">
        {NAV_ITEMS.map((label, i) => (
          <li key={label}>
            <button
              className={`nav-link${currentSection === i ? ' active' : ''}`}
              onClick={() => goToSection(i)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
