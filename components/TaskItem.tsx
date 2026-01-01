
import React, { useState } from 'react';
import { Task, Priority } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(task.id, editText.trim());
      setIsEditing(false);
    }
  };

  const priorityColors = {
    [Priority.HIGH]: 'bg-rose-500',
    [Priority.MEDIUM]: 'bg-amber-500',
    [Priority.LOW]: 'bg-emerald-500',
  };

  return (
    <div className={`group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all ${task.completed ? 'opacity-60 bg-slate-50 scale-[0.98]' : 'hover:scale-[1.01]'}`}>
      <button 
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
          task.completed 
            ? 'bg-indigo-600 border-indigo-600 text-white scale-110' 
            : 'border-slate-300 hover:border-indigo-400 bg-white'
        }`}
      >
        {task.completed && (
          <svg className="w-4 h-4 animate-in zoom-in duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="w-full bg-slate-50 border-b border-indigo-500 py-1 outline-none text-slate-800"
          />
        ) : (
          <div className="flex flex-col">
            <span className={`text-slate-800 font-medium truncate transition-all duration-500 ${task.completed ? 'line-through text-slate-400 translate-x-1' : ''}`}>
              {task.text}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}></span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{task.priority}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!task.completed && (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
        <button 
          onClick={() => onDelete(task.id)}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Delete task"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
