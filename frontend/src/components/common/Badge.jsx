import React from 'react';
import { USER_ROLES } from '../../utils/constants';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const RoleBadge = ({ role, showIcon = true, className = '' }) => {
  const roleConfig = USER_ROLES[role] || USER_ROLES.first_year;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleConfig.badgeColor} ${className}`}>
      {showIcon && role === 'placed_graduate' && <Sparkles className="w-3 h-3" />}
      {showIcon && role === 'admin' && <ShieldCheck className="w-3 h-3" />}
      {roleConfig.label}
    </span>
  );
};

export const VerifiedBadge = ({ label = 'Verified Senior', className = '' }) => {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 ${className}`}>
      <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
      {label}
    </span>
  );
};

export const DifficultyBadge = ({ difficulty }) => {
  const map = {
    beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    intermediate: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
    advanced: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
    all_levels: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  };

  const style = map[difficulty?.toLowerCase()] || map.all_levels;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${style}`}>
      {difficulty || 'All Levels'}
    </span>
  );
};

