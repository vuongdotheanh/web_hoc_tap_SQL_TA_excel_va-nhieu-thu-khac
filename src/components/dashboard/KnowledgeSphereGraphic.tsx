'use client';

/**
 * KnowledgeSphereGraphic — Cosmic Learning Universe
 *
 * Celestial geometric visualization displaying interconnected skill nodes
 * (SQL, OS IT304, Database, Analytics) orbiting a luminous Electric Cyan / Lime core.
 */
export default function KnowledgeSphereGraphic() {
  return (
    <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[400px] flex items-center justify-center select-none overflow-hidden">
      {/* Background Subtle Nebula Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#43D5ED]/15 via-[#102B40]/30 to-[#48C8A4]/15 blur-3xl pointer-events-none" />

      {/* SVG Celestial Orbit System */}
      <svg
        className="w-full h-full max-w-[460px] max-h-[400px]"
        viewBox="0 0 480 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Central Core Glow */}
          <radialGradient id="cosmicCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#43D5ED" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#2CA6B8" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#102B40" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#061625" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="cosmicOrbit1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#43D5ED" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#D9F66F" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#48C8A4" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="cosmicOrbit2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8AE9F0" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#43D5ED" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#061625" stopOpacity="0.1" />
          </linearGradient>

          <filter id="cosmicGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbit Ring 1 (Inner Ellipse) */}
        <ellipse
          cx="240"
          cy="210"
          rx="170"
          ry="90"
          stroke="url(#cosmicOrbit1)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          transform="rotate(-15 240 210)"
          className="animate-spin-orbit-1"
          style={{ transformOrigin: '240px 210px' }}
        />

        {/* Orbit Ring 2 (Outer Reverse Ellipse) */}
        <ellipse
          cx="240"
          cy="210"
          rx="210"
          ry="115"
          stroke="url(#cosmicOrbit2)"
          strokeWidth="1.2"
          strokeDasharray="8 8"
          transform="rotate(25 240 210)"
          className="animate-spin-orbit-2"
          style={{ transformOrigin: '240px 210px' }}
        />

        {/* Connecting Synapse Lines with subtle cyan glow */}
        <line x1="240" y1="210" x2="110" y2="140" stroke="#43D5ED" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 3" />
        <line x1="240" y1="210" x2="380" y2="130" stroke="#43D5ED" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 3" />
        <line x1="240" y1="210" x2="360" y2="300" stroke="#48C8A4" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 3" />
        <line x1="240" y1="210" x2="120" y2="280" stroke="#48C8A4" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3 3" />

        {/* Central Luminous Core Knowledge Sphere */}
        <g style={{ transformOrigin: '240px 210px' }}>
          <circle cx="240" cy="210" r="46" fill="url(#cosmicCoreGlow)" filter="url(#cosmicGlow)" />
          <circle cx="240" cy="210" r="24" fill="#0A1E32" stroke="#43D5ED" strokeWidth="2" />
          <circle cx="240" cy="210" r="9" fill="#D9F66F" />
        </g>

        {/* Orbit Node 1: SQL Master */}
        <g>
          <circle cx="110" cy="140" r="22" fill="#102B40" stroke="#43D5ED" strokeWidth="1.5" filter="url(#cosmicGlow)" />
          <circle cx="110" cy="140" r="16" fill="#15354A" />
          <text x="110" y="144" textAnchor="middle" fill="#F5FAFF" fontSize="10" fontWeight="800" fontFamily="sans-serif">
            SQL
          </text>
        </g>

        {/* Orbit Node 2: Database Systems */}
        <g>
          <circle cx="380" cy="130" r="24" fill="#102B40" stroke="#48C8A4" strokeWidth="1.5" filter="url(#cosmicGlow)" />
          <circle cx="380" cy="130" r="17" fill="#15354A" />
          <text x="380" y="134" textAnchor="middle" fill="#F5FAFF" fontSize="9" fontWeight="800" fontFamily="sans-serif">
            DB
          </text>
        </g>

        {/* Orbit Node 3: OS IT304 */}
        <g>
          <circle cx="360" cy="300" r="20" fill="#102B40" stroke="#D9F66F" strokeWidth="1.5" filter="url(#cosmicGlow)" />
          <circle cx="360" cy="300" r="14" fill="#15354A" />
          <text x="360" y="304" textAnchor="middle" fill="#D9F66F" fontSize="9" fontWeight="800" fontFamily="sans-serif">
            OS
          </text>
        </g>

        {/* Orbit Node 4: AI Architect */}
        <g>
          <circle cx="120" cy="280" r="20" fill="#102B40" stroke="#43D5ED" strokeWidth="1.5" filter="url(#cosmicGlow)" />
          <circle cx="120" cy="280" r="14" fill="#15354A" />
          <text x="120" y="284" textAnchor="middle" fill="#43D5ED" fontSize="8" fontWeight="800" fontFamily="sans-serif">
            AI
          </text>
        </g>
      </svg>
    </div>
  );
}
