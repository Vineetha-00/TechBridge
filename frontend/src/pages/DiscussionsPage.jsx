import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DISCUSSION_CATEGORIES } from '../utils/constants';
import { RoleBadge, VerifiedBadge } from '../components/common/Badge';
import {
  MessageSquareText, Search, Plus, Filter, ThumbsUp,
  MessageCircle, Bookmark, CheckCircle2, X
} from 'lucide-react';

export const DiscussionsPage = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New discussion modal state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('DSA');
  const [newTags, setNewTags] = useState('DSA, Beginners');

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const res = await api.get('/discussions', { params });
      if (res.data?.success) {
        setDiscussions(res.data.discussions);
      }
    } catch (err) {
      console.error('Failed to load discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDiscussions();
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    setSubmitting(true);
    try {
      const res = await api.post('/discussions', {
        title: newTitle,
        content: newContent,
        category: newCategory,
        tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
      });
      if (res.data?.success) {
        setShowModal(false);
        setNewTitle('');
        setNewContent('');
        fetchDiscussions();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post question.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (e, id) => {
    e.preventDefault();
    try {
      const res = await api.post(`/discussions/${id}/like`);
      if (res.data?.success) {
        setDiscussions(prev => prev.map(d => d.id === id ? { ...d, likes_count: res.data.likes_count } : d));
      }
    } catch (e) {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Post CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <MessageSquareText className="w-6 h-6 text-brand-600" />
            <span>Senior–Junior Discussion Forum</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ask technical queries, compare career paths, and receive answers vetted by placed graduates.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Ask a Question</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {DISCUSSION_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${selectedCategory === cat ? 'bg-brand-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </form>
      </div>

      {/* Discussions Feed */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : discussions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <MessageSquareText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">No discussions found</h3>
          <p className="text-xs text-slate-500 mt-1">Be the first student to ask a question in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((d) => (
            <div
              key={d.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 transition space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    {d.category}
                  </span>
                  {d.has_verified_senior_answer && (
                    <VerifiedBadge label="Verified Senior Answer" />
                  )}
                  {d.is_resolved && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Resolved
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(d.created_at).toLocaleDateString()}
                </span>
              </div>

              <Link to={`/discussions/${d.id}`} className="block group">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition">
                  {d.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {d.content}
                </p>
              </Link>

              {/* Tags */}
              {d.tags && d.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {d.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Asked by</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{d.author_name}</span>
                  <RoleBadge role={d.author_role} showIcon={false} className="text-[9px] px-1.5 py-0" />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleLike(e, d.id)}
                    className="flex items-center gap-1 text-slate-500 hover:text-brand-600 transition"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{d.likes_count}</span>
                  </button>

                  <Link
                    to={`/discussions/${d.id}`}
                    className="flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{d.answers_count} Answers</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ask Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquareText className="w-5 h-5 text-brand-600" />
                <span>Ask Question on TechBridge</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDiscussion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Question Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="e.g. Should I pick C++ or Java for 2nd-year DSA and placements?"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {DISCUSSION_CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="DSA, C++, Placements"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Explanation / Context
                </label>
                <textarea
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  placeholder="Explain your academic year, current knowledge, and what you are confused about..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Publish Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
