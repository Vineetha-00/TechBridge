import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TECH_UPDATE_CATEGORIES } from '../utils/constants';
import {
  Radio, Search, ExternalLink, ShieldCheck, Plus,
  Calendar, Building, Sparkles, X
} from 'lucide-react';

export const TechUpdatesPage = () => {
  const { user, isSenior, isAdmin } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New update modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cat, setCat] = useState('Languages & Frameworks');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const res = await api.get('/tech-updates', { params });
      if (res.data?.success) {
        setUpdates(res.data.updates);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [category]);

  const handleCreateUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/tech-updates', {
        title,
        description,
        category: cat,
        source_url: sourceUrl,
        source_name: sourceName
      });
      if (res.data?.success) {
        setShowModal(false);
        setTitle('');
        setDescription('');
        setSourceUrl('');
        setSourceName('');
        fetchUpdates();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit update.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-rose-500 animate-pulse" />
            <span>Verified Technology Updates</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Curated releases, hiring market developments, and hackathons linked strictly to official sources.
          </p>
        </div>

        {(isAdmin || isSenior) && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Post Tech Update</span>
          </button>
        )}
      </div>

      {/* Category Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {TECH_UPDATE_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${category === c ? 'bg-brand-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUpdates()}
            placeholder="Search verified news..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Updates List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {updates.map((u) => (
            <div
              key={u.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-400 dark:hover:border-brand-600 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    {u.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Source
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {u.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {u.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="text-slate-500 text-[11px]">
                  <span>Source: <strong className="text-slate-700 dark:text-slate-300">{u.source_name || 'Official'}</strong></span>
                  <span className="mx-1.5">•</span>
                  <span>{new Date(u.published_at).toLocaleDateString()}</span>
                </div>

                <a
                  href={u.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-700 transition"
                >
                  <span>Official Release</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal to add tech update */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Post Technology Update</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Node.js 22 Promoted to LTS"
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Category</label>
                  <select
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  >
                    {TECH_UPDATE_CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Source Name</label>
                  <input
                    type="text"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    required
                    placeholder="e.g. Node.js Foundation"
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Original Source URL (No fabricated news)</label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  required
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description / Summary</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Summarize key architectural changes, features, or eligibility dates..."
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 text-xs text-slate-500">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-1.5 text-xs font-bold bg-brand-600 text-white rounded-lg">
                  {submitting ? 'Publishing...' : 'Publish Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
