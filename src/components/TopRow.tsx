import React from 'react';
import { User, ChevronDown, School } from 'lucide-react';
import { ClassItem, TeacherProfile } from '../types';

interface TopRowProps {
  classes: ClassItem[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  teacher: TeacherProfile;
  onOpenProfileMenu: () => void;
}

export const TopRow: React.FC<TopRowProps> = ({
  classes,
  selectedClassId,
  onSelectClass,
  teacher,
  onOpenProfileMenu,
}) => {
  return (
    <div
      id="top-profile-class-row"
      className="flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs"
    >
      {/* Profile Icon Button */}
      <button
        id="profile-icon-button"
        type="button"
        onClick={onOpenProfileMenu}
        aria-label="Open Profile Menu"
        className="p-1.5 -ml-1 rounded-full hover:bg-stone-100 active:bg-stone-200 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-600 cursor-pointer shrink-0"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-xs transition-transform active:scale-95"
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
      </button>

      {/* Select Class Dropdown on the same row */}
      <div className="flex-1 relative">
        <label htmlFor="select-class-dropdown" className="sr-only">
          Select Class
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3 pointer-events-none text-stone-400">
            <School className="w-4 h-4" />
          </div>
          <select
            id="select-class-dropdown"
            value={selectedClassId}
            onChange={(e) => onSelectClass(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-stone-50 hover:bg-stone-100 focus:bg-white text-stone-900 font-semibold text-sm rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all appearance-none cursor-pointer text-ellipsis"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id} className="py-1 text-stone-900">
                {cls.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 pointer-events-none text-stone-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
