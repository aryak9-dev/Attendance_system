import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, KeyRound, AlertCircle, ArrowRight, UserCheck, GraduationCap, Users } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { parseApiError } from '../utils/errorHandler';

export function Login() {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [roleHint, setRoleHint] = useState('teacher'); // default tab view
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, quickLogin, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query params (e.g. ?role=student or ?role=teacher)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'student' || roleParam === 'teacher') {
      setRoleHint(roleParam);
      if (roleParam === 'teacher' && !registrationNumber) {
        setRegistrationNumber('FAC001');
      } else if (roleParam === 'student' && !registrationNumber) {
        setRegistrationNumber('STU001');
      }
    } else if (!registrationNumber) {
      setRegistrationNumber('FAC001');
    }
  }, [location.search]);

  // If already logged in, redirect according to role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'teacher') {
        navigate('/teacher/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!registrationNumber.trim()) {
      setFormError('Please enter your registration number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const loggedUser = await login(registrationNumber.trim().toUpperCase(), password);
      if (loggedUser.role === 'teacher') {
        navigate('/teacher/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      setFormError(parseApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (regNo, role) => {
    setRegistrationNumber(regNo);
    setPassword('demo123');
    setRoleHint(role);
    setFormError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">AttendAI</span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to your account</h2>
        <p className="mt-1 text-xs text-slate-500">
          Automated Classroom Attendance Using Face Verification
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg shadow-slate-200/50 rounded-2xl border border-slate-200/80">
          {/* Role selector tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleQuickFill('FAC001', 'teacher')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                roleHint === 'teacher'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Teacher / Faculty
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('STU001', 'student')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                roleHint === 'student'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Student
            </button>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Registration Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder={roleHint === 'teacher' ? 'e.g. FAC001' : 'e.g. STU001'}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 uppercase"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                User identifier matching PostgreSQL database records.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Authenticating with FastAPI...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Pre-seeded Demo Credentials Quick-Select */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Seeded Test Accounts
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('FAC001', 'teacher')}
                className="p-2 text-left rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <div className="font-bold text-slate-800">Amit Sharma</div>
                <div className="text-[11px] font-mono text-indigo-600">FAC001 (Faculty)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('STU001', 'student')}
                className="p-2 text-left rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              >
                <div className="font-bold text-slate-800">Aarav Kumar</div>
                <div className="text-[11px] font-mono text-emerald-600">STU001 (Student)</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Need a new account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
