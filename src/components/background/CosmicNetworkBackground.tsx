/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useRef } from 'react';

export default function CosmicNetworkBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vantaRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let vantaLoaded = false;
    let animId: number | null = null;

    // High performance standalone canvas particle network fallback
    // Ensures immediate, zero-latency particle movement and offline reliability
    const initCanvasFallback = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      const onResize = () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', onResize);

      // Mouse tracking
      let mouseX = width / 2;
      let mouseY = height / 2;
      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };
      window.addEventListener('mousemove', onMouseMove);

      // Particle count optimized for performance & clarity (less dense on mobile)
      const count = width < 768 ? 28 : 55;
      const maxDistance = width < 768 ? 100 : 140;

      const particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 1.2,
      }));

      const render = () => {
        if (vantaLoaded) return; // Handed off to Vanta

        ctx.fillStyle = '#061625';
        ctx.fillRect(0, 0, width, height);

        // Update & draw particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Connect particles
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDistance) {
              const alpha = (1 - dist / maxDistance) * 0.35;
              ctx.strokeStyle = `rgba(67, 213, 237, ${alpha})`;
              ctx.lineWidth = 0.85;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }

          // Subtle attraction to mouse
          const mdx = mouseX - p.x;
          const mdy = mouseY - p.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 160) {
            const mAlpha = (1 - mDist / 160) * 0.45;
            ctx.strokeStyle = `rgba(138, 233, 240, ${mAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
          }

          // Draw glowing node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#43D5ED';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#43D5ED';
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        animId = requestAnimationFrame(render);
      };

      render();

      return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mousemove', onMouseMove);
        if (animId) cancelAnimationFrame(animId);
      };
    };

    const cleanupCanvas = initCanvasFallback();

    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });
    };

    // Attempt to load Three.js & Vanta NET
    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'),
      loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.21/dist/vanta.net.min.js'),
    ])
      .then(() => {
        const VANTA = (window as unknown as { VANTA?: { NET?: (opts: unknown) => { destroy: () => void } } }).VANTA?.NET;
        if (containerRef.current && VANTA && !vantaRef.current) {
          vantaRef.current = VANTA({
            el: containerRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1,
            scaleMobile: 0.7,
            color: 0x43d5ed, // Electric cyan particles & lines
            backgroundColor: 0x061625, // Deep Space #061625
            points: 10, // Refined density to not overwhelm content
            maxDistance: 20, // Controlled connection length
            spacing: 18,
            showDots: true,
          });
          vantaLoaded = true;
          // Hide canvas fallback when Vanta takes over
          if (canvasRef.current) {
            canvasRef.current.style.display = 'none';
          }
        }
      })
      .catch(() => {
        // Fallback canvas keeps animating seamlessly
      });

    return () => {
      if (cleanupCanvas) cleanupCanvas();
      if (vantaRef.current && typeof (vantaRef.current as any).destroy === 'function') {
        (vantaRef.current as any).destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  const fallback =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return fallback ? (
    <div className="fixed inset-0 -z-10 bg-[#061625]" />
  ) : (
    <>
      {/* Layer 0: Real-time particle universe (Vanta.NET container + Canvas fallback) */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      </div>

      {/* Layer 1: Atmospheric Vignette & Scrim */}
      {/* Keeps edges vibrant while softening central content zones for optimal text contrast */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(6,22,37,0.5)_0%,_rgba(6,22,37,0.78)_60%,_rgba(6,22,37,0.92)_100%)]"
        aria-hidden="true"
      />
    </>
  );
}

