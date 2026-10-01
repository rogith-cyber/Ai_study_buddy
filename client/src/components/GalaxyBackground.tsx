import React, { useEffect, useRef } from 'react';

interface GalaxyBackgroundProps {
  aurora?: boolean;
}

/** A restrained, monochrome galaxy that keeps the page black first and green second. */
export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({ aurora = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * width, y: Math.random() * height, size: Math.random() * 1.5 + 0.25,
      speed: Math.random() * 0.28 + 0.04, alpha: Math.random() * 0.65 + 0.2, phase: Math.random() * Math.PI * 2,
    }));
    const resize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);

    let frame = 0;
    const draw = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      if (aurora) {
        const time = frame * 0.006;
        const ridgeAt = (x: number, band: number) =>
          height * (
            0.31 + band * 0.045 +
            0.075 * Math.sin((x / width) * 5.5 + time + band * 0.6) +
            0.025 * Math.sin((x / width) * 13 - time * 0.7)
          );

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let band = 0; band < 4; band++) {
          const points: Array<{ x: number; y: number }> = [];
          const thickness = height * (0.12 + band * 0.012);
          for (let step = 0; step <= 80; step++) {
            const x = (width + 40) * (step / 80) - 20;
            points.push({ x, y: ridgeAt(x, band) - band * height * 0.012 });
          }

          const glow = ctx.createLinearGradient(0, height * 0.18, 0, height * 0.72);
          glow.addColorStop(0, 'rgba(0, 255, 128, 0)');
          glow.addColorStop(0.38, 'rgba(0, 230, 112, 0.05)');
          glow.addColorStop(0.53, 'rgba(48, 255, 126, 0.28)');
          glow.addColorStop(0.68, 'rgba(0, 210, 105, 0.1)');
          glow.addColorStop(1, 'rgba(0, 255, 128, 0)');

          ctx.beginPath();
          points.forEach((point, index) => {
            if (index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
          });
          for (let index = points.length - 1; index >= 0; index--) {
            const point = points[index];
            ctx.lineTo(point.x, point.y + thickness);
          }
          ctx.closePath();
          ctx.fillStyle = glow;
          ctx.fill();

          ctx.beginPath();
          points.forEach((point, index) => {
            if (index === 0) ctx.moveTo(point.x, point.y + thickness * 0.42);
            else ctx.lineTo(point.x, point.y + thickness * 0.42);
          });
          ctx.strokeStyle = 'rgba(90, 255, 150, 0.22)';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#00ff78';
          ctx.shadowBlur = 28;
          ctx.stroke();
        }

        for (let ray = 0; ray < 46; ray++) {
          const x = (width * ray) / 45;
          const startY = ridgeAt(x, 1) + height * 0.025;
          const sway = Math.sin(time * 0.8 + ray * 0.53) * width * 0.018;
          const curtain = ctx.createLinearGradient(x, startY, x + sway, startY + height * 0.2);
          curtain.addColorStop(0, 'rgba(65, 255, 142, 0.2)');
          curtain.addColorStop(1, 'rgba(0, 220, 115, 0)');
          ctx.beginPath();
          ctx.moveTo(x, startY);
          ctx.bezierCurveTo(
            x + sway * 0.25, startY + height * 0.07,
            x + sway * 0.8, startY + height * 0.14,
            x + sway, startY + height * 0.2
          );
          ctx.strokeStyle = curtain;
          ctx.lineWidth = ray % 6 === 0 ? 2 : 1;
          ctx.shadowBlur = 12;
          ctx.stroke();
        }
        ctx.restore();
      } else {
        const cx = width * 0.72;
        const cy = height * 0.38;
        for (let i = 0; i < 18; i++) {
          const angle = frame * 0.0018 + i * 0.85;
          const radius = Math.min(width, height) * (0.14 + (i % 6) * 0.055);
          const x = cx + Math.cos(angle) * radius * 1.25;
          const y = cy + Math.sin(angle) * radius * 0.52;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 150 + (i % 4) * 35);
          glow.addColorStop(0, 'rgba(34, 197, 94, 0.075)');
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(x, y, 240, 0, Math.PI * 2); ctx.fill();
        }
      }
      stars.forEach((star, index) => {
        star.y -= star.speed;
        if (star.y < -4) { star.y = height + 4; star.x = Math.random() * width; }
        const alpha = star.alpha * (0.65 + Math.sin(frame * 0.025 + star.phase) * 0.35);
        ctx.fillStyle = index % 7 === 0 ? '#86efac' : '#ffffff';
        ctx.globalAlpha = alpha;
        ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      frame++;
      animationFrameId = requestAnimationFrame(draw);
    };
    animationFrameId = requestAnimationFrame(draw);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, []);

  return <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none"><canvas ref={canvasRef} className="absolute inset-0 h-full w-full" /></div>;
};
