
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, Priority, DailyStats, User } from './types';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import ProgressChart from './components/ProgressChart';
import AIPanel from './components/AIPanel';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zenith_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load tasks when user changes
  useEffect(() => {
    const storageKey = user ? `zenith_tasks_${user.id}` : 'zenith_tasks_guest';
    const saved = localStorage.getItem(storageKey);
    setTasks(saved ? JSON.parse(saved) : []);
  }, [user]);

  // Save tasks and simulate cloud sync
  useEffect(() => {
    const storageKey = user ? `zenith_tasks_${user.id}` : 'zenith_tasks_guest';
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    
    if (user) {
      setIsSyncing(true);
      const timer = setTimeout(() => setIsSyncing(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [tasks, user]);

  const handleLogin = useCallback(() => {
    // In a real environment, this would call window.google.accounts.id.prompt()
    // For this demonstration, we'll simulate the Google Auth result
    const mockUser: User = {
      id: 'google_123456',
      name: 'Alex Johnson',
      email: 'alex.j@gmail.com',
      picture: 'https://picsum.photos/id/64/100/100'
    };
    setUser(mockUser);
    localStorage.setItem('zenith_user', JSON.stringify(mockUser));
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('zenith_user');
  }, []);

  const playSuccessSound = useCallback(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }, []);

  const addTask = useCallback((text: string, priority: Priority = Priority.MEDIUM) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      category: 'General',
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === id);
      if (taskIndex === -1) return prev;
      
      const isBecomingCompleted = !prev[taskIndex].completed;
      if (isBecomingCompleted) {
        playSuccessSound();
      }

      return prev.map((task, index) => 
        index === taskIndex 
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? Date.now() : undefined } 
          : task
      );
    });
  }, [playSuccessSound]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const editTask = useCallback((id: string, newText: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, text: newText } : task
    ));
  }, []);

  const statsData: DailyStats[] = useMemo(() => {
    const days = 7;
    const result: DailyStats[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayTasksCount = tasks.filter(t => {
        const tDate = new Date(t.createdAt);
        return tDate.toDateString() === d.toDateString();
      }).length;

      const completedCount = tasks.filter(t => {
        if (!t.completedAt) return false;
        const cDate = new Date(t.completedAt);
        return cDate.toDateString() === d.toDateString();
      }).length;

      result.push({
        date: dateStr,
        completed: completedCount,
        total: dayTasksCount
      });
    }
    return result;
  }, [tasks]);

  const lifetimeStats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length
  }), [tasks]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      <Header 
        onOpenAI={() => setIsAIOpen(true)} 
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isSyncing={isSyncing}
      />
      
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
              Plan Your Day
            </h2>
            <TaskInput onAdd={addTask} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                My Focus
              </h2>
              <span className="text-sm font-medium text-slate-500">
                {lifetimeStats.completed} / {lifetimeStats.total} Total Done
              </span>
            </div>
            <TaskList 
              tasks={tasks} 
              onToggle={toggleTask} 
              onDelete={deleteTask} 
              onEdit={editTask}
            />
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
              Analytics
            </h2>
            <ProgressChart data={statsData} lifetime={lifetimeStats} />
          </section>

          <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-lg text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">Gemini Insight</h3>
                <p className="text-indigo-100 text-sm mb-4">
                  Let AI optimize your schedule based on your current workload.
                </p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <button 
              onClick={() => setIsAIOpen(true)}
              className="w-full bg-white text-indigo-600 font-semibold py-2.5 rounded-xl hover:bg-indigo-50 transition-all shadow-md active:scale-95"
            >
              Consult Gemini AI
            </button>
          </section>
        </div>
      </main>

      {isAIOpen && (
        <AIPanel tasks={tasks} onClose={() => setIsAIOpen(false)} />
      )}
    </div>
  );
};

export default App;
