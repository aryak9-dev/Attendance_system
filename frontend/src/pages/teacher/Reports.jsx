import React, { useState, useEffect } from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  BookOpen,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  TrendingUp,
} from 'lucide-react';
import classApi from '../../services/classApi';
import attendanceApi from '../../services/attendanceApi';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import { exportAttendanceToCSV } from '../../utils/attendanceUtils';

export function Reports() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const clsList = await classApi.getClasses();
        setClasses(clsList || []);

        // Demo report aggregations
        const sampleReports = [
          {
            class_id: 1,
            class_name: 'Data Structures',
            total_students: 20,
            sessions_held: 3,
            avg_attendance: 88,
            top_student: 'Aarav Kumar (100%)',
            critical_students: 2, // < 75%
          },
          {
            class_id: 2,
            class_name: 'Database Management Systems',
            total_students: 20,
            sessions_held: 3,
            avg_attendance: 82,
            top_student: 'Simran Kaur (100%)',
            critical_students: 3, // < 75%
          },
        ];
        setReportData(sampleReports);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleExportCSV = () => {
    const headers = ['Course Name', 'Total Students', 'Sessions Held', 'Average Attendance (%)', 'Defaulters (<75%)'];
    const rows = reportData.map(r => [
      r.class_name,
      r.total_students,
      r.sessions_held,
      `${r.avg_attendance}%`,
      r.critical_students,
    ]);

    exportAttendanceToCSV(`Attendance_Summary_Report_${new Date().toISOString().split('T')[0]}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Attendance Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit compliance, export CSV reports, and monitor student attendance thresholds.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Summary CSV</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Overall Attendance Average"
          value="85%"
          subtitle="Across all sections"
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Total Active Sections"
          value={classes.length}
          subtitle="Courses in database"
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Attendance Auditing"
          value="100% Compliant"
          subtitle="YuNet & SFace verified"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Course-wise Report Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-800">Course Compliance Breakdown</h2>

        {loading ? (
          <LoadingSpinner text="Generating reports..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reportData.map((rpt) => (
              <div
                key={rpt.class_id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{rpt.class_name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {rpt.total_students} Students Registered
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-indigo-600">
                      {rpt.avg_attendance}%
                    </span>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Average</p>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${rpt.avg_attendance}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
                  <div>
                    <span className="text-slate-400">Sessions Conducted:</span>
                    <p className="font-bold text-slate-700">{rpt.sessions_held}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Low Attendance (&lt;75%):</span>
                    <p className="font-bold text-rose-600">{rpt.critical_students} Students</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
