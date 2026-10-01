import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Bot,
  FileText,
  HelpCircle,
  Calendar,
  StickyNote,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Clock,
  CheckCircle2,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { StudyMaterial } from '@/types';
import { api } from '@/services/api';
import { AIAssistant } from './AIAssistant';
import { MaterialsHub } from './MaterialsHub';
import { QuizPlayer } from './QuizPlayer';
import { StudyPlanner } from './StudyPlanner';
import { SmartNotes } from './SmartNotes';
import { ProgressAnalytics } from './ProgressAnalytics';
import { SettingsModal } from './SettingsModal';
import { StudyBuddyMark } from './StudyBuddyMark';
import { AdminPanel } from './AdminPanel';
import { GalaxyBackground } from './GalaxyBackground';

const INITIAL_MATERIALS: StudyMaterial[] = [
  {
    _id: 'mat_1',
    title: 'Computer Networks: OSI 7-Layer Model Architecture',
    subject: 'Computer Networks',
    content: 'The Open Systems Interconnection (OSI) model characterizes and standardizes communication functions in seven abstraction layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. Layer 4 (Transport) provides end-to-end communication reliability via TCP/UDP, while Layer 3 (Network) handles logical packet routing via IP.',
    filename: 'osi_network_notes.pdf',
    createdAt: new Date().toISOString(),
    summary: '• Layer 4 (Transport) provides reliable byte-stream delivery with TCP.\n• Layer 3 (Network) manages IP addressing & packet routing.\n• Practice active recall regularly to solidify retention.',
  },
];

export const DashboardLayout: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [materials, setMaterials] = useState<StudyMaterial[]>(INITIAL_MATERIALS);
  const [selectedQuizMaterial, setSelectedQuizMaterial] = useState<StudyMaterial | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    async function loadMaterials() {
      try {
        const data = await api.getMaterials();
        if (data.length > 0) {
          setMaterials(data);
        }
      } catch {}
    }
    loadMaterials();
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
    { id: 'materials', label: 'Study Materials', icon: FileText },
    { id: 'quiz', label: 'Quizzes & Practice', icon: HelpCircle },
    { id: 'study-plan', label: 'Study Plan', icon: Calendar },
    { id: 'notes', label: 'Smart Notes', icon: StickyNote },
    { id: 'progress', label: 'Analytics', icon: BarChart3 },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Console', icon: ShieldCheck }] : []),
  ];

  const handleStartQuiz = (mat: StudyMaterial) => {
    setSelectedQuizMaterial(mat);
    setCurrentTab('quiz');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative z-10 text-slate-100">
      <GalaxyBackground aurora />
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 liquid-glass-panel border-r border-white/10 p-4 justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-3 py-3">
            <StudyBuddyMark className="w-10 h-10 shadow-lg" />
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-white via-emerald-100 to-green-300 bg-clip-text text-transparent">
                AI Study Buddy
              </h1>
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Smarter Academic Learning
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-300/10 border border-emerald-200/25 text-white shadow-[0_0_18px_rgba(16,185,129,0.14)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Settings Section */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Profile & Settings</span>
          </button>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Student'}</p>
                <p className="text-[10px] text-purple-300 capitalize">{user?.role || 'Student'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-red-400 p-1.5 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 liquid-glass-panel border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <StudyBuddyMark className="h-9 w-9 lg:hidden" />
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase text-emerald-200 lg:hidden">AI Study Buddy</p>
              <h2 className="truncate text-lg font-bold capitalize text-white">
              {navItems.find((n) => n.id === currentTab)?.label || 'Dashboard'}
              </h2>
            </div>
          </div>

            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
        </header>

        {/* Mobile Horizontal Tab Navigation */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto p-2 bg-black/40 border-b border-white/10 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-300/10 border border-emerald-200/25 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Main Dashboard Home Tab */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="p-6 rounded-3xl liquid-glass-panel bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-pink-950/40 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">
                    Welcome, {user?.name || 'Student'} 👋
                  </h1>
                  <p className="text-xs text-slate-300 mt-1">
                    Ready to study? You have 2 review tasks and 1 practice quiz scheduled for today.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('ai')}
                  className="liquid-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30"
                >
                  <Bot className="w-4 h-4" /> Ask AI Tutor
                </button>
              </div>

              {/* Overview Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl liquid-glass-panel flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Study Time</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">14.5 hrs</h3>
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
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Quiz Accuracy</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">91%</h3>
                  </div>
                </div>

                <div className="p-5 rounded-3xl liquid-glass-panel flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Materials Uploaded</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{materials.length} Docs</h3>
                  </div>
                </div>
              </div>

              {/* Continue Learning Materials Section */}
              <div className="p-6 rounded-3xl liquid-glass-panel space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Continue Learning</h3>
                    <p className="text-xs text-slate-400">Pick up right where you left off</p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('materials')}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {materials.slice(0, 3).map((mat, idx) => {
                    const progress = idx === 0 ? 80 : idx === 1 ? 55 : 30;
                    return (
                      <div
                        key={mat._id}
                        className="p-4 rounded-2xl liquid-glass-card border border-white/10 flex flex-col justify-between space-y-3 group"
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {mat.subject || 'Course'}
                          </span>
                          <h4 className="font-bold text-sm text-white mt-2 group-hover:text-purple-300 transition-colors line-clamp-1">
                            {mat.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{mat.content}</p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Mastery Progress</span>
                            <span className="font-bold text-white">{progress}%</span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <button
                            onClick={() => handleStartQuiz(mat)}
                            className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-purple-600/30 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-purple-400" /> Start Quiz
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* AI Assistant Tab */}
          {currentTab === 'ai' && (
            <AIAssistant onBack={() => setCurrentTab('dashboard')} />
          )}

          {/* Materials Hub Tab */}
          {currentTab === 'materials' && (
            <MaterialsHub
              materials={materials}
              setMaterials={setMaterials}
              onOpenQuizWithMaterial={handleStartQuiz}
            />
          )}

          {/* Quiz Player Tab */}
          {currentTab === 'quiz' && (
            <QuizPlayer
              activeMaterial={selectedQuizMaterial || materials[0] || null}
              onBack={() => {
                setSelectedQuizMaterial(null);
                setCurrentTab('materials');
              }}
            />
          )}

          {/* Study Planner Tab */}
          {currentTab === 'study-plan' && <StudyPlanner materials={materials} />}

          {/* Smart Notes Tab */}
          {currentTab === 'notes' && <SmartNotes />}

          {/* Progress Analytics Tab */}
          {currentTab === 'progress' && <ProgressAnalytics />}

          {currentTab === 'admin' && user?.role === 'admin' && (
            <AdminPanel currentUserId={user.id} />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        user={user}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateUser={(updated) => updateProfile(updated)}
      />
    </div>
  );
};

