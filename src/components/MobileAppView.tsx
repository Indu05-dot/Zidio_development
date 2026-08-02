'use client';

import React, { useState } from 'react';
import { FeedbackItem, AnalyticsSummary } from '@/lib/types';
import { Smartphone, Send, Star, Smile, Frown, Meh, Sparkles, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';

interface MobileAppViewProps {
  feedbacks: FeedbackItem[];
  analytics: AnalyticsSummary | null;
  workspaceName: string;
  onAddFeedback: (data: any) => Promise<void>;
  onClose: () => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  feedbacks,
  analytics,
  workspaceName,
  onAddFeedback,
  onClose,
}) => {
  const [mobileTab, setMobileTab] = useState<'submit' | 'feed' | 'insights'>('submit');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await onAddFeedback({
        content,
        authorName: authorName || 'Mobile App User',
        rating,
        channel: 'WEB_WIDGET'
      });
      setSuccess(true);
      setContent('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Mobile Simulator Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Smartphone className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Mobile App Experience Engine
            </h3>
            <p className="text-xs text-slate-400">Native iOS / Android Mobile App Interface</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit App Mode</span>
        </button>
      </div>

      {/* Phone Frame Simulator */}
      <div className="relative mx-auto w-full max-w-sm rounded-[40px] border-4 border-slate-700 bg-slate-950 p-4 shadow-2xl space-y-4">
        
        {/* Notch */}
        <div className="mx-auto h-4 w-28 rounded-b-xl bg-slate-800 mb-2"></div>

        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-brand-500"></div>
            <span className="text-xs font-bold text-white">{workspaceName} Mobile</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">● 5G Live</span>
        </div>

        {/* Mobile Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl text-center">
          <button
            onClick={() => setMobileTab('submit')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'submit' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            Submit
          </button>
          <button
            onClick={() => setMobileTab('feed')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'feed' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            Feed ({feedbacks.length})
          </button>
          <button
            onClick={() => setMobileTab('insights')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'insights' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            Stats
          </button>
        </div>

        {/* Tab 1: Submit Feedback Mobile View */}
        {mobileTab === 'submit' && (
          <div className="space-y-4 py-2">
            {success ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-emerald-300">Feedback Analyzed!</p>
                <p className="text-[10px] text-slate-400">Processed by AI & added to live dashboard.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-white">How was your experience today?</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-800'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your Name (Optional)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell us what you love or what we can fix..."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Analyzing via AI...' : 'Submit Feedback'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Mobile Feed View */}
        {mobileTab === 'feed' && (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {feedbacks.map((f) => (
              <div key={f.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-white">{f.authorName || 'User'}</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded ${
                    f.sentiment === 'POSITIVE' ? 'bg-emerald-500/20 text-emerald-400' : f.sentiment === 'NEGATIVE' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-300'
                  }`}>
                    {f.sentiment}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">"{f.content}"</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Mobile Stats */}
        {mobileTab === 'insights' && (
          <div className="space-y-3 py-2 text-center">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Sentiment Score</span>
              <p className="text-2xl font-black text-emerald-400">{analytics?.sentimentScoreIndex || 0}%</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400">Total Items</span>
                <p className="font-bold text-white">{analytics?.totalFeedback || 0}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400">Action Needed</span>
                <p className="font-bold text-rose-400">{analytics?.urgentActionCount || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Home Bar Indicator */}
        <div className="mx-auto h-1 w-24 rounded-full bg-slate-700 mt-2"></div>
      </div>

    </div>
  );
};
