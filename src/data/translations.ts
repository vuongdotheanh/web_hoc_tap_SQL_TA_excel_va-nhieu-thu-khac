// Centralized translation dictionary for VI/EN bilingual support

export type Lang = 'vi' | 'en';

export const translations = {
  // Navigation
  nav: {
    overview: { vi: 'Tổng quan', en: 'Overview' },
    courses: { vi: 'Môn học của tôi', en: 'My Courses' },
    learningPaths: { vi: 'Lộ trình học', en: 'Learning Paths' },
    skillLibrary: { vi: 'Thư viện kỹ năng', en: 'Skill Library' },
    progress: { vi: 'Tiến độ', en: 'Progress' },
    settings: { vi: 'Cài đặt', en: 'Settings' },
  },

  // Dashboard
  dashboard: {
    headline: {
      vi: '10 phút hôm nay.\nChinh phục một kỹ năng mới.',
      en: '10 minutes today.\nConquer a new skill.',
    },
    startChallenge: { vi: 'Bắt đầu thử thách', en: 'Start Challenge' },
    todayChallenge: { vi: 'THỬ THÁCH HÔM NAY', en: "TODAY'S CHALLENGE" },
    greeting: { vi: 'Xin chào', en: 'Hello' },
    readyToLearn: { vi: 'Sẵn sàng chinh phục kiến thức mới?', en: 'Ready to conquer new knowledge?' },
    streakDays: { vi: 'ngày liên tiếp', en: 'day streak' },
    minutes: { vi: 'phút', en: 'min' },
    minutesLearned: { vi: 'phút đã học', en: 'minutes learned' },
    weeklyGoal: { vi: 'Mục tiêu tuần', en: 'Weekly Goal' },
    skillTracks: { vi: 'LỘ TRÌNH KỸ NĂNG', en: 'SKILL TRACKS' },
    continueLearning: { vi: 'Tiếp tục học', en: 'Continue Learning' },
    lessonsCompleted: { vi: 'bài đã xong', en: 'completed' },
    totalLessons: { vi: 'bài học', en: 'lessons' },
    weeklyActivity: { vi: 'HOẠT ĐỘNG TUẦN NÀY', en: 'THIS WEEK' },
    reviewTopics: { vi: 'CHỦ ĐỀ ÔN TẬP', en: 'REVIEW TOPICS' },
    suggestedReview: { vi: 'Đề xuất ôn luyện', en: 'Suggested review' },
    exploreAll: { vi: 'Khám phá tất cả →', en: 'Explore all →' },
    level: { vi: 'Trình độ', en: 'Level' },
    duration: { vi: 'Thời lượng', en: 'Duration' },
    basic: { vi: 'Cơ bản', en: 'Basic' },
    intermediate: { vi: 'Trung cấp', en: 'Intermediate' },
    advanced: { vi: 'Nâng cao', en: 'Advanced' },
  },

  // Skill descriptions
  skills: {
    excel: {
      name: { vi: 'Excel', en: 'Excel' },
      subtitle: { vi: 'Data Explorer', en: 'Data Explorer' },
      scenario: {
        vi: 'Biến 500 bản ghi bán hàng thành báo cáo đầy insight.',
        en: 'Transform 500 sales records into an insightful report.',
      },
      category: { vi: 'Công cụ phân tích', en: 'Analytics Tool' },
    },
    sql: {
      name: { vi: 'SQL', en: 'SQL' },
      subtitle: { vi: 'Query Master', en: 'Query Master' },
      scenario: {
        vi: 'Tính doanh thu hàng tháng bằng GROUP BY và SUM.',
        en: 'Calculate monthly revenue using GROUP BY and SUM.',
      },
      category: { vi: 'Ngôn ngữ truy vấn', en: 'Query Language' },
    },
    english: {
      name: { vi: 'English', en: 'English' },
      subtitle: { vi: 'Communication Lab', en: 'Communication Lab' },
      scenario: {
        vi: 'Giải thích chậm deadline và đề xuất lịch mới cho sếp.',
        en: 'Explain a delay and propose a revised deadline to a manager.',
      },
      category: { vi: 'Kỹ năng giao tiếp', en: 'Communication Skills' },
    },
  },

  // Lesson
  lesson: {
    step: { vi: 'Bước', en: 'Step' },
    of: { vi: '/', en: 'of' },
    back: { vi: 'Quay lại', en: 'Back' },
    continue: { vi: 'Tiếp tục', en: 'Continue' },
    check: { vi: 'Kiểm tra', en: 'Check' },
    hint: { vi: 'Gợi ý', en: 'Hint' },
    showSolution: { vi: 'Xem đáp án', en: 'Show Solution' },
    correct: { vi: 'Chính xác!', en: 'Correct!' },
    incorrect: { vi: 'Chưa đúng.', en: 'Not quite right.' },
    tryAgain: { vi: 'Hãy thử lại hoặc xem gợi ý nhé!', en: 'Try again or check the hint!' },
    completed: { vi: 'Hoàn thành', en: 'Completed' },
    completionTitle: { vi: 'Hoàn thành xuất sắc!', en: 'Excellent work!' },
    completionDesc: { vi: 'Bạn đã hoàn thành bài', en: 'You completed the lesson' },
    studyTime: { vi: 'Thời gian học', en: 'Study time' },
    streak: { vi: 'Chuỗi ngày', en: 'Streak' },
    backToDashboard: { vi: 'Quay về Dashboard', en: 'Back to Dashboard' },
    nextLesson: { vi: 'Bài tiếp theo →', en: 'Next lesson →' },
    copyCode: { vi: 'Sao chép', en: 'Copy' },
    copied: { vi: 'Đã chép', en: 'Copied' },
    challenge: { vi: 'THỬ THÁCH', en: 'CHALLENGE' },
    objective: { vi: 'Mục tiêu', en: 'Objective' },
    scenario: { vi: 'Tình huống', en: 'Scenario' },
    tabTheory: { vi: 'Lý thuyết', en: 'Theory' },
    tabQuiz: { vi: 'Trắc nghiệm', en: 'Quiz' },
    tabOpenEnded: { vi: 'Tự luận thực chiến', en: 'Open-ended Practice' },
    quizTitle: { vi: 'Kiểm tra trắc nghiệm nhanh', en: 'Quick Multiple-Choice Quiz' },
    quizQuestionCount: { vi: 'Câu hỏi', en: 'Question' },
    selectOptionPrompt: { vi: 'Chọn một đáp án đúng nhất bên dưới:', en: 'Select the best answer below:' },
    submitAnswer: { vi: 'Nộp câu trả lời', en: 'Submit Answer' },
    submitEvaluation: { vi: 'Chấm điểm bằng AI', en: 'Grade with AI' },
    evaluating: { vi: 'Đang chấm điểm...', en: 'Grading answer...' },
    nextQuestion: { vi: 'Câu hỏi tiếp theo', en: 'Next Question' },
    seeResults: { vi: 'Xem kết quả', en: 'See Results' },
    quizCompleted: { vi: 'Đã hoàn thành phần trắc nghiệm!', en: 'Quiz section completed!' },
    quizSummaryTitle: { vi: 'Kết quả phần trắc nghiệm', en: 'Quiz Summary & Performance' },
    quizSummaryScore: { vi: 'Bạn đã trả lời đúng {score} trên {total} câu.', en: 'You got {score} out of {total} correct.' },
    reviewAnswers: { vi: 'Xem lại chi tiết từng câu:', en: 'Review answer breakdown:' },
    quizScore: { vi: 'Điểm trắc nghiệm', en: 'Quiz Score' },
    openEndedTitle: { vi: 'Bài tập tự luận & Phân tích thực tế', en: 'Open-Ended & Analytical Exercise' },
    instructions: { vi: 'Hướng dẫn các bước:', en: 'Step-by-step Instructions:' },
    providedDataLabel: { vi: 'Dữ liệu bài toán cung cấp:', en: 'Provided Problem Data / Context:' },
    evaluationCriteriaLabel: { vi: 'Tiêu chí đánh giá:', en: 'Evaluation Criteria:' },
    rubricLabel: { vi: 'Thang điểm (Rubric):', en: 'Scoring Rubric:' },
    yourAnswerLabel: { vi: 'Bài làm của bạn:', en: 'Your Solution:' },
    yourAnswerPlaceholder: { vi: 'Nhập lời giải, bảng tính toán, câu lệnh hoặc bài viết phân tích...', en: 'Enter your calculations, code, table, or structured response...' },
    seeSampleSolution: { vi: 'Xem lời giải mẫu', en: 'View Model Solution' },
    sampleSolutionTitle: { vi: 'Lời giải mẫu & Giải thích chi tiết', en: 'Model Solution & Detailed Explanation' },
    scoreEarned: { vi: 'Điểm đạt được', en: 'Score Earned' },
    aiFeedback: { vi: 'Nhận xét từ AI Grader', en: 'Feedback from AI Grader' },
    strengths: { vi: 'Điểm tốt:', en: 'Strengths:' },
    improvements: { vi: 'Cần cải thiện:', en: 'Areas for Improvement:' },
    retryExercise: { vi: 'Làm lại', en: 'Retry' },
    approximateNotice: { vi: 'Lưu ý: Đánh giá bằng AI mang tính chất định hướng và hỗ trợ học tập.', en: 'Note: AI evaluation is an educational guide and approximate review.' },
    sourceRef: { vi: 'Nguồn tham chiếu:', en: 'Source Reference:' },
    misconception: { vi: 'Lưu ý lỗi thường gặp:', en: 'Common Misconceptions:' },
    aiServiceUnavailable: {
      vi: 'Dịch vụ AI hiện đang quá tải hoặc tạm thời gián đoạn (503/429). Bài làm của bạn đã được giữ nguyên an toàn.',
      en: 'AI evaluation service is temporarily unavailable or experiencing high demand (503/429). Your answer has been safely preserved.',
    },
    retryEvaluation: { vi: 'Thử chấm lại', en: 'Retry Evaluation' },
    deterministicEvaluationNotice: {
      vi: 'Bài làm được chấm tự động bằng thuật toán kiểm tra chính xác (Deterministic Validator).',
      en: 'Answer evaluated deterministically by automated validation engine.',
    },
    preserveAnswerNotice: {
      vi: 'Câu trả lời của bạn vẫn được lưu trong khung nhập. Bạn có thể nhấn nút "Thử chấm lại" bên dưới.',
      en: 'Your submitted answer is safely retained above. You can click "Retry Evaluation" below.',
    },
  },

  // Roadmap / Quest map
  // AI Learning Architect
  aiArchitect: {
    bannerTitle: { vi: 'Tạo lộ trình từ tài liệu', en: 'Build a roadmap from documents' },
    bannerDesc: {
      vi: 'Tải slide, PDF hoặc giáo trình lên. AI sẽ giúp bạn tạo lộ trình và bài học phù hợp với mục tiêu.',
      en: 'Upload slides, PDFs, or study materials. AI will create a learning roadmap tailored to your goals.',
    },
    bannerButton: { vi: 'Tải tài liệu lên', en: 'Upload materials' },
    bannerBadge: { vi: 'AI ARCHITECT • LỘ TRÌNH CÁ NHÂN HÓA', en: 'AI ARCHITECT • PERSONALIZED ROADMAP' },
    entry: { vi: 'Kiến trúc học AI', en: 'AI Learning Architect' },
    title: { vi: 'AI Learning Architect', en: 'AI Learning Architect' },
    subtitle: {
      vi: 'Biến tài liệu học tập thành các bài học 10 phút tinh gọn, thực chiến',
      en: 'Transform study materials into focused, 10-minute practical lessons',
    },
    stepUpload: { vi: '1. Tải tài liệu', en: '1. Upload Materials' },
    stepPreferences: { vi: '2. Mục tiêu học', en: '2. Preferences' },
    stepGenerating: { vi: '3. Phân tích AI', en: '3. AI Analysis' },
    stepReview: { vi: '4. Xem & Lưu lộ trình', en: '4. Review & Save' },

    // Upload Step
    dropzoneTitle: { vi: 'Kéo thả tài liệu vào đây hoặc nhấn để chọn file', en: 'Drag & drop materials here or click to browse' },
    dropzoneHint: {
      vi: 'Hỗ trợ PDF, DOCX, PPTX, TXT, Markdown • Tối đa 5 file, 20MB/file, tổng dung lượng tối đa 40MB',
      en: 'Supports PDF, DOCX, PPTX, TXT, Markdown • Max 5 files, 20MB/file, 40MB max total',
    },
    selectFiles: { vi: 'Chọn tài liệu từ máy', en: 'Select documents from device' },
    uploadedFiles: { vi: 'Danh sách tài liệu đã chọn', en: 'Selected Documents' },
    noFilesYet: { vi: 'Chưa có tài liệu nào được chọn.', en: 'No documents selected yet.' },
    removeFile: { vi: 'Xóa', en: 'Remove' },
    retryFile: { vi: 'Trích xuất lại', en: 'Retry' },
    previewText: { vi: 'Xem trước văn bản', en: 'Preview text' },
    charsCount: { vi: 'ký tự', en: 'characters' },
    extractedBadge: { vi: 'Đã trích xuất', en: 'Extracted' },
    extractingBadge: { vi: 'Đang trích xuất...', en: 'Extracting...' },
    scannedWarningTitle: { vi: 'Cảnh báo: Không tìm thấy văn bản trích xuất', en: 'Warning: No extractable text found' },
    scannedWarningText: {
      vi: 'Tài liệu này có thể là bản scan dạng hình ảnh hoặc file rỗng. Vui lòng sử dụng file có thể chọn chữ hoặc tài liệu text để AI đọc được.',
      en: 'This file appears to be a scanned image or empty. Please provide a text-based document so AI can analyze it.',
    },
    corruptErrorTitle: { vi: 'Không thể đọc file', en: 'Unable to parse file' },
    limitWarning: {
      vi: 'Giới hạn: Tối đa 5 file, mỗi file tối đa 20MB, tổng cộng không quá 40MB.',
      en: 'Limits: Up to 5 files, maximum 20MB each, total 40MB.',
    },
    nextToPreferences: { vi: 'Tiếp tục thiết lập mục tiêu →', en: 'Continue to learning preferences →' },
    needAtLeastOneValid: {
      vi: 'Vui lòng tải lên ít nhất 1 tài liệu có văn bản hợp lệ để tiếp tục.',
      en: 'Please upload at least 1 document with valid text content to proceed.',
    },

    // Preferences Step
    prefTitle: { vi: 'Thiết lập mục tiêu & phong cách học', en: 'Set Learning Goals & Style' },
    prefSubtitle: {
      vi: 'Tùy chỉnh lộ trình dựa trên quỹ thời gian và trình độ thực tế của bạn',
      en: 'Tailor the roadmap to your actual available time and current level',
    },
    roadmapTitleLabel: { vi: 'Tên lộ trình học', en: 'Roadmap title' },
    roadmapTitlePlaceholder: {
      vi: 'VD: SQL Phân tích dữ liệu kinh doanh, Excel tài chính...',
      en: 'e.g., Practical SQL for Business Analytics, Finance in Excel...',
    },
    goalLabel: { vi: 'Mục tiêu học tập cụ thể', en: 'Specific learning goal' },
    goalPlaceholder: {
      vi: 'VD: Cần nắm vững GROUP BY và JOIN để tự xuất báo cáo doanh thu tuần tới...',
      en: 'e.g., Need to master GROUP BY and JOIN to generate weekly revenue reports...',
    },
    levelLabel: { vi: 'Trình độ hiện tại', en: 'Current knowledge level' },
    levelBeginner: { vi: 'Mới bắt đầu (Chưa có nền tảng)', en: 'Beginner (No prior background)' },
    levelBasic: { vi: 'Cơ bản (Đã biết khái niệm)', en: 'Basic (Familiar with concepts)' },
    levelIntermediate: { vi: 'Trung cấp (Đã từng thực hành)', en: 'Intermediate (Hands-on practice)' },
    levelAdvanced: { vi: 'Nâng cao (Muốn tối ưu chuyên sâu)', en: 'Advanced (Deep optimization)' },

    dailyTimeLabel: { vi: 'Thời gian học mỗi ngày', en: 'Daily study commitment' },
    targetDateLabel: { vi: 'Hạn chót mục tiêu (Tùy chọn)', en: 'Target completion date (Optional)' },
    languageLabel: { vi: 'Ngôn ngữ nội dung bài học', en: 'Lesson content language' },
    langVi: { vi: 'Tiếng Việt', en: 'Vietnamese' },
    langEn: { vi: 'English (Tiếng Anh)', en: 'English' },

    approachLabel: { vi: 'Phương pháp tiếp cận ưu tiên', en: 'Preferred learning approach' },
    approachExplanation: { vi: 'Lý thuyết trước (Hiểu cốt lõi rồi thực hành)', en: 'Explanation-first (Core theory then practice)' },
    approachExample: { vi: 'Ví dụ trước (Quan sát tình huống thực tế rồi áp dụng)', en: 'Example-first (Observe cases then apply)' },
    approachPractice: { vi: 'Thực hành trước (Bắt tay giải bài tập ngay)', en: 'Practice-first (Jump straight into hands-on)' },

    backToUpload: { vi: '← Quay lại tải tài liệu', en: '← Back to documents' },
    generateAction: { vi: 'Tạo lộ trình bằng AI', en: 'Generate AI roadmap' },

    // Processing Step
    generatingTitle: { vi: 'AI đang phân tích tài liệu và kiến trúc lộ trình...', en: 'AI is analyzing materials and architecting your roadmap...' },
    generatingSubtitle: {
      vi: 'Trích lọc kiến thức cốt lõi, chia nhỏ thành các bài học 10 phút có bài tập thực hành',
      en: 'Extracting core knowledge and breaking it into 10-minute scenario-driven lessons',
    },
    stage1: { vi: 'Đọc và đối chiếu cấu trúc tài liệu', en: 'Reading and cross-referencing document structure' },
    stage2: { vi: 'Xác định các chủ đề và khái niệm then chốt', en: 'Identifying key concepts and learning milestones' },
    stage3: { vi: 'Chia nhỏ thành các phiên học 10 phút theo mục tiêu', en: 'Structuring into 10-minute microlearning modules' },
    stage4: { vi: 'Tạo tình huống thực tế và bài tập kiểm tra', en: 'Generating scenarios, exercises and knowledge checks' },
    stageWaitNote: {
      vi: 'Quá trình thường mất khoảng 15 đến 30 giây tùy theo độ dài tài liệu.',
      en: 'This usually takes 15 to 30 seconds depending on document length.',
    },

    // Missing Key / Server Config Error
    missingKeyTitle: { vi: 'Cần cấu hình AI API Key trên Server', en: 'AI API Key Configuration Required' },
    missingKeyDesc: {
      vi: 'Để phân tích tài liệu và tạo lộ trình AI thực tế, máy chủ cần biến môi trường GEMINI_API_KEY.',
      en: 'To analyze documents and generate real AI roadmaps, the server requires the GEMINI_API_KEY environment variable.',
    },
    missingKeySnippetTitle: { vi: 'Cách cấu hình trong file .env.local:', en: 'Configuration instructions for .env.local:' },
    retryAfterConfig: { vi: 'Thử lại sau khi đã cấu hình', en: 'Retry after configuring' },

    // Review Step
    reviewTitle: { vi: 'Lộ trình học tập được AI kiến tạo', en: 'AI-Architected Learning Roadmap' },
    reviewSubtitle: {
      vi: 'Đã sẵn sàng. Bạn có thể kiểm tra, chỉnh sửa từng bài học trước khi lưu.',
      en: 'Ready. You can inspect and edit lessons before saving.',
    },
    totalDuration: { vi: 'Tổng thời lượng:', en: 'Total duration:' },
    suggestedSchedule: { vi: 'Lịch học đề xuất:', en: 'Suggested schedule:' },
    learningObjectives: { vi: 'Mục tiêu đạt được sau khóa học:', en: 'Core learning objectives:' },
    sourceReferences: { vi: 'Tài liệu nguồn trích dẫn:', en: 'Source material references:' },
    modules: { vi: 'mô-đun', en: 'modules' },
    lessons: { vi: 'bài học', en: 'lessons' },
    editLesson: { vi: 'Chỉnh sửa bài học', en: 'Edit lesson' },
    saveLessonEdit: { vi: 'Lưu bài học', en: 'Save lesson' },
    cancelLessonEdit: { vi: 'Hủy', en: 'Cancel' },
    lessonTitleField: { vi: 'Tiêu đề bài học', en: 'Lesson title' },
    lessonDurationField: { vi: 'Thời lượng (phút)', en: 'Duration (min)' },
    exercisePromptField: { vi: 'Đề bài thực hành', en: 'Exercise prompt' },
    expectedAnswerField: { vi: 'Đáp án mong đợi', en: 'Expected answer' },
    sourceRefBadge: { vi: 'Nguồn:', en: 'Source:' },

    actionSaveRoadmap: { vi: 'Lưu lộ trình', en: 'Save roadmap' },
    actionStartLearning: { vi: 'Bắt đầu học', en: 'Start learning' },
    actionRegenerate: { vi: 'Tạo lại lộ trình', en: 'Regenerate roadmap' },
    actionUploadNew: { vi: 'Tải tài liệu mới', en: 'Upload new documents' },

    // Saved roadmaps in Learning Paths
    myCustomRoadmaps: { vi: 'Lộ trình AI của bạn', en: 'Your AI Roadmaps' },
    customBadge: { vi: 'LỘ TRÌNH TỪ TÀI LIỆU', en: 'DOCUMENT-BASED ROADMAP' },
    deleteRoadmapConfirm: { vi: 'Bạn có chắc chắn muốn xóa lộ trình này?', en: 'Are you sure you want to delete this roadmap?' },
    storageNotice: {
      vi: 'Lộ trình được lưu trực tiếp trên trình duyệt (LocalStorage) của bạn.',
      en: 'Roadmaps are saved directly in your browser (LocalStorage).',
    },
  },


  roadmap: {
    title: { vi: 'Bản đồ kỹ năng', en: 'Skill Quest Map' },
    subtitle: { vi: 'Hành trình chinh phục kiến thức thực chiến', en: 'Your journey to practical mastery' },
    milestonesCompleted: { vi: 'chặng đã xong', en: 'milestones completed' },
    estimatedTime: { vi: 'Thời gian ước tính', en: 'Estimated time' },
    milestone: { vi: 'Chặng', en: 'Milestone' },
    inProgress: { vi: 'Đang học', en: 'In Progress' },
    completedLabel: { vi: 'Đã hoàn thành', en: 'Completed' },
    locked: { vi: 'Chưa mở', en: 'Locked' },
    unlocksAfter: { vi: 'Mở khóa sau', en: 'Unlocks after' },
    startNow: { vi: 'Vào bài ngay', en: 'Start Now' },
    current: { vi: 'HIỆN TẠI', en: 'CURRENT' },
    next: { vi: 'TIẾP THEO', en: 'NEXT' },
    suggestedPractice: { vi: 'Đề xuất luyện tập', en: 'Suggested Practice' },
  },

  // Library
  library: {
    title: { vi: 'Thư viện kỹ năng thực chiến', en: 'Practical Skill Library' },
    subtitle: { vi: 'Tuyển tập các tình huống bài học 10 phút', en: 'Curated 10-minute scenario-based lessons' },
    searchPlaceholder: { vi: 'Tìm theo kỹ năng, chủ đề...', en: 'Search skills, topics...' },
    filterBy: { vi: 'Lọc theo:', en: 'Filter by:' },
    all: { vi: 'Tất cả', en: 'All' },
    dataAnalysis: { vi: 'Phân tích dữ liệu', en: 'Data Analysis' },
    productivity: { vi: 'Năng suất', en: 'Productivity' },
    communication: { vi: 'Giao tiếp công sở', en: 'Office Communication' },
    scenarioLabel: { vi: 'Tình huống:', en: 'Scenario:' },
    learnNow: { vi: 'Học ngay', en: 'Learn Now' },
    noResults: { vi: 'Không tìm thấy bài học phù hợp', en: 'No matching lessons found' },
    tryOtherKeywords: { vi: 'Hãy thử tìm bằng từ khóa khác.', en: 'Try different keywords.' },
  },

  // Progress
  progressPage: {
    title: { vi: 'Tiến độ học tập', en: 'Learning Progress' },
    learningStreak: { vi: 'Chuỗi học tập', en: 'Learning Streak' },
    totalTime: { vi: 'Tổng thời gian', en: 'Total Time' },
    lessonsCompleted: { vi: 'Bài hoàn thành', en: 'Lessons Completed' },
    weeklyTarget: { vi: 'Mục tiêu tuần', en: 'Weekly Target' },
    consecutiveDays: { vi: 'ngày liên tiếp', en: 'consecutive days' },
    personalRecord: { vi: 'Kỷ lục cá nhân: 14 ngày', en: 'Personal record: 14 days' },
    accumulated: { vi: 'phút tích lũy', en: 'minutes accumulated' },
    equivalent: { vi: 'Tương đương ~14.1 giờ học', en: 'Equivalent to ~14.1 hours' },
    lessons: { vi: 'bài học', en: 'lessons' },
    accuracy: { vi: 'Đạt 88% tỷ lệ câu hỏi đúng', en: '88% question accuracy rate' },
    skillMastery: { vi: 'Độ thành thạo theo kỹ năng', en: 'Skill Mastery Breakdown' },
    activeSkills: { vi: 'kỹ năng đang kích hoạt', en: 'active skills' },
    badgesEarned: { vi: 'Huy hiệu đã đạt', en: 'Badges Earned' },
    daysInWeek: { vi: 'ngày học trong tuần', en: 'days this week' },
  },

  // Settings
  settingsPage: {
    title: { vi: 'Cài đặt', en: 'Settings' },
    language: { vi: 'Ngôn ngữ', en: 'Language' },
    languageDesc: { vi: 'Chọn ngôn ngữ hiển thị giao diện', en: 'Choose interface display language' },
    notifications: { vi: 'Thông báo', en: 'Notifications' },
    notificationsDesc: { vi: 'Nhận nhắc nhở học tập hàng ngày', en: 'Get daily learning reminders' },
    dailyGoal: { vi: 'Mục tiêu hàng ngày', en: 'Daily Goal' },
    dailyGoalDesc: { vi: 'Thời gian học tập tối thiểu mỗi ngày', en: 'Minimum daily study time' },
    theme: { vi: 'Giao diện', en: 'Theme' },
    themeDesc: { vi: 'Tuỳ chỉnh giao diện hiển thị', en: 'Customize the display theme' },
    account: { vi: 'Tài khoản', en: 'Account' },
    accountDesc: { vi: 'Quản lý thông tin cá nhân', en: 'Manage personal information' },
    light: { vi: 'Sáng', en: 'Light' },
    dark: { vi: 'Tối', en: 'Dark' },
    enabled: { vi: 'Bật', en: 'Enabled' },
    disabled: { vi: 'Tắt', en: 'Disabled' },
  },

  // Toast messages
  toast: {
    lessonComplete: {
      vi: 'Chúc mừng! Bạn đã hoàn thành bài học hôm nay',
      en: 'Congratulations! You completed today\'s lesson',
    },
  },

  // My Courses Management
  courses: {
    title: { vi: 'Môn học của tôi', en: 'My Courses' },
    subtitle: {
      vi: 'Quản lý tài liệu học tập, slide giáo trình và thiết kế lộ trình AI thông minh theo từng môn học.',
      en: 'Manage course materials, slides, and build intelligent AI roadmaps tailored to each subject.',
    },
    searchPlaceholder: {
      vi: 'Tìm theo tên hoặc mã môn học (VD: IT304, Hệ điều hành)...',
      en: 'Search by course name or code (e.g. IT304, Operating Systems)...',
    },
    addCourse: { vi: 'Thêm môn học', en: 'Add Course' },
    editCourse: { vi: 'Chỉnh sửa môn học', en: 'Edit Course' },
    deleteCourse: { vi: 'Xoá môn học', en: 'Delete Course' },
    allCourses: { vi: 'Tất cả môn học', en: 'All Courses' },
    emptyTitle: { vi: 'Chưa có môn học nào', en: 'No courses added yet' },
    emptyDesc: {
      vi: 'Tạo môn học đầu tiên để tải tài liệu, slide bài giảng và để AI thiết kế lộ trình học riêng biệt cho bạn.',
      en: 'Create your first course to upload materials, lecture slides, and let AI build customized learning roadmaps.',
    },
    materialsCount: { vi: 'tài liệu', en: 'materials' },
    roadmapsCount: { vi: 'lộ trình AI', en: 'AI roadmaps' },
    progressLabel: { vi: 'Tiến độ hoàn thành', en: 'Completion Progress' },
    lastUpdated: { vi: 'Cập nhật:', en: 'Updated:' },
    viewDetails: { vi: 'Xem chi tiết', en: 'View Details' },
    startRoadmap: { vi: 'Vào học ngay', en: 'Start Learning' },
    generateRoadmapAction: { vi: 'Tạo lộ trình AI', en: 'Generate AI Roadmap' },
    academicTerm: { vi: 'Học kỳ', en: 'Academic Term' },
    code: { vi: 'Mã môn', en: 'Code' },
  },

  // Course Detail & Document Management
  courseDetail: {
    tabs: {
      overview: { vi: 'Tổng quan', en: 'Overview' },
      documents: { vi: 'Tài liệu môn học', en: 'Course Materials' },
      roadmaps: { vi: 'Lộ trình AI', en: 'AI Roadmaps' },
      progress: { vi: 'Tiến độ', en: 'Progress' },
    },
    backToCourses: { vi: 'Quay lại danh sách môn học', en: 'Back to My Courses' },
    addMaterials: { vi: 'Tải tài liệu lên', en: 'Upload Materials' },
    generateRoadmap: { vi: 'Tạo lộ trình bằng AI', en: 'Generate AI Roadmap' },
    selectDocsPrompt: {
      vi: 'Chọn các tài liệu bạn muốn AI dùng làm nguồn kiến thức',
      en: 'Select the documents you want AI to use as knowledge sources',
    },
    selectDocsToGenerate: {
      vi: 'Tạo lộ trình từ {count} tài liệu đã chọn',
      en: 'Generate roadmap from {count} selected docs',
    },
    learningGoal: { vi: 'Mục tiêu môn học', en: 'Course Goal' },
    learningGoalPlaceholder: {
      vi: 'VD: Hiểu sâu thuật toán lập lịch CPU, synchronization và deadlocks.',
      en: 'e.g. Master CPU scheduling algorithms, synchronization, and deadlocks.',
    },
    courseName: { vi: 'Tên môn học', en: 'Course Name' },
    courseNamePlaceholder: { vi: 'VD: Hệ điều hành, Cơ sở dữ liệu...', en: 'e.g. Operating Systems, Database Systems...' },
    courseCode: { vi: 'Mã môn (không bắt buộc)', en: 'Course Code (optional)' },
    courseCodePlaceholder: { vi: 'VD: IT304, CS101...', en: 'e.g. IT304, CS101...' },
    termPlaceholder: { vi: 'VD: Học kỳ 1 • 2026', en: 'e.g. Fall 2026' },
    descriptionPlaceholder: { vi: 'Mô tả ngắn về nội dung môn học...', en: 'Brief summary of the course content...' },
    saveCourse: { vi: 'Lưu môn học', en: 'Save Course' },
    cancel: { vi: 'Huỷ', en: 'Cancel' },
    deleteConfirmTitle: { vi: 'Xoá môn học này?', en: 'Delete this course?' },
    deleteConfirmDesc: {
      vi: 'Môn học cùng tất cả tài liệu đã tải lên sẽ bị xoá vĩnh viễn. Các lộ trình đã tạo sẽ không còn liên kết với môn này.',
      en: 'This course and all uploaded materials will be permanently deleted. Created roadmaps will be unlinked.',
    },
    confirmDelete: { vi: 'Xoá môn học', en: 'Delete Course' },
    uploadZoneTitle: { vi: 'Kéo thả tài liệu vào đây hoặc nhấp để chọn file', en: 'Drag and drop materials here, or click to browse' },
    uploadZoneSubtitle: { vi: 'Hỗ trợ PDF, DOCX, PPTX, TXT, MD (Tối đa 5 file, 20MB/file)', en: 'Supports PDF, DOCX, PPTX, TXT, MD (Max 5 files, 20MB/file)' },
    previewExtractedText: { vi: 'Xem nội dung trích xuất', en: 'Preview Text' },
    retryExtraction: { vi: 'Thử lại trích xuất', en: 'Retry Extraction' },
    deleteDoc: { vi: 'Xoá tài liệu', en: 'Delete Material' },
    docUsedInRoadmap: { vi: 'Đã dùng tạo lộ trình', en: 'Used in Roadmap' },
    noDocsInCourse: {
      vi: 'Chưa có tài liệu nào trong môn này. Hãy tải lên slide, PDF hoặc giáo trình để bắt đầu.',
      en: 'No materials uploaded for this course yet. Upload slides, PDFs, or notes to get started.',
    },
    noRoadmapsInCourse: {
      vi: 'Chưa có lộ trình AI nào được tạo cho môn này. Chọn tài liệu và nhấn "Tạo lộ trình bằng AI" để bắt đầu!',
      en: 'No AI roadmaps created for this course yet. Select materials and click "Generate AI Roadmap" to begin!',
    },
    statusExtracted: { vi: 'Đã trích xuất', en: 'Extracted' },
    statusExtracting: { vi: 'Đang trích xuất...', en: 'Extracting...' },
    statusError: { vi: 'Lỗi trích xuất', en: 'Extraction Error' },
    statusEmpty: { vi: 'File rỗng hoặc scan', en: 'Empty or Scanned' },
  },

  // Common
  common: {
    today: { vi: 'Hôm nay', en: 'Today' },
    days: {
      vi: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
      en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    shortDays: {
      vi: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    },
  },
} as const;

// Helper to get a translated string
export function t(
  dict: Record<string, { vi: string; en: string }> | { vi: string; en: string },
  lang: Lang,
): string {
  if ('vi' in dict && 'en' in dict) {
    return (dict as { vi: string; en: string })[lang];
  }
  return '';
}

