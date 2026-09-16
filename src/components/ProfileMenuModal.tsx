import React from 'react';
import { Download, Settings, LogOut, X, School, Mail, User } from 'lucide-react';
import { TeacherProfile } from '../types';

interface ProfileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile;
  onOpenDownload: () => void;
  onOpenSettings: () => void;
  onOpenLogout: () => void;
}

export const ProfileMenuModal: React.FC<ProfileMenuModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onOpenDownload,
  onOpenSettings,
  onOpenLogout,
}) => {
  if (!isOpen) return null;

  const hasTeacherDetails = Boolean(teacher.name || teacher.schoolName || teacher.email);

  return (
    <div
      id="profile-menu-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="profile-menu-container"
        className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl border border-stone-200 shadow-xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with profile info */}
        <div className="p-5 bg-stone-50 border-b border-stone-200 relative">
          <button
            id="close-profile-menu-btn"
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-sm"
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
                <User className="w-6 h-6" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-stone-900 leading-snug truncate">
                {teacher.name || 'Attendance Manager'}
              </h3>
              {teacher.schoolName && (
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5 truncate">
                  <School className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{teacher.schoolName}</span>
                </p>
              )}
              {teacher.email ? (
                <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{teacher.email}</span>
                </p>
              ) : !hasTeacherDetails ? (
                <p className="text-xs text-stone-400 mt-0.5">Offline Local Mode</p>
              ) : null}
            </div>
          </div>
        </div>

        {/* The 3 Options Requested by the User */}
        <div className="p-3 flex flex-col gap-1.5">
          {/* OPTION 1: Download Attendance (Report & Excel) */}
          <button
            id="menu-download-attendance-btn"
            type="button"
            onClick={() => {
              onClose();
              onOpenDownload();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-emerald-50 active:bg-emerald-100 text-stone-800 transition-colors group cursor-pointer text-left border border-transparent hover:border-emerald-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-900 block">Download Attendance</span>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Excel
            </span>
          </button>

          {/* OPTION 2: Settings */}
          <button
            id="menu-settings-btn"
            type="button"
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-stone-100 active:bg-stone-200 text-stone-800 transition-colors group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-900 block">Settings</span>
              </div>
            </div>
          </button>

          {/* OPTION 3: Logout */}
          <button
            id="menu-logout-btn"
            type="button"
            onClick={() => {
              onClose();
              onOpenLogout();
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-rose-50 active:bg-rose-100 text-rose-700 transition-colors group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-rose-700 block">Logout</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
