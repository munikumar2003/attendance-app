import React from 'react';
import { RotateCcw } from 'lucide-react';

interface AttendanceGridProps {
  totalStudents: number;
  absentRolls: number[]; // array of roll numbers marked absent
  onToggleRoll: (rollNumber: number) => void;
  onMarkAllPresent: () => void;
  onMarkAllAbsent: () => void;
}

export const AttendanceGrid: React.FC<AttendanceGridProps> = ({
  totalStudents,
  absentRolls,
  onToggleRoll,
  onMarkAllPresent,
}) => {
  const absentSet = new Set(absentRolls);

  // Generate array [1, 2, ..., totalStudents]
  const rolls = Array.from({ length: totalStudents }, (_, i) => i + 1);

  return (
    <div id="attendance-section" className="flex-1 flex flex-col p-3 sm:p-4 max-w-lg mx-auto w-full">
      {/* 6 NUMBERS PER ROW CALENDAR GRID */}
      {/* Starting from 01, 02, ... each row having 6 numbers like calendar */}
      <div
        id="attendance-calendar-grid"
        className="grid grid-cols-6 gap-2 sm:gap-2.5 p-3 bg-white rounded-2xl border border-stone-200 shadow-sm"
      >
        {rolls.map((roll) => {
          const isAbsent = absentSet.has(roll);
          const rollFormatted = String(roll).padStart(2, '0');

          return (
            <button
              key={roll}
              id={`roll-btn-${rollFormatted}`}
              type="button"
              onClick={() => onToggleRoll(roll)}
              aria-label={`Roll Number ${rollFormatted}, ${isAbsent ? 'Absent' : 'Present'}`}
              aria-pressed={isAbsent}
              className={`
                w-full aspect-square rounded-xl flex items-center justify-center
                font-mono font-bold text-base sm:text-lg tracking-tight select-none cursor-pointer
                transition-colors duration-100 touch-manipulation
                focus:outline-hidden focus:ring-2 focus:ring-offset-2
                ${
                  isAbsent
                    ? 'bg-rose-600 hover:bg-rose-700 text-white ring-rose-500 shadow-sm shadow-rose-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-emerald-500 shadow-sm shadow-emerald-200'
                }
              `}
            >
              {/* Roll Number (01, 02, ...) */}
              <span className="leading-none pointer-events-none select-none">{rollFormatted}</span>
            </button>
          );
        })}
      </div>

      {/* Small refresh symbol at the end of the roll no. list at the right down corner */}
      <div className="flex justify-end pt-2 px-1">
        <button
          id="refresh-all-green-btn"
          type="button"
          onClick={onMarkAllPresent}
          title="Reset all roll numbers to Present (Green)"
          aria-label="Reset all roll numbers to green"
          className="p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer flex items-center justify-center group"
        >
          <RotateCcw className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
};

