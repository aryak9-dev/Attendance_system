import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  ShieldCheck,
  CheckCircle2,
  History,
  FileSpreadsheet,
  ArrowRight,
  GraduationCap,
  Users,
  Layers,
  Clock,
} from 'lucide-react';

export function Landing() {
  const features = [
    {
      icon: Users,
      title: 'Multi-Face Detection',
      description: 'Simultaneously detect multiple students across the classroom using real-time OpenCV & YuNet neural models.',
    },
    {
      icon: ShieldCheck,
      title: 'Similarity-Based Verification',
      description: 'Compute SFace 128D mathematical embeddings and compare against registered student vectors without storing photos.',
    },
    {
      icon: Layers,
      title: 'Multi-Frame Confirmation',
      description: 'Require consistent identity verification across 3 consecutive frames with presence validation to eliminate false positives.',
    },
    {
      icon: Clock,
      title: 'Automatic Attendance Marking',
      description: 'Instantly generate attendance records in PostgreSQL with duplicate prevention for enrollment, slot, and date.',
    },
    {
      icon: History,
      title: 'Attendance History & Matrix',
      description: 'View date-by-date attendance timelines or dynamic student-by-date matrix layouts with complete search and filters.',
    },
    {
      icon: FileSpreadsheet,
      title: 'Digital Reports Export',
      description: 'Generate institutional CSV and Excel attendance reports for academic auditing and class compliance.',
    },
  ];

  const comparisons = [
    {
      old: 'Manual Roll Call (Takes 10–15 mins per session)',
      new: 'Automated AI Verification in under 30 seconds',
    },
    {
      old: 'Single-frame / Photo matching (Prone to proxy & spoofing)',
      new: 'Multi-frame verification with temporal consistency',
    },
    {
      old: 'Paper attendance sheets & manual data entry',
      new: 'Secure PostgreSQL digital records with instant export',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight">AttendAI</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                Face Verification
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          University Capstone Project • AI Computer Vision
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Automated Classroom Attendance Using{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600">
            Face Verification
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          AI-powered face verification for faster, proxy-proof, and seamless classroom attendance
          management. Connects directly to FastAPI, YuNet, SFace, and PostgreSQL.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/login?role=teacher"
            className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            Teacher Portal
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login?role=student"
            className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            Student Portal
          </Link>
        </div>

        {/* Live camera architecture hint */}
        <div className="mt-12 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-2 font-medium text-slate-700">
            <Camera className="w-4 h-4 text-indigo-600" />
            Browser WebRTC
          </span>
          <span className="text-slate-300">→</span>
          <span className="font-semibold text-indigo-700">FastAPI</span>
          <span className="text-slate-300">→</span>
          <span className="font-medium text-slate-700">YuNet + SFace</span>
          <span className="text-slate-300">→</span>
          <span className="font-semibold text-emerald-700">PostgreSQL</span>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-12 bg-white border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Key Architectural Features</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Designed around mathematical biometric embeddings and temporal verification rather
              than storing intrusive video files.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison: Manual vs Automated */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Transformation & Reliability</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Why modern institutions transition from roll-call to biometric verification
          </p>
        </div>

        <div className="space-y-3.5">
          {comparisons.map((c, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3 text-xs sm:text-sm text-rose-600 line-through opacity-80">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                {c.old}
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {c.new}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-xs border-t border-slate-800">
        <p className="font-medium text-slate-300">
          Automated Classroom Attendance Using Face Verification
        </p>
        <p className="mt-1 text-slate-500">
          University Capstone Project • React + Vite + Tailwind • FastAPI + OpenCV (YuNet & SFace) • PostgreSQL
        </p>
      </footer>
    </div>
  );
}

export default Landing;
