import type { Course, CourseMaterial } from '@/types/course';
import type { GeneratedRoadmap } from '@/types/architect';
import { getSavedRoadmaps, saveRoadmapToStorage } from './roadmapStorage';

const COURSES_STORAGE_KEY = 'skillbite_courses';
const MATERIALS_STORAGE_KEY = 'skillbite_course_materials';

// Preloaded initial courses for a realistic, engaging experience
const INITIAL_COURSES: Course[] = [
  {
    id: 'course_os_it304',
    title: 'Hệ điều hành',
    code: 'IT304',
    description: 'Nghiên cứu kiến trúc hạt nhân (Kernel), lập lịch tiến trình CPU, đồng bộ hoá và quản lý bộ nhớ.',
    academicTerm: 'Học kỳ 1 • 2026',
    learningGoal: 'Hiểu sâu lập lịch CPU (FCFS, SJF, RR), Deadlock và cấp phát bộ nhớ ảo.',
    colorTheme: 'emerald',
    icon: 'Cpu',
    documentCount: 2,
    roadmapCount: 1,
    progress: 45,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    roadmapIds: ['roadmap_os_scheduling_it304'],
  },
  {
    id: 'course_db_it202',
    title: 'Cơ sở dữ liệu',
    code: 'IT202',
    description: 'Thiết kế cơ sở dữ liệu quan hệ, tối ưu hóa truy vấn SQL nâng cao, giao dịch ACID và lập chỉ mục B-Tree.',
    academicTerm: 'Học kỳ 1 • 2026',
    learningGoal: 'Thành thạo truy vấn phức hợp GROUP BY, Window Functions và tối ưu câu lệnh truy vấn.',
    colorTheme: 'teal',
    icon: 'Database',
    documentCount: 1,
    roadmapCount: 1,
    progress: 70,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    roadmapIds: ['roadmap_db_optimization_it202'],
  },
];

