import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Brain,
  Zap,
  GraduationCap,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { GalaxyBackground } from './GalaxyBackground';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onBackToLanding: () => void;
}

type Screen = 'choice' | 'login' | 'register';

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onBackToLanding,
}) => {
  // If initialMode is 'register', start at 'choice'; else login
  const [screen, setScreen] = useState<Screen>(
    initialMode === 'register' ? 'choice' : 'login'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { login, loading } = useAuth();

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 33;
    if (password.length < 10) return 66;
    return 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      if (screen === 'login') {
        await login({ email, password });
        // AuthContext auto-sets user → App routes to Dashboard
      } else if (screen === 'register') {
        await api.register({ name, email, password, role: 'student' });
        // ✅ Account created → go to login
        setScreen('login');
        setPassword('');
        setName('');
        setSuccessMsg('🎉 Account created! Please sign in to continue.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your details.');
    }
  };

  const strength = getPasswordStrength();

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 🌌 Galaxy background */}
      <GalaxyBackground />

      <div className="w-full max-w-4xl liquid-glass-panel rounded-3xl border border-white/15 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 relative z-10 backdrop-blur-2xl">

        {/* ─── LEFT PANEL ─── */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between min-h-[520px]">

          {/* Back button */}
          <button
            onClick={screen === 'choice' ? onBackToLanding : () => setScreen('choice')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {screen === 'choice' ? 'Back' : 'Back to options'}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-lg text-white">AI Study Buddy</span>
          </div>

          {/* ── ANIMATED SCREEN CONTENT ── */}
          <AnimatePresence mode="wait">

            {/* ── CHOICE SCREEN ── */}
            {screen === 'choice' && (
              <motion.div
                key="choice"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    Welcome 👋
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    How would you like to continue?
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Get Started → Register */}
                  <motion.button
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setError(''); setScreen('register'); }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-600/20 to-pink-600/15 hover:from-purple-600/35 hover:to-pink-600/25 transition-all group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 flex-shrink-0">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-sm text-white">Get Started Free</div>
                      <div className="text-[11px] text-slate-400">Create a new student account</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </motion.button>

                  {/* Sign In → Login */}
                  <motion.button
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setError(''); setSuccessMsg(''); setScreen('login'); }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-slate-300 flex-shrink-0">
                      <LogIn className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-bold text-sm text-white">Sign In</div>
                      <div className="text-[11px] text-slate-400">Access your existing workspace</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </motion.button>
                </div>

                <p className="text-[11px] text-slate-500 text-center">
                  AI Study Buddy · Powered by Google Gemini
                </p>
              </motion.div>
            )}

            {/* ── LOGIN SCREEN ── */}
            {screen === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="flex-1 space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    Welcome Back 👋
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Sign in to access your personal study dashboard.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
                    {error}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
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
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full liquid-input rounded-xl py-2.5 pl-10 pr-10 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl liquid-btn-primary font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
                  >
                    {loading ? 'Signing in...' : 'Sign In to Workspace'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setError(''); setScreen('register'); }}
                    className="font-bold text-purple-400 hover:text-purple-300"
                  >
                    Create one free
                  </button>
                </p>
              </motion.div>
            )}

            {/* ── REGISTER SCREEN ── */}
            {screen === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="flex-1 space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    Join AI Study Buddy 🚀
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Create your free student profile to start generating AI study materials.
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
                        placeholder="Your full name"
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
                        placeholder="your@email.com"
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
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        required
                        className="w-full liquid-input rounded-xl py-2.5 pl-10 pr-10 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password strength bar */}
                    <div className="mt-1.5 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength > 66 ? 'bg-emerald-500' : strength > 33 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl liquid-btn-primary font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
                  >
                    {loading ? 'Creating account...' : 'Create My Account'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
                  Already have an account?{' '}
                  <button
                    onClick={() => { setError(''); setScreen('login'); }}
                    className="font-bold text-purple-400 hover:text-purple-300"
                  >
                    Sign In
                  </button>
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="hidden md:flex md:col-span-5 p-8 bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-black/80 border-l border-white/10 flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {screen === 'choice' ? 'AI-Powered Platform' : screen === 'login' ? 'Student Workspace' : 'Personalized AI'}
            </span>
            <h3 className="text-xl font-bold text-white leading-snug">
              Smart Study Management
            </h3>
            <div className="space-y-2.5 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Upload lecture notes (.txt, .md, .pdf)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Instant active recall quizzes &amp; flashcards</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Personalized 7-day study schedules</span>
              </div>
            </div>
          </div>

          {/* Floating card */}
          <div className="my-6 relative z-10 flex justify-center items-center">
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative p-6 rounded-3xl liquid-glass-card border border-purple-500/30 bg-gradient-to-br from-purple-900/30 via-slate-900/40 to-pink-900/30 text-center space-y-3 shadow-xl max-w-[240px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/30 to-pink-500/30 border border-purple-400/40 flex items-center justify-center mx-auto text-purple-300 shadow-md">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-cyan-300 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" /> Real-time AI
                </span>
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                  Generate quizzes &amp; summaries in seconds
                </p>
              </div>
            </motion.div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 relative z-10">
            <p className="text-[11px] text-purple-200 italic leading-relaxed">
              "Centralized AI learning platform designed for university students."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
