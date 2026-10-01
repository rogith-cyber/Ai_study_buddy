export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface StudyMaterial {
  _id: string;
  title: string;
  subject?: string;
  content: string;
  filename?: string;
  summary?: string;
  flashcards?: Flashcard[];
  quiz?: QuizQuestion[];
  studyPlan?: string;
  createdAt?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  isPinned: boolean;
  isFavorite: boolean;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

