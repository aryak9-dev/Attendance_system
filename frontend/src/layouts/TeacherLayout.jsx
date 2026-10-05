import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';

export function TeacherLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Generate dynamic page title based on path
  const getPageTitle = (pathname) => {
    if (pathname.includes('/teacher/attendance/review')) return 'Attendance Review & Confirmation';
    if (pathname.includes('/teacher/attendance/')) return 'Live Attendance Session';
    if (pathname.includes('/teacher/attendance')) return 'Start Attendance Session';
    if (pathname.includes('/teacher/classes/')) return 'Class & Enrollment Details';
    if (pathname.includes('/teacher/classes')) return 'My Assigned Classes';
    if (pathname.includes('/teacher/students')) return 'Class Students Directory';
    if (pathname.includes('/teacher/history')) return 'Attendance History Logs';
    if (pathname.includes('/teacher/reports')) return 'Attendance Analytics & Reports';
    if (pathname.includes('/teacher/profile')) return 'Faculty Profile';
    return 'Faculty Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar role="teacher" className="hidden lg:flex" />

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        role="teacher"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onMenuToggle={() => setMobileMenuOpen(true)}
          pageTitle={getPageTitle(location.pathname)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;
