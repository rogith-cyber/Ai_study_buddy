import React, { useState } from 'react';
import { Plus, Search, Pin, Star, Trash2, Edit3, Save, StickyNote } from 'lucide-react';
import { Note } from '@/types';

const INITIAL_NOTES: Note[] = [
  {
    id: 'n_1',
    title: 'OSI Model Layer Architecture & Headers',
    subject: 'Computer Networks',
    content: 'Layer 7: Application (HTTP, DNS)\nLayer 4: Transport (TCP reliable byte-stream, UDP datagrams)\nLayer 3: Network (Logical IP packet routing and ICMP)\nLayer 2: Data Link (MAC addressing & frame framing)\nLayer 1: Physical (Bits across copper/fiber/radio)',
    isPinned: true,
    isFavorite: true,
    updatedAt: 'Today',
  },
  {
    id: 'n_2',
    title: 'Characteristic Equation & Matrix Determinants',
    subject: 'Linear Algebra',
    content: 'det(A - λI) = 0 is used to find eigenvalues λ.\nFor each λ, solve (A - λI)v = 0 to extract non-trivial eigenvectors v.\nSymmetric matrices always produce real eigenvalues and orthogonal eigenvectors.',
    isPinned: false,
    isFavorite: false,
    updatedAt: 'Yesterday',
  },
];

export const SmartNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selectedId, setSelectedId] = useState<string>(notes[0]?.id || '');
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');

  const activeNote = notes.find((n) => n.id === selectedId) || notes[0];

  const handleSaveNew = () => {
    if (!newTitle.trim()) return;
    const note: Note = {
      id: `note_${Date.now()}`,
      title: newTitle,
      subject: newSubject || 'General Note',
      content: newContent,
      isPinned: false,
      isFavorite: false,
      updatedAt: 'Just now',
    };
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
    setNewTitle('');
    setNewSubject('');
    setNewContent('');
    setIsCreating(false);
  };

  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const toggleFav = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[76vh]">
        {/* Left Notes List */}
        <div className="lg:col-span-4 liquid-glass-panel rounded-3xl p-4 flex flex-col space-y-3 h-full overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-purple-400" /> Smart Notes
            </h3>
            <button
              onClick={() => setIsCreating(true)}
              className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full liquid-input rounded-xl py-1.5 pl-9 pr-3 text-xs"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filtered.map((note) => {
              const isSelected = note.id === activeNote?.id && !isCreating;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedId(note.id);
                    setIsCreating(false);
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-purple-600/25 border-purple-500/50 shadow-md'
                      : 'liquid-glass-card border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                      {note.subject}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(note.id);
                        }}
                        className={note.isPinned ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFav(note.id);
                        }}
                        className={note.isFavorite ? 'text-yellow-400' : 'text-slate-600 hover:text-slate-400'}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-xs text-white mt-1.5 line-clamp-1">{note.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{note.content}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Note Editor */}
        <div className="lg:col-span-8 liquid-glass-panel rounded-3xl p-6 flex flex-col justify-between h-full overflow-hidden">
          {isCreating ? (
            <div className="space-y-4 flex-1 flex flex-col">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-400" /> Create Study Note
              </h3>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Note Title..."
                className="w-full liquid-input rounded-xl p-3 text-sm font-bold text-white"
              />
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Subject (e.g. Computer Science)..."
                className="w-full liquid-input rounded-xl p-2.5 text-xs text-slate-200"
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your study notes, formulas, or key definitions here..."
                className="w-full flex-1 liquid-input rounded-2xl p-4 text-xs sm:text-sm text-slate-200 resize-none leading-relaxed"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNew}
                  className="liquid-btn-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Note
                </button>
              </div>
            </div>
          ) : activeNote ? (
            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {activeNote.subject}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1">{activeNote.title}</h2>
                </div>
                <button
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap p-2">
                {activeNote.content}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
              Select a note or create a new one to begin editing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

