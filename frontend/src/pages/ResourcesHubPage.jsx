import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RESOURCE_CATEGORIES } from '../utils/constants';
import { DifficultyBadge } from '../components/common/Badge';
import {
  BookmarkCheck, Search, ExternalLink, Plus,
  ThumbsUp, BookOpen, Video, Code, FileText, X
} from 'lucide-react';

export const ResourcesHubPage = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New resource modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cat, setCat] = useState('Tutorials');
  const [resType, setResType] = useState('website');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('DSA, Guide');
  const [submitting, setSubmitting] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const res = await api.get('/resources', { params });
      if (res.data?.success) {
        setResources(res.data.resources);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [category]);

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/resources', {
        title,
        description,
        category: cat,
        resource_type: resType,
        url,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      if (res.data?.success) {
        setShowModal(false);
        setTitle('');
        setDescription('');
        setUrl('');
        fetchResources();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit resource.');
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
            <BookmarkCheck className="w-6 h-6 text-brand-600" />
            <span>Curated Resources Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Top-rated tutorials, free certified courses, LeetCode sheets, and system design repositories.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Suggest Resource</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {RESOURCE_CATEGORIES.map((c) => (
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
            onKeyDown={(e) => e.key === 'Enter' && fetchResources()}
            placeholder="Search resources, tags..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-400 dark:hover:border-brand-600 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    {r.category}
                  </span>
                  <DifficultyBadge difficulty={r.difficulty} />
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {r.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {r.description}
                </p>

                {r.tags && r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {r.tags.map(t => (
                      <span key={t} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {r.is_free ? '100% Free' : 'Freemium'}
                </span>

                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:hover:bg-brand-900 dark:text-brand-300 transition"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggest Resource Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Suggest a Learning Resource</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Resource Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. NeetCode 150 Video Roadmap"
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
                    {RESOURCE_CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Resource Type</label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="website">Website / Platform</option>
                    <option value="course">Free Course</option>
                    <option value="github">GitHub Repo</option>
                    <option value="video">Video Lecture</option>
                    <option value="pdf">Documentation / PDF</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">URL Link</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Why do you recommend this?</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Explain why this resource helped you or your batchmates..."
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 text-xs text-slate-500">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-1.5 text-xs font-bold bg-brand-600 text-white rounded-lg">
                  {submitting ? 'Submitting...' : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
