'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';
import { userProfile as initialProfile } from '@/data/mockData';
import type { Lesson, UserProfile, AppView } from '@/types';
import TopNav from '@/components/TopNav';
import LessonView from '@/components/lesson/LessonView';
import AIArchitectWorkspace from '@/components/architect/AIArchitectWorkspace';
import { Check, X } from 'lucide-react';

const LANG_KEY = 'skillbite-lang';

function getStoredLang(): Lang {
  if (typeof window === 'undefined') return 'vi';
  const stored = localStorage.getItem(LANG_KEY);
  if (stored === 'en' || stored === 'vi') return stored;
  return 'vi';
}

export default function AIArchitectPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('vi');
  const [user, setUser] = useState<UserProfile>(initialProfile);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const hydrationId = window.setTimeout(() => setLang(getStoredLang()), 0);
    return () => window.clearTimeout(hydrationId);
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'vi' ? 'en' : 'vi';
      localStorage.setItem(LANG_KEY, next);
      return next;
    });
  }, []);

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleLessonComplete = () => {
    setUser((prev) => ({
      ...prev,
      streak: prev.streak + 1,
      totalMinutes: prev.totalMinutes + 10,
    }));
    setActiveLesson(null);
    const msg = translations.toast.lessonComplete[lang];
    setToastMessage(`🎉 ${msg} (+10 min, ${lang === 'vi' ? 'chuỗi' : 'streak'} ${user.streak + 1} 🔥)`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  const handleNav = (view: AppView) => {
    if (view === 'ai-architect') return;
    router.push('/');
  };

  return (
    <div className="min-h-screen text-[#17251F] relative selection:bg-[#D9F66F] selection:text-[#123F34] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[60] bg-[#FFFFFF] border border-[#245C4B]/20 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg animate-fade-in-up max-w-sm">
          <div className="w-6 h-6 rounded-full bg-[#E7F0EA] flex items-center justify-center shrink-0">
            <Check size={14} className="text-[#245C4B]" strokeWidth={3} />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-[#202521]">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto p-1 text-[#626A63] hover:text-[#202521] rounded-md transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* If lesson active */}
      {activeLesson ? (
        <LessonView
          lesson={activeLesson}
          onBack={() => setActiveLesson(null)}
          onComplete={handleLessonComplete}
          lang={lang}
        />
      ) : (
        <>
          <TopNav
            activeView="ai-architect"
            onNavigate={handleNav}
            user={user}
            lang={lang}
            onToggleLang={toggleLang}
          />

          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 max-w-[1440px] mx-auto w-full">
            <AIArchitectWorkspace
              lang={lang}
              onBackToDashboard={() => router.push('/')}
              onStartLesson={handleStartLesson}
              onRoadmapSaved={(roadmap) => {
                setToastMessage(
                  lang === 'vi'
                    ? `✓ Đã lưu lộ trình "${roadmap.title}" thành công!`
                    : `✓ Roadmap "${roadmap.title}" saved successfully!`
                );
                setTimeout(() => setToastMessage(null), 5000);
              }}
            />
          </main>

          <footer className="border-t border-[#E1E5DE]/80 liquid-glass-nav py-6 px-4 sm:px-6 lg:px-8 mt-auto">
            <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#245C4B] flex items-center justify-center">
                  <span className="text-[#D9F66F] font-black text-xs">S</span>
                </div>
                <span className="text-[#202521] text-xs font-bold">SkillBite AI Architect</span>
                <span className="text-[#CBD3C6]">•</span>
                <span className="text-[#626A63] text-xs font-medium">
                  {lang === 'vi'
                    ? 'Tạo lộ trình học 10 phút từ tài liệu học tập của bạn'
                    : 'Architect 10-minute microlearning from your documents'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-[#626A63]">
                <span>{lang === 'vi' ? 'Tiếng Việt / English' : 'Bilingual Edition'}</span>
                <span className="text-[#CBD3C6]">•</span>
                <span>© 2026 SkillBite Atelier</span>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
