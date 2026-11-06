import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, ArrowRight, CheckCircle2, Bot,
  Users2, Map, Briefcase, MessageSquareText,
  ShieldCheck, Award, Zap, Code2
} from 'lucide-react';
import { RoleBadge } from '../components/common/Badge';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-brand-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
              <span>AI-Powered Mentorship & Experience-Sharing Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Connect with experience.{' '}
              <span className="bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Learn with direction.
              </span>{' '}
              Build your future.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Designed specifically for CSE students. Confused about C++ vs Java, WebDev vs AI/ML, or LeetCode counts?
              Connect directly with verified seniors, final-year peers, and placed engineers at Google, Microsoft, and Amazon.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02]"
              >
                <span>{user ? "Go to My Dashboard" : "Get Started for Free"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/ai-guidance"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <Bot className="w-4 h-4 text-brand-500" />
                <span>Try AI Career Guidance</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 border-t border-slate-200/80 dark:border-slate-800/80 text-left">
              <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60">
                <p className="text-2xl font-black text-slate-900 dark:text-white">6 Roles</p>
                <p className="text-xs text-slate-500 mt-1">1st Year to Placed SDEs & Admin</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60">
                <p className="text-2xl font-black text-brand-600 dark:text-brand-400">100%</p>
                <p className="text-xs text-slate-500 mt-1">ID-Verified Senior Profiles</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60">
                <p className="text-2xl font-black text-slate-900 dark:text-white">AI Engine</p>
                <p className="text-xs text-slate-500 mt-1">Synthesizes Contradictory Senior Advice</p>
              </div>
              <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60">
                <p className="text-2xl font-black text-brand-600 dark:text-brand-400">4-Year</p>
                <p className="text-xs text-slate-500 mt-1">Year-wise Roadmaps & Milestones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Senior Mentors */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Peer Mentorship Network
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Learn from Seniors Who Have Cleared the Path
              </h2>
            </div>
            <Link to="/mentorship" className="mt-4 md:mt-0 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Browse All Senior Mentors <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-brand-400 transition">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
                  alt="Aravind"
                  className="w-12 h-12 rounded-xl object-cover border"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Aravind Sharma</h4>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">SDE-1 @ Google India</p>
                  <span className="text-[11px] text-slate-500">IIIT Hyderabad Alum</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                "Ex-Microsoft intern. I help juniors master C++ STL, LeetCode pattern recognition, and crack tier-1 product interviews."
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-medium">Google Interview Strategy</span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-medium">LeetCode 150</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-brand-400 transition">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                  alt="Sneha"
                  className="w-12 h-12 rounded-xl object-cover border"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sneha Reddy</h4>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">Software Engineer @ Microsoft</p>
                  <span className="text-[11px] text-slate-500">NIT Warangal Alum</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                "Cloud & AI Engineer. Mentored 50+ students on backend microservices with Java, Azure, and Low-Level System Design."
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-medium">Java Spring Boot</span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-medium">Low Level Design</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-brand-400 transition">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                  alt="Rohit"
                  className="w-12 h-12 rounded-xl object-cover border"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Rohit Verma</h4>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold">Final Year (Amazon PPO)</p>
                  <span className="text-[11px] text-slate-500">NIT Warangal</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                "Won 3 national hackathons and secured Amazon PPO through 3rd-year summer internship. Ask me about resume capstone projects."
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-medium">Full Stack</span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-medium">Amazon OA Preparation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Showcase */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              End-to-End Platform Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Everything a CSE Student Needs in One Place
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              No more fragmented WhatsApp groups or contradictory advice threads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Career Advisor & Synthesizer</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Unique AI system that takes contradictory advice from seniors, identifies common points of agreement, separates personal opinions from verified facts, and builds your custom action plan.
              </p>
              <Link to="/ai-guidance" className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 mt-4 hover:underline">
                Explore AI Advisor <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Senior-Junior Discussion Forum</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Post questions on DSA, college subjects, and placement strategy. Answers marked with "Verified Senior" badges help you filter out noise from actual industry wisdom.
              </p>
              <Link to="/discussions" className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 mt-4 hover:underline">
                View Discussions <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Map className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Interactive Learning Roadmaps</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Year-wise blueprints (1st year C/Linux to 4th year placement sprints) with curated free resources, project milestones, and personal progress tracking.
              </p>
              <Link to="/roadmaps" className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 mt-4 hover:underline">
                View Roadmaps <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
