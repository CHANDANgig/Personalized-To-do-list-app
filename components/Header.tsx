
import React from 'react';

interface HeaderProps {
  onOpenAI: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAI }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Zenith</h1>
            <p className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold -mt-1">Task Planner</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenAI}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-100 transition-all border border-indigo-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Ask AI
          </button>
          <img 
            src="https://picsum.photos/id/64/100/100" 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-slate-200"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
