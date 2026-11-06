'use client';

import { Clock, Sparkles, Zap, ArrowRight, BookOpen } from 'lucide-react';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';
import KnowledgeSphereGraphic from './KnowledgeSphereGraphic';

interface DailyLearningHeroProps {
  onStartLesson: () => void;
  lang: Lang;
}

export default function DailyLearningHero({ onStartLesson, lang }: DailyLearningHeroProps) {
  const t = translations.dashboard;

  return (
    <div className="relative rounded-3xl liquid-glass-card bg-[#102B40]/95 p-6 sm:p-8 lg:p-10 border border-[#82CDE1]/20 shadow-2xl overflow-hidden transition-all duration-300">
      {/* Ambient Cosmic Glow inside panel */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#43D5ED]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#48C8A4]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Asymmetrical 2-Column Composition: Left Info + Right Geometric Visual */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
        {/* Left Column: Mission, Challenge & CTA (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top Status Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#15354A] border border-[#43D5ED]/30 text-[#43D5ED]">
              <span className="w-2 h-2 rounded-full bg-[#43D5ED] animate-pulse" />
              {t.todayChallenge[lang]}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#15354A] border border-[#82CDE1]/20 text-[#F5FAFF]">
              <Clock size={13} className="text-[#43D5ED]" />
              <span>10 {t.minutes[lang]}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#15354A] border border-[#82CDE1]/20 text-[#C3D2DF]">
              <BookOpen size={13} className="text-[#48C8A4]" />
              <span>SQL · {t.basic[lang]}</span>
            </span>
          </div>

          {/* Main Title & Motivation */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5FAFF] tracking-tight leading-tight">
              {lang === 'vi' ? (
                <>
                  GROUP BY & SUM:{' '}
                  <span className="text-[#43D5ED]">Tính doanh thu</span> hàng tháng
                </>
              ) : (
                <>
                  GROUP BY & SUM:{' '}
                  <span className="text-[#43D5ED]">Monthly Revenue</span> Analytics
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#C3D2DF] mt-3 leading-relaxed font-normal">
              {lang === 'vi'
                ? 'Giải quyết tình huống thực tế: biến 500 bản ghi đơn hàng thô thành báo cáo doanh thu quý gọn gàng, chuẩn xác chỉ trong 10 phút.'
                : 'Tackle a workplace scenario: turn 500 raw order records into a clean quarterly revenue breakdown in just 10 focused minutes.'}
            </p>
          </div>

          {/* Scenario Callout Surface */}
          <div className="rounded-2xl bg-[#061625]/85 border border-[#82CDE1]/20 p-4 sm:p-5 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-bold text-[#43D5ED] uppercase tracking-wider mb-1.5">
              <Sparkles size={14} className="text-[#43D5ED]" />
              <span>{translations.lesson.scenario[lang]}</span>
            </div>
            <p className="text-sm font-medium text-[#F5FAFF] leading-relaxed">
              {lang === 'vi'
                ? '“Sếp yêu cầu bạn tổng hợp doanh thu của 500 đơn hàng theo từng tháng trong quý vừa rồi để làm slide báo cáo cho ban giám đốc.”'
                : '“Your manager needs you to aggregate revenue from 500 orders by month for the past quarter to present to leadership.”'}
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
            <button
              onClick={onStartLesson}
              className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-[#D9F66F] hover:bg-[#E6FFA1] text-[#061625] font-black text-sm sm:text-base shadow-[0_0_20px_rgba(217,246,111,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
            >
              <Zap size={18} className="text-[#061625] fill-[#061625]" />
              <span>{t.startChallenge[lang]}</span>
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <span className="text-xs text-[#93A8B8] font-medium text-center sm:text-left">
              {lang === 'vi' ? '⚡ +10 phút tích lũy • Tăng chuỗi ngày học' : '⚡ +10 min credit • Streak booster'}
            </span>
          </div>
        </div>

        {/* Right Column: Luminous Celestial Sphere (5 cols) */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <KnowledgeSphereGraphic />
        </div>
      </div>
    </div>
  );
}
