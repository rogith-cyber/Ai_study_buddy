import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';
import { User } from '@/types';
import { StudyBuddyMark } from './StudyBuddyMark';

interface LoginPageProps {
  onSuccess: (user: User) => void;
  onGoToRegister: () => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onGoToRegister,
  onBackToHome,
}) => {
  const [email, setEmail] = useState('rahul.engineering@student.edu');
  const [password, setPassword] = useState('Password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      localStorage.setItem('studybuddy_token', res.accessToken);
      localStorage.setItem('studybuddy_refresh_token', res.refreshToken);
      onSuccess(res.user);
    } catch {
      // Offline / Demo fallback user
      localStorage.removeItem('studybuddy_refresh_token');
      const demoUser: User = {
        id: 'usr_demo_1',
        name: email.split('@')[0] || 'Rahul',
        email,
        role: 'student',
      };
      localStorage.setItem('studybuddy_token', 'mock_jwt_token_demo');
      onSuccess(demoUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-4xl mx-auto z-10 relative">
      <div className="liquid-glass-panel rounded-3xl border border-white/15 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">
        {/* Left Form Section */}
        <div className="md:col-span-7 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
          <div>
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </button>

            <div className="flex items-center gap-3 mb-4">
              <StudyBuddyMark className="w-10 h-10 shadow-lg" />
              <span className="font-extrabold text-lg text-white">AI Study Buddy</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back 👋</h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to access your personal study materials, notes, and AI assistant.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Student Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  required
                  className="w-full liquid-input rounded-xl py-2.5 pl-10 pr-4 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full liquid-input rounded-xl py-2.5 pl-10 pr-4 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-purple-600 rounded" />
                <span>Remember me</span>
              </label>
              <a href="#" className="hover:text-purple-300 transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl liquid-btn-primary font-bold text-xs shadow-lg shadow-purple-600/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
            Don't have an account?{' '}
            <button
              onClick={onGoToRegister}
              className="font-bold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Create Student Account
            </button>
          </p>
        </div>

        {/* Right Animated Information Graphic */}
        <div className="hidden md:flex md:col-span-5 p-8 bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-black/80 border-l border-white/10 flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Student Platform
            </span>
            <h3 className="text-xl font-bold text-white leading-snug">
              Unlock AI-Powered Study Tools
            </h3>
            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Upload lecture notes & textbooks</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Generate active recall quizzes</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Track 7-day revision schedules</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative z-10 mt-6">
            <p className="text-[11px] text-purple-200 italic">
              "AI Study Buddy helped me summarize 12 chapters and test myself with quizzes before exams!"
            </p>
            <span className="block text-[10px] text-slate-400 mt-2">— Rahul, Engineering Student</span>
          </div>
        </div>
      </div>
    </div>
  );
};

