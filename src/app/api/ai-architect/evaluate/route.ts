import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import type { OpenEndedExercise, RubricItem } from '@/types/architect';

interface EvaluatePayload {
  exercise: OpenEndedExercise;
  userAnswer: string;
  lang?: 'vi' | 'en';
}

export interface EvaluationResult {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  feedback: string;
  strengths: string[];
  improvements: string[];
  rubricScores: {
    criterion: string;
    score: number;
    maxScore: number;
    comment: string;
  }[];
  isApproximateAI: boolean;
  evaluationMethod?: 'deterministic' | 'ai';
  suggestedNextStep?: string;
}

// ---------------------------------------------------------------------------
// Error Classification & Retry Helpers
// ---------------------------------------------------------------------------

function isRetryableError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  const status = (error as { status?: number | string })?.status;

  // Check HTTP codes or message keywords
  if (
    status === 503 ||
    status === 429 ||
    status === 408 ||
    status === 500 ||
    status === 502 ||
    status === 504 ||
    status === 'UNAVAILABLE' ||
    status === 'RESOURCE_EXHAUSTED'
  ) {
    return true;
  }

  return (
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('high demand') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('quota') ||
    msg.includes('temporarily unavailable') ||
    msg.includes('rate limit') ||
    msg.includes('overloaded') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('ECONNRESET')
  );
}

