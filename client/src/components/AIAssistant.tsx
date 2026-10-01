import React, { useState } from 'react';
import { Bot, Sparkles, Send, Copy, Check, Paperclip, Mic, ArrowLeft } from 'lucide-react';
import { ChatMessage } from '@/types';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'ai',
    text: 'Hello! I am your AI Study Buddy. How can I assist you with your studies today? You can ask for concise concept explanations, custom quiz questions, flashcards, or personalized study plans!',
    timestamp: 'Just now',
  },
];

const SUGGESTED_PROMPTS = [
  'Explain OSI Layer 3 vs Layer 4 simply',
  'Give me 5 practice quiz questions on Computer Networks',
  'Create a 3-day study schedule for Linear Algebra',
  'Summarize the core concepts of Quantum Mechanics',
];

export const AIAssistant: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = `Here is an educational breakdown for "${text}":\n\n1. **Core Concept**: Break complex topics into foundational modules.\n2. **Active Recall**: Test yourself immediately with flashcards or practice questions.\n3. **Key Takeaway**: Spaced repetition guarantees long-term retention.\n\nWould you like me to generate flashcards or a practice quiz for this topic?`;

      if (text.toLowerCase().includes('quiz')) {
        aiResponseText = `Generated 5 Practice Questions for "${text}":\n\n1. Which layer of the OSI model ensures reliable end-to-end data transfer? (Answer: Layer 4 - Transport)\n2. What is the role of Layer 3? (Answer: Network / IP packet routing)\n3. True/False: TCP is connectionless. (Answer: False, UDP is connectionless)\n\nHead over to the Quiz section to practice interactively with instant scoring!`;
      } else if (text.toLowerCase().includes('schedule') || text.toLowerCase().includes('plan')) {
        aiResponseText = `Personalized Study Schedule Generated:\n\n• **Day 1**: Core Architecture & Protocol Suite (2 hrs)\n• **Day 2**: Subnetting, Routing & Transport Mechanisms (2 hrs)\n• **Day 3**: Practice Quizzes & Active Recall Flashcards (1.5 hrs)`;
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now() + 1}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 max-w-5xl mx-auto z-10 relative">
      <div className="liquid-glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col h-[78vh]">
        {/* Chat Header */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                AI Study Tutor <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              </h3>
              <p className="text-[10px] text-purple-300">Natural Language Academic Explanations</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Connected
          </span>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none shadow-lg shadow-purple-600/20'
                    : 'liquid-glass-card text-slate-200 rounded-tl-none border border-white/10'
                }`}
              >
                {msg.text}
                <div className="mt-2 flex items-center justify-between text-[10px] opacity-70 border-t border-white/5 pt-1.5">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-white flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-pink-600/30 border border-pink-500/40 flex items-center justify-center text-pink-300 flex-shrink-0 mt-1 font-bold text-xs">
                  U
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-purple-300 p-3 rounded-2xl liquid-glass-card w-fit">
              <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
              <span>AI is generating educational response...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts Scroller */}
        <div className="px-4 py-2 border-t border-white/5 bg-black/30 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-full liquid-glass-card text-[11px] text-slate-300 hover:text-white hover:border-purple-500/40 whitespace-nowrap transition-all"
            >
              ✨ {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white/5 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your study materials..."
              className="flex-1 liquid-input rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white"
            />
            <button
              type="submit"
              className="liquid-btn-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 hover:opacity-90"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

