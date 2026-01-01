
import React, { useState } from 'react';
import { Priority } from '../types';

interface TaskInputProps {
  onAdd: (text: string, priority: Priority) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), priority);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full pl-5 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-lg placeholder:text-slate-400"
        />
        <button 
          type="submit"
          disabled={!text.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-500 mr-2">Priority:</span>
        {Object.values(Priority).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              priority === p 
                ? p === Priority.HIGH ? 'bg-rose-100 text-rose-600 border-rose-200' :
                  p === Priority.MEDIUM ? 'bg-amber-100 text-amber-600 border-amber-200' :
                  'bg-emerald-100 text-emerald-600 border-emerald-200'
                : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </form>
  );
};

export default TaskInput;
