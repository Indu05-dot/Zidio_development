'use client';

import React from 'react';
import type { FeedbackItem } from '@/lib/types';

type FeedbackApiResponse = {
  success: boolean;
  count: number;
  data: FeedbackItem[];
};

const API_BASE = 'http://localhost:4000';

export default function Home() {
  const [feedbacks, setFeedbacks] = React.useState<FeedbackItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [isAdding, setIsAdding] = React.useState(false);
  const [name, setName] = React.useState('');
  const [content, setContent] = React.useState('');
  const [rating, setRating] = React.useState(5);
  const [submitting, setSubmitting] = React.useState(false);

  const loadFeedbacks = React.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/feedbacks`, {
        method: 'GET',
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to load feedback data');
      }

      const json = (await res.json()) as FeedbackApiResponse;
      setFeedbacks(Array.isArray(json.data) ? json.data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load feedback data');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadFeedbacks();

    const timer = window.setInterval(() => {
      loadFeedbacks();
    }, 5000);

    return () => window.clearInterval(timer);
  }, [loadFeedbacks]);

  const handleAddFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          authorName: name || 'Anonymous',
          rating,
          channel: 'WEB_WIDGET',
          workspaceId: 'ws_saas',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback');
      }

      setName('');
      setContent('');
      setRating(5);
      setIsAdding(false);
      await loadFeedbacks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const sentimentCounts = feedbacks.reduce(
    (acc, item) => {
      if (item.sentiment === 'POSITIVE') acc.positive += 1;
      else if (item.sentiment === 'NEGATIVE') acc.negative += 1;
      else acc.neutral += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black">
            LOOP AI Platforms
          </h1>

          <p className="text-slate-400 mt-2">
            Customer-Feedback Intelligence Suite
          </p>

          <p className="text-slate-500 mt-2 text-sm">
            Realtime mode enabled. Data refreshes every 5 seconds.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Total Feedback</p>
            <h2 className="text-3xl font-bold mt-2">{feedbacks.length}</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Positive</p>
            <h2 className="text-3xl font-bold text-emerald-400 mt-2">{sentimentCounts.positive}</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Neutral</p>
            <h2 className="text-3xl font-bold text-yellow-400 mt-2">{sentimentCounts.neutral}</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm text-slate-400">Negative</p>
            <h2 className="text-3xl font-bold text-red-400 mt-2">{sentimentCounts.negative}</h2>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">
                Customer Feedback
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                AI-powered feedback intelligence
              </p>
            </div>

            <button
              onClick={() => setIsAdding((prev) => !prev)}
              className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl font-semibold"
            >
              + Add Feedback
            </button>
          </div>

          {isAdding && (
            <form onSubmit={handleAddFeedback} className="mb-6 p-4 rounded-xl border border-slate-700 bg-slate-950/60 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Customer name"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value) || 5)}
                  placeholder="Rating 1-5"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 px-4 py-2 rounded-lg font-semibold"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write customer feedback"
                rows={3}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
              />
            </form>
          )}

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          <div className="space-y-4">
            {loading ? (
              <p className="text-slate-400">Loading feedback...</p>
            ) : feedbacks.length === 0 ? (
              <p className="text-slate-400">No feedback found yet.</p>
            ) : (
              feedbacks.map((item) => (
                <Feedback
                  key={item.id}
                  name={item.authorName || 'Anonymous'}
                  text={item.content}
                  sentiment={item.sentiment}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Feedback({
  name,
  text,
  sentiment,
}: {
  name: string;
  text: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
}) {
  const badge =
    sentiment === 'POSITIVE'
      ? 'bg-emerald-500/10 text-emerald-400'
      : sentiment === 'NEGATIVE'
        ? 'bg-red-500/10 text-red-400'
        : 'bg-yellow-500/10 text-yellow-400';

  return (
    <div className="border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 transition">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-bold">{name}</h3>
          <p className="text-slate-300 mt-2">{text}</p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge}`}>
          {sentiment}
        </span>
      </div>
    </div>
  );
}