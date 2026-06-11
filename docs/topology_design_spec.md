# Technical Design Specification: Topology & GSAP Personal Portfolio CV

This specification defines the interactive behavior, UI aesthetics, formulas, and animation architecture for the redesigned personal portfolio website.

---

## 1. Design System & Topology Theme

The theme is inspired by **Topology (tô pô học)**—focusing on continuous curves, grids, vertices, and the fluid connection between nodes. The goal is to convey an infinite, interconnected space representing complex backend engineering and cybersecurity.

### 1.1 Color Palette (Metallic & Graphite)

| Variable | Value | Usage |
| :--- | :--- | :--- |
| `--bg-base` | `#08080a` (Solid rich graphite-black) | Primary body background |
| `--accent-gold` | `#d4af37` (Metallic gold/bronze) | Highlights, timeline progress, primary CTA |
| `--accent-cyan` | `#00e5ff` (Neon blue-cyan) | Secondary highlights, tech category tags |
| `--accent-silver` | `#e2e8f0` (Metallic silver-gray) | Core typography, connector nodes |
| `--text-primary` | `#f8fafc` | Title, headings |
| `--text-muted` | `rgba(248, 250, 252, 0.7)` | Subtext, paragraph description |
| `--text-dim` | `rgba(248, 250, 252, 0.35)` | Metadata labels, coordinates, borders |
| `--border-gradient` | `linear-gradient(135deg, rgba(212,175,55,0.2), rgba(0,229,255,0.1))` | Default card border |

### 1.2 Typography
- **Headings (Sans/Serif)**: `Cormorant Garamond` (for elegant titles) and `Google Sans Code` or `IBM Plex Mono` (for technical indicators).
- **Body text**: `Inter Tight` (line-height: `1.75`).
- **Technical indicators**: `IBM Plex Mono` or monospace for tags, dates, and mathematical indicators.

---

## 2. Component: Topology Background Canvas

The background is a dynamic HTML5 Canvas element covering the screen, replacing all static images.

### 2.1 Drawing Layers
1. **Undulating Topo Lines (Bezier Curves)**:
   - Three independent, overlapping waves that trace across the screen horizontally.
   - Drawn using cubic Bezier curves or sine waves:
     $$y(x, t) = A_1 \sin(f_1 \cdot x + \phi_1 \cdot t) + A_2 \cos(f_2 \cdot x - \phi_2 \cdot t)$$
   - Color: Thin stroke (`lineWidth: 0.8`) with a gradient from `--accent-gold` to `transparent` or `--accent-cyan`.
2. **Interconnected Nodes Mesh (Coordinate Grid)**:
   - A grid of $N$ floating points $(x_i, y_i)$ moving with randomized velocity vectors $(vx_i, vy_i)$.
   - Draw lines connecting node $i$ and node $j$ if their Euclidean distance is below $D_{max}$ ($120\text{px}$ on desktop, $70\text{px}$ on mobile):
     $$\text{distance} = \sqrt{(x_i - x_j)^2 + (y_i - y_j)^2} < D_{max}$$
   - The connection opacity scales inversely with distance:
     $$\text{opacity} = 1 - \frac{\text{distance}}{D_{max}}$$
3. **Cursor Mesh Distortion (Rippling)**:
   - The mouse cursor exerts a repulsive force on nearby nodes.
   - When the mouse $(mx, my)$ is within radius $R$ of a node $(x, y)$, warp the node away:
     $$dx = x - mx, \quad dy = y - my$$
     $$dist = \sqrt{dx^2 + dy^2}$$
     $$\text{if } dist < R: \quad x \leftarrow x + \frac{dx}{dist} \cdot (R - dist) \cdot 0.15$$
4. **Noise Layer (Grain Overlay)**:
   - A static or animated canvas noise pattern overlay (`rgba(255, 255, 255, 0.015)`) to create a premium, analog blueprint feel.

