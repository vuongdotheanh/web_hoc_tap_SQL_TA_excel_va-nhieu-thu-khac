import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import type { ArchitectPreferences, GeneratedRoadmap } from '@/types/architect';

interface GeneratePayload {
  preferences: ArchitectPreferences;
  documents: {
    name: string;
    text: string;
    characterCount: number;
  }[];
}

export async function POST(req: NextRequest) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'CONFIG_REQUIRED',
          missingKey: 'GEMINI_API_KEY',
          message:
            'Chưa cấu hình GEMINI_API_KEY trên server. Để kích hoạt tính năng AI Learning Architect phân tích tài liệu thực tế, vui lòng cấu hình biến môi trường GEMINI_API_KEY trong file .env.local.',
          help: {
            file: '.env.local',
            example: 'GEMINI_API_KEY=AIzaSy...',
          },
        },
        { status: 400 }
      );
    }

    const body: GeneratePayload = await req.json();
    const { preferences, documents } = body;

    if (!preferences || !documents || documents.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_INPUT',
          message: 'Vui lòng cung cấp đầy đủ thông tin mục tiêu và ít nhất một tài liệu đã trích xuất văn bản.',
        },
        { status: 400 }
      );
    }

    // Filter documents that actually have text
    const validDocs = documents.filter((d) => d.text && d.text.trim().length > 20);
    if (validDocs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'NO_VALID_TEXT',
          message: 'Các tài liệu đã tải lên không có nội dung văn bản hợp lệ để AI phân tích.',
        },
        { status: 400 }
      );
    }

    // Prepare content excerpts to avoid token limit overflow while preserving rich context
    const maxCharsPerDoc = 25000;
    const documentBriefs = validDocs
      .map(
        (doc, index) =>
          `=== DOCUMENT #${index + 1}: ${doc.name} ===\n${doc.text.slice(0, maxCharsPerDoc)}\n${
            doc.text.length > maxCharsPerDoc ? `... [Đã cắt bớt phần còn lại của tài liệu ${doc.name}]` : ''
          }`
      )
      .join('\n\n');

    const isVi = preferences.language === 'vi';

    const systemInstruction = `
You are SkillBite's Senior Learning Architect and Curriculum Engineer.
Your mission is to transform user-provided source documents into an ultra-practical, high-retention microlearning roadmap for university students and young professionals.

SKILLBITE PHILOSOPHY:
- 10 minutes a day (or user specified: ${preferences.dailyMinutes} mins)
- Scenario-first learning: every single lesson starts with a concrete real-world workplace scenario.
- Practical problem solving: every lesson must contain an interactive hands-on exercise with an expected answer, helpful hint, and thorough explanation.
- Knowledge check: provide a realistic multiple-choice quiz question.
- Explicit and genuine source references: Every lesson must specify where in the provided source materials this concept originates (referencing exact document filename and relevant section, chapter, or slide if mentioned). Do not fabricate source references not present in the documents.
- Review sessions: Include targeted review/consolidation checkpoints.
- Language: Output all titles, explanations, situations, exercises, and quizzes in ${isVi ? 'VIETNAMESE' : 'ENGLISH'}.

USER PREFERENCES:
- Target Roadmap Title: "${preferences.title || 'Lộ trình từ tài liệu'}"
- Specific Learning Goal: "${preferences.goal}"
- Current Skill Level: "${preferences.level}"
- Daily Study Time: ${preferences.dailyMinutes} minutes
- Target Completion: "${preferences.targetDate || 'Tự do theo tiến độ'}"
- Learning Approach: "${preferences.approach}" (explanation-first = lý thuyết trước, example-first = ví dụ thực tế trước, practice-first = thực hành trước)

RESPONSE FORMAT:
You MUST respond with a single, strictly valid JSON object conforming EXACTLY to the following schema with NO markdown code block wrappers (or purely standard json):
{
  "title": "string (refined, inspiring title for the roadmap)",
  "summary": "string (engaging 2-3 sentence summary of the roadmap)",
  "level": "${preferences.level}",
  "totalDurationMinutes": number (sum of all lesson durations),
  "suggestedSchedule": "string (e.g. '14 ngày • 10 phút/ngày')",
  "learningObjectives": ["string", "string", ... at least 3-5 concrete objectives],
  "sourceMaterials": [
    {
      "filename": "string (name of source document)",
      "pagesOrSections": "string (e.g. 'Chương 1-4, Slide 10-35')",
      "topicsCovered": "string (brief summary of topics extracted)"
    }
  ],
  "modules": [
    {
      "id": "mod_1",
      "title": "string (Module 1 Title)",
      "description": "string (brief description of module)",
      "order": 1,
      "lessons": [
        {
          "id": "les_1_1",
          "title": "string (Lesson title)",
          "duration": ${preferences.dailyMinutes},
          "level": "${preferences.level}",
          "situation": "string (Realistic workplace scenario requiring this skill)",
          "keyConcepts": ["concept 1", "concept 2"],
          "explanation": "string (Clear, crisp conceptual breakdown matching the user's preferred approach)",
          "example": "string (Concrete code snippet, formula, or professional dialogue template)",
          "exercise": {
            "prompt": "string (Actionable challenge problem)",
            "initialCode": "string (Starter template or empty string)",
            "expectedAnswer": "string (The concise correct solution or key answer)",
            "hint": "string (Constructive hint without giving it completely away)",
            "explanation": "string (Why this answer is correct and best practices)"
          },
          "quizzes": [
            {
              "id": "quiz_1",
              "type": "multiple_choice",
              "question": "string (Question text testing understanding, application, or problem solving)",
              "options": [
                {"id": "A", "text": "Option A"},
                {"id": "B", "text": "Option B"},
                {"id": "C", "text": "Option C"},
                {"id": "D", "text": "Option D"}
              ],
              "correctOptionId": "B",
              "explanation": "string (Thorough explanation of why this answer is correct)",
              "commonMisconceptions": "string (Why other options are wrong or common misconceptions)",
              "difficulty": "medium",
              "sourceReference": "string (reference to slide/chapter in uploaded document)"
            }
          ],
          "openEndedExercises": [
            {
              "id": "open_1",
              "type": "open_ended",
              "subjectType": "calculation | sql | coding | excel | writing | general (CHOOSE THE ONE MATCHING SUBJECT: e.g. 'calculation' for FCFS scheduling/math, 'sql' for database, 'writing' for communication)",
              "prompt": "string (Deep practical problem, e.g. Given P1(0, 5), P2(2, 3), P3(4, 2), draw Gantt chart and calculate waiting time and turnaround time)",
              "scenario": "string (Specific scenario or workplace context)",
              "instructions": ["Step 1 instructions", "Step 2 instructions"],
              "providedData": "string or structured object of input data",
              "evaluationCriteria": ["Criterion 1 (e.g. Correct arrival order and start times)", "Criterion 2 (e.g. Accurate turnaround time formula)"],
              "rubric": [
                {"criterion": "Correct calculation and method", "maxScore": 6},
                {"criterion": "Clear explanation and conclusion", "maxScore": 4}
              ],
              "sampleSolution": "string (Complete model answer with calculations or expected deliverable)",
              "reasoningExplanation": "string (Step-by-step reasoning)",
              "maxScore": 10,
              "sourceReference": "string",
              "initialTemplate": "string (optional starting template, e.g. Gantt chart template, table headers, or blank)"
            }
          ],
          "sourceReference": "string (e.g. 'Trích từ tài liệu: ${validDocs[0].name}, Phần 2')",
          "isReviewSession": false,
          "order": 1
        }
      ]
    }
  ]
}

CRITICAL EXERCISE REQUIREMENTS:
1. MULTIPLE CHOICE QUIZZES: Each lesson MUST include 3 to 4 distinct, high-quality multiple choice questions testing:
   - Recall and concept comprehension
   - Practical application
   - Analysis / problem solving
   - Each quiz must have 4 options (A, B, C, D) and exactly one correctOptionId matching an option ID.
2. OPEN-ENDED EXERCISES: Each lesson MUST include 1 to 2 open-ended exercises matching the SUBJECT TYPE:
   - If Operating Systems / Math / Algorithms: subjectType="calculation". Example: FCFS scheduling, CPU burst calculations, memory paging. DO NOT USE SQL FOR OS LESSONS!
   - If SQL / Databases: subjectType="sql" with table schemas, sample data, query challenge.
   - If Excel / Data analysis: subjectType="excel" with spreadsheet scenarios, formula writing, pivot tables.
   - If English / Communication: subjectType="writing" with emails, meeting negotiations, persuasive drafting.
   - If general theory: subjectType="general" with analytical problem-solving tasks.
   - Sum of rubric item maxScore MUST equal openEndedExercise.maxScore (e.g. 10).
3. Ensure there are between 2 and 4 modules, with 2 to 3 practical lessons per module (total 4 to 9 bite-sized lessons).
`;

    const ai = new GoogleGenAI({ apiKey });

    // Call Gemini API using gemini-2.5-flash or gemini-2.0-flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemInstruction}\n\nHere are the extracted documents to build the roadmap from:\n${documentBriefs}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const rawOutput = response.text?.trim() || '';

    if (!rawOutput) {
      return NextResponse.json(
        {
          success: false,
          error: 'EMPTY_AI_RESPONSE',
          message: 'AI không trả về nội dung. Vui lòng thử lại.',
        },
        { status: 502 }
      );
    }

    // Clean potential markdown wrap if any
    let cleanedJson = rawOutput;
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    let parsedRoadmap: GeneratedRoadmap;
    try {
      parsedRoadmap = JSON.parse(cleanedJson);
    } catch (parseError: unknown) {
      console.error('Failed to parse AI output as JSON:', parseError, rawOutput);
      return NextResponse.json(
        {
          success: false,
          error: 'MALFORMED_AI_RESPONSE',
          message: 'Định dạng dữ liệu từ AI không hợp lệ. Vui lòng thử tạo lại.',
        },
        { status: 502 }
      );
    }

    // Validate schema
    if (!parsedRoadmap.title || !Array.isArray(parsedRoadmap.modules) || parsedRoadmap.modules.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_ROADMAP_STRUCTURE',
          message: 'Lộ trình tạo ra không đủ các mô-đun bài học cần thiết.',
        },
        { status: 502 }
      );
    }

    // Ensure IDs and metadata are filled
    const roadmapId = `rm_${Date.now()}`;
    parsedRoadmap.id = roadmapId;
    parsedRoadmap.createdAt = new Date().toISOString();
    parsedRoadmap.dailyMinutes = preferences.dailyMinutes;

    let totalCalculatedMinutes = 0;
    parsedRoadmap.modules.forEach((mod, mIdx) => {
      mod.id = mod.id || `mod_${mIdx + 1}`;
      mod.order = mIdx + 1;
      if (Array.isArray(mod.lessons)) {
        mod.lessons.forEach((les, lIdx) => {
          les.id = les.id || `les_${mIdx + 1}_${lIdx + 1}`;
          les.duration = les.duration || preferences.dailyMinutes;
          les.order = lIdx + 1;
          totalCalculatedMinutes += les.duration;

          // Validate and sanitize quizzes
          if (Array.isArray(les.quizzes)) {
            les.quizzes = les.quizzes.filter(q => q && q.question && Array.isArray(q.options) && q.options.length >= 2);
            les.quizzes.forEach((q, qIdx) => {
              q.id = q.id || `quiz_${les.id}_${qIdx + 1}`;
              q.type = 'multiple_choice';
              // Ensure option IDs are present (A, B, C, D)
              q.options.forEach((opt, oIdx) => {
                opt.id = opt.id || String.fromCharCode(65 + oIdx);
                opt.text = String(opt.text || '');
              });
              // Ensure correctOptionId points to an existing option
              const hasOption = q.options.some(o => o.id === q.correctOptionId);
              if (!hasOption && q.options.length > 0) {
                q.correctOptionId = q.options[0].id;
              }
            });
          } else {
            les.quizzes = [];
          }

          // Validate and sanitize open-ended exercises
          if (Array.isArray(les.openEndedExercises)) {
            les.openEndedExercises = les.openEndedExercises.filter(ex => ex && ex.prompt);
            les.openEndedExercises.forEach((ex, exIdx) => {
              ex.id = ex.id || `open_${les.id}_${exIdx + 1}`;
              ex.type = 'open_ended';
              ex.subjectType = ex.subjectType || 'general';
              ex.instructions = Array.isArray(ex.instructions) ? ex.instructions : [ex.instructions || 'Thực hiện yêu cầu đề bài.'];
              ex.evaluationCriteria = Array.isArray(ex.evaluationCriteria) ? ex.evaluationCriteria : ['Đúng phương pháp', 'Giải thích rõ ràng'];
              ex.rubric = Array.isArray(ex.rubric) && ex.rubric.length > 0
                ? ex.rubric
                : [
                    { criterion: 'Đúng kết quả và phương pháp', maxScore: 6 },
                    { criterion: 'Trình bày và giải thích', maxScore: 4 },
                  ];
              ex.maxScore = ex.maxScore || ex.rubric.reduce((acc, r) => acc + (r.maxScore || 0), 0) || 10;
              // Balance rubric to match maxScore if mismatch
              const rubricSum = ex.rubric.reduce((acc, r) => acc + (r.maxScore || 0), 0);
              if (rubricSum !== ex.maxScore && ex.rubric.length > 0) {
                ex.rubric[0].maxScore += (ex.maxScore - rubricSum);
              }
            });
          } else {
            les.openEndedExercises = [];
          }
        });
      }
    });

    parsedRoadmap.totalDurationMinutes = totalCalculatedMinutes || parsedRoadmap.totalDurationMinutes || 60;

    return NextResponse.json({
      success: true,
      roadmap: parsedRoadmap,
    });
  } catch (error: unknown) {
    console.error('AI Generation API error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';

    // Check for quota or invalid key error from Google Gen AI
    if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('apiKey') || errorMsg.includes('403')) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_API_KEY',
          message: 'Khóa GEMINI_API_KEY không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại cấu hình.',
        },
        { status: 401 }
      );
    }

    if (errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota') || errorMsg.includes('429')) {
      return NextResponse.json(
        {
          success: false,
          error: 'QUOTA_EXCEEDED',
          message: 'Hạn ngạch API Gemini tạm thời vượt giới hạn. Vui lòng thử lại sau giây lát.',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'GENERATION_FAILED',
        message: `Lỗi trong quá trình AI phân tích tài liệu: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
}
