'use client';

import React, { useState } from 'react';
import { FeedbackItem, Status } from '@/lib/types';
import { X, Sparkles, Copy, Check, MessageSquare, Tag, AlertCircle, Shield, CornerDownRight } from 'lucide-react';

interface FeedbackDetailDrawerProps {
  item: FeedbackItem | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Status, notes?: string) => void;
}

export const FeedbackDetailDrawer: React.FC<FeedbackDetailDrawerProps> = ({
  item,
  onClose,
  onUpdateStatus,
}) => {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>(item?.status || 'NEW');
  const [notes, setNotes] = useState(item?.internalNotes || '');

  if (!item) return null;

  const handleCopyDraft = () => {
    if (item.aiResponseDraft) {
      navigator.clipboard.writeText(item.aiResponseDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    onUpdateStatus(item.id, status, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-xl h-full glass-modal border-l border-slate-800 p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
        
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Intelligence Inspector</h3>
                <p className="text-xs text-slate-400">ID: {item.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback Content Card */}
          <div className="mt-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">{item.authorName || 'Anonymous'}</span>
              <span>{new Date(item.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-slate-100 font-normal leading-relaxed">
              "{item.content}"
            </p>
          </div>

          {/* AI Sentiment Score Meter */}
          <div className="mt-5 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider">AI Sentiment Classification</span>
              <span className={`font-extrabold px-2.5 py-0.5 rounded-full text-xs ${
                item.sentiment === 'POSITIVE' ? 'bg-emerald-500/20 text-emerald-400' : item.sentiment === 'NEGATIVE' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-300'
              }`}>
                {item.sentiment} ({Math.round(item.sentimentScore * 100)}% score)
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  item.sentiment === 'POSITIVE' ? 'bg-emerald-500' : item.sentiment === 'NEGATIVE' ? 'bg-rose-500' : 'bg-brand-500'
                }`}
                style={{ width: `${Math.round(item.sentimentScore * 100)}%` }}
              />
            </div>
          </div>

          {/* Topics & Key Phrases */}
          <div className="mt-5 space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected Topics</span>
              <div className="flex items-center flex-wrap gap-1.5 mt-2">
                {item.topics.map(t => (
                  <span key={t} className="text-xs font-semibold text-indigo-300 bg-indigo-950/70 border border-indigo-800/60 px-2.5 py-1 rounded-lg">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {item.keyPhrases.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Phrase Extraction</span>
                <div className="flex items-center flex-wrap gap-1.5 mt-2">
                  {item.keyPhrases.map((kp, idx) => (
                    <span key={idx} className="text-xs text-slate-300 bg-slate-850 border border-slate-800 px-2 py-0.5 rounded">
                      "{kp}"
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Suggested Response */}
          {item.aiResponseDraft && (
            <div className="mt-5 p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Suggested Customer Response
                </span>
                <button
                  onClick={handleCopyDraft}
                  className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-white px-2 py-0.5 rounded bg-purple-900/40 border border-purple-700/50 transition-all"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Response'}</span>
                </button>
              </div>
              <p className="text-xs text-purple-100 italic leading-relaxed pt-1">
                "{item.aiResponseDraft}"
              </p>
            </div>
          )}

          {/* Status & Internal Notes Controls */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Workflow Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['NEW', 'IN_REVIEW', 'ACTION_TAKEN', 'RESOLVED'] as Status[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatus(st)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      status === st
                        ? 'bg-brand-600 text-white border-brand-500 shadow-glow'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Internal Team Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for engineers or support reps..."
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-glow transition-all"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};
