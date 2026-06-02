const renderWithHighlights = (text: string) => {
  if (!text) return null;
  const regex = /(<b>.*?<\/b>|<strong>.*?<\/strong>)/g;
  const parts = text.split(regex);
  return parts.map((part, index) => {
    if (part.startsWith('<b>') && part.endsWith('</b>')) {
      return <strong key={index} className="key-highlight">{part.slice(3, -4)}</strong>;
    }
    if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
      return <strong key={index} className="key-highlight">{part.slice(8, -9)}</strong>;
    }
    return part;
  });
};

interface HeroProps {
  profile: {
    tag: string;
    headline: string;
    subtext: string;
    ctaText: string;
    ctaTarget: number;
    highlightText?: string;
  };
  goToSection: (index: number) => void;
}

const Hero = ({ profile, goToSection }: HeroProps) => {
  return (
    <div className="hero-shell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Availability Badge */}
      <div className="availability-badge drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
        <span className="pulse-dot" />
        Available for internship · HCMC
      </div>

      <div className="hero-kicker drop-shadow-[0_8px_8px_rgba(0,0,0,1)]">
        <span></span>
        {profile.tag}
      </div>

      <h1 
        className="hero-title display drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] drop-shadow-[0_8px_8px_rgba(0,0,0,1)]"
        style={{ whiteSpace: 'pre-line' }}
      >
        {profile.headline.includes(profile.highlightText || "Deployed to defend.") ? (
          <>
            {profile.headline.split(profile.highlightText || "Deployed to defend.")[0]}
            <span style={{
              background: 'linear-gradient(90deg, var(--accent-blue) 0%, var(--accent-pink) 50%, var(--accent-amber) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 35px rgba(0, 210, 255, 0.25)',
              fontWeight: 700
            }}>
              {profile.highlightText || "Deployed to defend."}
            </span>
            {profile.headline.split(profile.highlightText || "Deployed to defend.")[1]}
          </>
        ) : (
          profile.headline
        )}
      </h1>

      <p className="hero-sub drop-shadow-[0_8px_10px_rgba(0,0,0,1)]">
        {renderWithHighlights(profile.subtext)}
      </p>

      <div className="hero-actions">
        <button
          className="lantern-core px-7 py-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          onClick={() => goToSection(profile.ctaTarget || 1)}
          data-cursor-hover
        >
          {profile.ctaText}
        </button>
        <button
          className="rounded-full border border-white/10 bg-white/8 px-7 py-5 text-[11px] uppercase tracking-[0.26em] text-white/80 backdrop-blur-[20px] transition hover:bg-white/12 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          onClick={() => goToSection(2)} // View Timeline (Section 2)
          data-cursor-hover
        >
          View Timeline
        </button>
      </div>

      <div className="hero-chips drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
        <span>Teal Wood</span>
        <span>Amber Glow</span>
        <span>Twilight Blue</span>
      </div>
    </div>
  );
};

export default Hero;
