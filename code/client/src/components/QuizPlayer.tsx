import React, { useEffect, useState } from 'react';
import { HelpCircle, Award, RotateCcw, CheckCircle, XCircle, ArrowRight, ArrowLeft, ArrowLeftCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, StudyMaterial } from '@/types';
import { api } from '@/services/api';
import { createFallbackQuiz } from '@/utils/studyFallbacks';

interface QuizPlayerProps {
  activeMaterial?: StudyMaterial | null;
  onBack: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ activeMaterial, onBack }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(activeMaterial));
  const [error, setError] = useState('');
  const [quizSource, setQuizSource] = useState<'gemini' | 'material-fallback' | 'local-fallback' | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!activeMaterial) {
      setQuestions([]);
      setIsLoading(false);
      return;
    }

    let isCurrentRequest = true;
    setIsLoading(true);
    setError('');
    setQuestions([]);
    setQuizSource(null);

    api.generateQuiz(activeMaterial._id)
      .then(({ quiz, source }) => {
        if (!isCurrentRequest) return;
        setQuestions(quiz);
        setQuizSource(source || 'gemini');
        setCurrentIndex(0);
        setSelectedAnswers({});
        setIsFinished(false);
      })
      .catch((err: unknown) => {
        if (isCurrentRequest) {
          setQuestions(createFallbackQuiz(activeMaterial));
          setQuizSource('local-fallback');
          setCurrentIndex(0);
          setSelectedAnswers({});
          setIsFinished(false);
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [activeMaterial?._id, retryCount]);

  const handleSelect = (opt: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: opt }));
  };

  const handleFinish = () => {
    setIsFinished(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) correct++;
    });
    return {
      correct,
      total: questions.length,
      percentage: questions.length ? Math.round((correct / questions.length) * 100) : 0,
    };
  };

  const score = calculateScore();

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto z-10 relative">
      <div className="liquid-glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-bold text-base text-white">
                {activeMaterial ? activeMaterial.title : 'Active Recall Practice Quiz'}
              </h2>
              <p className="text-[10px] text-purple-300">Self-Evaluation & Knowledge Assessment</p>
            </div>
          </div>
          {!isFinished && questions.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Question {currentIndex + 1} / {questions.length}
            </span>
          )}
        </div>

        {!activeMaterial ? (
          <div className="py-12 text-center space-y-4">
            <p className="text-sm font-semibold text-white">Upload a study material to generate a quiz.</p>
            <button onClick={onBack} className="liquid-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold">
              Go to Study Materials
            </button>
          </div>
        ) : isLoading ? (
          <div className="py-12 text-center text-sm text-slate-300">Generating quiz from {activeMaterial.title}...</div>
        ) : error ? (
          <div className="py-12 text-center space-y-4">
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={() => setRetryCount((count) => count + 1)}
              className="liquid-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              Try Again
            </button>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-300">No quiz questions were returned for this material.</div>
        ) : !isFinished ? (
          <div className="space-y-6">
            {quizSource && quizSource !== 'gemini' && (
              <p role="status" className="text-xs text-amber-200">
                Gemini is unavailable. These questions use text from your material.
              </p>
            )}
            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {questions[currentIndex].question}
            </h3>

            {/* MCQ Options */}
            <div className="space-y-3">
              {questions[currentIndex].options.map((opt) => {
                const isSelected = selectedAnswers[currentIndex] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all border ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                        : 'liquid-glass-card border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold disabled:opacity-30 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((p) => p + 1)}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-600/30"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="liquid-btn-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-purple-600/40"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/50">
              <Award className="w-10 h-10 text-white" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white">Quiz Complete!</h3>
              <p className="text-xs text-slate-400 mt-1">Here is your concept retention summary</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl liquid-glass-card border border-purple-500/30">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Accuracy</span>
                <p className="text-xl font-bold text-purple-400 mt-1">{score.percentage}%</p>
              </div>
              <div className="p-4 rounded-2xl liquid-glass-card border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Correct</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">{score.correct}</p>
              </div>
              <div className="p-4 rounded-2xl liquid-glass-card border border-red-500/30">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Incorrect</span>
                <p className="text-xl font-bold text-red-400 mt-1">{score.total - score.correct}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsFinished(false);
                setCurrentIndex(0);
                setSelectedAnswers({});
              }}
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs flex items-center gap-2 mx-auto shadow-lg hover:bg-purple-700"
            >
              <RotateCcw className="w-4 h-4" /> Practice Quiz Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

