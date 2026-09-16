import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ActiveModal,
  AppSettings,
  AttendanceRecord,
  ClassItem,
} from './types';
import {
  getAllAttendanceRecords,
  getAttendanceRecordForDate,
  getStoredClasses,
  getStoredSettings,
  isAppInitialized,
  isUserLoggedIn,
  saveAllAttendanceRecords,
  saveOrUpdateAttendanceRecord,
  saveStoredClasses,
  saveStoredSettings,
  setAppInitialized,
  setUserLoggedIn,
} from './utils/storage';
import { playSaveSound, playToggleSound } from './utils/audio';
import { TopRow } from './components/TopRow';
import { DateRow } from './components/DateRow';
import { AttendanceGrid } from './components/AttendanceGrid';
import { ActionFooter } from './components/ActionFooter';
import { ProfileMenuModal } from './components/ProfileMenuModal';
import { DownloadReportModal } from './components/DownloadReportModal';
import { SettingsModal } from './components/SettingsModal';
import { LogoutModal, TeacherLoginScreen } from './components/LogoutModal';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { FreshWelcomeScreen } from './components/FreshWelcomeScreen';

export default function App() {
  // App initialization state (first time fresh install vs returning)
  const [initialized, setInitialized] = useState<boolean>(() => isAppInitialized());
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState<boolean>(false);

  // Authentication state
  const [loggedIn, setLoggedIn] = useState<boolean>(() => isUserLoggedIn());

  // Classes & Settings
  const [classes, setClasses] = useState<ClassItem[]>(() => getStoredClasses());
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>(() =>
    getAllAttendanceRecords()
  );

  // Active selections
  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    const initialClasses = getStoredClasses();
    return initialClasses.length > 0 ? initialClasses[0].id : 'class_10a';
  });

  // Date state: day, month (1-12), year
  const today = useMemo(() => new Date(), []);
  const [day, setDay] = useState<number>(today.getDate());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [year, setYear] = useState<number>(today.getFullYear());

  // Formatted date string "YYYY-MM-DD"
  const formattedDateStr = useMemo(() => {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }, [year, month, day]);

  // Is today helper
  const isToday = useMemo(() => {
    const now = new Date();
    return (
      day === now.getDate() &&
      month === now.getMonth() + 1 &&
      year === now.getFullYear()
    );
  }, [day, month, year]);

  // Active class object
  const currentClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId) || classes[0] || {
      id: 'class_10a',
      name: 'Class 10-A',
      studentCount: 36,
    };
  }, [classes, selectedClassId]);

  // Absent roll numbers for current class & date
  // By default when opened: absentRolls is empty [] -> all numbers are GREEN!
  const [absentRolls, setAbsentRolls] = useState<number[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Active modal
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [toastMessage, setToMessage] = useState<string | null>(null);

  // Show temporary toast message
  const triggerToast = useCallback((msg: string) => {
    setToMessage(msg);
    setTimeout(() => {
      setToMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  }, []);

  // Sync attendance state when class or date changes
  useEffect(() => {
    const record = getAttendanceRecordForDate(selectedClassId, formattedDateStr);
    if (record) {
      setAbsentRolls(record.absentRolls || []);
      setIsSaved(true);
      setLastSavedTime(record.savedAt);
    } else {
      // Not yet saved: by default, all green! (0 absentees)
      setAbsentRolls([]);
      setIsSaved(false);
      setLastSavedTime(null);
    }
  }, [selectedClassId, formattedDateStr]);

  // Date change handler
  const handleDateChange = (newDay: number, newMonth: number, newYear: number) => {
    setDay(newDay);
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleSetToday = () => {
    const now = new Date();
    setDay(now.getDate());
    setMonth(now.getMonth() + 1);
    setYear(now.getFullYear());
  };

  // Toggle student roll number (Green <-> Red)
  // When clicked: turns red (absent)
  const handleToggleRoll = (rollNumber: number) => {
    setAbsentRolls((prev) => {
      const isCurrentlyAbsent = prev.includes(rollNumber);
      const nextAbsent = isCurrentlyAbsent
        ? prev.filter((r) => r !== rollNumber)
        : [...prev, rollNumber];

      playToggleSound(!isCurrentlyAbsent, settings.soundEnabled);
      return nextAbsent;
    });
    // Mark as unsaved changes
    setIsSaved(false);
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    setAbsentRolls([]);
    setIsSaved(false);
    playToggleSound(false, settings.soundEnabled);
    triggerToast('All students marked Present');
  };

  // Mark all absent (utility)
  const handleMarkAllAbsent = () => {
    const all = Array.from({ length: currentClass.studentCount }, (_, i) => i + 1);
    setAbsentRolls(all);
    setIsSaved(false);
    playToggleSound(true, settings.soundEnabled);
  };

  // Save Attendance to local storage
  const handleSaveAttendance = () => {
    setIsSaving(true);
    const nowISO = new Date().toISOString();

    const record: AttendanceRecord = {
      id: `${selectedClassId}_${formattedDateStr}`,
      classId: selectedClassId,
      className: currentClass.name,
      date: formattedDateStr,
      day,
      month,
      year,
      totalStudents: currentClass.studentCount,
      absentRolls,
      savedAt: nowISO,
    };

    saveOrUpdateAttendanceRecord(record);
    setAllRecords(getAllAttendanceRecords());

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setLastSavedTime(nowISO);

      // Play audio chime if enabled
      playSaveSound(settings.soundEnabled);

      const presentCount = currentClass.studentCount - absentRolls.length;
      triggerToast(
        `Saved for ${currentClass.name}! (${presentCount} Present, ${absentRolls.length} Absent)`
      );
    }, 250);
  };

  // Profile menu actions
  const handleOpenDownload = () => setActiveModal('download-report');
  const handleOpenSettings = () => setActiveModal('settings');
  const handleOpenLogout = () => setActiveModal('logout');

  const handleConfirmLogout = () => {
    setUserLoggedIn(false);
    setLoggedIn(false);
    setActiveModal('none');
  };

  const handleLogin = () => {
    setUserLoggedIn(true);
    setLoggedIn(true);
  };

  // Settings & Classes updates
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    if (!initialized) {
      setInitialized(true);
      setAppInitialized(true);
      setIsFirstTimeSetup(false);
      triggerToast('Setup complete! Welcome to Attendance App');
    } else {
      triggerToast('Settings updated successfully');
    }
  };

  const handleSaveClasses = (newClasses: ClassItem[]) => {
    setClasses(newClasses);
    saveStoredClasses(newClasses);
    if (!newClasses.some((c) => c.id === selectedClassId)) {
      setSelectedClassId(newClasses[0].id);
    }
  };

  const handleResetDemoData = () => {
    saveAllAttendanceRecords([]);
    setAllRecords([]);
    setAbsentRolls([]);
    setIsSaved(false);
    setLastSavedTime(null);
    triggerToast('All attendance data reset to none');
  };

  // 1. Fresh App: Show single "Get Started" screen if not yet initialized
  if (!initialized && activeModal !== 'settings') {
    return (
      <FreshWelcomeScreen
        onGetStarted={() => {
          setIsFirstTimeSetup(true);
          setActiveModal('settings');
        }}
      />
    );
  }

  // 2. If user is logged out, display dedicated Teacher Sign-In screen
  if (!loggedIn) {
    return <TeacherLoginScreen teacher={settings.teacher} onLogin={handleLogin} />;
  }

  const presentCount = currentClass.studentCount - absentRolls.length;
  const absentCount = absentRolls.length;

  const readableDate = new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-stone-100 flex justify-center selection:bg-emerald-200">
      {/* Mobile-centric application container */}
      <div
        id="app-mobile-container"
        className="w-full max-w-md bg-stone-50 min-h-screen shadow-md flex flex-col relative border-x border-stone-200"
      >
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div
            id="app-toast-message"
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top duration-150 flex items-center gap-2 max-w-[90vw] text-center"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. SINGLE ROW 1: (profile icon, select class, ) on single row */}
        <TopRow
          classes={classes}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
          teacher={settings.teacher}
          onOpenProfileMenu={() => setActiveModal('profile-menu')}
        />

        {/* In-app Install banner for mobile phones */}
        <PWAInstallPrompt />

        {/* 2. SINGLE ROW 2: (day, month, year) on single row */}
        <DateRow
          day={day}
          month={month}
          year={year}
          onDateChange={handleDateChange}
          onSetToday={handleSetToday}
          isToday={isToday}
        />

        {/* 3. BELOW IT: numbers starting from 01, 02, ... each row having 6 numbers like calendar */}
        <div className="flex-1 flex flex-col">
          <AttendanceGrid
            totalStudents={currentClass.studentCount}
            absentRolls={absentRolls}
            onToggleRoll={handleToggleRoll}
            onMarkAllPresent={handleMarkAllPresent}
            onMarkAllAbsent={handleMarkAllAbsent}
          />
        </div>

        {/* 4. IN THE END: Save button */}
        <ActionFooter
          onSave={handleSaveAttendance}
          isSaving={isSaving}
          isSaved={isSaved}
          lastSavedTime={lastSavedTime}
          className={currentClass.name}
          formattedDate={readableDate}
          presentCount={presentCount}
          absentCount={absentCount}
        />

        {/* PROFILE MENU POPUP/DRAWER (Options: 1. Download, 2. Settings, 3. Logout) */}
        <ProfileMenuModal
          isOpen={activeModal === 'profile-menu'}
          onClose={() => setActiveModal('none')}
          teacher={settings.teacher}
          onOpenDownload={handleOpenDownload}
          onOpenSettings={handleOpenSettings}
          onOpenLogout={handleOpenLogout}
        />

        {/* 1. DOWNLOAD ATTENDANCE MODAL (From date, To date, Class, Show button, Attendance list, Download Excel file button) */}
        <DownloadReportModal
          isOpen={activeModal === 'download-report'}
          onClose={() => setActiveModal('none')}
          classes={classes}
          allRecords={allRecords}
          currentClassId={selectedClassId}
        />

        {/* 2. SETTINGS MODAL */}
        <SettingsModal
          isOpen={activeModal === 'settings'}
          onClose={() => {
            if (!initialized) {
              // Mark initialized if closed
              setInitialized(true);
              setAppInitialized(true);
              setIsFirstTimeSetup(false);
            }
            setActiveModal('none');
          }}
          settings={settings}
          onSaveSettings={handleSaveSettings}
          classes={classes}
          onSaveClasses={handleSaveClasses}
          onResetDemoData={handleResetDemoData}
          isFirstTimeSetup={isFirstTimeSetup}
        />

        {/* 3. LOGOUT MODAL */}
        <LogoutModal
          isOpen={activeModal === 'logout'}
          onClose={() => setActiveModal('none')}
          onConfirmLogout={handleConfirmLogout}
          teacher={settings.teacher}
        />
      </div>
    </div>
  );
}
