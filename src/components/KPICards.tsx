'use client';

import React from 'react';
import { AnalyticsSummary } from '@/lib/types';
import { MessageSquareText, TrendingUp, AlertTriangle, Smile, Frown, Meh } from 'lucide-react';

interface KPICardsProps {
  analytics: AnalyticsSummary | null;
  loading: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({ analytics, loading }) => {
  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-panel p-5 rounded-2xl animate-pulse h-28 flex flex-col justify-between">
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            <div className="h-8 bg-slate-800 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const { totalFeedback, sentimentScoreIndex, npsEstimate, urgentActionCount, sentimentCounts } = analytics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Card 1: Total Volume */}
      <div className="glass-panel glass-panel-hover p-5 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Feedback</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <MessageSquareText className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-black text-white">{totalFeedback}</span>
          <span className="text-xs font-medium text-slate-400">All channels</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium"><Smile className="w-3.5 h-3.5" /> {sentimentCounts.positive}</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-400"><Meh className="w-3.5 h-3.5" /> {sentimentCounts.neutral}</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-rose-400 font-medium"><Frown className="w-3.5 h-3.5" /> {sentimentCounts.negative}</span>
        </div>
      </div>

      {/* Card 2: AI Sentiment Index */}
      <div className="glass-panel glass-panel-hover p-5 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sentiment Index</span>
          <div className={`p-2 rounded-xl border ${sentimentScoreIndex >= 70 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : sentimentScoreIndex >= 45 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-black text-white">{sentimentScoreIndex}%</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sentimentScoreIndex >= 70 ? 'bg-emerald-500/20 text-emerald-300' : sentimentScoreIndex >= 45 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'}`}>
            {sentimentScoreIndex >= 70 ? 'Healthy' : sentimentScoreIndex >= 45 ? 'Moderate' : 'Critical'}
          </span>
        </div>
        {/* Sentiment Meter Bar */}
        <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${sentimentScoreIndex >= 70 ? 'bg-emerald-500' : sentimentScoreIndex >= 45 ? 'bg-amber-500' : 'bg-rose-500'}`}
            style={{ width: `${Math.min(100, Math.max(5, sentimentScoreIndex))}%` }}
          />
        </div>
      </div>

      {/* Card 3: NPS Estimate */}
      <div className="glass-panel glass-panel-hover p-5 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Estimated NPS</span>
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Smile className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-black text-white">
            {npsEstimate > 0 ? `+${npsEstimate}` : npsEstimate}
          </span>
          <span className="text-xs font-medium text-purple-300">
            Promoters: {Math.round((sentimentCounts.positive / totalFeedback) * 100)}%
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">Derived from AI sentiment distribution</p>
      </div>

      {/* Card 4: Action Needed */}
      <div className="glass-panel glass-panel-hover p-5 rounded-2xl relative overflow-hidden border-rose-900/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Action Needed</span>
          <div className={`p-2 rounded-xl border ${urgentActionCount > 0 ? 'bg-rose-500/20 border-rose-500/30 text-rose-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className={`text-3xl font-black ${urgentActionCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {urgentActionCount}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            Unaddressed
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">Urgent negative tickets requiring triage</p>
      </div>

    </div>
  );
};
