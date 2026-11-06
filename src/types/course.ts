// Course and Material Types for SkillBite

export type CourseTheme = 'emerald' | 'teal' | 'coral' | 'lavender' | 'lime';

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  academicTerm?: string;
  learningGoal?: string;
  colorTheme: CourseTheme;
  icon?: string;
  documentCount: number;
  roadmapCount: number;
  progress: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
  roadmapIds?: string[];
}

export type SupportedMaterialType = 'pdf' | 'docx' | 'pptx' | 'txt' | 'md';

export interface CourseMaterial {
  id: string;
  courseId: string;
  filename: string;
  size: number; // in bytes
  type: SupportedMaterialType;
  status: 'uploading' | 'extracted' | 'empty_or_scanned' | 'error';
  extractedText?: string;
  previewText?: string;
  characterCount?: number;
  pageCount?: number;
  errorMessage?: string;
  createdAt: string;
  usedInRoadmap?: boolean;
}

export type CourseDetailTab = 'overview' | 'documents' | 'roadmaps' | 'progress';

