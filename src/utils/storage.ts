import { AppSettings, AttendanceRecord, ClassItem } from '../types';

const STORAGE_KEYS = {
  ATTENDANCE: 'attendance_app_records_v1',
  CLASSES: 'attendance_app_classes_v1',
  SETTINGS: 'attendance_app_settings_v1',
  AUTH_USER: 'attendance_app_auth_user_v1',
  APP_INITIALIZED: 'attendance_app_initialized_v1',
};

// Clean blank defaults for fresh installs
export const DEFAULT_CLASSES: ClassItem[] = [
  { id: 'class_1', name: 'Class 1', studentCount: 36 },
];

export const DEFAULT_SETTINGS: AppSettings = {
  defaultStudentCount: 36,
  soundEnabled: true,
  teacher: {
    name: '',
    email: '',
    schoolName: '',
    avatarColor: '#10b981', // emerald
  },
};

/**
 * Checks if the app has ever been configured / started by the user.
 * If not initialized, app will present the single "Get Started" screen
 * that leads directly into Settings for the user to configure their details.
 */
export function isAppInitialized(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APP_INITIALIZED);
    return raw === 'true';
  } catch {
    return false;
  }
}

export function setAppInitialized(initialized: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_INITIALIZED, initialized ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export function getStoredClasses(): ClassItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLASSES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_CLASSES;
}

export function saveStoredClasses(classes: ClassItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  } catch {
    // ignore
  }
}

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function getAllAttendanceRecords(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (raw !== null) {
      const records: AttendanceRecord[] = JSON.parse(raw);
      if (Array.isArray(records)) {
        return records;
      }
    }
  } catch {
    // ignore
  }

  // If never set before, initialize with empty array
  saveAllAttendanceRecords([]);
  return [];
}

export function saveAllAttendanceRecords(records: AttendanceRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  } catch {
    // ignore
  }
}

export function getAttendanceRecordForDate(classId: string, dateStr: string): AttendanceRecord | null {
  const all = getAllAttendanceRecords();
  return all.find(r => r.classId === classId && r.date === dateStr) || null;
}

export function saveOrUpdateAttendanceRecord(record: AttendanceRecord): void {
  const all = getAllAttendanceRecords();
  const existingIdx = all.findIndex(r => r.classId === record.classId && r.date === record.date);
  if (existingIdx >= 0) {
    all[existingIdx] = record;
  } else {
    all.unshift(record);
  }
  saveAllAttendanceRecords(all);
}

export function isUserLoggedIn(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return raw !== 'logged_out';
  } catch {
    return true;
  }
}

export function setUserLoggedIn(loggedIn: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, loggedIn ? 'logged_in' : 'logged_out');
  } catch {
    // ignore
  }
}
