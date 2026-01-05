
import React, { useState, useEffect } from 'react';
import { Habit, DailyMetrics, AIInsights } from '../types';
import { getHabitInsights } from '../services/geminiService';

interface AIPanelProps {
  habits: Habit[];
  metrics: DailyMetrics[];
  onClose: () => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ habits, metrics, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<AIInsights | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const data = await getHabitInsights(habits, metrics);
      setInsights(data);
      setLoading(false);
    };
    fetchInsights();
  }, [habits, metrics]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-8 bg-indigo-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black">Life Coach</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <p className="text-indigo-100 text-sm">Powered by Gemini 3 Flash</p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Analyzing Streaks...</p>
            </div>
          ) : insights ? (
            <>
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Compliance Score</h3>
                  <span className="text-3xl font-black text-indigo-600">{insights.productivityScore}%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${insights.productivityScore}%` }} />
                </div>
              </section>

              <section className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px] mb-4">Coach's Summary</h3>
                <p className="text-slate-700 leading-relaxed font-medium italic text-lg">
                  "{insights.summary}"
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Strategic Suggestions</h3>
                {insights.suggestions.map((s, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-black text-xs">{i+1}</span>
                    <p className="text-sm text-slate-600 font-medium">{s}</p>
                  </div>
                ))}
              </section>
            </>
          ) : null}
        </div>

        <div className="p-8 border-t border-slate-100">
          <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all">
            Dismiss Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