### 2.2 Scroll Parallax
- The vertical scroll position controls the offsets of layers to create 3D depth:
  - Layer 1 (Background waves): Parallax factor $= 0.1 \times \Delta y_{\text{scroll}}$
  - Layer 2 (Connecting nodes): Parallax factor $= 0.25 \times \Delta y_{\text{scroll}}$
  - Layer 3 (Foreground particles): Parallax factor $= 0.5 \times \Delta y_{\text{scroll}}$

---

## 3. Section: Skills (GSAP Infinite Loop Rows)

Instead of static cards, the Skills section features two horizontal lists of skills looping infinitely.

### 3.1 Loop Architecture
- **Row 1**: Frontend Technologies (`React`, `Next.js`, `TypeScript`, `HTML/CSS/JS`, `Vite`). Moves to the **left**.
- **Row 2**: Backend & Security (`Java`, `Spring Boot`, `PostgreSQL`, `MongoDB`, `OWASP Top 10`, `Python`, `NestJS`). Moves to the **right**.
- **Loop Math (GSAP Modulus)**:
  - Cards are positioned inline in a flex container. GSAP offsets their translation using the modulus logic to pop cards back to the end of the row when they exit the viewport.
  - Math formulation for loop position:
    $$\text{pos}_i = (\text{initial\_pos}_i + t \cdot \text{speed}) \pmod{\text{total\_width}}$$

### 3.2 Scroll/Wheel Interaction
- Each loop runs at a base speed (e.g., `timeScale = 1.0`).
- When a `wheel` or `touchmove` scroll event is captured, the loop accelerates:
  - $\text{timeScale} \leftarrow \text{timeScale} + \text{clamp}(\text{deltaY} \times 0.01, -3.0, 3.0)$
  - A GSAP tick listener or lerp function gradually returns `timeScale` back to the default `1.0`:
    $$\text{timeScale} \leftarrow \text{timeScale} + (1.0 - \text{timeScale}) \cdot 0.05$$
- On hover, the rows slow down smoothly (`timeScale = 0.15`) to allow recruiters to read detail tags.

---

## 4. Section: Experience & Projects (Grid & GSAP Detail Drawers)

A unified dashboard containing both Projects and Journey Milestones, arranged in a grid or toggled via tabs.

### 4.1 Card Design
- Custom glassmorphic cards (`background: rgba(18, 22, 30, 0.45)`, `backdrop-filter: blur(16px)`).
- Border spotlight: CSS custom variables (`--mouse-x`, `--mouse-y`) fed by a mouse listener, lighting up the border border gradient only near the cursor.

### 4.2 GSAP Animations
1. **Hover 3D Tilt**:
   - Subtle 3D perspective rotation using GSAP. When mouse enters, rotate the card on the X and Y axes depending on mouse coordinates:
     $$\text{rotateY} = 15 \times \left(\frac{mx}{\text{width}} - 0.5\right), \quad \text{rotateX} = -15 \times \left(\frac{my}{\text{height}} - 0.5\right)$$
2. **Click Expansion Detail Timeline**:
   - Clicking a card triggers a GSAP timeline that:
     1. Creates a backdrop blur overlay on the section.
     2. Slides down a detail panel from the top of the grid (`translateY(-20px)` to `0`, `opacity: 0` to `1`, `height: auto`).
     3. Staggers the project details: Role, Period, Tech Stack tags, GitHub/Live links, and Key Achievements.
     4. Disables global section scrolling while the detail drawer is open.
   - Clicking the close button (`X`) reverses the timeline.

---

## 5. Performance Optimization Specs

- **GPU Acceleration**: Promote background canvas and loop cards using `will-change: transform, opacity`.
- **Throttling/Debouncing**: Debounce resize triggers and throttle mouse tracking to `requestAnimationFrame` intervals to avoid layout thrashing.
- **Viewport Culling**: Pause the Canvas loop and the Skills marquee loops when they are not in the active viewport (e.g., when `currentSection` is not active), saving CPU/GPU cycles.
- **Font Rendering**: Add `font-display: swap` to Google Fonts imports.
