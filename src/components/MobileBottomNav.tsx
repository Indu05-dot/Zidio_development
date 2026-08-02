'use client';

import React from 'react';
import { Home, BarChart2, Sparkles, PlusCircle, Smartphone } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'home' | 'analytics' | 'insights' | 'mobile_app';
  onSelectTab: (tab: 'home' | 'analytics' | 'insights' | 'mobile_app') => void;
  onOpenNewFeedback: () => void;
  onOpenAIInsights: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewFeedback,
  onOpenAIInsights,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800 py-2 px-3 flex items-center justify-around">
      
      {/* Home Feed */}
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
          activeTab === 'home' ? 'text-brand-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Feed</span>
      </button>

      {/* Analytics */}
      <button
        onClick={() => onSelectTab('analytics')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
          activeTab === 'analytics' ? 'text-brand-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BarChart2 className="w-5 h-5" />
        <span>Metrics</span>
      </button>

      {/* Add Quick Feedback */}
      <button
        onClick={onOpenNewFeedback}
        className="flex flex-col items-center justify-center -mt-5 p-3 rounded-full bg-brand-600 text-white shadow-glow hover:bg-brand-500 transition-all"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      {/* AI Insights */}
      <button
        onClick={onOpenAIInsights}
        className="flex flex-col items-center gap-1 text-[10px] font-semibold text-purple-400 hover:text-purple-300 transition-all"
      >
        <Sparkles className="w-5 h-5" />
        <span>AI Report</span>
      </button>

      {/* Mobile App Simulator */}
      <button
        onClick={() => onSelectTab('mobile_app')}
        className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-all ${
          activeTab === 'mobile_app' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Smartphone className="w-5 h-5" />
        <span>App Mode</span>
      </button>

    </div>
  );
};
