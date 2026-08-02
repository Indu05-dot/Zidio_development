'use client';

import React, { useState } from 'react';
import { X, Code2, Copy, Check, Sparkles, Send, Star, Layers } from 'lucide-react';

interface WidgetBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export const WidgetBuilderModal: React.FC<WidgetBuilderModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
}) => {
  const [widgetTitle, setWidgetTitle] = useState('We value your feedback!');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Live Widget Preview Interactive Test State
  const [previewContent, setPreviewContent] = useState('');
  const [previewRating, setPreviewRating] = useState(5);
  const [previewSuccess, setPreviewSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const embedCode = `<!-- LOOP Feedback Widget Snippet -->
<script 
  src="http://localhost:3000/widget.js" 
  data-workspace-id="${workspaceId}"
  data-title="${widgetTitle}"
  data-accent-color="${accentColor}"
  async>
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: previewContent,
          rating: previewRating,
          channel: 'WEB_WIDGET',
          workspaceId,
          authorName: 'Widget Preview User'
        })
      });

      if (res.ok) {
        setPreviewSuccess(true);
        setPreviewContent('');
        setTimeout(() => setPreviewSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl glass-modal border border-slate-800 rounded-3xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Embeddable Feedback Widget Generator</h2>
              <p className="text-xs text-slate-400">Configure visual widget parameters and copy embed script</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Configuration Parameters */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Widget Title / Prompt
              </label>
              <input
                type="text"
                value={widgetTitle}
                onChange={(e) => setWidgetTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Brand Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-xs text-slate-300 uppercase">{accentColor}</span>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Embed Code Snippet</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-white px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-800/40 transition-all"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippet ? 'Copied Snippet' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                {embedCode}
              </pre>
            </div>
          </div>

          {/* Right Column: Live Interactive Preview Card */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Live Interactive Preview
            </span>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h4 className="text-sm font-bold text-white">{widgetTitle}</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">Powered by LOOP</span>
              </div>

              {previewSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-center space-y-1">
                  <p className="text-xs font-bold text-emerald-400">Feedback Submitted!</p>
                  <p className="text-[11px] text-slate-400">Processed in real-time by AI Sentiment Engine.</p>
                </div>
              ) : (
                <form onSubmit={handleTestSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setPreviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= previewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <textarea
                      value={previewContent}
                      onChange={(e) => setPreviewContent(e.target.value)}
                      placeholder="Type your message here..."
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ backgroundColor: accentColor }}
                    className="w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Feedback'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
