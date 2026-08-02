'use client';

import React from 'react';
import { FeedbackItem, Sentiment, Status } from '@/lib/types';
import { Search, Filter, Star, Clock, CheckCircle2, AlertCircle, ArrowUpRight, Tag, Mail, Trash2 } from 'lucide-react';

interface FeedbackFeedProps {
  feedbacks: FeedbackItem[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedSentiment: string;
  onSentimentChange: (s: string) => void;
  selectedStatus: string;
  onStatusChange: (st: string) => void;
  selectedTopic: string;
  onTopicChange: (t: string) => void;
  onSelectItem: (item: FeedbackItem) => void;
  onDeleteFeedback: (id: string) => void;
  allTopics: string[];
}

export const FeedbackFeed: React.FC<FeedbackFeedProps> = ({
  feedbacks,
  loading,
  searchQuery,
  onSearchChange,
  selectedSentiment,
  onSentimentChange,
  selectedStatus,
  onStatusChange,
  selectedTopic,
  onTopicChange,
  onSelectItem,
  onDeleteFeedback,
  allTopics,
}) => {

  const getSentimentPill = (sentiment: Sentiment) => {
    switch (sentiment) {
      case 'POSITIVE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Positive</span>;
      case 'NEGATIVE':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Negative</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">Neutral</span>;
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'NEW':
        return <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded-md"><AlertCircle className="w-3 h-3" /> New</span>;
      case 'IN_REVIEW':
        return <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-md"><Clock className="w-3 h-3" /> In Review</span>;
      case 'ACTION_TAKEN':
        return <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded-md"><Clock className="w-3 h-3" /> Action Taken</span>;
      case 'RESOLVED':
        return <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
      
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search feedback content, author email, or keywords..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all"
          />
        </div>

        {/* Sentiment Filter Tabs */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start lg:self-auto">
          {['ALL', 'POSITIVE', 'NEUTRAL', 'NEGATIVE'].map((s) => (
            <button
              key={s}
              onClick={() => onSentimentChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSentiment === s
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s === 'ALL' ? 'All Sentiments' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Topic Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedTopic}
            onChange={(e) => onTopicChange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none cursor-pointer"
          >
            <option value="ALL">All Topics</option>
            {allTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Status Sub-Header Tabs */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/80 overflow-x-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 pr-2">Status Filter:</span>
        {['ALL', 'NEW', 'IN_REVIEW', 'ACTION_TAKEN', 'RESOLVED'].map((st) => (
          <button
            key={st}
            onClick={() => onStatusChange(st)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedStatus === st
                ? 'bg-slate-700 text-white border border-slate-600'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Feedback Feed Content */}
      {loading ? (
        <div className="space-y-4 py-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-slate-900/60 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm font-semibold">No feedback matches your filter criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing filters or search terms.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {feedbacks.map((item) => (
            <div
              key={item.id}
              className="group p-4 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-brand-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 space-y-2">
                
                {/* Header row: Author, Rating, Channel, Date */}
                <div className="flex items-center flex-wrap gap-2 text-xs">
                  <span className="font-bold text-white flex items-center gap-1">
                    {item.authorName || 'Anonymous'}
                    {item.authorEmail && <span className="font-normal text-slate-400 text-[11px]">({item.authorEmail})</span>}
                  </span>
                  
                  {item.rating && (
                    <div className="flex items-center text-amber-400 text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="font-bold ml-0.5">{item.rating}</span>
                    </div>
                  )}

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.channel.replace('_', ' ')}
                  </span>

                  <span className="text-slate-500 text-[11px]">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Content */}
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  "{item.content}"
                </p>

                {/* Topics & Key Phrases */}
                <div className="flex items-center flex-wrap gap-1.5 pt-1">
                  {item.topics.map(t => (
                    <span key={t} className="text-[10px] font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" /> {t}
                    </span>
                  ))}
                </div>

              </div>

              {/* Right Column: Sentiment Badge, Status, Action */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                <div className="flex items-center gap-2">
                  {getSentimentPill(item.sentiment)}
                  {getStatusBadge(item.status)}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectItem(item)}
                    className="p-2 rounded-lg bg-brand-600/20 hover:bg-brand-600 text-brand-400 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                    title="Inspect AI Sentiment & Draft Reply"
                  >
                    <span>Analyze</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteFeedback(item.id)}
                    className="p-2 rounded-lg hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 transition-all"
                    title="Delete feedback"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
