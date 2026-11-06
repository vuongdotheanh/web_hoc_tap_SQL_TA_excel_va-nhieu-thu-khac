// Types for AI Learning Architect

export type SupportedDocType = 'pdf' | 'docx' | 'pptx' | 'txt' | 'md';

export interface DocDiagnostics {
  isValidFile?: boolean;
  filename?: string;
  mimeType?: string;
  fileSize?: number;
  pageCount?: number;
  extractionMethod?: string;
  ocrAttempted?: boolean;
  ocrSuccess?: boolean;
  ocrError?: string;
  pageStatsSample?: { page: number; charCount: number }[];
  totalCharsExtracted?: number;
  category?: string;
  error?: string;
}

export interface UploadedDocItem {
  id: string;
  file?: File;
  name: string;
  size: number;
  type: SupportedDocType | 'unknown';
  status: 'pending' | 'uploading' | 'extracted' | 'empty_or_scanned' | 'error';
  extractedText?: string;
  previewText?: string;
  characterCount?: number;
  errorMessage?: string;
  diagnostics?: DocDiagnostics;
}

export type LearningLevel = 'beginner' | 'basic' | 'intermediate' | 'advanced';
export type DailyStudyMinutes = 10 | 15 | 20 | 30 | 60;
export type LearningLanguage = 'vi' | 'en';
export type LearningApproach = 'explanation-first' | 'example-first' | 'practice-first';

export interface ArchitectPreferences {
  title: string;
  goal: string;
  level: LearningLevel;
  dailyMinutes: DailyStudyMinutes;
  targetDate?: string;
  language: LearningLanguage;
  approach: LearningApproach;
}

export interface GeneratedExercise {
  prompt: string;
  initialCode?: string;
  expectedAnswer: string;
  hint: string;
  explanation: string;
}

export interface QuizOption {
  id: string; // e.g. "A", "B", "C", "D"
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice';
  question: string;
  options: QuizOption[];
  correctOptionId: string; // "A" | "B" | "C" | "D"
  explanation: string;
  commonMisconceptions?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  sourceReference?: string;
}

export interface RubricItem {
  criterion: string;
  maxScore: number;
}

export type SubjectType = 'sql' | 'coding' | 'calculation' | 'excel' | 'writing' | 'general';

export interface OpenEndedExercise {
  id: string;
  type: 'open_ended';
  subjectType: SubjectType;
  prompt: string;
  scenario?: string;
  instructions: string[];
  providedData?: Record<string, unknown> | string;
  evaluationCriteria: string[];
  rubric: RubricItem[];
  sampleSolution: string;
  reasoningExplanation?: string;
  maxScore: number;
  sourceReference?: string;
  initialTemplate?: string;
}

export interface GeneratedQuiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GeneratedLesson {
  id: string;
  title: string;
  duration: number; // in minutes (e.g. 10)
  level: string;
  situation: string;
  keyConcepts: string[];
  explanation: string;
  example?: string;
  exercise: GeneratedExercise;
  quiz?: GeneratedQuiz;
  quizzes?: QuizQuestion[];
  openEndedExercises?: OpenEndedExercise[];
  sourceReference?: string;
  isReviewSession?: boolean;
  order: number;
}

export interface GeneratedModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: GeneratedLesson[];
}

export interface SourceReferenceItem {
  filename: string;
  pagesOrSections?: string;
  topicsCovered?: string;
}

export interface GeneratedRoadmap {
  id: string;
  title: string;
  summary: string;
  level: LearningLevel;
  totalDurationMinutes: number;
  suggestedSchedule: string;
  learningObjectives: string[];
  sourceMaterials: SourceReferenceItem[];
  modules: GeneratedModule[];
  createdAt: string;
  dailyMinutes: number;
}

