'use client';

import React, { useState } from 'react';
import {
  Check,
  X,
  AlertCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import type { QuizQuestion } from '@/types/architect';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';

interface QuizSectionProps {
  quizzes: QuizQuestion[];
  lang: Lang;
  onAllCompleted?: (score: number, total: number) => void;
}

export default function QuizSection({
  quizzes,
  lang,
  onAllCompleted,
}: QuizSectionProps) {
  const t = translations.lesson;
  const isVi = lang === 'vi';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    Record<number, { selected: string; isCorrect: boolean }>
  >({});
  const [showSummary, setShowSummary] = useState(false);

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="p-8 text-center bg-[#102B40]/90 rounded-3xl border border-[#82CDE1]/20 text-[#C3D2DF]">
        <BookOpen className="mx-auto mb-2 text-[#43D5ED]" size={28} />
        <p className="text-sm">
          {isVi
            ? 'Bài học này chưa có câu hỏi trắc nghiệm.'
            : 'No multiple-choice quiz questions available for this lesson.'}
        </p>
      </div>
    );
  }

  const currentQuiz = quizzes[currentIndex];
  const isLastQuestion = currentIndex === quizzes.length - 1;

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    const isCorrect = selectedOption === currentQuiz.correctOptionId;
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: { selected: selectedOption, isCorrect },
    }));
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowSummary(true);
      const totalCorrect = Object.values(userAnswers).filter((a) => a.isCorrect).length;
      if (onAllCompleted) {
        onAllCompleted(totalCorrect, quizzes.length);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      const nextAns = userAnswers[currentIndex + 1];
      if (nextAns) {
        setSelectedOption(nextAns.selected);
        setIsSubmitted(true);
      } else {
        setSelectedOption(null);
        setIsSubmitted(false);
      }
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setUserAnswers({});
    setShowSummary(false);
  };

  const totalScore = Object.values(userAnswers).filter((a) => a.isCorrect).length;

  if (showSummary) {
    const percentage = Math.round((totalScore / quizzes.length) * 100);
    return (
      <div className="bg-[#102B40]/98 rounded-3xl border border-[#82CDE1]/25 p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6 animate-fade-in-up text-[#F5FAFF]">
        <div className="text-center space-y-3 pb-6 border-b border-[#82CDE1]/15">
          <div className="w-16 h-16 rounded-full bg-[#15354A] border border-[#43D5ED]/40 text-[#43D5ED] flex items-center justify-center mx-auto text-2xl font-black shadow-lg">
            {percentage}%
          </div>
          <h3 className="text-2xl font-black text-[#F5FAFF]">
            {t.quizSummaryTitle[lang]}
          </h3>
          <p className="text-sm text-[#C3D2DF]">
            {t.quizSummaryScore[lang]
              .replace('{score}', String(totalScore))
              .replace('{total}', String(quizzes.length))}
          </p>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#93A8B8] block">
            {t.reviewAnswers[lang]}
          </span>
          {quizzes.map((q, idx) => {
            const res = userAnswers[idx];
            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border text-sm flex items-start gap-3.5 ${
                  res?.isCorrect
                    ? 'bg-[#6BE0A4]/10 border-[#6BE0A4]/30 text-[#F5FAFF]'
                    : 'bg-[#FF7777]/10 border-[#FF7777]/30 text-[#F5FAFF]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    res?.isCorrect ? 'bg-[#6BE0A4] text-[#061625]' : 'bg-[#FF7777] text-[#061625]'
                  }`}
                >
                  {res?.isCorrect ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#F5FAFF]">{q.question}</p>
                  <p className="text-xs text-[#C3D2DF] mt-1.5">
                    {isVi ? 'Đáp án đúng:' : 'Correct answer:'}{' '}
                    <strong className="text-[#43D5ED]">
                      {q.options.find((o) => o.id === q.correctOptionId)?.text}
                    </strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <button
            onClick={handleRetake}
            className="px-6 py-2.5 rounded-xl bg-[#15354A] hover:bg-[#1E4661] border border-[#82CDE1]/25 text-xs sm:text-sm font-bold text-[#F5FAFF] transition-colors cursor-pointer"
          >
            {t.retryExercise[lang]}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#102B40]/98 rounded-3xl border border-[#82CDE1]/25 p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6 animate-fade-in-up text-[#F5FAFF]">
      {/* Quiz Progress & Question Tracker */}
      <div className="flex items-center justify-between pb-4 border-b border-[#82CDE1]/15">
        <div className="flex items-center gap-2">
          <span className="bg-[#43D5ED] text-[#061625] text-xs font-black px-2.5 py-0.5 rounded uppercase">
            {t.quizQuestionCount[lang]} {currentIndex + 1}/{quizzes.length}
          </span>
          {currentQuiz.difficulty && (
            <span className="text-[11px] font-semibold text-[#C3D2DF] uppercase tracking-wider bg-[#15354A] border border-[#82CDE1]/15 px-2 py-0.5 rounded">
              {currentQuiz.difficulty}
            </span>
          )}
        </div>
        <span className="text-xs font-bold text-[#43D5ED]">
          {isVi ? 'Đúng' : 'Score'}: {totalScore}/{quizzes.length}
        </span>
      </div>

      {/* Question Prompt */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-[#F5FAFF] leading-relaxed whitespace-normal break-words">
          {currentQuiz.question}
        </h3>
        {currentQuiz.sourceReference && (
          <p className="text-xs text-[#93A8B8] mt-1.5 flex items-center gap-1 italic">
            <span>{t.sourceRef[lang]}</span>
            <span>{currentQuiz.sourceReference}</span>
          </p>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {currentQuiz.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const isCorrectChoice = opt.id === currentQuiz.correctOptionId;

          let btnClasses =
            'w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 text-sm leading-relaxed cursor-pointer ';

          if (!isSubmitted) {
            btnClasses += isSelected
              ? 'border-[#43D5ED] bg-[#15354A] font-bold text-[#43D5ED] shadow-md'
              : 'border-[#82CDE1]/20 bg-[#061625]/80 hover:border-[#43D5ED]/50 hover:bg-[#15354A]/60 text-[#F5FAFF]';
          } else {
            // Evaluated state
            if (isCorrectChoice) {
              btnClasses += 'border-[#6BE0A4] bg-[#6BE0A4]/15 font-bold text-[#6BE0A4]';
            } else if (isSelected && !isCorrectChoice) {
              btnClasses += 'border-[#FF7777] bg-[#FF7777]/15 text-[#FF7777]';
            } else {
              btnClasses += 'border-[#82CDE1]/10 bg-[#061625]/40 opacity-40 text-[#93A8B8] cursor-not-allowed';
            }
          }

          return (
            <button
              key={opt.id}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(opt.id)}
              className={btnClasses}
            >
              <div
                className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected
                    ? 'bg-[#43D5ED] text-[#061625]'
                    : 'bg-[#15354A] text-[#C3D2DF]'
                }`}
              >
                {opt.id}
              </div>
              <span className="flex-1 whitespace-normal break-words">{opt.text}</span>
              {isSubmitted && isCorrectChoice && (
                <Check size={18} className="text-[#6BE0A4] shrink-0 mt-0.5" strokeWidth={3} />
              )}
              {isSubmitted && isSelected && !isCorrectChoice && (
                <X size={18} className="text-[#FF7777] shrink-0 mt-0.5" strokeWidth={3} />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation & Misconceptions */}
      {isSubmitted && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border animate-fade-in space-y-2 text-sm leading-relaxed ${
            selectedOption === currentQuiz.correctOptionId
              ? 'bg-[#6BE0A4]/10 border-[#6BE0A4]/30 text-[#6BE0A4]'
              : 'bg-[#FF7777]/10 border-[#FF7777]/30 text-[#FF7777]'
          }`}
        >
          <div className="flex items-center gap-2 font-black text-sm">
            {selectedOption === currentQuiz.correctOptionId ? (
              <>
                <Check size={16} strokeWidth={3} />
                <span>{t.correct[lang]}</span>
              </>
            ) : (
              <>
                <AlertCircle size={16} strokeWidth={2.5} />
                <span>{t.incorrect[lang]}</span>
              </>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#F5FAFF] whitespace-normal break-words leading-relaxed">
            {currentQuiz.explanation}
          </p>

          {currentQuiz.commonMisconceptions && (
            <div className="pt-2 border-t border-white/10 text-xs text-[#C3D2DF]">
              <strong className="text-[#F5FAFF]">{t.misconception[lang]} </strong>
              <span>{currentQuiz.commonMisconceptions}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#82CDE1]/15">
        <div className="text-xs text-[#93A8B8]">
          {!isSubmitted
            ? t.selectOptionPrompt[lang]
            : isLastQuestion
            ? t.quizCompleted[lang]
            : `${t.quizQuestionCount[lang]} ${currentIndex + 1} / ${quizzes.length}`}
        </div>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              selectedOption
                ? 'bg-[#43D5ED] hover:bg-[#6BE0F5] text-[#061625] shadow-[0_0_15px_rgba(67,213,237,0.3)]'
                : 'bg-[#15354A] text-[#93A8B8] cursor-not-allowed border border-[#82CDE1]/10'
            }`}
          >
            {t.submitAnswer[lang]}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#43D5ED] hover:bg-[#6BE0F5] text-[#061625] font-black text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(67,213,237,0.3)] cursor-pointer"
          >
            <span>{isLastQuestion ? t.seeResults[lang] : t.nextQuestion[lang]}</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
