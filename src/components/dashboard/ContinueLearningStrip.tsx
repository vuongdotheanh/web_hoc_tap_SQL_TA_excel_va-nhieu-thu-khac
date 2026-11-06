'use client';

import { Play, ArrowRight, BookOpen, ChevronRight } from 'lucide-react';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface ContinueLearningStripProps {
  onContinue: () => void;
  lang: Lang;
}

export default function ContinueLearningStrip({ onContinue, lang }: ContinueLearningStripProps) {
  const t = translations.dashboard;

  return (
    <div className="rounded-3xl liquid-glass-card bg-[#102B40]/95 p-5 sm:p-6 border border-[#82CDE1]/20 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Current Lesson Progression Details */}
        <div className="flex items-start sm:items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-[#15354A] border border-[#43D5ED]/30 text-[#43D5ED] flex items-center justify-center shrink-0 shadow-md">
            <BookOpen size={22} />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-[#43D5ED] bg-[#15354A] border border-[#43D5ED]/30 px-2.5 py-0.5 rounded-full">
                {lang === 'vi' ? 'ĐANG HỌC DỞ' : 'IN PROGRESS'}
              </span>
              <span className="text-[#93A8B8] font-medium">
                SQL Query Master • 6/10 {t.totalLessons[lang]}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-[#F5FAFF]">
              GROUP BY & SUM Aggregate Functions
            </h3>

            {/* Micro Progress Bar */}
            <div className="flex items-center gap-3 pt-0.5 max-w-md">
              <div className="flex-1 h-2 rounded-full bg-[#061625] overflow-hidden border border-[#82CDE1]/15">
                <div className="h-full rounded-full bg-[#43D5ED]" style={{ width: '60%' }} />
              </div>
              <span className="text-xs font-black text-[#43D5ED]">60%</span>
            </div>
          </div>
        </div>

        {/* Middle: Upcoming Lesson Preview */}
        <div className="hidden xl:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#061625]/80 border border-[#82CDE1]/15">
          <div className="text-left">
            <span className="text-[10px] font-bold text-[#93A8B8] uppercase tracking-wider block">
              {lang === 'vi' ? 'Bài tiếp theo' : 'Next Up'}
            </span>
            <span className="text-xs font-bold text-[#F5FAFF]">
              HAVING & Subquery Filtering
            </span>
          </div>
          <ChevronRight size={16} className="text-[#93A8B8]" />
        </div>

        {/* Right: Continue Action */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#43D5ED] hover:bg-[#6BE0F5] text-[#061625] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(67,213,237,0.3)] transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Play size={14} fill="currentColor" />
            <span>{t.continueLearning[lang]}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
