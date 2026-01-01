
import React, { useState, useEffect } from 'react';
import { Task, AIInsights } from '../types';
import { getDailyInsights } from '../services/geminiService';

interface AIPanelProps {
  tasks: Task[];
  onClose: () => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ tasks, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<AIInsights | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const data = await getDailyInsights(tasks);
      setInsights(data);
      setLoading(false);
    };
    fetchInsights();
  }, [tasks]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Zenith AI Assistant</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 animate-pulse">Gemini is analyzing your day...</p>
            </div>
          ) : insights ? (
            <>
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Productivity Score</h3>
                  <span className="text-2xl font-black text-indigo-600">{insights.productivityScore}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
                    style={{ width: `${insights.productivityScore}%` }}
                  />
                </div>
              </section>

              <section className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Daily Summary
                </h3>
                <p className="text-indigo-800/80 leading-relaxed italic">
                  "{insights.summary}"
                </p>
              </section>

              <section>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Actionable Suggestions
                </h3>
                <ul className="space-y-3">
                  {insights.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {idx + 1}
                      </span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500">Failed to load insights. Try again later.</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
