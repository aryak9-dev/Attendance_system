import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import useAuth from '../../hooks/useAuth';
import classApi from '../../services/classApi';
import slotApi from '../../services/slotApi';
import enrollmentApi from '../../services/enrollmentApi';

import ClassCard from '../../components/ClassCard';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

import { parseApiError } from '../../utils/errorHandler';

export function AvailableClasses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [classSlotsMap, setClassSlotsMap] = useState({});
  const [enrolledClassIds, setEnrolledClassIds] = useState(new Set());

  const [searchQuery, setSearchQuery] = useState('');
  const [registeringId, setRegisteringId] = useState(null);

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --------------------------------------------------
  // FETCH CLASSES, SLOTS AND STUDENT ENROLLMENTS
  // --------------------------------------------------

  const fetchClassesAndEnrollments = async () => {
    setLoading(true);
    setError(null);

    try {
      // -----------------------------------------------
      // 1. Fetch all available classes
      // -----------------------------------------------

      const allClasses = await classApi.getClasses();

      const classList = Array.isArray(allClasses)
        ? allClasses
        : [];

      setClasses(classList);

      // -----------------------------------------------
      // 2. Fetch slots for every class
      // -----------------------------------------------

      const slotsMap = {};

      await Promise.all(
        classList.map(async (cls) => {
          try {
            const slots = await slotApi.getClassSlots(cls.id);

            slotsMap[cls.id] = Array.isArray(slots)
              ? slots
              : [];
          } catch (slotError) {
            console.error(
              `Failed to fetch slots for class ${cls.id}:`,
              slotError
            );

            // We don't fail the entire page if one
            // class's slots cannot be loaded.
            slotsMap[cls.id] = [];
          }
        })
      );

      setClassSlotsMap(slotsMap);

      // -----------------------------------------------
      // 3. Fetch current student's enrollments
      // -----------------------------------------------

      if (!user?.id) {
        setEnrolledClassIds(new Set());
        return;
      }

      const myEnrollments =
        await enrollmentApi.getStudentEnrollments(user.id);

      if (Array.isArray(myEnrollments)) {
        const enrolledIds = new Set();

        myEnrollments.forEach((enrollment) => {
          /*
           * Depending on the backend response, the enrollment
           * may contain:
           *
           * {
           *   id: 10,
           *   student_id: 1,
           *   class_id: 2
           * }
           *
           * Therefore we should use class_id.
           */

          if (enrollment?.class_id !== undefined) {
            enrolledIds.add(enrollment.class_id);
          }
        });

        setEnrolledClassIds(enrolledIds);
      } else {
        setEnrolledClassIds(new Set());
      }
    } catch (err) {
      console.error('Failed to load available classes:', err);

      setError(parseApiError(err));
      setEnrolledClassIds(new Set());
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    fetchClassesAndEnrollments();
  }, [user]);

  // --------------------------------------------------
  // HANDLE STUDENT REGISTRATION
  // --------------------------------------------------

  const handleRegister = async (classItem) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setRegisteringId(classItem.id);
    setFeedback(null);

    try {
      /*
       * POST /enrollments
       *
       * {
       *   student_id: user.id,
       *   class_id: classItem.id
       * }
       */

      await enrollmentApi.enrollStudent(
        user.id,
        classItem.id
      );

      setFeedback({
        type: 'success',
        message: `Successfully enrolled in ${classItem.name}!`,
      });

      // -----------------------------------------------
      // Update local enrollment state
      // -----------------------------------------------

      setEnrolledClassIds((prev) => {
        const updated = new Set(prev);
        updated.add(classItem.id);
        return updated;
      });
    } catch (err) {
      console.error('Enrollment failed:', err);

      const msg = parseApiError(err);

      setFeedback({
        type: 'error',
        message: msg,
      });
    } finally {
      setRegisteringId(null);
    }
  };

  // --------------------------------------------------
  // SEARCH / FILTER
  // --------------------------------------------------

  const normalizedSearchQuery =
    searchQuery.trim().toLowerCase();

  const filteredClasses = classes.filter((course) => {
    if (!normalizedSearchQuery) {
      return true;
    }

    return (
      course.name
        ?.toLowerCase()
        .includes(normalizedSearchQuery) ||
      course.description
        ?.toLowerCase()
        .includes(normalizedSearchQuery)
    );
  });

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-6">

      {/* --------------------------------------------- */}
      {/* TITLE */}
      {/* --------------------------------------------- */}

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Available Academic Courses
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Browse university course offerings and register
          your section to enable face-verification
          attendance.
        </p>
      </div>

      {/* --------------------------------------------- */}
      {/* FEEDBACK BANNER */}
      {/* --------------------------------------------- */}

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}

            <span>{feedback.message}</span>
          </div>

          {feedback.type === 'success' && (
            <button
              onClick={() =>
                navigate('/student/my-classes')
              }
              className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-semibold text-xs hover:bg-emerald-700 transition-colors"
            >
              View My Classes
            </button>
          )}
        </div>
      )}

      {/* --------------------------------------------- */}
      {/* SEARCH BAR */}
      {/* --------------------------------------------- */}

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Filter available courses by title or description..."
      />

      {/* --------------------------------------------- */}
      {/* LOADING */}
      {/* --------------------------------------------- */}

      {loading ? (
        <LoadingSpinner
          text="Retrieving available course catalog..."
        />

      ) : error ? (

        /* ------------------------------------------- */
        /* ERROR */
        /* ------------------------------------------- */

        <ErrorState
          message={error}
          onRetry={fetchClassesAndEnrollments}
        />

      ) : filteredClasses.length === 0 ? (

        /* ------------------------------------------- */
        /* EMPTY */
        /* ------------------------------------------- */

        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={
            normalizedSearchQuery
              ? 'No courses match your search.'
              : 'There are currently no courses available.'
          }
        />

      ) : (

        /* ------------------------------------------- */
        /* COURSE LIST */
        /* ------------------------------------------- */

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredClasses.map((cls) => {
            const isEnrolled =
              enrolledClassIds.has(cls.id);

            const isRegistering =
              registeringId === cls.id;

            return (
              <ClassCard
                key={cls.id}
                classItem={cls}
                slots={classSlotsMap[cls.id] || []}

                /*
                 * IMPORTANT:
                 * We no longer invent a number like 20.
                 *
                 * If backend provides enrolled_count,
                 * use it.
                 *
                 * Otherwise show 0 rather than fake data.
                 */
                enrolledCount={
                  cls.enrolled_count ?? 0
                }

                isEnrolled={isEnrolled}
                role="student"
                isRegistering={isRegistering}

                onRegister={() =>
                  handleRegister(cls)
                }

                onViewDetails={() =>
                  navigate(
                    `/student/classes/${cls.id}`
                  )
                }
              />
            );
          })}

        </div>
      )}
    </div>
  );
}

export default AvailableClasses;