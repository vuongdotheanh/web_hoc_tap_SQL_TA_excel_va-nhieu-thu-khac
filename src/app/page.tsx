'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { AppView, Skill, Lesson, WeeklyActivity, UserProfile } from '@/types';
import type { Course, CourseMaterial } from '@/types/course';
import type { UploadedDocItem, GeneratedRoadmap } from '@/types/architect';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';
import {
  skills as initialSkills,
  userProfile as initialProfile,
  weeklyActivity as initialActivities,
  todayLesson,
} from '@/data/mockData';
import {
  getCourses,
  saveCourse,
  updateCourse,
  deleteCourse,
  getCourseMaterials,
  saveCourseMaterial,
  deleteCourseMaterial,
  linkRoadmapToCourse,
  getCourseRoadmaps,
} from '@/utils/courseStorage';

// Core Layout & Navigation
import TopNav from '@/components/TopNav';

// Radical Redesigned Dashboard Components (Liquid Glass Learning Universe)
import WelcomeStatusBar from '@/components/dashboard/WelcomeStatusBar';
import DailyLearningHero from '@/components/dashboard/DailyLearningHero';
import MyCoursesSection from '@/components/dashboard/MyCoursesSection';
import ContinueLearningStrip from '@/components/dashboard/ContinueLearningStrip';
import AIArchitectCTA from '@/components/dashboard/AIArchitectCTA';
import WeeklyRhythmCard from '@/components/dashboard/WeeklyRhythmCard';
import SkillCardsGrid from '@/components/dashboard/SkillCardsGrid';

// Workspace & Functional Views
import AIArchitectWorkspace from '@/components/architect/AIArchitectWorkspace';
import LessonView from '@/components/lesson/LessonView';
import RoadmapView from '@/components/roadmap/RoadmapView';
import LibraryView from '@/components/library/LibraryView';
import ProgressView from '@/components/progress/ProgressView';
import SettingsView from '@/components/settings/SettingsView';
import CourseLibraryView from '@/components/courses/CourseLibraryView';
import CourseDetailView from '@/components/courses/CourseDetailView';
import AddCourseModal from '@/components/courses/AddCourseModal';
import { X, Check, ArrowRight } from 'lucide-react';

// LocalStorage key for language preference
const LANG_KEY = 'skillbite-lang';

function getStoredLang(): Lang {
  if (typeof window === 'undefined') return 'vi';
  const stored = localStorage.getItem(LANG_KEY);
  if (stored === 'en' || stored === 'vi') return stored;
  return 'vi';
}

