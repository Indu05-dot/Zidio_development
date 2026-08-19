'use client';

import React from 'react';
import { Activity, ArrowUpRight, CircleAlert, Clock3, Radio, RefreshCw } from 'lucide-react';
import { AIInsightsModal } from '@/components/AIInsightsModal';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { FeedbackDetailDrawer } from '@/components/FeedbackDetailDrawer';
import { FeedbackFeed } from '@/components/FeedbackFeed';
import { KPICards } from '@/components/KPICards';
import { MobileAppView } from '@/components/MobileAppView';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Navbar } from '@/components/Navbar';
import { NewFeedbackModal } from '@/components/NewFeedbackModal';
import { Toast, ToastMessage } from '@/components/Toast';
import { WidgetBuilderModal } from '@/components/WidgetBuilderModal';
import type { AIInsightReport, AnalyticsSummary, Channel, FeedbackItem, Sentiment, Status, Workspace } from '@/lib/types';

const API_BASE = 'https://zidio-development-backend.onrender.com';

const workspaces: Workspace[] = [
  {
    id: 'ws_saas',
    name: 'Product experience',
    slug: 'product-experience',
    description: 'Customer feedback operations',
  },
];

const demoFeedback: FeedbackItem[] = [
  {
    id: 'demo_01',
    content: 'The new onboarding flow is clear and fast. I was able to set up my team before lunch.',
    authorName: 'Maya Chen',
    authorEmail: 'maya@northstar.io',
    channel: 'SURVEY',
    rating: 5,
    sentiment: 'POSITIVE',
    sentimentScore: 0.94,
    topics: ['Onboarding', 'UI/UX'],
    keyPhrases: ['clear and fast', 'set up my team'],
    aiResponseDraft: 'Hi Maya, thank you for sharing this. We are thrilled the new onboarding experience got your team up and running quickly.',
    status: 'RESOLVED',
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo_02',
    content: 'Our exports time out when filtering larger date ranges. This is blocking our weekly reporting.',
    authorName: 'Jordan Patel',
    authorEmail: 'jordan@harbor.co',
    channel: 'EMAIL',
    rating: 2,
    sentiment: 'NEGATIVE',
    sentimentScore: 0.18,
    topics: ['Performance', 'Reporting'],
    keyPhrases: ['exports time out', 'weekly reporting'],
    aiResponseDraft: 'Hi Jordan, thank you for flagging this. We are investigating the export timeout and will share an update shortly.',
    status: 'NEW',
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo_03',
    content: 'The mobile notifications are useful, but I would like more control over the alerts I receive.',
    authorName: 'Alex Morgan',
    channel: 'WEB_WIDGET',
    rating: 3,
    sentiment: 'NEUTRAL',
    sentimentScore: 0.56,
    topics: ['Mobile app', 'Notifications'],
    keyPhrases: ['more control', 'alerts I receive'],
    aiResponseDraft: 'Hi Alex, thanks for the thoughtful feedback. More granular notification controls are a great suggestion for our product team.',
    status: 'IN_REVIEW',
    createdAt: new Date(Date.now() - 79 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo_04',
    content: 'Love the new dashboard. The weekly trend view makes it much easier to share progress with leadership.',
    authorName: 'Priya Shah',
    channel: 'DIRECT_API',
    rating: 5,
    sentiment: 'POSITIVE',
    sentimentScore: 0.91,
    topics: ['Analytics', 'Reporting'],
    keyPhrases: ['weekly trend view', 'share progress'],
    aiResponseDraft: 'Hi Priya, we are delighted the trend view makes reporting easier. Thanks for taking the time to share this!',
    status: 'ACTION_TAKEN',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

type FeedbackApiResponse = { success: boolean; data?: FeedbackItem[] };

function buildAnalytics(feedbacks: FeedbackItem[]): AnalyticsSummary {
  const sentimentCounts = feedbacks.reduce(
    (counts, item) => {
      counts[item.sentiment.toLowerCase() as Lowercase<Sentiment>] += 1;
      return counts;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const topics = new Map<string, { count: number; sentiments: Record<Sentiment, number> }>();
  const channels: Record<string, number> = {};

  feedbacks.forEach((item) => {
    channels[item.channel] = (channels[item.channel] ?? 0) + 1;
    item.topics.forEach((topic) => {
      const entry = topics.get(topic) ?? { count: 0, sentiments: { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 } };
      entry.count += 1;
      entry.sentiments[item.sentiment] += 1;
      topics.set(topic, entry);
    });
  });

  const totalFeedback = feedbacks.length;
  const sentimentScoreIndex = totalFeedback
    ? Math.round(((sentimentCounts.positive + sentimentCounts.neutral * 0.55) / totalFeedback) * 100)
    : 0;

  return {
    totalFeedback,
    sentimentScoreIndex,
    npsEstimate: totalFeedback ? Math.round(((sentimentCounts.positive - sentimentCounts.negative) / totalFeedback) * 100) : 0,
    urgentActionCount: feedbacks.filter((item) => item.sentiment === 'NEGATIVE' && item.status !== 'RESOLVED').length,
    sentimentCounts,
    topicDistribution: [...topics.entries()]
      .map(([name, value]) => ({
        name,
        count: value.count,
        sentiment: (Object.entries(value.sentiments).sort(([, first], [, second]) => second - first)[0]?.[0] ?? 'NEUTRAL') as Sentiment,
      }))
      .sort((first, second) => second.count - first.count)
      .slice(0, 5),
    channelBreakdown: channels,
  };
}

function makeInsightReport(analytics: AnalyticsSummary): AIInsightReport {
  const leadingTopic = analytics.topicDistribution[0]?.name ?? 'customer experience';
  const healthLabel = analytics.sentimentScoreIndex >= 70 ? 'strong' : analytics.sentimentScoreIndex >= 45 ? 'mixed' : 'at risk';

  return {
    title: 'Executive feedback brief',
    summary: `Customer health is ${healthLabel} at ${analytics.sentimentScoreIndex}%. ${leadingTopic} is the most discussed theme, while ${analytics.urgentActionCount} negative item${analytics.urgentActionCount === 1 ? '' : 's'} need${analytics.urgentActionCount === 1 ? 's' : ''} active follow-up.`,
    recommendations: [
      `Triage unresolved ${leadingTopic.toLowerCase()} signals with the product and support teams this week.`,
      'Close the loop with customers who shared negative feedback before the next reporting cycle.',
      'Use the highest-volume themes to guide the next customer discovery session.',
    ],
    overallSentiment: analytics.sentimentScoreIndex,
  };
}

export default function Home() {
  const [currentWorkspace, setCurrentWorkspace] = React.useState(workspaces[0]);
  const [feedbacks, setFeedbacks] = React.useState<FeedbackItem[]>(demoFeedback);
  const [loading, setLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSentiment, setSelectedSentiment] = React.useState('ALL');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [selectedTopic, setSelectedTopic] = React.useState('ALL');
  const [selectedItem, setSelectedItem] = React.useState<FeedbackItem | null>(null);
  const [activeTab, setActiveTab] = React.useState<'home' | 'analytics' | 'insights' | 'mobile_app'>('home');
  const [isNewFeedbackOpen, setIsNewFeedbackOpen] = React.useState(false);
  const [isWidgetBuilderOpen, setIsWidgetBuilderOpen] = React.useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = React.useState(false);
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback((type: ToastMessage['type'], message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, type, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000);
  }, []);

  const loadFeedbacks = React.useCallback(async (showRefreshState = false) => {
    if (showRefreshState) setIsRefreshing(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/feedbacks?workspaceId=${currentWorkspace.id}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not reach the feedback API');
      const payload = (await response.json()) as FeedbackApiResponse;
      setFeedbacks(Array.isArray(payload.data) ? payload.data : []);
    } catch {
      if (showRefreshState) addToast('info', 'Showing local demo signals while the API is offline.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [addToast, currentWorkspace.id]);

  React.useEffect(() => {
    setLoading(true);
    loadFeedbacks();
  }, [loadFeedbacks]);

  const analytics = React.useMemo(() => buildAnalytics(feedbacks), [feedbacks]);
  const allTopics = React.useMemo(() => [...new Set(feedbacks.flatMap((item) => item.topics))].sort(), [feedbacks]);
  const filteredFeedbacks = React.useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return feedbacks.filter((item) => {
      const searchableText = `${item.content} ${item.authorName ?? ''} ${item.authorEmail ?? ''} ${item.topics.join(' ')}`.toLowerCase();
      return (
        (!normalizedSearch || searchableText.includes(normalizedSearch)) &&
        (selectedSentiment === 'ALL' || item.sentiment === selectedSentiment) &&
        (selectedStatus === 'ALL' || item.status === selectedStatus) &&
        (selectedTopic === 'ALL' || item.topics.includes(selectedTopic))
      );
    });
  }, [feedbacks, searchQuery, selectedSentiment, selectedStatus, selectedTopic]);

  const handleAddFeedback = async (data: { content: string; authorName?: string; authorEmail?: string; channel: Channel; rating?: number }) => {
    const rating = data.rating ?? 5;
    const sentiment: Sentiment = rating >= 4 ? 'POSITIVE' : rating <= 2 ? 'NEGATIVE' : 'NEUTRAL';
    const localItem: FeedbackItem = {
      id: `local-${Date.now()}`,
      content: data.content,
      authorName: data.authorName || 'Anonymous',
      authorEmail: data.authorEmail,
      channel: data.channel,
      rating,
      sentiment,
      sentimentScore: sentiment === 'POSITIVE' ? 0.9 : sentiment === 'NEGATIVE' ? 0.2 : 0.55,
      topics: ['New feedback'],
      keyPhrases: [data.content.slice(0, 32)],
      aiResponseDraft: 'Thank you for your feedback. Our team will review it shortly.',
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE}/api/v1/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, workspaceId: currentWorkspace.id }),
      });
      if (!response.ok) throw new Error('Submission failed');
      const payload = (await response.json()) as { data?: FeedbackItem };
      setFeedbacks((current) => [payload.data ?? localItem, ...current]);
      addToast('success', 'Feedback analyzed and added to the workspace.');
    } catch {
      setFeedbacks((current) => [localItem, ...current]);
      addToast('info', 'Feedback saved locally while the API is offline.');
    }
  };

  const handleUpdateStatus = (id: string, status: Status, notes?: string) => {
    setFeedbacks((current) => current.map((item) => item.id === id ? { ...item, status, internalNotes: notes } : item));
    addToast('success', 'Feedback workflow updated.');
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedbacks((current) => current.filter((item) => item.id !== id));
    addToast('info', 'Feedback removed from this view.');
  };

  const visibleDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());

  return (
    <main className="min-h-screen dashboard-grid pb-24 md:pb-10">
      <Navbar
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
        onSelectWorkspace={setCurrentWorkspace}
        onOpenNewFeedback={() => setIsNewFeedbackOpen(true)}
        onOpenWidgetBuilder={() => setIsWidgetBuilderOpen(true)}
        onOpenAIInsights={() => setIsInsightsOpen(true)}
        onReseedData={() => loadFeedbacks(true)}
        isReseeding={isRefreshing}
      />

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <section className="mb-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-stretch">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-400/15 bg-slate-900/55 px-6 py-7 shadow-2xl shadow-slate-950/30 sm:px-8">
            <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase text-indigo-300 eyebrow">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                Intelligence workspace
              </div>
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <h2 className="max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">Turn every customer signal into momentum.</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">A focused command center for discovering friction, prioritizing action, and closing the customer feedback loop.</p>
                </div>
                <button onClick={() => setIsInsightsOpen(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-400/25 bg-indigo-500/10 px-4 py-2.5 text-xs font-bold text-indigo-200 transition hover:bg-indigo-500/20">
                  Explore AI brief <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <aside className="glass-panel flex flex-col justify-between rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 eyebrow"><Activity className="h-4 w-4 text-cyan-400" /> Live pulse</div>
              <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            </div>
            <div className="mt-6">
              <p className="text-3xl font-black text-white">{analytics.sentimentScoreIndex}%</p>
              <p className="mt-1 text-xs text-slate-400">customer health score</p>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400"><Clock3 className="h-3.5 w-3.5" /> Updated {visibleDate}</span>
              <button onClick={() => loadFeedbacks(true)} disabled={isRefreshing} className="font-semibold text-indigo-300 hover:text-white disabled:opacity-50">
                <RefreshCw className={`mr-1 inline h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>
          </aside>
        </section>

        <div className="hidden md:block"><KPICards analytics={analytics} loading={loading} /></div>

        <div className={`${activeTab === 'mobile_app' ? 'block' : 'hidden'} md:hidden`}>
          <MobileAppView feedbacks={feedbacks} analytics={analytics} workspaceName={currentWorkspace.name} onAddFeedback={handleAddFeedback} onClose={() => setActiveTab('home')} />
        </div>

        <div className={`${activeTab === 'analytics' ? 'block' : 'hidden'} md:block`}>
          <AnalyticsCharts analytics={analytics} loading={loading} onSelectTopicFilter={(topic) => { setSelectedTopic(topic); setActiveTab('home'); }} />
        </div>

        <section className={`${activeTab === 'home' ? 'block' : 'hidden'} md:block`}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 eyebrow">Signal inbox</p>
              <h2 className="mt-1 text-xl font-bold text-white">Customer feedback</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-400">
              <CircleAlert className="h-3.5 w-3.5 text-rose-400" />
              <span><strong className="text-slate-200">{analytics.urgentActionCount}</strong> items need attention</span>
            </div>
          </div>
          <FeedbackFeed
            feedbacks={filteredFeedbacks}
            loading={loading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSentiment={selectedSentiment}
            onSentimentChange={setSelectedSentiment}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedTopic={selectedTopic}
            onTopicChange={setSelectedTopic}
            onSelectItem={setSelectedItem}
            onDeleteFeedback={handleDeleteFeedback}
            allTopics={allTopics}
          />
        </section>

        {activeTab === 'insights' && <div className="md:hidden"><AnalyticsCharts analytics={analytics} loading={loading} onSelectTopicFilter={setSelectedTopic} /></div>}
      </div>

      <MobileBottomNav activeTab={activeTab} onSelectTab={setActiveTab} onOpenNewFeedback={() => setIsNewFeedbackOpen(true)} onOpenAIInsights={() => setIsInsightsOpen(true)} />
      <NewFeedbackModal isOpen={isNewFeedbackOpen} onClose={() => setIsNewFeedbackOpen(false)} onAddFeedback={handleAddFeedback} />
      <WidgetBuilderModal isOpen={isWidgetBuilderOpen} onClose={() => setIsWidgetBuilderOpen(false)} workspaceId={currentWorkspace.id} />
      <AIInsightsModal isOpen={isInsightsOpen} onClose={() => setIsInsightsOpen(false)} report={makeInsightReport(analytics)} loading={loading} />
      <FeedbackDetailDrawer item={selectedItem} onClose={() => setSelectedItem(null)} onUpdateStatus={handleUpdateStatus} />
      <Toast toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
    </main>
  );
}
