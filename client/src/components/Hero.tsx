import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Bot, BookOpen, Brain, Zap, CheckCircle2, FileUp, HelpCircle, Calendar } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onOpenAI: () => void;
  onOpenUpload: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenAI, onOpenUpload }) => {
  return (
    <div className="space-y-20 pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative">
      {/* Main Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 space-y-6 text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-purple-500/10">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>AI-Powered Learning Assistance Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.12]">
            Your Smarter Way to <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_10px_25px_rgba(168,85,247,0.3)]">
              Learn, Retain & Master
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Upload study materials, generate concise summaries, create active recall flashcards, practice quizzes, and receive personalized study plans generated dynamically.
          </p>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>AI Document Summaries</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Active Recall Flashcards</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Interactive MCQ Quizzes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Tailored Study Schedules</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              onClick={onOpenAI}
              className="w-full sm:w-auto liquid-btn-primary px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-600/40 hover:opacity-90 transition-all"
            >
              <Bot className="w-4 h-4" /> Ask AI Study Assistant <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenUpload}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl liquid-glass-card text-slate-200 font-semibold text-sm hover:text-white hover:border-purple-500/40 flex items-center justify-center gap-2 transition-all"
            >
              <FileUp className="w-4 h-4 text-purple-400" /> Upload Study Material
            </button>
          </div>
        </motion.div>

        {/* Right Floating Liquid Glass Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            duration: 0.8,
          }}
          className="lg:col-span-5 relative flex justify-center"
        >
          {/* Subtle Ambient Backglow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-pink-600/30 to-cyan-500/20 rounded-3xl blur-3xl transform scale-95 pointer-events-none" />

          {/* Liquid Glass Badge */}
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
                Ready
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Active Subject</span>
                <p className="font-semibold text-white">Computer Networks: OSI Layer Protocol Suite</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/50 to-slate-900/70 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                  <Zap className="w-3.5 h-3.5 text-cyan-300" /> AI Summary & Recall
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  • <strong>Layer 4 (Transport)</strong>: Guarantees end-to-end data transfer & reliability via TCP.<br />
                  • <strong>Layer 3 (Network)</strong>: Manages logical addressing and IP routing packets.<br />
                  • <strong>Practice Tip</strong>: Re-test on 5 flashcards to strengthen memory retention.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
              <span>Retention Score: <strong>94%</strong></span>
              <span className="text-purple-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 5 Flashcards Generated
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="space-y-10 pt-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Platform Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for Smarter, Faster Exam Preparation
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Everything you need to transform unorganized notes and textbooks into intelligent learning assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl liquid-glass-card border border-purple-500/20 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">AI Study Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask deep conceptual questions, clarify complex textbook chapters, and receive instant explanations.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass-card border border-pink-500/20 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-pink-300 transition-colors">Document Summarizer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload PDF or text lecture notes to extract clean bullet-point summaries and core concepts.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass-card border border-cyan-500/20 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">Active Recall Quizzes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate self-evaluating multiple-choice questions dynamically from your uploaded materials.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass-card border border-amber-500/20 space-y-3 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">7-Day Study Schedules</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive structured day-by-day revision roadmaps tailored to your available study hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

