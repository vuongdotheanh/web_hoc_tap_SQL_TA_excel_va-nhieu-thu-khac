'use client';

import { useState, useRef, useCallback } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  Edit3,
  Trash2,
  RefreshCw,
  Eye,
  ArrowRight,
  ArrowLeft,
  X,
  Copy,
  Check,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Lang } from '@/data/translations';
import { translations } from '@/data/translations';
import type {
  UploadedDocItem,
  ArchitectPreferences,
  GeneratedRoadmap,
  GeneratedLesson,
  SupportedDocType,
  LearningLevel,
  DailyStudyMinutes,
  LearningApproach,
} from '@/types/architect';
import { saveRoadmapToStorage, convertToLessonViewFormat } from '@/utils/roadmapStorage';
import type { Lesson } from '@/types';
import type { Course } from '@/types/course';

interface AIArchitectWorkspaceProps {
  lang: Lang;
  onBackToDashboard: () => void;
  onStartLesson: (lesson: Lesson) => void;
  onRoadmapSaved?: (roadmap: GeneratedRoadmap, courseId?: string) => void;
  initialCourse?: Course | null;
  initialDocs?: UploadedDocItem[];
}

type WizardStep = 'upload' | 'preferences' | 'generating' | 'review';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_TOTAL_SIZE = 40 * 1024 * 1024; // 40MB
const ALLOWED_EXTS = ['.pdf', '.docx', '.pptx', '.txt', '.md'];

