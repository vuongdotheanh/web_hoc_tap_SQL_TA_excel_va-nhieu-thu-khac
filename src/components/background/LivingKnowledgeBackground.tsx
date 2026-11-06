'use client';

import { useEffect, useState } from 'react';

/**
 * LivingKnowledgeBackground — Liquid Glass Learning Universe
 *
 * Immersive ambient background:
 * - Flowing deep emerald, forest, and teal auroras
 * - Luminous orbital knowledge sphere & celestial track rings
 * - Traveling luminous particles along Bézier paths
 * - 1100ms entrance fade-in & light sweep
 * - Zero pointer-events interference, reduced-motion compliance
 */
export default function LivingKnowledgeBackground() {
  const [hasEntered, setHasEntered] = useState(() => {
    if (typeof window === 'undefined') return true;
    return Boolean(sessionStorage.getItem('sb_living_universe_entered'));
  });

  useEffect(() => {
    if (!hasEntered) {
      const timer = setTimeout(() => {
        setHasEntered(true);
        sessionStorage.setItem('sb_living_universe_entered', 'true');
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [hasEntered]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-opacity duration-1000 ease-out ${
        hasEntered ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* 1. Base canvas: Soft refined academic paper base */}
      <div className="absolute inset-0 bg-[#F5F7F3]" />

      {/* 2. Primary Emerald Aurora Field (Top-Right) */}
      <div
        className="absolute -top-[15%] -right-[10%] w-[75vw] max-w-[1000px] h-[75vw] max-h-[1000px] rounded-full blur-[110px] opacity-40 animate-aurora-drift-1"
        style={{
          background: 'radial-gradient(circle, rgba(47, 141, 114, 0.45) 0%, rgba(18, 63, 52, 0.35) 40%, rgba(188, 235, 211, 0.2) 65%, transparent 80%)',
        }}
      />

      {/* 3. Deep Forest & Mint Aurora (Bottom-Left) */}
      <div
        className="absolute -bottom-[20%] -left-[10%] w-[70vw] max-w-[900px] h-[70vw] max-h-[900px] rounded-full blur-[130px] opacity-35 animate-aurora-drift-2"
        style={{
          background: 'radial-gradient(circle, rgba(18, 63, 52, 0.5) 0%, rgba(47, 141, 114, 0.3) 45%, rgba(217, 246, 111, 0.22) 60%, transparent 75%)',
        }}
      />

      {/* 4. Atmospheric Teal Center Pulse */}
      <div
        className="absolute top-[30%] left-[25%] w-[50vw] max-w-[700px] h-[50vw] max-h-[700px] rounded-full blur-[150px] opacity-20 animate-aurora-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(188, 235, 211, 0.5) 0%, rgba(47, 141, 114, 0.25) 50%, transparent 70%)',
        }}
      />

      {/* 5. Geometric Orbital Knowledge Universe & Celestial Paths (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#123F34" stopOpacity="0.05" />
            <stop offset="35%" stopColor="#2F8D72" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#D9F66F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2F8D72" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BCEBD3" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#2F8D72" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#123F34" stopOpacity="0.04" />
          </linearGradient>

          <filter id="auroraGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Large Concentric Knowledge Orbit Rings */}
        <circle
          cx="1080"
          cy="320"
          r="260"
          fill="none"
          stroke="url(#orbitGrad1)"
          strokeWidth="1.2"
          strokeDasharray="4 8"
          className="animate-spin-slow-cw"
          style={{ transformOrigin: '1080px 320px' }}
        />
        <circle
          cx="1080"
          cy="320"
          r="380"
          fill="none"
          stroke="url(#orbitGrad2)"
          strokeWidth="1"
          strokeDasharray="8 12"
          className="animate-spin-slow-ccw"
          style={{ transformOrigin: '1080px 320px' }}
        />

        {/* Dynamic Curved Flow Paths */}
        <path
          d="M -120,200 C 320,60 620,380 1120,160 C 1320,70 1480,260 1600,320"
          fill="none"
          stroke="url(#orbitGrad1)"
          strokeWidth="2"
          strokeDasharray="8 10"
          className="animate-flow-dash-1"
        />

        <path
          d="M -80,780 C 380,600 780,850 1180,670 C 1350,600 1490,750 1600,710"
          fill="none"
          stroke="url(#orbitGrad2)"
          strokeWidth="1.8"
        />

        {/* Luminous Knowledge Star Nodes (Traveling Particles) */}
        {/* Node 1 */}
        <g className="animate-particle-float-1">
          <circle cx="560" cy="240" r="6" fill="#2F8D72" filter="url(#auroraGlow)" opacity="0.8" />
          <circle cx="560" cy="240" r="2.2" fill="#D9F66F" />
        </g>

        {/* Node 2 */}
        <g className="animate-particle-float-2">
          <circle cx="1140" cy="180" r="7" fill="#2F8D72" filter="url(#auroraGlow)" opacity="0.75" />
          <circle cx="1140" cy="180" r="2.5" fill="#FFFFFF" />
        </g>

        {/* Node 3 */}
        <g className="animate-particle-float-3">
          <circle cx="280" cy="720" r="5" fill="#123F34" filter="url(#auroraGlow)" opacity="0.7" />
          <circle cx="280" cy="720" r="2" fill="#D9F66F" />
        </g>

        {/* Node 4 */}
        <g className="animate-particle-float-4">
          <circle cx="1260" cy="680" r="6.5" fill="#2F8D72" filter="url(#auroraGlow)" opacity="0.8" />
          <circle cx="1260" cy="680" r="2.5" fill="#BCEBD3" />
        </g>
      </svg>

      {/* 6. Soft Central Reading Shield: Keeps main content legible while borders stay luminous */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(245, 247, 243, 0.72) 0%, transparent 100%)',
        }}
      />

      {/* GPU Keyframe Animations */}
      <style jsx>{`
        @keyframes auroraDrift1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-40px, 30px, 0) scale(1.08);
          }
        }
        @keyframes auroraDrift2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(35px, -25px, 0) scale(1.1);
          }
        }
        @keyframes auroraPulse {
          0%, 100% {
            opacity: 0.18;
            transform: translate3d(0, 0, 0);
          }
          50% {
            opacity: 0.32;
            transform: translate3d(20px, 15px, 0);
          }
        }
        @keyframes float1 {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(26px, -22px, 0);
          }
        }
        @keyframes float2 {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-24px, 24px, 0);
          }
        }
        @keyframes float3 {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(20px, 18px, 0);
          }
        }
        @keyframes float4 {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-30px, -20px, 0);
          }
        }
        @keyframes spinCW {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spinCCW {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes flowDash {
          to {
            stroke-dashoffset: -50;
          }
        }

        .animate-aurora-drift-1 {
          animation: auroraDrift1 20s ease-in-out infinite;
          will-change: transform;
        }
        .animate-aurora-drift-2 {
          animation: auroraDrift2 24s ease-in-out infinite;
          will-change: transform;
        }
        .animate-aurora-pulse {
          animation: auroraPulse 16s ease-in-out infinite;
          will-change: opacity, transform;
        }
        .animate-particle-float-1 {
          animation: float1 12s ease-in-out infinite;
        }
        .animate-particle-float-2 {
          animation: float2 14s ease-in-out infinite;
        }
        .animate-particle-float-3 {
          animation: float3 17s ease-in-out infinite;
        }
        .animate-particle-float-4 {
          animation: float4 13s ease-in-out infinite;
        }
        .animate-spin-slow-cw {
          animation: spinCW 90s linear infinite;
        }
        .animate-spin-slow-ccw {
          animation: spinCCW 110s linear infinite;
        }
        .animate-flow-dash-1 {
          animation: flowDash 28s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-aurora-drift-1,
          .animate-aurora-drift-2,
          .animate-aurora-pulse,
          .animate-particle-float-1,
          .animate-particle-float-2,
          .animate-particle-float-3,
          .animate-particle-float-4,
          .animate-spin-slow-cw,
          .animate-spin-slow-ccw,
          .animate-flow-dash-1 {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
