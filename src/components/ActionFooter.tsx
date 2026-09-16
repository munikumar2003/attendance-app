import React from 'react';
import { Save, Check, Clock } from 'lucide-react';

interface ActionFooterProps {
  onSave: () => void;
  isSaving: boolean;
  isSaved: boolean;
  lastSavedTime?: string | null;
  className: string;
  formattedDate: string;
  presentCount: number;
  absentCount: number;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({
  onSave,
  isSaving,
  isSaved,
  lastSavedTime,
  className,
  formattedDate,
  presentCount,
  absentCount,
}) => {
  return (
    <div
      id="save-action-footer"
      className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 sm:p-4 z-20 shadow-lg"
    >
      <div className="max-w-lg mx-auto flex flex-col gap-2">
        {/* Info label */}
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span className="truncate">
            {className} • {formattedDate}
          </span>
          {lastSavedTime && (
            <span className="flex items-center gap-1 text-[11px] text-stone-400">
              <Clock className="w-3 h-3" />
              Saved at {new Date(lastSavedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* The requested Save Button */}
        <button
          id="save-attendance-btn"
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className={`
            w-full py-3.5 px-6 rounded-xl font-bold text-base shadow-sm
            flex items-center justify-center gap-2.5 transition-all duration-200
            active:scale-[0.98] cursor-pointer min-h-[50px]
            focus:outline-hidden focus:ring-4
            ${
              isSaved
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white focus:ring-emerald-200'
                : 'bg-stone-900 hover:bg-black text-white focus:ring-stone-300'
            }
          `}
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="w-5 h-5 text-emerald-300 stroke-[3]" />
              <span>Attendance Saved</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5 stroke-[2.5]" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
