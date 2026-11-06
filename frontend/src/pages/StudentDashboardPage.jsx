import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { RoleBadge, VerifiedBadge } from '../components/common/Badge';
import {
  Sparkles, ArrowRight, MessageSquareText, Users2, Bot,
  Radio, CheckCircle2, AlertCircle, BookOpen, Clock,
  Briefcase, Compass
} from 'lucide-react';

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/users/dashboard-summary');
        if (res.data?.success) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const academicYear = user?.academic_year || 1;

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-blue-600 text-white p-6 sm:p-8 shadow-lg shadow-brand-500/15">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              Year {academicYear} CSE Guidance Path
            </span>
            {user?.is_verified && <VerifiedBadge label="Verified Student" className="bg-white/20 text-white border-white/30" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            {academicYear === 1 && "You're in your foundation semester. Master C/C++, terminal basics, and solve 1-2 coding problems daily."}
            {academicYear === 2 && "Time to dominate Data Structures & Algorithms, Object-Oriented Design, and build your first full-stack application."}
            {academicYear === 3 && "Crucial internship year! Focus on NeetCode 150 patterns, capstone resume projects, and mock interviews."}
            {academicYear === 4 && "Final-year placement accelerator. Revise System Design, CS fundamentals, and prepare behavioral interview STAR answers."}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Link
              to="/ai-guidance"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-brand-700 hover:bg-blue-50 shadow-sm transition"
            >
              <Bot className="w-4 h-4 text-brand-600" />
              <span>Ask AI Career Advisor</span>
            </Link>
            <Link
              to="/mentorship"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-800/60 hover:bg-brand-800 text-white border border-white/20 transition"
            >
              <Users2 className="w-4 h-4" />
              <span>Connect with Verified Seniors</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Verification Warning if pending */}
      {user && !user.is_verified && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Student ID Verification Pending Review
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Your submitted college credentials or offer documents are under administrator review. You can browse discussions and roadmaps in the meantime.
              </p>
            </div>
          </div>
          <Link to="/profile" className="text-xs font-bold text-amber-800 dark:text-amber-200 hover:underline flex-shrink-0">
            View Status
          </Link>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/roadmaps"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 shadow-sm transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Learning Roadmaps</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Year 1-4 & Skill Blueprints</p>
        </Link>

        <Link
          to="/discussions"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 shadow-sm transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-brand-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <MessageSquareText className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Senior Q&A Forum</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Ask questions & view answers</p>
        </Link>

        <Link
          to="/opportunities"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 shadow-sm transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Internships & Jobs</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Verified off-campus drives</p>
        </Link>

        <Link
          to="/ai-guidance"
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 shadow-sm transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">AI Advice Synthesizer</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Fact-check senior opinions</p>
        </Link>
      </div>

      {/* Main Grid: Discussions & Mentors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Discussions (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Senior Discussions</h3>
              <p className="text-xs text-slate-500">Verified answers from Google, Microsoft, and Amazon seniors</p>
            </div>
            <Link to="/discussions" className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {summary?.recentDiscussions?.map((disc) => (
              <Link
                key={disc.id}
                to={`/discussions/${disc.id}`}
                className="block p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 shadow-sm transition"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    {disc.category}
                  </span>
                  {disc.has_verified_senior_answer && (
                    <VerifiedBadge label="Verified Senior Answer" />
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {disc.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {disc.content}
                </p>
                <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                  <span>Asked by {disc.author_name}</span>
                  <div className="flex items-center gap-3">
                    <span>{disc.answers_count} answers</span>
                    <span>{disc.likes_count} likes</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: Recommended Mentors & Tech News */}
        <div className="space-y-6">
          {/* Recommended Mentors */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recommended Mentors
              </h3>
              <Link to="/mentorship" className="text-xs text-brand-600 font-bold hover:underline">
                Explore
              </Link>
            </div>

            <div className="space-y-3">
              {summary?.recommendedMentors?.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                  <div className="flex items-center gap-2.5">
                    <img src={m.avatar_url} alt={m.full_name} className="w-10 h-10 rounded-xl object-cover border" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{m.full_name}</h5>
                      <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold block">
                        {m.placed_company || m.role.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400">{m.college_name?.split('(')[0]}</span>
                    </div>
                  </div>
                  <Link
                    to="/mentorship"
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:hover:bg-brand-900 dark:text-brand-300 transition"
                  >
                    Connect
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Tech Updates */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Trending Tech Updates</span>
              </h3>
              <Link to="/tech-updates" className="text-xs text-brand-600 font-bold hover:underline">
                All
              </Link>
            </div>

            <div className="space-y-3">
              {summary?.trendingTech?.slice(0, 3).map((item) => (
                <a
                  key={item.id}
                  href={item.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block group"
                >
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-brand-600 line-clamp-2">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>{item.source_name}</span>
                    <span>{new Date(item.published_at).toLocaleDateString()}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
