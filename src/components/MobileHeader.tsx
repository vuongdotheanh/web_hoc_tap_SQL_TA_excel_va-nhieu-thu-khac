'use client';

import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  onMenuToggle: () => void;
}

export default function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-deep-forest md:hidden">
      {/* Hamburger menu button */}
      <button
        onClick={onMenuToggle}
        className="p-2 -ml-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-lime/50"
        aria-label="Mở menu"
      >
        <Menu size={22} />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        {/* Bite mark logo — compact version */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 4H28V20H22C22 16.6863 19.3137 14 16 14C12.6863 14 10 16.6863 10 20H4V4Z"
            fill="#D7FF64"
          />
          <path
            d="M4 20H10C10 23.3137 12.6863 26 16 26C19.3137 26 22 23.3137 22 20H28V28H4V20Z"
            fill="#D7FF64"
            opacity="0.55"
          />
        </svg>
        <span className="text-lg font-bold tracking-tight text-white">
          Skill
          <span className="text-electric-lime">Bite</span>
        </span>
      </div>

      {/* Spacer to balance layout */}
      <div className="w-[38px]" aria-hidden="true" />
    </header>
  );
}
