import { Skill, Lesson, WeeklyActivity, UserProfile } from '@/types';

export const userProfile: UserProfile = {
  name: 'Minh Anh',
  avatar: 'MA',
  streak: 12,
  totalMinutes: 847,
  weeklyGoal: 70,
  joinDate: '2024-08-15',
};

export const skills: Skill[] = [
  {
    id: 'excel',
    name: 'Excel',
    slug: 'excel',
    description: 'Data & Productivity',
    category: 'Công cụ phân tích',
    level: 'Trung cấp',
    progress: 64,
    completedLessons: 16,
    totalLessons: 25,
    accentColor: '#D7FF64',
    icon: 'grid',
  },
  {
    id: 'sql',
    name: 'SQL',
    slug: 'sql',
    description: 'Think in Data',
    category: 'Ngôn ngữ truy vấn',
    level: 'Cơ bản',
    progress: 38,
    completedLessons: 8,
    totalLessons: 21,
    accentColor: '#DCD5FF',
    icon: 'database',
  },
  {
    id: 'english',
    name: 'English Communication',
    slug: 'english',
    description: 'Speak with Confidence',
    category: 'Kỹ năng giao tiếp',
    level: 'Trung cấp',
    progress: 52,
    completedLessons: 13,
    totalLessons: 25,
    accentColor: '#F7F6F0',
    icon: 'message-circle',
  },
];

