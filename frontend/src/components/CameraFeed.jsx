import React, { useEffect, useRef } from 'react';
import { Camera, CameraOff, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';

export function CameraFeed({
  videoRef,
  isActive,
  isLoading,
  error,
  onStartCamera,
  onStopCamera,
  isScanning = false,
  detectedCount = 0,
}) {
  return (
    <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex items-center justify-center">
      {/* Live Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transform -scale-x-100 ${
          isActive ? 'block' : 'hidden'
        }`}
      />

      {/* Scanning Target Overlay */}
      {isActive && isScanning && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
          {/* Target Reticle */}
          <div className="w-64 h-64 border-2 border-indigo-400/60 rounded-3xl relative animate-pulse">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-xl" />

            {/* Scanning line animation */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-bounce" />
          </div>

          <div className="mt-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700 text-xs font-medium text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Active Face Verification Stream
          </div>
        </div>
      )}

      {/* Live Badge and Stats on Top of Camera */}
      {isActive && (
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-600/90 text-white text-xs font-bold uppercase tracking-wider rounded-md backdrop-blur-sm shadow-md animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            Live Camera
          </span>
          <span className="px-2.5 py-1 bg-slate-900/80 text-slate-300 text-xs font-medium rounded-md backdrop-blur-sm border border-slate-700">
            Detected: <strong className="text-white">{detectedCount}</strong>
          </span>
        </div>
      )}

      {/* Inactive / Permission / Error Placeholders */}
      {!isActive && !isLoading && !error && (
        <div className="text-center p-6 space-y-3 z-10">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Camera className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-white">Camera Offline</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Click below to grant camera permission and initialize live classroom attendance.
            </p>
          </div>
          {onStartCamera && (
            <button
              onClick={onStartCamera}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors inline-flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Enable Camera
            </button>
          )}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center p-6 space-y-3 z-10">
          <div className="w-10 h-10 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-300">Connecting to classroom camera...</p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="text-center p-6 space-y-3 max-w-md z-10">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-white">Camera Access Error</h4>
          <p className="text-xs text-rose-300/90">{error}</p>
          {onStartCamera && (
            <button
              onClick={onStartCamera}
              className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Camera
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default CameraFeed;
