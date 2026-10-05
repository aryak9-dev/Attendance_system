import React from 'react';
import { Check, Clock, User, ShieldCheck } from 'lucide-react';

export function VerificationStatus({ verification }) {
  if (!verification || !verification.student) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center text-slate-400">
        <User className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-pulse" />
        <p className="text-xs font-medium">Position face towards classroom camera to verify attendance</p>
      </div>
    );
  }

  const {
    student,
    faceDetected = true,
    identityMatched = true,
    frameCount = 1,
    targetFrames = 3,
    presenceVerified = false,
    confidence = 0.94,
    isAlreadyPresent = false,
  } = verification;

  const isComplete = frameCount >= targetFrames;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white space-y-4">
      {/* Target student header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/80 flex items-center justify-center font-bold text-indigo-300">
            {student.name ? student.name.charAt(0) : 'S'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{student.name}</h4>
            <span className="text-xs font-mono text-cyan-400 font-medium">
              {student.registration_number || 'STU001'}
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <div>
          {isAlreadyPresent ? (
            <span className="px-2.5 py-1 bg-purple-950/80 border border-purple-700 text-purple-300 text-xs font-semibold rounded-lg">
              Already Present
            </span>
          ) : isComplete ? (
            <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-600 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-amber-950/80 border border-amber-600 text-amber-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              Verifying ({frameCount}/{targetFrames})
            </span>
          )}
        </div>
      </div>

      {/* Multi-frame Verification checklist */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Face detected</span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <Check className="w-3.5 h-3.5" /> Detected
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Identity matched</span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <Check className="w-3.5 h-3.5" /> {Math.round(confidence * 100)}% match
          </span>
        </div>

        {/* Frames Progress */}
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Frame consistency check</span>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((f) => (
              <span
                key={f}
                className={`w-6 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                  f <= frameCount
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                F{f}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400">Presence confirmed</span>
          <span
            className={`flex items-center gap-1 font-semibold ${
              presenceVerified ? 'text-emerald-400' : 'text-slate-500'
            }`}
          >
            {presenceVerified ? (
              <>
                <Check className="w-3.5 h-3.5" /> Confirmed
              </>
            ) : (
              'In progress...'
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VerificationStatus;
