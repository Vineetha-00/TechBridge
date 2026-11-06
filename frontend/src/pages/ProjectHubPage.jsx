import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DifficultyBadge } from '../components/common/Badge';
import {
  FolderGit2, Search, Plus, Github, Users,
  Code2, ExternalLink, Send, X, Layers, Lightbulb
} from 'lucide-react';

export const ProjectHubPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('teams'); // 'teams' | 'ideas'
  const [ideas, setIdeas] = useState([]);
  const [teams, setTeams] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Create Team Modal
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamTitle, setTeamTitle] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [teamRoles, setTeamRoles] = useState('Frontend React Developer, Backend Node.js');
  const [teamGithub, setTeamGithub] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);

  // Apply to Team Modal
  const [applyingTeam, setApplyingTeam] = useState(null);
  const [roleApplied, setRoleApplied] = useState('');
  const [pitchMessage, setPitchMessage] = useState('');
  const [submittingApply, setSubmittingApply] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects', {
        params: { difficulty: difficultyFilter !== 'All' ? difficultyFilter : undefined }
      });
      if (res.data?.success) {
        setIdeas(res.data.ideas);
        setTeams(res.data.teams);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [difficultyFilter]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/projects/teams', {
        title: teamTitle,
        description: teamDesc,
        open_roles: teamRoles.split(',').map(r => r.trim()),
        max_members: Number(maxMembers),
        github_repo_url: teamGithub
      });
      if (res.data?.success) {
        setShowTeamModal(false);
        setTeamTitle('');
        setTeamDesc('');
        setTeamGithub('');
        fetchProjects();
      }
    } catch (err) {
      alert('Failed to create team.');
    }
  };

  const handleApplyToTeam = async (e) => {
    e.preventDefault();
    if (!applyingTeam || !roleApplied) return;

    setSubmittingApply(true);
    try {
      const res = await api.post(`/projects/teams/${applyingTeam.id}/apply`, {
        role_applied_for: roleApplied,
        pitch_message: pitchMessage
      });
      if (res.data?.success) {
        alert(res.data.message || 'Collaboration pitch sent to team creator!');
        setApplyingTeam(null);
        setRoleApplied('');
        setPitchMessage('');
      }
    } catch (err) {
      alert('Failed to send request.');
    } finally {
      setSubmittingApply(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-brand-600" />
            <span>Project Ideas & Peer Collaboration</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build resume-grade capstone projects, form hackathon squads, and collaborate on GitHub repositories.
          </p>
        </div>

        {/* Tab Switcher & Create CTA */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'teams' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Collaborative Teams
            </button>
            <button
              onClick={() => setActiveTab('ideas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'ideas' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Idea Library
            </button>
          </div>

          <button
            onClick={() => setShowTeamModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Form Team</span>
          </button>
        </div>
      </div>

      {/* TAB 1: COLLABORATIVE TEAMS */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-400 dark:hover:border-brand-600 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                      Status: {t.status}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {t.current_members} / {t.max_members} Members
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {t.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t.description}
                  </p>

                  {/* Open Roles */}
                  {t.open_roles && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Roles Needed:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {t.open_roles.map((r) => (
                          <span key={r} className="text-[11px] px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-semibold border border-brand-200 dark:border-brand-800">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400">
                    Lead Creator: <strong className="text-slate-700 dark:text-slate-300">{t.creator_name}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  {t.github_repo_url ? (
                    <a
                      href={t.github_repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600"
                    >
                      <Github className="w-4 h-4" />
                      <span>Repository</span>
                    </a>
                  ) : <span className="text-xs text-slate-400 italic">Private Repo</span>}

                  <button
                    onClick={() => setApplyingTeam(t)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request to Join</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: IDEA LIBRARY */}
      {activeTab === 'ideas' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {['All', 'beginner', 'intermediate', 'advanced'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${difficultyFilter === d ? 'bg-brand-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
              >
                {d === 'All' ? 'All Difficulties' : d}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-400 dark:hover:border-brand-600 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {idea.domain || 'CSE Project'}
                    </span>
                    <DifficultyBadge difficulty={idea.difficulty} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {idea.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {idea.description}
                  </p>

                  {idea.required_technologies && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {idea.required_technologies.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setTeamTitle(`${idea.title} Squad`);
                      setTeamDesc(`Building ${idea.title} using ${idea.required_technologies?.join(', ')}.`);
                      setShowTeamModal(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-brand-50 text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-brand-500" />
                    <span>Create Team for This Idea</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Team Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Form Collaborative Project Team</h3>
              <button onClick={() => setShowTeamModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Project Team Title</label>
                <input
                  type="text"
                  value={teamTitle}
                  onChange={(e) => setTeamTitle(e.target.value)}
                  required
                  placeholder="e.g. AI Code Reviewer Core Team"
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Roles Needed (Comma separated)</label>
                <input
                  type="text"
                  value={teamRoles}
                  onChange={(e) => setTeamRoles(e.target.value)}
                  required
                  placeholder="Frontend React Developer, Backend Node.js, ML Engineer"
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">GitHub Repo URL (Optional)</label>
                <input
                  type="url"
                  value={teamGithub}
                  onChange={(e) => setTeamGithub(e.target.value)}
                  placeholder="https://github.com/your-org/project"
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Project Description & Goals</label>
                <textarea
                  rows={4}
                  value={teamDesc}
                  onChange={(e) => setTeamDesc(e.target.value)}
                  required
                  placeholder="Explain the problem statement, tech stack, and meeting schedule..."
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowTeamModal(false)} className="px-3 py-1.5 text-xs text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-brand-600 text-white rounded-lg">
                  Launch Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {applyingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Request to Join: {applyingTeam.title}
            </h3>
            <form onSubmit={handleApplyToTeam} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Which role are you applying for?</label>
                <input
                  type="text"
                  value={roleApplied}
                  onChange={(e) => setRoleApplied(e.target.value)}
                  required
                  placeholder="e.g. Frontend React Engineer"
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Your Pitch / Skills / GitHub</label>
                <textarea
                  rows={4}
                  value={pitchMessage}
                  onChange={(e) => setPitchMessage(e.target.value)}
                  required
                  placeholder="Explain your familiarity with the stack, link your GitHub profile, and hours per week you can commit..."
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setApplyingTeam(null)} className="px-3 py-1.5 text-xs text-slate-500">
                  Cancel
                </button>
                <button type="submit" disabled={submittingApply} className="px-4 py-1.5 text-xs font-bold bg-brand-600 text-white rounded-lg">
                  {submittingApply ? 'Sending...' : 'Send Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
