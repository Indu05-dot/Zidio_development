const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-Memory Data Store for Express Server
let feedbacks = [
  {
    id: 'exp_1',
    workspaceId: 'ws_saas',
    content: 'Mobile app push notifications are super timely! Great job on v2.1 update.',
    authorName: 'Alex Mobile User',
    authorEmail: 'alex@mobileapp.com',
    channel: 'WEB_WIDGET',
    rating: 5,
    sentiment: 'POSITIVE',
    sentimentScore: 0.95,
    topics: ['UI/UX', 'Performance'],
    keyPhrases: ['push notifications', 'v2.1 update'],
    aiResponseDraft: 'Hi Alex! Thank you so much for your feedback. We are thrilled you love the new push notifications.',
    status: 'RESOLVED',
    createdAt: new Date().toISOString()
  }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Project LOOP Express Server', timestamp: new Date() });
});

// Root route for quick local verification
app.get('/', (req, res) => {
  res.status(200).send(
    'Project LOOP API is running. Frontend: http://localhost:3003 | Health: /api/health'
  );
});

// GET Feedbacks
app.get('/api/v1/feedbacks', (req, res) => {
  const { workspaceId, sentiment, status } = req.query;
  let result = [...feedbacks];

  if (workspaceId) result = result.filter(f => f.workspaceId === workspaceId);
  if (sentiment) result = result.filter(f => f.sentiment === sentiment);
  if (status) result = result.filter(f => f.status === status);

  res.json({ success: true, count: result.length, data: result });
});

// POST Ingest Feedback (Mobile & Web)
app.post('/api/v1/ingest', (req, res) => {
  const { content, authorName, authorEmail, rating, channel = 'WEB_WIDGET', workspaceId = 'ws_saas' } = req.body;

  if (!content) {
    return res.status(400).json({ success: false, error: 'Content is required' });
  }

  const newItem = {
    id: `exp_${Date.now()}`,
    workspaceId,
    content,
    authorName: authorName || 'Mobile App Visitor',
    authorEmail: authorEmail || undefined,
    channel,
    rating: rating ? parseInt(rating) : 5,
    sentiment: rating && rating >= 4 ? 'POSITIVE' : rating && rating <= 2 ? 'NEGATIVE' : 'NEUTRAL',
    sentimentScore: rating && rating >= 4 ? 0.9 : rating && rating <= 2 ? 0.2 : 0.5,
    topics: ['Mobile App', 'UI/UX'],
    keyPhrases: [content.substring(0, 20)],
    aiResponseDraft: 'Thank you for your mobile feedback! Our team will review it shortly.',
    status: 'NEW',
    createdAt: new Date().toISOString()
  };

  feedbacks.unshift(newItem);
  res.json({ success: true, message: 'Feedback recorded by Express backend', data: newItem });
});

app.listen(PORT, () => {
  console.log(`🚀 Project LOOP Express Backend Server running on http://localhost:${PORT}`);
});
