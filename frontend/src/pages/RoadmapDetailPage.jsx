import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft, CheckCircle2, Circle, Clock, ExternalLink,
  Code2, Sparkles, BookOpen, Layers, CheckSquare
} from 'lucide-react';

export const RoadmapDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState({ completed_milestones: [], progress_percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/roadmaps/${slug}`);
      if (res.data?.success) {
        setRoadmap(res.data.roadmap);
        if (res.data.userProgress) {
          setProgress(res.data.userProgress);
        }
      }
    } catch (err) {
      console.error('Failed to load roadmap detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [slug]);

  const handleToggleMilestone = async (milestoneId) => {
    setUpdating(true);
    try {
      const res = await api.post('/roadmaps/progress', {
        roadmapId: roadmap.id,
        milestoneId
      });
      if (res.data?.success) {
        setProgress(res.data.progress);
      }
    } catch (e) {
      alert('Failed to update progress.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Roadmap not found.</p>
        <Link to="/roadmaps" className="text-xs text-brand-600 font-bold mt-2 inline-block">
          ← Back to roadmaps
        </Link>
      </div>
    );
  }

  const milestones = roadmap.milestones || [];
  const progressPercent = progress.progress_percentage || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/roadmaps" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Roadmaps</span>
      </Link>

      {/* Roadmap Header & Progress Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            {roadmap.target_year ? `Year ${roadmap.target_year} CSE Blueprint` : roadmap.category?.replace('_', ' ')}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Estimated Duration: {roadmap.estimated_months} Months</span>
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {roadmap.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {roadmap.description}
          </p>
        </div>

        {/* Progress Bar Widget */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-brand-600" />
              <span>Your Milestone Progress</span>
            </span>
            <span className="font-extrabold text-brand-600 dark:text-brand-400">
              {progressPercent}% Completed ({progress.completed_milestones?.length || 0}/{milestones.length})
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-blue-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-600" />
          <span>Curated Milestones ({milestones.length})</span>
        </h3>

        {milestones.map((m, idx) => {
          const isCompleted = progress.completed_milestones?.includes(m.id);
          return (
            <div
              key={m.id || idx}
              className={`p-6 rounded-2xl border transition space-y-4 ${isCompleted ? 'bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
            >
              {/* Milestone header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleMilestone(m.id)}
                    disabled={updating}
                    className="mt-0.5 text-brand-600 hover:scale-110 transition flex-shrink-0"
                    title={isCompleted ? "Mark incomplete" : "Mark milestone completed"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 hover:text-brand-500" />
                    )}
                  </button>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Milestone {m.milestone_order || idx + 1}
                    </span>
                    <h4 className={`text-base font-bold ${isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleMilestone(m.id)}
                  disabled={updating}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex-shrink-0 ${isCompleted ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50'}`}
                >
                  {isCompleted ? 'Completed ✓' : 'Mark Complete'}
                </button>
              </div>

              {/* Objectives & Topics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {m.objectives && m.objectives.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-slate-400 block">
                      Learning Objectives
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
                      {m.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {m.recommended_topics && m.recommended_topics.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-slate-400 block">
                      Recommended Topics
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.recommended_topics.map((top, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 font-medium">
                          {top}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Resources */}
              {m.suggested_resources && m.suggested_resources.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                    Curated Tutorials & Documentation
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {m.suggested_resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-brand-500 flex items-center justify-between text-xs text-slate-800 dark:text-slate-200 transition group"
                      >
                        <span className="font-semibold group-hover:text-brand-600 truncate">{res.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Projects */}
              {m.suggested_projects && m.suggested_projects.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase text-brand-600 dark:text-brand-400 block mb-2">
                    Hands-on Practice Project
                  </span>
                  {m.suggested_projects.map((prj, i) => (
                    <div key={i} className="p-3 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/60 text-xs">
                      <strong className="text-slate-900 dark:text-white block">{prj.title}</strong>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">{prj.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

