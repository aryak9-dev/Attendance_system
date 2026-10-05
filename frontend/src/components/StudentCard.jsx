import React from 'react';
import { User, CheckCircle, AlertCircle } from 'lucide-react';

export function StudentCard({ student, attendanceRate, faceRegistered = true, onSelect }) {
  if (!student) return null;

  return (
    <div
      onClick={onSelect}
      className={`bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between ${
        onSelect ? 'cursor-pointer hover:border-indigo-300' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm shrink-0">
          {student.name ? student.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{student.name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {student.registration_number || 'STU000'}
            </span>
            <span className="text-xs text-slate-400 truncate max-w-[160px]">{student.email}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {attendanceRate !== undefined && (
          <div className="text-right">
            <span className="text-sm font-bold text-slate-700">{attendanceRate}%</span>
            <p className="text-[10px] text-slate-400 font-medium">Attended</p>
          </div>
        )}
        <div
          title={faceRegistered ? 'Face registered for verification' : 'Face not yet registered'}
          className={`p-1.5 rounded-full ${
            faceRegistered ? 'text-emerald-600 bg-emerald-50' : 'text-amber-500 bg-amber-50'
          }`}
        >
          {faceRegistered ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
        </div>
      </div>
    </div>
  );
}

export default StudentCard;
