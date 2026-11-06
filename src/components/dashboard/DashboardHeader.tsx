'use client';

import { Flame, Calendar, Sparkles } from 'lucide-react';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface DashboardHeaderProps {
  userName: string;
  streak: number;
  lang: Lang;
}

const DISPLAY_DATES: Record<Lang, string> = {
  vi: 'Thứ Năm, 22 tháng 10',
  en: 'Thursday, Oct 22',
};

export default function DashboardHeader({ userName, streak, lang }: DashboardHeaderProps) {
  const t = translations.dashboard;
  const formattedDate = DISPLAY_DATES[lang] ?? DISPLAY_DATES.vi;

  return (
    <div className="animate-fade-in-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E1E5DE]/80">
      {/* Left side: Date + Personalized greeting */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#626A63] mb-1">
          <Calendar size={13} className="text-[#245C4B]" />
          <span className="capitalize">{formattedDate}</span>
          <span className="text-[#CBD3C6]">•</span>
          <span className="inline-flex items-center gap-1 text-[#245C4B]">
            <Sparkles size={12} />
            {lang === 'vi' ? 'Học tập chủ động' : 'Active Learning'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202521] tracking-tight">
          {t.greeting[lang]}, {userName} 👋
        </h1>
        <p className="text-sm text-[#626A63] font-medium mt-0.5">
          {t.readyToLearn[lang]}
        </p>
      </div>

      {/* Right side: Streak & Daily status banner */}
      <div className="flex items-center gap-3 self-start sm:self-auto">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E1E5DE] shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#E7F0EA] flex items-center justify-center">
            <Flame size={18} className="text-[#F17B61] fill-[#F17B61]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#626A63] uppercase tracking-wider leading-none">
              {lang === 'vi' ? 'Chuỗi học' : 'Streak'}
            </div>
            <div className="text-sm font-extrabold text-[#202521] leading-tight">
              {streak} {t.streakDays[lang]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
