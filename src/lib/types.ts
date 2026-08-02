export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export type Status = 'NEW' | 'IN_REVIEW' | 'ACTION_TAKEN' | 'RESOLVED';

export type Channel = 'WEB_WIDGET' | 'SURVEY' | 'EMAIL' | 'DIRECT_API' | 'CSV_IMPORT';

export interface Workspace {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
}

export interface FeedbackItem {
  id: string;
  content: string;
  authorName?: string | null;
  authorEmail?: string | null;
  channel: Channel;
  rating?: number | null;
  sentiment: Sentiment;
  sentimentScore: number;
  topics: string[];
  keyPhrases: string[];
  aiResponseDraft?: string | null;
  status: Status;
  internalNotes?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface TopicDistributionItem {
  name: string;
  count: number;
  sentiment: Sentiment;
}

export interface AnalyticsSummary {
  totalFeedback: number;
  sentimentScoreIndex: number;
  npsEstimate: number;
  urgentActionCount: number;
  sentimentCounts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topicDistribution: TopicDistributionItem[];
  channelBreakdown: Record<string, number>;
}

export interface AIInsightReport {
  title: string;
  summary: string;
  recommendations: string[];
  overallSentiment: number;
}
