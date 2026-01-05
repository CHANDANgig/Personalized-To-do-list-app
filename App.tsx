
import React, { useState, useEffect, useMemo } from 'react';
import { Habit, DailyMetrics, User } from './types';
import Header from './components/Header';
import HabitGrid from './components/HabitGrid';
import MetricsInput from './components/MetricsInput';
import ProgressChart from './components/ProgressChart';
import AIPanel from './components/AIPanel';
import InstallBanner from './components/InstallBanner';
import DailyPieChart from './components/DailyPieChart';
import WeeklyHabitView from './components/WeeklyHabitView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zenith_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [metrics, setMetrics] = useState<DailyMetrics[]>([]);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isWeeklyViewOpen, setIsWeeklyViewOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  const storageKey = user ? `zenith_habits_${user.id}` : 'zenith_habits_guest';
  const metricsKey = user ? `zenith_metrics_${user.id}` : 'zenith_metrics_guest';

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
        || (window.navigator as any).standalone;
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();
  }, []);

  useEffect(() => {
    const savedHabits = localStorage.getItem(storageKey);
    const savedMetrics = localStorage.getItem(metricsKey);
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedMetrics) setMetrics(JSON.parse(savedMetrics));
  }, [storageKey, metricsKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(habits));
    localStorage.setItem(metricsKey, JSON.stringify(metrics));
    if (user) {
      setIsSyncing(true);
      const timer = setTimeout(() => setIsSyncing(false), 800);
      return () => clearTimeout(timer);
    }
  }, [habits, metrics, storageKey, metricsKey, user]);

  const addHabit = (name: string, goal: number = 20) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      goal,
      completedDays: [],
      category: 'General',
      createdAt: Date.now()
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabitDay = (habitId: string, day: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const isSet = h.completedDays.includes(day);
        const newDays = isSet 
          ? h.completedDays.filter(d => d !== day)
          : [...h.completedDays, day];
        return { ...h, completedDays: newDays };
      }
      return h;
    }));
  };

  const updateMetrics = (newMetric: DailyMetrics) => {
    setMetrics(prev => {
      const filtered = prev.filter(m => m.date !== newMetric.date);
      return [...filtered, newMetric];
    });
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const daysInMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  }, [currentDate]);

  const todayProgress = useMemo(() => {
    const todayNum = new Date().getDate();
    const completedToday = habits.filter(h => h.completedDays.includes(todayNum)).length;
    return {
      completed: completedToday,
      total: habits.length
    };
  }, [habits]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 print:bg-white print:pb-0">
      <Header 
        onOpenAI={() => setIsAIOpen(true)} 
        user={user}
        onLogin={() => setUser({ id: 'u1', name: 'Alex', email: 'a@a.com', picture: 'https://picsum.photos/100' })}
        onLogout={() => setUser(null)}
        isSyncing={isSyncing}
        canInstall={!!deferredPrompt && !isStandalone}
        onInstall={() => deferredPrompt?.prompt()}
      />
      
      <main className="max-w-[1400px] mx-auto px-4 py-8 space-y-12">
        
        {/* ORDER 1: TODAY'S PROTOCOL COMPLIANCE */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
              Today's Protocol Compliance
            </h3>
            <DailyPieChart completed={todayProgress.completed} total={todayProgress.total} />
            <div className="mt-4 px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-wider">
              {todayProgress.completed === todayProgress.total && todayProgress.total > 0 ? "Perfect Score!" : "Stay Focused"}
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 shadow-xl text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                Gemini Performance Coach
              </h3>
              <p className="text-indigo-100 text-lg leading-relaxed max-w-xl">
                Ready to optimize. Your protocols, screen time, and energy trends have been cross-referenced. Open the session to see tactical adjustments for the week.
              </p>
            </div>
            <button 
              onClick={() => setIsAIOpen(true)}
              className="mt-8 w-fit bg-white text-indigo-600 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
            >
              Start Coaching Session
            </button>
          </div>
        </section>

        {/* ORDER 2: PROTOCOLS (HABIT GRID) */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{monthName} {year} Protocols</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
              PDF Export
            </button>
          </div>
          <HabitGrid 
            habits={habits} 
            daysInMonth={daysInMonth} 
            onToggle={toggleHabitDay} 
            onAdd={addHabit}
            onDelete={deleteHabit}
          />
        </section>

        {/* ORDER 3: PERFORMANCE ANALYTICS */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <ProgressChart 
            habits={habits} 
            metrics={metrics} 
            daysInMonth={daysInMonth} 
            onWeeklyChartClick={() => setIsWeeklyViewOpen(true)}
          />
        </section>

        {/* ORDER 4 & 5: QUANTIFIED SELF & SCREEN TIME */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
           <MetricsInput onUpdate={updateMetrics} currentMetrics={metrics} />
        </section>

      </main>

      <InstallBanner isVisible={!!deferredPrompt && !isStandalone} onInstall={() => deferredPrompt?.prompt()} />

      {isAIOpen && (
        <AIPanel habits={habits} metrics={metrics} onClose={() => setIsAIOpen(false)} />
      )}

      {isWeeklyViewOpen && (
        <WeeklyHabitView habits={habits} onClose={() => setIsWeeklyViewOpen(false)} />
      )}

      <style>{`
        @media print {
          body { background: white !important; }
          .print-hidden { display: none !important; }
          header { display: none !important; }
          .bg-white { border: 1px solid #e2e8f0 !important; box-shadow: none !important; }
          .max-w-[1400px] { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
          main { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
