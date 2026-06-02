import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { SKILL_COLORS, SKILL_ICONS, SKILL_FALLBACK_COLOR, SKILL_FALLBACK_ICON } from '../../data/brandAssets';

interface Skill {
  name: string;
  percent: number;
  logo: string;
  tags?: string[];
}

interface SkillsProps {
  skills: Skill[];
  animateBars: boolean;
  showMarquee: boolean;
}

const MARQUEE_ITEMS = [
  'Spring', 'NestJS', 'Docker', 'Cloudflare', 'Claude', 'Gemini', 
  'MySQL', 'PostgreSQL', 'Postman', 'Java', 'JavaScript', 'Python', 
  'TypeScript', 'TypeORM', 'Supabase', 'MongoDB', 'C++', 'Vite', 'Antigravity'
];

const getLogoKey = (name: string): string => {
  const clean = name.toLowerCase();
  if (clean.includes('spring')) return 'spring';
  if (clean.includes('nest')) return 'nestjs';
  if (clean.includes('next')) return 'nextjs';
  if (clean.includes('react')) return 'react';
  if (clean.includes('postgres')) return 'postgresql';
  if (clean.includes('mongo')) return 'mongodb';
  if (clean.includes('python')) return 'python';
  if (clean.includes('typescript') || clean === 'ts') return 'typescript';
  if (clean.includes('javascript') || clean.includes('js') || clean.includes('html') || clean.includes('css')) return 'javascript';
  if (clean.includes('java')) return 'java';
  if (clean.includes('vite')) return 'vite';
  if (clean.includes('docker')) return 'docker';
  if (clean.includes('cloudflare')) return 'cloudflare';
  if (clean.includes('claude')) return 'claude';
  if (clean.includes('gemini')) return 'gemini';
  if (clean.includes('mysql')) return 'mysql';
  if (clean.includes('postman')) return 'postman';
  if (clean.includes('typeorm')) return 'typeorm';
  if (clean.includes('supabase')) return 'supabase';
  if (clean.includes('c++') || clean.includes('cplusplus')) return 'cplusplus';
  if (clean.includes('antigravity')) return 'antigravity';
  if (clean.includes('git')) return 'git';
  if (clean.includes('linux')) return 'linux';
  if (clean.includes('owasp') || clean.includes('security') || clean.includes('vulnerability')) return 'shield';
  return 'default';
};

const renderSkillIcon = (name: string, size = 16) => {
  const logoKey = getLogoKey(name);
  const icon = SKILL_ICONS[logoKey] || SKILL_FALLBACK_ICON;
  const color = SKILL_COLORS[logoKey] || SKILL_FALLBACK_COLOR;
  
  return React.cloneElement(icon as React.ReactElement<any>, {
    width: size,
    height: size,
    fill: color,
    style: { display: 'inline-block', flexShrink: 0 }
  });
};

