'use client';

import { ArrowRight, Clock, BookOpen, Sparkles } from 'lucide-react';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface RecommendedLessonProps {
  onStartLesson: () => void;
  lang: Lang;
}

export default function RecommendedLesson({ onStartLesson, lang }: RecommendedLessonProps) {
  const t = translations.dashboard;

  return (
    <div className="card-premium bg-white p-6 rounded-2xl flex flex-col justify-between h-full">
      
      <div>
        {/* Top Badges & Tag */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E7F0EA] flex items-center justify-center">
              <BookOpen size={16} className="text-[#245C4B]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#626A63] block">
                {lang === 'vi' ? 'Đề xuất hôm nay' : 'Recommended Today'}
              </span>
              <span className="text-base font-extrabold text-[#202521]">
                SQL · GROUP BY & SUM
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#E7F0EA] text-[#245C4B]">
            <Sparkles size={12} />
            {t.suggestedReview[lang]}
          </span>
        </div>

        {/* Practical Workplace Scenario Box */}
        <div className="bg-[#F7F7F3] rounded-xl border border-[#E1E5DE] p-4 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#245C4B] block mb-1">
            {translations.lesson.scenario[lang]}
          </span>
          <p className="text-sm font-semibold text-[#202521] leading-relaxed">
            {lang === 'vi'
              ? '“Sếp yêu cầu bạn tổng hợp doanh thu của 500 đơn hàng theo từng tháng trong quý vừa rồi để làm slide báo cáo.”'
              : '“Your manager needs you to aggregate revenue from 500 orders by month for the past quarter to present in a meeting.”'
            }
          </p>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-[#FFFFFF] border border-[#E1E5DE] px-2.5 py-1 rounded-md text-xs font-medium text-[#626A63]">
            <Clock size={12} className="text-[#245C4B]" />
            10 {t.minutes[lang]}
          </span>
          <span className="bg-[#E7F0EA] text-[#245C4B] px-2.5 py-1 rounded-md text-xs font-semibold">
            {t.basic[lang]}
          </span>
          <span className="bg-[#F0F1EB] text-[#202521] px-2.5 py-1 rounded-md text-xs font-semibold">
            {lang === 'vi' ? 'Báo cáo doanh nghiệp' : 'Enterprise Reporting'}
          </span>
        </div>

        {/* Key Query Topics */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          <span className="text-xs font-medium text-[#626A63] mr-1">
            {lang === 'vi' ? 'Từ khóa chính:' : 'Key keywords:'}
          </span>
          {['GROUP BY', 'SUM()', 'MONTH()'].map((topic) => (
            <span
              key={topic}
              className="font-mono text-xs font-semibold bg-[#F0F1EB] text-[#202521] px-2 py-0.5 rounded border border-[#E1E5DE]"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onStartLesson}
        className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-xs group"
      >
        <span>{t.startChallenge[lang]}</span>
        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
