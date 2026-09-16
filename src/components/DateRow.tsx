import React from 'react';

interface DateRowProps {
  day: number;
  month: number; // 1 - 12
  year: number;
  onDateChange: (newDay: number, newMonth: number, newYear: number) => void;
  onSetToday: () => void;
  isToday: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const DateRow: React.FC<DateRowProps> = ({
  day,
  month,
  year,
  onDateChange,
  onSetToday,
  isToday,
}) => {
  // Days in selected month & year
  const daysInMonth = new Date(year, month, 0).getDate();

  // Selected date object to get day-of-week
  const currentDateObj = new Date(year, month - 1, day);
  const weekdayName = currentDateObj.toLocaleDateString('en-US', { weekday: 'short' });

  const handleDayChange = (newDay: number) => {
    onDateChange(newDay, month, year);
  };

  const handleMonthChange = (newMonth: number) => {
    const maxDaysInNewMonth = new Date(year, newMonth, 0).getDate();
    const clampedDay = Math.min(day, maxDaysInNewMonth);
    onDateChange(clampedDay, newMonth, year);
  };

  const handleYearChange = (newYear: number) => {
    const maxDaysInNewMonth = new Date(newYear, month, 0).getDate();
    const clampedDay = Math.min(day, maxDaysInNewMonth);
    onDateChange(clampedDay, month, newYear);
  };

  return (
    <div
      id="date-selection-single-row"
      className="px-3 py-2.5 bg-stone-100/90 border-b border-stone-200"
    >
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {/* 1. Day Selector */}
        <div className="flex-1 min-w-0">
          <label htmlFor="select-day" className="sr-only">
            Day
          </label>
          <div className="relative">
            <select
              id="select-day"
              value={day}
              onChange={(e) => handleDayChange(Number(e.target.value))}
              className="w-full text-center px-1 py-1.5 sm:py-2 bg-white text-stone-900 font-bold text-xs sm:text-sm rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 cursor-pointer shadow-2xs"
            >
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {String(d).padStart(2, '0')} Day
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Month Selector */}
        <div className="flex-1.3 min-w-0">
          <label htmlFor="select-month" className="sr-only">
            Month
          </label>
          <div className="relative">
            <select
              id="select-month"
              value={month}
              onChange={(e) => handleMonthChange(Number(e.target.value))}
              className="w-full text-center px-1 py-1.5 sm:py-2 bg-white text-stone-900 font-bold text-xs sm:text-sm rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 cursor-pointer shadow-2xs"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {MONTH_SHORT[idx]} ({String(idx + 1).padStart(2, '0')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Year Selector */}
        <div className="flex-1 min-w-0">
          <label htmlFor="select-year" className="sr-only">
            Year
          </label>
          <div className="relative">
            <select
              id="select-year"
              value={year}
              onChange={(e) => handleYearChange(Number(e.target.value))}
              className="w-full text-center px-1 py-1.5 sm:py-2 bg-white text-stone-900 font-bold text-xs sm:text-sm rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 cursor-pointer shadow-2xs"
            >
              {[2023, 2024, 2025, 2026, 2027, 2028, 2029].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Today Pill */}
        <button
          id="today-quick-btn"
          type="button"
          onClick={onSetToday}
          className={`shrink-0 px-2.5 py-1.5 sm:py-2 text-xs font-semibold rounded-lg border transition-all ${
            isToday
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50 active:bg-stone-200'
          }`}
          title="Jump to Today"
        >
          {isToday ? 'Today' : weekdayName}
        </button>
      </div>
    </div>
  );
};
