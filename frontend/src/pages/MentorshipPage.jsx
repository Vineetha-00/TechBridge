import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RoleBadge, VerifiedBadge } from '../components/common/Badge';
import {
  Users2, Calendar, MessageSquare, Search, Filter,
  CheckCircle2, Clock, Video, Send, X, ExternalLink,
  Sparkles, Award
} from 'lucide-react';

export const MentorshipPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'requests' | 'sessions'
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  // Request modal state
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestTopic, setRequestTopic] = useState('');
  const [requestMsg, setRequestMsg] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);

  // Schedule session modal
  const [scheduleModalReq, setScheduleModalReq] = useState(null);
  const [sessionTime, setSessionTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/tb-mentor-session');
  const [sessionNotes, setSessionNotes] = useState('');

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/mentors', {
        params: { search, company: companyFilter }
      });
      if (res.data?.success) {
        setMentors(res.data.mentors);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestsAndSessions = async () => {
    try {
      const [reqRes, sesRes] = await Promise.all([
        api.get('/mentorship/requests'),
        api.get('/mentorship/sessions')
      ]);
      if (reqRes.data?.success) setRequests(reqRes.data.requests);
      if (sesRes.data?.success) setSessions(sesRes.data.sessions);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMentors();
    fetchRequestsAndSessions();
  }, [companyFilter, user]);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!selectedMentor || !requestTopic || !requestMsg) return;

    setSubmittingReq(true);
    try {
      const res = await api.post('/mentorship/requests', {
        mentor_id: selectedMentor.id,
        topic: requestTopic,
        message: requestMsg
      });
      if (res.data?.success) {
        alert('Mentorship request sent! The senior mentor has been notified.');
        setSelectedMentor(null);
        setRequestTopic('');
        setRequestMsg('');
        fetchRequestsAndSessions();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request.');
    } finally {
      setSubmittingReq(false);
    }
  };

  const handleUpdateStatus = async (reqId, status) => {
    try {
      const res = await api.patch(`/mentorship/requests/${reqId}/status`, { status });
      if (res.data?.success) {
        fetchRequestsAndSessions();
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleScheduleSession = async (e) => {
    e.preventDefault();
    if (!scheduleModalReq || !sessionTime) return;

    try {
      const res = await api.post('/mentorship/sessions', {
        request_id: scheduleModalReq.id,
        scheduled_time: new Date(sessionTime).toISOString(),
        meeting_link: meetingLink,
        notes: sessionNotes
      });
      if (res.data?.success) {
        alert('Session scheduled successfully!');
        setScheduleModalReq(null);
        fetchRequestsAndSessions();
      }
    } catch (err) {
      alert('Failed to schedule session.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users2 className="w-6 h-6 text-brand-600" />
            <span>Senior Mentorship & 1-on-1 Sessions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect directly with verified final-year students and placed engineers at Google, Microsoft, and Amazon.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'browse' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Find Mentors
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition relative ${activeTab === 'requests' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'sessions' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            My Sessions ({sessions.length})
          </button>
        </div>
      </div>

      {/* TAB 1: BROWSE MENTORS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchMentors()}
                placeholder="Search mentors by name, skills (e.g. C++, LeetCode, Azure)..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['All', 'Google', 'Microsoft', 'Amazon'].map((comp) => (
                <button
                  key={comp}
                  onClick={() => setCompanyFilter(comp === 'All' ? '' : comp)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${(comp === 'All' && !companyFilter) || companyFilter === comp ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>

          {/* Mentors Grid */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((m) => (
                <div
                  key={m.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 transition flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={m.avatar_url} alt={m.full_name} className="w-12 h-12 rounded-xl object-cover border" />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {m.full_name}
                          </h3>
                          {m.placed_company ? (
                            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 block">
                              {m.job_designation || 'Engineer'} @ {m.placed_company}
                            </span>
                          ) : (
                            <RoleBadge role={m.role} showIcon={false} className="text-[10px]" />
                          )}
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {m.college_name?.split('(')[0]}
                          </span>
                        </div>
                      </div>
                      <VerifiedBadge label="Verified" className="text-[10px]" />
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed line-clamp-3">
                      {m.bio}
                    </p>

                    {/* Mentor Topics */}
                    {m.mentor_topics && m.mentor_topics.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Mentorship Topics
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {m.mentor_topics.map(t => (
                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-medium border border-brand-200 dark:border-brand-800">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedMentor(m)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Request 1-on-1 Guidance</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Users2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">No mentorship requests</h3>
              <p className="text-xs text-slate-500 mt-1">Browse verified seniors and submit a guidance request.</p>
            </div>
          ) : (
            requests.map((r) => {
              const isMentorForThis = r.mentor_id === user?.id;
              return (
                <div key={r.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                        {isMentorForThis ? `From Mentee: ${r.mentee_name}` : `To Mentor: ${r.mentor_name}`}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        Topic: {r.topic}
                      </h4>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase text-[10px] ${r.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : r.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                      {r.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                    "{r.message}"
                  </p>

                  {/* Actions for Senior Mentor */}
                  {isMentorForThis && r.status === 'pending' && (
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleUpdateStatus(r.id, 'accepted')}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(r.id, 'rejected')}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {isMentorForThis && r.status === 'accepted' && (
                    <div className="pt-2">
                      <button
                        onClick={() => setScheduleModalReq(r)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white inline-flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Video Call Session</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: SCHEDULED SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">No scheduled sessions</h3>
              <p className="text-xs text-slate-500 mt-1">Once a mentor accepts your request, your scheduled meeting links will appear here.</p>
            </div>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Video className="w-4 h-4 text-brand-600" />
                      <span>1-on-1 Mentorship Session with {s.mentor_name}</span>
                    </h4>
                    <span className="text-xs text-slate-500">Mentee: {s.mentee_name}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-brand-700 dark:bg-blue-950 dark:text-blue-300">
                    {s.duration_minutes || 45} mins
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(s.scheduled_time).toLocaleString()}</span>
                  </div>
                </div>

                {s.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg">
                    Notes: {s.notes}
                  </p>
                )}

                <div className="pt-2">
                  <a
                    href={s.meeting_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                  >
                    <span>Join Video Call</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Request Mentorship Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Request Mentorship from {selectedMentor.full_name}
              </h3>
              <button onClick={() => setSelectedMentor(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic of Guidance
                </label>
                <input
                  type="text"
                  value={requestTopic}
                  onChange={(e) => setRequestTopic(e.target.value)}
                  required
                  placeholder="e.g. Google Interview Strategy & Resume Review"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Introduce yourself & your specific questions
                </label>
                <textarea
                  rows={4}
                  value={requestMsg}
                  onChange={(e) => setRequestMsg(e.target.value)}
                  required
                  placeholder="Mention your academic year, current DSA/Tech status, and what specific advice you need from this senior..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="px-4 py-2 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReq}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md disabled:opacity-50"
                >
                  {submittingReq ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Session Modal */}
      {scheduleModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Schedule Session for {scheduleModalReq.mentee_name}
            </h3>
            <form onSubmit={handleScheduleSession} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Link (Google Meet / Zoom)
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preparation Notes for Mentee
                </label>
                <textarea
                  rows={3}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="e.g. Please bring your GitHub profile and resume draft..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setScheduleModalReq(null)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-brand-600 text-white rounded-lg"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
