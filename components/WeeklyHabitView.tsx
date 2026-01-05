
import React from 'react';
import { Habit } from '../types';

interface WeeklyHabitViewProps {
  habits: Habit[];
  onClose: () => void;
}

const WeeklyHabitView: React.FC<WeeklyHabitViewProps> = ({ habits, onClose }) => {
  const today = new Date();
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="p-10 bg-indigo-600 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black">Weekly Habit Audit</h2>
            <p className="text-indigo-100 font-medium text-sm mt-1">Detailed protocol compliance for the last 7 days.</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5} /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-10">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[200px_repeat(7,1fr)] gap-4 mb-6">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Name</div>
              {weekDays.map((d, i) => (
                <div key={i} className="text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className={`text-lg font-black ${d.getDate() === today.getDate() ? 'text-indigo-600' : 'text-slate-800'}`}>{d.getDate()}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {habits.map(habit => (
                <div key={habit.id} className="grid grid-cols-[200px_repeat(7,1fr)] gap-4 items-center group">
                  <div className="text-sm font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                    {habit.name}
                  </div>
                  {weekDays.map((d, i) => {
                    const isDone = habit.completedDays.includes(d.getDate());
                    return (
                      <div key={i} className="flex justify-center">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                          isDone 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
                          : 'bg-slate-50 border-2 border-slate-100'
                        }`}>
                          {isDone ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            Audit Finished
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyHabitView;
