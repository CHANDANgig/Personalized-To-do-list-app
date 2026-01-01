
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, Priority, DailyStats } from './types';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import ProgressChart from './components/ProgressChart';
import AIPanel from './components/AIPanel';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('zenith_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAIOpen, setIsAIOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('zenith_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const playSuccessSound = useCallback(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {
      // Browsers often block audio until user interaction
      console.log("Audio playback was prevented by the browser.");
    });
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
      
      // Tasks created on this day
      const dayTasks = tasks.filter(t => {
        const tDate = new Date(t.createdAt);
        return tDate.toDateString() === d.toDateString();
      });

      // Tasks completed on this day (regardless of when they were created)
      const completedCount = tasks.filter(t => {
        if (!t.completedAt) return false;
        const cDate = new Date(t.completedAt);
        return cDate.toDateString() === d.toDateString();
      }).length;

      result.push({
        date: dateStr,
        completed: completedCount,
        total: dayTasks.length
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
      <Header onOpenAI={() => setIsAIOpen(true)} />
      
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
              Add New Task
            </h2>
            <TaskInput onAdd={addTask} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                Task List
              </h2>
              <span className="text-sm font-medium text-slate-500">
                {lifetimeStats.completed} / {lifetimeStats.total} All Time
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
              Achievement History
            </h2>
            <ProgressChart data={statsData} lifetime={lifetimeStats} />
          </section>

          <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-lg text-white">
            <h3 className="text-lg font-bold mb-2">Smart Planner</h3>
            <p className="text-indigo-100 text-sm mb-4">
              Get AI-driven insights and task breakdowns to boost your daily efficiency.
            </p>
            <button 
              onClick={() => setIsAIOpen(true)}
              className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-xl hover:bg-indigo-50 transition-colors shadow-md"
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
