import { useEffect, useRef } from 'react';

interface BackgroundCanvasProps {
  mouseX: number;
  mouseY: number;
  currentSection: number;
}

interface Glyph {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'plus' | 'circle' | 'angle';
  size: number;
  angle: number;
  angularVelocity: number;
  opacity: number;
}

// Section background shapes config with modern blueprint design elements
const sectionShapes: Record<number, { type: string; x: number; y: number; size: number; color: string }[]> = {
  0: [ // Hero: Large soft coral circle glow + Concentric blueprint rings + Crosshair focus
    { type: 'circle', x: 0.8, y: 0.25, size: 450, color: 'rgba(244, 63, 94, 0.22)' }, // Rose glow
    { type: 'circle', x: 0.2, y: 0.85, size: 300, color: 'rgba(59, 130, 246, 0.16)' }, // Cobalt glow
    { type: 'rings', x: 0.8, y: 0.25, size: 250, color: 'rgba(245, 158, 11, 0.12)' }, // Amber rings
    { type: 'crosshair', x: 0.5, y: 0.5, size: 96, color: 'rgba(244, 63, 94, 0.14)' },
  ],
};

const BackgroundCanvas = ({ mouseX, mouseY, currentSection }: BackgroundCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glyphs = useRef<Glyph[]>([]);
  const currentAlphas = useRef<Record<number, number>>({});

  const mouseXRef = useRef(mouseX);
  const mouseYRef = useRef(mouseY);
  const currentSectionRef = useRef(currentSection);
  const currentMouseX = useRef(0);
  const currentMouseY = useRef(0);

  useEffect(() => {
    mouseXRef.current = mouseX;
    mouseYRef.current = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Initialize floating geometric design glyphs
    if (glyphs.current.length === 0) {
      const types: ('plus' | 'circle' | 'angle')[] = ['plus', 'circle', 'angle'];
      for (let i = 0; i < 15; i++) {
        glyphs.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          type: types[i % types.length],
          size: 4 + Math.random() * 6,
          angle: Math.random() * Math.PI * 2,
          angularVelocity: (Math.random() - 0.5) * 0.005,
          opacity: 0.08 + Math.random() * 0.12,
        });
      }
    }

    // Initialize alphas
    for (let i = 0; i < 5; i++) {
      if (currentAlphas.current[i] === undefined) {
        currentAlphas.current[i] = i === currentSectionRef.current ? 1 : 0;
      }
    }

    let raf: number;

    const animate = () => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;

      ctx.clearRect(0, 0, cw, ch);

      const parallaxFactor = 0;
      const centerX = cw / 2;
      const centerY = ch / 2;

      // 1. Lerp section background alphas
      for (let i = 0; i < 5; i++) {
        const target = i === currentSectionRef.current ? 1 : 0;
        currentAlphas.current[i] += (target - currentAlphas.current[i]) * 0.06;
      }

      // 2. Draw section graphic designs with subtle mouse parallax
      const offsetX = (mouseXRef.current - centerX) * parallaxFactor;
      const offsetY = (mouseYRef.current - centerY) * parallaxFactor;

      for (let s = 0; s < 5; s++) {
        const alpha = currentAlphas.current[s];
        if (alpha < 0.01) continue;

        const shapes = sectionShapes[s] || [];
        for (const shape of shapes) {
          ctx.save();
          ctx.globalAlpha = alpha;

          const sx = shape.x * cw + offsetX * (shape.size / 2);
          const sy = shape.y * ch + offsetY * (shape.size / 2);

          if (shape.type === 'circle') {
            // Glowing soft-gradient circle
            const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, shape.size);
            gradient.addColorStop(0, shape.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(sx, sy, shape.size, 0, Math.PI * 2);
            ctx.fill();
          } 
          else if (shape.type === 'rings') {
            // Blueprint dashed rings
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 6]);
            ctx.beginPath();
            ctx.arc(sx, sy, shape.size * 0.3, 0, Math.PI * 2);
            ctx.arc(sx, sy, shape.size * 0.6, 0, Math.PI * 2);
            ctx.arc(sx, sy, shape.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Add degree markers around radar for Timeline (Section 2)
            if (s === 2) {
              ctx.fillStyle = 'rgba(167, 139, 250, 0.35)';
              ctx.font = '9px monospace';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              ctx.fillText('0°', sx, sy - shape.size - 12);
              ctx.fillText('90°', sx + shape.size + 14, sy);
              ctx.fillText('180°', sx, sy + shape.size + 12);
              ctx.fillText('270°', sx - shape.size - 14, sy);
            }
          } 
          else if (shape.type === 'crosshair') {
            // Center focal crosshair for Hero (Section 0)
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 1;
            
            // Center ring
            ctx.beginPath();
            ctx.arc(sx, sy, 6, 0, Math.PI * 2);
            ctx.stroke();
            
            // Outer dashed ring
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(sx, sy, 32, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Cross lines
            ctx.beginPath();
            ctx.moveTo(sx - 48, sy);
            ctx.lineTo(sx - 12, sy);
            ctx.moveTo(sx + 12, sy);
            ctx.lineTo(sx + 48, sy);
            ctx.moveTo(sx, sy - 48);
            ctx.lineTo(sx, sy - 12);
            ctx.moveTo(sx, sy + 12);
            ctx.lineTo(sx, sy + 48);
            ctx.stroke();
          }
          else if (shape.type === 'crosses') {
            // Technical cross-grid matrix
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 1;
            const spacing = 24;
            const length = 4;
            for (let r = 0; r < 4; r++) {
              for (let c = 0; c < 4; c++) {
                const cx = sx + (c - 1.5) * spacing;
                const cy = sy + (r - 1.5) * spacing;
                ctx.beginPath();
                ctx.moveTo(cx - length, cy);
                ctx.lineTo(cx + length, cy);
                ctx.moveTo(cx, cy - length);
                ctx.lineTo(cx, cy + length);
                ctx.stroke();
              }
            }
          } 
          else if (shape.type === 'corners') {
            // Framing corners (camera brackets)
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 1;
            const len = 16;
            const w2 = shape.size / 2;
            const h2 = shape.size / 3;

            // Top-Left
            ctx.beginPath();
            ctx.moveTo(sx - w2 + len, sy - h2);
            ctx.lineTo(sx - w2, sy - h2);
            ctx.lineTo(sx - w2, sy - h2 + len);
            // Top-Right
            ctx.moveTo(sx + w2 - len, sy - h2);
            ctx.lineTo(sx + w2, sy - h2);
            ctx.lineTo(sx + w2, sy - h2 + len);
            // Bottom-Left
            ctx.moveTo(sx - w2 + len, sy + h2);
            ctx.lineTo(sx - w2, sy + h2);
            ctx.lineTo(sx - w2, sy + h2 + len);
            // Bottom-Right
            ctx.moveTo(sx + w2 - len, sy + h2);
            ctx.lineTo(sx + w2, sy + h2);
            ctx.lineTo(sx + w2, sy + h2 + len);
            ctx.stroke();

            // Camera viewfinder details for Projects (Section 3)
            if (s === 3) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
              ctx.font = '8px monospace';
              
              ctx.textAlign = 'left';
              ctx.fillText('[REC]', sx - w2 + 6, sy - h2 - 8);
              
              ctx.textAlign = 'right';
              ctx.fillText('W:1920 H:1080', sx + w2 - 6, sy - h2 - 8);
              ctx.fillText('ISO 400', sx + w2 - 6, sy + h2 + 14);
            }
          }
          else if (shape.type === 'line') {
            // Clean alignment vector line
            const x1 = 0.15 * cw + offsetX * 190;
            const y1 = 0.85 * ch + offsetY * 190;
            const x2 = 0.85 * cw + offsetX * 190;
            const y2 = 0.15 * ch + offsetY * 190;

            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.setLineDash([]);

            // Labels at two ends for Contact (Section 4)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
            ctx.font = '8px monospace';

            ctx.textAlign = 'left';
            ctx.fillText('NODE_A // COMM_INT', x1 + 12, y1 - 8);
            ctx.textAlign = 'right';
            ctx.fillText('NODE_B // PORT_LIVE', x2 - 12, y2 + 14);
          }
          
          ctx.restore();
        }
      }

      // 3. Cursor hover glow (flashlight tracking) - smooth white orb lerp
      const section0Alpha = currentAlphas.current[0] || 0;
      if ((mouseXRef.current > 0 || mouseYRef.current > 0) && section0Alpha > 0.005) {
        currentMouseX.current = mouseXRef.current;
        currentMouseY.current = mouseYRef.current;

        ctx.save();
        const glowGradient = ctx.createRadialGradient(
          currentMouseX.current,
          currentMouseY.current,
          0,
          currentMouseX.current,
          currentMouseY.current,
          60 // radius = 60px for 120px diameter
        );
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${0.10 * section0Alpha})`); // soft white radial gradient (opacity 0.10)
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(currentMouseX.current, currentMouseY.current, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Update and draw floating vector glyphs
      for (const g of glyphs.current) {
        g.x += g.vx;
        g.y += g.vy;
        g.angle += g.angularVelocity;

        // Wrap around bounds
        if (g.x < 0) g.x = cw;
        if (g.x > cw) g.x = 0;
        if (g.y < 0) g.y = ch;
        if (g.y > ch) g.y = 0;

        const currentOpacity = g.opacity * section0Alpha;
        if (currentOpacity < 0.005) continue;

        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.angle);
        ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.lineWidth = 1;

        if (g.type === 'plus') {
          ctx.beginPath();
          ctx.moveTo(-g.size, 0);
          ctx.lineTo(g.size, 0);
          ctx.moveTo(0, -g.size);
          ctx.lineTo(0, g.size);
          ctx.stroke();
        } else if (g.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, g.size, 0, Math.PI * 2);
          ctx.stroke();
        } else if (g.type === 'angle') {
          ctx.beginPath();
          ctx.moveTo(-g.size, -g.size * 0.4);
          ctx.lineTo(0, 0);
          ctx.lineTo(-g.size, g.size * 0.4);
          ctx.moveTo(g.size, -g.size * 0.4);
          ctx.lineTo(0, 0);
          ctx.lineTo(g.size, g.size * 0.4);
          ctx.stroke();
        }
        ctx.restore();
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="bg-canvas"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default BackgroundCanvas;
