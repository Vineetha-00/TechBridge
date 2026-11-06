import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RoleBadge, VerifiedBadge } from '../components/common/Badge';
import {
  ArrowLeft, ThumbsUp, CheckCircle2, MessageCircle, Send,
  Sparkles, Check, Bookmark, CornerDownRight
} from 'lucide-react';

export const DiscussionDetailPage = () => {
  const { id } = useParams();
  const { user, isSenior } = useAuth();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/discussions/${id}`);
      if (res.data?.success) {
        setDiscussion(res.data.discussion);
      }
    } catch (err) {
      console.error('Failed to load discussion:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer) return;

    setSubmittingAnswer(true);
    try {
      const res = await api.post(`/discussions/${id}/answers`, { content: newAnswer });
      if (res.data?.success) {
        setNewAnswer('');
        fetchDiscussion();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post answer.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleToggleHelpful = async (answerId) => {
    try {
      const res = await api.post(`/discussions/answers/${answerId}/helpful`);
      if (res.data?.success) {
        setDiscussion(prev => ({
          ...prev,
          answers: prev.answers.map(a => a.id === answerId ? { ...a, is_helpful: res.data.is_helpful } : a)
        }));
      }
    } catch (e) {
      // Ignore
    }
  };

  const handleAddComment = async (answerId) => {
    const text = commentInputs[answerId];
    if (!text) return;

    try {
      const res = await api.post(`/discussions/answers/${answerId}/comments`, { content: text });
      if (res.data?.success) {
        setCommentInputs(prev => ({ ...prev, [answerId]: '' }));
        fetchDiscussion();
      }
    } catch (e) {
      alert('Failed to post comment.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Discussion not found.</p>
        <Link to="/discussions" className="text-xs text-brand-600 font-bold mt-2 inline-block">
          ← Back to discussions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/discussions" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discussions</span>
      </Link>

      {/* Main Question Post */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {discussion.category}
            </span>
            {discussion.has_verified_senior_answer && (
              <VerifiedBadge label="Verified Senior Answer Attached" />
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            Posted {new Date(discussion.created_at).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {discussion.title}
        </h1>

        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
          {discussion.content}
        </div>

        {/* Tags */}
        {discussion.tags && discussion.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {discussion.tags.map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Author info */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2.5">
            <img src={discussion.author_avatar || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'} alt="" className="w-8 h-8 rounded-full object-cover border" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">{discussion.author_name}</span>
              <RoleBadge role={discussion.author_role} showIcon={false} className="text-[9px] px-1.5 py-0" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>{discussion.views_count || 1} views</span>
            <span>{discussion.likes_count || 0} likes</span>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>{discussion.answers?.length || 0} Answers</span>
          <span className="text-xs font-normal text-slate-400">
            (Seniors & Placed Engineers share actual campus insights)
          </span>
        </h3>

        {discussion.answers?.map((ans) => (
          <div
            key={ans.id}
            className={`p-6 rounded-2xl border transition space-y-4 ${ans.is_accepted ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
          >
            {/* Answer Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={ans.author_avatar} alt="" className="w-9 h-9 rounded-xl object-cover border" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{ans.author_name}</span>
                    <RoleBadge role={ans.author_role} showIcon={false} className="text-[9px]" />
                  </div>
                  {ans.author_company && (
                    <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 block">
                      {ans.author_company}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {ans.is_accepted && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <Check className="w-3.5 h-3.5" /> Accepted Solution
                  </span>
                )}
                {ans.is_helpful && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-blue-200 dark:border-brand-800">
                    <CheckCircle2 className="w-3 h-3" /> Helpful Answer
                  </span>
                )}
              </div>
            </div>

            {/* Answer Content */}
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {ans.content}
            </div>

            {/* Footer row: Upvote, helpful toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{ans.likes_count || 0} votes</span>
                </span>
                <button
                  onClick={() => handleToggleHelpful(ans.id)}
                  className={`text-xs font-semibold ${ans.is_helpful ? 'text-brand-600' : 'text-slate-500 hover:text-brand-600'} transition`}
                >
                  {ans.is_helpful ? '✓ Marked Helpful' : 'Mark as Helpful'}
                </button>
              </div>
              <span className="text-[11px] text-slate-400">
                {new Date(ans.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Comments Thread */}
            {ans.comments && ans.comments.length > 0 && (
              <div className="pt-2 pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-2">
                {ans.comments.map(c => (
                  <div key={c.id} className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.author_name}: </span>
                    <span>{c.content}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={commentInputs[ans.id] || ''}
                onChange={(e) => setCommentInputs({ ...commentInputs, [ans.id]: e.target.value })}
                placeholder="Reply or say thanks to this senior..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment(ans.id);
                }}
              />
              <button
                onClick={() => handleAddComment(ans.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-brand-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Your Answer Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Post Your Answer / Advice
        </h4>
        <p className="text-xs text-slate-500">
          Share your concrete experience, interview advice, or study strategy for this junior.
        </p>

        <form onSubmit={handlePostAnswer} className="space-y-3">
          <textarea
            rows={5}
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            required
            placeholder="Write clear, constructive advice. Reference specific steps, resource links, and timeline recommendations..."
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Posting as: <strong className="text-slate-700 dark:text-slate-300">{user?.full_name}</strong> ({user?.role?.replace('_', ' ')})
            </span>
            <button
              type="submit"
              disabled={submittingAnswer}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingAnswer ? 'Posting...' : 'Submit Answer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

