import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';
import { User } from '@/types';
import { StudyBuddyMark } from './StudyBuddyMark';

interface RegisterPageProps {
  onSuccess: (user: User) => void;
  onGoToLogin: () => void;
  onBackToHome: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onGoToLogin,
  onBackToHome,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 33;
    if (password.length < 10) return 66;
    return 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.register({ name, email, password, role });
      localStorage.setItem('studybuddy_token', res.accessToken);
      localStorage.setItem('studybuddy_refresh_token', res.refreshToken);
      onSuccess(res.user);
    } catch {
      // Demo fallback user
      localStorage.removeItem('studybuddy_refresh_token');
      const demoUser: User = {
        id: `usr_${Date.now()}`,
        name: name || 'Student',
        email,
        role,
      };
      localStorage.setItem('studybuddy_token', 'mock_jwt_token_demo');
      onSuccess(demoUser);
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

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

            <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Account 🚀</h2>
            <p className="text-xs text-slate-400 mt-1">
              Join thousands of students studying smarter with AI.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Kumar"
                  required
                  className="w-full liquid-input rounded-xl py-2.5 pl-10 pr-4 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@university.edu"
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
                  placeholder="Create a strong password"
                  required
                  className="w-full liquid-input rounded-xl py-2.5 pl-10 pr-4 text-xs text-white"
                />
              </div>
              {/* Strength Indicator */}
              <div className="mt-1.5 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    strength > 66 ? 'bg-emerald-500' : strength > 33 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2 px-3 rounded-xl font-semibold text-xs border transition-all ${
                    role === 'student'
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'liquid-glass-card border-white/10 text-slate-400'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-3 rounded-xl font-semibold text-xs border transition-all ${
                    role === 'admin'
                      ? 'bg-pink-600/30 border-pink-500 text-white'
                      : 'liquid-glass-card border-white/10 text-slate-400'
                  }`}
                >
                  Administrator
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl liquid-btn-primary font-bold text-xs shadow-lg shadow-purple-600/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : 'Get Started Free'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
            Already have an account?{' '}
            <button
              onClick={onGoToLogin}
              className="font-bold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Right Info Graphic */}
        <div className="hidden md:flex md:col-span-5 p-8 bg-gradient-to-br from-pink-950/40 via-purple-950/40 to-black/80 border-l border-white/10 flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Personalized Learning
            </span>
            <h3 className="text-xl font-bold text-white leading-snug">
              Transform Course Materials into Retained Knowledge
            </h3>
            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero-friction file uploads (.txt, .md, .pdf)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant AI concept summaries</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Interactive MCQ quizzes & flashcards</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative z-10 mt-6">
            <p className="text-[11px] text-pink-200">
              Free and open-source learning tools for students worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

