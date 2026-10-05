import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Video,
  History,
  FileBarChart,
  UserCircle,
  LogOut,
  GraduationCap,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export function Sidebar({ role = 'teacher', className = '' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const teacherNavItems = [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/teacher/classes', label: 'My Classes', icon: BookOpen },
    { to: '/teacher/students', label: 'Students', icon: Users },
    { to: '/teacher/attendance', label: 'Start Attendance', icon: Video, badge: 'AI Live' },
    { to: '/teacher/history', label: 'Attendance History', icon: History },
    { to: '/teacher/reports', label: 'Reports', icon: FileBarChart },
    { to: '/teacher/profile', label: 'Profile', icon: UserCircle },
  ];

  const studentNavItems = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/classes', label: 'Available Classes', icon: BookOpen },
    { to: '/student/my-classes', label: 'My Classes', icon: GraduationCap },
    { to: '/student/attendance', label: 'My Attendance', icon: CheckCircle },
    { to: '/student/profile', label: 'Profile', icon: UserCircle },
  ];

  const items = role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <aside
      className={`w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 select-none ${className}`}
    >
      <div>
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">AttendAI</h2>
            <p className="text-[10px] text-indigo-400 font-medium tracking-wide uppercase">
              Face Verification System
            </p>
          </div>
        </div>

        {/* User Card inside Sidebar */}
        {user && (
          <div className="p-4 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/80 text-white flex items-center justify-center font-bold text-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
              <span className="text-[10px] font-mono text-cyan-400 block truncate">
                {user.registration_number || user.role}
              </span>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <nav className="px-3 py-2 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
