import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, MessageSquareText, MessagesSquare, Users2,
  Bot, Map, Radio, BookmarkCheck, Briefcase,
  FolderGit2, ShieldCheck, User
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/discussions', label: 'Discussions Forum', icon: MessageSquareText },
    { to: '/chat', label: 'Private Chat', icon: MessagesSquare },
    { to: '/mentorship', label: 'Find Mentors', icon: Users2 },
    { to: '/ai-guidance', label: 'AI Career Advisor', icon: Bot, highlight: true },
    { to: '/roadmaps', label: 'Learning Roadmaps', icon: Map },
    { to: '/tech-updates', label: 'Tech Updates', icon: Radio },
    { to: '/resources', label: 'Resources Hub', icon: BookmarkCheck },
    { to: '/opportunities', label: 'Internships & Jobs', icon: Briefcase },
    { to: '/projects', label: 'Project Ideas & Teams', icon: FolderGit2 },
    { to: '/profile', label: 'My Student Profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', label: 'Admin Governance', icon: ShieldCheck, adminOnly: true });
  }

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
          Student Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                ${isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : item.adminOnly
                  ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                  : item.highlight
                  ? 'text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 bg-brand-50/40 dark:bg-brand-950/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${item.highlight ? 'text-brand-500 animate-pulse' : ''}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.highlight && (
                <span className="text-[10px] bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 font-bold px-1.5 py-0.5 rounded-md">
                  AI
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Mentor Readiness Pill if Senior */}
      {user && ['third_year', 'final_year', 'placed_graduate'].includes(user.role) && (
        <div className="mt-8 p-3 rounded-xl bg-gradient-to-br from-brand-50 to-blue-50 dark:from-slate-800/80 dark:to-brand-950/40 border border-brand-200 dark:border-brand-800/40">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-300">
            <Users2 className="w-4 h-4" />
            <span>Senior Mentorship Status</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
            {user.is_open_to_mentor ? '✅ You are accepting 1-on-1 junior mentorship requests.' : '💤 Mentorship requests paused.'}
          </p>
        </div>
      )}
    </aside>
  );
};

