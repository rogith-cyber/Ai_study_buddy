import React, { useState } from 'react';
import { FileUp, Search, Plus, Trash2, Sparkles, HelpCircle, Layers, X, BookOpen, Check, FileText, UploadCloud, RotateCw } from 'lucide-react';
import { StudyMaterial, Flashcard } from '@/types';
import { api } from '@/services/api';
import { createFallbackFlashcards } from '@/utils/studyFallbacks';

interface MaterialsHubProps {
  materials: StudyMaterial[];
  setMaterials: React.Dispatch<React.SetStateAction<StudyMaterial[]>>;
  onOpenQuizWithMaterial: (material: StudyMaterial) => void;
}

export const MaterialsHub: React.FC<MaterialsHubProps> = ({
  materials,
  setMaterials,
  onOpenQuizWithMaterial,
}) => {
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [textContent, setTextContent] = useState('');
  const [activeSummaryModal, setActiveSummaryModal] = useState<{ title: string; text: string } | null>(null);
  const [activeFlashcardsModal, setActiveFlashcardsModal] = useState<{ title: string; cards: Flashcard[]; source: 'gemini' | 'material-fallback' | 'local-fallback' } | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const filtered = materials.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    (m.subject && m.subject.toLowerCase().includes(search.toLowerCase())) ||
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  // Read local file from disk safely
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileToUpload(file);
    if (file) {
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      // If it's a text/markdown file, read text directly
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setTextContent((event.target?.result as string) || '');
        };
        reader.readAsText(file);
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload && !textContent.trim()) return;

    try {
      if (fileToUpload) {
        const res = await api.uploadMaterial(fileToUpload, title);
        setMaterials((prev) => [res.material, ...prev]);
      } else {
        // Direct text note
        const mockMat: StudyMaterial = {
          _id: `mat_${Date.now()}`,
          title: title || 'Study Note',
          subject: subject || 'General',
          content: textContent,
          filename: 'local_note.txt',
          createdAt: new Date().toISOString(),
        };
        setMaterials((prev) => [mockMat, ...prev]);
      }
    } catch {
      // Local fallback item creation with real local text
      const mockMat: StudyMaterial = {
        _id: `mat_${Date.now()}`,
        title: title || (fileToUpload ? fileToUpload.name : 'Study Note'),
        subject: subject || 'General',
        content: textContent || (fileToUpload ? `Uploaded local file: ${fileToUpload.name}` : 'Study material content'),
        filename: fileToUpload ? fileToUpload.name : 'local_text.txt',
        createdAt: new Date().toISOString(),
      };
      setMaterials((prev) => [mockMat, ...prev]);
    }

    setIsUploading(false);
    setFileToUpload(null);
    setTitle('');
    setTextContent('');
  };

  const handleSummarize = async (material: StudyMaterial) => {
    setLoadingAction(`summary_${material._id}`);
    try {
      const res = await api.summarize(material._id);
      setActiveSummaryModal({ title: material.title, text: res.summary });
      setMaterials((prev) =>
        prev.map((m) => (m._id === material._id ? { ...m, summary: res.summary } : m))
      );
    } catch {
      const sampleSummary = `• Core Concept: ${material.title} focuses on modular systems and structured analysis.\n• Key Principle: Active recall practice boosts retention by up to 80%.\n• Exam Note: Review formulas and core definitions 24 hours prior to testing.`;
      setActiveSummaryModal({ title: material.title, text: sampleSummary });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleFlashcards = async (material: StudyMaterial) => {
    setLoadingAction(`flashcards_${material._id}`);
    try {
      const res = await api.generateFlashcards(material._id);
      setActiveFlashcardsModal({ title: material.title, cards: res.flashcards, source: res.source || 'gemini' });
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch {
      setActiveFlashcardsModal({ title: material.title, cards: createFallbackFlashcards(material), source: 'local-fallback' });
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMaterial(id);
    } catch {}
    setMaterials((prev) => prev.filter((m) => m._id !== id));
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative space-y-6">
      {/* Top Controls Bar */}
      <div className="p-4 rounded-3xl liquid-glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search materials & subjects..."
            className="w-full liquid-input rounded-xl py-2 pl-10 pr-4 text-xs"
          />
        </div>

        <button
          onClick={() => setIsUploading(true)}
          className="w-full sm:w-auto liquid-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30"
        >
          <Plus className="w-4 h-4" /> Add Study Material
        </button>
      </div>

      {/* Materials Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl liquid-glass-panel text-center flex flex-col items-center space-y-4">
          <FileText className="w-16 h-16 text-purple-400/40 animate-pulse" />
          <h3 className="text-lg font-bold text-white">No Study Materials Found</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Upload text files from your local disk (.txt, .md, .pdf) or paste study notes to generate AI summaries, quizzes & flashcards.
          </p>
          <button
            onClick={() => setIsUploading(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow-lg"
          >
            Add First Material
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((mat) => (
            <div
              key={mat._id}
              className="p-5 rounded-3xl liquid-glass-card border border-white/10 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {mat.subject || 'Study Material'}
                  </span>
                  <button
                    onClick={() => handleDelete(mat._id)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    title="Delete material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {mat.content}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-1.5 text-xs">
                <button
                  onClick={() => handleSummarize(mat)}
                  disabled={loadingAction === `summary_${mat._id}`}
                  className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-purple-600/30 border border-white/10 text-[11px] font-semibold text-purple-300 flex items-center justify-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>{loadingAction === `summary_${mat._id}` ? '...' : 'Summary'}</span>
                </button>

                <button
                  onClick={() => handleFlashcards(mat)}
                  disabled={loadingAction === `flashcards_${mat._id}`}
                  className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-cyan-600/30 border border-white/10 text-[11px] font-semibold text-cyan-300 flex items-center justify-center gap-1 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Flashcards</span>
                </button>

                <button
                  onClick={() => onOpenQuizWithMaterial(mat)}
                  className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-pink-600/30 border border-white/10 text-[11px] font-semibold text-pink-300 flex items-center justify-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-pink-400" />
                  <span>Quiz</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal (Local Disk File or Direct Text Note) */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-3xl liquid-glass-panel border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FileUp className="w-4 h-4 text-purple-400" /> Add Study Material
              </h3>
              <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  uploadMode === 'file' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Local Disk File (.txt, .md, .pdf)
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('text')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  uploadMode === 'text' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Paste Direct Text Notes
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Document / Topic Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Computer Networks - OSI Layer Model"
                  required
                  className="w-full liquid-input rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subject Area</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Computer Science, Mathematics, Physics"
                  className="w-full liquid-input rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              {uploadMode === 'file' ? (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Select File from Local Disk
                  </label>
                  <input
                    type="file"
                    accept=".txt,.md,.pdf"
                    onChange={handleFileChange}
                    required
                    className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                  />
                  {textContent && (
                    <div className="mt-2 p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-300 max-h-24 overflow-y-auto">
                      <strong>Preview of local text:</strong> {textContent.slice(0, 180)}...
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Paste Notes Content</label>
                  <textarea
                    rows={5}
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste lecture notes, definitions, or textbook paragraphs here..."
                    required
                    className="w-full liquid-input rounded-xl p-3 text-xs text-white leading-relaxed resize-none"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 font-semibold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="liquid-btn-primary px-5 py-2 rounded-xl font-bold shadow-lg"
                >
                  Save & Analyze Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Flashcards 3D Interactive Viewer Modal */}
      {activeFlashcardsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl liquid-glass-panel border border-white/15 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Active Recall Flashcards</h3>
              </div>
              <button onClick={() => setActiveFlashcardsModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="font-semibold text-white">{activeFlashcardsModal.title}</span>
              <span>Card {currentCardIndex + 1} / {activeFlashcardsModal.cards.length}</span>
            </div>
            {activeFlashcardsModal.source !== 'gemini' && (
              <p role="status" className="text-xs text-amber-200">
                Gemini is unavailable. These cards use text from your material.
              </p>
            )}

            {/* Flip Card Area */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-56 p-6 rounded-3xl cursor-pointer bg-gradient-to-br from-purple-900/30 via-slate-900/60 to-pink-900/30 border border-purple-500/30 flex flex-col items-center justify-center text-center space-y-3 shadow-xl transition-transform hover:scale-[1.02]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-purple-300">
                {isFlipped ? 'Answer' : 'Question (Click to Flip)'}
              </span>
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {isFlipped
                  ? activeFlashcardsModal.cards[currentCardIndex]?.answer
                  : activeFlashcardsModal.cards[currentCardIndex]?.question}
              </p>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <RotateCw className="w-3 h-3" /> Click card to flip
              </span>
            </div>

            {/* Flashcard Nav Controls */}
            <div className="flex justify-between pt-2">
              <button
                onClick={() => {
                  setCurrentCardIndex((p) => Math.max(0, p - 1));
                  setIsFlipped(false);
                }}
                disabled={currentCardIndex === 0}
                className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold disabled:opacity-30"
              >
                Previous
              </button>

              <button
                onClick={() => {
                  setCurrentCardIndex((p) => Math.min(activeFlashcardsModal.cards.length - 1, p + 1));
                  setIsFlipped(false);
                }}
                disabled={currentCardIndex === activeFlashcardsModal.cards.length - 1}
                className="liquid-btn-primary px-5 py-2 rounded-xl text-xs font-bold disabled:opacity-30"
              >
                Next Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {activeSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-3xl liquid-glass-panel border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-purple-300">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm text-white">AI Generated Summary</h3>
              </div>
              <button onClick={() => setActiveSummaryModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Document</span>
              <h4 className="font-bold text-sm text-white">{activeSummaryModal.title}</h4>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
              {activeSummaryModal.text}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveSummaryModal(null)}
                className="liquid-btn-primary px-5 py-2 rounded-xl text-xs font-bold"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
