'use client';

import { useState, useMemo } from 'react';
import { Search, Clock, ArrowUpRight, BookOpen, Sparkles } from 'lucide-react';
import type { Skill } from '@/types';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface LibraryViewProps {
  skills: Skill[];
  onStartLesson: () => void;
  lang: Lang;
}

interface LibraryLessonItem {
  id: string;
  title: { vi: string; en: string };
  category: { vi: string; en: string };
  skill: string;
  duration: number;
  level: { vi: string; en: string };
  scenario: { vi: string; en: string };
  color: string;
}

const libraryLessons: LibraryLessonItem[] = [
  {
    id: 'l-sql-1',
    title: { vi: 'GROUP BY & SUM — Báo cáo doanh thu', en: 'GROUP BY & SUM — Revenue Report' },
    category: { vi: 'Phân tích dữ liệu', en: 'Data Analysis' },
    skill: 'SQL',
    duration: 10,
    level: { vi: 'Cơ bản', en: 'Basic' },
    scenario: {
      vi: 'Sếp yêu cầu tổng hợp doanh thu 500 đơn hàng theo tháng.',
      en: 'Manager needs revenue from 500 orders aggregated by month.',
    },
    color: '#43D5ED',
  },
  {
    id: 'l-sql-2',
    title: { vi: 'INNER JOIN vs LEFT JOIN', en: 'INNER JOIN vs LEFT JOIN' },
    category: { vi: 'Phân tích dữ liệu', en: 'Data Analysis' },
    skill: 'SQL',
    duration: 12,
    level: { vi: 'Trung cấp', en: 'Intermediate' },
    scenario: {
      vi: 'Tìm khách hàng đã đăng ký nhưng chưa phát sinh đơn.',
      en: 'Find customers who registered but have no orders.',
    },
    color: '#43D5ED',
  },
  {
    id: 'l-excel-1',
    title: { vi: 'XLOOKUP nhiều điều kiện', en: 'Multi-criteria XLOOKUP' },
    category: { vi: 'Năng suất', en: 'Productivity' },
    skill: 'Excel',
    duration: 8,
    level: { vi: 'Trung cấp', en: 'Intermediate' },
    scenario: {
      vi: 'Dò tìm giá bán sản phẩm theo Tên và Khu vực.',
      en: 'Look up product price by Name and Region.',
    },
    color: '#D9F66F',
  },
  {
    id: 'l-excel-2',
    title: { vi: 'Chuẩn hóa định dạng ngày tháng', en: 'Standardize Date Formatting' },
    category: { vi: 'Năng suất', en: 'Productivity' },
    skill: 'Excel',
    duration: 10,
    level: { vi: 'Cơ bản', en: 'Basic' },
    scenario: {
      vi: 'Xử lý file dữ liệu 2.000 dòng bị dính khoảng trắng.',
      en: 'Clean 2,000-row data file with extra whitespace.',
    },
    color: '#D9F66F',
  },
  {
    id: 'l-eng-1',
    title: { vi: 'Daily Standup tự tin', en: 'Confident Daily Standup' },
    category: { vi: 'Giao tiếp công sở', en: 'Office Communication' },
    skill: 'English',
    duration: 10,
    level: { vi: 'Trung cấp', en: 'Intermediate' },
    scenario: {
      vi: 'Tránh ậm ừ trong cuộc họp sáng 15 phút.',
      en: 'Avoid hesitation in a 15-minute morning meeting.',
    },
    color: '#48C8A4',
  },
  {
    id: 'l-eng-2',
    title: { vi: 'Email từ chối khéo léo', en: 'Polite Decline Email' },
    category: { vi: 'Giao tiếp công sở', en: 'Office Communication' },
    skill: 'English',
    duration: 10,
    level: { vi: 'Trung cấp', en: 'Intermediate' },
    scenario: {
      vi: 'Từ chối task ngoài scope mà vẫn giữ hòa khí.',
      en: 'Decline out-of-scope tasks while maintaining good relations.',
    },
    color: '#48C8A4',
  },
];

const categoryKeys = ['all', 'data', 'productivity', 'communication'] as const;

const categoryLabels: Record<typeof categoryKeys[number], { vi: string; en: string }> = {
  all: translations.library.all,
  data: translations.library.dataAnalysis,
  productivity: translations.library.productivity,
  communication: translations.library.communication,
};

