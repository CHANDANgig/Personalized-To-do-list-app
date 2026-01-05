
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, AreaChart, Area, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { Habit, DailyMetrics } from '../types';

interface ProgressChartProps {
  habits: Habit[];
  metrics: DailyMetrics[];
  daysInMonth: number;
  onWeeklyChartClick?: () => void;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ habits, metrics, daysInMonth, onWeeklyChartClick }) => {
  const totalTasksExpected = habits.length * daysInMonth;
  const totalTasksDone = habits.reduce((acc, h) => acc + h.completedDays.length, 0);
  const compliance = totalTasksExpected > 0 ? Math.round((totalTasksDone / totalTasksExpected) * 100) : 0;

  const pieData = [
    { name: 'Completed', value: totalTasksDone, color: '#4f46e5' },
    { name: 'Remaining', value: Math.max(0, totalTasksExpected - totalTasksDone), color: '#f1f5f9' }
  ];

  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayNum = d.getDate();
      const count = habits.filter(h => h.completedDays.includes(dayNum)).length;
      return { 
        day: d.toLocaleDateString('en-US', { weekday: 'short' }), 
        count: count,
        fullDate: d.toISOString().split('T')[0]
      };
    });
  }, [habits]);

  return (
    <div className="w-full space-y-12">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black flex items-center gap-2">
          <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
          Performance Analytics
        </h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Tracking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Monthly Compliance Circle */}
        <div className="flex flex-col items-center">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Label 
                    value={`${compliance}%`} 
                    position="center" 
                    style={{ fontSize: '28px', fontWeight: '900', fill: '#1e293b' }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 -mt-4 text-center">Monthly Compliance</p>
        </div>

        {/* Weekly Completion Frequency - CLICKABLE */}
        <div className="lg:col-span-1">
          <div 
            className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group"
            onClick={onWeeklyChartClick}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Weekly Frequency</h4>
              <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Detail View
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth={3}/></svg>
              </div>
            </div>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] text-center text-slate-400 font-bold mt-2 italic">Click to view habits for the week</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="bg-slate-900 rounded-2xl p-5 text-white">
            <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Total Protocols Met</p>
            <p className="text-3xl font-black">{totalTasksDone}</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
            <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Achievements Logged</p>
            <p className="text-3xl font-black text-emerald-900">{metrics.filter(m => m.achievement).length}</p>
          </div>
        </div>
      </div>
      
      {/* Mood/Energy Trends */}
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Subjective Trends (14-Day)</h4>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.slice(-14)}>
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }} 
              />
              <Area type="monotone" dataKey="mood" name="Mood" stroke="#10b981" fill="#10b981" fillOpacity={0.05} strokeWidth={3} dot={false} />
              <Area type="monotone" dataKey="energy" name="Energy" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.05} strokeWidth={3} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
