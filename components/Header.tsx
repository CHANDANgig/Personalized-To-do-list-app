
import React, { useState } from 'react';
import { User } from '../types';

interface HeaderProps {
  onOpenAI: () => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isSyncing: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOpenAI, user, onLogin, onLogout, isSyncing }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const currentUrl = window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}&color=4f46e5&bgcolor=ffffff`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Zenith Task Planner',
          text: 'Check out this AI-powered task planner!',
          url: currentUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <>
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
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setShowHelp(true)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              title="Get on Phone"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </button>

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
                <span className="hidden xs:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Setup & Sync Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowHelp(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-slate-100 shrink-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">Install on Phone</h2>
                  <p className="text-slate-500 text-sm mt-1">Move your tasks from desktop to mobile.</p>
                </div>
                <button onClick={() => setShowHelp(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
              {/* QR Code Section */}
              <section className="bg-indigo-600 rounded-3xl p-8 text-white text-center shadow-xl shadow-indigo-200">
                <div className="bg-white p-3 rounded-2xl inline-block shadow-inner mb-4">
                  <img src={qrUrl} alt="Scan QR Code" className="w-40 h-40" />
                </div>
                <h3 className="text-lg font-bold">Scan to Open</h3>
                <p className="text-indigo-100 text-sm mt-2">
                  Open your phone camera and point it at this QR code to instantly launch Zenith.
                </p>
                
                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={handleCopyLink}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/20"
                  >
                    {copySuccess ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        Copy Link
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleNativeShare}
                    className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    Send to Phone
                  </button>
                </div>
              </section>

              {/* Install Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-black">A</div>
                    <h3 className="text-sm font-bold text-slate-800">Android</h3>
                  </div>
                  <ul className="text-xs text-slate-500 space-y-2 leading-relaxed">
                    <li>1. Open link in <strong>Chrome</strong>.</li>
                    <li>2. Tap <strong>Menu (⋮)</strong>.</li>
                    <li>3. Select <strong>"Install App"</strong>.</li>
                  </ul>
                </section>

                <section className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-[10px] font-black">i</div>
                    <h3 className="text-sm font-bold text-slate-800">iPhone</h3>
                  </div>
                  <ul className="text-xs text-slate-500 space-y-2 leading-relaxed">
                    <li>1. Open link in <strong>Safari</strong>.</li>
                    <li>2. Tap <strong>Share</strong> button.</li>
                    <li>3. Select <strong>"Add to Home Screen"</strong>.</li>
                  </ul>
                </section>
              </div>

              <section className="bg-slate-900 rounded-2xl p-5 text-slate-400">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Why Install?</h4>
                <p className="text-xs leading-relaxed">
                  Zenith becomes a real app on your phone. You get <strong>offline support</strong>, a home screen <strong>launcher icon</strong>, and a distraction-free <strong>full-screen experience</strong> without the browser URL bar.
                </p>
              </section>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
              <button 
                onClick={() => setShowHelp(false)}
                className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
