import { useState, useCallback, useEffect, useRef } from 'react';
import '../styles/portfolio.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
import ScrollHint from '../components/portfolio/ScrollHint';
import videoUrl from '../assets/video.mp4';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_SECTIONS = 5;

const Portfolio = () => {
  const { profile, skills, milestones, projects, contact } = usePortfolioData();

  const [currentSection, setCurrentSection] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Go to section directly (smooth scroll to element)
  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= TOTAL_SECTIONS) return;
    const sectionEl = containerRef.current?.querySelector(`.portfolio-section[data-index="${index}"]`);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Update active navigation section index passively on scroll
  usePageNavigation({
    containerRef,
    totalSections: TOTAL_SECTIONS,
    onNavigate: setCurrentSection,
  });

  // Track scroll percentage for custom scrollbar
  useEffect(() => {
    const container = containerRef.current || document.querySelector('.portfolio-wrap');
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) return;
      setScrollPct(container.scrollTop / maxScroll);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef.current]);

  // GSAP ScrollTrigger to fade out background video as we scroll away from Hero
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '.hero-section-container',
        scroller: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self: any) => {
          gsap.set('.hero-video-bg, .hero-lights-overlay', { opacity: 1 - self.progress });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  // GSAP ScrollTrigger transitions for section entrances (fade + scale + skew)
  useEffect(() => {
    const sections = containerRef.current?.querySelectorAll('.portfolio-section');
    if (!sections) return;

    const ctx = gsap.context(() => {
      sections.forEach((sec, idx) => {
        const el = sec as HTMLElement;
        if (idx === 0) return; // Hero handles its own load entrance

        const inner = el.querySelector('.section-inner');
        if (!inner) return;

        ScrollTrigger.create({
          trigger: el,
          scroller: containerRef.current,
          start: 'top 85%',
          end: 'bottom 15%',
          onEnter: () => {
            gsap.fromTo(inner,
              { opacity: 0, scale: 0.95, skewY: 1.5, y: 30 },
              { opacity: 1, scale: 1, skewY: 0, y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform,skewY' }
            );
          },
          toggleActions: 'play none none none',
        });
      });
    });

    return () => ctx.revert();
  }, []);

  // Initial Page Load Timeline (bulletproof GSAP Context with fromTo)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set('.bg-canvas, .portfolio-nav', { opacity: 0 });
      
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.to('.bg-canvas', {
        opacity: 1,
        duration: 1.5,
      })
      .to('.portfolio-nav', {
        opacity: 1,
        duration: 0.8,
      }, '-=0.8')
      .fromTo('.availability-badge', 
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.5'
      )
      .fromTo('.hero-kicker',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5 },
        '-=0.4'
      )
      .fromTo('.hero-title',
        { y: 35, skewY: 1.5, opacity: 0 },
        { y: 0, skewY: 0, opacity: 1, duration: 0.8 },
        '-=0.4'
      )
      .fromTo('.hero-sub',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.5'
      )
      .fromTo('.hero-actions button',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.6 },
        '-=0.4'
      )
      .fromTo('.hero-chips span',
        { y: 10, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, stagger: 0.1, duration: 0.5 },
        '-=0.3'
      );
    });

    return () => ctx.revert();
  }, []);

  // Bind global spring click effect to all action buttons (including Hero's CTA)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('button, a, .skills-nav-btn, .section-dot');
      if (btn) {
        gsap.fromTo(btn,
          { scale: 0.93 },
          { scale: 1, duration: 0.45, ease: 'elastic.out(1.2, 0.4)' }
        );
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`portfolio-wrap ${currentSection !== 0 ? 'solid-dark-bg' : ''}`}
      style={{ overflowY: 'auto', scrollBehavior: 'smooth' }}
    >
      <BackgroundCanvas
        currentSection={currentSection}
      />
      <Navigation currentSection={currentSection} goToSection={goToSection} />

      {/* Hero — Section 0 (About Me) */}
      <div className="portfolio-section hero-section-container" data-index={0}>
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
      <div className="portfolio-section" data-index={1}>
        <div className="section-inner">
          <Skills skills={skills} showMarquee={currentSection === 1} />
        </div>
      </div>

      {/* Timeline — Section 2 */}
      <div className="portfolio-section" data-index={2}>
        <div className="section-inner">
          <Timeline milestones={milestones} currentSection={currentSection} />
        </div>
      </div>

      {/* Projects — Section 3 */}
      <div className="portfolio-section" data-index={3}>
        <div className="section-inner projects-section-inner">
          <Projects projects={projects} />
        </div>
      </div>

      {/* Contact — Section 4 */}
      <div className="portfolio-section" data-index={4}>
        <div className="section-inner">
          <Contact contact={contact} />
        </div>
      </div>

      <CustomScrollbar scrollPct={scrollPct} />
      <ScrollHint hidden={currentSection === TOTAL_SECTIONS - 1} />
    </div>
  );
};

export default Portfolio;
