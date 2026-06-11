# Product Requirements Document (PRD) — Developer Portfolio

## 1. Overview & Context

This PRD defines the requirements for a personal Developer Portfolio (CV) website representing a sophomore IT student at HCMUTE specializing in Backend Engineering & Information Security. The portfolio showcase aims to impress tech recruiters and potential employers with a high-end, premium, interactive, and performant web experience.

## 2. Target User Persona

- **Tech Recruiters & Engineering Managers**: 
  - Looking for exceptional junior developers, interns, or part-time backend engineers/security enthusiasts.
  - Wants to quickly evaluate technical skills (Java, TS, Spring Boot, NestJS), real-world projects with quantifiable impact, and academic milestones.
  - Expects a highly polished, professional, and unique visual experience that signals dedication and attention to detail.

## 3. Conversion Goals & Success Metrics

- **Primary Goal**: Increase employer inquiries via email, GitHub, and LinkedIn links.
- **Conversion Metric**: Achieved visitor-to-inquiry rate of **3%** or higher.
- **Performance Success Metrics**:
  - **Core Web Vitals**: LCP < 2.5 seconds, INP < 200ms, CLS < 0.1.
  - **A11y & SEO**: WCAG AA contrast compliance, SEO structured layout.
  - **Test Suite**: 100% test coverage for navigation flow and key interactive sections.

## 4. Technical Constraints & Stack

- **Framework**: React 19 + TypeScript + Vite.
- **Styling**: Vanilla CSS (maximum control, modular structure).
- **Animations**: Framer Motion (for structural transitions) and HTML5 Canvas (for ambient background elements).
- **Aesthetic**: Deep dark mode only (solid black `#000000` / deep dark `#0d0d0d`).
- **Visual Mode**: Dark Mode.

## 5. Visual Direction & Brand Keywords

- **Keywords**: Sleek, Blueprint, Technical, Cyberpunk-adjacent, Defensive, Minimalist, Precision.
- **Background Atmosphere**: Ambient 3D Meteor Canvas running top-right to bottom-left over solid black, coupled with soft radial background gradients (glows) and blueprint lines.
- **Typography**: Clean monospace/sans-serif code font (`Google Sans Code` or `IBM Plex Mono`).

## 6. Functional & Content Requirements

1. **Navigation Header**: Slide-up/down header containing logo (`nguyen.dev`) and section links.
2. **Hero Section**:
   - Availability badge indicating active status.
   - Large serif/monospace title with a high-impact headline ("Built to scale. Deployed to defend.").
   - Ambient background video with gradient overlay and canvas particle tracking.
3. **Skills Section**:
   - Visual card deck showing core programming languages, frameworks, and tools.
   - Interactive sliding skill percent bars with linear gradient fill.
   - Infinite tech marquee featuring colored SVG logos.
4. **Timeline Section**:
   - A vertical line center locked timeline.
   - Sequential milestone reveals (e.g. specialized school, contest achievements, ASEAN hackathon).
5. **Projects Section**:
   - Interactive list detailing project title, detailed tech tags, role, and period.
   - Must include quantifiable metrics in descriptions (e.g. ESP32 smart threat detection ESP32 ESP32 system, Virtual ChemLab).
6. **Contact Section**:
   - Explicit calls to action linking directly to LinkedIn, GitHub, and Email.
