import { useState, useEffect, useRef } from 'react';
import hvImg from '../../assets/hv.jpg';
import spkImg from '../../assets/SPK.png';
import vibeImg from '../../assets/4.jpg';
import agentImg from '../../assets/agent.png';
import usePageNavigation from '../../hooks/usePageNavigation';

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

interface Milestone {
  date: string;
  title: string;
  detail: string;
  side: 'left' | 'right';
  image?: string;
}

interface TimelineProps {
  milestones: Milestone[];
  onNext: () => void;
  onPrev: () => void;
  currentSection: number;
}

const imageMap: Record<string, string> = {
  'hv.jpg': hvImg,
  'SPK.png': spkImg,
  '4.jpg': vibeImg,
  'agent.png': agentImg,
};

const getMilestoneImage = (title: string, imageField?: string) => {
  if (imageField && imageMap[imageField]) {
    return imageMap[imageField];
  }
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes('chuyên hùng vương') || normalizedTitle.includes('chuyên tin')) {
    return hvImg;
  }
  if (normalizedTitle.includes('khoa học kỹ thuật')) {
    return hvImg;
  }
  if (normalizedTitle.includes('hutech') || normalizedTitle.includes('hcmute') || normalizedTitle.includes('sư phạm kỹ thuật') || normalizedTitle.includes('spk')) {
    return spkImg;
  }
  if (normalizedTitle.includes('vibe code')) {
    return vibeImg;
  }
  if (normalizedTitle.includes('agentic') || normalizedTitle.includes('agent')) {
    return agentImg;
  }
  return null;
};

const Timeline = ({ milestones, onNext, onPrev, currentSection }: TimelineProps) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isCompact, setIsCompact] = useState(false);
  const prevSectionRef = useRef<number>(currentSection);
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sync visibleCount when section changes
  useEffect(() => {
    if (currentSection === 2) {
      if (prevSectionRef.current < 2) {
        // Entered from above (0 or 1)
        setVisibleCount(0);
      } else if (prevSectionRef.current > 2) {
        // Entered from below (3 or 4)
        setVisibleCount(milestones.length);
      }
    }
    prevSectionRef.current = currentSection;
  }, [currentSection, milestones.length]);

  // Central page/substep navigation hook
  usePageNavigation({
    totalSections: 5,
    currentSection,
    onNavigate: (index) => {
      if (index > 2) onNext();
      else if (index < 2) onPrev();
    },
    lockedSection: 2,
    subStepCount: milestones.length + 1,
    currentSubStep: visibleCount,
    onSubStepChange: setVisibleCount,
    cooldownMs: 800,
    disabled: currentSection !== 2,
  });

  // Check last milestone height relative to container height for compact card layout
  useEffect(() => {
    const checkHeight = () => {
      if (!trackRef.current || !trackContainerRef.current) return;

      const lastIndex = milestones.length - 1;
      const lastElement = milestoneRefs.current[lastIndex];
      if (!lastElement) return;

      const containerHeight = trackContainerRef.current.clientHeight;

      if (containerHeight > 0 && lastElement.offsetHeight > containerHeight * 0.35) {
        setIsCompact(true);
      } else {
        setIsCompact(false);
      }
    };

    // Run check after render lifecycle so heights are calculated
    const timer = setTimeout(checkHeight, 100);
    window.addEventListener('resize', checkHeight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkHeight);
    };
  }, [milestones]);

  // Auto-centering track vertical position
  useEffect(() => {
    if (!trackRef.current || !trackContainerRef.current) return;

    const activeIndex = Math.max(0, visibleCount - 1);
    const activeElement = milestoneRefs.current[activeIndex];

    if (activeElement && visibleCount > 0) {
      const containerHeight = trackContainerRef.current.clientHeight;
      const elementOffsetTop = activeElement.offsetTop;
      const elementHeight = activeElement.offsetHeight;

      let targetTranslateY = (containerHeight / 2) - (elementOffsetTop + elementHeight / 2);

      if (targetTranslateY > 0) {
        targetTranslateY = 0;
      }

      const trackHeight = trackRef.current.scrollHeight;
      const maxTranslateY = containerHeight - trackHeight;
      if (targetTranslateY < maxTranslateY) {
        if (trackHeight > containerHeight) {
          targetTranslateY = maxTranslateY;
        } else {
          targetTranslateY = 0;
        }
      }

      trackRef.current.style.transform = `translateY(${targetTranslateY}px)`;
    } else {
      trackRef.current.style.transform = 'translateY(0px)';
    }
  }, [visibleCount, milestones.length, isCompact]);

  const fillPercent = milestones.length > 0
    ? (visibleCount / milestones.length) * 100
    : 0;

  return (
    <div className="timeline-content">
      <h2 className="timeline-heading">My Journey</h2>
      <p className="section-subtitle" style={{ marginTop: '4px' }}>
        From high school to hackathons
      </p>
      <div className="timeline-track-container" ref={trackContainerRef}>
        <div className="timeline-track" ref={trackRef}>
          {/* Background line */}
          <div className="timeline-line" />
          {/* Animated fill line */}
          <div
            className="timeline-line-fill"
            style={{ height: `${fillPercent}%` }}
          />

          {milestones.map((ms, i) => {
            const imgSrc = getMilestoneImage(ms.title, ms.image);
            const isLast = i === milestones.length - 1;
            const hasImage = !!imgSrc;
            const cardClass = `milestone ${ms.side}` +
              (i < visibleCount ? ' revealed' : '') +
              (isLast ? ' last-milestone' : '') +
              (hasImage ? ' has-image' : '') +
              (isCompact && hasImage ? ' compact-card' : '');

            return (
              <div
                key={`${ms.date}-${i}`}
                className={cardClass}
                ref={el => { milestoneRefs.current[i] = el; }}
              >
                <div className="milestone-dot" />
                <div className="milestone-body">
                  <span className="milestone-date">{ms.date}</span>
                  <span className="milestone-title">{ms.title}</span>
                  <span className="milestone-detail">{renderWithHighlights(ms.detail)}</span>
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={ms.title}
                      className="milestone-image"
                      onLoad={() => {
                        // Re-trigger layout measurement when images load
                        window.dispatchEvent(new Event('resize'));
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
