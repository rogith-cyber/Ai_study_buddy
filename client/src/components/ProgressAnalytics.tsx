import React from 'react';
import { Award, Flame, Target, BookOpen, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export const ProgressAnalytics: React.FC = () => {
  const subjects = [
    { name: 'Computer Networks', score: 92, hours: 8.5, color: 'bg-purple-500' },
    { name: 'Linear Algebra', score: 85, hours: 6.0, color: 'bg-pink-500' },
    { name: 'Quantum Mechanics', score: 78, hours: 4.5, color: 'bg-cyan-500' },
    { name: 'AI & Data Science', score: 95, hours: 11.0, color: 'bg-emerald-500' },
  ];

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto z-10 relative space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl liquid-glass-panel flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Mastery</span>
            <h3 className="text-xl font-bold text-white mt-0.5">88%</h3>
          </div>
        </div>

        <div className="p-5 rounded-3xl liquid-glass-panel flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Active Streak</span>
            <h3 className="text-xl font-bold text-white mt-0.5">7 Days 🔥</h3>
          </div>
        </div>

        <div className="p-5 rounded-3xl liquid-glass-panel flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Quiz Accuracy</span>
            <h3 className="text-xl font-bold text-white mt-0.5">91%</h3>
          </div>
        </div>

        <div className="p-5 rounded-3xl liquid-glass-panel flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Study Time</span>
            <h3 className="text-xl font-bold text-white mt-0.5">30.0 hrs</h3>
          </div>
        </div>
      </div>

      {/* Subject Mastery Progress Bars */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass-panel space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" /> Subject Mastery Breakdown
            </h3>
            <p className="text-xs text-slate-400">Calculated based on active recall quiz attempts and completed tasks</p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Top: AI & Data Science (95%)
          </span>
        </div>

        <div className="space-y-4">
          {subjects.map((sub) => (
            <div key={sub.name} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{sub.name}</span>
                <span className="text-slate-400 font-medium">
                  {sub.hours} hrs studied • <strong className="text-purple-300">{sub.score}% Mastery</strong>
                </span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`${sub.color} h-full rounded-full transition-all duration-700`}
                  style={{ width: `${sub.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

