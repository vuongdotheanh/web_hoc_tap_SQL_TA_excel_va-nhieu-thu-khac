'use client';

import { useMemo } from 'react';
import { Flame, Target } from 'lucide-react';
import type { WeeklyActivity } from '@/types';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface WeeklyRhythmCardProps {
  activities: WeeklyActivity[];
  weeklyGoal: number;
  lang: Lang;
}

export default function WeeklyRhythmCard({ activities, weeklyGoal, lang }: WeeklyRhythmCardProps) {
  const t = translations.dashboard;

  const totalMinutes = useMemo(
    () => activities.reduce((acc, curr) => acc + curr.minutes, 0),
    [activities]
  );

  const completedDaysCount = useMemo(
    () => activities.filter((a) => a.completed).length,
    [activities]
  );

  const goalPercent = Math.min(Math.round((totalMinutes / weeklyGoal) * 100), 100);
  const maxMinutes = Math.max(...activities.map((a) => a.minutes), 20);
  const dayLabels = translations.common.shortDays[lang];

  return (
    <div className="rounded-3xl liquid-glass-card bg-[#102B40]/95 p-6 border border-[#82CDE1]/20 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#82CDE1]/15">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#93A8B8] block mb-0.5">
              {t.weeklyActivity[lang]}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#F5FAFF]">{totalMinutes}</span>
              <span className="text-xs font-semibold text-[#93A8B8]">
                / {weeklyGoal} {t.minutes[lang]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#15354A] border border-[#FF7777]/30">
            <Flame size={14} className="text-[#FF7777] fill-[#FF7777]" />
            <span className="text-xs font-bold text-[#F5FAFF]">
              {completedDaysCount}/7 {lang === 'vi' ? 'ngày' : 'days'}
            </span>
          </div>
        </div>

        {/* Minimalist Rhythm Columns */}
        <div className="grid grid-cols-7 items-end gap-2 h-28 mb-4 px-1">
          {activities.map((item, idx) => {
            const isToday = idx === activities.length - 1;
            const heightPercent =
              item.minutes > 0 ? Math.max(Math.round((item.minutes / maxMinutes) * 100), 18) : 10;

            return (
              <div key={item.day} className="flex flex-col items-center justify-end h-full gap-1.5">
                <span className="text-[10px] font-bold text-[#93A8B8] tabular-nums">
                  {item.minutes > 0 ? `${item.minutes}m` : '-'}
                </span>

                <div className="w-full flex items-end justify-center h-20">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[24px] rounded-lg transition-all duration-300 ${
                      item.completed
                        ? 'bg-[#43D5ED] shadow-[0_0_8px_rgba(67,213,237,0.3)]'
                        : isToday
                        ? 'bg-[#D9F66F] shadow-[0_0_8px_rgba(217,246,111,0.3)]'
                        : 'bg-[#061625] border border-[#82CDE1]/15'
                    }`}
                  />
                </div>

                <span className={`text-[11px] font-bold ${isToday ? 'text-[#43D5ED]' : 'text-[#93A8B8]'}`}>
                  {dayLabels[idx] ?? item.shortDay}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Goal Progress Ring / Bar */}
      <div className="pt-3.5 border-t border-[#82CDE1]/15">
        <div className="flex items-center justify-between text-xs font-bold text-[#F5FAFF] mb-2">
          <span className="flex items-center gap-1.5 text-[#C3D2DF]">
            <Target size={14} className="text-[#43D5ED]" />
            <span>{t.weeklyGoal[lang]}:</span>
            <strong className="text-[#F5FAFF]">{goalPercent}%</strong>
          </span>
          <span className="text-xs text-[#6BE0A4] font-bold">
            {goalPercent >= 100 ? (lang === 'vi' ? 'Đã đạt mục tiêu 🎉' : 'Goal achieved 🎉') : `${totalMinutes}/${weeklyGoal}m`}
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#061625] overflow-hidden border border-[#82CDE1]/15">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#43D5ED] to-[#6BE0A4] transition-all duration-500"
            style={{ width: `${goalPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
