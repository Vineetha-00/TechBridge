import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from '../components/common/Badge';
import {
  ShieldAlert, Users, CheckCircle2, XCircle, AlertTriangle,
  FileCheck, Activity, Search, ShieldCheck
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('verifications'); // 'verifications' | 'users' | 'reports'
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, verRes, usersRes, repRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/verifications'),
        api.get('/admin/users'),
        api.get('/admin/reports')
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.stats);
      if (verRes.data?.success) setVerifications(resData(verRes.data.requests));
      if (usersRes.data?.success) setUsersList(resData(usersRes.data.users));
      if (repRes.data?.success) setReports(resData(repRes.data.reports));
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const resData = (d) => d || [];

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const handleReviewVerification = async (vId, status) => {
    const adminNotes = prompt(`Optional admin notes for ${status.toUpperCase()}:`, 'Verified by department administrator');
    try {
      const res = await api.patch(`/admin/verifications/${vId}/review`, {
        status,
        admin_notes: adminNotes
      });
      if (res.data?.success) {
        alert(`Verification request ${status}!`);
        fetchAdminData();
      }
    } catch (e) {
      alert('Failed to update verification.');
    }
  };

  const handleUpdateRole = async (uId, newRole) => {
    try {
      const res = await api.patch(`/admin/users/${uId}/role`, { role: newRole });
      if (res.data?.success) {
        alert(`User role updated to ${newRole}`);
        fetchAdminData();
      }
    } catch (e) {
      alert('Failed to change role.');
    }
  };

  const handleResolveReport = async (repId) => {
    const action = prompt('Action taken:', 'Warned user & removed offending comment');
    if (!action) return;
    try {
      const res = await api.patch(`/admin/reports/${repId}/resolve`, {
        status: 'resolved',
        action
      });
      if (res.data?.success) {
        alert('Report resolved.');
        fetchAdminData();
      }
    } catch (e) {
      alert('Failed to resolve report.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Admin Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          You need an Administrator account to view this panel.
          Use the <strong>Role Switcher</strong> at the top navbar to switch to "Dr. Ramesh Kumar (Admin)" for instant testing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-rose-600" />
          <span>Platform Governance & Administration</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review student ID proofs, approve placed graduate credentials, moderate discussions, and enforce community standards.
        </p>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Users</p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.totalUsers || usersList.length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-amber-600 font-semibold uppercase">Pending Verifications</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {verifications.filter(v => v.status === 'pending').length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-emerald-600 font-semibold uppercase">Discussions Vetted</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {stats?.totalDiscussions || 3}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-rose-600 font-semibold uppercase">Reported Issues</p>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">
            {reports.filter(r => r.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'verifications' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Verification Requests ({verifications.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'users' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Manage Users ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'reports' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Content Reports ({reports.length})
        </button>
      </div>

      {/* TAB 1: VERIFICATIONS TABLE */}
      {activeTab === 'verifications' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Student ID & Placed Graduate Verification Queue
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th className="p-3">User & Email</th>
                  <th className="p-3">Role Requested</th>
                  <th className="p-3">Company / Details</th>
                  <th className="p-3">Submitted Proof</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {verifications.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <strong className="block text-slate-800 dark:text-slate-100">{v.user_name}</strong>
                      <span className="text-[11px] text-slate-400">{v.email}</span>
                    </td>
                    <td className="p-3">
                      <RoleBadge role={v.role_requested} showIcon={false} />
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {v.company_name || 'CSE Student ID'}
                    </td>
                    <td className="p-3">
                      <a
                        href={v.id_card_document_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 font-semibold hover:underline"
                      >
                        Inspect Document
                      </a>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${v.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : v.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {v.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleReviewVerification(v.id, 'approved')}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold"
                            title="Approve User"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReviewVerification(v.id, 'rejected')}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USERS TABLE */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            User Accounts & Permission Assignment
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">College</th>
                  <th className="p-3">Verified?</th>
                  <th className="p-3 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 flex items-center gap-2">
                      <img src={u.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <strong className="block text-slate-800 dark:text-slate-100">{u.full_name}</strong>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <RoleBadge role={u.role} showIcon={false} />
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {u.college_name?.split('(')[0] || 'Engineering College'}
                    </td>
                    <td className="p-3">
                      {u.is_verified ? (
                        <span className="text-emerald-600 font-bold">Yes ✓</span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className="px-2 py-1 text-xs rounded border bg-slate-50 dark:bg-slate-800"
                      >
                        <option value="first_year">1st Year</option>
                        <option value="second_year">2nd Year</option>
                        <option value="third_year">3rd Year</option>
                        <option value="final_year">Final Year</option>
                        <option value="placed_graduate">Placed Graduate</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS */}
      {activeTab === 'reports' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Reported Content & Community Moderation
          </h3>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-600 dark:text-rose-400 uppercase text-[10px]">
                    Report Type: {rep.content_type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {rep.status}
                  </span>
                </div>
                <p className="text-slate-800 dark:text-slate-200">
                  <strong>Reason:</strong> "{rep.reason}"
                </p>
                <div className="flex items-center justify-between text-slate-400 text-[11px] pt-2 border-t">
                  <span>Reported by {rep.reporter_name}</span>
                  {rep.status === 'pending' ? (
                    <button
                      onClick={() => handleResolveReport(rep.id)}
                      className="px-3 py-1 rounded bg-brand-600 text-white font-bold"
                    >
                      Take Action & Resolve
                    </button>
                  ) : (
                    <span className="text-emerald-600 font-semibold">Action: {rep.admin_action_taken}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
