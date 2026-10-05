import React from 'react';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export function RecognitionCard({
  recentVerifications = [],
  unknownFacesCount = 0,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Recently Verified Students
        </h4>
        <span className="text-xs font-mono text-slate-500">
          {recentVerifications.length} verified
        </span>
      </div>

      {/* Unknown Faces Warning Badge */}
      {unknownFacesCount > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-300 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Unregistered face detected in camera stream</span>
          </div>
          <span className="font-bold px-2 py-0.5 bg-amber-900/60 rounded text-amber-200">
            {unknownFacesCount}
          </span>
        </div>
      )}

      {/* Live List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {recentVerifications.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center italic">
            No students verified yet. Awaiting camera frames...
          </p>
        ) : (
          recentVerifications.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 transition-all hover:bg-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-200">{item.name}</p>
                  <p className="text-[10px] font-mono text-cyan-400">
                    {item.registration_number}
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px]">
                <span className="font-semibold text-emerald-400">{item.confidence}% match</span>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecognitionCard;
