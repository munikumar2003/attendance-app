import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, WifiOff, Users, CalendarCheck } from 'lucide-react';

interface FreshWelcomeScreenProps {
  onGetStarted: () => void;
}

export const FreshWelcomeScreen: React.FC<FreshWelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div
      id="fresh-welcome-screen"
      className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 selection:bg-emerald-200"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200 flex flex-col items-center">
        {/* App Icon Badge */}
        <div className="w-20 h-20 rounded-3xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200 mb-5 relative">
          <CalendarCheck className="w-10 h-10" />
          
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight mb-2">
          Attendance App
        </h1>
        

        {/* Highlights */}
        <div className="w-full space-y-2.5 mb-7 text-left">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-stone-900 block">100% Offline</span>
              <span className="text-[11px] text-stone-500 block">All records stay strictly on your device</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-stone-900 block">Class Setup</span>
              <span className="text-[11px] text-stone-500 block">Configure your classes and student strength</span>
            </div>
          </div>
        </div>

        {/* The single Get Started OK button */}
        <button
          id="get-started-btn"
          type="button"
          onClick={onGetStarted}
          className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

      </div>
    </div>
  );
};
