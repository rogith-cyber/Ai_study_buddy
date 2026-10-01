import React, { useEffect, useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, Trash2, X, Calendar, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudyMaterial, StudyTask } from '@/types';
import { api } from '@/services/api';

const INITIAL_TASKS: StudyTask[] = [
  {
    id: 't_1',
    title: 'Review OSI Layer 3 (IP Addressing & Subnetting)',
    subject: 'Computer Networks',
    durationMinutes: 45,
    completed: true,
    priority: 'high',
  },
  {
    id: 't_2',
    title: 'Solve 10 Characteristic Polynomials & Eigenvalues',
    subject: 'Linear Algebra',
    durationMinutes: 60,
    completed: false,
    priority: 'high',
  },
  {
    id: 't_3',
    title: 'Read Quantum Mechanics Wave-Particle Duality Chapter',
    subject: 'Physics',
    durationMinutes: 30,
    completed: false,
    priority: 'medium',
  },
  {
    id: 't_4',
    title: 'Practice 5 AI Flashcards on Transport Layer Protocols',
    subject: 'Computer Networks',
    durationMinutes: 20,
    completed: false,
    priority: 'low',
  },
];

export const StudyPlanner: React.FC<{ materials: StudyMaterial[] }> = ({ materials }) => {
  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Networks');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [durationMinutes, setDurationMinutes] = useState(45);

  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?._id || '');
  const [goal, setGoal] = useState('Prepare for upcoming exams');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [days, setDays] = useState(7);
  const [studyPlan, setStudyPlan] = useState('');
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [planError, setPlanError] = useState('');

  useEffect(() => {
    if (materials.length === 0 && selectedMaterialId) {
      setSelectedMaterialId('');
    } else if (materials.length > 0 && !materials.some((material) => material._id === selectedMaterialId)) {
      setSelectedMaterialId(materials[0]._id);
    }
  }, [materials, selectedMaterialId]);

  useEffect(() => {
    if (!selectedMaterialId) {
      setStudyPlan('');
      setPlanError('');
      setIsLoadingPlan(false);
      return;
    }

    let isCurrentRequest = true;
    setStudyPlan('');
    setIsLoadingPlan(true);
    setPlanError('');
    api.getMaterial(selectedMaterialId)
      .then((material) => {
        if (isCurrentRequest) setStudyPlan(material.studyPlan || '');
      })
      .catch((err: unknown) => {
        if (isCurrentRequest) {
          setPlanError(err instanceof Error ? err.message : 'Could not load the saved study plan.');
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoadingPlan(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [selectedMaterialId]);

  const generateStudyPlan = async () => {
    if (!selectedMaterialId) return;
    setIsGeneratingPlan(true);
    setPlanError('');
    try {
      const result = await api.generateStudyPlan(selectedMaterialId, { goal, hoursPerDay, days });
      setStudyPlan(result.studyPlan);
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : 'Could not generate the study plan.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: StudyTask = {
      id: `task_${Date.now()}`,
      title,
      subject,
      durationMinutes,
      completed: false,
      priority,
    };

    setTasks((prev) => [newTask, ...prev]);
    setTitle('');
    setIsModalOpen(false);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto z-10 relative space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl liquid-glass-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" /> Personalized Study Schedule
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {completedCount} of {tasks.length} tasks completed today
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="liquid-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      <section className="p-6 rounded-3xl liquid-glass-panel space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <h3 className="text-sm font-bold text-white">Generate an AI study plan</h3>
        </div>

        {materials.length === 0 ? (
          <p className="text-xs text-slate-400">Upload a study material before generating a plan.</p>
        ) : (
          <>
            <label className="block space-y-1.5 text-xs font-semibold text-slate-300">
              Study material
              <select
                value={selectedMaterialId}
                onChange={(event) => setSelectedMaterialId(event.target.value)}
                disabled={isGeneratingPlan}
                className="w-full liquid-input rounded-xl p-2.5 text-xs text-white"
              >
                {materials.map((material) => (
                  <option key={material._id} value={material._id}>{material.title}</option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5 text-xs font-semibold text-slate-300">
              Study goal
              <input
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                className="w-full liquid-input rounded-xl p-2.5 text-xs text-white"
                placeholder="Prepare for upcoming exams"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1.5 text-xs font-semibold text-slate-300">
                Hours per day
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={hoursPerDay}
                  onChange={(event) => setHoursPerDay(Number(event.target.value))}
                  className="w-full liquid-input rounded-xl p-2.5 text-xs text-white"
                />
              </label>
              <label className="block space-y-1.5 text-xs font-semibold text-slate-300">
                Plan length (days)
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(event) => setDays(Number(event.target.value))}
                  className="w-full liquid-input rounded-xl p-2.5 text-xs text-white"
                />
              </label>
            </div>

            <button
              onClick={generateStudyPlan}
              disabled={!selectedMaterialId || isGeneratingPlan || isLoadingPlan}
              className="liquid-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingPlan ? 'Generating plan...' : 'Generate Study Plan'}
            </button>
          </>
        )}

        {planError && <p role="alert" className="text-xs text-red-300">{planError}</p>}
        {isLoadingPlan && <p className="text-xs text-slate-400">Loading saved plan...</p>}
        {studyPlan && !isLoadingPlan && (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <h4 className="text-xs font-bold text-emerald-200 mb-2">Your generated plan</h4>
            <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-300">{studyPlan}</p>
          </div>
        )}
      </section>

      {/* Task Checklist */}
      <div className="p-6 rounded-3xl liquid-glass-panel space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Priorities</h3>

        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-center justify-between group ${
                task.completed
                  ? 'bg-white/5 border-white/5 opacity-50'
                  : 'liquid-glass-card border-white/10 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-center gap-3">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 group-hover:text-purple-400 flex-shrink-0 transition-colors" />
                )}
                <div>
                  <h4 className={`text-xs sm:text-sm font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {task.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.durationMinutes} mins
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    task.priority === 'high'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : task.priority === 'medium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {task.priority}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl liquid-glass-panel border border-white/15 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">Add Study Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete 5 Practice Problems"
                  required
                  className="w-full liquid-input rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full liquid-input rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full liquid-input rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full liquid-input rounded-xl p-2.5 text-xs bg-slate-900 text-white"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="liquid-btn-primary px-5 py-2 rounded-xl font-bold"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