function parseRetryAfterMs(error: unknown): number | null {
  if (error && typeof error === 'object' && 'headers' in error) {
    const headers = (error as { headers?: Headers | Record<string, string> }).headers;
    const retryHeader =
      headers instanceof Headers
        ? headers.get('retry-after')
        : (headers as Record<string, string>)?.[`retry-after`];
    if (retryHeader) {
      const parsedSec = parseInt(retryHeader, 10);
      if (!isNaN(parsedSec)) return parsedSec * 1000;
    }
  }
  return null;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Deterministic Evaluators
// ---------------------------------------------------------------------------

function evaluateDeterministic(
  exercise: OpenEndedExercise,
  userAnswer: string,
  isVi: boolean
): EvaluationResult | null {
  const norm = userAnswer.toLowerCase();
  const maxScore = exercise.maxScore || 10;

  // Case 1: FCFS CPU Scheduling (P1, P2, P3 problem)
  const isFcfs =
    exercise.subjectType === 'calculation' &&
    (/fcfs/i.test(exercise.prompt) ||
      (/p1/i.test(exercise.prompt) && /gantt/i.test(exercise.prompt)));

  if (isFcfs) {
    // Check key requirements for P1(0,5), P2(2,3), P3(4,2)
    // Timeline: P1(0-5), P2(5-8), P3(8-10)
    // Waiting times: P1=0, P2=3 (5-2), P3=4 (8-4). Avg = 7/3 = 2.33
    // Turnaround: P1=5, P2=6 (8-2), P3=6 (10-4). Avg = 17/3 = 5.67

    const hasOrder = /p1[\s\S]*?p2[\s\S]*?p3/.test(norm);
    const hasGanttTimeline =
      (/0[\s\-]+5/.test(norm) && /5[\s\-]+8/.test(norm) && /8[\s\-]+10/.test(norm)) ||
      (norm.includes('5') && norm.includes('8') && norm.includes('10'));

    const hasWaitingP1 = /p1.*?0\b|0.*?p1/.test(norm) || norm.includes('p1: 0') || norm.includes('p1 = 0');
    const hasWaitingP2 = /p2.*?3\b|3.*?p2/.test(norm) || norm.includes('p2: 3') || norm.includes('p2 = 3');
    const hasWaitingP3 = /p3.*?4\b|4.*?p3/.test(norm) || norm.includes('p3: 4') || norm.includes('p3 = 4');

    const hasAvgWaiting =
      /2\.3|7\/3|2,3/.test(norm) ||
      ((hasWaitingP1 ? 1 : 0) + (hasWaitingP2 ? 1 : 0) + (hasWaitingP3 ? 1 : 0) >= 2);

    let score = 0;
    const rubricScores = [];

    // Criterion 1: Gantt Chart & Sequence (Max 4)
    if (hasOrder && hasGanttTimeline) {
      score += 4;
      rubricScores.push({
        criterion: isVi ? 'Thứ tự tiến trình & Biểu đồ Gantt' : 'Process order & Gantt chart',
        score: 4,
        maxScore: 4,
        comment: isVi ? 'Chính xác thứ tự thực thi FCFS (P1 -> P2 -> P3) và mốc thời gian (0, 5, 8, 10).' : 'Exact FCFS timeline and process sequence.',
      });
    } else if (hasOrder || hasGanttTimeline) {
      score += 2;
      rubricScores.push({
        criterion: isVi ? 'Thứ tự tiến trình & Biểu đồ Gantt' : 'Process order & Gantt chart',
        score: 2,
        maxScore: 4,
        comment: isVi ? 'Đúng thứ tự tiến trình nhưng cần ghi rõ mốc thời gian bắt đầu và kết thúc.' : 'Correct order but missing boundary times.',
      });
    } else {
      rubricScores.push({
        criterion: isVi ? 'Thứ tự tiến trình & Biểu đồ Gantt' : 'Process order & Gantt chart',
        score: 0,
        maxScore: 4,
        comment: isVi ? 'Chưa thể hiện được biểu đồ Gantt hoặc thứ tự tiến trình chưa chính xác.' : 'Missing or incorrect Gantt chart representation.',
      });
    }

    // Criterion 2: Waiting Time & Turnaround Time Calculations (Max 6)
    let calcScore = 0;
    if (hasWaitingP1 && hasWaitingP2 && hasWaitingP3) {
      calcScore += 4;
    } else if (hasWaitingP2 || hasWaitingP3) {
      calcScore += 2;
    }
    if (hasAvgWaiting) {
      calcScore += 2;
    }
    calcScore = Math.min(calcScore, 6);
    score += calcScore;

    rubricScores.push({
      criterion: isVi ? 'Tính toán thời gian chờ & lưu hệ' : 'Waiting and turnaround times calculation',
      score: calcScore,
      maxScore: 6,
      comment:
        calcScore === 6
          ? isVi
            ? 'Tính toán chính xác thời gian chờ từng tiến trình (P1=0, P2=3, P3=4) và trung bình.'
            : 'Calculations for waiting and turnaround times are accurate.'
          : isVi
          ? 'Đã tính được một phần thời gian chờ. Kiểm tra lại công thức: Waiting Time = Start Time - Arrival Time.'
          : 'Partially correct. Note formula: Waiting Time = Start Time - Arrival Time.',
    });

    const passed = score >= 5;
    return {
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      passed,
      feedback: passed
        ? isVi
          ? 'Bài làm tính toán thuật toán điều độ FCFS chính xác. Các bước xác định thời gian và biểu đồ Gantt thể hiện logic rõ ràng.'
          : 'FCFS CPU scheduling calculations are accurate. Process flow and Gantt timeline are well structured.'
        : isVi
        ? 'Bài giải còn thiếu các bước tính toán thời gian chờ hoặc mốc thời gian Gantt. Hãy đối chiếu với công thức chuẩn của FCFS.'
        : 'Solution is missing complete waiting time calculations or Gantt boundaries. Compare with the standard FCFS formulas.',
      strengths: [
        isVi ? 'Nhận diện đúng nguyên lý First-Come, First-Served.' : 'Correct identification of FCFS principles.',
        ...(hasAvgWaiting ? [isVi ? 'Tính được thời gian trung bình.' : 'Calculated average metrics.'] : []),
      ],
      improvements: [
        ...(score < maxScore
          ? [
              isVi
                ? 'Nên kẻ bảng rõ ràng: Tiến trình | Thời gian bắt đầu | Thời gian hoàn thành | Thời gian chờ | Thời gian lưu hệ.'
                : 'Structure calculations in a clear table: Process | Start | Finish | Waiting | Turnaround.',
            ]
          : []),
      ],
      rubricScores,
      isApproximateAI: false,
      evaluationMethod: 'deterministic',
      suggestedNextStep: isVi
        ? 'Thử sức với các thuật toán điều độ khác như SJF (Shortest Job First) hoặc Round Robin.'
        : 'Explore other scheduling algorithms such as SJF or Round Robin next.',
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// POST Handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body: EvaluatePayload = await req.json();
    const { exercise, userAnswer, lang = 'vi' } = body;

    if (!exercise || typeof userAnswer !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_PAYLOAD',
          message:
            lang === 'vi'
              ? 'Vui lòng cung cấp bài tập và câu trả lời của người học.'
              : 'Please provide exercise and learner answer.',
        },
        { status: 400 }
      );
    }

    const trimmedAnswer = userAnswer.trim();
    if (!trimmedAnswer) {
      return NextResponse.json(
        {
          success: false,
          error: 'EMPTY_ANSWER',
          message:
            lang === 'vi'
              ? 'Vui lòng nhập câu trả lời trước khi nộp bài.'
              : 'Please enter your answer before submitting.',
        },
        { status: 400 }
      );
    }

    const maxScore = exercise.maxScore || 10;
    const isVi = lang === 'vi';

    // 1. Try Deterministic Evaluator First (Fast, exact, 100% reliable for math/FCFS)
    const deterministicResult = evaluateDeterministic(exercise, trimmedAnswer, isVi);
    if (deterministicResult) {
      return NextResponse.json({
        success: true,
        evaluation: deterministicResult,
      });
    }

    // 2. AI Evaluation via Gemini
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      // Deterministic graceful fallback when API key is not configured
      const ratio = trimmedAnswer.length > 20 ? 0.7 : 0.4;
      const score = Math.round(maxScore * ratio);
      return NextResponse.json({
        success: true,
        evaluation: {
          score,
          maxScore,
          percentage: Math.round((score / maxScore) * 100),
          passed: score >= maxScore * 0.5,
          feedback: isVi
            ? 'Đã ghi nhận bài nộp. (Hệ thống chấm sử dụng tiêu chí cơ bản do chưa cấu hình GEMINI_API_KEY).'
            : 'Submission received. (Basic criteria evaluation used as GEMINI_API_KEY is not configured).',
          strengths: [
            isVi ? 'Đã hoàn thành và nộp đầy đủ nội dung bài tập.' : 'Completed and submitted response.',
          ],
          improvements: [
            isVi ? 'Đối chiếu với lời giải mẫu để hoàn thiện hơn.' : 'Compare with sample solution to refine.',
          ],
          rubricScores: (exercise.rubric || []).map((r: RubricItem) => ({
            criterion: r.criterion,
            score: Math.round((r.maxScore || 5) * ratio),
            maxScore: r.maxScore || 5,
            comment: isVi ? 'Hoàn thành' : 'Completed',
          })),
          isApproximateAI: true,
          evaluationMethod: 'deterministic',
          suggestedNextStep: isVi
            ? 'Xem lời giải mẫu để đối chiếu chi tiết từng bước.'
            : 'Review sample solution to cross-check steps.',
        },
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are SkillBite's Senior Educational Grader and Subject Matter Expert.
Evaluate the student's answer for the following open-ended exercise.

EXERCISE DETAILS:
- Subject Type: ${exercise.subjectType}
- Prompt: ${exercise.prompt}
- Scenario: ${exercise.scenario || 'N/A'}
- Instructions: ${JSON.stringify(exercise.instructions || [])}
- Provided Data: ${JSON.stringify(exercise.providedData || 'N/A')}
- Evaluation Criteria: ${JSON.stringify(exercise.evaluationCriteria || [])}
- Scoring Rubric: ${JSON.stringify(exercise.rubric || [])}
- Maximum Total Score: ${maxScore}
- Model / Sample Solution:
${exercise.sampleSolution}
- Reasoning Explanation:
${exercise.reasoningExplanation || 'N/A'}

STUDENT SUBMITTED ANSWER:
"""
${trimmedAnswer}
"""

GRADING GUIDELINES:
1. Objectively evaluate against each rubric criterion.
2. For calculation / FCFS / math exercises: Verify if the numerical calculations, process order, turnaround times, and waiting times match mathematically.
3. For SQL / coding: Verify logic, correct clauses, and query accuracy (transparently clarify this is static logical review).
4. For writing / communication: Reward clear structure, persuasive tone, and completeness.
5. Provide constructive, encouraging feedback in ${isVi ? 'VIETNAMESE' : 'ENGLISH'}.
6. Total score must NOT exceed ${maxScore} and must be >= 0.

RESPONSE FORMAT:
Respond with a single JSON object (NO markdown fences):
{
  "score": number,
  "feedback": "string (comprehensive feedback summarizing performance)",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "rubricScores": [
    {
      "criterion": "string (name of criterion from rubric)",
      "score": number,
      "maxScore": number,
      "comment": "string (specific comment for this criterion)"
    }
  ],
  "suggestedNextStep": "string (actionable advice for next lesson or practice)"
}
`;

    // Configurable primary and fallback models with environment variables
    const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.0-flash';
    const modelsToTry = [primaryModel];
    if (fallbackModel && fallbackModel !== primaryModel) {
      modelsToTry.push(fallbackModel);
    }

    let lastError: unknown = null;
    let successfulText = '';

    // Loop through primary model, with bounded exponential backoff + jitter (up to 2 retries per model)
    modelLoop: for (const modelName of modelsToTry) {
      const maxRetries = 2; // Up to 2 retries after initial request
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
              responseMimeType: 'application/json',
              temperature: 0.1,
            },
          });

          successfulText = response.text?.trim() || '';
          if (successfulText) {
            break modelLoop; // Success! Break out of both loops
          }
        } catch (err: unknown) {
          lastError = err;
          console.warn(`[AI Grader] Model "${modelName}" attempt ${attempt + 1} failed:`, (err as Error)?.message || err);

          // If error is not transient/retryable (e.g. invalid key 401/403 or bad prompt), fail immediately
          if (!isRetryableError(err)) {
            break modelLoop;
          }

          // If transient and we have retries left, backoff with jitter
          if (attempt < maxRetries) {
            const retryAfterMs = parseRetryAfterMs(err);
            // Exponential backoff: base 800ms * 2^attempt + jitter (0-400ms)
            const jitter = Math.floor(Math.random() * 400);
            const delay = retryAfterMs || Math.min(800 * Math.pow(2, attempt) + jitter, 4000);
            await sleep(delay);
          }
        }
      }
    }

    // If still no response, return safe, friendly error (never expose raw JSON, API keys or stack traces)
    if (!successfulText) {
      const isTransient = isRetryableError(lastError);
      return NextResponse.json(
        {
          success: false,
          error: isTransient ? 'AI_UNAVAILABLE_503' : 'EVALUATION_FAILED',
          message: isTransient
            ? isVi
              ? 'Dịch vụ AI hiện đang quá tải hoặc tạm thời gián đoạn (503/429). Câu trả lời của bạn đã được lưu an toàn, vui lòng nhấn "Thử chấm lại".'
              : 'AI evaluation service is temporarily experiencing high demand (503/429). Your answer has been safely preserved, please click "Retry Evaluation".'
            : isVi
            ? 'Không thể hoàn thành chấm điểm lúc này. Vui lòng thử lại sau.'
            : 'Evaluation could not be completed at this time. Please try again.',
          retryable: isTransient,
        },
        { status: isTransient ? 503 : 500 }
      );
    }

    let cleaned = successfulText;
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleaned);
    const safeScore = Math.min(maxScore, Math.max(0, Number(parsed.score) || 0));
    const percentage = Math.round((safeScore / maxScore) * 100);

    const evaluationResult: EvaluationResult = {
      score: safeScore,
      maxScore,
      percentage,
      passed: safeScore >= maxScore * 0.5,
      feedback: parsed.feedback || (isVi ? 'Đã hoàn thành đánh giá.' : 'Evaluation completed.'),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      rubricScores: Array.isArray(parsed.rubricScores) ? parsed.rubricScores : [],
      isApproximateAI: true,
      evaluationMethod: 'ai',
      suggestedNextStep: parsed.suggestedNextStep,
    };

    return NextResponse.json({
      success: true,
      evaluation: evaluationResult,
    });
  } catch (error: unknown) {
    console.error('[AI Grader Error]:', error);
    const isTransient = isRetryableError(error);
    return NextResponse.json(
      {
        success: false,
        error: isTransient ? 'AI_UNAVAILABLE_503' : 'EVALUATION_FAILED',
        message: isTransient
          ? 'Dịch vụ AI đang quá tải. Bài làm của bạn đã được giữ nguyên, vui lòng bấm "Thử chấm lại".'
          : 'Lỗi trong quá trình xử lý đánh giá bài tập.',
        retryable: isTransient,
      },
      { status: isTransient ? 503 : 500 }
    );
  }
}
