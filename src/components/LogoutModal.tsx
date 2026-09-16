import React, { useState } from 'react';
import { LogOut, X, ShieldCheck, Lock, UserCheck, School, User } from 'lucide-react';
import { TeacherProfile } from '../types';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
  teacher: TeacherProfile;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
  teacher,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="logout-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="logout-modal-container"
        className="w-full max-w-sm bg-white rounded-3xl sm:rounded-2xl border border-stone-200 shadow-2xl p-5 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <LogOut className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-stone-900 mb-1">Confirm Logout</h3>
        <p className="text-xs text-stone-500 mb-5 leading-relaxed">
          Are you sure you want to log out of the teacher attendance portal? All your saved
          attendance records remain safely stored on this device.
        </p>

        {/* User Card */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 mb-5 text-left flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: teacher.avatarColor || '#10b981' }}
          >
            {teacher.name ? (
              teacher.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-stone-900 truncate">
              {teacher.name || 'Local Teacher Session'}
            </p>
            <p className="text-[11px] text-stone-500 truncate">
              {teacher.email || 'Offline Local Storage'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="confirm-logout-btn"
            type="button"
            onClick={() => {
              onConfirmLogout();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-xs shadow-rose-200 flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface TeacherLoginScreenProps {
  teacher: TeacherProfile;
  onLogin: () => void;
}

export const TeacherLoginScreen: React.FC<TeacherLoginScreenProps> = ({ teacher, onLogin }) => {
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div
      id="teacher-login-screen"
      className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
        {/* App Logo / Avatar */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md mx-auto mb-4"
          style={{ backgroundColor: teacher.avatarColor || '#10b981' }}
        >
          {teacher.name ? (
            teacher.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()
          ) : (
            <User className="w-8 h-8" />
          )}
        </div>

        <h1 className="text-xl font-bold text-stone-900 mb-1">Attendance Marking</h1>
        {teacher.schoolName ? (
          <p className="text-xs text-stone-500 mb-6 flex items-center justify-center gap-1">
            <School className="w-3.5 h-3.5 text-stone-400" />
            <span>{teacher.schoolName}</span>
          </p>
        ) : (
          <p className="text-xs text-stone-500 mb-6">100% Offline Mode</p>
        )}

        {/* Profile Info badge */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 mb-6 text-left flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-stone-900 truncate">
              {teacher.name || 'Local Teacher Session'}
            </p>
            <p className="text-[11px] text-stone-500 truncate">
              {teacher.email || 'Saved Locally On Device'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="teacher-quick-pin" className="block text-xs font-semibold text-stone-600 mb-1 text-left">
              Teacher PIN (Optional)
            </label>
            <div className="relative">
              <input
                id="teacher-quick-pin"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-widest text-lg font-mono py-2.5 px-3 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-xl transition-all shadow-sm shadow-emerald-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Sign In to Mark Attendance</span>
          </button>
        </form>

        <p className="text-[11px] text-stone-400 mt-6">
          Optimized for Mobile Devices • Quick 1-Tap Attendance
        </p>
      </div>
    </div>
  );
};
