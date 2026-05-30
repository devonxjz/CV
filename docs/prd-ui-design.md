# Portfolio UI — Tài liệu thiết kế chi tiết

> Tài liệu này mô tả toàn bộ kiến trúc giao diện, từng thành phần, hiệu ứng, màu sắc, typography, và logic tương tác của portfolio concept đã demo.

---

## Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Design System](#2-design-system)
3. [Layout cấu trúc tổng thể](#3-layout-cấu-trúc-tổng-thể)
4. [Component: Custom Cursor](#4-component-custom-cursor)
5. [Component: Background Canvas](#5-component-background-canvas)
6. [Component: Navigation Header](#6-component-navigation-header)
7. [Section: Hero](#7-section-hero)
8. [Section: Skills](#8-section-skills)
9. [Section: Projects](#9-section-projects)
10. [Section: Contact](#10-section-contact)
11. [Component: Section Dots Indicator](#11-component-section-dots-indicator)
12. [Component: Scroll Hint](#12-component-scroll-hint)
13. [Hệ thống chuyển section (Scroll Transition)](#13-hệ-thống-chuyển-section-scroll-transition)
14. [Hiệu ứng Particle Network](#14-hiệu-ứng-particle-network)
15. [Background Graphics theo từng section](#15-background-graphics-theo-từng-section)
16. [Logic JavaScript tổng thể](#16-logic-javascript-tổng-thể)
17. [Responsive breakpoints](#17-responsive-breakpoints)
18. [Gợi ý mở rộng](#18-gợi-ý-mở-rộng)

---

## 1. Tổng quan kiến trúc

```
#portfolio-wrap  ← container chính, overflow:hidden, position:relative
│
├── #bg-canvas        ← canvas HTML5, vẽ particle + background shapes
├── #cursor-dot       ← chấm tròn nhỏ bám sát con trỏ
├── #cursor-ring      ← vòng tròn lớn lag theo con trỏ
├── #nav              ← thanh điều hướng cố định phía trên
│
├── #sec-hero         ← Section 0: Hero
├── #sec-skills       ← Section 1: Skills
├── #sec-projects     ← Section 2: Projects
├── #sec-contact      ← Section 3: Contact
│
├── #scroll-hint      ← mũi tên scroll phía dưới
└── #sec-dots         ← chấm chỉ vị trí section, bên phải
```

**Cơ chế hoạt động:** Tất cả sections đều `position: absolute; inset: 0`, chồng lên nhau. Chỉ một section có class `.visible` (opacity: 1) tại một thời điểm. Chuyển section bằng scroll wheel hoặc click nav link.

---

## 2. Design System

### 2.1 Màu sắc

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--bg-base` | `#0f1117` | Nền tổng thể |
| `--accent-blue` | `#6da4ff` | Primary accent — link, highlight, glow |
| `--accent-purple` | `#a78bfa` | Secondary accent — project tag, gradient fill |
| `--accent-green` | `#34d399` | Success / thứ 3 — project dot |
| `--text-primary` | `#ffffff` | Heading, tên chính |
| `--text-muted` | `rgba(255,255,255,0.45)` | Subtext, mô tả |
| `--text-dim` | `rgba(255,255,255,0.2)` | Placeholder, hint |
| `--border-subtle` | `rgba(255,255,255,0.08)` | Border card mặc định |
| `--border-hover` | `rgba(109,164,255,0.4)` | Border khi hover |
| `--card-bg` | `rgba(255,255,255,0.04)` | Nền card |
| `--card-hover-bg` | `rgba(109,164,255,0.08)` | Nền card khi hover |

### 2.2 Typography

| Element | Font size | Font weight | Ghi chú |
|---|---|---|---|
| Logo / Brand | `15px` | `500` | Letter-spacing `-0.3px` |
| Nav links | `13px` | `400` | Color: muted, hover: white |
| Tag / Label nhỏ | `11px` | `400` | Letter-spacing `2px`, uppercase |
| H1 (Hero) | `38px` | `500` | Letter-spacing `-1px`, line-height `1.15` |
| H2 (Section title) | `22px` | `500` | — |
| Body text | `14px` | `400` | line-height `1.7` |
| Skill name | `12px` | `500` | — |
| Skill percent | `10px` | `400` | Color: dim |
| Project title | `13px` | `500` | — |
| Project desc | `11px` | `400` | Color: muted |
| Project tag | `10px` | `400` | Border style |
| CTA button | `13px` | `400` | — |

**Font stack:** `var(--font-sans)` — system font. Có thể thay bằng `Inter`, `DM Sans`, hoặc `Geist` từ Google Fonts.

### 2.3 Spacing & Border Radius

| Token | Giá trị |
|---|---|
| Nav padding | `18px 32px` |
| Section padding | `32px` |
| Card padding | `14px 16px` |
| Card border-radius | `8px` |
| Button border-radius | `6px` |
| Particle connect distance | `80px` |
| Cursor ring size | `36px` (mặc định) / `56px` (hover) |

### 2.4 Animation timing

| Hiệu ứng | Duration | Easing |
|---|---|---|
| Section fade in/out | `0.6s` | `ease` |
| Cursor ring lag | `0.12` lerp factor | — |
| Cursor ring resize | `0.18s` | `cubic-bezier(.25,.46,.45,.94)` |
| Nav underline slide | `0.25s` | `ease` |
| Card hover lift | `0.2s` | `ease` |
| Skill bar fill | `0.8s` | `cubic-bezier(.25,.46,.45,.94)` |
| Background alpha lerp | `0.06` per frame | — |
| Scroll cooldown lock | `700ms` | — |

---

## 3. Layout cấu trúc tổng thể

```css
#portfolio-wrap {
  width: 100%;
  height: 600px;          /* Chiều cao cố định, có thể đổi thành 100vh */
  position: relative;
  overflow: hidden;
  background: #0f1117;
  border-radius: 12px;    /* Nếu dùng toàn trang thì bỏ border-radius */
  cursor: none;           /* Ẩn cursor mặc định để dùng custom cursor */
}
```

**Lưu ý triển khai thực tế:**
- Đổi `height: 600px` → `height: 100vh` khi deploy trang thật.
- Bỏ `border-radius` nếu portfolio là fullpage.
- Giữ `cursor: none` để custom cursor hoạt động.
- `overflow: hidden` là bắt buộc — canvas và các absolute elements không được tràn ra ngoài.

---

## 4. Component: Custom Cursor

### 4.1 Cấu trúc HTML

```html
<div id="cursor-dot"></div>
<div id="cursor-ring"></div>
```

### 4.2 CSS

```css
/* Chấm nhỏ — bám sát tức thời */
#cursor-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  pointer-events: none;           /* Không block mouse events */
  transform: translate(-50%, -50%);
  transition: transform 0.1s;
  z-index: 100;
}

/* Vòng tròn lớn — lag theo cursor */
#cursor-ring {
  position: absolute;
  width: 36px;
  height: 36px;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.18s cubic-bezier(.25,.46,.45,.94),
              height 0.18s cubic-bezier(.25,.46,.45,.94),
              border-color 0.18s,
              background 0.18s;
  z-index: 99;
}

/* Trạng thái hover — nở to, đổi màu */
#cursor-ring.hover {
  width: 56px;
  height: 56px;
  border-color: rgba(100, 160, 255, 0.8);
  background: rgba(100, 160, 255, 0.06);
}
```

### 4.3 JavaScript

```javascript
let mx = 300, my = 300;   // Vị trí cursor thực
let rx = 300, ry = 300;   // Vị trí ring (lag)

// Cập nhật vị trí khi mouse di chuyển
wrap.addEventListener('mousemove', e => {
  const rect = wrap.getBoundingClientRect();
  mx = e.clientX - rect.left;
  my = e.clientY - rect.top;

  // cursor-dot bám sát tức thời
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

// Ring lag — chạy trong animation loop
function animateRing() {
  // Linear interpolation: di chuyển 12% khoảng cách còn lại mỗi frame
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Thêm hover effect cho tất cả interactive elements
wrap.querySelectorAll('.nav-link, .skill-card, .proj-item, .cta-btn, .contact-link, .sec-dot')
  .forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
```

**Nguyên lý lag:** Dùng kỹ thuật Linear Interpolation (lerp). Mỗi frame, ring di chuyển thêm `12%` khoảng cách từ vị trí hiện tại đến vị trí cursor. Factor `0.12` tạo cảm giác "đuổi theo" mượt mà — tăng lên `0.2+` thì nhanh hơn (ít lag), giảm xuống `0.05` thì chậm hơn (nhiều lag).

---

## 5. Component: Background Canvas

### 5.1 HTML

```html
<canvas id="bg-canvas"></canvas>
```

```css
#bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
```

### 5.2 Khởi tạo canvas

```javascript
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = wrap.offsetWidth;
  canvas.height = wrap.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
```

**Lưu ý:** Canvas cần được resize khi cửa sổ thay đổi. Không dùng `width: 100%` trong CSS cho canvas (làm mờ) — phải set `canvas.width` và `canvas.height` bằng JS.

### 5.3 Vòng lặp vẽ

```javascript
function drawBackground() {
  const W = canvas.width, H = canvas.height;

  // 1. Xóa frame cũ
  ctx.clearRect(0, 0, W, H);

  // 2. Vẽ nền đặc
  ctx.fillStyle = '#0f1117';
  ctx.fillRect(0, 0, W, H);

  // 3. Vẽ background shapes của section hiện tại (xem phần 15)
  drawSectionShapes();

  // 4. Vẽ cursor glow
  drawCursorGlow();

  // 5. Vẽ particle network
  drawParticles();

  requestAnimationFrame(drawBackground);
}

function drawCursorGlow() {
  const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
  grad.addColorStop(0, 'rgba(109, 164, 255, 0.07)');
  grad.addColorStop(1, 'rgba(109, 164, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
```

---

## 6. Component: Navigation Header

### 6.1 HTML

```html
<nav id="nav">
  <div class="nav-logo">nguyen.dev</div>
  <div class="nav-links">
    <div class="nav-link active" data-sec="0">Home</div>
    <div class="nav-link" data-sec="1">Skills</div>
    <div class="nav-link" data-sec="2">Projects</div>
    <div class="nav-link" data-sec="3">Contact</div>
  </div>
</nav>
```

### 6.2 CSS

```css
#nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 32px;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.08);

  /* Glassmorphism nhẹ — blur phía sau */
  backdrop-filter: blur(12px);
  background: rgba(15, 17, 23, 0.7);
}

.nav-logo {
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  letter-spacing: -0.3px;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-link {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 0.2s;
  position: relative;
  padding-bottom: 2px;
}

/* Underline slide-in animation */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #6da4ff;
  transition: width 0.25s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #fff;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}
```

### 6.3 JavaScript — Scroll to section khi click

```javascript
document.querySelectorAll('.nav-link').forEach(el => {
  el.addEventListener('click', () => {
    goToSection(parseInt(el.dataset.sec));
  });
});
```

**Giải thích `data-sec`:** Mỗi nav link có attribute `data-sec` với số thứ tự section (0, 1, 2, 3). Khi click, `goToSection()` được gọi với index tương ứng.

---

## 7. Section: Hero

### 7.1 HTML

```html
<div id="sec-hero" class="section visible">
  <div class="tag">Software Engineer</div>
  <h1>Building products<br>people <span>actually use</span></h1>
  <div class="sub">
    Full-stack engineer with 4+ years of experience in React, Node.js, and cloud infrastructure
  </div>
  <button class="cta-btn">View my work →</button>
</div>
```

### 7.2 CSS

```css
.section {
  position: absolute;
  inset: 0;
  top: 57px;                 /* chiều cao của nav */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
  padding: 32px;
}

.section.visible {
  opacity: 1;
  pointer-events: all;
}

/* --- Hero-specific --- */
#sec-hero .tag {
  font-size: 11px;
  letter-spacing: 2px;
  color: #6da4ff;
  text-transform: uppercase;
  margin-bottom: 14px;
}

#sec-hero h1 {
  font-size: 38px;
  font-weight: 500;
  color: #fff;
  letter-spacing: -1px;
  line-height: 1.15;
  text-align: center;
}

#sec-hero h1 span {
  color: #6da4ff;           /* Highlight từ quan trọng */
}

#sec-hero .sub {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 12px;
  text-align: center;
  max-width: 320px;
  line-height: 1.7;
}

.cta-btn {
  margin-top: 28px;
  padding: 10px 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  background: transparent;
}

.cta-btn:hover {
  background: rgba(109, 164, 255, 0.12);
  border-color: #6da4ff;
}
```

### 7.3 JavaScript

```javascript
// CTA button dẫn sang section Skills
document.querySelector('.cta-btn').addEventListener('click', () => {
  goToSection(1);
});
```

**Ghi chú thiết kế:**
- Tag "Software Engineer" viết hoa + letter-spacing tạo cảm giác professional, không phô.
- H1 dùng line-break thủ công (`<br>`) để kiểm soát cách xuống dòng trên màn hình lớn.
- `<span>` highlight chỉ từ "actually use" — nhấn vào impact thực tế, không nhấn vào công nghệ. Đây là điểm nhà tuyển dụng chú ý.
- Subtext giới hạn `max-width: 320px` để không bị quá dài, đọc nhanh.

---

## 8. Section: Skills

### 8.1 HTML

```html
<div id="sec-skills" class="section">
  <h2>Core skills</h2>
  <div class="skills-grid">

    <div class="skill-card">
      <div class="skill-name">React / Next.js</div>
      <div class="skill-bar">
        <div class="skill-fill" style="width: 0%" data-w="90%"></div>
      </div>
      <div class="skill-pct">90%</div>
    </div>

    <!-- Lặp lại cho mỗi skill -->
    <!-- Node.js: 85% | TypeScript: 88% | PostgreSQL: 78% | AWS/GCP: 72% | Docker/K8s: 68% -->

  </div>
</div>
```

### 8.2 CSS

```css
#sec-skills {
  flex-direction: column;
  gap: 16px;
}

#sec-skills h2 {
  font-size: 22px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 4px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 520px;
}

.skill-card {
  background: rgba(255, 255, 255, 0.04);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 14px 16px;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}

.skill-card:hover {
  background: rgba(109, 164, 255, 0.08);
  border-color: rgba(109, 164, 255, 0.4);
  transform: translateY(-2px);   /* Lift effect nhẹ */
}

.skill-name {
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 6px;
}

.skill-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #6da4ff, #a78bfa);  /* Blue → Purple gradient */
  transition: width 0.8s cubic-bezier(.25, .46, .45, .94);
}

.skill-pct {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 4px;
}
```

### 8.3 JavaScript — Animate on enter

```javascript
// Trong hàm goToSection():
if (idx === 1) {   // Skills section
  setTimeout(() => {
    document.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.dataset.w;   // Kích hoạt CSS transition
    });
  }, 200);   // Delay 200ms để section fade-in xong rồi mới animate bar
}
```

**Quan trọng:** Skill bar ban đầu `width: 0%`. Giá trị thực (`90%`, `85%`...) được lưu trong `data-w`. Khi section vào viewport, setTimeout 200ms rồi mới set width để CSS transition chạy. Nếu set ngay lập tức thì transition không hoạt động vì element chưa render xong.

**Gợi ý nâng cao:** Dùng `IntersectionObserver` thay vì setTimeout để xác chính xác hơn khi element thực sự hiển thị.

---

## 9. Section: Projects

### 9.1 HTML

```html
<div id="sec-projects" class="section">
  <h2>Selected projects</h2>
  <div class="proj-list">

    <div class="proj-item">
      <div class="proj-dot" style="background: #6da4ff"></div>
      <div class="proj-info">
        <div class="proj-title">E-commerce Platform</div>
        <div class="proj-desc">Reduced checkout time by 40% · 200k MAU</div>
      </div>
      <div class="proj-tag" style="color: #6da4ff; border-color: rgba(109,164,255,0.3)">
        React · Node
      </div>
    </div>

    <!-- Lặp lại cho mỗi project -->

  </div>
</div>
```

### 9.2 CSS

```css
#sec-projects {
  gap: 12px;
}

#sec-projects h2 {
  font-size: 22px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 4px;
  align-self: flex-start;    /* Căn trái, không centered */
}

.proj-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 520px;
}

.proj-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 0.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  transition: border-color 0.2s, background 0.2s, padding-left 0.2s;
  cursor: pointer;
}

.proj-item:hover {
  border-color: rgba(109, 164, 255, 0.35);
  background: rgba(109, 164, 255, 0.06);
  padding-left: 22px;        /* Indent nhẹ khi hover — cảm giác "nhún vào" */
}

.proj-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.proj-info {
  flex: 1;
}

.proj-title {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
}

.proj-desc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
}

.proj-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  border: 0.5px solid;      /* Color được set inline qua style="" */
  flex-shrink: 0;
}
```

**Ghi chú về nội dung project:**
- Description phải có **số liệu cụ thể** (40%, 200k MAU, 3M events/day). Đây là điều nhà tuyển dụng đọc đầu tiên.
- Mỗi dot có màu riêng phân biệt từng project.
- Tag tech stack nhỏ, không chiếm diện tích — chỉ để tham khảo nhanh.

---

## 10. Section: Contact

### 10.1 HTML

```html
<div id="sec-contact" class="section">
  <h2>Let's build something</h2>
  <p>Open to senior / lead roles in product-driven engineering teams</p>
  <div class="contact-links">
    <div class="contact-link">GitHub</div>
    <div class="contact-link">LinkedIn</div>
    <div class="contact-link">Email me →</div>
  </div>
</div>
```

### 10.2 CSS

```css
#sec-contact {
  gap: 10px;
  text-align: center;
}

#sec-contact h2 {
  font-size: 22px;
  font-weight: 500;
  color: #fff;
}

#sec-contact p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  max-width: 300px;
  line-height: 1.7;
}

.contact-links {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.contact-link {
  padding: 8px 20px;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.contact-link:hover {
  border-color: #6da4ff;
  color: #fff;
}
```

---

## 11. Component: Section Dots Indicator

### 11.1 HTML

```html
<div id="sec-dots">
  <div class="sec-dot active" data-sec="0"></div>
  <div class="sec-dot" data-sec="1"></div>
  <div class="sec-dot" data-sec="2"></div>
  <div class="sec-dot" data-sec="3"></div>
</div>
```

### 11.2 CSS

```css
#sec-dots {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 50;
}

.sec-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: background 0.25s, transform 0.25s;
}

.sec-dot.active {
  background: #6da4ff;
  transform: scale(1.4);
}
```

### 11.3 JavaScript

```javascript
// Click dot → chuyển section
document.querySelectorAll('.sec-dot').forEach(el => {
  el.addEventListener('click', () => {
    goToSection(parseInt(el.dataset.sec));
  });
});

// Cập nhật trong goToSection():
document.querySelectorAll('.sec-dot').forEach((d, i) => {
  d.classList.toggle('active', i === idx);
});
```

---

## 12. Component: Scroll Hint

### 12.1 HTML

```html
<div id="scroll-hint">
  <span>scroll</span>
  <div class="scroll-arrow"></div>
</div>
```

### 12.2 CSS

```css
#scroll-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  opacity: 0.35;
  transition: opacity 0.3s;
  z-index: 50;
}

#scroll-hint span {
  font-size: 10px;
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.scroll-arrow {
  width: 1px;
  height: 20px;
  background: linear-gradient(to bottom, transparent, #fff);
  margin: 0 auto;
  animation: scrollPulse 1.8s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.2; transform: scaleY(0.5); }
  50%       { opacity: 1;   transform: scaleY(1); }
}
```

### 12.3 Ẩn khi đến section cuối

```javascript
// Trong goToSection():
document.getElementById('scroll-hint').style.opacity = (idx < 3) ? '1' : '0';
```

---

## 13. Hệ thống chuyển section (Scroll Transition)

### 13.1 Hàm `goToSection()`

```javascript
let currentSec = 0;
const sections = ['hero', 'skills', 'projects', 'contact'];
const sectionEls = sections.map(s => document.getElementById('sec-' + s));

function goToSection(idx) {
  if (idx === currentSec) return;
  currentSec = idx;

  // Chuyển opacity sections
  sectionEls.forEach((el, i) => {
    el.classList.toggle('visible', i === idx);
  });

  // Sync nav links
  document.querySelectorAll('.nav-link').forEach((l, i) => {
    l.classList.toggle('active', i === idx);
  });

  // Sync section dots
  document.querySelectorAll('.sec-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });

  // Chuyển background graphics
  targetBgAlpha = [0, 0, 0, 0];
  targetBgAlpha[idx] = 1;

  // Animate skill bars khi vào Skills section
  if (idx === 1) {
    setTimeout(() => {
      document.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.w;
      });
    }, 200);
  }

  // Ẩn/hiện scroll hint
  document.getElementById('scroll-hint').style.opacity = idx < 3 ? '1' : '0';
}
```

### 13.2 Scroll wheel listener

```javascript
let scrollLock = false;

wrap.addEventListener('wheel', e => {
  e.preventDefault();
  if (scrollLock) return;

  scrollLock = true;
  const direction = e.deltaY > 0 ? 1 : -1;   // +1: xuống, -1: lên
  const next = Math.max(0, Math.min(3, currentSec + direction));

  if (next !== currentSec) goToSection(next);

  // Cooldown 700ms tránh scroll quá nhanh
  setTimeout(() => scrollLock = false, 700);
}, { passive: false });   // passive: false để có thể gọi preventDefault()
```

**Lưu ý `{ passive: false }`:** Bắt buộc khi cần gọi `e.preventDefault()` trong wheel event. Nếu không có, trình duyệt sẽ bỏ qua lệnh preventDefault và trang sẽ scroll bình thường.

### 13.3 Touch support (mobile)

```javascript
let touchStartY = 0;

wrap.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
});

wrap.addEventListener('touchend', e => {
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) > 50) {       // Ngưỡng swipe 50px
    goToSection(diff > 0
      ? Math.min(3, currentSec + 1)   // Swipe lên → section tiếp theo
      : Math.max(0, currentSec - 1)   // Swipe xuống → section trước
    );
  }
});
```

---

## 14. Hiệu ứng Particle Network

### 14.1 Khởi tạo particles

```javascript
const particles = [];
const PARTICLE_COUNT = 60;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,   // Tốc độ ngang, rất chậm
    vy: (Math.random() - 0.5) * 0.3,   // Tốc độ dọc, rất chậm
    size: Math.random() * 1.5 + 0.3,   // Kích thước: 0.3 - 1.8px
    opacity: Math.random() * 0.4 + 0.1 // Độ mờ: 0.1 - 0.5
  });
}
```

### 14.2 Vẽ particles mỗi frame

```javascript
function drawParticles() {
  const W = canvas.width, H = canvas.height;

  particles.forEach(p => {
    // Di chuyển
    p.x += p.vx;
    p.y += p.vy;

    // Wrap around — thoát khỏi cạnh này → xuất hiện cạnh kia
    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;

    // Brightness tăng khi gần cursor
    const distToCursor = Math.sqrt((p.x - mx) ** 2 + (p.y - my) ** 2);
    const cursorBoost = Math.max(0, (80 - distToCursor) / 80) * 0.5;
    const finalOpacity = Math.min(p.opacity + cursorBoost, 0.7);

    // Vẽ dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
    ctx.fill();

    // Vẽ đường nối giữa các particles gần nhau
    particles.forEach(p2 => {
      const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
      if (d < 80 && d > 0) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.06 * (1 - d / 80)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });
}
```

**Performance note:** Vẽ đường nối có độ phức tạp O(n²). Với 60 particles = ~3600 phép tính/frame. Nếu muốn nhiều hơn 100 particles, cần tối ưu bằng spatial hashing hoặc giới hạn chỉ connect particles trong vùng cursor.

---

## 15. Background Graphics theo từng section

### 15.1 Định nghĩa shapes

```javascript
const bgShapes = [
  // Section 0: Hero — circle lớn góc phải + circle góc trái dưới
  [
    { type: 'circle', x: 0.75, y: 0.3, r: 140, color: 'rgba(109,164,255,0.06)' },
    { type: 'circle', x: 0.2,  y: 0.7, r: 100, color: 'rgba(167,139,250,0.05)' }
  ],
  // Section 1: Skills — hình chữ nhật + circle nhỏ
  [
    { type: 'rect',   x: 0.6,  y: 0.2, w: 200, h: 200, color: 'rgba(109,164,255,0.04)' },
    { type: 'circle', x: 0.25, y: 0.6, r: 120, color: 'rgba(52,211,153,0.04)' }
  ],
  // Section 2: Projects — circle trung tâm + rect nhỏ góc
  [
    { type: 'circle', x: 0.5,  y: 0.5, r: 160, color: 'rgba(167,139,250,0.05)' },
    { type: 'rect',   x: 0.15, y: 0.15, w: 180, h: 180, color: 'rgba(109,164,255,0.04)' }
  ],
  // Section 3: Contact — hai circles đối nhau
  [
    { type: 'circle', x: 0.3, y: 0.3, r: 100, color: 'rgba(52,211,153,0.05)' },
    { type: 'circle', x: 0.7, y: 0.7, r: 130, color: 'rgba(109,164,255,0.06)' }
  ]
];
```

**Toạ độ `x`, `y`:** Dạng tỉ lệ (0.0 → 1.0), nhân với `W` và `H` để ra pixel thực. Cách này đảm bảo shapes luôn đúng vị trí dù canvas resize.

### 15.2 Alpha transition giữa các section

```javascript
let bgAlpha = [1, 0, 0, 0];         // Giá trị hiện tại
let targetBgAlpha = [1, 0, 0, 0];   // Giá trị đích

// Khi chuyển section (trong goToSection):
targetBgAlpha = [0, 0, 0, 0];
targetBgAlpha[idx] = 1;

// Trong drawBackground() mỗi frame:
for (let i = 0; i < 4; i++) {
  bgAlpha[i] += (targetBgAlpha[i] - bgAlpha[i]) * 0.06;  // Lerp alpha
}
```

### 15.3 Vẽ shapes với parallax cursor

```javascript
function drawSectionShapes() {
  const W = canvas.width, H = canvas.height;

  for (let s = 0; s < 4; s++) {
    if (bgAlpha[s] < 0.01) continue;

    ctx.globalAlpha = bgAlpha[s];

    bgShapes[s].forEach(sh => {
      // Parallax offset dựa trên vị trí cursor
      const parallaxX = (mx - W / 2) * 0.008;
      const parallaxY = (my - H / 2) * 0.008;

      if (sh.type === 'circle') {
        const gx = sh.x * W + parallaxX;
        const gy = sh.y * H + parallaxY;
        ctx.beginPath();
        ctx.arc(gx, gy, sh.r, 0, Math.PI * 2);
        ctx.fillStyle = sh.color;
        ctx.fill();
      } else if (sh.type === 'rect') {
        const gx = sh.x * W + parallaxX;
        const gy = sh.y * H + parallaxY;
        ctx.fillStyle = sh.color;
        ctx.fillRect(gx, gy, sh.w, sh.h);
      }
    });
  }

  ctx.globalAlpha = 1;
}
```

**Parallax factor `0.008`:** Cursor di chuyển tối đa ~400px → shapes dịch tối đa ~3.2px. Rất nhẹ nhàng, tạo chiều sâu mà không làm layout bị rối. Tăng lên `0.02` nếu muốn rõ hơn.

---

## 16. Logic JavaScript tổng thể

### 16.1 Thứ tự khởi tạo

```javascript
// 1. Khởi tạo canvas size
resizeCanvas();

// 2. Tạo particles
initParticles();

// 3. Bắt đầu animation loop
requestAnimationFrame(drawLoop);

// 4. Bắt đầu cursor ring animation
requestAnimationFrame(animateRing);

// 5. Gắn event listeners
attachMouseListeners();
attachScrollListeners();
attachNavListeners();
attachTouchListeners();
```

### 16.2 Main animation loop

```javascript
function drawLoop() {
  drawBackground();    // Canvas: nền + shapes + glow + particles
  requestAnimationFrame(drawLoop);
}
```

**Lưu ý:** `ring.style.left/top` được cập nhật trong `animateRing()` riêng biệt — không cần thiết phải trong drawLoop vì ring là DOM element, không phải canvas.

---

## 17. Responsive breakpoints

Đây là gợi ý breakpoints khi triển khai trang thật:

```css
/* Mobile: <= 640px */
@media (max-width: 640px) {
  #nav { padding: 14px 20px; }
  .nav-links { gap: 16px; }
  #sec-hero h1 { font-size: 26px; }
  .skills-grid { grid-template-columns: repeat(2, 1fr); }
  #sec-dots { display: none; }   /* Ẩn dots trên mobile */
  #cursor-dot, #cursor-ring { display: none; }  /* Touch device không cần cursor */
}

/* Tablet: 641px - 1024px */
@media (min-width: 641px) and (max-width: 1024px) {
  #sec-hero h1 { font-size: 30px; }
  .skills-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Desktop: > 1024px */
@media (min-width: 1025px) {
  #sec-hero h1 { font-size: 48px; }
  .skills-grid { grid-template-columns: repeat(3, 1fr); max-width: 620px; }
}
```

**Lưu ý:** Luôn ẩn custom cursor trên touch devices (không có hover/cursor event trên mobile).

---

## 18. Gợi ý mở rộng

### 18.1 Thêm hiệu ứng khi chữ xuất hiện (Text reveal)

```css
/* Thêm animation typewriter hoặc fade-up cho H1 */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.section.visible h1 {
  animation: fadeUp 0.7s ease forwards;
  animation-delay: 0.1s;
}
```

### 18.2 Thêm noise texture overlay (subtle)

```css
/* Tạo film grain nhẹ để tránh flat tuyệt đối */
#portfolio-wrap::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,...");  /* SVG noise pattern */
  opacity: 0.03;
  pointer-events: none;
  z-index: 1;
}
```

### 18.3 Keyboard navigation

```javascript
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    goToSection(Math.min(3, currentSec + 1));
  }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    goToSection(Math.max(0, currentSec - 1));
  }
  // Số phím 1-4 để nhảy thẳng
  if (['1','2','3','4'].includes(e.key)) {
    goToSection(parseInt(e.key) - 1);
  }
});
```

### 18.4 Magnetic button effect

```javascript
// Button tự hút về phía cursor khi gần
document.querySelectorAll('.cta-btn, .contact-link').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});
```

### 18.5 Preloader

```javascript
// Ẩn portfolio cho đến khi canvas + assets sẵn sàng
window.addEventListener('load', () => {
  document.getElementById('preloader').style.opacity = '0';
  setTimeout(() => document.getElementById('preloader').remove(), 500);
});
```

### 18.6 Tech stack thực tế để xây dựng

| Lựa chọn | Công nghệ | Phù hợp khi |
|---|---|---|
| Nhanh nhất | HTML/CSS/JS thuần | Muốn deploy tĩnh, không cần framework |
| Phổ biến nhất | Next.js + Tailwind + Framer Motion | Muốn thêm blog, CMS, SEO tốt |
| Animation chuyên sâu | GSAP + Three.js | Muốn hiệu ứng 3D, phức tạp hơn |
| Tối giản nhất | Astro + Vanilla CSS | Performance cao nhất, ít JS nhất |

---

*Tài liệu này được viết dựa trên portfolio concept demo. Tất cả các giá trị số (px, opacity, timing) đều có thể điều chỉnh theo gu thẩm mỹ cá nhân.*