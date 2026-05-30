# Developer Profile Context

This context defines the core concepts and glossary for building a personal developer portfolio website.

## Language

**Developer Profile**:
The unified collection of personal details, skills, experiences, achievements, and projects of the developer.
_Avoid_: CV, resume, bio

**Project**:
A software application, service, or tool built by the developer to demonstrate technical and design capabilities.
_Avoid_: Assignment, homework, lab, repo

**Experience**:
A chronological record of academic, professional, leadership, or volunteer engagements.
_Avoid_: History, job, work

**Achievement**:
A distinct recognition, award, or leadership title earned by the developer.
_Avoid_: Award, prize, certificate

**Timeline**:
A dedicated full-page section with a vertical line at the center of the viewport. Each scroll step reveals one milestone chronologically. The section locks scrolling until all milestones are revealed, then releases to the next section.
_Avoid_: History list, schedule

**Milestone**:
A single entry on the **Timeline** representing a dated **Experience** or **Achievement**.
_Avoid_: Event, item, entry

**Infinite Marquee**:
A continuously looping horizontal scroll of technology logos. Positioned as the final sub-step of the Skills section, appearing after skill cards have animated in. Tech logos are rendered in their official brand colors rather than grayscale.
_Avoid_: Carousel, slide show

**Contact Info**:
The set of public communication channels and professional profile links of the developer.
_Avoid_: Links, socials

**Admin Route**:
A dedicated `/admin` page for managing all portfolio content (profile, projects, milestones, skills, contact). Self-contained — removing the route and its components cleanly disables all editing capability without affecting the public portfolio.
_Avoid_: CMS, dashboard, settings

**Navigation Header**:
The fixed header showing the logo and section links. When scrolling away from the initial Home/Hero section (`currentSection > 0`), the header slides up and fades out dynamically, sliding back down only when returning to the top section.

## Relationships

- A **Developer Profile** contains multiple **Projects**, **Experiences**, **Achievements**, and **Contact Info** records.
- An **Experience** or **Achievement** is represented as a **Milestone** on the **Timeline**.
- The **Infinite Marquee** displays brand-colored technology logos and belongs to the Skills section.
- The **Admin Route** reads/writes all content data (JSON). Removing it leaves the portfolio read-only from static JSON.
- Section flow (public): Hero (with ambient video background) → Skills (cards + brand-colored **Infinite Marquee** sub-step) → **Timeline** (milestone sub-steps) → Projects → Contact.
- Route structure: `/` (portfolio) + `/admin` (content management, removable).

## Example dialogue

> **Dev:** "When the user scrolls on the **Timeline**, do we go straight to Projects?"
> **Domain expert:** "No — each scroll reveals one **Milestone** at a time. Only after the last **Milestone** is revealed does the next scroll transition to Projects."

## Flagged ambiguities

- "lab" vs **Project**: School exercises and security labs (CyberJutsu/PortSwigger) are classified as skills or learning activities, not **Projects**.
- "Skills section" includes both the skill cards and the **Infinite Marquee** as sub-steps within one section. Both sub-steps render tech-colored SVG logos instead of monochromatic placeholders.
- "trigger" was clarified as **Admin Route** — a separate `/admin` page, not inline edit buttons.
