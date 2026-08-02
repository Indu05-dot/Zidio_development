'use client';

import React from 'react';
import { Workspace } from '@/lib/types';
import { Sparkles, Layers, PlusCircle, Code2, RefreshCw, ShieldCheck, Cpu } from 'lucide-react';

interface NavbarProps {
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  onSelectWorkspace: (ws: Workspace) => void;
  onOpenNewFeedback: () => void;
  onOpenWidgetBuilder: () => void;
  onOpenAIInsights: () => void;
  onReseedData: () => void;
  isReseeding: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  workspaces,
  currentWorkspace,
  onSelectWorkspace,
  onOpenNewFeedback,
  onOpenWidgetBuilder,
  onOpenAIInsights,
  onReseedData,
  isReseeding,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-emerald-400 p-0.5 shadow-glow">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-brand-500 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                LOOP <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">AI Platform</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">Customer-Feedback Intelligence Suite</p>
          </div>
        </div>

        {/* Workspace Switcher & Role */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-sm">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium text-slate-400">Workspace:</span>
            <select
              value={currentWorkspace.id}
              onChange={(e) => {
                const target = workspaces.find(w => w.id === e.target.value);
                if (target) onSelectWorkspace(target);
              }}
              className="bg-transparent text-white font-semibold text-sm outline-none cursor-pointer pr-2"
            >
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id} className="bg-slate-900 text-white">
                  {ws.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role: Admin</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* AI Executive Summary button */}
          <button
            onClick={onOpenAIInsights}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-purple-200 animate-spin-slow" />
            <span>AI Executive Insights</span>
          </button>

          {/* Widget Generator */}
          <button
            onClick={onOpenWidgetBuilder}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
            title="Configure & Embed Web Widget"
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Widget Builder</span>
          </button>

          {/* Submit Feedback */}
          <button
            onClick={onOpenNewFeedback}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all shadow-glow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Feedback</span>
          </button>

          {/* Seed Demo Data button */}
          <button
            onClick={onReseedData}
            disabled={isReseeding}
            className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs transition-all"
            title="Reset Demo Seed Data"
          >
            <RefreshCw className={`w-4 h-4 ${isReseeding ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>

      </div>
    </header>
  );
};
