import React, { useState, useEffect } from 'react';
import { X, Settings, Plus, Trash2, Volume2, VolumeX, Save, RotateCcw, Check, HardDrive, WifiOff } from 'lucide-react';
import { AppSettings, ClassItem } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  classes: ClassItem[];
  onSaveClasses: (newClasses: ClassItem[]) => void;
  onResetDemoData: () => void;
  isFirstTimeSetup?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  classes,
  onSaveClasses,
  onResetDemoData,
  isFirstTimeSetup = false,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>({ ...settings });
  const [localClasses, setLocalClasses] = useState<ClassItem[]>([...classes]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCount, setNewClassCount] = useState<number>(36);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [resetConfirming, setResetConfirming] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings({ ...settings });
      setLocalClasses([...classes]);
      setResetConfirming(false);
      setResetDone(false);
    }
  }, [isOpen, settings, classes]);

  if (!isOpen) return null;

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const newId = `class_${Date.now()}`;
    const updated = [
      ...localClasses,
      {
        id: newId,
        name: newClassName.trim(),
        studentCount: newClassCount || 36,
      },
    ];
    setLocalClasses(updated);
    setNewClassName('');
  };

  const handleRemoveClass = (id: string) => {
    if (localClasses.length <= 1) {
      return;
    }
    setLocalClasses(localClasses.filter((c) => c.id !== id));
  };

  const handleSaveAll = () => {
    onSaveSettings(localSettings);
    onSaveClasses(localClasses);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="settings-modal-container"
        className="w-full max-w-lg max-h-[92vh] bg-stone-50 rounded-3xl sm:rounded-2xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                {isFirstTimeSetup ? 'Initial App Setup' : 'Settings'}
              </h2>
              <p className="text-xs text-stone-500">
                {isFirstTimeSetup
                  ? 'Configure your classes and student count to get started'
                  : 'Configure classes, student count and profile'}
              </p>
            </div>
          </div>

          {!isFirstTimeSetup && (
            <button
              id="close-settings-btn"
              type="button"
              onClick={onClose}
              aria-label="Close settings"
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Section 1: Teacher Profile (hidden during initial app setup) */}
          {!isFirstTimeSetup && (
            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Teacher Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Teacher Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={localSettings.teacher.name}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        teacher: { ...localSettings.teacher, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-900 focus:bg-white focus:border-emerald-600 placeholder:text-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    School / Institution
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Govt Excellence Academy"
                    value={localSettings.teacher.schoolName}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        teacher: { ...localSettings.teacher, schoolName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-900 focus:bg-white focus:border-emerald-600 placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="e.g. teacher@example.com"
                  value={localSettings.teacher.email}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      teacher: { ...localSettings.teacher, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-900 focus:bg-white focus:border-emerald-600 placeholder:text-stone-400"
                />
              </div>
            </div>
          )}

          {/* Section 2: Manage Classes and Roll Counts */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Manage Classes
              </h3>
            </div>

            {/* List of existing classes */}
            <div className="space-y-2">
              {localClasses.map((cls, idx) => (
                <div
                  key={cls.id}
                  className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200"
                >
                  <div className="flex-1 min-w-[140px]">
                    <input
                      type="text"
                      value={cls.name}
                      onChange={(e) => {
                        const updated = [...localClasses];
                        updated[idx].name = e.target.value;
                        setLocalClasses(updated);
                      }}
                      className="text-xs sm:text-sm font-bold text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-emerald-600 focus:bg-white px-1 py-0.5 rounded-sm w-full"
                    />
                  </div>

                  {/* Student Strength input for this class (supports ANY number of students) */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    <span className="text-xs text-stone-500 font-medium">Students:</span>
                    <input
                      type="number"
                      min={1}
                      max={300}
                      value={cls.studentCount}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(300, parseInt(e.target.value) || 1));
                        const updated = [...localClasses];
                        updated[idx].studentCount = val;
                        setLocalClasses(updated);
                      }}
                      className="w-16 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900 text-center focus:border-emerald-600"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveClass(cls.id)}
                      disabled={localClasses.length <= 1}
                      title="Delete class"
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Class form - fully responsive so + Add button never overflows mobile screen */}
            <form onSubmit={handleAddClass} className="pt-2">
              <div className="flex flex-col xs:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. Class 11-A"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-900 focus:bg-white focus:border-emerald-600 placeholder:text-stone-400"
                />
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-stone-50 border border-stone-300 rounded-xl px-2 py-1.5 shrink-0">
                    <label htmlFor="new-class-students-count" className="text-[11px] font-semibold text-stone-500 whitespace-nowrap">
                      Count:
                    </label>
                    <input
                      id="new-class-students-count"
                      type="number"
                      min={1}
                      max={300}
                      value={newClassCount}
                      onChange={(e) => setNewClassCount(Math.max(1, Math.min(300, parseInt(e.target.value) || 1)))}
                      className="w-14 bg-white border border-stone-200 rounded-lg px-1.5 py-0.5 text-xs font-bold text-stone-900 text-center focus:border-emerald-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex-1 xs:flex-none px-3.5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">Add</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Section 3: App Preferences & Audio */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Preferences
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {localSettings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-stone-400" />
                )}
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-stone-800 block">
                    Sound Feedback
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Play gentle click when marking roll numbers and save chime
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.soundEnabled}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, soundEnabled: e.target.checked })
                }
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Section 4: Device Storage & 100% Offline Mode */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
              <span>Device Storage & Offline</span>
            </h3>
            <div className="flex items-start gap-2.5 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
              <WifiOff className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-stone-600 space-y-1">
                <p className="font-semibold text-stone-800">100% Offline & Private on Your Phone</p>
                <p>
                  All attendance records, custom classes, and teacher information are stored directly in your phone&apos;s local storage. No cloud database or active internet connection is ever needed to take attendance.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Reset All Data (hidden during first time setup) */}
          {!isFirstTimeSetup && (
            <div className="p-4 bg-white rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-stone-800 block">
                  Reset Attendance
                </span>
                <span className="text-[11px] text-stone-500 block">
                  Clear all saved attendance records
                </span>
              </div>

              {resetDone ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-xl text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>All Data Reset!</span>
                </div>
              ) : resetConfirming ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setResetConfirming(false)}
                    className="px-2.5 py-1 text-xs font-medium text-stone-500 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetDemoData();
                      setResetConfirming(false);
                      setResetDone(true);
                      setTimeout(() => setResetDone(false), 3000);
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Yes, Clear All
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setResetConfirming(true)}
                  className="px-3 py-1.5 border border-rose-300 hover:bg-rose-50 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer with Save changes */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-end gap-2 shrink-0">
          {!isFirstTimeSetup && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs sm:text-sm font-semibold rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            id="save-settings-btn"
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shadow-emerald-200"
          >
            <Save className="w-4 h-4" />
            <span>{showSavedToast ? 'Saved!' : isFirstTimeSetup ? 'Save & Start Marking' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
