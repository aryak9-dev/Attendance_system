import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Users,
  Plus,
  Video,
  ArrowLeft,
  Clock,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import classApi from '../../services/classApi';
import slotApi from '../../services/slotApi';
import enrollmentApi from '../../services/enrollmentApi';
import SlotCard from '../../components/SlotCard';
import StudentCard from '../../components/StudentCard';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import { parseApiError } from '../../utils/errorHandler';

export function TeacherClassDetails() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [slots, setSlots] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Slot Modal
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    start_time: '10:00',
    end_time: '11:00',
  });
  const [slotSubmitting, setSlotSubmitting] = useState(false);
  const [slotError, setSlotError] = useState(null);

  const fetchClassDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Class info
      const cls = await classApi.getClassById(classId);
      setClassData(cls);

      // 2. Slots
      try {
        const slotsData = await slotApi.getClassSlots(classId);
        setSlots(slotsData || []);
      } catch {
        setSlots([]);
      }

      // 3. Students
      try {
        const studentsData = await enrollmentApi.getClassStudents(classId);
        setEnrolledStudents(Array.isArray(studentsData) ? studentsData : []);
      } catch {
        // Fallback default list if enrollment endpoint is not yet connected
        setEnrolledStudents([]);
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setSlotError(null);

    if (newSlot.end_time <= newSlot.start_time) {
      setSlotError('End time must be later than start time.');
      return;
    }

    setSlotSubmitting(true);
    try {
      await slotApi.createSlot(classId, {
        day: newSlot.day,
        start_time: newSlot.start_time,
        end_time: newSlot.end_time,
      });

      setIsSlotModalOpen(false);
      setNewSlot({ day: 'Monday', start_time: '10:00', end_time: '11:00' });
      // Refresh slots
      const slotsData = await slotApi.getClassSlots(classId);
      setSlots(slotsData || []);
    } catch (err) {
      setSlotError(parseApiError(err));
    } finally {
      setSlotSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading course details..." />;
  }

  if (error || !classData) {
    return <ErrorState message={error || 'Class not found.'} onRetry={fetchClassDetails} />;
  }

  const capacity = classData.capacity || 30;
  const count = enrolledStudents.length;

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/teacher/classes')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Classes
        </button>

        <button
          onClick={() => navigate(`/teacher/attendance?classId=${classId}`)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Video className="w-4 h-4" />
          Start Attendance Session
        </button>
      </div>

      {/* Course Overview Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              Course Details
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{classData.name}</h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              {classData.description || 'No description provided.'}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center min-w-[140px]">
            <p className="text-xs font-semibold uppercase text-slate-400">Class Enrollment</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {count} / {capacity}
            </p>
            <span className="text-[11px] text-slate-500">Students Registered</span>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Slots */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Weekly Schedule Slots</h2>
            <p className="text-xs text-slate-500">
              Timings when this course convenes each week for attendance
            </p>
          </div>

          <button
            onClick={() => setIsSlotModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Time Slot
          </button>
        </div>

        {slots.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No scheduled slots"
            description="No weekly time slots configured for this course yet."
            actionLabel="Add First Slot"
            onAction={() => setIsSlotModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <SlotCard key={slot.id} slot={slot} />
            ))}
          </div>
        )}
      </div>

      {/* Enrolled Students Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Enrolled Students ({count})</h2>
            <p className="text-xs text-slate-500">
              Students currently registered in this section
            </p>
          </div>
        </div>

        {enrolledStudents.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students enrolled yet"
            description="Students can self-register from their student portal, or enrollments will appear here once seeded."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {enrolledStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                attendanceRate={student.attendance_rate || 90}
                faceRegistered={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      <Modal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        title="Add Weekly Schedule Slot"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          {slotError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{slotError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Day of Week
            </label>
            <select
              value={newSlot.day}
              onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                value={newSlot.start_time}
                onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                required
                value={newSlot.end_time}
                onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsSlotModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={slotSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-60"
            >
              {slotSubmitting ? 'Saving...' : 'Add Slot'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TeacherClassDetails;
