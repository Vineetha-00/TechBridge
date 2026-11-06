import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-white">TechBridge</span>
              <p className="text-xs text-slate-500 italic mt-0.5">
                "Connect with experience. Learn with direction. Build your future."
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Link to="/roadmaps" className="hover:text-brand-600 transition">Roadmaps</Link>
            <Link to="/discussions" className="hover:text-brand-600 transition">Senior Q&A</Link>
            <Link to="/ai-guidance" className="hover:text-brand-600 transition">AI Career Advisor</Link>
            <Link to="/opportunities" className="hover:text-brand-600 transition">Internships & Jobs</Link>
            <Link to="/resources" className="hover:text-brand-600 transition">Learning Hub</Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Built for CSE Students</span>
            <span>•</span>
            <span className="flex items-center gap-1">Empowered by AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
