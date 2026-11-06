'use client';

import { useState } from 'react';
import {
  Check,
  Lock,
  Zap,
  ArrowRight,
  Sparkles,
  FileText,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Skill, Lesson } from '@/types';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';
import type { GeneratedRoadmap, GeneratedLesson } from '@/types/architect';
import {
  getSavedRoadmaps,
  deleteRoadmapFromStorage,
  convertToLessonViewFormat,
} from '@/utils/roadmapStorage';

interface RoadmapViewProps {
  skills: Skill[];
  onStartLesson: () => void;
  onStartCustomLesson?: (lesson: Lesson) => void;
  onNavigateToArchitect?: () => void;
  lang: Lang;
}

interface MilestoneItem {
  id: string;
  skillId: string;
  skillName: string;
  title: { vi: string; en: string };
  description: { vi: string; en: string };
  status: 'completed' | 'in_progress' | 'locked';
  duration: string;
  level: { vi: string; en: string };
  tags: string[];
}

const milestones: MilestoneItem[] = [
  {
    id: 'm1',
    skillId: 'excel',
    skillName: 'Excel',
    title: { vi: 'Hàm logic IF, AND, OR kết hợp', en: 'Combined IF, AND, OR Logical Functions' },
    description: {
      vi: 'Xử lý các tình huống phân loại khách hàng và gắn tag dữ liệu tự động.',
      en: 'Handle customer segmentation and automated data tagging scenarios.',
    },
    status: 'completed',
    duration: '10 min',
    level: { vi: 'Cơ bản', en: 'Basic' },
    tags: ['IF', 'LOGIC', 'CLEANING'],
  },
  {
    id: 'm2',
    skillId: 'sql',
    skillName: 'SQL',
    title: { vi: 'GROUP BY & SUM: Tính doanh thu hàng tháng', en: 'GROUP BY & SUM: Monthly Revenue Analytics' },
    description: {
      vi: 'Biến 500 bản ghi đơn hàng thô thành báo cáo quý chuẩn xác để báo cáo ban giám đốc.',
      en: 'Turn 500 raw order records into a clean quarterly report for leadership.',
    },
    status: 'in_progress',
    duration: '10 min',
    level: { vi: 'Cơ bản', en: 'Basic' },
    tags: ['GROUP_BY', 'AGGREGATE', 'REPORT'],
  },
  {
    id: 'm3',
    skillId: 'sql',
    skillName: 'SQL',
    title: { vi: 'HAVING & Subquery: Lọc nhóm dữ liệu nâng cao', en: 'HAVING & Subquery: Advanced Filtering' },
    description: {
      vi: 'Tìm các chi nhánh có doanh số vượt trung bình toàn quốc trong quý gần nhất.',
      en: 'Identify branch offices performing above national averages.',
    },
    status: 'locked',
    duration: '12 min',
    level: { vi: 'Trung cấp', en: 'Intermediate' },
    tags: ['HAVING', 'SUBQUERY', 'ANALYTICS'],
  },
  {
    id: 'm4',
    skillId: 'english',
    skillName: 'English',
    title: { vi: 'Email cập nhật tiến độ dự án chuyên nghiệp', en: 'Professional Project Status Emails' },
    description: {
      vi: 'Cấu trúc email báo cáo tiến độ, rủi ro và các bước tiếp theo cho đối tác quốc tế.',
      en: 'Structure concise status, risks, and next steps for international partners.',
    },
    status: 'locked',
    duration: '10 min',
    level: { vi: 'Thực chiến', en: 'Applied' },
    tags: ['EMAIL', 'STATUS', 'WORKPLACE'],
  },
  {
    id: 'm5',
    skillId: 'sql',
    skillName: 'SQL',
    title: { vi: 'Window Functions: Xếp hạng doanh số với DENSE_RANK', en: 'Window Functions: Sales Ranking' },
    description: {
      vi: 'Tính toán thứ hạng nhân viên kinh doanh theo từng khu vực mà không làm gộp dòng.',
      en: 'Calculate regional sales rankings without collapsing individual rows.',
    },
    status: 'locked',
    duration: '15 min',
    level: { vi: 'Nâng cao', en: 'Advanced' },
    tags: ['WINDOW_FN', 'RANK', 'ADVANCED'],
  },
];

