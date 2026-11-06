'use client';

import { FileText, Map, ArrowRight, Plus, FolderOpen, Clock } from 'lucide-react';
import type { Course } from '@/types/course';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface MyCoursesSectionProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onOpenAllCourses: () => void;
  onAddCourse: () => void;
  lang: Lang;
}

export default function MyCoursesSection({
  courses,
  onSelectCourse,
  onOpenAllCourses,
  onAddCourse,
  lang,
}: MyCoursesSectionProps) {
  const tc = translations.courses;

  const getThemeAura = (theme: Course['colorTheme']) => {
    switch (theme) {
      case 'emerald':
        return {
          pill: 'bg-[#48C8A4]/15 text-[#48C8A4] border-[#48C8A4]/30',
          glow: 'from-[#48C8A4]/15 via-transparent to-transparent',
          bar: 'bg-[#48C8A4]',
          accent: 'text-[#48C8A4]',
        };
      case 'teal':
        return {
          pill: 'bg-[#43D5ED]/15 text-[#43D5ED] border-[#43D5ED]/30',
          glow: 'from-[#43D5ED]/15 via-transparent to-transparent',
          bar: 'bg-[#43D5ED]',
          accent: 'text-[#43D5ED]',
        };
      case 'coral':
        return {
          pill: 'bg-[#FF7777]/15 text-[#FF7777] border-[#FF7777]/30',
          glow: 'from-[#FF7777]/15 via-transparent to-transparent',
          bar: 'bg-[#FF7777]',
          accent: 'text-[#FF7777]',
        };
      case 'lavender':
        return {
          pill: 'bg-[#A78BFA]/15 text-[#C4B5FD] border-[#A78BFA]/30',
          glow: 'from-[#A78BFA]/15 via-transparent to-transparent',
          bar: 'bg-[#A78BFA]',
          accent: 'text-[#C4B5FD]',
        };
      case 'lime':
        return {
          pill: 'bg-[#D9F66F]/15 text-[#D9F66F] border-[#D9F66F]/30',
          glow: 'from-[#D9F66F]/15 via-transparent to-transparent',
          bar: 'bg-[#D9F66F]',
          accent: 'text-[#D9F66F]',
        };
      default:
        return {
          pill: 'bg-[#43D5ED]/15 text-[#43D5ED] border-[#43D5ED]/30',
          glow: 'from-[#43D5ED]/15 via-transparent to-transparent',
          bar: 'bg-[#43D5ED]',
          accent: 'text-[#43D5ED]',
        };
    }
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="label-micro text-[#43D5ED] bg-[#15354A] px-3 py-1 rounded-full font-bold border border-[#43D5ED]/20">
              {lang === 'vi' ? 'HỌC PHẦN ĐẠI HỌC CỦA BẠN' : 'YOUR ACADEMIC COURSES'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F5FAFF] tracking-tight">
            {tc.title[lang]}
          </h2>
          <p className="text-xs sm:text-sm text-[#C3D2DF] mt-0.5">
            {tc.subtitle[lang]}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={onAddCourse}
            className="px-4 py-2.5 rounded-xl bg-[#43D5ED] hover:bg-[#6BE0F5] text-[#061625] text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-[0_0_15px_rgba(67,213,237,0.3)] transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>{tc.addCourse[lang]}</span>
          </button>
          <button
            onClick={onOpenAllCourses}
            className="px-3.5 py-2.5 rounded-xl liquid-glass-pill hover:border-[#43D5ED]/40 text-xs sm:text-sm font-bold text-[#F5FAFF] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{translations.dashboard.exploreAll[lang]}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Course Grid: Dark elevated glass cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => {
          const theme = getThemeAura(course.colorTheme);
          return (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className="group relative rounded-3xl liquid-glass-card bg-[#102B40]/95 p-6 border border-[#82CDE1]/20 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-[#43D5ED]/50 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Soft decorative background tint */}
              <div
                className={`absolute top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-br ${theme.glow} blur-2xl pointer-events-none -z-10`}
              />

              <div>
                {/* Header row: Course Code & Term */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${theme.pill}`}>
                    {course.code || 'COURSE'}
                  </span>
                  <span className="text-xs font-medium text-[#93A8B8] flex items-center gap-1">
                    <Clock size={12} className="text-[#93A8B8]" />
                    {course.academicTerm || (lang === 'vi' ? 'Học kỳ 1' : 'Term 1')}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="text-lg font-extrabold text-[#F5FAFF] group-hover:text-[#43D5ED] transition-colors leading-snug mb-2">
                  {course.title}
                </h3>

                {/* Description or Learning Goal */}
                <p className="text-xs sm:text-[13px] text-[#C3D2DF] line-clamp-2 leading-relaxed mb-4 font-normal">
                  {course.learningGoal || course.description || (lang === 'vi' ? 'Không gian quản lý tài liệu và bài học.' : 'Workspace for materials & roadmaps.')}
                </p>

                {/* Metadata Badges */}
                <div className="flex items-center gap-2.5 text-xs text-[#C3D2DF] mb-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#061625]/80 border border-[#82CDE1]/15">
                    <FileText size={13} className={theme.accent} />
                    <span className="font-extrabold text-[#F5FAFF]">{course.documentCount}</span>
                    <span className="text-[#93A8B8]">{tc.materialsCount[lang]}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#061625]/80 border border-[#82CDE1]/15">
                    <Map size={13} className="text-[#43D5ED]" />
                    <span className="font-extrabold text-[#F5FAFF]">{course.roadmapCount}</span>
                    <span className="text-[#93A8B8]">{tc.roadmapsCount[lang]}</span>
                  </div>
                </div>
              </div>

              {/* Progress & Quick Entry Footer */}
              <div className="pt-3.5 border-t border-[#82CDE1]/15 mt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[#93A8B8] mb-1.5">
                  <span>{tc.progressLabel[lang]}</span>
                  <span className="font-black text-[#F5FAFF]">{course.progress}%</span>
                </div>

                <div className="h-2 rounded-full bg-[#061625] overflow-hidden mb-3.5 border border-[#82CDE1]/10">
                  <div
                    className={`h-full rounded-full ${theme.bar} transition-all duration-500`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#43D5ED] group-hover:text-[#8AE9F0] transition-colors">
                  <span className="flex items-center gap-1.5">
                    <FolderOpen size={14} />
                    {lang === 'vi' ? 'Mở môn học' : 'Open Course'}
                  </span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Distinctive "+ Thêm môn học" Action Card */}
        <div
          onClick={onAddCourse}
          className="rounded-3xl border-2 border-dashed border-[#43D5ED]/35 hover:border-[#43D5ED] p-6 flex flex-col items-center justify-center text-center cursor-pointer liquid-glass-card bg-[#102B40]/60 hover:bg-[#102B40]/90 hover:shadow-2xl transition-all duration-300 group min-h-[220px]"
        >
          <div className="w-13 h-13 rounded-2xl bg-[#15354A] text-[#43D5ED] border border-[#43D5ED]/30 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-[#43D5ED] transition-transform shadow-md">
            <Plus size={24} strokeWidth={2.5} />
          </div>
          <h4 className="text-base font-extrabold text-[#F5FAFF] group-hover:text-[#43D5ED] transition-colors">
            {tc.addCourse[lang]}
          </h4>
          <p className="text-xs sm:text-[13px] text-[#C3D2DF] max-w-[220px] mt-1.5 leading-relaxed">
            {lang === 'vi'
              ? 'Tải slide, giáo trình và để AI tạo lộ trình riêng cho bạn.'
              : 'Upload slides, syllabus and let AI construct your path.'}
          </p>
        </div>
      </div>
    </section>
  );
}
