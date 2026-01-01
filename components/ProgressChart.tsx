
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyStats } from '../types';

interface ProgressChartProps {
  data: DailyStats[];
  lifetime: {
    total: number;
    completed: number;
  };
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, lifetime }) => {
  const completionRate = lifetime.total > 0 
    ? Math.round((lifetime.completed / lifetime.total) * 100) 
    : 0;

  return (
    <div className="w-full mt-4">
      {/* Lifetime Achievements Row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Lifetime Done</p>
          <p className="text-2xl font-black text-indigo-700">{lifetime.completed}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Success Rate</p>
          <p className="text-2xl font-black text-emerald-700">{completionRate}%</p>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Last 7 Days Activity</p>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis 
              hide 
              domain={[0, 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="completed" 
              stroke="#4f46e5" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCompleted)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Streak</p>
          <p className="text-lg font-bold text-slate-700">
            {data.filter(d => d.completed > 0).length} Days
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Planned</p>
          <p className="text-lg font-bold text-slate-700">
            {lifetime.total}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
