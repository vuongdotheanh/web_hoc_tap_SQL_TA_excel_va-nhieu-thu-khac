'use client';

import { Sparkles, ArrowRight, FileText, Clock, Layers } from 'lucide-react';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface AIArchitectBannerProps {
  onOpenArchitect: () => void;
  lang: Lang;
}

export default function AIArchitectBanner({ onOpenArchitect, lang }: AIArchitectBannerProps) {
  const t = translations.aiArchitect;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#163D32] via-[#1B4B3D] to-[#245C4B] text-white p-6 sm:p-8 shadow-md border border-[#245C4B]/30 transition-all duration-200 hover:shadow-lg">
      {/* Subtle organic background decoration */}
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#D9F66F]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left side: Tag, Title, Description, and Badges */}
        <div className="space-y-3.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF]/10 border border-[#FFFFFF]/15 text-[#D9F66F] text-[11px] font-bold tracking-wider uppercase">
            <Sparkles size={13} className="text-[#D9F66F]" />
            <span>{t.bannerBadge[lang]}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFFFFF] leading-snug">
            {t.bannerTitle[lang]}
          </h2>

          <p className="text-sm sm:text-base text-[#D3E0D8] leading-relaxed font-normal">
            {t.bannerDesc[lang]}
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-[#E1EBE4]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 font-medium">
              <FileText size={12} className="text-[#D9F66F]" />
              <span>PDF • DOCX • PPTX • TXT • MD</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 font-medium">
              <Clock size={12} className="text-[#D9F66F]" />
              <span>10 {lang === 'vi' ? 'phút / bài' : 'min / lesson'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFFFF]/10 border border-[#FFFFFF]/10 font-medium">
              <Layers size={12} className="text-[#D9F66F]" />
              <span>{lang === 'vi' ? 'Bài tập & Trắc nghiệm thực tế' : 'Hands-on Exercises & Quizzes'}</span>
            </span>
          </div>
        </div>

        {/* Right side: Clear primary action button */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={onOpenArchitect}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#D9F66F] text-[#163D32] text-sm sm:text-base font-bold shadow-md hover:bg-[#C8EB5E] hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer group"
          >
            <span>{t.bannerButton[lang]}</span>
            <ArrowRight
              size={16}
              className="text-[#163D32] transition-transform duration-150 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

