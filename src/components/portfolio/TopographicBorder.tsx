import { useEffect, useRef } from 'react';

/**
 * TopographicBorder — Abstract topographic contour lines
 * restricted ONLY to the 4 corners of the viewport.
 * Fade out organically, leaving the center of edges clean.
 */
const TopographicBorder = ({ currentSection }: { currentSection: number }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Gentle parallax drift based on active section
  useEffect(() => {
    if (!svgRef.current) return;
    const offset = currentSection * 12;
    svgRef.current.style.setProperty('--topo-drift', `${offset}px`);
  }, [currentSection]);

  return (
    <div className="topographic-border" aria-hidden="true">
      <svg
        ref={svgRef}
        className="topo-svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle gradients to fade lines out at their ends */}
          <linearGradient id="gradTL" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#00f5a0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="gradTR" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00d2ff" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="gradBL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f5a0" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#00d2ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="gradBR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00f5a0" stopOpacity="0.1" />
          </linearGradient>

          {/* Smooth glow filter */}
          <filter id="cornerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ═══ TOP-LEFT CORNER ═══ */}
        <g className="topo-group topo-left" filter="url(#cornerGlow)">
          <path
            d="M0,140 C45,120 70,80 90,45 C105,20 115,10 120,0"
            stroke="url(#gradTL)" strokeWidth="1.6" fill="none" opacity="0.8"
          />
          <path
            d="M0,230 C75,190 115,145 155,100 C180,65 195,30 200,0"
            stroke="url(#gradTL)" strokeWidth="1.2" fill="none" opacity="0.6"
          />
          <path
            d="M0,330 C105,270 165,210 225,150 C260,110 280,50 290,0"
            stroke="url(#gradTL)" strokeWidth="0.8" fill="none" opacity="0.4"
          />
          <path
            d="M0,440 C135,360 215,275 300,195 C350,145 375,70 380,0"
            stroke="url(#gradTL)" strokeWidth="0.5" fill="none" opacity="0.2"
          />
        </g>

        {/* ═══ TOP-RIGHT CORNER ═══ */}
        <g className="topo-group topo-right" filter="url(#cornerGlow)">
          <path
            d="M1920,140 C1875,120 1850,80 1830,45 C1815,20 1805,10 1800,0"
            stroke="url(#gradTR)" strokeWidth="1.6" fill="none" opacity="0.8"
          />
          <path
            d="M1920,230 C1845,190 1805,145 1765,100 C1740,65 1725,30 1720,0"
            stroke="url(#gradTR)" strokeWidth="1.2" fill="none" opacity="0.6"
          />
          <path
            d="M1920,330 C1815,270 1755,210 1695,150 C1660,110 1640,50 1630,0"
            stroke="url(#gradTR)" strokeWidth="0.8" fill="none" opacity="0.4"
          />
          <path
            d="M1920,440 C1785,360 1705,275 1620,195 C1570,145 1545,70 1540,0"
            stroke="url(#gradTR)" strokeWidth="0.5" fill="none" opacity="0.2"
          />
        </g>

        {/* ═══ BOTTOM-LEFT CORNER ═══ */}
        <g className="topo-group topo-bottom" filter="url(#cornerGlow)">
          <path
            d="M0,940 C45,960 70,1000 90,1035 C105,1060 115,1070 120,1080"
            stroke="url(#gradBL)" strokeWidth="1.6" fill="none" opacity="0.8"
          />
          <path
            d="M0,850 C75,890 115,935 155,980 C180,1015 195,1050 200,1080"
            stroke="url(#gradBL)" strokeWidth="1.2" fill="none" opacity="0.6"
          />
          <path
            d="M0,750 C105,810 165,870 225,930 C260,970 280,1030 290,1080"
            stroke="url(#gradBL)" strokeWidth="0.8" fill="none" opacity="0.4"
          />
          <path
            d="M0,640 C135,720 215,805 300,885 C350,935 375,1010 380,1080"
            stroke="url(#gradBL)" strokeWidth="0.5" fill="none" opacity="0.2"
          />
        </g>

        {/* ═══ BOTTOM-RIGHT CORNER ═══ */}
        <g className="topo-group topo-bottom" filter="url(#cornerGlow)">
          <path
            d="M1920,940 C1875,960 1850,1000 1830,1035 C1815,1060 1805,1070 1800,1080"
            stroke="url(#gradBR)" strokeWidth="1.6" fill="none" opacity="0.8"
          />
          <path
            d="M1920,850 C1845,890 1805,935 1765,980 C1740,1015 1725,1050 1720,1080"
            stroke="url(#gradBR)" strokeWidth="1.2" fill="none" opacity="0.6"
          />
          <path
            d="M1920,750 C1815,810 1755,870 1695,930 C1660,970 1640,1030 1630,1080"
            stroke="url(#gradBR)" strokeWidth="0.8" fill="none" opacity="0.4"
          />
          <path
            d="M1920,640 C1785,720 1705,805 1620,885 C1570,935 1545,1010 1540,1080"
            stroke="url(#gradBR)" strokeWidth="0.5" fill="none" opacity="0.2"
          />
        </g>

        {/* ═══ MINIMAL CORNER DOT CLUSTERS ═══ */}
        <g className="topo-dots">
          {/* Top-left */}
          <circle cx="80" cy="80" r="3" fill="#00d2ff" opacity="0.4" />
          <circle cx="120" cy="120" r="1.5" fill="#00f5a0" opacity="0.3" />
          {/* Top-right */}
          <circle cx="1840" cy="80" r="3" fill="#fbbf24" opacity="0.4" />
          <circle cx="1800" cy="120" r="1.5" fill="#a78bfa" opacity="0.3" />
          {/* Bottom-left */}
          <circle cx="80" cy="1000" r="3" fill="#00f5a0" opacity="0.4" />
          <circle cx="120" cy="960" r="1.5" fill="#00d2ff" opacity="0.3" />
          {/* Bottom-right */}
          <circle cx="1840" cy="1000" r="3" fill="#fbbf24" opacity="0.4" />
          <circle cx="1800" cy="960" r="1.5" fill="#a78bfa" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
};

export default TopographicBorder;
