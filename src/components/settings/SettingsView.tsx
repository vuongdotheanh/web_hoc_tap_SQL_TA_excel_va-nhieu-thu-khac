'use client';

import { Globe, Bell, Target, Palette, User, Check } from 'lucide-react';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface SettingsViewProps {
  lang: Lang;
  onToggleLang: () => void;
}

export default function SettingsView({ lang, onToggleLang }: SettingsViewProps) {
  const t = translations.settingsPage;

  return (
    <div className="space-y-6 animate-fade-in-up max-w-2xl">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#43D5ED] block mb-1">
          {lang === 'vi' ? 'HỆ THỐNG & TÀI KHOẢN' : 'SYSTEM & PREFERENCES'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#F5FAFF]">{t.title[lang]}</h2>
      </div>

      {/* Language */}
      <div className="card-premium bg-[#102B40]/95 p-6 rounded-3xl border border-[#82CDE1]/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15354A] border border-[#43D5ED]/30 flex items-center justify-center text-[#43D5ED]">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F5FAFF]">{t.language[lang]}</h3>
              <p className="text-xs text-[#C3D2DF]">{t.languageDesc[lang]}</p>
            </div>
          </div>
          <div className="flex rounded-xl border border-[#82CDE1]/20 p-1 bg-[#061625] self-start sm:self-auto">
            <button
              onClick={() => { if (lang !== 'vi') onToggleLang(); }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                lang === 'vi' ? 'bg-[#43D5ED] text-[#061625] shadow-sm' : 'text-[#93A8B8] hover:text-[#F5FAFF]'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              onClick={() => { if (lang !== 'en') onToggleLang(); }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                lang === 'en' ? 'bg-[#43D5ED] text-[#061625] shadow-sm' : 'text-[#93A8B8] hover:text-[#F5FAFF]'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card-premium bg-[#102B40]/95 p-6 rounded-3xl border border-[#82CDE1]/20 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15354A] border border-[#FF7777]/30 flex items-center justify-center text-[#FF7777]">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F5FAFF]">{t.notifications[lang]}</h3>
              <p className="text-xs text-[#C3D2DF]">{t.notificationsDesc[lang]}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 bg-[#6BE0A4]/15 border border-[#6BE0A4]/30 px-3 py-1.5 rounded-full text-xs font-bold text-[#6BE0A4]">
            <Check size={12} strokeWidth={3} />
            {t.enabled[lang]}
          </span>
        </div>
      </div>

      {/* Daily goal */}
      <div className="card-premium bg-[#102B40]/95 p-6 rounded-3xl border border-[#82CDE1]/20 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15354A] border border-[#43D5ED]/30 flex items-center justify-center text-[#43D5ED]">
              <Target size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F5FAFF]">{t.dailyGoal[lang]}</h3>
              <p className="text-xs text-[#C3D2DF]">{t.dailyGoalDesc[lang]}</p>
            </div>
          </div>
          <div className="bg-[#061625] border border-[#82CDE1]/15 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#43D5ED]">
            10 {lang === 'vi' ? 'phút / ngày' : 'min / day'}
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="card-premium bg-[#102B40]/95 p-6 rounded-3xl border border-[#82CDE1]/20 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15354A] border border-[#D9F66F]/30 flex items-center justify-center text-[#D9F66F]">
              <Palette size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F5FAFF]">{t.theme[lang]}</h3>
              <p className="text-xs text-[#C3D2DF]">Liquid Glass × Cosmic Learning</p>
            </div>
          </div>
          <div className="flex rounded-xl border border-[#82CDE1]/20 p-1 bg-[#061625]">
            <div className="bg-[#43D5ED] text-[#061625] shadow-xs px-3 py-1 rounded-lg text-xs font-extrabold">
              Cosmic Dark
            </div>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="card-premium bg-[#102B40]/95 p-6 rounded-3xl border border-[#82CDE1]/20 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15354A] border border-[#43D5ED]/30 flex items-center justify-center text-[#43D5ED]">
              <User size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F5FAFF]">{t.account[lang]}</h3>
              <p className="text-xs text-[#C3D2DF]">{t.accountDesc[lang]}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#D9F66F] bg-[#15354A] border border-[#D9F66F]/30 px-3 py-1 rounded-xl">
            Pro Plan
          </span>
        </div>
      </div>
    </div>
  );
}
