import React from 'react';
import { Eye, CheckCircle2, UserCheck, Users } from 'lucide-react';

export function AttendanceCounter({
  detected = 0,
  verified = 0,
  present = 0,
  total = 30,
}) {
  const percentage = total > 0 ? Math.min(Math.round((present / total) * 100), 100) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Real-Time Attendance Metrics
        </h4>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active Session
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Detected
          </div>
          <p className="text-2xl font-bold text-white mt-1">{detected}</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            Verified
          </div>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{verified}</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            Present
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{present}</p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            Total Class
          </div>
          <p className="text-2xl font-bold text-white mt-1">{total}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center text-xs font-medium text-slate-400 mb-2">
          <span>Class Attendance Progress</span>
          <span className="text-white font-bold">
            {present} of {total} ({percentage}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default AttendanceCounter;
