import React from 'react';

export function SkeletonCard({ count = 3, type = 'card' }) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm animate-pulse space-y-3"
        >
          <div className="flex justify-between items-center">
            <div className="h-5 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-200 rounded w-16" />
          </div>
          <div className="h-4 bg-slate-100 rounded w-2/3" />
          <div className="pt-2 flex gap-2">
            <div className="h-8 bg-slate-100 rounded w-24" />
            <div className="h-8 bg-slate-100 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonCard;
