import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Assets
import hvImg from '../../assets/hv.jpg';
import spkImg from '../../assets/SPK.png';
import vibeImg from '../../assets/4.jpg';
import agentImg from '../../assets/agent.png';

gsap.registerPlugin(ScrollTrigger);

interface Milestone {
  date: string;
  title: string;
  detail: string;
  side: 'left' | 'right';
  image?: string;
}

interface TimelineProps {
  milestones: Milestone[];
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
  if (normalizedTitle.includes('chuyên hùng vương') || normalizedTitle.includes('chuyên tin')) return hvImg;
  if (normalizedTitle.includes('khoa học kỹ thuật')) return hvImg;
  if (normalizedTitle.includes('hutech') || normalizedTitle.includes('hcmute') || normalizedTitle.includes('sư phạm kỹ thuật') || normalizedTitle.includes('spk')) return spkImg;
  if (normalizedTitle.includes('vibe code')) return vibeImg;
  if (normalizedTitle.includes('agentic') || normalizedTitle.includes('agent')) return agentImg;
  return null;
};

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

const Timeline = ({ milestones }: TimelineProps) => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animate the line fill height based on timeline section scroll progress
      gsap.fromTo('.timeline-line-fill',
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline-list',
            scroller: '.portfolio-wrap',
            start: 'top 75%',
            end: 'bottom 75%',
            scrub: true,
          }
        }
      );

      // 2. Animate milestone cards as they enter viewport
      const items = gsap.utils.toArray('.timeline-milestone-card');
      items.forEach((item: any) => {
        const isLeft = item.classList.contains('left-side');
        gsap.fromTo(item,
          { 
            opacity: 0, 
            x: isLeft ? -30 : 30,
            y: 20
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              scroller: '.portfolio-wrap',
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, [milestones]);

  return (
    <div className="timeline-content">
      <h2 className="timeline-heading">My Journey</h2>
      <p className="section-subtitle">
        Educational achievements and milestones in Computer Science
      </p>

      <div className="timeline-container">
        {/* Subtle center line */}
        <div className="timeline-vertical-line">
          <div className="timeline-line-fill" />
        </div>

        <div className="timeline-list">
          {milestones.map((ms, i) => {
            const imgSrc = getMilestoneImage(ms.title, ms.image);
            const isLeft = ms.side === 'left';
            
            return (
              <div
                key={`${ms.date}-${i}`}
                className={`timeline-milestone-card ${isLeft ? 'left-side' : 'right-side'}`}
              >
                <div className="timeline-card-body">
                  <div className="timeline-card-header-row">
                    <span className="timeline-card-date">{ms.date}</span>
                    <h3 className="timeline-card-title">{ms.title}</h3>
                  </div>
                  
                  <p className="timeline-card-detail">
                    {renderWithHighlights(ms.detail)}
                  </p>

                  {imgSrc && (
                    <div className="timeline-card-media">
                      <img src={imgSrc} alt={ms.title} className="timeline-media-img" />
                    </div>
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
