import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export function AttendanceBadge({ status = 'present', showIcon = true }) {
  const isPresent = status?.toLowerCase() === 'present';

  if (isPresent) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
        Present
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
      {showIcon && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
      Absent
    </span>
  );
}

export function StatusBadge({ status = 'idle', label }) {
  const normalized = status?.toLowerCase();

  const configs = {
    verified: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      text: label || 'Verified',
    },
    verifying: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500 animate-ping',
      text: label || 'Verifying',
    },
    scanning: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500 animate-pulse',
      text: label || 'Scanning',
    },
    detected: {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dot: 'bg-indigo-500',
      text: label || 'Face Detected',
    },
    unknown: {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      dot: 'bg-orange-500',
      text: label || 'Unknown Face',
    },
    already_present: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      dot: 'bg-purple-500',
      text: label || 'Already Present',
    },
    failed: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      text: label || 'Verification Failed',
    },
    idle: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
      text: label || 'Idle',
    },
  };

  const current = configs[normalized] || configs.idle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${current.bg}`}
    >
      <span className={`w-2 h-2 rounded-full ${current.dot}`} />
      {current.text}
    </span>
  );
}

export default AttendanceBadge;
