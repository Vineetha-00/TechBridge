import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge, VerifiedBadge } from '../components/common/Badge';
import {
  User, Mail, Building, GraduationCap, Briefcase,
  ShieldCheck, Upload, Award, CheckCircle2, AlertCircle, Save
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile, submitVerification } = useAuth();

  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '');
  const [interests, setInterests] = useState(user?.interests?.join(', ') || '');
  const [openToMentor, setOpenToMentor] = useState(user?.is_open_to_mentor || false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Verification upload state
  const [idCardUrl, setIdCardUrl] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');

    const res = await updateProfile({
      bio,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: interests.split(',').map(s => s.trim()).filter(Boolean),
      is_open_to_mentor: openToMentor
    });

    if (res?.success) {
      setSaveMsg('Profile updated successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    }
    setSaving(false);
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    setVerifying(true);
    const res = await submitVerification({
      id_card_url: idCardUrl || 'https://placehold.co/600x400/png?text=Verified+ID'
    });
    if (res?.success) {
      alert('Verification documents submitted to administrators!');
    }
    setVerifying(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-brand-600" />
            <span>Student & Mentor Profile</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your academic credentials, verified badges, and mentorship availability.
          </p>
        </div>

        {user?.is_verified ? (
          <VerifiedBadge label="Verified TechBridge Member" />
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Verification Pending Review
          </span>
        )}
      </div>

      {saveMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'}
            alt=""
            className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.full_name}</h2>
              <RoleBadge role={user?.role} />
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email}</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>{user?.college_name || 'Engineering College'}</span>
            </p>
            {user?.placed_company && (
              <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Placed at {user.placed_company} ({user.job_designation})</span>
              </p>
            )}
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              About Me / Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell juniors about your interests, past projects, or interview experience..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Technical Skills (Comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="C++, Python, React, DSA, PostgreSQL"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Interests & Domains
              </label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="AI/ML, Backend Systems, Competitive Programming"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Mentorship Settings for Seniors */}
          {['third_year', 'final_year', 'placed_graduate'].includes(user?.role) && (
            <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/60 flex items-center justify-between">
              <div>
                <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                  Accept Junior Mentorship Requests
                </strong>
                <p className="text-[11px] text-slate-500">
                  Allow 1st and 2nd year students to submit 1-on-1 guidance questions and schedule sessions with you.
                </p>
              </div>
              <input
                type="checkbox"
                checked={openToMentor}
                onChange={(e) => setOpenToMentor(e.target.checked)}
                className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500"
              />
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ID Verification Submission Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Identity & Credential Verification
          </h3>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          To maintain high trust, TechBridge verifies student IDs and placed graduate offer letters. Verified profiles receive verified badges across discussions and mentorship searches.
        </p>

        <form onSubmit={handleSubmitVerification} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold mb-1">
              Document URL / ID Card Link (Drive or Cloud URL)
            </label>
            <input
              type="url"
              value={idCardUrl}
              onChange={(e) => setIdCardUrl(e.target.value)}
              placeholder="https://drive.google.com/your-id-card-or-offer-letter"
              className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
          >
            {verifying ? 'Submitting...' : 'Submit Verification Document'}
          </button>
        </form>
      </div>
    </div>
  );
};
