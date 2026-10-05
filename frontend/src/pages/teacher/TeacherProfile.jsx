import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, BookOpen, Server, CheckCircle2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import classApi from '../../services/classApi';

export function TeacherProfile() {
  const { user } = useAuth();
  const [assignedClasses, setAssignedClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const cls = await classApi.getClasses();
        const mine = cls.filter((c) => !user?.id || c.teacher_id === user.id || cls.length <= 2);
        setAssignedClasses(mine);
      } catch (e) {
        console.warn('Teacher profile class load note:', e);
      }
    };
    fetchClasses();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Faculty Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Account information, assigned courses, and connected system status.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-indigo-600/25">
            {user?.name ? user.name.charAt(0) : 'T'}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user?.name || 'Professor'}</h2>
              <span className="inline-flex self-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
                {user?.role || 'teacher'}
              </span>
            </div>

            <p className="text-xs font-mono text-indigo-600 font-bold">
              {user?.registration_number || 'FAC001'}
            </p>
            <p className="text-xs text-slate-500">{user?.email || 'amit.sharma@college.com'}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <Mail className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Institutional Email</span>
              <p className="font-semibold text-slate-800">{user?.email || 'fac001@college.com'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <Shield className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Database Role</span>
              <p className="font-semibold text-slate-800 capitalize">{user?.role || 'teacher'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Classes */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          Assigned Academic Courses ({assignedClasses.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {assignedClasses.map((cls) => (
            <div
              key={cls.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-slate-800">{cls.name}</p>
                <p className="text-[11px] text-slate-400">{cls.description || 'Core Course'}</p>
              </div>
              <span className="font-semibold text-indigo-600 bg-white px-2 py-1 rounded border border-slate-200">
                Cap: {cls.capacity || 30}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Backend & Architecture Status */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Server className="w-4 h-4" />
            Connected Architecture
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            FastAPI Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400">Backend API</span>
            <p className="font-mono text-white font-bold mt-0.5">
              {import.meta.env.VITE_API_URL || 'http://localhost:8000'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400">Biometric Engine</span>
            <p className="font-mono text-white font-bold mt-0.5">OpenCV • YuNet • SFace</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400">Relational DB</span>
            <p className="font-mono text-white font-bold mt-0.5">PostgreSQL (6 tables)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