const INITIAL_MATERIALS: CourseMaterial[] = [
  {
    id: 'mat_os_1',
    courseId: 'course_os_it304',
    filename: 'Chương 1_Tổng quan Hệ điều hành.pdf',
    size: 1153433,
    type: 'pdf',
    status: 'extracted',
    characterCount: 3420,
    pageCount: 18,
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    usedInRoadmap: true,
    previewText:
      'Chương 1: Tổng quan về Hệ điều hành. Khái niệm hệ điều hành là một chương trình đóng vai trò trung gian giữa người dùng máy tính và phần cứng máy tính. Mục tiêu: thực hiện chương trình người dùng, làm cho hệ thống máy tính thuận tiện và dễ sử dụng, quản lý tài nguyên máy tính hiệu quả...',
    extractedText:
      'Chương 1: Tổng quan về Hệ điều hành\n\n1. Định nghĩa và vai trò của Hệ điều hành:\nHệ điều hành (Operating System - OS) là phần mềm trung gian giữa người dùng và phần cứng máy tính. Các mục tiêu chính của OS bao gồm:\n- Thực thi các chương trình ứng dụng và giải quyết bài toán của người dùng một cách thuận lợi.\n- Sử dụng tài nguyên phần cứng (CPU, Memory, I/O devices) một cách hiệu quả nhất.\n\n2. Cấu trúc hệ thống máy tính:\n- CPU: thực thi các câu lệnh.\n- Bộ nhớ (Memory): lưu trữ chương trình đang chạy và dữ liệu.\n- Thiết bị ngoại vi (I/O devices): bàn phím, màn hình, ổ cứng.\n\n3. Trạng thái và chế độ hoạt động:\n- Dual-mode operation: User mode và Kernel mode (Supervisor mode).\n- Lời gọi hệ thống (System Calls) cho phép chương trình ở user mode yêu cầu dịch vụ từ kernel mode.',
  },
  {
    id: 'mat_os_2',
    courseId: 'course_os_it304',
    filename: 'Chương 2_CPU Scheduling và Lập lịch tiến trình.pdf',
    size: 1485760,
    type: 'pdf',
    status: 'extracted',
    characterCount: 4680,
    pageCount: 24,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    usedInRoadmap: true,
    previewText:
      'Chương 2: Lập lịch CPU (CPU Scheduling). Khái niệm Process, PCB (Process Control Block). Các thuật toán lập lịch: FCFS (First-Come, First-Served), SJF (Shortest Job First), Round Robin (RR) với Time Quantum. Tiêu chí đánh giá: CPU utilization, Throughput, Turnaround time, Waiting time...',
    extractedText:
      'Chương 2: Lập lịch CPU (CPU Scheduling)\n\n1. Khái niệm Tiến trình (Process) và PCB:\nMột tiến trình là một chương trình đang trong quá trình thực thi. PCB chứa trạng thái tiến trình, PC, thanh ghi CPU, thông tin lập lịch.\n\n2. Các tiêu chí đánh giá giải thuật lập lịch:\n- CPU utilization: Tỷ lệ thời gian CPU bận rộn.\n- Throughput: Số lượng tiến trình hoàn thành trong một đơn vị thời gian.\n- Turnaround time: Khoảng thời gian từ lúc nộp tiến trình đến lúc hoàn thành.\n- Waiting time: Tổng thời gian tiến trình phải chờ trong hàng đợi ready.\n- Response time: Thời gian từ lúc nộp yêu cầu đến khi có phản hồi đầu tiên.\n\n3. Các giải thuật lập lịch phổ biến:\n- FCFS (First-Come First-Served): Tiến trình nào yêu cầu CPU trước thì được cấp phát trước. Bất lợi: Hiệu ứng đoàn tàu (Convoy effect).\n- SJF (Shortest Job First): Ưu tiên tiến trình có CPU burst ngắn nhất. Tối ưu thời gian chờ trung bình nhưng khó dự đoán trước burst time.\n- Round Robin: Mỗi tiến trình được cấp một quantum thời gian q. Khi hết quantum, tiến trình bị ngắt và đưa về cuối hàng đợi.',
  },
  {
    id: 'mat_db_1',
    courseId: 'course_db_it202',
    filename: 'SQL_Advanced_Queries_and_Indexing.pdf',
    size: 924510,
    type: 'pdf',
    status: 'extracted',
    characterCount: 3120,
    pageCount: 14,
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    usedInRoadmap: true,
    previewText:
      'Bài học SQL nâng cao: Tối ưu hóa truy vấn với GROUP BY, HAVING, Subqueries và Window Functions (ROW_NUMBER, RANK, DENSE_RANK). Hiểu về cơ chế lập chỉ mục (B-Tree Indexing) và phân tích EXPLAIN Query Plan...',
    extractedText:
      'SQL Nâng cao & Tối ưu hoá truy vấn cơ sở dữ liệu\n\n1. Nhóm dữ liệu và lọc nhóm: GROUP BY và HAVING\nMệnh đề GROUP BY nhóm các dòng có cùng giá trị thành các dòng tóm tắt. Mệnh đề HAVING dùng để lọc các nhóm sau khi đã tổng hợp (khác với WHERE lọc từng dòng trước khi tổng hợp).\n\n2. Window Functions:\nCho phép thực hiện tính toán trên tập hợp các hàng liên quan đến hàng hiện tại mà không làm gộp dòng như GROUP BY.\nCú pháp: FUNCTION() OVER (PARTITION BY col ORDER BY col).\nVí dụ: ROW_NUMBER(), RANK(), DENSE_RANK().\n\n3. Lập chỉ mục (Indexing):\nIndex là cấu trúc dữ liệu giúp tăng tốc độ tìm kiếm dữ liệu. Phổ biến nhất là B-Tree Index. Lưu ý: Thêm index giúp SELECT nhanh hơn nhưng có thể làm chậm INSERT, UPDATE, DELETE.',
  },
];

// Helper to seed or read courses
export function getCourses(): Course[] {
  if (typeof window === 'undefined') return INITIAL_COURSES;
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COURSES;
  } catch (e) {
    console.error('Failed to get courses from storage:', e);
    return INITIAL_COURSES;
  }
}

export function getCourseById(courseId: string): Course | undefined {
  const courses = getCourses();
  return courses.find((c) => c.id === courseId);
}

