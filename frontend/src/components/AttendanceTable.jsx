import React from 'react';
import AttendanceBadge from './AttendanceBadge';
import { formatDate } from '../utils/formatDate';
import { formatTime } from '../utils/formatTime';
import EmptyState from './EmptyState';

export function AttendanceTable({
  records = [],
  matrixData = null,
  isMatrixView = false,
  showClassColumn = true,
  onStatusToggle, // Optional for review mode
  isEditable = false,
}) {
  // If Matrix View is selected
  if (isMatrixView && matrixData && matrixData.rows.length > 0) {
    return (
      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                Student
              </th>
              <th className="py-3 px-3">Reg No</th>
              {matrixData.dates.map((dateStr) => (
                <th key={dateStr} className="py-3 px-3 text-center border-l border-slate-200 min-w-[70px]">
                  {formatDate(dateStr, { month: 'short', day: 'numeric' })}
                </th>
              ))}
              <th className="py-3 px-4 text-right border-l border-slate-200">Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matrixData.rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-800 sticky left-0 bg-white hover:bg-slate-50 border-r border-slate-200">
                  {row.name}
                </td>
                <td className="py-3 px-3 text-xs font-mono text-slate-500">
                  {row.registration_number}
                </td>
                {row.statuses.map((status, sIdx) => (
                  <td key={sIdx} className="py-3 px-3 text-center border-l border-slate-100">
                    {status === 'P' ? (
                      <span className="inline-block w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 font-bold text-xs leading-6">
                        P
                      </span>
                    ) : status === 'A' ? (
                      <span className="inline-block w-6 h-6 rounded-md bg-rose-100 text-rose-700 font-bold text-xs leading-6">
                        A
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                ))}
                <td className="py-3 px-4 text-right border-l border-slate-200">
                  <span
                    className={`font-bold text-xs px-2 py-1 rounded-full ${
                      row.percentage >= 75
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {row.percentage}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Standard vertical view
  if (!records || records.length === 0) {
    return <EmptyState title="No attendance records" description="No attendance records match the selected criteria." />;
  }

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <th className="py-3.5 px-4">Student</th>
            <th className="py-3.5 px-4">Registration No</th>
            {showClassColumn && <th className="py-3.5 px-4">Class</th>}
            <th className="py-3.5 px-4">Slot</th>
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4">Status</th>
            {isEditable && <th className="py-3.5 px-4 text-right">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map((record, index) => {
            const isPresent = record.status?.toLowerCase() === 'present';

            return (
              <tr key={record.id || index} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  {record.student_name || record.name || `Student #${record.student_id || record.enrollment_id}`}
                </td>
                <td className="py-3 px-4 font-mono text-xs text-indigo-700 font-medium">
                  {record.registration_number || record.student_reg || '—'}
                </td>
                {showClassColumn && (
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {record.class_name || '—'}
                  </td>
                )}
                <td className="py-3 px-4 text-slate-500 text-xs">
                  {record.slot_time || (record.start_time ? `${formatTime(record.start_time)}` : 'Class Slot')}
                </td>
                <td className="py-3 px-4 text-slate-600 text-xs">
                  {formatDate(record.date)}
                </td>
                <td className="py-3 px-4">
                  <AttendanceBadge status={record.status} />
                </td>
                {isEditable && onStatusToggle && (
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onStatusToggle(record)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                        isPresent
                          ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      Mark {isPresent ? 'Absent' : 'Present'}
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;
