import * as XLSX from 'xlsx';
import { AttendanceRecord } from '../types';

export function exportAttendanceToExcel(
  records: AttendanceRecord[],
  className: string,
  fromDate: string,
  toDate: string
) {
  if (records.length === 0) {
    alert('No attendance records found for the selected range and class.');
    return;
  }

  // Workbook creation
  const wb = XLSX.utils.book_new();

  // Sort records chronologically (oldest to newest date)
  const sortedRecords = [...records].sort((a, b) => a.date.localeCompare(b.date));

  // Collect all unique sorted dates
  const uniqueDates = Array.from(new Set(sortedRecords.map((r) => r.date)));

  // Map each date to its corresponding record
  // If multiple records exist for the same date (e.g. if 'All Classes' is chosen), group or handle appropriately
  const recordByDate = new Map<string, AttendanceRecord>();
  sortedRecords.forEach((r) => {
    recordByDate.set(r.date, r);
  });

  // Determine the maximum student roll number across records
  const maxRoll = Math.max(...sortedRecords.map((r) => r.totalStudents), 1);

  // 1. PRIMARY SHEET: Matrix with Roll No as ROWS and Dates as COLUMNS
  // Each cell indicates 'P' (Present) or 'A' (Absent) for that roll number on that date
  const matrixRows: Array<Record<string, string | number>> = [];

  for (let roll = 1; roll <= maxRoll; roll++) {
    const formattedRoll = String(roll).padStart(2, '0');
    const rowObj: Record<string, string | number> = {
      'Roll No': formattedRoll,
    };

    let totalDaysApplicable = 0;
    let presentDays = 0;
    let absentDays = 0;

    uniqueDates.forEach((dateStr) => {
      const rec = recordByDate.get(dateStr);
      if (!rec) {
        rowObj[dateStr] = '-';
        return;
      }

      if (roll <= rec.totalStudents) {
        totalDaysApplicable++;
        const isAbsent = rec.absentRolls.includes(roll);
        if (isAbsent) {
          absentDays++;
          rowObj[dateStr] = 'A'; // Absent
        } else {
          presentDays++;
          rowObj[dateStr] = 'P'; // Present
        }
      } else {
        // Roll number exceeds the class strength on this date
        rowObj[dateStr] = 'N/A';
      }
    });

    const attendancePct =
      totalDaysApplicable > 0
        ? `${Math.round((presentDays / totalDaysApplicable) * 100)}%`
        : '0%';

    rowObj['Total Days'] = totalDaysApplicable;
    rowObj['Present (P)'] = presentDays;
    rowObj['Absent (A)'] = absentDays;
    rowObj['Attendance %'] = attendancePct;

    matrixRows.push(rowObj);
  }

  // Add daily totals summary rows at the bottom of the matrix
  const totalStudentsRow: Record<string, string | number> = {
    'Roll No': 'TOTAL STUDENTS',
  };
  const totalPresentRow: Record<string, string | number> = {
    'Roll No': 'TOTAL PRESENT',
  };
  const totalAbsentRow: Record<string, string | number> = {
    'Roll No': 'TOTAL ABSENT',
  };
  const dailyPctRow: Record<string, string | number> = {
    'Roll No': 'DAILY ATTENDANCE %',
  };

  let grandTotalStudents = 0;
  let grandTotalPresents = 0;
  let grandTotalAbsents = 0;

  uniqueDates.forEach((dateStr) => {
    const rec = recordByDate.get(dateStr);
    if (rec) {
      const pCount = rec.totalStudents - rec.absentRolls.length;
      const aCount = rec.absentRolls.length;
      const pct = rec.totalStudents > 0 ? `${Math.round((pCount / rec.totalStudents) * 100)}%` : '0%';

      totalStudentsRow[dateStr] = rec.totalStudents;
      totalPresentRow[dateStr] = pCount;
      totalAbsentRow[dateStr] = aCount;
      dailyPctRow[dateStr] = pct;

      grandTotalStudents += rec.totalStudents;
      grandTotalPresents += pCount;
      grandTotalAbsents += aCount;
    } else {
      totalStudentsRow[dateStr] = '-';
      totalPresentRow[dateStr] = '-';
      totalAbsentRow[dateStr] = '-';
      dailyPctRow[dateStr] = '-';
    }
  });

  totalStudentsRow['Total Days'] = '-';
  totalStudentsRow['Present (P)'] = grandTotalPresents;
  totalStudentsRow['Absent (A)'] = grandTotalAbsents;
  totalStudentsRow['Attendance %'] =
    grandTotalStudents > 0
      ? `${Math.round((grandTotalPresents / grandTotalStudents) * 100)}%`
      : '0%';

  totalPresentRow['Total Days'] = '-';
  totalPresentRow['Present (P)'] = '-';
  totalPresentRow['Absent (A)'] = '-';
  totalPresentRow['Attendance %'] = '-';

  totalAbsentRow['Total Days'] = '-';
  totalAbsentRow['Present (P)'] = '-';
  totalAbsentRow['Absent (A)'] = '-';
  totalAbsentRow['Attendance %'] = '-';

  dailyPctRow['Total Days'] = '-';
  dailyPctRow['Present (P)'] = '-';
  dailyPctRow['Absent (A)'] = '-';
  dailyPctRow['Attendance %'] = '-';

  matrixRows.push(totalStudentsRow);
  matrixRows.push(totalPresentRow);
  matrixRows.push(totalAbsentRow);
  matrixRows.push(dailyPctRow);

  const wsMatrix = XLSX.utils.json_to_sheet(matrixRows);

  // Set column widths for clean readability
  const colWidths: { wch: number }[] = [
    { wch: 16 }, // Roll No column / Summary labels
  ];
  uniqueDates.forEach(() => {
    colWidths.push({ wch: 12 }); // date columns like YYYY-MM-DD
  });
  colWidths.push({ wch: 12 }); // Total Days
  colWidths.push({ wch: 13 }); // Present (P)
  colWidths.push({ wch: 12 }); // Absent (A)
  colWidths.push({ wch: 14 }); // Attendance %
  wsMatrix['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, wsMatrix, 'Attendance Sheet');

  // 2. SECOND SHEET: Date-wise Logs
  const detailedData = sortedRecords.map((rec, index) => {
    const presentCount = rec.totalStudents - rec.absentRolls.length;
    const absentCount = rec.absentRolls.length;
    const percentage =
      rec.totalStudents > 0
        ? ((presentCount / rec.totalStudents) * 100).toFixed(1) + '%'
        : '0%';

    const absentRollsStr =
      rec.absentRolls.length > 0
        ? rec.absentRolls
            .map((r) => String(r).padStart(2, '0'))
            .sort((a, b) => Number(a) - Number(b))
            .join(', ')
        : 'None (100% Present)';

    return {
      'S.No': index + 1,
      'Date': rec.date,
      'Class': rec.className,
      'Total Strength': rec.totalStudents,
      'Present Count': presentCount,
      'Absent Count': absentCount,
      'Attendance %': percentage,
      'Absent Roll Numbers': absentRollsStr,
      'Saved At': new Date(rec.savedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  });

  const wsDetailed = XLSX.utils.json_to_sheet(detailedData);
  XLSX.utils.book_append_sheet(wb, wsDetailed, 'Date-wise Log');

  // Clean filename
  const cleanClassName = className.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Attendance_${cleanClassName}_${fromDate}_to_${toDate}.xlsx`;

  XLSX.writeFile(wb, filename);
}

