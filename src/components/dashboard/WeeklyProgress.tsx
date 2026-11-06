'use client';

import { useMemo } from 'react';
import { Flame, Target, CheckCircle2 } from 'lucide-react';
import type { WeeklyActivity } from '@/types';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface WeeklyProgressProps {
  activities: WeeklyActivity[];
  weeklyGoal: number;
  lang: Lang;
}

export default function WeeklyProgress({ activities, weeklyGoal, lang }: WeeklyProgressProps) {
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
    <div className="card-premium bg-white p-6 rounded-2xl flex flex-col justify-between h-full">
      <div>
        {/* Header with goal metrics */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E1E5DE]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#626A63] block mb-0.5">
              {t.weeklyActivity[lang]}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#202521]">
                {totalMinutes}
              </span>
              <span className="text-xs font-semibold text-[#626A63]">
                / {weeklyGoal} {t.minutes[lang]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#E7F0EA] border border-[#245C4B]/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Flame size={14} className="text-[#F17B61] fill-[#F17B61]" />
              <span className="text-xs font-bold text-[#245C4B]">{completedDaysCount}/7 {lang === 'vi' ? 'ngày' : 'days'}</span>
            </div>
          </div>
        </div>

        {/* Refined Bar Chart */}
        <div className="grid grid-cols-7 items-end gap-2.5 h-36 mb-4 px-1 pt-4">
          {activities.map((item, idx) => {
            const isToday = idx === activities.length - 1;
            const heightPercent = item.minutes > 0
              ? Math.max(Math.round((item.minutes / maxMinutes) * 100), 16)
              : 8;

            return (
              <div key={item.day} className="group flex flex-col items-center justify-end h-full gap-1.5">
                {/* Minute Label above bar */}
                <div className="h-4 flex items-center">
                  {item.minutes > 0 ? (
                    <span className="text-[11px] font-bold text-[#202521] tabular-nums">
                      {item.minutes}m
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#A6AEA1] font-medium">-</span>
                  )}
                </div>

                {/* Sleek Column Bar */}
                <div className="w-full flex items-end justify-center h-24">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ease-out ${item.completed
                        ? 'bg-[#245C4B] group-hover:bg-[#194638]'
                        : isToday
                          ? 'bg-[#D9F66F] border-2 border-[#245C4B]'
                          : 'bg-[#F0F1EB]'
                      }`}
                  />
                </div>

                {/* Day of Week Label */}
                <span className={`text-xs font-semibold ${isToday ? 'text-[#245C4B] font-bold' : 'text-[#626A63]'}`}>
                  {dayLabels[idx] ?? item.shortDay}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Goal Progress Bar */}
      <div className="pt-3 border-t border-[#E1E5DE]">
        <div className="flex items-center justify-between text-xs font-semibold text-[#202521] mb-2">
          <span className="flex items-center gap-1.5 text-[#626A63]">
            <Target size={14} className="text-[#245C4B]" />
            <span>{t.weeklyGoal[lang]}:</span>
            <strong className="text-[#202521]">{goalPercent}%</strong>
          </span>
          <span className="text-xs font-medium text-[#626A63]">
            {totalMinutes >= weeklyGoal ? (
              <span className="inline-flex items-center gap-1 text-[#267A53] font-bold">
                <CheckCircle2 size={13} />
                {lang === 'vi' ? 'Đã đạt mục tiêu!' : 'Goal reached!'}
              </span>
            ) : (
              <span>{Math.max(0, weeklyGoal - totalMinutes)} {t.minutes[lang]} {lang === 'vi' ? 'còn lại' : 'left'}</span>
            )}
          </span>
        </div>

        {/* Clean progress track */}
        <div className="h-2.5 rounded-full bg-[#F0F1EB] overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-[#245C4B] transition-all duration-500 ease-out"
            style={{ width: `${goalPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