const MotionSkillCard = ({
  skill,
  depthIndex,
  visibleCount,
  xOffset,
  zOffset,
  rYOffset,
  cardWidth,
  cardHeight,
  renderSkillIcon,
  handleNext,
  handlePrev,
}: {
  skill: Skill;
  depthIndex: number;
  visibleCount: number;
  xOffset: number;
  zOffset: number;
  rYOffset: number;
  cardWidth: number;
  cardHeight: number;
  renderSkillIcon: (name: string, size?: number) => React.ReactNode;
  handleNext: () => void;
  handlePrev: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFront = depthIndex === 0;

  // Hover 3D tilt motion values
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  // Springs for 3D hover rotation (only active on front card)
  const springRotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [10, -10]), { damping: 25, stiffness: 200 });
  const springRotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-10, 10]), { damping: 25, stiffness: 200 });

  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFront || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    tiltX.set((mouseX / width) - 0.5);
    tiltY.set((mouseY / height) - 0.5);
    setGlowPos({ x: mouseX, y: mouseY });
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    setIsHovered(false);
  };

  // Stack translations
  const targetX = depthIndex * xOffset;
  const targetZ = -depthIndex * zOffset;
  const targetRotateY = depthIndex * rYOffset;
  const targetOpacity = 1 - depthIndex * 0.16;

  // Brand-color specific styles
  const logoKey = getLogoKey(skill.name);
  const brandColor = SKILL_COLORS[logoKey] || '#6da4ff';

  return (
    <motion.div
      ref={cardRef}
      className={`skill-card-stack ${isFront ? 'front' : 'back'}`}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_e, info) => {
        if (!isFront) return;
        // Swiping right triggers NEXT card, swiping left triggers PREVIOUS card
        if (info.offset.x > 120) {
          handleNext();
        } else if (info.offset.x < -120) {
          handlePrev();
        }
      }}
      initial={{
        opacity: 0,
        x: (visibleCount - 1) * xOffset + 50,
        z: -(visibleCount - 1) * zOffset - 50,
        rotateY: (visibleCount - 1) * rYOffset,
      }}
      animate={{
        opacity: targetOpacity,
        x: targetX,
        z: targetZ,
        rotateY: isFront && isHovered ? springRotateY.get() : targetRotateY,
        rotateX: isFront && isHovered ? springRotateX.get() : 0,
      }}
      exit={{
        opacity: 0,
        x: 500,
        z: 50,
        rotateY: -25,
        transition: { duration: 0.35, ease: "easeIn" }
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      style={{
        width: cardWidth,
        height: cardHeight,
        zIndex: visibleCount - depthIndex,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => isFront && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Front card glow reflection */}
      {isFront && isHovered && (
        <div
          className="skill-card-glow"
          style={{
            background: `radial-gradient(150px circle at ${glowPos.x}px ${glowPos.y}px, ${brandColor}1c, transparent 80%)`,
          }}
        />
      )}

      {/* Blueprint Corner Indicators */}
      <div className="card-blueprint-corner top-left" />
      <div className="card-blueprint-corner top-right" />
      <div className="card-blueprint-corner bottom-left" />
      <div className="card-blueprint-corner bottom-right" />

      {/* Floating Header */}
      <div className="skill-card-header" style={{ width: '100%' }}>
        <div 
          className="skill-logo-wrapper"
          style={{ 
            borderColor: `${brandColor}40`,
            boxShadow: `inset 0 0 12px ${brandColor}10`,
            width: '80px',
            height: '80px',
            borderRadius: '16px'
          }}
        >
          {renderSkillIcon(skill.name, 64)}
        </div>
        <div className="skill-info" style={{ gap: '8px', width: '100%' }}>
          <h3 className="skill-title" style={{ fontWeight: 600, color: brandColor }}>{skill.name}</h3>
          {skill.tags && skill.tags.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginTop: '2px' }}>
              {skill.tags.map(tag => (
                <span 
                  key={tag} 
                  style={{ 
                    fontSize: '10px', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    border: `0.5px solid ${brandColor}40`,
                    color: brandColor,
                    backgroundColor: `${brandColor}08`,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="skill-progress-section" style={{ marginTop: 'auto' }}>
        <div className="skill-progress-header" style={{ justifyContent: 'center', marginBottom: '4px' }}>
          <span className="skill-percent-text" style={{ fontSize: '12px', color: brandColor, fontWeight: 600 }}>{skill.percent}%</span>
        </div>
        <div className="skill-bar-track">
          <motion.div
            className="skill-bar-fill"
            style={{ background: brandColor }}
            initial={{ width: 0 }}
            animate={{ width: `${skill.percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const Skills = ({ skills, showMarquee }: SkillsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!skills || skills.length === 0) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % skills.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + skills.length) % skills.length);
  };

  const visibleCount = Math.min(5, skills.length);
  const visibleCards = [];
  for (let i = 0; i < visibleCount; i++) {
    const index = (activeIndex + i) % skills.length;
    visibleCards.push({ skill: skills[index], originalIndex: index, depthIndex: i });
  }

  const cardWidth = isMobile ? 200 : 240;
  const cardHeight = isMobile ? 270 : 320;
  const xOffset = isMobile ? 12 : 30;
  const zOffset = isMobile ? 35 : 55;
  const rYOffset = isMobile ? -4 : -6;

  const padZero = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="skills-content">
      <h2 className="skills-heading">What I build with</h2>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', textAlign: 'center' }}>
        Technologies I use daily to build secure, scalable systems
      </p>

      {/* 3D Stack container */}
      <div className="skills-stack-wrapper">
        <div 
          className="skills-stack-container" 
          style={{ 
            width: cardWidth + (visibleCount - 1) * xOffset, 
            height: cardHeight 
          }}
        >
          <AnimatePresence mode="popLayout">
            {visibleCards.map(({ skill, depthIndex }) => (
              <MotionSkillCard
                key={skill.name}
                skill={skill}
                depthIndex={depthIndex}
                visibleCount={visibleCount}
                xOffset={xOffset}
                zOffset={zOffset}
                rYOffset={rYOffset}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                renderSkillIcon={renderSkillIcon}
                handleNext={handleNext}
                handlePrev={handlePrev}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="skills-stack-nav">
          <button 
            type="button" 
            className="skills-nav-btn" 
            onClick={handlePrev}
            aria-label="Previous skill"
          >
            ←
          </button>
          <span className="skills-nav-indicator">
            {padZero(activeIndex + 1)} / {padZero(skills.length)}
          </span>
          <button 
            type="button" 
            className="skills-nav-btn" 
            onClick={handleNext}
            aria-label="Next skill"
          >
            →
          </button>
        </div>
      </div>

      {/* Infinite Marquee */}
      <div className={`marquee-container${showMarquee ? ' visible' : ''}`}>
        <div className="marquee-inner animate-marquee">
          {[
            ...MARQUEE_ITEMS,
            ...MARQUEE_ITEMS
          ].map((item, i) => (
            <span 
              className="marquee-item" 
              key={`${item}-${i}`}
              title={item}
            >
              {renderSkillIcon(item, 38)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
