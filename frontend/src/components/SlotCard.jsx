import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

export function SlotCard({ slot, onSelect, isSelected = false, compact = false }) {
  if (!slot) return null;

  const formattedStart = formatTime(slot.start_time);
  const formattedEnd = formatTime(slot.end_time);

  if (compact) {
    return (
      <div
        onClick={onSelect}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
          isSelected
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
        }`}
      >
        <span className="font-semibold">{slot.day}</span>
        <span className="opacity-80">
          {formattedStart} - {formattedEnd}
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`border rounded-xl p-4 transition-all duration-150 ${
        onSelect ? 'cursor-pointer hover:border-indigo-400' : ''
      } ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
          : 'border-slate-200 bg-white hover:bg-slate-50/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2.5 py-1 rounded-md">
          <Calendar className="w-3.5 h-3.5" />
          {slot.day}
        </span>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          60 mins
        </span>
      </div>
      <div className="mt-2.5">
        <p className="text-base font-bold text-slate-800">
          {formattedStart} – {formattedEnd}
        </p>
      </div>
    </div>
  );
}

export default SlotCard;
