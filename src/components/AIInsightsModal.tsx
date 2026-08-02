'use client';

import React from 'react';
import { AIInsightReport } from '@/lib/types';
import { X, Sparkles, CheckCircle2, TrendingUp, Cpu, Copy, Check } from 'lucide-react';

interface AIInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AIInsightReport | null;
  loading: boolean;
}

export const AIInsightsModal: React.FC<AIInsightsModalProps> = ({
  isOpen,
  onClose,
  report,
  loading,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyReport = () => {
    if (report) {
      const formatted = `${report.title}\n\nSummary:\n${report.summary}\n\nRecommendations:\n${report.recommendations.map(r => `- ${r}`).join('\n')}`;
      navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl glass-modal border border-indigo-500/30 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI Executive Intelligence Report
              </h2>
              <p className="text-xs text-slate-400">Synthesized trends and recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {loading || !report ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Cpu className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-sm font-semibold text-slate-300">Synthesizing Feedback Signals & Generating AI Recommendations...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Executive Summary Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Executive Narrative</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> {report.overallSentiment}% Health Index
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {report.summary}
              </p>
            </div>

            {/* Recommendations List */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Actionable Product Recommendations</span>
              <div className="space-y-2.5">
                {report.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-indigo-100 leading-relaxed font-medium">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Copy & Close */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Executive Report'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-glow transition-all"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
