import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase, Search, ExternalLink, Calendar, MapPin,
  ShieldCheck, Plus, CheckCircle2, Award, Clock, X
} from 'lucide-react';

export const OpportunitiesPage = () => {
  const { user, isSenior, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('opportunities'); // 'opportunities' | 'experiences'
  const [opportunities, setOpportunities] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New Opportunity Modal
  const [showOppModal, setShowOppModal] = useState(false);
  const [oppTitle, setOppTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [oppType, setOppType] = useState('internship');
  const [location, setLocation] = useState('Bangalore / Hyderabad');
  const [stipend, setStipend] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [batches, setBatches] = useState('2025, 2026');
  const [applyLink, setApplyLink] = useState('');
  const [deadline, setDeadline] = useState('');

  // New Interview Experience Modal
  const [showExpModal, setShowExpModal] = useState(false);
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('Software Engineering Intern');
  const [expTips, setExpTips] = useState('');
  const [expOutcome, setExpOutcome] = useState('Selected');

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const params = {};
      if (typeFilter !== 'All') params.type = typeFilter;
      if (search) params.search = search;
      const res = await api.get('/opportunities', { params });
      if (res.data?.success) {
        setOpportunities(res.data.opportunities);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const res = await api.get('/opportunities/experiences');
      if (res.data?.success) {
        setExperiences(res.data.experiences);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    fetchExperiences();
  }, [typeFilter]);

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/opportunities', {
        title: oppTitle,
        company_name: companyName,
        opportunity_type: oppType,
        location,
        stipend_or_salary: stipend,
        eligibility_criteria: eligibility,
        eligible_batches: batches.split(',').map(b => b.trim()),
        application_deadline: deadline,
        official_apply_link: applyLink
      });
      if (res.data?.success) {
        setShowOppModal(false);
        fetchOpportunities();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post opportunity.');
    }
  };

  const handleCreateExperience = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/opportunities/experiences', {
        company_name: expCompany,
        role_applied: expRole,
        preparation_tips: expTips,
        outcome: expOutcome
      });
      if (res.data?.success) {
        setShowExpModal(false);
        fetchExperiences();
      }
    } catch (err) {
      alert('Failed to post experience.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-brand-600" />
            <span>Internships, Placements & Interview Experiences</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified campus hiring drives, off-campus opportunities, and real interview rounds shared by placed graduates.
          </p>
        </div>

        {/* Tab switch & CTA */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'opportunities' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Opportunities
            </button>
            <button
              onClick={() => setActiveTab('experiences')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'experiences' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Interview Experiences
            </button>
          </div>

          {(isAdmin || isSenior) && (
            <button
              onClick={() => activeTab === 'opportunities' ? setShowOppModal(true) : setShowExpModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{activeTab === 'opportunities' ? 'Post Drive' : 'Share Experience'}</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: OPPORTUNITIES */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {['All', 'internship', 'placement', 'hackathon'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${typeFilter === t ? 'bg-brand-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchOpportunities()}
                placeholder="Search company, skills..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Opportunities Cards */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-400 dark:hover:border-brand-600 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                        {opp.opportunity_type}
                      </span>
                      {opp.is_verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified Drive
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-medium">Community Shared</span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {opp.title}
                      </h3>
                      <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-0.5">
                        {opp.company_name}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{opp.location || 'Pan-India'}</span>
                      </div>
                      {opp.stipend_or_salary && (
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                          <Award className="w-3.5 h-3.5 text-brand-500" />
                          <span>{opp.stipend_or_salary}</span>
                        </div>
                      )}
                      {opp.application_deadline && (
                        <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Deadline: {new Date(opp.application_deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
                      <strong className="text-slate-700 dark:text-slate-300 block mb-0.5">Eligibility:</strong>
                      {opp.eligibility_criteria}
                    </div>

                    {opp.eligible_batches && (
                      <div className="flex flex-wrap gap-1">
                        {opp.eligible_batches.map(b => (
                          <span key={b} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium">
                            Batch {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={opp.official_apply_link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Official Career Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INTERVIEW EXPERIENCES */}
      {activeTab === 'experiences' && (
        <div className="space-y-4">
          {experiences.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">No interview experiences yet</h3>
              <p className="text-xs text-slate-500 mt-1">Placed seniors can share their hiring rounds breakdown here.</p>
            </div>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {exp.company_name} - {exp.role_applied}
                    </h3>
                    <span className="text-xs text-slate-500">Shared by {exp.author_name}</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase text-[10px] ${exp.outcome === 'Selected' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-700'}`}>
                    {exp.outcome}
                  </span>
                </div>

                {/* Rounds */}
                {exp.rounds_description && exp.rounds_description.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Hiring Rounds Walkthrough
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {exp.rounds_description.map((r, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                          <strong className="text-brand-600 dark:text-brand-400 block">Round {r.round}: {r.title}</strong>
                          <p className="text-slate-600 dark:text-slate-400 mt-1">{r.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {exp.preparation_tips && (
                  <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300">
                    <strong className="text-brand-700 dark:text-brand-300 block mb-1">Senior Preparation Tip:</strong>
                    {exp.preparation_tips}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Post Opportunity Modal */}
      {showOppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Post Internship or Placement Drive</h3>
              <button onClick={() => setShowOppModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Role Title</label>
                <input
                  type="text"
                  value={oppTitle}
                  onChange={(e) => setOppTitle(e.target.value)}
                  required
                  placeholder="e.g. Google Summer Software Engineering Intern 2025"
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="e.g. Google India"
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Opportunity Type</label>
                  <select
                    value={oppType}
                    onChange={(e) => setOppType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="internship">Internship</option>
                    <option value="placement">Full-time Placement</option>
                    <option value="hackathon">Hackathon / Challenge</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Stipend or Salary (CTC)</label>
                  <input
                    type="text"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    placeholder="e.g. INR 1,10,000 / month"
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Eligible Batches</label>
                  <input
                    type="text"
                    value={batches}
                    onChange={(e) => setBatches(e.target.value)}
                    placeholder="2025, 2026"
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Eligibility Criteria</label>
                <textarea
                  rows={3}
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  required
                  placeholder="e.g. B.Tech / M.Tech in CSE / IT with minimum 7.5 CGPA. Passing out batch 2026..."
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Official Career Link (No referral spam)</label>
                <input
                  type="url"
                  value={applyLink}
                  onChange={(e) => setApplyLink(e.target.value)}
                  required
                  placeholder="https://careers.google.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowOppModal(false)} className="px-3 py-1.5 text-xs text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-brand-600 text-white rounded-lg">
                  Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Experience Modal */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Share Interview Experience</h3>
            <form onSubmit={handleCreateExperience} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  required
                  placeholder="e.g. Microsoft IDC"
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Role</label>
                <input
                  type="text"
                  value={expRole}
                  onChange={(e) => setExpRole(e.target.value)}
                  required
                  placeholder="Software Engineer"
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Preparation Tips & Questions Asked</label>
                <textarea
                  rows={4}
                  value={expTips}
                  onChange={(e) => setExpTips(e.target.value)}
                  required
                  placeholder="Detail round 1 (OA), round 2 (DSA trees/graphs), round 3 (LLD/Behavioral) and tips for juniors..."
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowExpModal(false)} className="px-3 py-1.5 text-xs text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-brand-600 text-white rounded-lg">
                  Submit Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

