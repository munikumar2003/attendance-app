export interface ClassItem {
  id: string;
  name: string;
  studentCount: number; // e.g. 36
}

export interface AttendanceRecord {
  id: string; // e.g. "class_10a_2026-09-16"
  classId: string;
  className: string;
  date: string; // "YYYY-MM-DD"
  day: number;
  month: number; // 1-12
  year: number;
  totalStudents: number;
  absentRolls: number[]; // e.g. [4, 12, 19]
  savedAt: string; // ISO string
}

export interface TeacherProfile {
  name: string;
  email: string;
  schoolName: string;
  avatarColor: string;
}

export interface AppSettings {
  defaultStudentCount: number; // default 36 (6x6)
  soundEnabled: boolean;
  teacher: TeacherProfile;
}

export type ActiveModal = 'none' | 'profile-menu' | 'download-report' | 'settings' | 'logout';
