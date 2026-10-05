import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Video,
  Calendar,
  Clock,
  BookOpen,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import classApi from '../../services/classApi';
import slotApi from '../../services/slotApi';
import { getTodayDateString, formatDate } from '../../utils/formatDate';
import { formatTime } from '../../utils/formatTime';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import { parseApiError } from '../../utils/errorHandler';

export function StartAttendance() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const paramClassId = searchParams.get('classId');

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [sessionDate, setSessionDate] = useState(getTodayDateString());
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch Teacher Classes
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await classApi.getClasses();
        const teacherClasses = data.filter(
          (c) => !user?.id || c.teacher_id === user.id || data.length <= 2
        );
        setClasses(teacherClasses);

        if (paramClassId && teacherClasses.some((c) => String(c.id) === String(paramClassId))) {
          setSelectedClassId(paramClassId);
        } else if (teacherClasses.length > 0) {
          setSelectedClassId(String(teacherClasses[0].id));
        }
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user, paramClassId]);

  // 2. Fetch Slots whenever selectedClassId changes
  useEffect(() => {
    if (!selectedClassId) {
      setSlots([]);
      setSelectedSlotId('');
      return;
    }

    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const slotsData = await slotApi.getClassSlots(selectedClassId);
        setSlots(slotsData || []);
        if (slotsData && slotsData.length > 0) {
          setSelectedSlotId(String(slotsData[0].id));
        } else {
          setSelectedSlotId('');
        }
      } catch (err) {
        console.warn('Slot load error:', err);
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedClassId]);

  const handleStartSession = (e) => {
    e.preventDefault();
    if (!selectedClassId || !selectedSlotId) {
      return;
    }

    // Pass configuration to live session screen
    navigate('/teacher/attendance/session', {
      state: {
        classId: selectedClassId,
        slotId: selectedSlotId,
        date: sessionDate,
      },
    });
  };

  const selectedClass = classes.find((c) => String(c.id) === String(selectedClassId));
  const selectedSlot = slots.find((s) => String(s.id) === String(selectedSlotId));

  if (loading) {
    return <LoadingSpinner text="Preparing attendance session options..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <Video className="w-3.5 h-3.5" />
          Face Recognition Verification Session
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Initialize Attendance Session
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select course, scheduled weekly time slot, and session date to launch camera verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Configuration */}
        <div className="md:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleStartSession} className="space-y-6">
            {/* Step 1: Select Class */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                1. Select Course / Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} (Capacity: {cls.capacity || 30})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Slot */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                2. Select Scheduled Slot
              </label>
              {slotsLoading ? (
                <div className="py-3 text-xs text-slate-400">Loading weekly slots...</div>
              ) : slots.length === 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>No schedule slots found for this course. Please configure a slot first.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(String(slot.id))}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        String(selectedSlotId) === String(slot.id)
                          ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-900'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs uppercase tracking-wider text-indigo-700">
                        {slot.day}
                      </div>
                      <div className="text-sm font-semibold mt-0.5">
                        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                3. Attendance Date
              </label>
              <input
                type="date"
                required
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={!selectedClassId || !selectedSlotId}
              className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Video className="w-5 h-5" />
              <span>Launch Live Camera Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Sidebar Summary & Verification Checklist */}
        <div className="space-y-5">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Session Configuration
            </h3>

            <div className="space-y-3 text-xs divide-y divide-slate-800">
              <div className="pt-2">
                <span className="text-slate-400">Course</span>
                <p className="font-bold text-white text-sm mt-0.5">
                  {selectedClass?.name || 'Select a course'}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-slate-400">Time Slot</span>
                <p className="font-bold text-white text-sm mt-0.5">
                  {selectedSlot ? `${selectedSlot.day} • ${formatTime(selectedSlot.start_time)} – ${formatTime(selectedSlot.end_time)}` : 'Select a slot'}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-slate-400">Class Date</span>
                <p className="font-bold text-white text-sm mt-0.5">
                  {formatDate(sessionDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs space-y-3 text-slate-600">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verification Rules Active
            </h4>
            <ul className="space-y-2 list-disc list-inside text-slate-500">
              <li>3-frame consecutive consistency check.</li>
              <li>SFace 128D mathematical similarity threshold.</li>
              <li>Prevents duplicate attendance for same student + slot + date.</li>
              <li>Camera feed is processed live and never saved permanently.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartAttendance;
