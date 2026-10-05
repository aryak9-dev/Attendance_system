import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Video,
  Square,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  RefreshCw,
  Camera,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import useCamera from '../../hooks/useCamera';
import useAttendanceSession, { SESSION_STATES } from '../../hooks/useAttendanceSession';
import classApi from '../../services/classApi';
import slotApi from '../../services/slotApi';
import enrollmentApi from '../../services/enrollmentApi';
import CameraFeed from '../../components/CameraFeed';
import AttendanceCounter from '../../components/AttendanceCounter';
import VerificationStatus from '../../components/VerificationStatus';
import RecognitionCard from '../../components/RecognitionCard';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/formatDate';
import { formatTime } from '../../utils/formatTime';

export function AttendanceSession() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get parameters passed from StartAttendance
  const sessionConfig = location.state || {};
  const { classId, slotId, date } = sessionConfig;

  const [classData, setClassData] = useState(null);
  const [slotData, setSlotData] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [initLoading, setInitLoading] = useState(true);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);

  // WebRTC Camera Hook
  const {
    videoRef,
    isActive: isCameraActive,
    isLoading: isCameraLoading,
    error: cameraError,
    startCamera,
    stopCamera,
    captureFrameBlob,
  } = useCamera();

  // Attendance Session Hook
  const {
    sessionState,
    detectedCount,
    verifiedCount,
    presentMap,
    recentVerifications,
    unknownFacesCount,
    currentVerification,
    startSession,
    processFrame,
    stopSession,
  } = useAttendanceSession(classData, slotData, enrolledStudents);

  const captureIntervalRef = useRef(null);

  // 1. Load Class, Slot, and Enrolled Students
  useEffect(() => {
    if (!classId || !slotId) {
      // If accessed directly without params, fallback to default class or redirect
      navigate('/teacher/attendance', { replace: true });
      return;
    }

    const loadData = async () => {
      setInitLoading(true);
      try {
        const cls = await classApi.getClassById(classId);
        setClassData(cls);

        const slots = await slotApi.getClassSlots(classId);
        const slot = slots.find((s) => String(s.id) === String(slotId)) || slots[0];
        setSlotData(slot);

        try {
          const students = await enrollmentApi.getClassStudents(classId);
          setEnrolledStudents(Array.isArray(students) ? students : []);
        } catch {
          setEnrolledStudents([]);
        }
      } catch (err) {
        console.warn('Session init error:', err);
      } finally {
        setInitLoading(false);
      }
    };

    loadData();
  }, [classId, slotId, navigate]);

  // 2. Automatically launch camera and start session once data is ready
  useEffect(() => {
    if (!initLoading && classData && !isCameraActive && !cameraError) {
      startCamera()
        .then(() => {
          startSession();
        })
        .catch((err) => {
          console.warn('Camera autostart note:', err);
        });
    }
  }, [initLoading, classData]);

  // 3. Periodic Frame Capture Loop to send to backend YuNet / SFace service
  useEffect(() => {
    if (isCameraActive && sessionState !== SESSION_STATES.STOPPING) {
      // Capture frame every 1200ms
      captureIntervalRef.current = setInterval(async () => {
        try {
          const blob = await captureFrameBlob(0.85);
          if (blob) {
            await processFrame(blob);
          }
        } catch (e) {
          console.warn('Frame capture error:', e);
        }
      }, 1200);
    } else {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    }

    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  }, [isCameraActive, sessionState, captureFrameBlob, processFrame]);

  // Handle Stop Attendance Session
  const handleConfirmStop = () => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
    }
    stopCamera();
    stopSession();
    setIsStopModalOpen(false);

    // Navigate to Attendance Review with captured attendance map and enrolled students
    navigate('/teacher/attendance/review', {
      state: {
        classData,
        slotData,
        date: date || new Date().toISOString().split('T')[0],
        presentMap,
        enrolledStudents,
      },
    });
  };

  if (initLoading) {
    return <LoadingSpinner text="Initializing live attendance room..." />;
  }

  const presentCount = Object.keys(presentMap).length;
  const totalCount = enrolledStudents.length || classData?.capacity || 30;

  return (
    <div className="space-y-6">
      {/* Top Bar with Session Status & Controls */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {classData?.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                Live Session
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {slotData ? `${slotData.day} • ${formatTime(slotData.start_time)} – ${formatTime(slotData.end_time)}` : 'Active Slot'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {formatDate(date)}
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsStopModalOpen(true)}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-rose-600/25 transition-all flex items-center gap-2"
          >
            <Square className="w-4 h-4 fill-current" />
            Stop Attendance
          </button>
        </div>
      </div>

      {/* Main Monitoring Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Camera Feed */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <CameraFeed
            videoRef={videoRef}
            isActive={isCameraActive}
            isLoading={isCameraLoading}
            error={cameraError}
            onStartCamera={startCamera}
            onStopCamera={stopCamera}
            isScanning={true}
            detectedCount={detectedCount}
          />

          {/* Real-time counters below camera */}
          <AttendanceCounter
            detected={detectedCount}
            verified={verifiedCount}
            present={presentCount}
            total={totalCount}
          />
        </div>

        {/* Right Column: AI Multi-frame Verification & Live List */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* Multi-frame verification step breakdown */}
          <VerificationStatus verification={currentVerification} />

          {/* Live recently recognized students */}
          <RecognitionCard
            recentVerifications={recentVerifications}
            unknownFacesCount={unknownFacesCount}
          />
        </div>
      </div>

      {/* Confirmation Modal to Stop Attendance */}
      <Modal
        isOpen={isStopModalOpen}
        onClose={() => setIsStopModalOpen(false)}
        title="Stop Attendance Session?"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Are you ready to conclude face verification?</p>
              <p className="mt-0.5 text-amber-700">
                Stopping the session will release the classroom camera and take you to the
                Attendance Review screen where you can review, adjust, and confirm the final records.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Verified Students:</span>
              <span className="font-bold text-slate-800">{presentCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Enrolled:</span>
              <span className="font-bold text-slate-800">{totalCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Attendance Rate:</span>
              <span className="font-bold text-indigo-600">
                {totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              onClick={() => setIsStopModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Resume Session
            </button>
            <button
              onClick={handleConfirmStop}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              Conclude & Review
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AttendanceSession;
