import React from 'react';
import { BookOpen, Users, Calendar, ArrowRight, Video } from 'lucide-react';
import SlotCard from './SlotCard';

export function ClassCard({
  classItem,
  slots = [],
  enrolledCount = 0,
  attendancePercentage,
  isEnrolled = false,
  role = 'teacher',
  onViewDetails,
  onViewStudents,
  onStartAttendance,
  onRegister,
  isRegistering = false,
}) {
  if (!classItem) return null;

  const capacity = classItem.capacity || 30;
  const count = enrolledCount || classItem.enrolled_count || 0;
  const capacityPct = Math.min(Math.round((count / capacity) * 100), 100);
  const isFull = count >= capacity;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 line-clamp-1">{classItem.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {classItem.description || 'No description provided'}
              </p>
            </div>
          </div>

          {attendancePercentage !== undefined && (
            <div className="text-right shrink-0">
              <span className="text-sm font-bold text-indigo-600">{attendancePercentage}%</span>
              <p className="text-[10px] uppercase font-semibold text-slate-400">Attendance</p>
            </div>
          )}
        </div>

        {/* Capacity / Student Counter */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-500 flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Enrollment
            </span>
            <span className="font-semibold text-slate-700">
              {count} / {capacity} students
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                capacityPct > 90 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${capacityPct}%` }}
            />
          </div>
        </div>

        {/* Weekly Slots */}
        {slots && slots.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Weekly Schedule
            </p>
            <div className="flex flex-wrap gap-1.5">
              {slots.map((slot) => (
                <SlotCard key={slot.id} slot={slot} compact />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
        {role === 'teacher' ? (
          <>
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(classItem)}
                className="flex-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-center"
              >
                View Details
              </button>
            )}
            {onViewStudents && (
              <button
                onClick={() => onViewStudents(classItem)}
                className="flex-1 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-colors text-center"
              >
                Students
              </button>
            )}
            {onStartAttendance && (
              <button
                onClick={() => onStartAttendance(classItem)}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
                title="Start live attendance session"
              >
                <Video className="w-3.5 h-3.5" />
                Start
              </button>
            )}
          </>
        ) : (
          /* Student actions */
          <>
            {isEnrolled ? (
              <button
                onClick={() => onViewDetails && onViewDetails(classItem)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
              >
                <span>View Attendance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onRegister && onRegister(classItem)}
                disabled={isFull || isRegistering}
                className={`w-full px-3 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                  isFull
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isRegistering ? 'Registering...' : isFull ? 'Class Full' : 'Register for Class'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ClassCard;
