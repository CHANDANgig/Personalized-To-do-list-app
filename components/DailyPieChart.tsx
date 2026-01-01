
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface DailyPieChartProps {
  completed: number;
  total: number;
}

const DailyPieChart: React.FC<DailyPieChartProps> = ({ completed, total }) => {
  const remaining = total - completed;
  
  // Default data for empty state
  const data = total === 0 
    ? [{ name: 'None', value: 1, color: '#f1f5f9' }]
    : [
        { name: 'Done', value: completed, color: '#10b981' },
        { name: 'Pending', value: remaining, color: '#e2e8f0' }
      ];

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full h-48 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1000}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <Label 
              value={`${percentage}%`} 
              position="center" 
              className="text-2xl font-black fill-slate-800"
              style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'Inter' }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Today's Progress</p>
      </div>
    </div>
  );
};

export default DailyPieChart;
