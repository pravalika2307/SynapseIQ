import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
}

export const IntelligenceMesh: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Faint particle configuration
    const particlesCount = Math.min(40, Math.floor((width * height) / 35000));
    const particles: Particle[] = [];

    for (let i = 0; i < particlesCount; i++) {
      const alpha = Math.random() * 0.10 + 0.02; // Extra faint opacity
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.05, // Ambient, ultra-slow drift
        vy: (Math.random() - 0.5) * 0.05,
        radius: Math.random() * 1.0 + 0.5, // Tiny nodes
        alpha,
        targetAlpha: alpha,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint background spatial network links
      ctx.strokeStyle = 'rgba(131, 209, 139, 0.015)'; // Very faint accent green
      ctx.lineWidth = 0.8;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Move particle
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Wrap boundaries
        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        // Pulse alpha gently
        if (Math.random() < 0.005) {
          p1.targetAlpha = Math.random() * 0.18 + 0.03;
        }
        p1.alpha += (p1.targetAlpha - p1.alpha) * 0.02;

        // Draw particle
        ctx.fillStyle = `rgba(131, 209, 139, ${p1.alpha})`;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < 180) {
            const linkAlpha = (1 - dist / 180) * 0.025 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(131, 209, 139, ${linkAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ mixBlendMode: 'screen' }} />;
};
