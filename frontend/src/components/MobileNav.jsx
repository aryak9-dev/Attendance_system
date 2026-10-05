import React from 'react';
import { X } from 'lucide-react';
import Sidebar from './Sidebar';

export function MobileNav({ isOpen, onClose, role = 'teacher' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 z-10 shadow-2xl">
        <div className="absolute top-2 right-2 z-20">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Sidebar role={role} className="w-full h-full border-r-0" />
      </div>
    </div>
  );
}

export default MobileNav;
