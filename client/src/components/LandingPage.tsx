import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Bot, BookOpen, Brain, Zap, CheckCircle2, FileUp, HelpCircle, Calendar, Layers, ShieldCheck, Star, TrendingUp, Users, Award } from 'lucide-react';
import { GalaxyBackground } from './GalaxyBackground';
import { StudyBuddyMark } from './StudyBuddyMark';

interface LandingPageProps {
  onGoToAuth: (mode?: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToAuth }) => {
  const [demoPrompt, setDemoPrompt] = useState('');
  const [demoAnswer, setDemoAnswer] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Explain OSI Layer 4 vs Layer 3 in simple terms',
    'How do eigenvalues scale eigenvectors?',
    'What is the core rule of the Heisenberg Uncertainty Principle?',
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleTestDemo = (promptText: string) => {
    setDemoPrompt(promptText);
    setIsSynthesizing(true);
    setDemoAnswer(null);

    setTimeout(() => {
      if (promptText.includes('OSI')) {
        setDemoAnswer(
          '• **Layer 4 (Transport)**: Handles end-to-end reliability (TCP flow control & UDP datagrams).\n• **Layer 3 (Network)**: Handles logical packet addressing and IP routing.\n• **Active Recall Tip**: Remember TCP = Reliable/Ordered, UDP = Fast/Connectionless.'
        );
      } else if (promptText.includes('eigenvalues')) {
        setDemoAnswer(
          '• When matrix A acts on eigenvector v, it does not change its direction: Av = λv.\n• The scalar λ is the eigenvalue representing the stretch factor.\n• Solved algebraically via det(A - λI) = 0.'
        );
      } else {
        setDemoAnswer(
          '• Position (x) and momentum (p) cannot both be precisely determined at the atomic scale: Δx · Δp ≥ ℏ/2.\n• Measuring one with extreme precision inherently introduces uncertainty into the other.'
        );
      }
      setIsSynthesizing(false);
    }, 800);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* 🌌 Galaxy Background behind all landing content */}
      <GalaxyBackground aurora />

      <div className="space-y-24 pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative">
      {/* 1. Top Landing Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50">
        <nav className="liquid-glass-panel rounded-2xl px-6 py-3.5 flex items-center justify-between border border-white/15 shadow-2xl">
          <div className="flex items-center gap-3">
            <StudyBuddyMark className="w-10 h-10 shadow-lg shadow-emerald-500/30" />
            <div>
              <span className="font-extrabold text-lg sm:text-xl bg-gradient-to-r from-white via-emerald-100 to-green-300 bg-clip-text text-transparent">
                AI Study Buddy
              </span>
              <span className="hidden sm:block text-[10px] text-emerald-400 font-semibold">
                Smarter Academic Learning
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-emerald-300 transition-colors">Features</a>
            <a href="#ai-demo" className="hover:text-emerald-300 transition-colors">Interactive Demo</a>
            <a href="#stats" className="hover:text-emerald-300 transition-colors">Our Impact</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onGoToAuth('login')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onGoToAuth('register')}
              className="liquid-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 hover:opacity-90 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Get Started Free
            </button>
          </div>
        </nav>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 space-y-6 text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>AI-Powered Student Productivity Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12]">
            Your Smarter Way to <br />
            <span className="bg-gradient-to-r from-emerald-300 via-green-400 to-lime-200 bg-clip-text text-transparent drop-shadow-[0_10px_25px_rgba(34,197,94,0.35)]">
              Learn & Retain Concepts
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Upload text documents or lecture notes, extract instant bullet-point summaries, test yourself with active recall quizzes, and generate customized 7-day revision roadmaps with AI.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Local Disk File Uploads</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Active Recall Quizzes & Flashcards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Personalized Study Roadmaps</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Smart Notes & Progress Analytics</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              onClick={() => onGoToAuth('register')}
              className="w-full sm:w-auto liquid-btn-primary px-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/40 hover:opacity-90 transition-all"
            >
              Start Studying Smarter <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onGoToAuth('login')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl liquid-glass-card text-slate-200 font-semibold text-sm hover:text-white hover:border-emerald-500/40 flex items-center justify-center transition-all"
            >
              Sign In to Your Workspace
            </button>
          </div>
        </motion.div>

        {/* Right Floating Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            duration: 0.8,
          }}
          className="lg:col-span-5 relative flex justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-pink-600/30 to-cyan-500/20 rounded-3xl blur-3xl transform scale-95 pointer-events-none" />

          <div className="relative z-10 w-full max-w-md p-6 rounded-3xl liquid-glass-panel space-y-5 border border-white/15 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600/40 to-pink-600/40 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-md">
                  <Brain className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">AI Study Companion</h4>
                  <p className="text-[10px] text-purple-300">Active Tutor</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Course Topic</span>
                <p className="font-semibold text-white">Computer Networks: OSI 7-Layer Architecture</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/50 to-slate-900/70 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                  <Zap className="w-3.5 h-3.5 text-cyan-300" /> AI Generated Key Insight
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  • <strong>Layer 4 (Transport)</strong>: Guarantees end-to-end reliability via TCP byte streams.<br />
                  • <strong>Layer 3 (Network)</strong>: Manages logical packet routing with IP headers.<br />
                  • <strong>Retention Boost</strong>: Active recall quizzes increase exam recall by 80%.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
              <span>Retention Score: <strong>94%</strong></span>
              <span className="text-purple-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 5 Flashcards Ready
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Interactive Live AI Preview Section */}
      <section id="ai-demo" className="space-y-6 pt-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5 text-purple-400" /> Test Drive AI Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            See How AI Transforms Your Study Notes
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Click any sample question below to test the instant educational synthesis engine.
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-6 rounded-3xl liquid-glass-panel border border-white/15 space-y-4 shadow-2xl">
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleTestDemo(p)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  demoPrompt === p
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                    : 'liquid-glass-card border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                ✨ {p}
              </button>
            ))}
          </div>

          {isSynthesizing && (
            <div className="p-4 rounded-2xl liquid-glass-card flex items-center gap-3 text-xs text-purple-300">
              <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
              <span>AI is synthesizing concise bullet-point explanation...</span>
            </div>
          )}

          {demoAnswer && (
            <div className="p-4 rounded-2xl bg-white/5 border border-purple-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {demoAnswer}
            </div>
          )}

          <div className="pt-2 flex justify-between items-center text-xs text-slate-400 border-t border-white/10">
            <span>Want to upload your own files and generate quizzes?</span>
            <button
              onClick={() => onGoToAuth('register')}
              className="text-purple-400 font-bold hover:text-purple-300 flex items-center gap-1"
            >
              Sign Up to Unlock All Features <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Core Platform Capabilities Grid */}
      <section id="features" className="space-y-10 pt-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for Academic Excellence
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Everything you need to organize lecture notes, generate quizzes, and retain information effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl liquid-glass-card border border-purple-500/20 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">AI Study Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask deep conceptual questions, clarify complex textbook chapters, and receive instant explanations.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass-card border border-pink-500/20 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-pink-300 transition-colors">Document Summarizer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload PDF or text lecture notes from your local disk to extract clean bullet-point summaries and core concepts.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass-card border border-cyan-500/20 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">Active Recall Quizzes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate self-evaluating multiple-choice questions dynamically from your uploaded materials with instant scoring.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass-card border border-amber-500/20 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">7-Day Study Schedules</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive structured day-by-day revision roadmaps tailored to your available study hours.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass-card border border-emerald-500/20 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">3D Flip Flashcards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive flip cards for quick active recall sessions and exam preparation.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass-card border border-indigo-500/20 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">Private & Organized</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organize your study notes, pin favorites, and track your daily learning streak securely.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Animated Stats — Our Impact */}
      <section id="stats" ref={statsRef} className="space-y-10 pt-4">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> Our Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Trusted by Students, Proven by Results
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Real numbers from students using AI Study Buddy every day to achieve academic excellence.
          </p>
        </div>

        <ImpactStats active={statsVisible} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[
            { quote: 'Generated 50 flashcards from my OS lecture notes in 30 seconds. Scored 89% in my semester exam!', name: 'Priya K.', course: 'B.Tech CSE, SRM' },
            { quote: 'The 7-day study planner kept me on track for finals. The AI quiz feature is genuinely addictive.', name: 'Arjun M.', course: 'B.E. ECE, VIT' },
          ].map(({ quote, name, course }) => (
            <div key={name} className="p-5 rounded-2xl liquid-glass-card border border-white/10 space-y-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{quote}"</p>
              <div className="text-[11px] text-slate-400 font-semibold">— {name} · <span className="text-purple-400">{course}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Bottom Call to Action Banner */}
      <section className="p-8 sm:p-12 rounded-3xl liquid-glass-panel border border-white/15 bg-gradient-to-r from-purple-900/40 via-slate-900/60 to-pink-900/40 text-center space-y-6 shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Ready to Ace Your Next Examination?
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto">
          Create your free student account now and experience intelligent AI-powered study assistance.
        </p>
        <button
          onClick={() => onGoToAuth('register')}
          className="liquid-btn-primary px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-purple-600/40 hover:opacity-90 transition-all inline-flex items-center gap-2"
        >
          Create Free Account <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
    <footer className="relative z-10 border-t border-white/10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-center gap-2.5">
          <StudyBuddyMark className="w-8 h-8" />
          <span className="text-sm font-bold text-white">AI Study Buddy</span>
        </div>

        <nav aria-label="Footer navigation" className="flex items-center gap-5 text-xs font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#ai-demo" className="hover:text-white transition-colors">AI Demo</a>
          <a href="#stats" className="hover:text-white transition-colors">Impact</a>
        </nav>

        <p className="text-[11px] text-slate-500">
          © {new Date().getFullYear()} AI Study Buddy
        </p>
      </div>
    </footer>
    </div>
  );
};

