import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';

export function StudentLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname.includes('/student/my-classes')) return 'My Enrolled Courses';
    if (pathname.includes('/student/classes/')) return 'Course Details';
    if (pathname.includes('/student/classes')) return 'Available Courses';
    if (pathname.includes('/student/attendance')) return 'My Attendance Record';
    if (pathname.includes('/student/profile')) return 'Student Profile & Verification';
    return 'Student Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar role="student" className="hidden lg:flex" />

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        role="student"
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

export default StudentLayout;
