'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  FileText,
  Map,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  Trash2,
  Edit2,
} from 'lucide-react';
import type { Course } from '@/types/course';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';
import AddCourseModal from './AddCourseModal';

interface CourseLibraryViewProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onAddCourse: (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'documentCount' | 'roadmapCount' | 'progress' | 'roadmapIds'>) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onQuickGenerateRoadmap: (course: Course) => void;
  lang: Lang;
}

export default function CourseLibraryView({
  courses,
  onSelectCourse,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onQuickGenerateRoadmap,
  lang,
}: CourseLibraryViewProps) {
  const tc = translations.courses;
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [courses, searchQuery]);

  // Color theme helpers
  const getThemeStyles = (theme: Course['colorTheme']) => {
    switch (theme) {
      case 'emerald':
        return {
          pill: 'bg-[#48C8A4]/15 text-[#48C8A4] border-[#48C8A4]/30',
          accent: 'bg-[#48C8A4]',
          progress: 'bg-[#48C8A4]',
        };
      case 'teal':
        return {
          pill: 'bg-[#43D5ED]/15 text-[#43D5ED] border-[#43D5ED]/30',
          accent: 'bg-[#43D5ED]',
          progress: 'bg-[#43D5ED]',
        };
      case 'coral':
        return {
          pill: 'bg-[#FF7777]/15 text-[#FF7777] border-[#FF7777]/30',
          accent: 'bg-[#FF7777]',
          progress: 'bg-[#FF7777]',
        };
      case 'lavender':
        return {
          pill: 'bg-[#A78BFA]/15 text-[#C4B5FD] border-[#A78BFA]/30',
          accent: 'bg-[#A78BFA]',
          progress: 'bg-[#A78BFA]',
        };
      case 'lime':
        return {
          pill: 'bg-[#D9F66F]/15 text-[#D9F66F] border-[#D9F66F]/30',
          accent: 'bg-[#D9F66F]',
          progress: 'bg-[#D9F66F]',
        };
      default:
        return {
          pill: 'bg-[#43D5ED]/15 text-[#43D5ED] border-[#43D5ED]/30',
          accent: 'bg-[#43D5ED]',
          progress: 'bg-[#43D5ED]',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#82CDE1]/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="label-micro text-[#43D5ED] bg-[#15354A] px-2.5 py-0.5 rounded-full font-bold border border-[#43D5ED]/20">
              {lang === 'vi' ? 'QUẢN LÝ HỌC TẬP' : 'ACADEMIC PORTAL'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5FAFF] tracking-tight">
            {tc.title[lang]}
          </h1>
          <p className="text-xs sm:text-sm text-[#C3D2DF] mt-0.5">
            {tc.subtitle[lang]}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCourse(null);
            setIsModalOpen(true);
          }}
          className="self-start md:self-auto px-4 py-2.5 bg-[#43D5ED] hover:bg-[#6BE0F5] text-[#061625] rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(67,213,237,0.3)] transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>{tc.addCourse[lang]}</span>
        </button>
      </div>

      {/* Control Bar: Search & View Modes */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input with dark cosmic styling */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#93A8B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tc.searchPlaceholder[lang]}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl liquid-glass-pill bg-[#102B40]/90 border border-[#82CDE1]/20 text-[#F5FAFF] placeholder:text-[#93A8B8] focus:border-[#43D5ED] focus:ring-2 focus:ring-[#43D5ED]/20 transition-all outline-none"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-[#93A8B8] font-medium mr-1">
            {filteredCourses.length} {lang === 'vi' ? 'môn học' : 'courses'}
          </span>
          <div className="flex items-center p-1 rounded-xl bg-[#102B40]/90 border border-[#82CDE1]/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#43D5ED] text-[#061625]' : 'text-[#93A8B8] hover:text-[#F5FAFF]'
              }`}
              aria-label="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#43D5ED] text-[#061625]' : 'text-[#93A8B8] hover:text-[#F5FAFF]'
              }`}
              aria-label="List View"
            >
              <ListIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Course List / Grid */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-3xl liquid-glass-card bg-[#102B40]/90 border border-[#82CDE1]/20 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#15354A] text-[#43D5ED] border border-[#43D5ED]/30 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={28} />
          </div>
          <h3 className="text-lg font-bold text-[#F5FAFF] mb-1">
            {searchQuery ? (lang === 'vi' ? 'Không tìm thấy môn học phù hợp' : 'No matching courses found') : tc.emptyTitle[lang]}
          </h3>
          <p className="text-xs sm:text-sm text-[#C3D2DF] mb-6 leading-relaxed">
            {searchQuery ? (lang === 'vi' ? 'Hãy thử tìm bằng từ khoá khác hoặc tạo môn học mới.' : 'Try a different keyword or create a new course.') : tc.emptyDesc[lang]}
          </p>
          <button
            onClick={() => {
              setEditingCourse(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#43D5ED] text-[#061625] rounded-xl text-xs sm:text-sm font-extrabold hover:bg-[#6BE0F5] transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>{tc.addCourse[lang]}</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const styles = getThemeStyles(course.colorTheme);
            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className="group relative rounded-3xl liquid-glass-card bg-[#102B40]/95 p-6 border border-[#82CDE1]/20 shadow-xl hover:shadow-2xl hover:border-[#43D5ED]/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Code & Actions */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${styles.pill}`}>
                      {course.code || 'COURSE'}
                    </span>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCourse(course);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-[#93A8B8] hover:text-[#43D5ED] hover:bg-[#15354A] transition-colors"
                        title={tc.editCourse[lang]}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(lang === 'vi' ? `Bạn có chắc muốn xoá môn học "${course.title}"?` : `Are you sure you want to delete "${course.title}"?`)) {
                            onDeleteCourse(course.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-[#93A8B8] hover:text-[#FF7777] hover:bg-[#15354A] transition-colors"
                        title={tc.deleteCourse[lang]}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Goal */}
                  <h3 className="text-lg font-extrabold text-[#F5FAFF] group-hover:text-[#43D5ED] transition-colors leading-snug mb-2">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#C3D2DF] line-clamp-2 leading-relaxed mb-4">
                    {course.learningGoal || course.description || (lang === 'vi' ? 'Không gian môn học' : 'Course workspace')}
                  </p>

                  {/* Stats pills */}
                  <div className="flex items-center gap-2 text-xs text-[#C3D2DF] mb-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#061625]/80 border border-[#82CDE1]/15">
                      <FileText size={12} className="text-[#43D5ED]" />
                      <span className="font-extrabold text-[#F5FAFF]">{course.documentCount}</span>
                      <span className="text-[#93A8B8]">{tc.materialsCount[lang]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#061625]/80 border border-[#82CDE1]/15">
                      <Map size={12} className="text-[#48C8A4]" />
                      <span className="font-extrabold text-[#F5FAFF]">{course.roadmapCount}</span>
                      <span className="text-[#93A8B8]">{tc.roadmapsCount[lang]}</span>
                    </div>
                  </div>
                </div>

                {/* Progress & footer */}
                <div className="pt-3.5 border-t border-[#82CDE1]/15">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#93A8B8] mb-1.5">
                    <span>{tc.progressLabel[lang]}</span>
                    <span className="font-black text-[#F5FAFF]">{course.progress}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-[#061625] overflow-hidden mb-3 border border-[#82CDE1]/10">
                    <div
                      className={`h-full rounded-full ${styles.progress}`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-[#43D5ED] group-hover:text-[#8AE9F0] transition-colors pt-1">
                    <span className="flex items-center gap-1.5">
                      <span>{lang === 'vi' ? 'Chi tiết môn học' : 'Course details'}</span>
                      <ArrowRight size={13} />
                    </span>

                    {course.documentCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickGenerateRoadmap(course);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#15354A] hover:bg-[#43D5ED] hover:text-[#061625] text-[#43D5ED] font-bold text-[11px] flex items-center gap-1 transition-colors"
                        title={lang === 'vi' ? 'Tạo lộ trình AI ngay' : 'Build AI roadmap'}
                      >
                        <Sparkles size={11} />
                        <span>AI</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-3xl liquid-glass-card bg-[#102B40]/95 border border-[#82CDE1]/20 divide-y divide-[#82CDE1]/15 overflow-hidden shadow-xl">
          {filteredCourses.map((course) => {
            const styles = getThemeStyles(course.colorTheme);
            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className="p-4 sm:p-5 hover:bg-[#15354A]/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${styles.pill} shrink-0`}>
                    {course.code || 'COURSE'}
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#F5FAFF] group-hover:text-[#43D5ED]">
                      {course.title}
                    </h4>
                    <p className="text-xs text-[#C3D2DF] line-clamp-1 mt-0.5">
                      {course.learningGoal || course.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#F5FAFF]">
                      {course.documentCount} {tc.materialsCount[lang]} • {course.roadmapCount} {tc.roadmapsCount[lang]}
                    </div>
                    <div className="text-[11px] text-[#43D5ED] font-black">
                      {course.progress}% {lang === 'vi' ? 'hoàn thành' : 'complete'}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-[#93A8B8]" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <AddCourseModal
          isOpen={isModalOpen}
          editingCourse={editingCourse}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCourse(null);
          }}
          onSave={(data) => {
            if (editingCourse) {
              onEditCourse({ ...editingCourse, ...data });
            } else {
              onAddCourse(data);
            }
            setIsModalOpen(false);
            setEditingCourse(null);
          }}
          lang={lang}
        />
      )}
    </div>
  );
}
