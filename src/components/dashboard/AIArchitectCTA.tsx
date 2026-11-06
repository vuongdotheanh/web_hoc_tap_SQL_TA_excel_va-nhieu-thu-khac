'use client';

import { Sparkles, UploadCloud, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import type { Lang } from '@/data/translations';

interface AIArchitectCTAProps {
  onOpenArchitect: () => void;
  onUploadMaterials: () => void;
  lang: Lang;
}

export default function AIArchitectCTA({
  onOpenArchitect,
  onUploadMaterials,
  lang,
}: AIArchitectCTAProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl liquid-glass-card bg-gradient-to-br from-[#102B40] via-[#15354A]/90 to-[#0A1E32] text-white p-6 sm:p-8 lg:p-9 border border-[#43D5ED]/30 shadow-2xl transition-all duration-300 h-full flex flex-col justify-between">
      {/* Ambient background light spots */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#43D5ED]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-[#48C8A4]/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Left Side: Tag, Heading, Supporting Copy, File Types */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#061625]/70 border border-[#43D5ED]/30 text-[#43D5ED] text-xs font-black tracking-wider uppercase">
          <Sparkles size={13} className="text-[#43D5ED]" />
          <span>{lang === 'vi' ? 'KIẾN TRÚC HỌC TẬP THÔNG MINH' : 'AI LEARNING ARCHITECT'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#F5FAFF] tracking-tight leading-snug">
          {lang === 'vi' ? 'Tải tài liệu và tạo lộ trình bằng AI' : 'Upload materials & construct AI roadmap'}
        </h2>

        <p className="text-xs sm:text-sm text-[#C3D2DF] leading-relaxed font-normal">
          {lang === 'vi'
            ? 'Tải giáo trình, slide hoặc PDF vào môn học để AI xây lộ trình học tập cá nhân hóa dựa trên tài liệu của bạn.'
            : 'Upload course materials and let AI construct personalized learning roadmaps based on their exact contents.'}
        </p>

        {/* Supported Format Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#C3D2DF]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#061625]/60 border border-[#82CDE1]/15 font-semibold">
            <FileText size={13} className="text-[#43D5ED]" />
            <span>PDF • DOCX • PPTX • TXT • MD</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#061625]/60 border border-[#82CDE1]/15 font-semibold">
            <CheckCircle2 size={13} className="text-[#48C8A4]" />
            <span>{lang === 'vi' ? 'Tự động trích xuất & OCR' : 'Automatic text extraction & OCR'}</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-3 pt-6 mt-4 border-t border-[#82CDE1]/15">
        <button
          onClick={onOpenArchitect}
          className="px-6 py-3.5 rounded-2xl bg-[#D9F66F] hover:bg-[#E6FFA1] text-[#061625] font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(217,246,111,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
        >
          <Sparkles size={16} className="text-[#061625]" />
          <span>{lang === 'vi' ? 'Tạo lộ trình ngay' : 'Build Roadmap Now'}</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={onUploadMaterials}
          className="px-5 py-3 rounded-2xl bg-[#15354A] hover:bg-[#1E4661] text-[#F5FAFF] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#82CDE1]/25 transition-all cursor-pointer"
        >
          <UploadCloud size={16} className="text-[#43D5ED]" />
          <span>{lang === 'vi' ? 'Tải tài liệu vào môn học' : 'Upload to Course'}</span>
        </button>
      </div>
    </div>
  );
}
