'use client';

import React, { useState } from 'react';
import {
  FileText,
  Table as TableIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Award,
  ChevronRight,
  Info,
  Database,
  Code,
} from 'lucide-react';
import type { OpenEndedExercise } from '@/types/architect';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';
import type { EvaluationResult } from '@/app/api/ai-architect/evaluate/route';

interface OpenEndedSectionProps {
  exercises: OpenEndedExercise[];
  lang: Lang;
  onAllCompleted?: (totalScore: number, maxScore: number) => void;
}

export default function OpenEndedSection({
  exercises,
  lang,
  onAllCompleted,
}: OpenEndedSectionProps) {
  const t = translations.lesson;
  const isVi = lang === 'vi';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [evaluations, setEvaluations] = useState<Record<number, EvaluationResult>>({});
  const [isGrading, setIsGrading] = useState(false);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [isTransientError, setIsTransientError] = useState(false);

  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-8 text-center bg-[#102B40]/90 rounded-3xl border border-[#82CDE1]/20 text-[#C3D2DF]">
        <FileText className="mx-auto mb-2 text-[#43D5ED]" size={28} />
        <p className="text-sm">
          {isVi
            ? 'Bài học này chưa có bài tập tự luận thực chiến.'
            : 'No open-ended exercises available for this lesson.'}
        </p>
      </div>
    );
  }

  const currentEx = exercises[currentIndex];
  const currentAnswer = answers[currentIndex] ?? (currentEx.initialTemplate || '');
  const currentEval = evaluations[currentIndex];
  const isSolutionRevealed = revealedSolutions[currentIndex] || false;
  const isLastExercise = currentIndex === exercises.length - 1;

  // Grade user answer via API
  const handleGradeAnswer = async () => {
    if (!currentAnswer.trim() || isGrading) return;
    setIsGrading(true);
    setErrorNotice(null);
    setIsTransientError(false);

    try {
      const res = await fetch('/api/ai-architect/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise: currentEx,
          userAnswer: currentAnswer,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (res.status === 503 || data.error === 'AI_UNAVAILABLE_503' || data.retryable) {
          setIsTransientError(true);
        }
        throw new Error(
          data.message ||
            (res.status === 503
              ? isVi
                ? 'Dịch vụ AI đang bận (503). Câu trả lời của bạn đã được bảo toàn.'
                : 'AI service is temporarily busy (503). Your answer is preserved.'
              : isVi
              ? 'Chấm điểm thất bại. Vui lòng thử lại.'
              : 'Evaluation failed. Please try again.')
        );
      }

      setEvaluations((prev) => ({
        ...prev,
        [currentIndex]: data.result,
      }));

      // Calculate total score so far
      const updatedEvals = { ...evaluations, [currentIndex]: data.result };
      const totalScore = Object.values(updatedEvals).reduce((acc, curr) => acc + curr.score, 0);
      const maxScore = exercises.reduce((acc, curr) => acc + curr.maxScore, 0);
      if (onAllCompleted) {
        onAllCompleted(totalScore, maxScore);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorNotice(msg);
    } finally {
      setIsGrading(false);
    }
  };

  const handleRetry = () => {
    setEvaluations((prev) => {
      const copy = { ...prev };
      delete copy[currentIndex];
      return copy;
    });
    setErrorNotice(null);
    setIsTransientError(false);
  };

  const getSubjectBadge = (type?: string) => {
    switch (type) {
      case 'sql':
        return {
          icon: <Database size={13} />,
          label: 'SQL Query & Schema',
          bg: 'bg-[#43D5ED]/15 text-[#43D5ED] border-[#43D5ED]/30',
        };
      case 'coding':
        return {
          icon: <Code size={13} />,
          label: isVi ? 'Lập trình' : 'Coding Task',
          bg: 'bg-[#48C8A4]/15 text-[#48C8A4] border-[#48C8A4]/30',
        };
      case 'excel':
        return {
          icon: <TableIcon size={13} />,
          label: 'Excel Formula & Analysis',
          bg: 'bg-[#D9F66F]/15 text-[#D9F66F] border-[#D9F66F]/30',
        };
      case 'writing':
        return {
          icon: <FileText size={13} />,
          label: isVi ? 'Viết & Giao tiếp' : 'Written Communication',
          bg: 'bg-[#A78BFA]/15 text-[#C4B5FD] border-[#A78BFA]/30',
        };
      default:
        return {
          icon: <Sparkles size={13} />,
          label: isVi ? 'Phân tích tổng hợp' : 'Analytical Task',
          bg: 'bg-[#43D5ED]/15 text-[#43D5ED] border-[#43D5ED]/30',
        };
    }
  };

  const badge = getSubjectBadge(currentEx.subjectType);

  return (
    <div className="bg-[#102B40]/98 rounded-3xl border border-[#82CDE1]/25 p-6 sm:p-8 lg:p-10 shadow-2xl space-y-6 animate-fade-in-up text-[#F5FAFF]">
      {/* Exercise Header & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#82CDE1]/15">
        <div className="flex items-center gap-2">
          <span className="bg-[#43D5ED] text-[#061625] text-xs font-black px-2.5 py-0.5 rounded uppercase">
            {isVi ? 'Bài tập' : 'Exercise'} {currentIndex + 1}/{exercises.length}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-md border ${badge.bg}`}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </span>
        </div>
        <span className="text-xs font-bold text-[#43D5ED]">
          {isVi ? 'Tối đa' : 'Max Score'}: {currentEx.maxScore} {isVi ? 'điểm' : 'pts'}
        </span>
      </div>

      {/* Task Prompt */}
      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-black text-[#F5FAFF] leading-relaxed whitespace-normal break-words">
          {currentEx.prompt}
        </h3>
        {currentEx.scenario && (
          <div className="text-xs sm:text-sm text-[#C3D2DF] bg-[#061625]/90 p-4 rounded-2xl border border-[#82CDE1]/20 leading-relaxed font-normal">
            <strong className="text-[#43D5ED] block mb-0.5">{t.scenario[lang]}:</strong>
            <span>{currentEx.scenario}</span>
          </div>
        )}
      </div>

      {/* Provided Data / Problem Context */}
      {currentEx.providedData && (
        <div className="p-4 rounded-2xl border border-[#82CDE1]/20 bg-[#061625]/80 space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#43D5ED]">
            <Info size={14} />
            <span>{t.providedDataLabel[lang]}</span>
          </div>
          <div className="font-mono text-xs text-[#C3D2DF] bg-[#061625] p-3.5 rounded-xl border border-[#82CDE1]/15 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {typeof currentEx.providedData === 'string'
              ? currentEx.providedData
              : JSON.stringify(currentEx.providedData, null, 2)}
          </div>
        </div>
      )}

      {/* Instructions */}
      {currentEx.instructions && currentEx.instructions.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#93A8B8] block">
            {t.instructions[lang]}
          </span>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#C3D2DF]">
            {currentEx.instructions.map((inst, i) => (
              <li key={i} className="whitespace-normal break-words leading-relaxed">
                {inst}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Scoring Rubric details */}
      {currentEx.rubric && currentEx.rubric.length > 0 && (
        <div className="p-4 rounded-2xl border border-[#82CDE1]/20 bg-[#0A1E32]/90 space-y-2 text-xs">
          <span className="font-bold uppercase tracking-wider text-[#93A8B8] block">
            {t.rubricLabel[lang]}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentEx.rubric.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-[#102B40] px-3.5 py-2 rounded-xl border border-[#82CDE1]/15"
              >
                <span className="text-[#C3D2DF] font-medium">{r.criterion}</span>
                <span className="font-bold text-[#43D5ED] shrink-0 ml-2">
                  +{r.maxScore} {isVi ? 'đ' : 'pts'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Notice */}
      {errorNotice && (
        <div className="p-4 rounded-2xl bg-[#FF7777]/15 border border-[#FF7777]/30 text-[#FF7777] text-xs sm:text-sm space-y-2 animate-fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={18} className="text-[#FF7777] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#F5FAFF] block">
                {isTransientError
                  ? isVi
                    ? 'Dịch vụ AI tạm thời quá tải'
                    : 'AI Service Temporarily Unavailable'
                  : isVi
                  ? 'Thông báo chấm điểm'
                  : 'Evaluation Notice'}
              </span>
              <p className="text-xs text-[#F5FAFF]/90 leading-relaxed">{errorNotice}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-[#FF7777]/20 flex items-center justify-between text-xs">
            <span className="text-[#C3D2DF] italic">
              {t.preserveAnswerNotice[lang]}
            </span>
            <button
              onClick={handleGradeAnswer}
              disabled={isGrading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF7777] hover:bg-[#ff8f8f] text-[#061625] font-black text-xs transition-colors cursor-pointer"
            >
              <RefreshCw size={12} className={isGrading ? 'animate-spin' : ''} />
              <span>{t.retryEvaluation[lang]}</span>
            </button>
          </div>
        </div>
      )}

      {/* Learner Answer Area */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#93A8B8]">
          {t.yourAnswerLabel[lang]}
        </label>
        <textarea
          rows={currentEx.subjectType === 'sql' || currentEx.subjectType === 'coding' ? 6 : 5}
          value={currentAnswer}
          onChange={(e) =>
            setAnswers((prev) => ({
              ...prev,
              [currentIndex]: e.target.value,
            }))
          }
          disabled={Boolean(currentEval)}
          placeholder={t.yourAnswerPlaceholder[lang]}
          className="w-full p-4 rounded-2xl border border-[#82CDE1]/25 bg-[#061625] text-[#F5FAFF] text-sm leading-relaxed focus:outline-none focus:border-[#43D5ED] focus:ring-1 focus:ring-[#43D5ED]"
        />
      </div>

      {/* AI Evaluation Result Card */}
      {currentEval && (
        <div className="p-5 sm:p-6 rounded-3xl border border-[#43D5ED]/40 bg-[#061625]/95 space-y-4 animate-fade-in shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#82CDE1]/15">
            <div className="flex items-center gap-2 text-[#43D5ED] font-extrabold text-base">
              <Award size={20} />
              <span>
                {currentEval.evaluationMethod === 'deterministic'
                  ? isVi
                    ? 'Kết quả chấm tự động (Deterministic)'
                    : 'Automated Evaluation Result'
                  : t.aiFeedback[lang]}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-[#43D5ED]">
                {currentEval.score} / {currentEval.maxScore}
              </span>
              <span className="text-xs text-[#93A8B8] block">
                ({currentEval.percentage}%)
              </span>
            </div>
          </div>

          <p className="text-sm text-[#F5FAFF] leading-relaxed font-normal">
            {currentEval.feedback}
          </p>

          {/* Rubric Breakdown */}
          {currentEval.rubricScores && currentEval.rubricScores.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#43D5ED] block">
                {isVi ? 'Chi tiết theo thang điểm:' : 'Rubric Breakdown:'}
              </span>
              <div className="space-y-1.5">
                {currentEval.rubricScores.map((rub, ri) => (
                  <div
                    key={ri}
                    className="p-3 rounded-xl bg-[#102B40] border border-[#82CDE1]/15 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                  >
                    <div>
                      <span className="font-bold text-[#F5FAFF]">{rub.criterion}</span>
                      {rub.comment && (
                        <p className="text-[11px] text-[#C3D2DF]">{rub.comment}</p>
                      )}
                    </div>
                    <span className="font-bold text-[#43D5ED] shrink-0">
                      {rub.score} / {rub.maxScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            {currentEval.strengths && currentEval.strengths.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-[#6BE0A4]/10 border border-[#6BE0A4]/30 space-y-1">
                <span className="font-bold text-[#6BE0A4] block flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  <span>{t.strengths[lang]}</span>
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-[#F5FAFF]">
                  {currentEval.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {currentEval.improvements && currentEval.improvements.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-[#D9F66F]/10 border border-[#D9F66F]/30 space-y-1">
                <span className="font-bold text-[#D9F66F] block flex items-center gap-1">
                  <AlertCircle size={13} />
                  <span>{t.improvements[lang]}</span>
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-[#F5FAFF]">
                  {currentEval.improvements.map((im, idx) => (
                    <li key={idx}>{im}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Model Solution */}
      {isSolutionRevealed ? (
        <div className="p-5 rounded-2xl border border-[#82CDE1]/20 bg-[#061625] space-y-2 text-xs sm:text-sm animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#43D5ED]">
            <Eye size={15} />
            <span>{t.sampleSolutionTitle[lang]}</span>
          </div>
          <div className="font-mono text-xs text-[#C3D2DF] bg-[#0A1E32] p-4 rounded-xl border border-[#82CDE1]/15 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {currentEx.sampleSolution}
          </div>
          {currentEx.reasoningExplanation && (
            <div className="text-xs text-[#C3D2DF] pt-2 border-t border-[#82CDE1]/15 leading-relaxed">
              <strong className="text-[#F5FAFF]">{isVi ? 'Phân tích lý do:' : 'Reasoning:'} </strong>
              <span>{currentEx.reasoningExplanation}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setRevealedSolutions((prev) => ({ ...prev, [currentIndex]: true }))}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#93A8B8] hover:text-[#43D5ED] transition-colors cursor-pointer"
          >
            <Eye size={14} />
            <span>{t.seeSampleSolution[lang]}</span>
          </button>
        </div>
      )}

      {/* Action Controls Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#82CDE1]/15">
        <div>
          {currentEval && (
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#15354A] hover:bg-[#1E4661] border border-[#82CDE1]/20 text-xs font-bold text-[#F5FAFF] transition-colors cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>{t.retryExercise[lang]}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {!currentEval ? (
            <button
              onClick={handleGradeAnswer}
              disabled={!currentAnswer.trim() || isGrading}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-sm transition-all cursor-pointer ${
                currentAnswer.trim() && !isGrading
                  ? 'bg-[#43D5ED] hover:bg-[#6BE0F5] text-[#061625] shadow-[0_0_15px_rgba(67,213,237,0.3)]'
                  : 'bg-[#15354A] text-[#93A8B8] cursor-not-allowed border border-[#82CDE1]/10'
              }`}
            >
              {isGrading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>{t.evaluating[lang]}</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-[#061625]" />
                  <span>{t.submitEvaluation[lang]}</span>
                </>
              )}
            </button>
          ) : (
            !isLastExercise && (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#43D5ED] hover:bg-[#6BE0F5] text-[#061625] font-black text-xs sm:text-sm transition-all cursor-pointer shadow-[0_0_15px_rgba(67,213,237,0.3)]"
              >
                <span>{isVi ? 'Bài tập tiếp theo' : 'Next Exercise'}</span>
                <ChevronRight size={15} />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
