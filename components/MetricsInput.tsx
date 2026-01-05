
import React from 'react';
import { DailyMetrics } from '../types';

interface MetricsInputProps {
  onUpdate: (metric: DailyMetrics) => void;
  currentMetrics: DailyMetrics[];
}

const MetricsInput: React.FC<MetricsInputProps> = ({ onUpdate, currentMetrics }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayData = currentMetrics.find(m => m.date === today) || {
    date: today,
    screenTime: 0,
    mood: 5,
    energy: 5,
    achievement: ''
  };

  const handleChange = (field: keyof DailyMetrics, value: any) => {
    onUpdate({ ...todayData, [field]: value });
  };

  return (
    <div className="space-y-12">
      {/* ORDER 4: QUANTIFIED SELF */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
            Quantified Self
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subjective Logs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mood Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Psychological State (Mood)</label>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black">{todayData.mood}/10</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={todayData.mood}
              onChange={(e) => handleChange('mood', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
              <span>Struggling</span>
              <span>Flow State</span>
            </div>
          </div>

          {/* Energy Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Biological Vigor (Energy)</label>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black">{todayData.energy}/10</span>
            </div>
            <input 
              type="range" min="1" max="10" 
              value={todayData.energy}
              onChange={(e) => handleChange('energy', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500" 
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase">
              <span>Depleted</span>
              <span>High Intensity</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Major Performance Win</label>
          <textarea 
            value={todayData.achievement}
            onChange={(e) => handleChange('achievement', e.target.value)}
            placeholder="What's your biggest protocol win today?"
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 transition-all min-h-[120px] text-sm font-medium shadow-inner"
          />
        </div>
      </section>

      {/* ORDER 5: SCREEN TIME */}
      <section className="pt-12 border-t border-slate-50 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black flex items-center gap-2">
            <span className="w-2 h-6 bg-slate-900 rounded-full"></span>
            Screen Time
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Objective Metric</p>
        </div>
        
        <div className="relative max-w-sm">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Daily Digital Consumption</label>
          <input 
            type="number" 
            value={todayData.screenTime}
            onChange={(e) => handleChange('screenTime', parseInt(e.target.value))}
            className="w-full pl-6 pr-16 py-5 bg-slate-900 text-white rounded-[24px] focus:outline-none focus:ring-4 focus:ring-slate-200 font-black text-2xl transition-all shadow-xl shadow-slate-100"
          />
          <span className="absolute right-6 top-1/2 mt-1 text-slate-500 text-sm font-black uppercase">Mins</span>
        </div>
        
        <p className="text-[10px] text-slate-400 italic">
          "What gets measured, gets managed."
        </p>
      </section>
    </div>
  );
};

export default MetricsInput;