export default function AIArchitectWorkspace({
  lang,
  onBackToDashboard,
  onStartLesson,
  onRoadmapSaved,
  initialCourse,
  initialDocs,
}: AIArchitectWorkspaceProps) {
  const t = translations.aiArchitect;

  // Wizard state: If initial extracted docs are passed from a Course, advance straight to preferences
  const [currentStep, setCurrentStep] = useState<WizardStep>(() => {
    if (initialDocs && initialDocs.length > 0 && initialDocs.some((d) => d.status === 'extracted')) {
      return 'preferences';
    }
    return 'upload';
  });
  const [docs, setDocs] = useState<UploadedDocItem[]>(() => initialDocs || []);
  const [isDragging, setIsDragging] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Text Preview Modal state
  const [previewDoc, setPreviewDoc] = useState<UploadedDocItem | null>(null);

  // Goal Preferences state
  const [preferences, setPreferences] = useState<ArchitectPreferences>({
    title: initialCourse ? `${initialCourse.title}: ${initialCourse.learningGoal || (lang === 'vi' ? 'Lộ trình kiến thức' : 'Knowledge Path')}` : '',
    goal: initialCourse?.learningGoal || '',
    level: 'basic',
    dailyMinutes: 10,
    targetDate: '',
    language: lang,
    approach: 'explanation-first',
  });

  // Generation status state
  const [generatingStage, setGeneratingStage] = useState<number>(1);
  const [configError, setConfigError] = useState<{
    missingKey?: string;
    message?: string;
    helpExample?: string;
  } | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Generated Roadmap state
  const [roadmap, setRoadmap] = useState<GeneratedRoadmap | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonEditForm, setLessonEditForm] = useState<{
    title: string;
    duration: number;
    prompt: string;
    expectedAnswer: string;
  }>({ title: '', duration: 10, prompt: '', expectedAnswer: '' });

  // Accordion state for modules
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Upload and Extract Handler
  const handleFilesAdded = useCallback(
    async (fileList: FileList | File[]) => {
      setGeneralError(null);
      const incomingFiles = Array.from(fileList);

      // Validate total file count
      if (docs.length + incomingFiles.length > MAX_FILES) {
        setGeneralError(
          lang === 'vi'
            ? `Chỉ được tải lên tối đa ${MAX_FILES} file. Hiện bạn đã có ${docs.length} file.`
            : `Maximum ${MAX_FILES} files allowed. You already have ${docs.length} files.`
        );
        return;
      }

      // Validate individual sizes and total cumulative size
      let currentTotalSize = docs.reduce((acc, d) => acc + d.size, 0);
      for (const file of incomingFiles) {
        if (file.size > MAX_FILE_SIZE) {
          setGeneralError(
            lang === 'vi'
              ? `File "${file.name}" vượt quá 20MB.`
              : `File "${file.name}" exceeds 20MB limit.`
          );
          return;
        }
        currentTotalSize += file.size;
      }

      if (currentTotalSize > MAX_TOTAL_SIZE) {
        setGeneralError(
          lang === 'vi'
            ? `Tổng dung lượng các file vượt quá giới hạn tối đa 40MB.`
            : `Total size exceeds 40MB maximum limit.`
        );
        return;
      }

      // Check extensions
      const validFiles: File[] = [];
      for (const file of incomingFiles) {
        const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        if (!ALLOWED_EXTS.includes(ext)) {
          setGeneralError(
            lang === 'vi'
              ? `File "${file.name}" không hợp lệ. Chỉ chấp nhận PDF, DOCX, PPTX, TXT, MD.`
              : `Invalid file "${file.name}". Only PDF, DOCX, PPTX, TXT, MD are supported.`
          );
          return;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      // Create initial doc placeholders
      const newItems: UploadedDocItem[] = validFiles.map((file) => {
        const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase().replace('.', '') as SupportedDocType;
        return {
          id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          size: file.size,
          type: ext,
          status: 'uploading',
        };
      });

      setDocs((prev) => [...prev, ...newItems]);

      // Server-side upload & text extraction
      const formData = new FormData();
      validFiles.forEach((f) => formData.append('files', f));

      try {
        const response = await fetch('/api/ai-architect/extract', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Lỗi xử lý file từ server');
        }

        // Map server results back to state
        setDocs((prev) =>
          prev.map((doc) => {
            const serverResult = data.files.find(
              (f: { name: string; size: number }) => f.name === doc.name
            );
            if (serverResult) {
              return {
                ...doc,
                id: serverResult.id || doc.id,
                status: serverResult.status,
                extractedText: serverResult.extractedText,
                previewText: serverResult.previewText,
                characterCount: serverResult.characterCount,
                errorMessage: serverResult.errorMessage,
                diagnostics: serverResult.diagnostics,
              };
            }
            return doc;
          })
        );

        // Auto-suggest roadmap title if currently blank
        if (!preferences.title && validFiles.length > 0) {
          const rawName = validFiles[0].name.replace(/\.[^/.]+$/, '');
          setPreferences((prev) => ({
            ...prev,
            title: prev.title || `Lộ trình: ${rawName}`,
          }));
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi kết nối khi trích xuất file';
        setGeneralError(msg);
        setDocs((prev) =>
          prev.map((doc) => {
            const matches = newItems.some((n) => n.name === doc.name);
            return matches
              ? { ...doc, status: 'error', errorMessage: msg }
              : doc;
          })
        );
      }
    },
    [docs, lang, preferences.title]
  );

  // Remove document
  const handleRemoveDoc = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  // Retry document extraction
  const handleRetryDoc = async (doc: UploadedDocItem) => {
    if (!doc.file) return;
    setDocs((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, status: 'uploading', errorMessage: undefined } : d))
    );
    const formData = new FormData();
    formData.append('files', doc.file);

    try {
      const response = await fetch('/api/ai-architect/extract', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Lỗi trích xuất lại');
      }
      const res = data.files?.[0];
      setDocs((prev) =>
        prev.map((d) =>
          d.id === doc.id
            ? {
                ...d,
                status: res?.status || 'error',
                extractedText: res?.extractedText,
                previewText: res?.previewText,
                characterCount: res?.characterCount,
                errorMessage: res?.errorMessage,
                diagnostics: res?.diagnostics,
              }
            : d
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối';
      setDocs((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, status: 'error', errorMessage: msg } : d))
      );
    }
  };

  // Check if at least one doc has extracted text
  const hasValidExtractedDoc = docs.some((d) => d.status === 'extracted' && d.extractedText);

  // Drag and drop listeners
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  // Trigger AI generation
  const handleGenerateRoadmap = async () => {
    setCurrentStep('generating');
    setConfigError(null);
    setGeneratingStage(1);

    // Simulate realistic progressive stages
    const timer1 = setTimeout(() => setGeneratingStage(2), 3500);
    const timer2 = setTimeout(() => setGeneratingStage(3), 8500);
    const timer3 = setTimeout(() => setGeneratingStage(4), 14000);

    const validDocsPayload = docs
      .filter((d) => d.status === 'extracted' && d.extractedText)
      .map((d) => ({
        name: d.name,
        text: d.extractedText || '',
        characterCount: d.characterCount || 0,
      }));

    try {
      const response = await fetch('/api/ai-architect/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences,
          documents: validDocsPayload,
        }),
      });

      const data = await response.json();

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!response.ok || !data.success) {
        if (data.error === 'CONFIG_REQUIRED' || data.missingKey) {
          setConfigError({
            missingKey: data.missingKey || 'GEMINI_API_KEY',
            message: data.message,
            helpExample: 'GEMINI_API_KEY=your_actual_gemini_api_key_here',
          });
          return;
        }
        throw new Error(data.message || 'Lỗi trong quá trình tạo lộ trình.');
      }

      const generated = data.roadmap as GeneratedRoadmap;
      setRoadmap(generated);

      // Initialize all modules expanded by default
      const exp: Record<string, boolean> = {};
      generated.modules.forEach((m) => {
        exp[m.id] = true;
      });
      setExpandedModules(exp);

      setIsSaved(false);
      setCurrentStep('review');
    } catch (err: unknown) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định khi tạo lộ trình.';
      setConfigError({
        message: msg,
      });
    }
  };

  // Save roadmap action
  const handleSaveRoadmap = () => {
    if (!roadmap) return;
    saveRoadmapToStorage(roadmap);
    setIsSaved(true);
    if (onRoadmapSaved) {
      onRoadmapSaved(roadmap, initialCourse?.id);
    }
  };

  // Start learning immediately
  const handleStartLearning = (firstLesson?: GeneratedLesson) => {
    if (!roadmap) return;
    // Auto-save roadmap if not yet saved
    if (!isSaved) {
      saveRoadmapToStorage(roadmap);
      setIsSaved(true);
      if (onRoadmapSaved) {
        onRoadmapSaved(roadmap, initialCourse?.id);
      }
    }

    // Pick first lesson or given lesson
    const targetLesson =
      firstLesson ||
      roadmap.modules?.[0]?.lessons?.[0];

    if (targetLesson) {
      const converted = convertToLessonViewFormat(targetLesson, roadmap.title);
      onStartLesson(converted);
    }
  };

  // Edit Lesson Inline
  const startEditLesson = (lesson: GeneratedLesson) => {
    setEditingLessonId(lesson.id);
    setLessonEditForm({
      title: lesson.title,
      duration: lesson.duration || 10,
      prompt: lesson.exercise.prompt,
      expectedAnswer: lesson.exercise.expectedAnswer,
    });
  };

  const saveEditedLesson = (lessonId: string) => {
    if (!roadmap) return;
    setRoadmap((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        modules: prev.modules.map((mod) => ({
          ...mod,
          lessons: mod.lessons.map((les) =>
            les.id === lessonId
              ? {
                  ...les,
                  title: lessonEditForm.title,
                  duration: lessonEditForm.duration,
                  exercise: {
                    ...les.exercise,
                    prompt: lessonEditForm.prompt,
                    expectedAnswer: lessonEditForm.expectedAnswer,
                  },
                }
              : les
          ),
        })),
      };
    });
    setEditingLessonId(null);
  };

  // Copy helper
  const copyEnvSnippet = () => {
    navigator.clipboard.writeText('GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere');
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* ─── Header & Navigation Breadcrumb ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#82CDE1]/15">
        <div>
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C3D2DF] hover:text-[#43D5ED] mb-2 group transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>{lang === 'vi' ? 'Quay lại Dashboard' : 'Back to Dashboard'}</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5FAFF] tracking-tight flex items-center gap-2.5">
            <Sparkles className="text-[#43D5ED] shrink-0" size={26} />
            <span>{t.title[lang]}</span>
          </h1>
          <p className="text-sm text-[#C3D2DF] mt-1">{t.subtitle[lang]}</p>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#102B40] border border-[#82CDE1]/20 p-1.5 rounded-2xl shadow-md text-xs font-bold text-[#93A8B8]">
          <span
            className={`px-3 py-1 rounded-xl transition-colors ${
              currentStep === 'upload' ? 'bg-[#43D5ED] text-[#061625] font-black shadow-sm' : 'text-[#C3D2DF]'
            }`}
          >
            {t.stepUpload[lang]}
          </span>
          <span>→</span>
          <span
            className={`px-3 py-1 rounded-xl transition-colors ${
              currentStep === 'preferences' ? 'bg-[#43D5ED] text-[#061625] font-black shadow-sm' : 'text-[#C3D2DF]'
            }`}
          >
            {t.stepPreferences[lang]}
          </span>
          <span>→</span>
          <span
            className={`px-3 py-1 rounded-xl transition-colors ${
              currentStep === 'review' || currentStep === 'generating'
                ? 'bg-[#43D5ED] text-[#061625] font-black shadow-sm'
                : 'text-[#C3D2DF]'
            }`}
          >
            {t.stepReview[lang]}
          </span>
        </div>
      </div>

      {/* ─── STEP 1: UPLOAD DOCUMENTS ─── */}
      {currentStep === 'upload' && (
        <div className="space-y-6 animate-fade-in">
          {/* Dropzone */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`
              relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200
              ${
                isDragging
                  ? 'border-[#43D5ED] bg-[#102B40] scale-[1.005] shadow-lg shadow-[#43D5ED]/10'
                  : 'border-[#82CDE1]/30 bg-[#102B40]/80 hover:border-[#43D5ED]/60 hover:bg-[#102B40]'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.pptx,.txt,.md,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFilesAdded(e.target.files);
              }}
            />

            <div className="w-16 h-16 rounded-2xl bg-[#0A1E32] border border-[#82CDE1]/25 text-[#43D5ED] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <UploadCloud size={32} />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#F5FAFF] mb-1.5">
              {t.dropzoneTitle[lang]}
            </h3>
            <p className="text-xs sm:text-sm text-[#C3D2DF] max-w-lg mx-auto mb-5 leading-relaxed">
              {t.dropzoneHint[lang]}
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-lime inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl cursor-pointer shadow-sm"
            >
              <FileText size={16} />
              <span>{t.selectFiles[lang]}</span>
            </button>
          </div>

          {/* General Error Banner */}
          {generalError && (
            <div className="p-4 rounded-xl bg-[#FF7777]/10 border border-[#FF7777]/30 text-[#FF7777] text-sm flex items-start gap-3">
              <AlertCircle size={18} className="text-[#FF7777] shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{generalError}</div>
              <button
                onClick={() => setGeneralError(null)}
                className="text-[#FF7777] hover:opacity-80"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Uploaded Documents List */}
          {docs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#F5FAFF] px-1 uppercase tracking-wider">
                <span>
                  {t.uploadedFiles[lang]} ({docs.length}/{MAX_FILES})
                </span>
                <span className="text-[#93A8B8] font-medium lowercase">
                  {lang === 'vi' ? 'Tổng:' : 'Total:'}{' '}
                  {formatFileSize(docs.reduce((acc, d) => acc + d.size, 0))} / 40 MB
                </span>
              </div>

              <div className="space-y-2.5">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl bg-[#102B40]/90 border border-[#82CDE1]/15 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#0A1E32] border border-[#82CDE1]/20 text-[#43D5ED] flex items-center justify-center shrink-0 font-black text-xs uppercase">
                        {doc.type}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#F5FAFF] truncate max-w-xs sm:max-w-md block">
                            {doc.name}
                          </span>
                          <span className="text-xs text-[#93A8B8] shrink-0">
                            ({formatFileSize(doc.size)})
                          </span>
                        </div>

                        {/* Status indicators */}
                        <div className="flex items-center gap-2 mt-1">
                          {doc.status === 'uploading' && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#43D5ED]">
                              <RefreshCw size={12} className="animate-spin" />
                              <span>{t.extractingBadge[lang]}</span>
                            </span>
                          )}

                          {doc.status === 'extracted' && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#48C8A4]">
                              <CheckCircle2 size={13} className="text-[#48C8A4]" />
                              <span>
                                {t.extractedBadge[lang]} (
                                {doc.characterCount?.toLocaleString()} {t.charsCount[lang]})
                              </span>
                            </span>
                          )}

                          {doc.status === 'empty_or_scanned' && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/30">
                              <AlertCircle size={13} className="text-amber-400" />
                              <span>{t.scannedWarningTitle[lang]}</span>
                            </span>
                          )}

                          {doc.status === 'error' && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF7777] bg-[#FF7777]/10 px-2 py-0.5 rounded-md border border-[#FF7777]/25">
                              <AlertCircle size={13} className="text-[#FF7777]" />
                              <span>{t.corruptErrorTitle[lang]}</span>
                            </span>
                          )}
                        </div>

                        {/* Explanation message if scanned or error */}
                        {(doc.status === 'empty_or_scanned' || doc.status === 'error') && (
                          <div className="mt-1 space-y-1">
                            <p className="text-xs text-[#FF7777] leading-relaxed font-medium">
                              {doc.errorMessage || t.scannedWarningText[lang]}
                            </p>
                            {doc.diagnostics && (
                              <div className="text-[11px] text-[#C3D2DF] bg-[#0A1E32]/80 p-2 rounded-lg border border-[#82CDE1]/15 space-y-0.5">
                                <div className="font-semibold text-[#F5FAFF]">
                                  {lang === 'vi' ? 'Thông tin chẩn đoán kỹ thuật:' : 'Technical Diagnostics:'}
                                </div>
                                <div className="grid grid-cols-2 gap-x-2 text-[10px]">
                                  <span>{lang === 'vi' ? 'Số trang' : 'Page count'}: {doc.diagnostics.pageCount ?? 0}</span>
                                  <span>{lang === 'vi' ? 'Phương thức' : 'Method'}: {doc.diagnostics.extractionMethod || 'none'}</span>
                                  <span>{lang === 'vi' ? 'Ký tự trích xuất' : 'Chars extracted'}: {doc.diagnostics.totalCharsExtracted ?? 0}</span>
                                  <span>OCR: {doc.diagnostics.ocrAttempted ? (doc.diagnostics.ocrSuccess ? 'Thành công' : 'Thất bại') : 'Không cần'}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions: Preview, Retry, Delete */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {doc.status === 'extracted' && doc.previewText && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#82CDE1]/25 text-xs font-semibold text-[#F5FAFF] hover:bg-[#15354A] inline-flex items-center gap-1.5 transition-colors"
                          title="Preview text"
                        >
                          <Eye size={13} />
                          <span>{t.previewText[lang]}</span>
                        </button>
                      )}

                      {(doc.status === 'error' || doc.status === 'empty_or_scanned') && (
                        <button
                          type="button"
                          onClick={() => handleRetryDoc(doc)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#43D5ED]/30 text-xs font-semibold text-[#43D5ED] hover:bg-[#43D5ED]/10 inline-flex items-center gap-1.5 transition-colors"
                        >
                          <RefreshCw size={13} />
                          <span>{t.retryFile[lang]}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1.5 rounded-lg text-[#93A8B8] hover:text-[#FF7777] hover:bg-[#FF7777]/10 transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proceed Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#82CDE1]/15">
            <p className="text-xs text-[#C3D2DF]">
              {!hasValidExtractedDoc && docs.length > 0
                ? t.needAtLeastOneValid[lang]
                : t.limitWarning[lang]}
            </p>

            <button
              type="button"
              disabled={!hasValidExtractedDoc}
              onClick={() => setCurrentStep('preferences')}
              className={`
                w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all shadow-sm
                ${
                  hasValidExtractedDoc
                    ? 'btn-lime cursor-pointer'
                    : 'bg-[#0A1E32]/70 text-[#93A8B8]/50 border border-[#82CDE1]/10 cursor-not-allowed'
                }
              `}
            >
              <span>{t.nextToPreferences[lang]}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 2: PREFERENCES CONFIGURATION ─── */}
      {currentStep === 'preferences' && (
        <div className="space-y-6 animate-fade-in bg-[#102B40]/90 p-6 sm:p-8 rounded-2xl border border-[#82CDE1]/15 backdrop-blur-md shadow-lg">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F5FAFF]">
              {t.prefTitle[lang]}
            </h2>
            <p className="text-xs sm:text-sm text-[#C3D2DF] mt-1">{t.prefSubtitle[lang]}</p>
          </div>

          <div className="space-y-5">
            {/* Roadmap Title */}
            <div>
              <label className="block text-xs font-bold text-[#F5FAFF] uppercase tracking-wider mb-1.5">
                {t.roadmapTitleLabel[lang]} <span className="text-[#FF7777]">*</span>
              </label>
              <input
                type="text"
                value={preferences.title}
                onChange={(e) => setPreferences({ ...preferences, title: e.target.value })}
                placeholder={t.roadmapTitlePlaceholder[lang]}
                className="w-full px-4 py-2.5 rounded-xl border border-[#82CDE1]/20 bg-[#0A1E32]/80 text-sm font-medium text-[#F5FAFF] placeholder:text-[#93A8B8] focus:outline-none focus:ring-1 focus:ring-[#43D5ED] focus:border-[#43D5ED] transition-all"
              />
            </div>

            {/* Specific Learning Goal */}
            <div>
              <label className="block text-xs font-bold text-[#F5FAFF] uppercase tracking-wider mb-1.5">
                {t.goalLabel[lang]} <span className="text-[#FF7777]">*</span>
              </label>
              <textarea
                rows={3}
                value={preferences.goal}
                onChange={(e) => setPreferences({ ...preferences, goal: e.target.value })}
                placeholder={t.goalPlaceholder[lang]}
                className="w-full px-4 py-2.5 rounded-xl border border-[#82CDE1]/20 bg-[#0A1E32]/80 text-sm font-medium text-[#F5FAFF] placeholder:text-[#93A8B8] focus:outline-none focus:ring-1 focus:ring-[#43D5ED] focus:border-[#43D5ED] transition-all"
              />
            </div>

            {/* Knowledge Level Selector */}
            <div>
              <label className="block text-xs font-bold text-[#F5FAFF] uppercase tracking-wider mb-2">
                {t.levelLabel[lang]}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  { id: 'beginner' as LearningLevel, label: t.levelBeginner[lang] },
                  { id: 'basic' as LearningLevel, label: t.levelBasic[lang] },
                  { id: 'intermediate' as LearningLevel, label: t.levelIntermediate[lang] },
                  { id: 'advanced' as LearningLevel, label: t.levelAdvanced[lang] },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, level: item.id })}
                    className={`
                      p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer
                      ${
                        preferences.level === item.id
                          ? 'border-[#43D5ED] bg-[#43D5ED]/15 text-[#43D5ED] ring-1 ring-[#43D5ED] shadow-xs'
                          : 'border-[#82CDE1]/15 bg-[#0A1E32]/60 text-[#C3D2DF] hover:border-[#82CDE1]/30 hover:bg-[#15354A] hover:text-[#F5FAFF]'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Commitment & Target Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Daily Study Time */}
              <div>
                <label className="block text-xs font-bold text-[#F5FAFF] uppercase tracking-wider mb-2">
                  {t.dailyTimeLabel[lang]}
                </label>
                <div className="flex flex-wrap gap-2">
                  {[10, 15, 20, 30, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() =>
                        setPreferences({ ...preferences, dailyMinutes: mins as DailyStudyMinutes })
                      }
                      className={`
                        px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
                        ${
                          preferences.dailyMinutes === mins
                            ? 'bg-[#43D5ED] text-[#061625] shadow-xs font-black'
                            : 'bg-[#0A1E32]/80 text-[#C3D2DF] border border-[#82CDE1]/15 hover:bg-[#15354A] hover:text-[#F5FAFF]'
                        }
                      `}
                    >
                      {mins} {lang === 'vi' ? 'phút' : 'min'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Date (Optional) */}
              <div>
                <label className="block text-xs font-bold text-[#F5FAFF] uppercase tracking-wider mb-2">
                  {t.targetDateLabel[lang]}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={preferences.targetDate}
                    onChange={(e) => setPreferences({ ...preferences, targetDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#82CDE1]/20 bg-[#0A1E32]/80 text-xs font-semibold text-[#F5FAFF] focus:outline-none focus:ring-1 focus:ring-[#43D5ED] focus:border-[#43D5ED]"
                  />
                  <Calendar
                    size={14}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#93A8B8] pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Language & Preferred Approach */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Language */}
              <div>
                <label className="block text-xs font-bold text-[#F5FAFF] uppercase tracking-wider mb-2">
                  {t.languageLabel[lang]}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, language: 'vi' })}
                    className={`
                      py-2.5 px-3 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all
                      ${
                        preferences.language === 'vi'
                          ? 'border-[#43D5ED] bg-[#43D5ED]/15 text-[#43D5ED]'
                          : 'border-[#82CDE1]/15 bg-[#0A1E32]/60 text-[#C3D2DF] hover:bg-[#15354A] hover:text-[#F5FAFF]'
                      }
                    `}
                  >
                    {t.langVi[lang]}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, language: 'en' })}
                    className={`
                      py-2.5 px-3 rounded-xl text-xs font-bold text-center border cursor-pointer transition-all
                      ${
                        preferences.language === 'en'
                          ? 'border-[#43D5ED] bg-[#43D5ED]/15 text-[#43D5ED]'
                          : 'border-[#82CDE1]/15 bg-[#0A1E32]/60 text-[#C3D2DF] hover:bg-[#15354A] hover:text-[#F5FAFF]'
                      }
                    `}
                  >
                    {t.langEn[lang]}
                  </button>
                </div>
              </div>

              {/* Approach */}
              <div>
                <label className="block text-xs font-bold text-[#F5FAFF] uppercase tracking-wider mb-2">
                  {t.approachLabel[lang]}
                </label>
                <select
                  value={preferences.approach}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      approach: e.target.value as LearningApproach,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#82CDE1]/20 bg-[#0A1E32]/80 text-xs font-semibold text-[#F5FAFF] focus:outline-none focus:ring-1 focus:ring-[#43D5ED] focus:border-[#43D5ED]"
                >
                  <option value="explanation-first" className="bg-[#0A1E32] text-[#F5FAFF]">{t.approachExplanation[lang]}</option>
                  <option value="example-first" className="bg-[#0A1E32] text-[#F5FAFF]">{t.approachExample[lang]}</option>
                  <option value="practice-first" className="bg-[#0A1E32] text-[#F5FAFF]">{t.approachPractice[lang]}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#82CDE1]/15">
            <button
              type="button"
              onClick={() => setCurrentStep('upload')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-[#C3D2DF] hover:text-[#F5FAFF] hover:bg-[#0A1E32] transition-colors"
            >
              {t.backToUpload[lang]}
            </button>

            <button
              type="button"
              onClick={handleGenerateRoadmap}
              className="w-full sm:w-auto btn-lime inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-md cursor-pointer"
            >
              <Sparkles size={16} />
              <span>{t.generateAction[lang]}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 3: GENERATING / PROCESSING ─── */}
      {currentStep === 'generating' && (
        <div className="animate-fade-in space-y-6">
          {!configError ? (
            <div className="bg-[#102B40]/90 p-8 sm:p-12 rounded-2xl border border-[#82CDE1]/20 text-center shadow-lg max-w-2xl mx-auto space-y-6 backdrop-blur-md">
              <div className="w-16 h-16 rounded-2xl bg-[#0A1E32] border border-[#43D5ED]/30 text-[#43D5ED] flex items-center justify-center mx-auto relative shadow-sm">
                <Sparkles size={32} className="animate-pulse text-[#43D5ED]" />
                <div className="absolute inset-0 rounded-2xl border-2 border-[#43D5ED] animate-ping opacity-20" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#F5FAFF]">
                  {t.generatingTitle[lang]}
                </h3>
                <p className="text-xs sm:text-sm text-[#C3D2DF] mt-2 max-w-md mx-auto">
                  {t.generatingSubtitle[lang]}
                </p>
              </div>

              {/* Progress Steps list */}
              <div className="space-y-3 text-left max-w-md mx-auto pt-2">
                {[
                  { step: 1, text: t.stage1[lang] },
                  { step: 2, text: t.stage2[lang] },
                  { step: 3, text: t.stage3[lang] },
                  { step: 4, text: t.stage4[lang] },
                ].map((item) => {
                  const isDone = generatingStage > item.step;
                  const isCurrent = generatingStage === item.step;
                  return (
                    <div
                      key={item.step}
                      className={`
                        p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 transition-all
                        ${
                          isDone
                            ? 'bg-[#48C8A4]/15 border-[#48C8A4]/30 text-[#48C8A4]'
                            : isCurrent
                            ? 'bg-[#0A1E32] border-[#43D5ED] text-[#F5FAFF] shadow-xs'
                            : 'bg-[#0A1E32]/40 border-[#82CDE1]/10 text-[#93A8B8]'
                        }
                      `}
                    >
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-[#48C8A4] shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw size={14} className="animate-spin text-[#43D5ED] shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-[#82CDE1]/25 shrink-0" />
                      )}
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-[#93A8B8] italic pt-2">{t.stageWaitNote[lang]}</p>
            </div>
          ) : (
            /* Actionable Server Configuration Required Card */
            <div className="bg-[#102B40]/95 p-6 sm:p-8 rounded-2xl border-2 border-amber-400/60 shadow-lg max-w-2xl mx-auto space-y-5 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#F5FAFF]">
                    {t.missingKeyTitle[lang]}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C3D2DF] mt-1 leading-relaxed">
                    {configError.message || t.missingKeyDesc[lang]}
                  </p>
                </div>
              </div>

              {/* Code snippet guidance */}
              <div className="space-y-2 bg-[#061625] text-[#C3D2DF] p-4 rounded-xl font-mono text-xs border border-[#82CDE1]/15">
                <div className="flex items-center justify-between text-[#93A8B8] text-[11px] pb-2 border-b border-white/10 font-sans">
                  <span>{t.missingKeySnippetTitle[lang]}</span>
                  <button
                    type="button"
                    onClick={copyEnvSnippet}
                    className="inline-flex items-center gap-1 text-[#D9F66F] hover:underline cursor-pointer"
                  >
                    {copiedSnippet ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedSnippet ? 'Đã sao chép' : 'Sao chép mẫu'}</span>
                  </button>
                </div>
                <p className="text-[#93A8B8]"># skillbite-app/.env.local</p>
                <p className="text-[#D9F66F]">
                  GEMINI_API_KEY=<span className="text-white">your_gemini_api_key_here</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('preferences')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#82CDE1]/25 text-xs font-bold text-[#C3D2DF] hover:bg-[#15354A] hover:text-[#F5FAFF]"
                >
                  ← {lang === 'vi' ? 'Quay lại mục tiêu' : 'Back to preferences'}
                </button>
                <button
                  type="button"
                  onClick={handleGenerateRoadmap}
                  className="w-full sm:w-auto btn-lime inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>{t.retryAfterConfig[lang]}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── STEP 4: REVIEW & SAVE ROADMAP ─── */}
      {currentStep === 'review' && roadmap && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Roadmap Meta Card */}
          <div className="bg-[#102B40]/90 p-6 sm:p-8 rounded-2xl border border-[#82CDE1]/15 shadow-md space-y-4 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#43D5ED]/15 text-[#43D5ED] border border-[#43D5ED]/25 text-[11px] font-bold tracking-wider uppercase">
                  <Sparkles size={12} />
                  <span>
                    {lang === 'vi' ? 'LỘ TRÌNH TỪ TÀI LIỆU CỦA BẠN' : 'YOUR AI CURRICULUM'}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5FAFF] tracking-tight">
                  {roadmap.title}
                </h2>
                <p className="text-sm text-[#C3D2DF] leading-relaxed max-w-3xl">
                  {roadmap.summary}
                </p>
              </div>

              {/* Action Buttons: Save & Start */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSaveRoadmap}
                  className={`
                    px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer
                    ${
                      isSaved
                        ? 'bg-[#48C8A4]/15 text-[#48C8A4] border border-[#48C8A4]/30'
                        : 'border border-[#82CDE1]/25 bg-[#0A1E32]/80 text-[#F5FAFF] hover:bg-[#15354A]'
                    }
                  `}
                >
                  {isSaved ? <Check size={14} /> : <BookOpen size={14} />}
                  <span>{isSaved ? (lang === 'vi' ? 'Đã lưu' : 'Saved') : t.actionSaveRoadmap[lang]}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartLearning()}
                  className="btn-lime px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>{t.actionStartLearning[lang]}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Metrics: duration, schedule, modules */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#82CDE1]/15">
              <div className="p-3 rounded-xl bg-[#0A1E32]/70 border border-[#82CDE1]/15">
                <span className="text-[11px] font-bold text-[#93A8B8] uppercase block">
                  {t.totalDuration[lang]}
                </span>
                <span className="text-sm font-extrabold text-[#F5FAFF]">
                  {roadmap.totalDurationMinutes} {lang === 'vi' ? 'phút' : 'min'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0A1E32]/70 border border-[#82CDE1]/15">
                <span className="text-[11px] font-bold text-[#93A8B8] uppercase block">
                  {t.suggestedSchedule[lang]}
                </span>
                <span className="text-sm font-extrabold text-[#F5FAFF]">
                  {roadmap.suggestedSchedule || `${roadmap.modules.length * 2} ngày`}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0A1E32]/70 border border-[#82CDE1]/15">
                <span className="text-[11px] font-bold text-[#93A8B8] uppercase block">
                  {lang === 'vi' ? 'Cấu trúc bài:' : 'Structure:'}
                </span>
                <span className="text-sm font-extrabold text-[#F5FAFF]">
                  {roadmap.modules.length} {t.modules[lang]} •{' '}
                  {roadmap.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)}{' '}
                  {t.lessons[lang]}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0A1E32]/70 border border-[#82CDE1]/15">
                <span className="text-[11px] font-bold text-[#93A8B8] uppercase block">
                  {lang === 'vi' ? 'Lưu trữ:' : 'Storage:'}
                </span>
                <span className="text-sm font-extrabold text-[#48C8A4]">LocalStorage</span>
              </div>
            </div>

            {/* Learning Objectives */}
            {roadmap.learningObjectives && roadmap.learningObjectives.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-[#F5FAFF] uppercase tracking-wider block mb-2">
                  {t.learningObjectives[lang]}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {roadmap.learningObjectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#C3D2DF]">
                      <CheckCircle2 size={13} className="text-[#48C8A4] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Source references */}
            {roadmap.sourceMaterials && roadmap.sourceMaterials.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-[#F5FAFF] uppercase tracking-wider block mb-2">
                  {t.sourceReferences[lang]}
                </span>
                <div className="flex flex-wrap gap-2">
                  {roadmap.sourceMaterials.map((src, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-[#0A1E32]/80 border border-[#43D5ED]/20 text-xs font-medium text-[#F5FAFF] flex items-center gap-1.5"
                    >
                      <FileText size={12} className="text-[#43D5ED]" />
                      <span className="font-bold">{src.filename}</span>
                      {src.pagesOrSections && (
                        <span className="text-[#93A8B8]">({src.pagesOrSections})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modules and Lessons List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold text-[#F5FAFF]">
                {lang === 'vi' ? 'Danh sách mô-đun & bài học 10 phút' : '10-Minute Modules & Lessons'}
              </h3>
              <span className="text-xs text-[#93A8B8]">
                {lang === 'vi'
                  ? 'Nhấp "Chỉnh sửa bài" để tùy chỉnh đề bài hoặc thời lượng'
                  : 'Click "Edit lesson" to customize prompt or duration'}
              </span>
            </div>

            {roadmap.modules.map((module, mIdx) => {
              const isExpanded = expandedModules[module.id] ?? true;
              return (
                <div
                  key={module.id}
                  className="bg-[#102B40]/90 rounded-2xl border border-[#82CDE1]/15 shadow-sm overflow-hidden backdrop-blur-md"
                >
                  {/* Module Header Accordion */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedModules((prev) => ({
                        ...prev,
                        [module.id]: !isExpanded,
                      }))
                    }
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#15354A] transition-colors border-b border-[#82CDE1]/15"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#0A1E32] border border-[#82CDE1]/30 text-[#43D5ED] flex items-center justify-center font-bold text-xs shrink-0">
                        {mIdx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-[#F5FAFF]">
                          {module.title}
                        </h4>
                        <p className="text-xs text-[#C3D2DF] line-clamp-1">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-[#93A8B8] hidden sm:block">
                        {module.lessons?.length || 0} {t.lessons[lang]}
                      </span>
                      {isExpanded ? <ChevronUp size={16} className="text-[#C3D2DF]" /> : <ChevronDown size={16} className="text-[#C3D2DF]" />}
                    </div>
                  </button>

                  {/* Lessons inside Module */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 space-y-4 bg-[#0A1E32]/60">
                      {module.lessons.map((lesson, lIdx) => {
                        const isEditing = editingLessonId === lesson.id;
                        return (
                          <div
                            key={lesson.id}
                            className="bg-[#102B40]/95 p-5 rounded-xl border border-[#82CDE1]/15 shadow-sm space-y-3.5"
                          >
                            {!isEditing ? (
                              <>
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 rounded-md bg-[#43D5ED]/15 text-[#43D5ED] border border-[#43D5ED]/25 text-[11px] font-bold">
                                        {lang === 'vi' ? 'Bài' : 'Lesson'} {mIdx + 1}.{lIdx + 1}
                                      </span>
                                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C3D2DF]">
                                        <Clock size={12} className="text-[#43D5ED]" />
                                        <span>
                                          {lesson.duration || 10} {lang === 'vi' ? 'phút' : 'min'}
                                        </span>
                                      </span>
                                    </div>
                                    <h5 className="text-base font-bold text-[#F5FAFF]">
                                      {lesson.title}
                                    </h5>
                                    {lesson.sourceReference && (
                                      <p className="text-xs text-[#48C8A4] font-medium">
                                        📌 {lesson.sourceReference}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => startEditLesson(lesson)}
                                      className="px-2.5 py-1.5 rounded-lg border border-[#82CDE1]/20 text-xs font-semibold text-[#C3D2DF] hover:text-[#F5FAFF] hover:bg-[#15354A] inline-flex items-center gap-1.5 transition-colors"
                                    >
                                      <Edit3 size={12} />
                                      <span>{t.editLesson[lang]}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleStartLearning(lesson)}
                                      className="btn-lime px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-sm cursor-pointer"
                                    >
                                      <span>{lang === 'vi' ? 'Học bài này' : 'Learn now'}</span>
                                      <ArrowRight size={12} />
                                    </button>
                                  </div>
                                </div>

                                {/* Situation & Explanation */}
                                <div className="p-3.5 rounded-xl bg-[#0A1E32]/80 border border-[#82CDE1]/15 text-xs space-y-2">
                                  <div>
                                    <span className="font-bold text-[#43D5ED]">
                                      {lang === 'vi' ? 'Tình huống thực tế:' : 'Workplace scenario:'}
                                    </span>{' '}
                                    <span className="text-[#F5FAFF]">{lesson.situation}</span>
                                  </div>
                                  <p className="text-[#C3D2DF] leading-relaxed">
                                    {lesson.explanation}
                                  </p>
                                </div>

                                {/* Exercise prompt Preview */}
                                {lesson.exercise && (
                                  <div className="p-3 rounded-xl bg-[#0A1E32]/90 border border-[#82CDE1]/15 text-xs space-y-1">
                                    <span className="font-bold text-[#F5FAFF] block">
                                      🎯 {t.exercisePromptField[lang]}:
                                    </span>
                                    <p className="text-[#C3D2DF] font-mono text-[11px] bg-[#061625] p-2.5 rounded-lg border border-[#82CDE1]/15">
                                      {lesson.exercise.prompt}
                                    </p>
                                    <p className="text-[11px] text-[#48C8A4] font-semibold pt-1">
                                      ✓ {t.expectedAnswerField[lang]}:{' '}
                                      <code className="bg-[#48C8A4]/15 px-1.5 py-0.5 rounded text-[#48C8A4] border border-[#48C8A4]/30">
                                        {lesson.exercise.expectedAnswer}
                                      </code>
                                    </p>
                                  </div>
                                )}
                              </>
                            ) : (
                              /* Inline Editing Mode */
                              <div className="space-y-3 p-3 bg-[#0A1E32]/90 rounded-xl border border-[#43D5ED]/40">
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                  <div className="sm:col-span-3">
                                    <label className="text-[11px] font-bold text-[#F5FAFF] block mb-1">
                                      {t.lessonTitleField[lang]}
                                    </label>
                                    <input
                                      type="text"
                                      value={lessonEditForm.title}
                                      onChange={(e) =>
                                        setLessonEditForm({
                                          ...lessonEditForm,
                                          title: e.target.value,
                                        })
                                      }
                                      className="w-full px-3 py-1.5 rounded-lg border border-[#82CDE1]/25 bg-[#061625] text-xs font-semibold text-[#F5FAFF] focus:border-[#43D5ED] focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-bold text-[#F5FAFF] block mb-1">
                                      {t.lessonDurationField[lang]}
                                    </label>
                                    <input
                                      type="number"
                                      min={5}
                                      max={60}
                                      value={lessonEditForm.duration}
                                      onChange={(e) =>
                                        setLessonEditForm({
                                          ...lessonEditForm,
                                          duration: parseInt(e.target.value) || 10,
                                        })
                                      }
                                      className="w-full px-3 py-1.5 rounded-lg border border-[#82CDE1]/25 bg-[#061625] text-xs font-semibold text-[#F5FAFF] focus:border-[#43D5ED] focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[11px] font-bold text-[#F5FAFF] block mb-1">
                                    {t.exercisePromptField[lang]}
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={lessonEditForm.prompt}
                                    onChange={(e) =>
                                      setLessonEditForm({
                                        ...lessonEditForm,
                                        prompt: e.target.value,
                                      })
                                    }
                                    className="w-full px-3 py-1.5 rounded-lg border border-[#82CDE1]/25 bg-[#061625] text-xs text-[#F5FAFF] focus:border-[#43D5ED] focus:outline-none"
                                  />
                                </div>

                                <div>
                                  <label className="text-[11px] font-bold text-[#F5FAFF] block mb-1">
                                    {t.expectedAnswerField[lang]}
                                  </label>
                                  <input
                                    type="text"
                                    value={lessonEditForm.expectedAnswer}
                                    onChange={(e) =>
                                      setLessonEditForm({
                                        ...lessonEditForm,
                                        expectedAnswer: e.target.value,
                                      })
                                    }
                                    className="w-full px-3 py-1.5 rounded-lg border border-[#82CDE1]/25 bg-[#061625] text-xs font-mono text-[#48C8A4] focus:border-[#43D5ED] focus:outline-none"
                                  />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingLessonId(null)}
                                    className="px-3 py-1.5 rounded-lg border border-[#82CDE1]/25 text-xs font-semibold text-[#C3D2DF] hover:bg-[#15354A] hover:text-[#F5FAFF]"
                                  >
                                    {t.cancelLessonEdit[lang]}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => saveEditedLesson(lesson.id)}
                                    className="btn-lime px-4 py-1.5 rounded-lg text-xs font-bold"
                                  >
                                    {t.saveLessonEdit[lang]}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#102B40]/90 rounded-2xl border border-[#82CDE1]/15 shadow-md backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep('preferences')}
                className="px-4 py-2.5 rounded-xl border border-[#82CDE1]/25 text-xs font-bold text-[#C3D2DF] hover:text-[#F5FAFF] hover:bg-[#15354A] transition-colors"
              >
                {t.actionRegenerate[lang]}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDocs([]);
                  setRoadmap(null);
                  setCurrentStep('upload');
                }}
                className="px-4 py-2.5 rounded-xl border border-[#82CDE1]/25 text-xs font-bold text-[#C3D2DF] hover:text-[#F5FAFF] hover:bg-[#15354A] transition-colors"
              >
                {t.actionUploadNew[lang]}
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveRoadmap}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#48C8A4]/30 bg-[#48C8A4]/15 text-[#48C8A4] text-xs font-bold hover:bg-[#48C8A4]/25 cursor-pointer transition-colors"
              >
                {isSaved ? '✓ ' + (lang === 'vi' ? 'Đã lưu vào Lộ trình học' : 'Saved to Learning Paths') : t.actionSaveRoadmap[lang]}
              </button>
              <button
                type="button"
                onClick={() => handleStartLearning()}
                className="w-full sm:w-auto btn-lime px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>{t.actionStartLearning[lang]}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: TEXT PREVIEW ─── */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#102B40] rounded-2xl border border-[#82CDE1]/30 shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="p-4 sm:p-5 border-b border-[#82CDE1]/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0A1E32] text-[#43D5ED] border border-[#82CDE1]/20 flex items-center justify-center font-bold text-xs">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F5FAFF]">{previewDoc.name}</h4>
                  <span className="text-[11px] text-[#93A8B8]">
                    {previewDoc.characterCount?.toLocaleString()} {t.charsCount[lang]}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 text-[#93A8B8] hover:text-[#F5FAFF] rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-[#C3D2DF] leading-relaxed bg-[#061625] whitespace-pre-wrap border-y border-[#82CDE1]/10">
              {previewDoc.extractedText?.slice(0, 5000) || 'Không có nội dung'}
              {(previewDoc.extractedText?.length || 0) > 5000 && (
                <div className="mt-4 p-3 rounded-lg bg-[#43D5ED]/10 text-[#43D5ED] border border-[#43D5ED]/20 font-sans text-xs font-semibold text-center">
                  ... [Đã cắt bớt văn bản xem trước, tổng cộng{' '}
                  {previewDoc.extractedText?.length.toLocaleString()} ký tự]
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#82CDE1]/15 bg-[#102B40] flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-bold"
              >
                {lang === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