const categoryMap: Record<string, typeof categoryKeys[number]> = {
  'Phân tích dữ liệu': 'data',
  'Data Analysis': 'data',
  'Năng suất': 'productivity',
  'Productivity': 'productivity',
  'Giao tiếp công sở': 'communication',
  'Office Communication': 'communication',
};

export default function LibraryView({ onStartLesson, lang }: LibraryViewProps) {
  const t = translations.library;
  const [selectedCategory, setSelectedCategory] = useState<typeof categoryKeys[number]>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = useMemo(() => {
    return libraryLessons.filter((item) => {
      const catKey = categoryMap[item.category.vi] ?? categoryMap[item.category.en] ?? 'all';
      const matchCat = selectedCategory === 'all' || catKey === selectedCategory;
      const searchLower = searchQuery.toLowerCase();
      const matchSearch =
        item.title[lang].toLowerCase().includes(searchLower) ||
        item.scenario[lang].toLowerCase().includes(searchLower) ||
        item.skill.toLowerCase().includes(searchLower);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery, lang]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="liquid-glass-card p-5 sm:p-6 rounded-2xl border border-[#82CDE1]/15 bg-[#102B40]/90 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#43D5ED]/10 border border-[#43D5ED]/20 text-[11px] font-bold uppercase tracking-wider text-[#43D5ED] mb-2">
              <Sparkles size={11} />
              <span>{lang === 'vi' ? 'Thư viện kỹ năng micro-learning' : 'Skill Library'}</span>
            </div>
            <h2 className="text-2xl font-black text-[#F5FAFF]">{t.title[lang]}</h2>
            <p className="text-sm text-[#C3D2DF] font-medium mt-1">{t.subtitle[lang]}</p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93A8B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder[lang]}
              className="w-full border border-[#82CDE1]/20 rounded-xl bg-[#0A1E32]/75 pl-10 pr-4 py-2.5 text-sm font-medium text-[#F5FAFF] placeholder:text-[#93A8B8] focus:border-[#43D5ED] focus:ring-1 focus:ring-[#43D5ED] focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="mt-5 pt-4 border-t border-[#82CDE1]/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#93A8B8] mr-1">{t.filterBy[lang]}</span>
          {categoryKeys.map((key) => {
            const isActive = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#43D5ED]/20 text-[#43D5ED] border-[#43D5ED]/40 shadow-sm shadow-[#43D5ED]/10'
                    : 'bg-[#0A1E32]/60 text-[#C3D2DF] border-[#82CDE1]/15 hover:bg-[#15354A] hover:text-[#F5FAFF]'
                }`}
              >
                {categoryLabels[key][lang]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredLessons.map((item, idx) => (
          <div
            key={item.id}
            className={`
              liquid-glass-card p-5 rounded-2xl flex flex-col justify-between
              border border-[#82CDE1]/15 bg-[#102B40]/90 backdrop-blur-md hover:border-[#43D5ED]/40 hover:bg-[#102B40] transition-all
              animate-fade-in-up stagger-${Math.min(idx + 1, 8)}
            `}
          >
            <div>
              {/* Top bar */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#43D5ED]/15 text-[#43D5ED] border border-[#43D5ED]/25">
                  {item.skill}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#C3D2DF]">
                  <Clock size={12} className="text-[#43D5ED]" /> {item.duration} min • {item.level[lang]}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-extrabold text-[#F5FAFF] leading-snug mb-2">
                {item.title[lang]}
              </h3>

              {/* Scenario */}
              <div className="bg-[#0A1E32]/75 border border-[#82CDE1]/15 rounded-xl p-3.5 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#43D5ED] block mb-1">
                  {t.scenarioLabel[lang]}
                </span>
                <p className="text-xs text-[#C3D2DF] leading-relaxed font-medium">{item.scenario[lang]}</p>
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-[#82CDE1]/10 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#93A8B8]">{item.category[lang]}</span>
              <button
                onClick={onStartLesson}
                className="flex items-center gap-1 text-xs font-bold text-[#43D5ED] hover:text-[#D9F66F] transition-colors cursor-pointer group"
              >
                <span>{t.learnNow[lang]}</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="liquid-glass-card p-12 text-center rounded-2xl border border-dashed border-[#82CDE1]/25 bg-[#102B40]/70">
          <BookOpen size={32} className="mx-auto text-[#93A8B8]/60 mb-3" />
          <h4 className="text-base font-bold text-[#F5FAFF]">{t.noResults[lang]}</h4>
          <p className="text-xs text-[#93A8B8] mt-1">{t.tryOtherKeywords[lang]}</p>
        </div>
      )}
    </div>
  );
}
