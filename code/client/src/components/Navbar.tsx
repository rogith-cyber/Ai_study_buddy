import React from 'react';
import { Sparkles, User, LogIn, LayoutDashboard, Bot, FileText, HelpCircle, Calendar, StickyNote, BarChart3, Settings } from 'lucide-react';
import { User as UserType } from '@/types';
import { StudyBuddyMark } from './StudyBuddyMark';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: UserType | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  user,
  onOpenAuth,
  onOpenSettings,
  onLogout,
}) => {
  const navLinks = [
    { id: 'landing', label: 'Home', icon: LayoutDashboard },
    { id: 'ai', label: 'AI Assistant', icon: Bot },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'quiz', label: 'Quizzes', icon: HelpCircle },
    { id: 'study-plan', label: 'Study Plan', icon: Calendar },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'progress', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <nav className="liquid-glass-panel rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between border border-white/10 shadow-2xl">
        {/* Brand */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <StudyBuddyMark className="w-10 h-10 shadow-lg group-hover:scale-105 transition-transform" />
          <div>
            <span className="font-extrabold text-lg sm:text-xl bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent">
              AI Study Buddy
            </span>
            <span className="hidden sm:flex text-[10px] text-purple-400 font-semibold items-center gap-1">
              <Sparkles className="w-3 h-3" /> Smart Learning
            </span>
          </div>
        </button>

        {/* Center Nav Items */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5 text-xs font-semibold text-slate-300">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id)}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/50 to-pink-600/50 text-white border border-purple-500/40 shadow-md shadow-purple-600/20'
                    : 'hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Auth Section */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl liquid-glass-card border border-white/10 hover:border-purple-500/40 text-xs font-semibold text-white transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
                <Settings className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={onLogout}
                className="text-xs text-slate-400 hover:text-red-400 font-semibold px-2 py-1 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="liquid-btn-primary px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
              >
                <LogIn className="w-3.5 h-3.5" /> Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Horizontal Nav Scroller */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto mt-2 px-2 py-1.5 rounded-xl liquid-glass-panel border border-white/10 no-scrollbar">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = currentView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setCurrentView(link.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