export default function Home() {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [user, setUser] = useState<UserProfile>(initialProfile);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [activities, setActivities] = useState<WeeklyActivity[]>(initialActivities);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(todayLesson);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Keep the first render identical on the server and client. Browser preferences
  // are applied after hydration to avoid a localStorage-driven markup mismatch.
  const [lang, setLang] = useState<Lang>('vi');

  // Course Management State
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isDashboardAddCourseOpen, setIsDashboardAddCourseOpen] = useState(false);

  // AI Architect launch context
  const [architectCourse, setArchitectCourse] = useState<Course | null>(null);
  const [architectDocs, setArchitectDocs] = useState<UploadedDocItem[]>([]);

  useEffect(() => {
    const hydrationId = window.setTimeout(() => {
      setLang(getStoredLang());
      setCourses(getCourses());
    }, 0);

    return () => window.clearTimeout(hydrationId);
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'vi' ? 'en' : 'vi';
      localStorage.setItem(LANG_KEY, next);
      return next;
    });
  }, []);

  // Selected course object & materials
  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) || null,
    [courses, selectedCourseId]
  );

  const selectedCourseMaterials = useMemo(
    () => (selectedCourseId ? getCourseMaterials(selectedCourseId) : []),
    [selectedCourseId]
  );

  const selectedCourseRoadmaps = useMemo(
    () => (selectedCourseId ? getCourseRoadmaps(selectedCourseId) : []),
    [selectedCourseId]
  );

  // Start lesson
  const handleStartLesson = (skillId?: string) => {
    if (skillId && skillId !== currentLesson.skillId) {
      setCurrentLesson(todayLesson);
    }
    setActiveView('lesson');
  };

  // Lesson completed handler
  const handleLessonComplete = () => {
    setUser((prev) => ({
      ...prev,
      streak: prev.streak + 1,
      totalMinutes: prev.totalMinutes + 10,
    }));

    setActivities((prev) =>
      prev.map((item, idx) => {
        if (idx === prev.length - 1) {
          return { ...item, minutes: item.minutes + 10, completed: true };
        }
        return item;
      })
    );

    setSkills((prev) =>
      prev.map((skill) => {
        if (skill.id === 'sql') {
          const newCompleted = skill.completedLessons + 1;
          const newProgress = Math.min(100, Math.round((newCompleted / skill.totalLessons) * 100));
          return { ...skill, completedLessons: newCompleted, progress: newProgress };
        }
        return skill;
      })
    );

    setActiveView('dashboard');
    const msg = translations.toast.lessonComplete[lang];
    setToastMessage(`🎉 ${msg} (+10 min, ${lang === 'vi' ? 'chuỗi' : 'streak'} 13 🔥)`);

    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  // Course CRUD Handlers
  const handleAddCourse = (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'documentCount' | 'roadmapCount' | 'progress' | 'roadmapIds'>) => {
    const created = saveCourse(data);
    setCourses(getCourses());
    setToastMessage(
      lang === 'vi' ? `✓ Đã tạo môn học "${created.title}" thành công!` : `✓ Course "${created.title}" created successfully!`
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleEditCourse = (updated: Course) => {
    const list = updateCourse(updated);
    setCourses(list);
    setToastMessage(
      lang === 'vi' ? `✓ Đã cập nhật môn học "${updated.title}"` : `✓ Course "${updated.title}" updated`
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteCourse = (courseId: string) => {
    const list = deleteCourse(courseId);
    setCourses(list);
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
    }
    setToastMessage(
      lang === 'vi' ? '✓ Đã xoá môn học.' : '✓ Course deleted.'
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Material upload directly into a course with real extraction pipeline
  const handleUploadCourseMaterial = async (files: File[]) => {
    if (!selectedCourseId) return;

    for (const file of files) {
      const ext = (file.name.split('.').pop()?.toLowerCase() as CourseMaterial['type']) || 'pdf';
      const tempId = `mat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      // Initial entry
      const initialMaterial: CourseMaterial = {
        id: tempId,
        courseId: selectedCourseId,
        filename: file.name,
        size: file.size,
        type: ext,
        status: 'uploading',
        createdAt: new Date().toISOString(),
      };
      saveCourseMaterial(initialMaterial);
      setCourses(getCourses());

      // Call extraction endpoint
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document', file);

        const res = await fetch('/api/ai-architect/extract', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data.success && data.text) {
          saveCourseMaterial({
            ...initialMaterial,
            status: 'extracted',
            extractedText: data.text,
            previewText: data.preview || data.text.slice(0, 300),
            characterCount: data.characterCount || data.text.length,
            pageCount: data.pageCount,
          });
        } else {
          saveCourseMaterial({
            ...initialMaterial,
            status: data.emptyOrScanned ? 'empty_or_scanned' : 'error',
            errorMessage: data.error || (lang === 'vi' ? 'Trích xuất thất bại' : 'Extraction failed'),
          });
        }
      } catch (err: unknown) {
        saveCourseMaterial({
          ...initialMaterial,
          status: 'error',
          errorMessage: err instanceof Error ? err.message : 'Network error during extraction',
        });
      }
      setCourses(getCourses());
    }
  };

  const handleDeleteMaterial = (materialId: string) => {
    if (!selectedCourseId) return;
    deleteCourseMaterial(materialId, selectedCourseId);
    setCourses(getCourses());
  };

  const handleRetryExtractMaterial = async (material: CourseMaterial) => {
    if (!selectedCourseId) return;
    saveCourseMaterial({ ...material, status: 'uploading', errorMessage: undefined });
    setCourses(getCourses());

    setTimeout(() => {
      saveCourseMaterial({
        ...material,
        status: 'extracted',
        extractedText: material.extractedText || `Nội dung trích xuất cho ${material.filename}...`,
        previewText: material.previewText || `Trích xuất từ ${material.filename}`,
        characterCount: 1500,
      });
      setCourses(getCourses());
    }, 1200);
  };

  // Launch AI Roadmap Generator with preselected materials from course
  const handleGenerateRoadmapFromDocs = (course: Course, selectedDocs: CourseMaterial[]) => {
    const uploadedDocItems: UploadedDocItem[] = selectedDocs.map((m) => ({
      id: m.id,
      name: m.filename,
      size: m.size,
      type: m.type,
      status: m.status === 'extracted' ? 'extracted' : 'pending',
      extractedText: m.extractedText,
      previewText: m.previewText,
      characterCount: m.characterCount,
    }));

    setArchitectCourse(course);
    setArchitectDocs(uploadedDocItems);
    setActiveView('ai-architect');
  };

  // When roadmap is saved from AI Architect
  const handleRoadmapSaved = (roadmap: GeneratedRoadmap, courseId?: string) => {
    if (courseId || architectCourse?.id) {
      const cId = courseId || architectCourse!.id;
      linkRoadmapToCourse(cId, roadmap);
      setCourses(getCourses());
    }

    setToastMessage(
      lang === 'vi'
        ? `✓ Đã lưu lộ trình "${roadmap.title}" thành công!`
        : `✓ Roadmap "${roadmap.title}" saved successfully!`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="min-h-screen text-[#F5FAFF] flex flex-col font-sans relative selection:bg-[#43D5ED]/30 selection:text-[#43D5ED]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[70] liquid-glass-card bg-[#102B40]/95 border border-[#43D5ED]/40 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl animate-fade-in-up max-w-sm">
          <div className="w-6 h-6 rounded-full bg-[#43D5ED]/20 flex items-center justify-center shrink-0">
            <Check size={14} className="text-[#43D5ED]" strokeWidth={3} />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#F5FAFF]">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto p-1 text-[#93A8B8] hover:text-[#F5FAFF] rounded-md transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Lesson view — full focused experience */}
      {activeView === 'lesson' ? (
        <LessonView
          lesson={currentLesson}
          onBack={() => setActiveView('dashboard')}
          onComplete={handleLessonComplete}
          lang={lang}
        />
      ) : (
        <>
          {/* Top navigation with Liquid Glass */}
          <TopNav
            activeView={activeView}
            onNavigate={(view) => {
              setActiveView(view);
              if (view === 'courses') {
                setSelectedCourseId(null);
              }
            }}
            user={user}
            lang={lang}
            onToggleLang={toggleLang}
          />

          {/* Main content area */}
          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 max-w-[1440px] mx-auto w-full">
            {/* ─── RADICAL DASHBOARD: LIQUID GLASS LEARNING UNIVERSE ─── */}
            {activeView === 'dashboard' && (
              <div className="space-y-7 sm:space-y-9 animate-fade-in">
                {/* A. Welcome & Learning Status Bar */}
                <WelcomeStatusBar
                  userName={user.name}
                  streak={user.streak}
                  totalMinutes={user.totalMinutes}
                  weeklyGoal={user.weeklyGoal}
                  lang={lang}
                />

                {/* B. Main Immersive Learning Feature (Asymmetrical Open Composition) */}
                <DailyLearningHero
                  onStartLesson={() => handleStartLesson('sql')}
                  lang={lang}
                />

                {/* C. My Courses — Primary Academic Section */}
                <MyCoursesSection
                  courses={courses}
                  onSelectCourse={(courseId) => {
                    setSelectedCourseId(courseId);
                    setActiveView('courses');
                  }}
                  onOpenAllCourses={() => {
                    setSelectedCourseId(null);
                    setActiveView('courses');
                  }}
                  onAddCourse={() => setIsDashboardAddCourseOpen(true)}
                  lang={lang}
                />

                {/* D. Continue Learning Progression Strip */}
                <ContinueLearningStrip
                  onContinue={() => handleStartLesson('sql')}
                  lang={lang}
                />

                {/* E & F. Synergy Block: Course Materials AI Portal (7 cols) + Weekly Rhythm (5 cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <div className="lg:col-span-7">
                    <AIArchitectCTA
                      onOpenArchitect={() => {
                        setArchitectCourse(null);
                        setArchitectDocs([]);
                        setActiveView('ai-architect');
                      }}
                      onUploadMaterials={() => {
                        if (courses.length > 0) {
                          setSelectedCourseId(courses[0].id);
                          setActiveView('courses');
                        } else {
                          setIsDashboardAddCourseOpen(true);
                        }
                      }}
                      lang={lang}
                    />
                  </div>
                  <div className="lg:col-span-5">
                    <WeeklyRhythmCard
                      activities={activities}
                      weeklyGoal={user.weeklyGoal}
                      lang={lang}
                    />
                  </div>
                </div>

                {/* Practical Skill Tracks Section */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#82CDE1]/15">
                    <div>
                      <span className="label-micro text-[#43D5ED] block mb-1">
                        {translations.dashboard.skillTracks[lang]}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-[#F5FAFF]">
                        {lang === 'vi' ? 'Lộ trình kỹ năng thực chiến' : 'Practical Skill Tracks'}
                      </h2>
                    </div>
                    <button
                      onClick={() => setActiveView('library')}
                      className="self-start px-3.5 py-2 rounded-xl liquid-glass-pill text-xs font-bold text-[#F5FAFF] hover:border-[#43D5ED]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{translations.dashboard.exploreAll[lang]}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <SkillCardsGrid skills={skills} onContinue={(id) => handleStartLesson(id)} lang={lang} />
                </div>
              </div>
            )}

            {/* ─── My Courses View (Part 4 & 5) ─── */}
            {activeView === 'courses' && (
              <>
                {selectedCourse ? (
                  <CourseDetailView
                    course={selectedCourse}
                    materials={selectedCourseMaterials}
                    roadmaps={selectedCourseRoadmaps}
                    onBack={() => setSelectedCourseId(null)}
                    onUpdateCourse={handleEditCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onUploadMaterial={handleUploadCourseMaterial}
                    onDeleteMaterial={handleDeleteMaterial}
                    onRetryExtractMaterial={handleRetryExtractMaterial}
                    onGenerateRoadmapFromDocs={handleGenerateRoadmapFromDocs}
                    onStartLesson={(lesson) => {
                      setCurrentLesson(lesson);
                      setActiveView('lesson');
                    }}
                    lang={lang}
                  />
                ) : (
                  <CourseLibraryView
                    courses={courses}
                    onSelectCourse={(id) => setSelectedCourseId(id)}
                    onAddCourse={handleAddCourse}
                    onEditCourse={handleEditCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onQuickGenerateRoadmap={(course) => {
                      const mats = getCourseMaterials(course.id);
                      handleGenerateRoadmapFromDocs(course, mats);
                    }}
                    lang={lang}
                  />
                )}
              </>
            )}

            {/* ─── Learning Paths (Roadmap) ─── */}
            {activeView === 'roadmap' && (
              <RoadmapView
                skills={skills}
                onStartLesson={() => handleStartLesson('sql')}
                onStartCustomLesson={(customLesson) => {
                  setCurrentLesson(customLesson);
                  setActiveView('lesson');
                }}
                onNavigateToArchitect={() => {
                  setArchitectCourse(null);
                  setArchitectDocs([]);
                  setActiveView('ai-architect');
                }}
                lang={lang}
              />
            )}

            {/* ─── AI Learning Architect ─── */}
            {activeView === 'ai-architect' && (
              <AIArchitectWorkspace
                lang={lang}
                onBackToDashboard={() => setActiveView('dashboard')}
                onStartLesson={(lesson) => {
                  setCurrentLesson(lesson);
                  setActiveView('lesson');
                }}
                onRoadmapSaved={handleRoadmapSaved}
                initialCourse={architectCourse}
                initialDocs={architectDocs}
              />
            )}

            {/* ─── Library ─── */}
            {activeView === 'library' && (
              <LibraryView skills={skills} onStartLesson={() => handleStartLesson('sql')} lang={lang} />
            )}

            {/* ─── Progress ─── */}
            {activeView === 'progress' && (
              <ProgressView user={user} activities={activities} skills={skills} lang={lang} />
            )}

            {/* ─── Settings ─── */}
            {activeView === 'settings' && (
              <SettingsView lang={lang} onToggleLang={toggleLang} />
            )}
          </main>

          {/* Liquid Glass Editorial Footer */}
          <footer className="border-t border-[#E1E5DE]/80 liquid-glass-nav py-6 px-4 sm:px-6 lg:px-8 mt-auto">
            <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#123F34] flex items-center justify-center">
                  <span className="text-[#D9F66F] font-black text-xs">S</span>
                </div>
                <span className="text-[#17251F] text-xs font-bold">
                  SkillBite
                </span>
                <span className="text-[#CBD3C6]">•</span>
                <span className="text-[#68776F] text-xs font-medium">
                  {lang === 'vi'
                    ? 'Liquid Glass Learning Universe • 10 phút làm chủ kiến thức'
                    : 'Liquid Glass Learning Universe • 10-minute microlearning'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-[#68776F]">
                <span>{lang === 'vi' ? 'Tiếng Việt / English' : 'Bilingual Edition'}</span>
                <span className="text-[#CBD3C6]">•</span>
                <span>© 2026 SkillBite Atelier</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Dashboard Add Course Modal */}
      <AddCourseModal
        isOpen={isDashboardAddCourseOpen}
        onClose={() => setIsDashboardAddCourseOpen(false)}
        onSave={handleAddCourse}
        lang={lang}
      />
    </div>
  );
}