/* ─── Standalone stat counter hook (outside component) ─── */
function useCounter(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

const STAT_ITEMS = [
  { icon: Users, color: 'purple', label: 'Active Students', target: 5800, suffix: '+', desc: 'University students enrolled' },
  { icon: Award, color: 'pink', label: 'Quiz Accuracy', target: 94, suffix: '%', desc: 'Average post-session recall score' },
  { icon: TrendingUp, color: 'cyan', label: 'Study Sessions', target: 38000, suffix: '+', desc: 'AI-powered sessions completed' },
];

function StatCard({ icon: Icon, label, target, suffix, desc, active }: typeof STAT_ITEMS[0] & { active: boolean }) {
  const count = useCounter(target, active);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="p-7 rounded-3xl liquid-glass-card border border-white/10 text-center space-y-3 group hover:border-purple-500/40 transition-all"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform text-purple-300">
        <Icon className="w-7 h-7" />
      </div>
      <div className="text-4xl font-extrabold text-white">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="font-bold text-sm text-white">{label}</div>
      <p className="text-xs text-slate-400">{desc}</p>
    </motion.div>
  );
}

function ImpactStats({ active }: { active: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {STAT_ITEMS.map((item) => <StatCard key={item.label} {...item} active={active} />)}
    </div>
  );
}
