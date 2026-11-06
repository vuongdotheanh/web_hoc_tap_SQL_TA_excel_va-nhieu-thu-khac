'use client';

import { Flame, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface WelcomeStatusBarProps {
  userName: string;
  streak: number;
  totalMinutes: number;
  weeklyGoal: number;
  lang: Lang;
}

const DISPLAY_DATES: Record<Lang, string> = {
  vi: 'Thứ Năm, 22 tháng 10',
  en: 'Thursday, Oct 22',
};

export default function WelcomeStatusBar({
  userName,
  streak,
  totalMinutes,
  weeklyGoal,
  lang,
}: WelcomeStatusBarProps) {
  const t = translations.dashboard;
  const formattedDate = DISPLAY_DATES[lang] ?? DISPLAY_DATES.vi;
  const goalPercent = Math.min(Math.round((totalMinutes / weeklyGoal) * 100), 100);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3">
      {/* Left: Greeting + Date + Motivation */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#93A8B8] mb-1.5">
          <Calendar size={13} className="text-[#43D5ED]" />
          <span className="capitalize">{formattedDate}</span>
          <span className="text-[#82CDE1]/30">•</span>
          <span className="inline-flex items-center gap-1.5 text-[#43D5ED] font-bold">
            <Sparkles size={12} />
            {lang === 'vi' ? 'Không gian tri thức vũ trụ' : 'Cosmic Learning Canvas'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5FAFF] tracking-tight">
          {t.greeting[lang]}, {userName} 👋
        </h1>
        <p className="text-sm sm:text-[15px] text-[#C3D2DF] font-medium mt-1 max-w-2xl">
          {lang === 'vi'
            ? '10 phút chủ động mỗi ngày — làm chủ kỹ năng thực chiến và bài học trên lớp.'
            : '10 minutes of focused microlearning every day on your own terms.'}
        </p>
      </div>

      {/* Right: Floating Glass Status Capsule */}
      <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
        {/* Streak Capsule */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl liquid-glass-pill bg-[#102B40]/90 border border-[#82CDE1]/20 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-[#FF7777]/15 border border-[#FF7777]/30 flex items-center justify-center">
            <Flame size={17} className="text-[#FF7777] fill-[#FF7777]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#93A8B8] uppercase tracking-wider block leading-none mb-0.5">
              {translations.lesson.streak[lang]}
            </span>
            <span className="text-sm font-black text-[#F5FAFF]">
              {streak} {t.streakDays[lang]}
            </span>
          </div>
        </div>

        {/* Weekly Progress Capsule */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl liquid-glass-pill bg-[#102B40]/90 border border-[#82CDE1]/20 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-[#43D5ED]/15 border border-[#43D5ED]/30 flex items-center justify-center">
            <TrendingUp size={16} className="text-[#43D5ED]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#93A8B8] uppercase tracking-wider block leading-none mb-0.5">
              {t.weeklyGoal[lang]}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-[#43D5ED]">{goalPercent}%</span>
              <span className="text-[11px] text-[#93A8B8] font-semibold">({totalMinutes}m)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
