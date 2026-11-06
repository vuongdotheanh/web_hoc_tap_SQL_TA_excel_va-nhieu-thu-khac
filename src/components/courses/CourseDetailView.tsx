'use client';

import { useState, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Map,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Trash2,
  Edit2,
  Calendar,
  CheckSquare,
  Square,
  X,
  FileCheck,
  Target,
  ArrowRight,
  Play,
} from 'lucide-react';
import type { Course, CourseMaterial, CourseDetailTab } from '@/types/course';
import type { GeneratedRoadmap } from '@/types/architect';
import type { Lesson } from '@/types';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';
import { convertToLessonViewFormat } from '@/utils/roadmapStorage';
import AddCourseModal from './AddCourseModal';

interface CourseDetailViewProps {
  course: Course;
  materials: CourseMaterial[];
  roadmaps: GeneratedRoadmap[];
  onBack: () => void;
  onUpdateCourse: (updated: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onUploadMaterial: (files: File[]) => Promise<void>;
  onDeleteMaterial: (materialId: string) => void;
  onRetryExtractMaterial: (material: CourseMaterial) => Promise<void>;
  onGenerateRoadmapFromDocs: (course: Course, selectedMaterials: CourseMaterial[]) => void;
  onStartLesson: (lesson: Lesson) => void;
  lang: Lang;
}

const ALLOWED_EXTS = ['.pdf', '.docx', '.pptx', '.txt', '.md'];

export default function CourseDetailView({
  course,
  materials,
  roadmaps,
  onBack,
  onUpdateCourse,
  onDeleteCourse,
  onUploadMaterial,
  onDeleteMaterial,
  onRetryExtractMaterial,
  onGenerateRoadmapFromDocs,
  onStartLesson,
  lang,
}: CourseDetailViewProps) {
  const t = translations.courseDetail;
  const tc = translations.courses;

  const [activeTab, setActiveTab] = useState<CourseDetailTab>('overview');
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>(() =>
    materials.filter((m) => m.status === 'extracted').map((m) => m.id)
  );
  const [previewMaterial, setPreviewMaterial] = useState<CourseMaterial | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleDocSelection = (id: string) => {
    setSelectedMaterialIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllExtracted = () => {
    const extractedIds = materials.filter((m) => m.status === 'extracted').map((m) => m.id);
    setSelectedMaterialIds(extractedIds);
  };

  const clearSelection = () => {
    setSelectedMaterialIds([]);
  };

  const selectedMaterials = useMemo(
    () => materials.filter((m) => selectedMaterialIds.includes(m.id)),
    [materials, selectedMaterialIds]
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!ALLOWED_EXTS.includes(ext)) {
        setUploadError(
          lang === 'vi'
            ? `File "${file.name}" không thuộc định dạng được hỗ trợ (.pdf, .docx, .pptx, .txt, .md).`
            : `File "${file.name}" is not supported (.pdf, .docx, .pptx, .txt, .md).`
        );
        return;
      }
      validFiles.push(file);
    }

    setIsUploading(true);
    try {
      await onUploadMaterial(validFiles);
    } finally {
      setIsUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#82CDE1]/15">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#C3D2DF] hover:text-[#43D5ED] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{lang === 'vi' ? 'Quay lại danh sách môn học' : 'Back to courses'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 rounded-xl text-[#93A8B8] hover:text-[#43D5ED] hover:bg-[#15354A] transition-colors cursor-pointer"
            title={tc.editCourse[lang]}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              if (confirm(lang === 'vi' ? `Bạn có chắc muốn xoá môn học "${course.title}"?` : `Delete course "${course.title}"?`)) {
                onDeleteCourse(course.id);
                onBack();
              }
            }}
            className="p-2 rounded-xl text-[#93A8B8] hover:text-[#FF7777] hover:bg-[#15354A] transition-colors cursor-pointer"
            title={tc.deleteCourse[lang]}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* 2. Course Hero Banner with Cosmic Dark Glass */}
      <div className="rounded-3xl liquid-glass-card bg-[#102B40]/95 p-6 sm:p-8 border border-[#82CDE1]/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#43D5ED]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap mb-3">
              {course.code && (
                <span className="px-3 py-1 rounded-lg text-xs font-black bg-[#15354A] border border-[#43D5ED]/30 text-[#43D5ED]">
                  {course.code}
                </span>
              )}
              {course.academicTerm && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#061625]/80 text-[#C3D2DF] border border-[#82CDE1]/15 flex items-center gap-1">
                  <Calendar size={12} className="text-[#43D5ED]" />
                  {course.academicTerm}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#48C8A4] bg-[#48C8A4]/15 border border-[#48C8A4]/30">
                {materials.length} {tc.materialsCount[lang]}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5FAFF] tracking-tight">
              {course.title}
            </h1>

            {course.learningGoal && (
              <div className="mt-3 flex items-start gap-2.5 text-xs sm:text-sm text-[#C3D2DF] bg-[#061625]/80 border border-[#82CDE1]/20 rounded-xl p-3.5">
                <Target size={16} className="text-[#43D5ED] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F5FAFF]">{t.learningGoal[lang]}: </span>
                  <span>{course.learningGoal}</span>
                </div>
              </div>
            )}

            {course.description && (
              <p className="mt-2.5 text-xs sm:text-sm text-[#C3D2DF] leading-relaxed">
                {course.description}
              </p>
            )}
          </div>

          {/* Quick Action CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => onGenerateRoadmapFromDocs(course, selectedMaterials.length > 0 ? selectedMaterials : materials)}
              className="px-6 py-3.5 rounded-2xl bg-[#D9F66F] hover:bg-[#E6FFA1] text-[#061625] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,246,111,0.3)] transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles size={16} className="text-[#061625]" />
              <span>{t.generateRoadmap[lang]}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('documents');
                fileInputRef.current?.click();
              }}
              className="px-5 py-3 rounded-2xl bg-[#15354A] hover:bg-[#1E4661] text-[#F5FAFF] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-[#82CDE1]/25 transition-colors cursor-pointer"
            >
              <UploadCloud size={16} className="text-[#43D5ED]" />
              <span>{t.addMaterials[lang]}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-t border-[#82CDE1]/15 mt-6 pt-4 overflow-x-auto">
          {(
            [
              { id: 'overview', label: t.tabs.overview[lang], icon: BookOpen },
              { id: 'documents', label: `${t.tabs.documents[lang]} (${materials.length})`, icon: FileText },
              { id: 'roadmaps', label: `${t.tabs.roadmaps[lang]} (${roadmaps.length})`, icon: Map },
              { id: 'progress', label: t.tabs.progress[lang], icon: CheckCircle2 },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#43D5ED] text-[#061625] shadow-md font-extrabold'
                    : 'text-[#C3D2DF] hover:text-[#F5FAFF] hover:bg-[#15354A]/70'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── TAB 1: OVERVIEW ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 3 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl liquid-glass-card bg-[#102B40]/90 p-5 border border-[#82CDE1]/20">
              <span className="text-xs font-bold text-[#93A8B8] uppercase tracking-wider block mb-1">
                {tc.materialsCount[lang]}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#F5FAFF]">{materials.length}</span>
                <span className="text-xs text-[#93A8B8]">
                  ({materials.filter((m) => m.status === 'extracted').length} {lang === 'vi' ? 'sẵn sàng' : 'ready'})
                </span>
              </div>
            </div>

            <div className="rounded-3xl liquid-glass-card bg-[#102B40]/90 p-5 border border-[#82CDE1]/20">
              <span className="text-xs font-bold text-[#93A8B8] uppercase tracking-wider block mb-1">
                {tc.roadmapsCount[lang]}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#43D5ED]">{roadmaps.length}</span>
                <span className="text-xs text-[#93A8B8]">
                  {lang === 'vi' ? 'đã tạo từ AI' : 'AI generated'}
                </span>
              </div>
            </div>

            <div className="rounded-3xl liquid-glass-card bg-[#102B40]/90 p-5 border border-[#82CDE1]/20">
              <span className="text-xs font-bold text-[#93A8B8] uppercase tracking-wider block mb-1">
                {tc.progressLabel[lang]}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#48C8A4]">{course.progress}%</span>
                <span className="text-xs text-[#93A8B8]">
                  {lang === 'vi' ? 'mục tiêu hoàn thành' : 'overall mastery'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Roadmap Quick-start Banner */}
          <div className="rounded-3xl liquid-glass-card bg-gradient-to-r from-[#102B40] to-[#15354A] p-6 border border-[#43D5ED]/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="max-w-2xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#43D5ED] mb-1">
                <Sparkles size={14} />
                <span>{lang === 'vi' ? 'AI LEARNING ARCHITECT TÍCH HỢP' : 'INTEGRATED AI ARCHITECT'}</span>
              </div>
              <h3 className="text-lg font-black text-[#F5FAFF]">
                {lang === 'vi'
                  ? 'Tạo lộ trình ôn thi & học tập 10 phút từ slide của môn này'
                  : 'Generate a 10-minute microlearning roadmap from your slides'}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#C3D2DF] mt-1 font-normal">
                {lang === 'vi'
                  ? 'AI sẽ đọc tài liệu đã tải lên, phân tích các khái niệm chính và tạo chuỗi bài học gồm lý thuyết, trắc nghiệm và bài tập thực hành.'
                  : 'AI reads your materials, extracts core concepts, and constructs lessons with theory, quizzes, and practice exercises.'}
              </p>
            </div>
            <button
              onClick={() => onGenerateRoadmapFromDocs(course, selectedMaterials.length > 0 ? selectedMaterials : materials)}
              className="px-5 py-3 rounded-2xl bg-[#D9F66F] hover:bg-[#E6FFA1] text-[#061625] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,246,111,0.3)] transition-all shrink-0 cursor-pointer"
            >
              <Sparkles size={15} className="text-[#061625]" />
              <span>{t.generateRoadmap[lang]}</span>
            </button>
          </div>

          {/* Recent Materials & Active Roadmaps Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Materials */}
            <div className="rounded-3xl liquid-glass-card bg-[#102B40]/90 p-6 border border-[#82CDE1]/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#F5FAFF] flex items-center gap-2">
                  <FileText size={16} className="text-[#43D5ED]" />
                  <span>{t.tabs.documents[lang]}</span>
                </h3>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="text-xs font-bold text-[#43D5ED] hover:underline cursor-pointer"
                >
                  {translations.dashboard.exploreAll[lang]}
                </button>
              </div>

              {materials.length === 0 ? (
                <p className="text-xs text-[#93A8B8] py-4 text-center">{t.noDocsInCourse[lang]}</p>
              ) : (
                <div className="space-y-2.5">
                  {materials.slice(0, 3).map((mat) => (
                    <div
                      key={mat.id}
                      className="p-3 rounded-2xl bg-[#061625]/80 border border-[#82CDE1]/15 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileCheck size={16} className="text-[#43D5ED] shrink-0" />
                        <span className="font-bold text-[#F5FAFF] truncate max-w-[200px] sm:max-w-xs">
                          {mat.filename}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#93A8B8] shrink-0">{formatSize(mat.size)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Roadmaps */}
            <div className="rounded-3xl liquid-glass-card bg-[#102B40]/90 p-6 border border-[#82CDE1]/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#F5FAFF] flex items-center gap-2">
                  <Map size={16} className="text-[#48C8A4]" />
                  <span>{t.tabs.roadmaps[lang]}</span>
                </h3>
                <button
                  onClick={() => setActiveTab('roadmaps')}
                  className="text-xs font-bold text-[#48C8A4] hover:underline cursor-pointer"
                >
                  {translations.dashboard.exploreAll[lang]}
                </button>
              </div>

              {roadmaps.length === 0 ? (
                <p className="text-xs text-[#93A8B8] py-4 text-center">{t.noRoadmapsInCourse[lang]}</p>
              ) : (
                <div className="space-y-2.5">
                  {roadmaps.slice(0, 3).map((rm) => (
                    <div
                      key={rm.id}
                      className="p-3 rounded-2xl bg-[#061625]/80 border border-[#82CDE1]/15 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Sparkles size={15} className="text-[#43D5ED] shrink-0" />
                        <div>
                          <span className="font-bold text-[#F5FAFF] block truncate max-w-[220px]">
                            {rm.title}
                          </span>
                          <span className="text-[10px] text-[#93A8B8]">
                            {rm.modules.length} modules • {rm.totalDurationMinutes} {translations.dashboard.minutes[lang]}
                          </span>
                        </div>
                      </div>
                      {rm.modules[0]?.lessons[0] && (
                        <button
                          onClick={() => {
                            const l = convertToLessonViewFormat(rm.modules[0].lessons[0], rm.title);
                            onStartLesson(l);
                          }}
                          className="px-3 py-1.5 bg-[#43D5ED] text-[#061625] rounded-xl text-[11px] font-extrabold hover:bg-[#6BE0F5] transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          <Play size={10} fill="currentColor" />
                          <span>{lang === 'vi' ? 'Học' : 'Learn'}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: DOCUMENTS ─── */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          {/* Upload Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#43D5ED]/40 hover:border-[#43D5ED] rounded-3xl p-8 sm:p-10 text-center liquid-glass-card bg-[#102B40]/60 hover:bg-[#102B40]/90 cursor-pointer transition-all shadow-xl group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.pptx,.txt,.md"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            <div className="w-14 h-14 rounded-2xl bg-[#15354A] border border-[#43D5ED]/30 text-[#43D5ED] flex items-center justify-center mx-auto mb-3.5 group-hover:scale-110 transition-transform shadow-md">
              <UploadCloud size={28} />
            </div>

            <h3 className="text-base font-bold text-[#F5FAFF] mb-1">
              {t.uploadZoneTitle[lang]}
            </h3>
            <p className="text-xs sm:text-[13px] text-[#C3D2DF] max-w-md mx-auto">
              {t.uploadZoneSubtitle[lang]}
            </p>

            {isUploading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-[#43D5ED] animate-pulse">
                <RefreshCw size={14} className="animate-spin" />
                <span>{lang === 'vi' ? 'Đang trích xuất văn bản từ tài liệu...' : 'Extracting text from documents...'}</span>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="p-4 rounded-2xl bg-[#FF7777]/15 border border-[#FF7777]/30 flex items-center gap-3 text-xs text-[#FF7777]">
              <AlertCircle size={16} className="shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Selection action bar */}
          {materials.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl liquid-glass-pill bg-[#102B40]/90 border border-[#82CDE1]/20">
              <div className="flex items-center gap-3">
                <button
                  onClick={selectedMaterialIds.length === materials.length ? clearSelection : selectAllExtracted}
                  className="flex items-center gap-2 text-xs font-bold text-[#F5FAFF] hover:text-[#43D5ED] cursor-pointer"
                >
                  {selectedMaterialIds.length === materials.length ? (
                    <CheckSquare size={17} className="text-[#43D5ED]" />
                  ) : (
                    <Square size={17} className="text-[#93A8B8]" />
                  )}
                  <span>
                    {selectedMaterialIds.length > 0
                      ? `${lang === 'vi' ? 'Đã chọn' : 'Selected'} ${selectedMaterialIds.length}/${materials.length}`
                      : lang === 'vi' ? 'Chọn tất cả' : 'Select all'}
                  </span>
                </button>
              </div>

              {selectedMaterialIds.length > 0 && (
                <button
                  onClick={() => onGenerateRoadmapFromDocs(course, selectedMaterials)}
                  className="px-5 py-2.5 bg-[#D9F66F] hover:bg-[#E6FFA1] text-[#061625] rounded-xl text-xs font-black flex items-center gap-2 shadow-[0_0_15px_rgba(217,246,111,0.3)] transition-all cursor-pointer"
                >
                  <Sparkles size={14} className="text-[#061625]" />
                  <span>
                    {t.selectDocsToGenerate[lang].replace('{count}', String(selectedMaterialIds.length))}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Materials List */}
          {materials.length === 0 ? (
            <div className="text-center py-10 rounded-3xl liquid-glass-card bg-[#102B40]/60 text-[#93A8B8] text-xs">
              {t.noDocsInCourse[lang]}
            </div>
          ) : (
            <div className="space-y-3">
              {materials.map((mat) => {
                const isSelected = selectedMaterialIds.includes(mat.id);
                return (
                  <div
                    key={mat.id}
                    className={`p-4 sm:p-5 rounded-3xl liquid-glass-card bg-[#102B40]/95 border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected ? 'border-[#43D5ED] ring-1 ring-[#43D5ED]/40 bg-[#15354A]/90' : 'border-[#82CDE1]/20'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 overflow-hidden">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleDocSelection(mat.id)}
                        className="mt-1 text-[#93A8B8] hover:text-[#43D5ED] shrink-0 cursor-pointer"
                        aria-label="Select material"
                      >
                        {isSelected ? (
                          <CheckSquare size={18} className="text-[#43D5ED]" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>

                      {/* File Icon */}
                      <div className="w-10 h-10 rounded-xl bg-[#15354A] text-[#43D5ED] border border-[#43D5ED]/30 flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>

                      {/* Name & Metadata */}
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-[#F5FAFF] truncate max-w-sm sm:max-w-md">
                          {mat.filename}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-[#C3D2DF] mt-1 flex-wrap">
                          <span>{formatSize(mat.size)}</span>
                          <span>•</span>
                          <span className="uppercase font-semibold">{mat.type}</span>
                          {mat.characterCount && (
                            <>
                              <span>•</span>
                              <span>{mat.characterCount.toLocaleString()} {lang === 'vi' ? 'ký tự' : 'chars'}</span>
                            </>
                          )}
                          {mat.usedInRoadmap && (
                            <>
                              <span>•</span>
                              <span className="text-[#43D5ED] font-bold flex items-center gap-1">
                                <Sparkles size={11} /> {t.docUsedInRoadmap[lang]}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status badge & action buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {mat.status === 'extracted' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#6BE0A4]/15 border border-[#6BE0A4]/30 text-[#6BE0A4] flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          {t.statusExtracted[lang]}
                        </span>
                      )}
                      {mat.status === 'uploading' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#43D5ED]/15 border border-[#43D5ED]/30 text-[#43D5ED] flex items-center gap-1">
                          <RefreshCw size={13} className="animate-spin" />
                          {t.statusExtracting[lang]}
                        </span>
                      )}
                      {mat.status === 'error' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF7777]/15 border border-[#FF7777]/30 text-[#FF7777] flex items-center gap-1">
                          <AlertCircle size={13} />
                          {t.statusError[lang]}
                        </span>
                      )}

                      {/* Preview Button */}
                      {mat.extractedText && (
                        <button
                          onClick={() => setPreviewMaterial(mat)}
                          className="p-2 text-[#93A8B8] hover:text-[#43D5ED] rounded-xl hover:bg-[#15354A] transition-colors cursor-pointer"
                          title={t.previewExtractedText[lang]}
                        >
                          <Eye size={16} />
                        </button>
                      )}

                      {/* Retry Button */}
                      {mat.status === 'error' && (
                        <button
                          onClick={() => onRetryExtractMaterial(mat)}
                          className="p-2 text-[#93A8B8] hover:text-[#43D5ED] rounded-xl hover:bg-[#15354A] transition-colors cursor-pointer"
                          title={t.retryExtraction[lang]}
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          if (confirm(lang === 'vi' ? `Xoá tài liệu "${mat.filename}"?` : `Delete material "${mat.filename}"?`)) {
                            onDeleteMaterial(mat.id);
                          }
                        }}
                        className="p-2 text-[#93A8B8] hover:text-[#FF7777] rounded-xl hover:bg-[#15354A] transition-colors cursor-pointer"
                        title={t.deleteDoc[lang]}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: LEARNING PATHS (ROADMAPS) ─── */}
      {activeTab === 'roadmaps' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F5FAFF]">
              {t.tabs.roadmaps[lang]} ({roadmaps.length})
            </h3>
            <button
              onClick={() => onGenerateRoadmapFromDocs(course, selectedMaterials.length > 0 ? selectedMaterials : materials)}
              className="px-4 py-2 bg-[#D9F66F] hover:bg-[#E6FFA1] text-[#061625] rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(217,246,111,0.3)]"
            >
              <Sparkles size={14} className="text-[#061625]" />
              <span>{t.generateRoadmap[lang]}</span>
            </button>
          </div>

          {roadmaps.length === 0 ? (
            <div className="text-center py-12 rounded-3xl liquid-glass-card bg-[#102B40]/60 border border-[#82CDE1]/20">
              <div className="w-12 h-12 rounded-2xl bg-[#15354A] text-[#43D5ED] border border-[#43D5ED]/30 flex items-center justify-center mx-auto mb-3">
                <Map size={24} />
              </div>
              <p className="text-xs sm:text-sm text-[#C3D2DF] mb-4">{t.noRoadmapsInCourse[lang]}</p>
              <button
                onClick={() => onGenerateRoadmapFromDocs(course, selectedMaterials.length > 0 ? selectedMaterials : materials)}
                className="px-4 py-2 bg-[#43D5ED] text-[#061625] rounded-xl text-xs font-bold hover:bg-[#6BE0F5] transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles size={14} />
                <span>{t.generateRoadmap[lang]}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {roadmaps.map((rm) => (
                <div key={rm.id} className="p-6 rounded-3xl liquid-glass-card bg-[#102B40]/95 border border-[#82CDE1]/20 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-black text-[#F5FAFF]">{rm.title}</h4>
                      <p className="text-xs text-[#C3D2DF] mt-1">{rm.summary || ''}</p>
                    </div>
                  </div>

                  {/* Modules */}
                  <div className="border-t border-[#82CDE1]/15 pt-4 space-y-2">
                    <span className="text-xs font-bold text-[#F5FAFF] block">
                      {lang === 'vi' ? 'Các học phần trong lộ trình:' : 'Modules in this roadmap:'}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rm.modules.map((m, idx) => (
                        <div key={m.id} className="p-3.5 rounded-2xl bg-[#061625]/80 border border-[#82CDE1]/15">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-5 h-5 rounded-full bg-[#15354A] border border-[#43D5ED]/40 text-[#43D5ED] text-[10px] font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-[#F5FAFF] truncate">{m.title}</span>
                          </div>
                          <p className="text-[11px] text-[#C3D2DF] line-clamp-1">{m.description}</p>
                          <div className="mt-2 space-y-1">
                            {m.lessons.map((lesson) => (
                              <button
                                key={lesson.id}
                                onClick={() => {
                                  const l = convertToLessonViewFormat(lesson, rm.title);
                                  onStartLesson(l);
                                }}
                                className="w-full text-left p-2 rounded-xl hover:bg-[#15354A] text-xs text-[#C3D2DF] hover:text-[#43D5ED] font-medium flex items-center justify-between transition-colors group cursor-pointer"
                              >
                                <span className="truncate">{lesson.title}</span>
                                <ArrowRight size={13} className="text-[#43D5ED] opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 4: PROGRESS ─── */}
      {activeTab === 'progress' && (
        <div className="rounded-3xl liquid-glass-card bg-[#102B40]/95 p-6 sm:p-8 border border-[#82CDE1]/20 space-y-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-[#F5FAFF] mb-1">
              {lang === 'vi' ? 'Tiến độ học môn' : 'Course Progress'}: {course.title}
            </h3>
            <p className="text-xs text-[#C3D2DF]">
              {lang === 'vi'
                ? 'Theo dõi số bài học đã hoàn thành và năng lực đạt được qua các bài tự luận & trắc nghiệm.'
                : 'Track completed lessons and mastery across quizzes and open-ended exercises.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#061625]/80 border border-[#82CDE1]/15">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-[#C3D2DF]">{tc.progressLabel[lang]}</span>
              <span className="text-[#43D5ED] text-sm font-black">{course.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#15354A] overflow-hidden">
              <div
                className="h-full bg-[#43D5ED] rounded-full transition-all duration-700"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#061625]/80 border border-[#82CDE1]/15">
              <span className="text-xs text-[#93A8B8] font-bold block mb-1">
                {lang === 'vi' ? 'Tổng số bài học AI đã tạo' : 'Total AI Lessons Generated'}
              </span>
              <span className="text-2xl font-black text-[#F5FAFF]">
                {roadmaps.reduce((acc, r) => acc + r.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0), 0)}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#061625]/80 border border-[#82CDE1]/15">
              <span className="text-xs text-[#93A8B8] font-bold block mb-1">
                {lang === 'vi' ? 'Tài liệu đã số hoá' : 'Digitized Materials'}
              </span>
              <span className="text-2xl font-black text-[#48C8A4]">
                {materials.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Text Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl liquid-glass-card bg-[#0A1E32] p-6 sm:p-8 flex flex-col shadow-2xl border border-[#82CDE1]/30">
            <div className="flex items-center justify-between pb-4 border-b border-[#82CDE1]/15">
              <div>
                <h3 className="text-base font-bold text-[#F5FAFF] truncate max-w-md">
                  {previewMaterial.filename}
                </h3>
                <span className="text-xs text-[#43D5ED]">
                  {previewMaterial.characterCount?.toLocaleString()} {lang === 'vi' ? 'ký tự trích xuất thành công' : 'characters extracted'}
                </span>
              </div>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="p-1.5 text-[#93A8B8] hover:text-[#F5FAFF] rounded-lg hover:bg-[#15354A] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 p-4 rounded-2xl bg-[#061625] border border-[#82CDE1]/15 text-xs sm:text-sm font-mono text-[#C3D2DF] whitespace-pre-wrap leading-relaxed select-text">
              {previewMaterial.extractedText || previewMaterial.previewText || (lang === 'vi' ? 'Không có nội dung' : 'No text content')}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#82CDE1]/15">
              <button
                onClick={() => setPreviewMaterial(null)}
                className="px-5 py-2.5 bg-[#43D5ED] text-[#061625] text-xs font-black rounded-xl cursor-pointer"
              >
                {lang === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      <AddCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data) => {
          onUpdateCourse({ ...course, ...data });
        }}
        editingCourse={course}
        lang={lang}
      />
    </div>
  );
}
