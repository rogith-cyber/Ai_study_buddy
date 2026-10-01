import React from 'react';
import { BookOpenCheck, Sparkles } from 'lucide-react';

interface StudyBuddyMarkProps {
  className?: string;
}

export const StudyBuddyMark: React.FC<StudyBuddyMarkProps> = ({ className = '' }) => (
  <span
    className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-200/35 bg-gradient-to-br from-emerald-300 via-green-500 to-emerald-950 text-white shadow-[0_0_22px_rgba(16,185,129,0.24)] ${className}`}
  >
    <span className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.3),transparent_45%)]" />
    <BookOpenCheck className="relative z-10 h-[58%] w-[58%]" strokeWidth={2.2} />
    <Sparkles
      className="absolute right-[10%] top-[8%] z-20 h-[28%] w-[28%] text-lime-100 drop-shadow-[0_0_5px_rgba(217,249,157,0.9)]"
      strokeWidth={2.6}
    />
  </span>
);