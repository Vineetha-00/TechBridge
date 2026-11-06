import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bot, Sparkles, Send, Scale, CheckCircle2, AlertTriangle,
  Lightbulb, ArrowRight, Layers, HelpCircle, BookOpen, ShieldCheck
} from 'lucide-react';

export const AICareerGuidancePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('advisor'); // 'advisor' | 'synthesizer'

  // Advisor State
  const [academicYear, setAcademicYear] = useState(user?.academic_year || 1);
  const [existingKnowledge, setExistingKnowledge] = useState(user?.skills?.join(', ') || 'C, Basic Python');
  const [interests, setInterests] = useState(user?.interests?.join(', ') || 'DSA, Web Development');
  const [careerGoals, setCareerGoals] = useState('Software Development / Placements');
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: `Hello ${user?.full_name?.split(' ')[0] || 'Student'}! I am TechBridge AI Career Advisor. 
I have access to verified experiences from our seniors at Google, Microsoft, and Amazon. 
Ask me which language to pick, how to pace your DSA, or what projects will stand out on your resume!`
    }
  ]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Synthesizer State (Unique Feature)
  const [presets, setPresets] = useState([]);
  const [synthesizerQuestion, setSynthesizerQuestion] = useState('Should I focus primarily on C++ or Java for DSA and campus placements?');
  const [senior1Name, setSenior1Name] = useState('Aravind Sharma (Google SDE-1)');
  const [senior1Advice, setSenior1Advice] = useState('Go with C++. The Standard Template Library (STL) is concise and fast for contest programming (Codeforces, LeetCode). Once you master pointers in C++, all other languages feel easy.');
  const [senior2Name, setSenior2Name] = useState('Sneha Reddy (Microsoft SDE)');
  const [senior2Advice, setSenior2Advice] = useState('I strongly recommend Java. Modern product companies build microservices in Java/Spring Boot. Java enforces clean Object-Oriented design which interviewers look for in Low-Level Design rounds.');
  const [synthesisResult, setSynthesisResult] = useState(null);
  const [synthesizing, setSynthesizing] = useState(false);

  useEffect(() => {
    // Load presets
    const fetchPresets = async () => {
      try {
        const res = await api.get('/ai/presets');
        if (res.data?.success) {
          setPresets(res.data.presets);
        }
      } catch (e) {
        // Fallback
      }
    };
    fetchPresets();
  }, []);

  const handleAskAdvisor = async (e) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    const userText = chatQuestion;
    setChatQuestion('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoadingAdvice(true);

    try {
      const res = await api.post('/ai/guidance', {
        academicYear,
        existingKnowledge,
        interests,
        careerGoals,
        question: userText
      });

      if (res.data?.success) {
        setChatMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
      }
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', text: '⚠️ Unable to connect to guidance service right now. Please try again shortly.' }
      ]);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleSynthesize = async (e) => {
    e?.preventDefault();
    setSynthesizing(true);
    setSynthesisResult(null);

    try {
      const res = await api.post('/ai/compare-advices', {
        question: synthesizerQuestion,
        studentYear: academicYear,
        studentInterests: interests,
        seniorAdvices: [
          { senior_name: senior1Name, advice_text: senior1Advice, role: 'placed_graduate' },
          { senior_name: senior2Name, advice_text: senior2Advice, role: 'placed_graduate' }
        ]
      });

      if (res.data?.success) {
        setSynthesisResult(res.data.comparison);
      }
    } catch (err) {
      alert('Failed to synthesize advice.');
    } finally {
      setSynthesizing(false);
    }
  };

  const applyPreset = (preset) => {
    setSynthesizerQuestion(preset.question);
    if (preset.advices[0]) {
      setSenior1Name(`${preset.advices[0].senior_name} (${preset.advices[0].company || 'Senior'})`);
      setSenior1Advice(preset.advices[0].advice_text);
    }
    if (preset.advices[1]) {
      setSenior2Name(`${preset.advices[1].senior_name} (${preset.advices[1].company || 'Senior'})`);
      setSenior2Advice(preset.advices[1].advice_text);
    }
    setSynthesisResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-brand-600" />
            <span>AI Career Guidance & Advice Synthesizer</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personalized CSE recommendations grounded in verified senior experiences and objective industry facts.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'advisor' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Chatbot</span>
          </button>
          <button
            onClick={() => setActiveTab('synthesizer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${activeTab === 'synthesizer' ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
          >
            <Scale className="w-3.5 h-3.5 text-brand-500" />
            <span>Senior Advice Synthesizer</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI CAREER CHATBOT */}
      {activeTab === 'advisor' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Context Controls */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-500" />
              <span>Student Profile Context</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <option value={1}>1st Year (Foundations & C/C++)</option>
                <option value={2}>2nd Year (Core CS & DSA)</option>
                <option value={3}>3rd Year (Internships & Projects)</option>
                <option value={4}>4th Year (Campus Placements & HLD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Existing Knowledge
              </label>
              <input
                type="text"
                value={existingKnowledge}
                onChange={(e) => setExistingKnowledge(e.target.value)}
                placeholder="e.g. C, Python basics"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Technical Interests
              </label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g. Web Dev, AI/ML, Cloud"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Career Goal
              </label>
              <input
                type="text"
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                placeholder="e.g. FAANG SDE, Startup Backend"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-slate-400 block leading-normal">
                AI tailors responses specifically to your year and cross-references verified senior placement benchmarks.
              </span>
            </div>
          </div>

          {/* Right Chat Window */}
          <div className="lg:col-span-3 flex flex-col h-[580px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white shadow-sm flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line shadow-sm ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-none'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loadingAdvice && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white flex-shrink-0 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 italic flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></div>
                    <span>Consulting senior benchmarks and generating tailored recommendations...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions Pills */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
              <span className="text-slate-400 font-medium whitespace-nowrap">Suggested:</span>
              <button
                onClick={() => setChatQuestion("Should I learn C++ or Java for my 1st year?")}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-600 dark:text-slate-300 whitespace-nowrap"
              >
                C++ vs Java?
              </button>
              <button
                onClick={() => setChatQuestion("How many LeetCode questions are enough for Google/Amazon internships?")}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-600 dark:text-slate-300 whitespace-nowrap"
              >
                How many LeetCode questions?
              </button>
              <button
                onClick={() => setChatQuestion("What resume projects impress tech recruiters for WebDev & AI?")}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-600 dark:text-slate-300 whitespace-nowrap"
              >
                Best resume projects?
              </button>
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={handleAskAdvisor} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
              <input
                type="text"
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                placeholder="Ask about programming languages, roadmaps, or placement preparation..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={loadingAdvice || !chatQuestion.trim()}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 disabled:opacity-50 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: SENIOR ADVICE SYNTHESIZER (UNIQUE FEATURE) */}
      {activeTab === 'synthesizer' && (
        <div className="space-y-6">
          {/* Explanatory Banner */}
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60">
            <div className="flex items-start gap-3">
              <Scale className="w-5 h-5 text-brand-600 dark:text-brand-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Contradictory Senior Advice Synthesizer & Fact-Checker
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Juniors frequently receive conflicting suggestions from different seniors (e.g. "Grind 600 LeetCode" vs "Build 3 full-stack projects", or "C++ is superior" vs "Java is industry standard").
                  This AI engine analyzes those viewpoints, extracts common truths, explains objective tradeoffs, separates personal bias from verified facts, and builds your tailored action plan.
                </p>
              </div>
            </div>

            {/* Presets */}
            {presets.length > 0 && (
              <div className="mt-4 pt-3 border-t border-blue-200/60 dark:border-slate-700 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">Quick Test Scenarios:</span>
                {presets.map(p => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-brand-700 dark:text-brand-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 transition"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Form: Question & 2 Senior Advices */}
          <form onSubmit={handleSynthesize} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Your Core Dilemma / Question
              </label>
              <input
                type="text"
                value={synthesizerQuestion}
                onChange={(e) => setSynthesizerQuestion(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Senior 1 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Senior 1 (Source / Persona)
                </label>
                <input
                  type="text"
                  value={senior1Name}
                  onChange={(e) => setSenior1Name(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-slate-800 font-medium"
                />
                <textarea
                  rows={4}
                  value={senior1Advice}
                  onChange={(e) => setSenior1Advice(e.target.value)}
                  required
                  placeholder="Paste advice from Senior 1..."
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-slate-800"
                />
              </div>

              {/* Senior 2 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Senior 2 (Source / Persona)
                </label>
                <input
                  type="text"
                  value={senior2Name}
                  onChange={(e) => setSenior2Name(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-slate-800 font-medium"
                />
                <textarea
                  rows={4}
                  value={senior2Advice}
                  onChange={(e) => setSenior2Advice(e.target.value)}
                  required
                  placeholder="Paste conflicting advice from Senior 2..."
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={synthesizing}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/20 disabled:opacity-50 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{synthesizing ? 'Synthesizing Perspectives...' : 'Analyze & Synthesize Advice'}</span>
              </button>
            </div>
          </form>

          {/* Synthesis Output Report */}
          {synthesisResult && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800/60 shadow-lg space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  TechBridge Synthesis & Verification Report
                </h3>
              </div>

              {/* 1. Common Recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Common Recommendations (Where Both Seniors Agree)</span>
                </h4>
                <ul className="space-y-1.5 pl-5 list-disc text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {synthesisResult.common_recommendations?.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>

              {/* 2. Differences Explained */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  <span>2. Differences & Tradeoffs Explained</span>
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 bg-blue-50/50 dark:bg-blue-950/20 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40 leading-relaxed">
                  {synthesisResult.differences_explained}
                </p>
              </div>

              {/* 3. Facts vs Personal Opinions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  <span>3. Verified Facts vs. Personal Opinions</span>
                </h4>
                <div className="space-y-2">
                  {synthesisResult.facts_vs_opinions?.map((item, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border text-xs leading-relaxed ${item.type === 'verified_fact' ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.type === 'verified_fact' ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200'}`}>
                          {item.type === 'verified_fact' ? 'Verified Fact' : 'Personal Opinion / Bias'}
                        </span>
                        <strong className="text-slate-900 dark:text-white">"{item.statement}"</strong>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1 pl-1">
                        💡 {item.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Action Plan for Student */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4" />
                  <span>4. Personalized Action Plan for Year {academicYear}</span>
                </h4>
                <div className="space-y-2">
                  {synthesisResult.personalized_action_plan?.map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
                      <span className="w-5 h-5 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                        {i + 1}
                      </span>
                      <span className="text-slate-800 dark:text-slate-200 leading-normal">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
