
import React, { useState, useEffect } from 'react';

interface InstallBannerProps {
  onInstall: () => void;
  isVisible: boolean;
}

const InstallBanner: React.FC<InstallBannerProps> = ({ onInstall, isVisible }) => {
  const [dismissed, setDismissed] = useState(false);

  // Don't show if dismissed in this session
  useEffect(() => {
    const isDismissed = sessionStorage.getItem('zenith_install_dismissed');
    if (isDismissed) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('zenith_install_dismissed', 'true');
  };

  if (!isVisible || dismissed) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-[60] md:hidden animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-2xl border border-slate-700/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold">Zenith on Mobile</p>
            <p className="text-[10px] text-slate-400 font-medium">Install for offline & full-screen</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onInstall}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all shadow-lg active:scale-95 animate-pulse"
          >
            Install
          </button>
          <button 
            onClick={handleDismiss}
            className="p-2 text-slate-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
