
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  onOpenAI: () => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isSyncing: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOpenAI, user, onLogin, onLogout, isSyncing }) => {
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
            <div className="flex items-center gap-1.5 -mt-1">
              <p className="text-[10px] uppercase tracking-widest text-indigo-600 font-bold">Task Planner</p>
              {user && (
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className={`text-[9px] uppercase font-bold ${isSyncing ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`}>
                    {isSyncing ? 'Syncing...' : 'Synced'}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={onOpenAI}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-100 transition-all border border-indigo-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Ask AI
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                <button onClick={onLogout} className="text-[10px] text-slate-400 hover:text-rose-500 font-bold uppercase tracking-tighter">Sign Out</button>
              </div>
              <img 
                src={user.picture} 
                alt={user.name} 
                className="w-9 h-9 rounded-full border-2 border-indigo-100 shadow-sm"
              />
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Gmail Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
