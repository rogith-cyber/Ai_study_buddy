import React, { useState } from 'react';
import { X, User as UserIcon, Bell, BookOpen, Check } from 'lucide-react';
import { User } from '@/types';

interface SettingsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
}) => {
  const [name, setName] = useState(user?.name || 'Alex Johnson');
  const [dailyGoal, setDailyGoal] = useState('2');
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onUpdateUser({ ...user, name });
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl liquid-glass-panel border border-white/15 space-y-5 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Student Profile & Preferences</h3>
            <p className="text-xs text-slate-400">{user?.email || 'student@university.edu'}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Student Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full liquid-input rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Daily Study Target (Hours)</label>
            <select
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              className="w-full liquid-input rounded-xl p-2.5 text-xs bg-slate-900 text-white"
            >
              <option value="1">1 Hour / Day</option>
              <option value="2">2 Hours / Day</option>
              <option value="3">3 Hours / Day</option>
              <option value="4">4+ Hours / Day</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-purple-400" />
              <div>
                <p className="font-semibold text-white">Study Task Reminders</p>
                <p className="text-[10px] text-slate-400">Receive alerts when active recall reviews are due</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="liquid-btn-primary px-5 py-2 rounded-xl font-bold flex items-center gap-1.5"
            >
              {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
              <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