export default function RoadmapView({
  onStartLesson,
  onStartCustomLesson,
  onNavigateToArchitect,
  lang,
}: RoadmapViewProps) {
  const t = translations.roadmap;
  const tArch = translations.aiArchitect;

  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');
  const [customRoadmaps, setCustomRoadmaps] = useState<GeneratedRoadmap[]>(() => getSavedRoadmaps());
  const [expandedRoadmapId, setExpandedRoadmapId] = useState<string | null>(() => {
    const saved = getSavedRoadmaps();
    return saved.length > 0 ? saved[0].id : null;
  });

  const handleDeleteCustomRoadmap = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const confirmMsg = tArch.deleteRoadmapConfirm[lang];
    if (window.confirm(confirmMsg)) {
      const updated = deleteRoadmapFromStorage(id);
      setCustomRoadmaps(updated);
    }
  };

  const handleStartCustomItem = (roadmap: GeneratedRoadmap, lesson: GeneratedLesson) => {
    if (onStartCustomLesson) {
      const converted = convertToLessonViewFormat(lesson, roadmap.title);
      onStartCustomLesson(converted);
    } else {
      onStartLesson();
    }
  };

  const completedCount = milestones.filter((m) => m.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Tab Switcher: Standard Quest Map vs Custom AI Roadmaps */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#82CDE1]/15">
        <div className="flex items-center gap-1.5 p-1.5 bg-[#102B40] border border-[#82CDE1]/20 rounded-2xl shadow-md self-start">
          <button
            type="button"
            onClick={() => setActiveTab('standard')}
            className={`
              px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
              ${
                activeTab === 'standard'
                  ? 'bg-[#43D5ED] text-[#061625] font-extrabold shadow-sm'
                  : 'text-[#C3D2DF] hover:text-[#F5FAFF]'
              }
            `}
          >
            {lang === 'vi' ? 'Lộ trình Tiêu chuẩn' : 'Standard Tracks'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`
              px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5
              ${
                activeTab === 'custom'
                  ? 'bg-[#43D5ED] text-[#061625] font-extrabold shadow-sm'
                  : 'text-[#C3D2DF] hover:text-[#F5FAFF]'
              }
            `}
          >
            <Sparkles size={13} className={activeTab === 'custom' ? 'text-[#061625]' : 'text-[#43D5ED]'} />
            <span>{tArch.myCustomRoadmaps[lang]}</span>
            {customRoadmaps.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-[#D9F66F] text-[#061625] rounded-full text-[10px] font-black">
                {customRoadmaps.length}
              </span>
            )}
          </button>
        </div>

        {/* Quick button to create from documents */}
        {onNavigateToArchitect && (
          <button
            type="button"
            onClick={onNavigateToArchitect}
            className="px-5 py-2.5 rounded-xl bg-[#D9F66F] hover:bg-[#E6FFA1] text-[#061625] text-xs font-black inline-flex items-center gap-1.5 self-start cursor-pointer shadow-[0_0_15px_rgba(217,246,111,0.3)] transition-all"
          >
            <Sparkles size={13} />
            <span>{tArch.bannerButton[lang]}</span>
          </button>
        )}
      </div>

      {/* ─── TAB 1: STANDARD QUEST MAP ─── */}
      {activeTab === 'standard' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="rounded-3xl liquid-glass-card bg-[#102B40]/95 text-white p-6 sm:p-8 border border-[#82CDE1]/20 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#43D5ED] block mb-1">
                  {lang === 'vi' ? 'LỘ TRÌNH ĐÀO TẠO' : 'LEARNING QUEST MAP'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#F5FAFF] leading-tight">
                  {t.title[lang]}
                </h2>
                <p className="text-sm text-[#C3D2DF] font-medium mt-1 max-w-xl">
                  {t.subtitle[lang]}
                </p>
              </div>

              <div className="flex gap-3 shrink-0">
                <div className="bg-[#061625]/80 border border-[#82CDE1]/15 px-4 py-2.5 rounded-2xl text-center">
                  <span className="text-xl sm:text-2xl font-black text-[#43D5ED] block">
                    {completedCount}/5
                  </span>
                  <span className="text-[11px] font-semibold text-[#93A8B8] uppercase tracking-wider">
                    {t.milestonesCompleted[lang]}
                  </span>
                </div>
                <div className="bg-[#061625]/80 border border-[#82CDE1]/15 px-4 py-2.5 rounded-2xl text-center">
                  <span className="text-xl sm:text-2xl font-black text-[#F5FAFF] block">~57m</span>
                  <span className="text-[11px] font-semibold text-[#93A8B8] uppercase tracking-wider">
                    {t.estimatedTime[lang]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quest Path Timeline */}
          <div className="relative pl-2 sm:pl-4">
            <div
              className="absolute left-[26px] sm:left-[34px] top-6 bottom-6 w-[2px] bg-[#82CDE1]/20"
              aria-hidden="true"
            />

            <div className="space-y-6 sm:space-y-8">
              {milestones.map((item, idx) => {
                const isCompleted = item.status === 'completed';
                const isActive = item.status === 'in_progress';
                const isLocked = item.status === 'locked';

                return (
                  <div key={item.id} className="relative flex items-start gap-4 sm:gap-6 group">
                    <div
                      className={`
                        relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition-transform
                        ${
                          isCompleted
                            ? 'bg-[#6BE0A4] text-[#061625] shadow-md'
                            : isActive
                            ? 'bg-[#43D5ED] text-[#061625] border-2 border-[#8AE9F0] shadow-[0_0_15px_#43D5ED] scale-105'
                            : 'bg-[#061625] text-[#93A8B8] border border-[#82CDE1]/20'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check size={18} strokeWidth={3} />
                      ) : isActive ? (
                        <Zap size={18} className="fill-[#061625]" />
                      ) : (
                        <Lock size={16} />
                      )}
                    </div>

                    <div
                      className={`
                        flex-1 rounded-3xl p-5 sm:p-6 transition-all duration-200 border
                        ${
                          isActive
                            ? 'bg-[#102B40]/98 border-[#43D5ED] shadow-xl'
                            : isCompleted
                            ? 'bg-[#102B40]/90 border-[#82CDE1]/20 shadow-md'
                            : 'bg-[#102B40]/60 border-[#82CDE1]/10 opacity-70'
                        }
                      `}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase ${
                              item.skillId === 'sql'
                                ? 'bg-[#43D5ED]/15 text-[#43D5ED] border border-[#43D5ED]/30'
                                : item.skillId === 'excel'
                                ? 'bg-[#48C8A4]/15 text-[#48C8A4] border border-[#48C8A4]/30'
                                : 'bg-[#A78BFA]/15 text-[#C4B5FD] border border-[#A78BFA]/30'
                            }`}
                          >
                            {item.skillName}
                          </span>
                          <span className="text-xs font-semibold text-[#93A8B8]">
                            {t.milestone[lang]} 0{idx + 1}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-[#C3D2DF] flex items-center gap-1">
                          <Clock size={12} className="text-[#43D5ED]" />
                          <span>{item.duration}</span>
                        </span>
                      </div>

                      <h3
                        className={`text-base sm:text-lg font-extrabold ${
                          isLocked ? 'text-[#93A8B8]' : 'text-[#F5FAFF]'
                        }`}
                      >
                        {item.title[lang]}
                      </h3>
                      <p className="text-xs sm:text-sm mt-1 text-[#C3D2DF] leading-relaxed">
                        {item.description[lang]}
                      </p>

                      <div className="mt-4 pt-3.5 border-t border-[#82CDE1]/15 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[10px] font-bold bg-[#061625] px-2 py-0.5 rounded-md text-[#93A8B8] border border-[#82CDE1]/15"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {isActive && (
                          <button
                            onClick={onStartLesson}
                            className="bg-[#43D5ED] hover:bg-[#6BE0F5] text-[#061625] font-black text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(67,213,237,0.3)] cursor-pointer"
                          >
                            <span>{t.startNow[lang]}</span>
                            <ArrowRight size={14} />
                          </button>
                        )}
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-xs font-bold text-[#6BE0A4]">
                            <Check size={14} /> {t.completedLabel[lang]}
                          </span>
                        )}
                        {isLocked && (
                          <span className="text-xs font-medium text-[#93A8B8]">
                            {t.unlocksAfter[lang]} M0{idx}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: MY CUSTOM AI ROADMAPS ─── */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          {customRoadmaps.length === 0 ? (
            /* Empty state */
            <div className="liquid-glass-card bg-[#102B40]/90 p-8 sm:p-12 rounded-3xl border border-[#82CDE1]/20 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-[#15354A] border border-[#43D5ED]/30 text-[#43D5ED] flex items-center justify-center mx-auto shadow-md">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#F5FAFF]">
                {lang === 'vi' ? 'Chưa có lộ trình AI nào được lưu' : 'No AI roadmaps saved yet'}
              </h3>
              <p className="text-xs sm:text-sm text-[#C3D2DF] leading-relaxed">
                {tArch.bannerDesc[lang]}
              </p>
              {onNavigateToArchitect && (
                <button
                  type="button"
                  onClick={onNavigateToArchitect}
                  className="px-5 py-2.5 rounded-xl bg-[#43D5ED] text-[#061625] text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(67,213,237,0.3)]"
                >
                  <Sparkles size={14} />
                  <span>{tArch.bannerButton[lang]}</span>
                </button>
              )}
            </div>
          ) : (
            /* List of Saved Custom Roadmaps */
            <div className="space-y-6">
              <p className="text-xs text-[#93A8B8] italic">
                {tArch.storageNotice[lang]}
              </p>

              {customRoadmaps.map((rMap) => {
                const isExpanded = expandedRoadmapId === rMap.id;
                const totalLessons = rMap.modules.reduce(
                  (acc, m) => acc + (m.lessons?.length || 0),
                  0
                );

                return (
                  <div
                    key={rMap.id}
                    className="liquid-glass-card bg-[#102B40]/95 rounded-3xl border border-[#82CDE1]/20 shadow-xl overflow-hidden"
                  >
                    {/* Header */}
                    <div
                      onClick={() => setExpandedRoadmapId(isExpanded ? null : rMap.id)}
                      className="p-5 sm:p-6 cursor-pointer hover:bg-[#15354A]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#82CDE1]/15"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#15354A] border border-[#43D5ED]/30 text-[#43D5ED] text-[10px] font-black tracking-wider uppercase">
                            {tArch.customBadge[lang]}
                          </span>
                          <span className="text-xs text-[#93A8B8] flex items-center gap-1 font-semibold">
                            <Clock size={12} className="text-[#43D5ED]" />
                            <span>
                              {rMap.totalDurationMinutes} {lang === 'vi' ? 'phút' : 'min'}
                            </span>
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-extrabold text-[#F5FAFF]">
                          {rMap.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#C3D2DF] line-clamp-2">
                          {rMap.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span className="text-xs font-bold text-[#43D5ED] bg-[#15354A] border border-[#43D5ED]/20 px-3 py-1 rounded-xl">
                          {rMap.modules.length} {tArch.modules[lang]} • {totalLessons}{' '}
                          {tArch.lessons[lang]}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomRoadmap(e, rMap.id)}
                          className="p-2 text-[#93A8B8] hover:text-[#FF7777] rounded-xl transition-colors cursor-pointer"
                          title="Xóa lộ trình"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="text-[#93A8B8]">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 bg-[#061625]/60 space-y-6">
                        {/* Source Materials */}
                        {rMap.sourceMaterials && rMap.sourceMaterials.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-[#F5FAFF] uppercase tracking-wider block">
                              {tArch.sourceReferences[lang]}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {rMap.sourceMaterials.map((src, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#102B40] border border-[#82CDE1]/15 text-xs font-medium text-[#C3D2DF]"
                                >
                                  <FileText size={12} className="text-[#43D5ED]" />
                                  <span>{src.filename}</span>
                                  {src.pagesOrSections && (
                                    <span className="text-[#93A8B8]">({src.pagesOrSections})</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Modules & Lessons */}
                        <div className="space-y-4">
                          {rMap.modules.map((mod, mIdx) => (
                            <div
                              key={mod.id}
                              className="bg-[#102B40] rounded-2xl border border-[#82CDE1]/15 p-4 sm:p-5 space-y-3"
                            >
                              <div className="flex items-center gap-2 pb-2 border-b border-[#82CDE1]/15">
                                <div className="w-6 h-6 rounded-lg bg-[#15354A] border border-[#43D5ED]/40 text-[#43D5ED] font-black text-xs flex items-center justify-center">
                                  {mIdx + 1}
                                </div>
                                <h4 className="text-sm font-bold text-[#F5FAFF]">{mod.title}</h4>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                {mod.lessons.map((les, lIdx) => (
                                  <div
                                    key={les.id}
                                    className="p-3.5 rounded-xl border border-[#82CDE1]/15 hover:border-[#43D5ED]/40 transition-all flex flex-col justify-between gap-3 bg-[#061625]/80"
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between text-[11px] font-bold text-[#93A8B8]">
                                        <span>
                                          {lang === 'vi' ? 'Bài' : 'Lesson'} {mIdx + 1}.{lIdx + 1}
                                        </span>
                                        <span className="flex items-center gap-1 text-[#43D5ED]">
                                          <Clock size={11} />
                                          <span>
                                            {les.duration || 10} {lang === 'vi' ? 'phút' : 'min'}
                                          </span>
                                        </span>
                                      </div>
                                      <h5 className="text-xs sm:text-sm font-bold text-[#F5FAFF]">
                                        {les.title}
                                      </h5>
                                      <p className="text-[11px] text-[#C3D2DF] line-clamp-2">
                                        {les.situation}
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleStartCustomItem(rMap, les)}
                                      className="px-3.5 py-1.5 rounded-lg bg-[#43D5ED] text-[#061625] text-xs font-black self-end inline-flex items-center gap-1 cursor-pointer hover:bg-[#6BE0F5] transition-colors"
                                    >
                                      <span>{lang === 'vi' ? 'Vào học' : 'Start'}</span>
                                      <ArrowRight size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
