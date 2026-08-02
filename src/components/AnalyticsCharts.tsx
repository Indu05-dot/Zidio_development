'use client';

import React from 'react';
import { AnalyticsSummary } from '@/lib/types';
import { BarChart3, PieChart, TrendingUp, Tag, Globe } from 'lucide-react';

interface AnalyticsChartsProps {
  analytics: AnalyticsSummary | null;
  loading: boolean;
  onSelectTopicFilter?: (topic: string) => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  analytics,
  loading,
  onSelectTopicFilter,
}) => {
  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl animate-pulse h-64"></div>
        <div className="glass-panel p-6 rounded-2xl animate-pulse h-64"></div>
      </div>
    );
  }

  const { topicDistribution, channelBreakdown, sentimentCounts, totalFeedback } = analytics;

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'NEGATIVE':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Chart 1: Topic & Theme Breakdown (2 Cols) */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Topic & Theme Intelligence
            </h2>
          </div>
          <span className="text-xs text-slate-400">Click topic to filter feed</span>
        </div>

        <div className="space-y-3.5">
          {topicDistribution.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No topic data available yet.</p>
          ) : (
            topicDistribution.map((t) => {
              const maxCount = topicDistribution[0]?.count || 1;
              const pct = Math.round((t.count / maxCount) * 100);

              return (
                <div
                  key={t.name}
                  onClick={() => onSelectTopicFilter && onSelectTopicFilter(t.name)}
                  className="group cursor-pointer p-2.5 rounded-xl hover:bg-slate-800/60 transition-all flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 group-hover:text-brand-400 transition-colors">
                      {t.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSentimentBadge(t.sentiment)}`}>
                        {t.sentiment}
                      </span>
                      <span className="font-mono text-slate-400">{t.count} items</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        t.sentiment === 'POSITIVE' ? 'bg-emerald-500' : t.sentiment === 'NEGATIVE' ? 'bg-rose-500' : 'bg-brand-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chart 2: Channel Breakdown (1 Col) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Ingestion Channels
              </h2>
            </div>
            <span className="text-xs text-slate-400">Distribution</span>
          </div>

          <div className="space-y-3">
            {Object.entries(channelBreakdown).map(([ch, count]) => {
              const channelPct = totalFeedback > 0 ? Math.round((count / totalFeedback) * 100) : 0;
              const formattedName = ch.replace('_', ' ');

              return (
                <div key={ch} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
                    <span className="text-xs font-semibold text-slate-300 capitalize">{formattedName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">{count}</span>
                    <span className="text-[10px] text-slate-400">({channelPct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overall Breakdown Summary */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-around text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Positive</span>
            <p className="text-lg font-black text-emerald-400">{sentimentCounts.positive}</p>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Neutral</span>
            <p className="text-lg font-black text-slate-400">{sentimentCounts.neutral}</p>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Negative</span>
            <p className="text-lg font-black text-rose-400">{sentimentCounts.negative}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
