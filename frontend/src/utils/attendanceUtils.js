/**
 * Calculates attendance metrics given an array of attendance records.
 */
export function calculateAttendanceStats(records = []) {
  if (!records || records.length === 0) {
    return {
      total: 0,
      present: 0,
      absent: 0,
      percentage: 0,
    };
  }

  const total = records.length;
  const present = records.filter(r => r.status?.toLowerCase() === 'present').length;
  const absent = total - present;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    total,
    present,
    absent,
    percentage,
  };
}

/**
 * Transforms vertical attendance records into an attendance matrix:
 * Students x Dates -> 'P' | 'A' | '—'
 *
 * records: array of { enrollment_id, student_name, registration_number, date, status }
 */
export function buildAttendanceMatrix(records = []) {
  if (!records || records.length === 0) {
    return { dates: [], rows: [] };
  }

  // Collect unique dates sorted
  const datesSet = new Set();
  const studentMap = new Map();

  records.forEach(rec => {
    if (rec.date) datesSet.add(rec.date);

    const studentKey = rec.registration_number || rec.student_id || rec.student_name || 'Unknown';
    if (!studentMap.has(studentKey)) {
      studentMap.set(studentKey, {
        student_id: rec.student_id,
        name: rec.student_name || studentKey,
        registration_number: rec.registration_number || '—',
        attendanceMap: {},
      });
    }

    const studentEntry = studentMap.get(studentKey);
    studentEntry.attendanceMap[rec.date] = rec.status?.toLowerCase() === 'present' ? 'P' : 'A';
  });

  const sortedDates = Array.from(datesSet).sort();

  const rows = Array.from(studentMap.values()).map(student => {
    let presentCount = 0;
    let totalCount = 0;

    const dateStatuses = sortedDates.map(d => {
      const status = student.attendanceMap[d] || '—';
      if (status === 'P') {
        presentCount++;
        totalCount++;
      } else if (status === 'A') {
        totalCount++;
      }
      return status;
    });

    const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

    return {
      name: student.name,
      registration_number: student.registration_number,
      statuses: dateStatuses,
      presentCount,
      totalCount,
      percentage,
    };
  });

  return {
    dates: sortedDates,
    rows,
  };
}

/**
 * Generates CSV content from attendance records for export.
 */
export function exportAttendanceToCSV(filename, headers, rows) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