export function saveCourse(
  courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'documentCount' | 'roadmapCount' | 'progress' | 'roadmapIds'>
): Course {
  const courses = getCourses();
  const newCourse: Course = {
    ...courseData,
    id: `course_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    documentCount: 0,
    roadmapCount: 0,
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    roadmapIds: [],
  };

  const updated = [newCourse, ...courses];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save course:', e);
    }
  }
  return newCourse;
}

export function updateCourse(updatedCourse: Course): Course[] {
  const courses = getCourses();
  const updated = courses.map((c) =>
    c.id === updatedCourse.id
      ? { ...updatedCourse, updatedAt: new Date().toISOString() }
      : c
  );
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update course:', e);
    }
  }
  return updated;
}

export function deleteCourse(courseId: string): Course[] {
  const courses = getCourses();
  const updatedCourses = courses.filter((c) => c.id !== courseId);

  // Also remove associated materials
  const materials = getStoredMaterials().filter((m) => m.courseId !== courseId);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updatedCourses));
      localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(materials));
    } catch (e) {
      console.error('Failed to delete course:', e);
    }
  }
  return updatedCourses;
}

// Materials Storage Operations
function getStoredMaterials(): CourseMaterial[] {
  if (typeof window === 'undefined') return INITIAL_MATERIALS;
  try {
    const raw = localStorage.getItem(MATERIALS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(INITIAL_MATERIALS));
      return INITIAL_MATERIALS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MATERIALS;
  } catch (e) {
    console.error('Failed to get course materials from storage:', e);
    return INITIAL_MATERIALS;
  }
}

export function getCourseMaterials(courseId: string): CourseMaterial[] {
  const all = getStoredMaterials();
  return all.filter((m) => m.courseId === courseId);
}

export function saveCourseMaterial(material: CourseMaterial): CourseMaterial[] {
  const all = getStoredMaterials();
  const existingIdx = all.findIndex((m) => m.id === material.id);
  let updated: CourseMaterial[];

  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = material;
  } else {
    updated = [material, ...all];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save material to storage:', e);
    }
  }

  // Update course documentCount
  syncCourseStats(material.courseId);

  return updated.filter((m) => m.courseId === material.courseId);
}

export function deleteCourseMaterial(materialId: string, courseId: string): CourseMaterial[] {
  const all = getStoredMaterials();
  const updated = all.filter((m) => m.id !== materialId);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete material:', e);
    }
  }

  syncCourseStats(courseId);
  return updated.filter((m) => m.courseId === courseId);
}

// Sync material count & roadmap count to Course entity
export function syncCourseStats(courseId: string) {
  const courses = getCourses();
  const course = courses.find((c) => c.id === courseId);
  if (!course) return;

  const materials = getStoredMaterials().filter((m) => m.courseId === courseId);
  const roadmaps = getCourseRoadmaps(courseId);

  course.documentCount = materials.length;
  course.roadmapCount = roadmaps.length;
  course.updatedAt = new Date().toISOString();

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to sync course stats:', e);
    }
  }
}

// Link a newly generated roadmap to a course
export function linkRoadmapToCourse(courseId: string, roadmap: GeneratedRoadmap) {
  saveRoadmapToStorage(roadmap);
  const courses = getCourses();
  const course = courses.find((c) => c.id === courseId);
  if (!course) return;

  const existingIds = course.roadmapIds || [];
  if (!existingIds.includes(roadmap.id)) {
    course.roadmapIds = [roadmap.id, ...existingIds];
    course.roadmapCount = course.roadmapIds.length;
    course.updatedAt = new Date().toISOString();

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
      } catch (e) {
        console.error('Failed to link roadmap to course:', e);
      }
    }
  }
}

// Retrieve all roadmaps associated with a specific course
export function getCourseRoadmaps(courseId: string): GeneratedRoadmap[] {
  const course = getCourseById(courseId);
  if (!course) return [];

  const allRoadmaps = getSavedRoadmaps();
  const linkedIds = course.roadmapIds || [];

  return allRoadmaps.filter((r) => linkedIds.includes(r.id) || r.id.includes(courseId));
}

