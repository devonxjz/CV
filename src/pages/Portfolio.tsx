import { useState, useCallback, useEffect, useRef } from 'react';
import '../styles/portfolio.css';

import usePortfolioData from '../hooks/usePortfolioData';
import BackgroundCanvas from '../components/portfolio/BackgroundCanvas';
import Navigation from '../components/portfolio/Navigation';
import Hero from '../components/portfolio/Hero';
import Skills from '../components/portfolio/Skills';
import Timeline from '../components/portfolio/Timeline';
import Projects from '../components/portfolio/Projects';
import Contact from '../components/portfolio/Contact';
import CustomScrollbar from '../components/portfolio/CustomScrollbar';
import ScrollHint from '../components/portfolio/ScrollHint';
import videoUrl from '../assets/video.mp4';


const TOTAL_SECTIONS = 5;
const SCROLL_COOLDOWN = 700;
const TOUCH_THRESHOLD = 50;

const Portfolio = () => {
  const data = usePortfolioData();

  const [currentSection, setCurrentSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Sub-step states
  const [skillsSubStep, setSkillsSubStep] = useState(0); // 0 = cards, 1 = marquee

  const scrollLockRef = useRef(false);
  const touchStartY = useRef(0);

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

  // Handle scroll direction (1 = down, -1 = up)
  const handleScroll = useCallback((direction: number) => {
    if (scrollLockRef.current) return;

    scrollLockRef.current = true;
    setTimeout(() => {
      scrollLockRef.current = false;
    }, SCROLL_COOLDOWN);

    if (direction > 0) {
      // Scrolling DOWN
      if (currentSection === 1) {
        // Skills sub-steps
        if (skillsSubStep < 1) {
          setSkillsSubStep((s) => s + 1);
          return;
        }
      }
      // Move to next section
      if (currentSection < TOTAL_SECTIONS - 1) {
        const next = currentSection + 1;
        setCurrentSection(next);
        // Reset sub-steps for incoming section
        if (next === 1) {
          setSkillsSubStep(0);
        }
      }
    } else {
      // Scrolling UP
      if (currentSection === 1) {
        // Skills: go back through sub-steps
        if (skillsSubStep > 0) {
          setSkillsSubStep((s) => s - 1);
          return;
        }
      }
      // Move to previous section
      if (currentSection > 0) {
        const prev = currentSection - 1;
        setCurrentSection(prev);
        // Set sub-steps to end state for section we're going back to
        if (prev === 1) {
          setSkillsSubStep(1);
        }
      }
    }
  }, [currentSection, skillsSubStep]);

  // Wheel event
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (currentSection === 2) {
        // Timeline intercepts its own wheel events
        return;
      }

      if (currentSection === 3) {
        const container = document.querySelector('.projects-section-inner') as HTMLElement | null;
        if (container) {
          const isScrollable = container.scrollHeight > container.clientHeight + 10;
          if (isScrollable) {
            const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 15;
            const isAtTop = container.scrollTop <= 15;
            const direction = e.deltaY > 0 ? 1 : -1;

            if (direction > 0 && !isAtBottom) {
              container.scrollBy({ top: e.deltaY * 0.8, behavior: 'auto' });
              e.preventDefault();
              return;
            }
            if (direction < 0 && !isAtTop) {
              container.scrollBy({ top: e.deltaY * 0.8, behavior: 'auto' });
              e.preventDefault();
              return;
            }
          }
        }
      }

      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      handleScroll(direction);
    };

    const wrap = document.querySelector('.portfolio-wrap') as HTMLElement | null;
    if (wrap) {
      wrap.addEventListener('wheel', onWheel, { passive: false });
    }

    return () => {
      if (wrap) {
        wrap.removeEventListener('wheel', onWheel);
      }
    };
  }, [handleScroll, currentSection]);

  // Touch support
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (currentSection === 2) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (currentSection === 2) return;

      // If we are scrolling on the Projects container, don't trigger slide change unless at boundaries
      if (currentSection === 3) {
        const container = document.querySelector('.projects-section-inner') as HTMLElement | null;
        if (container) {
          const isScrollable = container.scrollHeight > container.clientHeight + 10;
          if (isScrollable) {
            const deltaY = touchStartY.current - e.changedTouches[0].clientY;
            const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 15;
            const isAtTop = container.scrollTop <= 15;

            if (deltaY > 0 && !isAtBottom) return;
            if (deltaY < 0 && !isAtTop) return;
          }
        }
      }

      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) > TOUCH_THRESHOLD) {
        handleScroll(deltaY > 0 ? 1 : -1);
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleScroll, currentSection]);

  // Keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '5') {
        goToSection(parseInt(e.key) - 1);
        return;
      }
      if (currentSection === 2) {
        // Timeline intercepts keyboard arrows
        return;
      }

      if (currentSection === 3) {
        const container = document.querySelector('.projects-section-inner') as HTMLElement | null;
        if (container) {
          const isScrollable = container.scrollHeight > container.clientHeight + 10;
          if (isScrollable) {
            const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 15;
            const isAtTop = container.scrollTop <= 15;

            if (e.key === 'ArrowDown') {
              if (!isAtBottom) {
                container.scrollBy({ top: 120, behavior: 'smooth' });
                e.preventDefault();
                return;
              }
            } else if (e.key === 'ArrowUp') {
              if (!isAtTop) {
                container.scrollBy({ top: -120, behavior: 'smooth' });
                e.preventDefault();
                return;
              }
            }
          }
        }
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleScroll(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleScroll(-1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleScroll, goToSection, currentSection]);

  // Mouse tracking for canvas
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const gridX = -mousePos.x * 0.012;
  const gridY = -mousePos.y * 0.012;

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
    <div
      className="portfolio-wrap"
      style={{ backgroundPosition: `${gridX}px ${gridY}px` }}
    >
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
          <Hero profile={data.profile} goToSection={goToSection} />
        </div>
      </div>

      {/* Skills — Section 1 */}
      <div className={sectionClass(1)}>
        <div className="section-inner">
          <Skills
            skills={data.skills}
            animateBars={currentSection === 1}
            showMarquee={skillsSubStep >= 1}
          />
        </div>
      </div>

      {/* Timeline — Section 2 */}
      <div className={sectionClass(2)}>
        <div className="section-inner">
          <Timeline
            milestones={data.milestones}
            onNext={() => goToSection(3)}
            onPrev={() => goToSection(1)}
            currentSection={currentSection}
          />
        </div>
      </div>

      {/* Projects — Section 3 */}
      <div className={sectionClass(3)}>
        <div className="section-inner projects-section-inner">
          <Projects projects={data.projects} />
        </div>
      </div>

      {/* Contact — Section 4 */}
      <div className={sectionClass(4)}>
        <div className="section-inner">
          <Contact contact={data.contact} />
        </div>
      </div>

      <CustomScrollbar
        currentSection={currentSection}
        totalSections={TOTAL_SECTIONS}
      />
      <ScrollHint hidden={currentSection === TOTAL_SECTIONS - 1} />
    </div>
  );
};

export default Portfolio;
