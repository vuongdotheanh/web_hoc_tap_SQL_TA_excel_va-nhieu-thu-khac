'use client';

import { LayoutDashboard, Route, BookOpen, BarChart3, X } from 'lucide-react';
import type { AppView, UserProfile } from '@/types';

interface SidebarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  isOpen: boolean;
  onToggle: () => void;
  user?: UserProfile;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  view: AppView;
}

const navItems: NavItem[] = [
  { label: 'Tổng quan', icon: <LayoutDashboard size={20} />, view: 'dashboard' },
  { label: 'Lộ trình của tôi', icon: <Route size={20} />, view: 'roadmap' },
  { label: 'Thư viện kỹ năng', icon: <BookOpen size={20} />, view: 'library' },
  { label: 'Tiến độ', icon: <BarChart3 size={20} />, view: 'progress' },
];

export default function Sidebar({ activeView, onNavigate, isOpen, onToggle, user }: SidebarProps) {
  const userName = user?.name ?? 'Minh Anh';
  const userAvatar = user?.avatar ?? 'MA';
  const userStreak = user?.streak ?? 12;
  const handleNavigate = (view: AppView) => {
    onNavigate(view);
    // Close mobile sidebar on navigate
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[260px] bg-deep-forest flex flex-col
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 pt-7 pb-8">
          <div className="flex items-center gap-2.5">
            {/* Bite mark logo — a square with a bitten corner */}
            <div className="relative w-8 h-8 flex-shrink-0">
              <svg
                width="32"
                height="32"
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
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Skill
              <span className="text-electric-lime">Bite</span>
            </span>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onToggle}
            className="md:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-200"
            aria-label="Đóng menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <li key={item.view}>
                  <button
                    onClick={() => handleNavigate(item.view)}
                    className={`
                      relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                      text-sm font-medium transition-all duration-200
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-lime/50
                      ${
                        isActive
                          ? 'text-deep-forest bg-paper/10'
                          : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Active left border indicator */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-electric-lime animate-fade-in"
                        aria-hidden="true"
                      />
                    )}
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="px-4 pb-6 pt-4 mt-auto border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            {/* Avatar with initials */}
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full bg-electric-lime flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="text-sm font-bold text-deep-forest leading-none">
                {userAvatar}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-white/50 truncate">
                {userStreak} ngày liên tiếp 🔥
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
