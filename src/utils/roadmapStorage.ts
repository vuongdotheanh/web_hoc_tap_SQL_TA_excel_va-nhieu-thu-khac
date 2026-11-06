import type { GeneratedRoadmap, GeneratedLesson } from '@/types/architect';
import type { Lesson } from '@/types';

const STORAGE_KEY = 'skillbite_custom_roadmaps';

export function getSavedRoadmaps(): GeneratedRoadmap[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse saved roadmaps from localStorage:', e);
    return [];
  }
}

export function saveRoadmapToStorage(roadmap: GeneratedRoadmap): GeneratedRoadmap[] {
  if (typeof window === 'undefined') return [];
  const existing = getSavedRoadmaps();
  const filtered = existing.filter((r) => r.id !== roadmap.id);
  const updated = [roadmap, ...filtered];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save roadmap to localStorage:', e);
  }
  return updated;
}

export function deleteRoadmapFromStorage(roadmapId: string): GeneratedRoadmap[] {
  if (typeof window === 'undefined') return [];
  const existing = getSavedRoadmaps();
  const updated = existing.filter((r) => r.id !== roadmapId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete roadmap from localStorage:', e);
  }
  return updated;
}

// Convert a GeneratedLesson into standard SkillBite Lesson for interactive LessonView
export function convertToLessonViewFormat(
  generatedLesson: GeneratedLesson,
  roadmapTitle: string
): Lesson {
  // Infer skillId based on openEndedExercises subjectType if available
  let skillId = 'custom-ai';
  if (generatedLesson.openEndedExercises && generatedLesson.openEndedExercises.length > 0) {
    const subType = generatedLesson.openEndedExercises[0].subjectType;
    if (subType === 'sql') skillId = 'sql';
    else if (subType === 'excel') skillId = 'excel';
    else if (subType === 'writing') skillId = 'english';
    else if (subType === 'calculation') skillId = 'os-calculation';
  }

  const steps: Lesson['steps'] = [
    {
      id: `${generatedLesson.id}_step1`,
      type: 'content',
      title: generatedLesson.title,
      content: generatedLesson.explanation,
      example: generatedLesson.example,
    },
  ];

  // If new structured openEndedExercises exist, add them or fallback to exercise
  if (generatedLesson.openEndedExercises && generatedLesson.openEndedExercises.length > 0) {
    generatedLesson.openEndedExercises.forEach((openEx, idx) => {
      steps.push({
        id: `${generatedLesson.id}_open_${idx + 1}`,
        type: 'open_ended',
        title: openEx.prompt ? openEx.prompt.slice(0, 50) + (openEx.prompt.length > 50 ? '...' : '') : `Bài tập tự luận ${idx + 1}`,
        content: openEx.prompt,
        openEndedExercise: openEx,
      });
    });
  } else if (generatedLesson.exercise) {
    steps.push({
      id: `${generatedLesson.id}_step2`,
      type: 'exercise',
      title: 'Thực hành thử thách 10 phút',
      content: generatedLesson.exercise.prompt,
      exercise: {
        prompt: generatedLesson.exercise.prompt,
        initialCode: generatedLesson.exercise.initialCode || '',
        expectedAnswer: generatedLesson.exercise.expectedAnswer,
        hint: generatedLesson.exercise.hint,
        explanation: generatedLesson.exercise.explanation,
      },
    });
  }

  // If new structured quizzes exist
  if (generatedLesson.quizzes && generatedLesson.quizzes.length > 0) {
    generatedLesson.quizzes.forEach((q, idx) => {
      steps.push({
        id: `${generatedLesson.id}_quiz_${idx + 1}`,
        type: 'quiz',
        title: `Trắc nghiệm ${idx + 1}: ${q.question.slice(0, 40)}...`,
        content: q.question,
        quizQuestion: q,
      });
    });
  } else if (generatedLesson.quiz) {
    steps.push({
      id: `${generatedLesson.id}_step3`,
      type: 'quiz',
      title: 'Kiểm tra kiến thức nhanh',
      content: generatedLesson.quiz.question,
      exercise: {
        prompt: `${generatedLesson.quiz.question}\n\nLựa chọn:\n${generatedLesson.quiz.options
          .map((opt: string, i: number) => `${String.fromCharCode(65 + i)}. ${opt}`)
          .join('\n')}`,
        initialCode: '',
        expectedAnswer: String.fromCharCode(65 + (generatedLesson.quiz.correctAnswer || 0)),
        hint: 'Đọc kỹ câu hỏi và các phương án trước khi chọn.',
        explanation: generatedLesson.quiz.explanation,
      },
    });
  }

  return {
    id: generatedLesson.id,
    skillId,
    title: generatedLesson.title,
    description: `${roadmapTitle} • ${generatedLesson.sourceReference || 'Nội dung trích xuất từ tài liệu'}`,
    duration: generatedLesson.duration || 10,
    level: 'Cơ bản',
    situation: generatedLesson.situation || 'Áp dụng kiến thức thực chiến để giải quyết bài toán đặt ra.',
    completed: false,
    order: generatedLesson.order || 1,
    steps,
    quizzes: generatedLesson.quizzes || [],
    openEndedExercises: generatedLesson.openEndedExercises || [],
  };
}
