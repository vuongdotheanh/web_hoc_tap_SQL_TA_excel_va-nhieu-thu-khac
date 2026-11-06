'use client';

import { useState } from 'react';
import { X, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import type { Course, CourseTheme } from '@/types/course';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'documentCount' | 'roadmapCount' | 'progress' | 'roadmapIds'>) => void;
  editingCourse?: Course | null;
  lang: Lang;
}

const THEME_OPTIONS: { id: CourseTheme; label: { vi: string; en: string }; bg: string; border: string; text: string }[] = [
  { id: 'emerald', label: { vi: 'Ngọc bích', en: 'Emerald' }, bg: 'bg-[#48C8A4]', border: 'border-[#48C8A4]', text: 'text-[#48C8A4]' },
  { id: 'teal', label: { vi: 'Xanh mòng két', en: 'Teal' }, bg: 'bg-[#43D5ED]', border: 'border-[#43D5ED]', text: 'text-[#43D5ED]' },
  { id: 'coral', label: { vi: 'San hô', en: 'Coral' }, bg: 'bg-[#FF7777]', border: 'border-[#FF7777]', text: 'text-[#FF7777]' },
  { id: 'lavender', label: { vi: 'Oải hương', en: 'Lavender' }, bg: 'bg-[#A78BFA]', border: 'border-[#A78BFA]', text: 'text-[#C4B5FD]' },
  { id: 'lime', label: { vi: 'Chanh non', en: 'Lime' }, bg: 'bg-[#D9F66F]', border: 'border-[#D9F66F]', text: 'text-[#D9F66F]' },
];

export default function AddCourseModal({
  isOpen,
  onClose,
  onSave,
  editingCourse,
  lang,
}: AddCourseModalProps) {
  const t = translations.courseDetail;
  const tc = translations.courses;

  const [title, setTitle] = useState(editingCourse?.title || '');
  const [code, setCode] = useState(editingCourse?.code || '');
  const [description, setDescription] = useState(editingCourse?.description || '');
  const [academicTerm, setAcademicTerm] = useState(editingCourse?.academicTerm || '');
  const [learningGoal, setLearningGoal] = useState(editingCourse?.learningGoal || '');
  const [colorTheme, setColorTheme] = useState<CourseTheme>(editingCourse?.colorTheme || 'teal');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(lang === 'vi' ? 'Vui lòng nhập tên môn học' : 'Please enter a course name');
      return;
    }

    onSave({
      title: title.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
      academicTerm: academicTerm.trim(),
      learningGoal: learningGoal.trim(),
      colorTheme,
      icon: 'BookOpen',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg rounded-3xl liquid-glass-card bg-[#0A1E32] p-6 sm:p-8 shadow-2xl relative border border-[#82CDE1]/30 max-h-[90vh] overflow-y-auto text-[#F5FAFF]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-course-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#82CDE1]/15">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#15354A] border border-[#43D5ED]/30 flex items-center justify-center text-[#43D5ED]">
              <BookOpen size={18} />
            </div>
            <div>
              <h2 id="modal-course-title" className="text-lg font-black text-[#F5FAFF]">
                {editingCourse
                  ? tc.editCourse[lang]
                  : tc.addCourse[lang]}
              </h2>
              <span className="text-xs text-[#93A8B8]">
                {lang === 'vi' ? 'Khởi tạo không gian học tập và tài liệu' : 'Create study workspace & materials'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#93A8B8] hover:text-[#F5FAFF] rounded-lg hover:bg-[#15354A] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-[#FF7777]/15 border border-[#FF7777]/30 flex items-center gap-2.5 text-xs text-[#FF7777]">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Name */}
          <div>
            <label className="block text-xs font-bold text-[#93A8B8] uppercase tracking-wider mb-1.5">
              {t.courseName[lang]} <span className="text-[#FF7777]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t.courseNamePlaceholder[lang]}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#061625] border border-[#82CDE1]/20 text-[#F5FAFF] placeholder:text-[#93A8B8] focus:border-[#43D5ED] focus:ring-1 focus:ring-[#43D5ED] transition-all outline-none"
            />
          </div>

          {/* Grid: Course Code & Term */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#93A8B8] uppercase tracking-wider mb-1.5">
                {t.courseCode[lang]}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t.courseCodePlaceholder[lang]}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#061625] border border-[#82CDE1]/20 text-[#F5FAFF] placeholder:text-[#93A8B8] focus:border-[#43D5ED] focus:ring-1 focus:ring-[#43D5ED] transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#93A8B8] uppercase tracking-wider mb-1.5">
                {tc.academicTerm[lang]}
              </label>
              <input
                type="text"
                value={academicTerm}
                onChange={(e) => setAcademicTerm(e.target.value)}
                placeholder={t.termPlaceholder[lang]}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#061625] border border-[#82CDE1]/20 text-[#F5FAFF] placeholder:text-[#93A8B8] focus:border-[#43D5ED] focus:ring-1 focus:ring-[#43D5ED] transition-all outline-none"
              />
            </div>
          </div>

          {/* Learning Goal */}
          <div>
            <label className="block text-xs font-bold text-[#93A8B8] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>{t.learningGoal[lang]}</span>
              <span className="text-[10px] text-[#43D5ED] font-normal flex items-center gap-0.5">
                <Sparkles size={11} /> {lang === 'vi' ? 'AI sẽ định hướng theo mục tiêu này' : 'AI aligns roadmaps to this'}
              </span>
            </label>
            <textarea
              rows={2}
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              placeholder={t.learningGoalPlaceholder[lang]}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#061625] border border-[#82CDE1]/20 text-[#F5FAFF] placeholder:text-[#93A8B8] focus:border-[#43D5ED] focus:ring-1 focus:ring-[#43D5ED] transition-all outline-none resize-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#93A8B8] uppercase tracking-wider mb-1.5">
              {translations.courseDetail.descriptionPlaceholder[lang].split('...')[0]}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.descriptionPlaceholder[lang]}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#061625] border border-[#82CDE1]/20 text-[#F5FAFF] placeholder:text-[#93A8B8] focus:border-[#43D5ED] focus:ring-1 focus:ring-[#43D5ED] transition-all outline-none resize-none"
            />
          </div>

          {/* Color Theme Selector */}
          <div>
            <label className="block text-xs font-bold text-[#93A8B8] uppercase tracking-wider mb-2">
              {lang === 'vi' ? 'Màu chủ đề môn học' : 'Theme Color'}
            </label>
            <div className="flex items-center gap-3">
              {THEME_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setColorTheme(opt.id)}
                  className={`w-7 h-7 rounded-full ${opt.bg} transition-transform flex items-center justify-center cursor-pointer ${
                    colorTheme === opt.id
                      ? 'ring-2 ring-offset-2 ring-offset-[#0A1E32] ring-[#43D5ED] scale-110'
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={opt.label[lang]}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#82CDE1]/15 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#C3D2DF] hover:text-[#F5FAFF] rounded-xl hover:bg-[#15354A] transition-colors cursor-pointer"
            >
              {t.cancel[lang]}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-black text-[#061625] bg-[#43D5ED] hover:bg-[#6BE0F5] rounded-xl shadow-[0_0_15px_rgba(67,213,237,0.3)] transition-all cursor-pointer"
            >
              {t.saveCourse[lang]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