export const todayLesson: Lesson = {
  id: 'sql-groupby-sum',
  skillId: 'sql',
  title: 'GROUP BY & Hàm tổng hợp',
  description: 'Tính tổng doanh thu theo từng tháng bằng GROUP BY và SUM',
  duration: 10,
  level: 'Cơ bản',
  situation: 'Sếp yêu cầu bạn tổng hợp doanh thu của 500 đơn hàng theo từng tháng trong quý vừa rồi.',
  completed: false,
  order: 9,
  steps: [
    {
      id: 'step-1',
      type: 'content',
      title: 'Tình huống thực tế',
      content: `Bạn vừa nhận được yêu cầu từ sếp: **"Tổng hợp doanh thu 500 đơn hàng theo từng tháng trong quý vừa rồi."**

Dữ liệu nằm trong bảng \`orders\` với các cột:
- \`order_id\` — Mã đơn hàng
- \`order_date\` — Ngày đặt hàng
- \`amount\` — Giá trị đơn hàng
- \`customer_id\` — Mã khách hàng

Thay vì mở Excel và lọc thủ công, bạn chỉ cần **một câu lệnh SQL**.`,
    },
    {
      id: 'step-2',
      type: 'content',
      title: 'GROUP BY là gì?',
      content: `**GROUP BY** gom các hàng có cùng giá trị trong một (hoặc nhiều) cột thành từng nhóm, sau đó bạn có thể dùng **hàm tổng hợp** để tính toán trên mỗi nhóm.

Các hàm tổng hợp phổ biến:
- \`SUM()\` — Tính tổng
- \`COUNT()\` — Đếm số lượng
- \`AVG()\` — Tính trung bình
- \`MAX()\`, \`MIN()\` — Giá trị lớn nhất, nhỏ nhất`,
      example: `SELECT department, COUNT(*) as total_employees
FROM employees
GROUP BY department;

-- Kết quả:
-- department  | total_employees
-- Marketing   | 12
-- Engineering | 28
-- Sales       | 15`,
    },
    {
      id: 'step-3',
      type: 'exercise',
      title: 'Thực hành: Tổng doanh thu theo tháng',
      content: 'Viết truy vấn SQL để tính tổng doanh thu (`amount`) theo từng tháng từ bảng `orders`. Sử dụng `MONTH(order_date)` để lấy tháng.',
      exercise: {
        prompt: 'Viết câu lệnh SQL tính tổng doanh thu theo từng tháng:',
        initialCode: 'SELECT \n  \nFROM orders\n',
        expectedAnswer: 'SELECT MONTH(order_date) AS thang, SUM(amount) AS tong_doanh_thu FROM orders GROUP BY MONTH(order_date)',
        hint: 'Dùng MONTH(order_date) để trích xuất tháng, SUM(amount) để tính tổng, và GROUP BY để nhóm theo tháng.',
        explanation: `Câu lệnh đúng:

\`\`\`sql
SELECT 
  MONTH(order_date) AS thang,
  SUM(amount) AS tong_doanh_thu
FROM orders
GROUP BY MONTH(order_date);
\`\`\`

**Giải thích từng phần:**
1. \`MONTH(order_date)\` trích xuất số tháng từ cột ngày
2. \`SUM(amount)\` cộng tổng giá trị đơn hàng trong mỗi nhóm
3. \`GROUP BY MONTH(order_date)\` nhóm tất cả đơn hàng có cùng tháng lại với nhau
4. \`AS\` đặt tên alias cho cột kết quả, dễ đọc hơn

**Kết quả mẫu:**
| thang | tong_doanh_thu |
|-------|----------------|
| 7     | 45,230,000     |
| 8     | 52,180,000     |
| 9     | 48,750,000     |`,
      },
    },
  ],
  quizzes: [
    {
      id: 'quiz_sql_1',
      type: 'multiple_choice',
      question: 'Khi sử dụng mệnh đề GROUP BY trong SQL, cột nào sau đây BẮT BUỘC phải xuất hiện trong mệnh đề GROUP BY nếu nó được SELECT?',
      options: [
        { id: 'A', text: 'Tất cả các cột có trong bảng gốc' },
        { id: 'B', text: 'Các cột không nằm trong hàm tổng hợp (SUM, COUNT, AVG, v.v.)' },
        { id: 'C', text: 'Chỉ các cột có kiểu dữ liệu số nguyên (INT)' },
        { id: 'D', text: 'Chỉ cột khóa chính (PRIMARY KEY)' },
      ],
      correctOptionId: 'B',
      explanation: 'Trong SQL tiêu chuẩn, bất kỳ cột nào xuất hiện trong mệnh đề SELECT mà không được bao bọc bởi một hàm tổng hợp đều phải nằm trong mệnh đề GROUP BY.',
      commonMisconceptions: 'Nhiều người mới học nhầm rằng GROUP BY phải liệt kê toàn bộ cột hoặc chỉ dùng được trên khóa chính.',
      difficulty: 'medium',
      sourceReference: 'SQL Standard Grouping Rules',
    },
    {
      id: 'quiz_sql_2',
      type: 'multiple_choice',
      question: 'Hàm tổng hợp nào dưới đây dùng để tính giá trị trung bình của một cột số?',
      options: [
        { id: 'A', text: 'SUM()' },
        { id: 'B', text: 'COUNT()' },
        { id: 'C', text: 'AVG()' },
        { id: 'D', text: 'MEDIAN()' },
      ],
      correctOptionId: 'C',
      explanation: 'Hàm AVG() (Average) tính giá trị trung bình cộng của các giá trị không NULL trong cột.',
      difficulty: 'easy',
      sourceReference: 'SQL Aggregates',
    },
    {
      id: 'quiz_sql_3',
      type: 'multiple_choice',
      question: 'Nếu muốn lọc các nhóm sau khi đã gom nhóm (ví dụ: chỉ lấy các tháng có tổng doanh thu > 50,000,000), bạn phải dùng mệnh đề nào?',
      options: [
        { id: 'A', text: 'WHERE SUM(amount) > 50000000' },
        { id: 'B', text: 'HAVING SUM(amount) > 50000000' },
        { id: 'C', text: 'ORDER BY SUM(amount) > 50000000' },
        { id: 'D', text: 'FILTER SUM(amount) > 50000000' },
      ],
      correctOptionId: 'B',
      explanation: 'Mệnh đề WHERE lọc từng dòng trước khi gom nhóm, còn HAVING lọc kết quả trên các nhóm sau khi hàm tổng hợp đã được tính.',
      commonMisconceptions: 'Lỗi thường gặp là đặt hàm tổng hợp SUM() trong mệnh đề WHERE, điều này sẽ báo lỗi cú pháp.',
      difficulty: 'hard',
      sourceReference: 'SQL HAVING vs WHERE',
    },
  ],
  openEndedExercises: [
    {
      id: 'open_sql_1',
      type: 'open_ended',
      subjectType: 'sql',
      prompt: 'Viết truy vấn SQL tính tổng doanh thu và số lượng đơn hàng theo từng tháng trong năm 2024 từ bảng `orders`. Chỉ hiển thị các tháng có tổng doanh thu vượt 50,000,000 VNĐ và sắp xếp giảm dần theo doanh thu.',
      scenario: 'Giám đốc tài chính cần báo cáo quý để đánh giá các tháng cao điểm bán hàng nhằm phân bổ ngân sách marketing quý sau.',
      instructions: [
        'Chọn cột tháng từ `order_date` bằng `MONTH(order_date)`.',
        'Tính tổng `amount` với alias `tong_doanh_thu` và đếm số đơn bằng `COUNT(*)` với alias `so_don`.',
        'Lọc điều kiện năm 2024 trong mệnh đề WHERE.',
        'Gom nhóm theo tháng.',
        'Lọc tổng doanh thu > 50000000 bằng mệnh đề HAVING.',
        'Sắp xếp giảm dần theo doanh thu bằng ORDER BY ... DESC.',
      ],
      providedData: 'Bảng orders: order_id (INT), order_date (DATE), amount (DECIMAL), customer_id (INT)',
      evaluationCriteria: [
        'Sử dụng đúng hàm MONTH(), SUM(), COUNT() và gom nhóm GROUP BY',
        'Lọc điều kiện năm trong WHERE và lọc tổng doanh thu trong HAVING',
        'Sắp xếp ORDER BY giảm dần chính xác',
      ],
      rubric: [
        { criterion: 'Cú pháp SELECT, GROUP BY và hàm tổng hợp', maxScore: 5 },
        { criterion: 'Phân biệt đúng WHERE (năm 2024) và HAVING (>50tr)', maxScore: 3 },
        { criterion: 'Sắp xếp ORDER BY DESC và alias rõ ràng', maxScore: 2 },
      ],
      sampleSolution: `SELECT 
  MONTH(order_date) AS thang,
  SUM(amount) AS tong_doanh_thu,
  COUNT(*) AS so_don
FROM orders
WHERE YEAR(order_date) = 2024
GROUP BY MONTH(order_date)
HAVING SUM(amount) > 50000000
ORDER BY tong_doanh_thu DESC;`,
      reasoningExplanation: 'WHERE lọc các bản ghi của năm 2024 trước khi nhóm. GROUP BY gom nhóm theo từng tháng. HAVING lọc các nhóm đạt doanh thu > 50tr. Cuối cùng ORDER BY sắp xếp tháng doanh thu cao nhất lên đầu.',
      maxScore: 10,
      initialTemplate: 'SELECT \n  \nFROM orders\nWHERE \nGROUP BY \nHAVING \nORDER BY ;',
    },
  ],
};

export const recommendedLesson = {
  title: 'Tổng hợp doanh thu 500 đơn hàng',
  situation: 'Sếp yêu cầu bạn tổng hợp doanh thu của 500 đơn hàng theo từng tháng.',
  skill: 'SQL',
  duration: 10,
  level: 'Cơ bản' as const,
  topics: ['GROUP BY', 'SUM', 'Hàm tổng hợp'],
};

export const weeklyActivity: WeeklyActivity[] = [
  { day: 'Thứ 2', shortDay: 'T2', minutes: 10, completed: true, date: '16/10' },
  { day: 'Thứ 3', shortDay: 'T3', minutes: 15, completed: true, date: '17/10' },
  { day: 'Thứ 4', shortDay: 'T4', minutes: 10, completed: true, date: '18/10' },
  { day: 'Thứ 5', shortDay: 'T5', minutes: 0, completed: false, date: '19/10' },
  { day: 'Thứ 6', shortDay: 'T6', minutes: 12, completed: true, date: '20/10' },
  { day: 'Thứ 7', shortDay: 'T7', minutes: 8, completed: true, date: '21/10' },
  { day: 'Hôm nay', shortDay: 'CN', minutes: 0, completed: false, date: '22/10' },
];

