import { useState, useEffect, useRef } from 'react';
import '../styles/about.css';

const manifesto = [
  "Nocturnal code cycles are a craft, not a constraint.",
  "Atmospheric deployment should feel like turning on a lantern in a quiet room.",
  "Artisanal digital architecture rewards patience, material contrast, and sharp editorial focus.",
  "Low-latency tranquility keeps interfaces calm even when systems move fast.",
  "Twilight-logic engineering balances warmth, speed, and precision."
];

export default function About() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Manifesto Typing States
  const [completedText, setCompletedText] = useState("");
  const [currentLineProgress, setCurrentLineProgress] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // 1. Dynamic Script, Fonts, and #root width Override
  useEffect(() => {
    // Load Google Fonts
    const fontsLink = document.createElement('link');
    fontsLink.id = 'about-fonts';
    fontsLink.rel = 'stylesheet';
    fontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontsLink);

    // Load Tailwind CDN Script
    let script = document.getElementById('tailwind-cdn') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }

    // Override the width constraint of #root (which is 1126px globally) to make About page full-bleed
    const root = document.getElementById('root');
    let originalWidth = '';
    let originalMaxWidth = '';
    let originalMargin = '';
    let originalBorderInline = '';

    if (root) {
      originalWidth = root.style.width;
      originalMaxWidth = root.style.maxWidth;
      originalMargin = root.style.margin;
      originalBorderInline = root.style.borderInline;

      root.style.width = '100%';
      root.style.maxWidth = 'none';
      root.style.margin = '0';
      root.style.borderInline = 'none';
    }

    return () => {
      // Clean up Fonts
      const fl = document.getElementById('about-fonts');
      if (fl) fl.remove();

      // Clean up Tailwind CDN Script
      const sc = document.getElementById('tailwind-cdn');
      if (sc) sc.remove();

      // Clean up Tailwind-generated styles
      const styleTags = document.head.querySelectorAll('style');
      styleTags.forEach((style) => {
        if (style.innerHTML.includes('--tw-') || style.innerHTML.includes('tailwindcss')) {
          style.remove();
        }
      });

      // Restore original #root styles
      if (root) {
        root.style.width = originalWidth;
        root.style.maxWidth = originalMaxWidth;
        root.style.margin = originalMargin;
        root.style.borderInline = originalBorderInline;
      }
    };
  }, []);

  // 2. Manifesto typing effect
  useEffect(() => {
    if (lineIndex >= manifesto.length) return;

    const currentLine = manifesto[lineIndex];

    if (charIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setCurrentLineProgress((prev) => prev + currentLine[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCompletedText((prev) => prev + (lineIndex > 0 ? "\n\n" : "") + currentLine);
        setCurrentLineProgress("");
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [lineIndex, charIndex]);

  // 3. Scroll parallax for background video
  useEffect(() => {
    let ticking = false;
    const updateHero = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 1.15), 1);
      const scale = 1.07 + progress * 0.1;
      const translate = progress * 14;

      if (videoRef.current) {
        videoRef.current.style.transform = `scale(${scale}) translateY(${translate}px)`;
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateHero();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateHero(); // Run once initially

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 4. Scroll-reveal Observer (.reveal elements)
  useEffect(() => {
    if (!wrapperRef.current) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    const elements = wrapperRef.current.querySelectorAll(".reveal");
    elements.forEach((el) => revealObserver.observe(el));

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  // 5. View transitions on buttons
  useEffect(() => {
    const supportsViewTransitions = typeof (document as any).startViewTransition === "function";
    if (!supportsViewTransitions || !wrapperRef.current) return;

    const handleButtonClick = () => {
      (document as any).startViewTransition(() => {
        // No-op
      });
    };

    const buttons = wrapperRef.current.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", handleButtonClick);
    });

    return () => {
      buttons.forEach((btn) => {
        btn.removeEventListener("click", handleButtonClick);
      });
    };
  }, []);

  const displayedText = completedText + (currentLineProgress ? (lineIndex > 0 ? "\n\n" : "") + currentLineProgress : "");

  return (
    <div className="about-page-wrapper" ref={wrapperRef}>
      {/* Decorative Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-[10%] top-[12%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,180,102,.18),transparent_70%)] blur-3xl"></div>
        <div className="absolute right-[6%] bottom-[10%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(62,145,139,.12),transparent_70%)] blur-3xl"></div>
      </div>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <video ref={videoRef} id="heroVideo" autoPlay muted loop playsInline className="hero-video">
            <source src="/video.mp4" type="video/mp4" />
          </video>

          <div className="hero-center">
            <div className="hero-shell">
              <div className="hero-kicker reveal drop-shadow-[0_8px_8px_rgba(0,0,0,1)]">
                <span></span>
                Nocturnal code cycles · atmospheric deployment
              </div>

              <h1 className="hero-title display reveal drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] drop-shadow-[0_8px_8px_rgba(0,0,0,1)]">
                Aether House
              </h1>

              <p className="hero-sub reveal drop-shadow-[0_8px_10px_rgba(0,0,0,1)] pb-60">
                Crafting the nocturnal web through artisanal digital architecture, low-latency tranquility, and twilight-logic engineering.
              </p>

              <div className="hero-actions reveal">
                <button className="lantern-core px-7 py-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  Open the Studio
                </button>
                <button className="rounded-full border border-white/10 bg-white/8 px-7 py-5 text-[11px] uppercase tracking-[0.26em] text-white/80 backdrop-blur-[20px] transition hover:bg-white/12 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                  View Manifesto
                </button>
              </div>

              <div className="hero-chips reveal drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                <span>Teal Wood</span>
                <span>Amber Glow</span>
                <span>Twilight Blue</span>
              </div>
            </div>
          </div>
        </section>

        {/* Manifesto Code Console Section */}
        <section className="section">
          <div className="wrap">
            <div className="section-heading reveal">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.35em] text-white/50">
                  The Code Window
                </div>
                <h2 className="display mt-5 text-white">
                  A manifesto written in real time.
                </h2>
              </div>
              <p>
                The studio’s principles appear as a live terminal, floating inside a rounded liquid window with warm glass edges and lantern-like glow.
              </p>
            </div>

            <div className="code-window reveal">
              <div className="code-top">
                <div className="dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="tag">Nocturnal logic console</div>
                <div className="mono text-[10px] uppercase tracking-[0.28em] text-white/60">
                  LIVE
                </div>
              </div>

              <div className="code-body">
                <div className="manifesto">
                  <div className="headline">Manifesto</div>
                  <pre id="manifestoText">{displayedText}</pre>
                  <span className="cursor"></span>
                </div>

                <div className="metrics">
                  <div className="metric">
                    <div className="label">Deployment rhythm</div>
                    <div className="value display">24/7</div>
                    <div className="sub">Atmospheric releases, quiet handoffs, and calm production cycles.</div>
                  </div>

                  <div className="metric">
                    <div className="label">Latency posture</div>
                    <div className="value display">Low</div>
                    <div className="sub">Interfaces tuned for speed without abandoning warmth or editorial focus.</div>
                  </div>

                  <div className="metric">
                    <div className="label">Creative signal</div>
                    <div className="value display">High</div>
                    <div className="sub">A craft-first studio for creators, founders, and digital builders.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects section */}
        <section className="projects">
          <div className="wrap">
            <div className="section-heading reveal">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.35em] text-white/50">
                  City-Lights Grid
                </div>
                <h2 className="display mt-5 text-white">
                  Projects that light up only when they are approached.
                </h2>
              </div>
              <p>
                Hover to reveal each project as a lit apartment window in the city below. Every tile carries a different atmosphere, tone, and craft note.
              </p>
            </div>

            <div className="projects-grid">
              <article className="project wide tall reveal">
                <div className="inner">
                  <div>
                    <div className="label">Digital Architecture</div>
                    <h3 className="display mt-4">Midnight journal for a quiet luxury brand.</h3>
                    <p>Typography-led landing pages that feel hand-assembled, with precise rhythm and velvet-toned transitions.</p>
                  </div>
                  <div className="on-hover">Open window</div>
                </div>
                <div className="glow"></div>
              </article>

              <article className="project reveal">
                <div className="inner">
                  <div>
                    <div className="label">Creator Studio</div>
                    <h3 className="display mt-4">Editorial toolkits for founders.</h3>
                    <p>Systems for storytelling, product launches, and ambient portfolio pages with nocturnal restraint.</p>
                  </div>
                  <div className="on-hover">Open window</div>
                </div>
                <div className="glow"></div>
              </article>

              <article className="project reveal">
                <div className="inner">
                  <div>
                    <div className="label">Luxury Commerce</div>
                    <h3 className="display mt-4">High-trust boutique storefronts.</h3>
                    <p>Warm, tactile shopping experiences that balance focus, softness, and conversion clarity.</p>
                  </div>
                  <div className="on-hover">Open window</div>
                </div>
                <div className="glow"></div>
              </article>

              <article className="project wide reveal">
                <div className="inner">
                  <div>
                    <div className="label">Atmospheric System</div>
                    <h3 className="display mt-4">Dark-mode design infrastructure for modern teams.</h3>
                    <p>Reusable motion, layout, and content primitives built to feel cohesive under late-night creative pressure.</p>
                  </div>
                  <div className="on-hover">Open window</div>
                </div>
                <div className="glow"></div>
              </article>

              <article className="project reveal">
                <div className="inner">
                  <div>
                    <div className="label">Motion Language</div>
                    <h3 className="display mt-4">Soft flicker, branch sway, and lantern glow.</h3>
                    <p>A motion layer that behaves like a city at dusk, not a dashboard at noon.</p>
                  </div>
                  <div className="on-hover">Open window</div>
                </div>
                <div className="glow"></div>
              </article>

              <article className="project reveal">
                <div className="inner">
                  <div>
                    <div className="label">Product Strategy</div>
                    <h3 className="display mt-4">Quiet systems for sharp operators.</h3>
                    <p>Strategic landing experiences that turn complex services into warm, navigable spaces.</p>
                  </div>
                  <div className="on-hover">Open window</div>
                </div>
                <div className="glow"></div>
              </article>
            </div>
          </div>
        </section>

        {/* Transition / Details section */}
        <section className="section">
          <div className="wrap">
            <div className="section-heading reveal">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.35em] text-white/50">
                  Sunset-to-Night Transition
                </div>
                <h2 className="display mt-5 text-white">
                  A background that deepens as the page descends.
                </h2>
              </div>
              <p>
                Warm sunset notes drift into indigo as the page moves downward, keeping the interface human, soft, and focused.
              </p>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1.1fr_.9fr]">
              <div className="cozy-layer rounded-[2.2rem] p-8 xl:p-10 reveal">
                <div className="mono text-[10px] uppercase tracking-[0.34em] text-white/50">
                  Branch-level deployment
                </div>
                <h3 className="display mt-6 text-[clamp(2.4rem,5vw,4.8rem)] text-white">
                  The studio’s operating rhythm is built for quiet focus.
                </h3>
                <p className="mt-6 max-w-2xl text-white/72 leading-8">
                  Aether House combines nocturnal code cycles, slow atmospheric motion, and warm digital surfaces to create a premium environment for creators.
                </p>
              </div>

              <div className="cozy-layer rounded-[2.2rem] p-8 xl:p-10 reveal">
                <div className="mono text-[10px] uppercase tracking-[0.34em] text-white/50">
                  Low-latency tranquility
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/8 pb-4">
                    <span className="text-white/74">Strategy</span>
                    <span className="mono text-[10px] uppercase tracking-[0.26em] text-white/55">Editorial systems</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/8 pb-4">
                    <span className="text-white/74">Motion</span>
                    <span className="mono text-[10px] uppercase tracking-[0.26em] text-white/55">120fps feel</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/74">Tone</span>
                    <span className="mono text-[10px] uppercase tracking-[0.26em] text-white/55">Warm, nocturnal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-shell reveal">
            <div className="roofline"></div>

            <div className="relative z-10 footer-grid">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.35em] text-white/40">
                  The Rooftop Footer
                </div>
                <h2 className="display mt-5">
                  A panoramic city edge for star-mapped navigation.
                </h2>
                <p>
                  The final view opens wide, like a rooftop above the city, with a minimalist list of links suspended under the night sky.
                </p>
              </div>

              <div className="links">
                <a href="/">Studio</a>
                <a href="#">Services</a>
                <a href="#">Projects</a>
                <a href="#">Contact</a>
              </div>
            </div>

            <div className="footer-bottom relative z-10">
              <div>Aether House</div>
              <div>Amber Gold · Teal Wood · Twilight Blue</div>
              <div>Crafting the nocturnal web</div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
