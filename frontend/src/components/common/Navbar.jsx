import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { RoleBadge } from './Badge';
import { DEMO_ACCOUNTS } from '../../utils/constants';
import {
  Sun, Moon, Bell, Sparkles, LogOut, User,
  ChevronDown, ShieldAlert, CheckCircle2,
  Users
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, switchDemoAccount, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-brand-600 dark:from-white dark:via-blue-200 dark:to-brand-400 bg-clip-text text-transparent">
                TechBridge
              </span>
              <span className="hidden sm:block text-[10px] font-medium tracking-wide text-slate-500 dark:text-slate-400 uppercase">
                CSE Mentorship & AI Guidance
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Switcher Pill */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              title="Switch demo account to test different roles (Admin, Placed Senior, 1st Year)"
            >
              <Users className="w-3.5 h-3.5 text-brand-500" />
              <span>Role: <strong className="font-semibold">{user?.role?.replace('_', ' ')}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Demo Account (Quick Test)
                </div>
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      switchDemoAccount(acc.id);
                      setShowDemoMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition ${user?.id === acc.id ? 'bg-brand-50/50 dark:bg-brand-950/30' : ''}`}
                  >
                    <img src={acc.avatar} alt={acc.name} className="w-7 h-7 rounded-full object-cover mt-0.5 border" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">{acc.name}</span>
                        {user?.id === acc.id && <CheckCircle2 className="w-3 h-3 text-brand-500" />}
                      </div>
                      <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium block">{acc.roleLabel}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadCount > 0) markAllAsRead();
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">Notifications</h4>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-[11px] text-brand-600 hover:underline">
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">No new notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setShowNotifications(false);
                          if (n.link_url) navigate(n.link_url);
                        }}
                        className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition"
                      >
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{n.title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1 pl-2 pr-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
              >
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'}
                  alt={user.full_name}
                  className="w-7 h-7 rounded-full object-cover border border-brand-400"
                />
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-semibold block leading-tight text-slate-800 dark:text-slate-100">
                    {user.full_name?.split(' ')[0]}
                  </span>
                  <RoleBadge role={user.role} showIcon={false} className="text-[9px] px-1.5 py-0" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    {user.placed_company && (
                      <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold mt-1">
                        Placed @ {user.placed_company}
                      </p>
                    )}
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Student Profile & Verification
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      Admin Governance Dashboard
                    </Link>
                  )}

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition"
              >
                Join TechBridge
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
