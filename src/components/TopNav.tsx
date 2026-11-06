'use client';

import { useState } from 'react';
import { Menu, X, Globe, Flame, BookOpen, Sparkles, Map, BarChart2, Settings, LayoutDashboard } from 'lucide-react';
import type { AppView, UserProfile } from '@/types';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface TopNavProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  user: UserProfile;
  lang: Lang;
  onToggleLang: () => void;
}

interface NavItem {
  label: { vi: string; en: string };
  view: AppView;
  icon: typeof LayoutDashboard;
}

export default function TopNav({ activeView, onNavigate, user, lang, onToggleLang }: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: translations.nav.overview, view: 'dashboard', icon: LayoutDashboard },
    { label: translations.nav.courses, view: 'courses', icon: BookOpen },
    { label: translations.nav.learningPaths, view: 'roadmap', icon: Map },
    { label: translations.aiArchitect.entry, view: 'ai-architect', icon: Sparkles },
    { label: translations.nav.progress, view: 'progress', icon: BarChart2 },
    { label: translations.nav.settings, view: 'settings', icon: Settings },
  ];

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 liquid-glass-nav transition-all duration-200">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6 lg:gap-8">
          <button
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#43D5ED] rounded-xl"
            aria-label="SkillBite Dashboard"
          >
            {/* Luminous Cosmic Emblem */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#102B40] to-[#0A1E32] border border-[#43D5ED]/40 flex items-center justify-center relative overflow-hidden shadow-sm group-hover:border-[#43D5ED] transition-all group-hover:scale-105">
              <span className="text-[#43D5ED] font-black text-base leading-none select-none">S</span>
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#D9F66F] rounded-bl-sm" />
            </div>
            
            {/* Wordmark with crisp high contrast */}
            <div className="flex flex-col text-left">
              <span className="text-[#F5FAFF] font-extrabold text-lg tracking-tight leading-none">
                Skill<span className="text-[#43D5ED]">Bite</span>
              </span>
              <span className="text-[10px] font-bold text-[#93A8B8] tracking-widest uppercase mt-0.5 hidden sm:block">
                Cosmic Learning
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNav(item.view)}
                  className={`
                    relative px-3.5 py-1.5 text-sm font-semibold rounded-xl transition-all duration-150 flex items-center gap-2
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#43D5ED]
                    ${
                      isActive
                        ? 'text-[#43D5ED] bg-[#102B40] border border-[#43D5ED]/30 shadow-xs font-bold'
                        : 'text-[#C3D2DF] hover:text-[#F5FAFF] hover:bg-[#15354A]/60'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={15} className={isActive ? 'text-[#43D5ED]' : 'text-[#93A8B8]'} />
                  <span>{item.label[lang]}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#43D5ED] rounded-full shadow-[0_0_8px_#43D5ED]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right side controls: Language switcher, Streak indicator, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Streak indicator badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-pill text-[#F5FAFF] text-xs font-bold">
            <Flame size={14} className="text-[#FF7777] fill-[#FF7777]" />
            <span>{user.streak} {translations.dashboard.streakDays[lang]}</span>
          </div>

          {/* Bilingual Language Switcher Button */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-pill text-xs font-bold transition-all hover:border-[#43D5ED]/40 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#43D5ED]"
            aria-label={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
            title={lang === 'vi' ? 'Chuyển sang English' : 'Switch to Vietnamese'}
          >
            <Globe size={13} className="text-[#43D5ED]" />
            <span className={lang === 'vi' ? 'text-[#43D5ED] font-black' : 'text-[#93A8B8]'}>VI</span>
            <span className="text-[#93A8B8]/40">/</span>
            <span className={lang === 'en' ? 'text-[#43D5ED] font-black' : 'text-[#93A8B8]'}>EN</span>
          </button>

          {/* User Profile Pill */}
          <button
            onClick={() => handleNav('settings')}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full liquid-glass-pill hover:border-[#43D5ED]/40 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#43D5ED]"
            title={user.name}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#15354A] to-[#102B40] border border-[#43D5ED]/40 text-[#43D5ED] font-bold text-xs flex items-center justify-center shadow-xs">
              {user.avatar}
            </div>
            <span className="text-xs font-semibold text-[#F5FAFF] hidden md:block max-w-[120px] truncate">
              {user.name}
            </span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl liquid-glass-pill text-[#F5FAFF] hover:border-[#43D5ED]/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#43D5ED]"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#82CDE1]/18 bg-[#0A1E32]/98 backdrop-blur-2xl animate-fade-in shadow-2xl">
          <nav className="flex flex-col p-3 gap-1.5" role="navigation" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNav(item.view)}
                  className={`
                    text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3
                    ${
                      isActive
                        ? 'bg-[#102B40] text-[#43D5ED] border border-[#43D5ED]/30 font-bold'
                        : 'text-[#C3D2DF] hover:bg-[#15354A]/50 hover:text-[#F5FAFF]'
                    }
                  `}
                >
                  <Icon size={17} className={isActive ? 'text-[#43D5ED]' : 'text-[#93A8B8]'} />
                  <span>{item.label[lang]}</span>
                </button>
              );
            })}
          </nav>

          {/* Profile details in mobile drawer */}
          <div className="border-t border-[#82CDE1]/18 p-4 bg-[#061625]/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#102B40] border border-[#43D5ED]/40 text-[#43D5ED] font-bold text-sm flex items-center justify-center">
                {user.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-[#F5FAFF]">{user.name}</p>
                <p className="text-xs text-[#93A8B8]">
                  {user.streak} {translations.dashboard.streakDays[lang]} 🔥
                </p>
              </div>
            </div>

            <button
              onClick={() => handleNav('settings')}
              className="text-xs font-bold text-[#43D5ED] hover:underline"
            >
              {translations.nav.settings[lang]}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
