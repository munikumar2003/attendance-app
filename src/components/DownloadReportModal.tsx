import React, { useState, useMemo } from 'react';
import {
  X,
  FileSpreadsheet,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  TrendingUp,
  School,
  ArrowUpDown,
  Search,
  Users,
} from 'lucide-react';
import { AttendanceRecord, ClassItem } from '../types';
import { exportAttendanceToExcel } from '../utils/excelExport';

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassItem[];
  allRecords: AttendanceRecord[];
  currentClassId: string;
}

export const DownloadReportModal: React.FC<DownloadReportModalProps> = ({
  isOpen,
  onClose,
  classes,
  allRecords,
  currentClassId,
}) => {
  // Default date range: past 14 days up to today
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const defaultFromStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split('T')[0];
  }, []);

  const [fromDate, setFromDate] = useState<string>(defaultFromStr);
  const [toDate, setToDate] = useState<string>(todayStr);
  const [selectedClassId, setSelectedClassId] = useState<string>(currentClassId);
  const [hasSearched, setHasSearched] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'datewise' | 'students'>('datewise');

  if (!isOpen) return null;

  // Filter records based on selected fromDate, toDate, and classId
  const filteredRecords = allRecords
    .filter((record) => {
      // Date filter
      if (fromDate && record.date < fromDate) return false;
      if (toDate && record.date > toDate) return false;
      // Class filter
      if (selectedClassId !== 'ALL' && record.classId !== selectedClassId) return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first

  // Summary statistics
  const totalDays = filteredRecords.length;
  let totalStudentSlots = 0;
  let totalPresents = 0;
  let totalAbsents = 0;

  filteredRecords.forEach((r) => {
    totalStudentSlots += r.totalStudents;
    const abs = r.absentRolls.length;
    totalAbsents += abs;
    totalPresents += r.totalStudents - abs;
  });

  const overallAttendanceRate =
    totalStudentSlots > 0
      ? Math.round((totalPresents / totalStudentSlots) * 100)
      : 0;

  const selectedClassName =
    selectedClassId === 'ALL'
      ? 'All Classes'
      : classes.find((c) => c.id === selectedClassId)?.name || 'Class';

  const handleDownloadExcel = () => {
    exportAttendanceToExcel(
      filteredRecords,
      selectedClassName,
      fromDate || 'start',
      toDate || 'end'
    );
  };

  return (
    <div
      id="download-report-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="download-report-modal"
        className="w-full max-w-xl max-h-[92vh] bg-stone-50 rounded-3xl sm:rounded-2xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Attendance Reports & Export
              </h2>
              <p className="text-xs text-stone-500">
                Filter records and download Excel report
              </p>
            </div>
          </div>

          <button
            id="close-download-modal-btn"
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter / Sorting Form (Requested: from date, to date, class, and show button) */}
        <div
          id="report-filter-section"
          className="p-4 bg-white border-b border-stone-200 shrink-0"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            {/* 1. From Date */}
            <div>
              <label htmlFor="filter-from-date" className="block text-xs font-semibold text-stone-700 mb-1">
                From Date
              </label>
              <div className="relative">
                <input
                  id="filter-from-date"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
            </div>

            {/* 2. To Date */}
            <div>
              <label htmlFor="filter-to-date" className="block text-xs font-semibold text-stone-700 mb-1">
                To Date
              </label>
              <div className="relative">
                <input
                  id="filter-to-date"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>
            </div>

            {/* 3. Class */}
            <div>
              <label htmlFor="filter-class" className="block text-xs font-semibold text-stone-700 mb-1">
                Class
              </label>
              <div className="relative">
                <select
                  id="filter-class"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 appearance-none cursor-pointer"
                >
                  <option value="ALL">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Show Button and Download Excel File Button Row */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            {/* Show Button */}
            <button
              id="filter-show-attendance-btn"
              type="button"
              onClick={() => setHasSearched(true)}
              className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Search className="w-4 h-4" />
              <span>Show Attendance</span>
            </button>

            {/* Download Excel File Button */}
            <button
              id="download-excel-file-btn"
              type="button"
              onClick={handleDownloadExcel}
              disabled={filteredRecords.length === 0}
              className={`
                w-full sm:w-auto flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98
                ${
                  filteredRecords.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }
              `}
            >
              <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
              <span>Download Excel File</span>
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-center">
              <span className="text-[11px] text-stone-500 block font-medium">Working Days</span>
              <span className="text-base sm:text-lg font-bold text-stone-900">{totalDays}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-center">
              <span className="text-[11px] text-stone-500 block font-medium">Avg Present</span>
              <span className="text-base sm:text-lg font-bold text-emerald-700">
                {totalDays > 0 ? Math.round(totalPresents / totalDays) : 0}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-center">
              <span className="text-[11px] text-stone-500 block font-medium">Attendance %</span>
              <span className="text-base sm:text-lg font-bold text-stone-900">
                {overallAttendanceRate}%
              </span>
            </div>
          </div>

          {/* Records List Header / View Tabs */}
          <div className="flex items-center justify-between pt-1">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              {selectedClassName} Records ({filteredRecords.length})
            </h4>

            <div className="flex items-center gap-1 bg-stone-200 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('datewise')}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'datewise' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Datewise
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('students')}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'students' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Roll Matrix
              </button>
            </div>
          </div>

          {/* Attendance Records List */}
          {filteredRecords.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
              <Calendar className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700">No attendance records found</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Try selecting a broader date range or mark attendance for this class and click "Save".
              </p>
            </div>
          ) : activeTab === 'datewise' ? (
            <div className="space-y-2">
              {filteredRecords.map((record) => {
                const presentCount = record.totalStudents - record.absentRolls.length;
                const absentCount = record.absentRolls.length;
                const rate = Math.round((presentCount / record.totalStudents) * 100);

                return (
                  <div
                    key={record.id}
                    className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs hover:border-stone-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs sm:text-sm font-bold text-stone-900">
                          {record.date}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium">
                          {record.className}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          rate >= 85
                            ? 'bg-emerald-100 text-emerald-800'
                            : rate >= 65
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rate}% ({presentCount}/{record.totalStudents})
                      </span>
                    </div>

                    {/* Absent numbers pill row */}
                    {absentCount > 0 ? (
                      <div className="flex items-start gap-1 text-xs text-rose-700 mt-2 pt-2 border-t border-stone-100">
                        <span className="font-medium shrink-0">Absent ({absentCount}):</span>
                        <div className="flex flex-wrap gap-1">
                          {record.absentRolls
                            .slice()
                            .sort((a, b) => a - b)
                            .map((r) => (
                              <span
                                key={r}
                                className="font-mono text-[11px] font-bold px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded-sm"
                              >
                                #{String(r).padStart(2, '0')}
                              </span>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>100% Attendance (All present)</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Student Roll-wise Matrix View */
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <div className="p-2.5 bg-stone-100 border-b border-stone-200 grid grid-cols-4 text-[11px] font-bold text-stone-600 text-center">
                <span>Roll No</span>
                <span>Present</span>
                <span>Absent</span>
                <span>Rate %</span>
              </div>
              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
                {Array.from(
                  { length: Math.max(...filteredRecords.map((r) => r.totalStudents), 1) },
                  (_, i) => i + 1
                ).map((roll) => {
                  let pres = 0;
                  let abs = 0;
                  filteredRecords.forEach((rec) => {
                    if (roll <= rec.totalStudents) {
                      if (rec.absentRolls.includes(roll)) abs++;
                      else pres++;
                    }
                  });
                  const total = pres + abs;
                  if (total === 0) return null;
                  const pct = Math.round((pres / total) * 100);

                  return (
                    <div
                      key={roll}
                      className="p-2 grid grid-cols-4 text-xs font-mono text-center items-center hover:bg-stone-50"
                    >
                      <span className="font-bold text-stone-900">
                        #{String(roll).padStart(2, '0')}
                      </span>
                      <span className="text-emerald-700 font-medium">{pres}</span>
                      <span className={abs > 0 ? 'text-rose-700 font-bold' : 'text-stone-400'}>
                        {abs}
                      </span>
                      <span
                        className={`font-sans text-[11px] font-bold px-1 py-0.5 rounded-sm inline-block ${
                          pct >= 75 ? 'text-emerald-800' : 'text-rose-700'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Download Bar */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-stone-500">
            Export ready in standard Microsoft Excel (.xlsx) format
          </span>
          <button
            id="footer-download-excel-btn"
            type="button"
            onClick={handleDownloadExcel}
            disabled={filteredRecords.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 text-white disabled:text-stone-400 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
