'use client';

import { ArrowRight, Clock, Zap, CheckCircle2, Terminal } from 'lucide-react';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface HeroSectionProps {
  onStartLesson: () => void;
  lang: Lang;
}

export default function HeroSection({ onStartLesson, lang }: HeroSectionProps) {
  const t = translations.dashboard;

  return (
    <section className="animate-fade-in-up stagger-1 relative overflow-hidden rounded-2xl bg-[#245C4B] text-white border border-[#194638] shadow-[0_4px_20px_rgba(36,92,75,0.15)]">
      
      {/* Subtle organic light accent in the background */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#D9F66F]/10 to-transparent pointer-events-none rounded-full blur-2xl" 
        aria-hidden="true" 
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 lg:p-9 items-center">
        
        {/* Left Column: Mission & Action */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          {/* Micro Category Pill & Duration */}
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#D9F66F] text-[#163D32]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#163D32] animate-pulse" />
              {t.todayChallenge[lang]}
            </span>
            <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold">
              <Clock size={13} className="text-[#D9F66F]" />
              <span>10 {t.minutes[lang]}</span>
            </div>
            <span className="text-white/30">•</span>
            <span className="text-white/80 text-xs font-semibold">
              {t.basic[lang]}
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-black text-white leading-[1.2] tracking-tight mb-3">
            {lang === 'vi' ? (
              <>
                10 phút mỗi ngày.<br />
                <span className="text-[#D9F66F]">Tiến bộ</span> theo cách của bạn.
              </>
            ) : (
              <>
                10 minutes a day.<br />
                <span className="text-[#D9F66F]">Progress</span> on your terms.
              </>
            )}
          </h2>

          {/* Current Lesson Objective */}
          <div className="bg-white/10 rounded-xl p-3.5 sm:p-4 mb-5 border border-white/10 backdrop-blur-xs max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D9F66F] uppercase tracking-wider mb-1">
              <span>SQL · GROUP BY & Aggregate Functions</span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed font-medium">
              {lang === 'vi'
                ? 'Tổng hợp doanh thu từ 500 đơn hàng thực tế và rút trích báo cáo quý chỉ với 4 dòng truy vấn.'
                : 'Aggregate revenue from 500 orders and extract quarterly insights with just 4 clean query lines.'
              }
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onStartLesson}
              className="btn-lime inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold shadow-md cursor-pointer group"
            >
              <Zap size={18} className="fill-[#163D32]" />
              <span>{t.startChallenge[lang]}</span>
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
              <CheckCircle2 size={15} className="text-[#D9F66F]" />
              <span>{lang === 'vi' ? 'Có bài tập thực hành ngay' : 'Interactive practice included'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Purposeful, Refined Code Preview Snippet */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="rounded-xl border border-white/15 bg-[#202823] p-4.5 shadow-xl text-left font-mono">
            
            {/* Header bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#D9F66F]" />
                <span className="font-semibold text-white/80">revenue_summary.sql</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-[#D9F66F] font-bold">
                Run: 12ms
              </span>
            </div>

            {/* Code lines */}
            <div className="space-y-1.5 text-xs font-mono leading-relaxed">
              <div className="flex gap-3">
                <span className="text-white/30 select-none text-right w-4">1</span>
                <span>
                  <strong className="text-[#D9F66F]">SELECT</strong> branch_id,
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/30 select-none text-right w-4">2</span>
                <span className="pl-4">
                  <strong className="text-[#88E5BE]">COUNT</strong>(order_id) <strong className="text-[#D9F66F]">AS</strong> total_orders,
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/30 select-none text-right w-4">3</span>
                <span className="pl-4">
                  <strong className="text-[#88E5BE]">SUM</strong>(revenue) <strong className="text-[#D9F66F]">AS</strong> total_rev
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/30 select-none text-right w-4">4</span>
                <span>
                  <strong className="text-[#D9F66F]">FROM</strong> orders
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/30 select-none text-right w-4">5</span>
                <span>
                  <strong className="text-[#D9F66F]">GROUP BY</strong> branch_id;
                </span>
              </div>
            </div>

            {/* Mini output pill */}
            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70">
              <span className="text-[#88E5BE] font-semibold">✓ 4 rows aggregated</span>
              <span className="text-white/50 text-[10px]">{lang === 'vi' ? 'Sẵn sàng thực hành' : 'Ready to practice'}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
