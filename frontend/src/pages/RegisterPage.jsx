import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';
import { Sparkles, ArrowRight, ShieldCheck, Upload, AlertCircle, Building, GraduationCap, Briefcase } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'first_year',
    college_name: 'National Institute of Technology (NIT)',
    academic_year: '1',
    branch: 'Computer Science and Engineering',
    student_id_number: '',
    college_email: '',
    placed_company: '',
    job_designation: '',
    package_lpa: '',
    skills: 'C, Python, HTML/CSS',
    interests: 'DSA, Web Development'
  });

  const [idCardFile, setIdCardFile] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'role') {
        if (value === 'first_year') updated.academic_year = '1';
        if (value === 'second_year') updated.academic_year = '2';
        if (value === 'third_year') updated.academic_year = '3';
        if (value === 'final_year' || value === 'placed_graduate') updated.academic_year = '4';
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const payload = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      academic_year: Number(formData.academic_year)
    };

    const res = await register(payload);
    if (res.success) {
      setSuccessMsg(res.message || 'Registration successful! Directing to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Join TechBridge Platform</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Create your student or mentor profile. ID and company proofs are verified to maintain an authentic community.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 text-xs text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User Role Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Your Role in TechBridge
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.values(USER_ROLES).map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, role: r.key }))}
                    className={`p-2.5 rounded-xl border text-left transition ${formData.role === r.key ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                    <span className="text-xs block leading-tight">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rahul Gupta"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  College / University
                </label>
                <input
                  type="text"
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleChange}
                  placeholder="e.g. National Institute of Technology (NIT)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Placed Graduate Specific Fields */}
            {formData.role === 'placed_graduate' && (
              <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-800 dark:text-purple-300">
                  <Briefcase className="w-4 h-4" />
                  <span>Placed Graduate Verification Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Company</label>
                    <input
                      type="text"
                      name="placed_company"
                      value={formData.placed_company}
                      onChange={handleChange}
                      placeholder="e.g. Google, Microsoft, Amazon"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                    <input
                      type="text"
                      name="job_designation"
                      value={formData.job_designation}
                      onChange={handleChange}
                      placeholder="e.g. SDE-1 / Software Engineer"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Package (LPA)</label>
                    <input
                      type="number"
                      step="0.5"
                      name="package_lpa"
                      value={formData.package_lpa}
                      onChange={handleChange}
                      placeholder="e.g. 42.5"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ID Proof / Document Simulation */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-center">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Student ID Card / College Identity Verification
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload image or PDF proof. Administrators verify this to grant verified badge.
              </p>
              <input
                type="file"
                onChange={(e) => setIdCardFile(e.target.files[0]?.name || 'id_card.png')}
                className="mt-2 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              />
              {idCardFile && (
                <span className="block mt-1 text-[11px] text-brand-600 font-medium">Selected: {idCardFile}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Complete Registration'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
