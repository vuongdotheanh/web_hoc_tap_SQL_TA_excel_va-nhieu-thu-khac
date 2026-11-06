// Types for SkillBite application

import type { QuizQuestion, OpenEndedExercise } from './architect';

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  level: SkillLevel;
  progress: number; // 0-100
  completedLessons: number;
  totalLessons: number;
  accentColor: string;
  icon: string;
}

export type SkillLevel = 'Cơ bản' | 'Trung cấp' | 'Nâng cao';

export interface Lesson {
  id: string;
  skillId: string;
  title: string;
  description: string;
  duration: number; // minutes
  level: SkillLevel;
  situation: string;
  steps: LessonStep[];
  completed: boolean;
  order: number;
  quizzes?: QuizQuestion[];
  openEndedExercises?: OpenEndedExercise[];
}

export interface LessonStep {
  id: string;
  type: 'content' | 'exercise' | 'quiz' | 'open_ended';
  title: string;
  content: string;
  example?: string;
  exercise?: Exercise;
  quizQuestion?: QuizQuestion;
  openEndedExercise?: OpenEndedExercise;
}

export interface Exercise {
  prompt: string;
  initialCode?: string;
  expectedAnswer: string;
  hint: string;
  explanation: string;
}

export interface WeeklyActivity {
  day: string;
  shortDay: string;
  minutes: number;
  completed: boolean;
  date: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  streak: number;
  totalMinutes: number;
  weeklyGoal: number; // minutes per week
  joinDate: string;
}

export type AppView = 'dashboard' | 'courses' | 'lesson' | 'library' | 'progress' | 'roadmap' | 'settings' | 'ai-architect';

export * from './architect';
export * from './course';
