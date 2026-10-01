import React, { useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck, Trash2, Users, BookOpen } from 'lucide-react';
import { AdminStats, AdminUser, api } from '@/services/api';

interface AdminPanelProps {
  currentUserId: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUserId }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;
    setIsLoading(true);
    setError('');
    Promise.all([api.getAdminUsers(), api.getAdminStats()])
      .then(([loadedUsers, loadedStats]) => {
        if (!isCurrentRequest) return;
        setUsers(loadedUsers);
        setStats(loadedStats);
      })
      .catch((err: unknown) => {
        if (isCurrentRequest) {
          setError(err instanceof Error ? err.message : 'Could not load admin data.');
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [refreshKey]);

  const handleDeleteUser = async (user: AdminUser) => {
    if (user._id === currentUserId) return;
    const confirmed = window.confirm(`Delete ${user.name} and all of their study materials?`);
    if (!confirmed) return;

    setDeletingUserId(user._id);
    setError('');
    try {
      await api.deleteAdminUser(user._id);
      setRefreshKey((key) => key + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete this user.');
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <ShieldCheck className="h-5 w-5 text-emerald-300" /> Admin Console
          </h2>
          <p className="mt-1 text-xs text-slate-400">User accounts and platform totals</p>
        </div>
        <button
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={isLoading}
          title="Refresh admin data"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-xs text-red-200">{error}</p>}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="liquid-glass-panel flex items-center gap-4 p-5">
          <Users className="h-5 w-5 text-emerald-300" />
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Student accounts</p>
            <p className="text-2xl font-bold text-white">{stats?.totalUsers ?? (isLoading ? '...' : '—')}</p>
          </div>
        </div>
        <div className="liquid-glass-panel flex items-center gap-4 p-5">
          <BookOpen className="h-5 w-5 text-cyan-300" />
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-400">Study materials</p>
            <p className="text-2xl font-bold text-white">{stats?.totalMaterials ?? (isLoading ? '...' : '—')}</p>
          </div>
        </div>
      </section>

      <section className="liquid-glass-panel overflow-hidden">
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-bold text-white">Accounts</h3>
        </div>
        {isLoading ? (
          <p className="p-5 text-xs text-slate-400">Loading accounts...</p>
        ) : users.length === 0 ? (
          <p className="p-5 text-xs text-slate-400">No accounts found.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {users.map((user) => {
              const isCurrentUser = user._id === currentUserId;
              return (
                <div key={user._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {user.name} {isCurrentUser && <span className="text-[10px] text-slate-400">(you)</span>}
                    </p>
                    <p className="truncate text-xs text-slate-400">{user.email}</p>
                    <p className="mt-1 text-[10px] capitalize text-emerald-200">{user.role}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    disabled={isCurrentUser || deletingUserId === user._id}
                    title={isCurrentUser ? 'You cannot delete your own account' : 'Delete user and their materials'}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/20 text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};