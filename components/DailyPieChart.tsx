
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface DailyPieChartProps {
  completed: number;
  total: number;
}

const DailyPieChart: React.FC<DailyPieChartProps> = ({ completed, total }) => {
  const remaining = Math.max(0, total - completed);
  
  const data = total === 0 
    ? [{ name: 'None', value: 1, color: '#f1f5f9' }]
    : [
        { name: 'Done', value: completed, color: '#10b981' },
        { name: 'Pending', value: remaining, color: '#f8fafc' }
      ];

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full h-56 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1500}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                className="transition-all duration-700 ease-out"
                stroke={entry.name === 'Pending' ? '#e2e8f0' : 'none'}
                strokeWidth={entry.name === 'Pending' ? 1 : 0}
              />
            ))}
            <Label 
              value={`${percentage}%`} 
              position="center" 
              className="text-4xl font-black fill-slate-900"
              style={{ fontSize: '42px', fontWeight: '900', fontFamily: 'Inter' }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 text-center w-full">
        <p className="text-xs uppercase font-black tracking-[0.2em] text-slate-400">
          {completed} of {total} Protocols
        </p>
      </div>
    </div>
  );
};

export default DailyPieChart;
