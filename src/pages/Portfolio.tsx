import { useState, useCallback, useEffect, useRef } from 'react';
import '../styles/portfolio.css';

import usePortfolioData from '../hooks/usePortfolioData';
import usePageNavigation from '../hooks/usePageNavigation';
import BackgroundCanvas from '../components/portfolio/BackgroundCanvas';
import Navigation from '../components/portfolio/Navigation';
import Hero from '../components/portfolio/Hero';
import Skills from '../components/portfolio/Skills';
import Timeline from '../components/portfolio/Timeline';
import Projects from '../components/portfolio/Projects';
import Contact from '../components/portfolio/Contact';
import CustomScrollbar from '../components/portfolio/CustomScrollbar';
import SectionDots from '../components/portfolio/SectionDots';
import ScrollHint from '../components/portfolio/ScrollHint';
import videoUrl from '../assets/video.mp4';


const TOTAL_SECTIONS = 5;
const SCROLL_COOLDOWN = 700;

const Portfolio = () => {
  const { profile, skills, milestones, projects, contact } = usePortfolioData();

  const [currentSection, setCurrentSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Sub-step states
  const [skillsSubStep, setSkillsSubStep] = useState(0); // 0 = cards, 1 = marquee

  const prevSectionRef = useRef(currentSection);

  // Go to section directly (from nav/dots)
  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= TOTAL_SECTIONS) return;
    setCurrentSection(index);

    // Reset sub-steps when navigating directly
    if (index === 1) {
      setSkillsSubStep(0);
      // Auto-trigger bar animation after brief delay
      setTimeout(() => setSkillsSubStep(0), 50);
    }
  }, []);

  // Sync sub-step reset on scroll navigation
  useEffect(() => {
    const prev = prevSectionRef.current;
    if (currentSection === 1) {
      if (prev === 0) {
        setSkillsSubStep(0);
      } else if (prev === 2) {
        setSkillsSubStep(1);
      }
    }
    prevSectionRef.current = currentSection;
  }, [currentSection]);

  // Unified page navigation
  usePageNavigation({
    totalSections: TOTAL_SECTIONS,
    currentSection,
    onNavigate: goToSection,
    lockedSection: 1,
    subStepCount: 2,
    currentSubStep: skillsSubStep,
    onSubStepChange: setSkillsSubStep,
    cooldownMs: SCROLL_COOLDOWN,
    disabled: currentSection === 2,
  });

  // Mouse tracking for canvas
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const sectionClass = (index: number) => {
    if (currentSection === index) {
      return 'portfolio-section active visible';
    } else if (index < currentSection) {
      return 'portfolio-section previous';
    } else {
      return 'portfolio-section next';
    }
  };

  return (
    <div className="portfolio-wrap">
      <BackgroundCanvas
        mouseX={mousePos.x}
        mouseY={mousePos.y}
        currentSection={currentSection}
      />
      <Navigation currentSection={currentSection} goToSection={goToSection} />

      {/* Hero — Section 0 (Aether House / About Me) */}
      <div className={`${sectionClass(0)} hero-section-container`}>
        {/* Ambient Background Video */}
        <video id="heroVideo" autoPlay muted loop playsInline className="hero-video-bg">
          <source src={videoUrl} type="video/mp4" />
        </video>

        {/* Ambient Background Decorative Glows */}
        <div className="hero-lights-overlay">
          <div className="hero-light-left"></div>
          <div className="hero-light-right"></div>
        </div>

        <div className="section-inner hero-section-inner">
          <Hero profile={profile} goToSection={goToSection} />
        </div>
      </div>

      {/* Skills — Section 1 */}
      <div className={sectionClass(1)}>
        <div className="section-inner">
          <Skills
            skills={skills}
            animateBars={currentSection === 1}
            showMarquee={skillsSubStep >= 1}
          />
        </div>
      </div>

      {/* Timeline — Section 2 */}
      <div className={sectionClass(2)}>
        <div className="section-inner">
          <Timeline
            milestones={milestones}
            onNext={() => goToSection(3)}
            onPrev={() => goToSection(1)}
            currentSection={currentSection}
          />
        </div>
      </div>

      {/* Projects — Section 3 */}
      <div className={sectionClass(3)}>
        <div className="section-inner projects-section-inner">
          <Projects projects={projects} />
        </div>
      </div>

      {/* Contact — Section 4 */}
      <div className={sectionClass(4)}>
        <div className="section-inner">
          <Contact contact={contact} />
        </div>
      </div>

      <CustomScrollbar
        currentSection={currentSection}
        totalSections={TOTAL_SECTIONS}
      />
      <SectionDots
        currentSection={currentSection}
        totalSections={TOTAL_SECTIONS}
        goToSection={goToSection}
      />
      <ScrollHint hidden={currentSection === TOTAL_SECTIONS - 1} />
    </div>
  );
};

export default Portfolio;
