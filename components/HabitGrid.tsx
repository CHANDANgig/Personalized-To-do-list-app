
import React, { useState } from 'react';
import { Habit } from '../types';

interface HabitGridProps {
  habits: Habit[];
  daysInMonth: number;
  onToggle: (id: string, day: number) => void;
  onAdd: (name: string, goal: number) => void;
  onDelete: (id: string) => void;
}

const HabitGrid: React.FC<HabitGridProps> = ({ habits, daysInMonth, onToggle, onAdd, onDelete }) => {
  const [newName, setNewName] = useState('');
  const [newGoal, setNewGoal] = useState(20);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAdd(newName, newGoal);
      setNewName('');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
          Protocols
        </h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          {habits.length} Active Habits
        </p>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white z-10 text-left py-3 pr-4 text-[10px] font-black uppercase text-slate-400 min-w-[180px]">Habit Name</th>
              {Array.from({ length: daysInMonth }).map((_, i) => (
                <th key={i} className="px-1 py-3 text-[10px] font-black text-slate-400 w-8 min-w-[32px]">{i + 1}</th>
              ))}
              <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 text-right min-w-[60px]">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {habits.map(habit => (
              <tr key={habit.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 py-3 pr-4 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-800 truncate">{habit.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold">Goal: {habit.goal} days</p>
                  </div>
                  <button 
                    onClick={() => onDelete(habit.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </td>
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isDone = habit.completedDays.includes(day);
                  return (
                    <td key={i} className="p-0.5 text-center">
                      <button 
                        onClick={() => onToggle(habit.id, day)}
                        className={`w-6 h-6 rounded-md transition-all border-2 flex items-center justify-center ${
                          isDone 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                            : 'border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {isDone && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                    </td>
                  );
                })}
                <td className="px-4 text-right">
                  <span className={`text-xs font-black ${habit.completedDays.length >= habit.goal ? 'text-emerald-500' : 'text-slate-700'}`}>
                    {habit.completedDays.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleAdd} className="mt-8 flex flex-col sm:flex-row gap-4 print:hidden">
        <input 
          type="text" 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New Protocol (e.g. Morning Run, Cold Shower)" 
          className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
        />
        <div className="flex items-center gap-2 px-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Goal:</span>
          <input 
            type="number" 
            value={newGoal}
            onChange={(e) => setNewGoal(parseInt(e.target.value))}
            className="w-12 bg-transparent text-sm font-bold focus:outline-none"
          />
        </div>
        <button 
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Add Habit
        </button>
      </form>
    </div>
  );
};

export default HabitGrid;
