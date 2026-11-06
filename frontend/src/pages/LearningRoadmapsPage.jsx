import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Map, Terminal, Code2, Globe, Cpu, Layers,
  Award, ArrowRight, CheckCircle2, Clock
} from 'lucide-react';

const iconMap = {
  Terminal: Terminal,
  Code2: Code2,
  Globe: Globe,
  Cpu: Cpu,
  Layers: Layers,
  Award: Award
};

export const LearningRoadmapsPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const params = {};
        if (category !== 'All') params.category = category;
        const res = await api.get('/roadmaps', { params });
        if (res.data?.success) {
          setRoadmaps(res.data.roadmaps);
        }
      } catch (err) {
        console.error('Failed to load roadmaps:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, [category]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Map className="w-6 h-6 text-brand-600" />
            <span>Interactive Learning Roadmaps</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Structured blueprints designed by seniors to guide you from first-year basics to final-year placements.
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {['All', 'year_wise', 'career', 'skill_based'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${category === cat ? 'bg-brand-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
            >
              {cat === 'All' ? 'All Roadmaps' : cat === 'year_wise' ? 'Year-wise Blueprints' : cat === 'career' ? 'Career Paths' : 'Skill Tracks'}
            </button>
          ))}
        </div>
      </div>

      {/* Roadmaps Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {roadmaps.map((r) => {
            const Icon = iconMap[r.icon_name] || Terminal;
            return (
              <div
                key={r.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-400 dark:hover:border-brand-600 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      {r.target_year ? `Year ${r.target_year} CSE` : r.category?.replace('_', ' ')}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{r.estimated_months} Months</span>
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                        {r.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  </div>

                  {/* Prerequisites */}
                  {r.prerequisites && r.prerequisites.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Prerequisites:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {r.prerequisites.map(p => (
                          <span key={p} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-medium">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    to={`/roadmaps/${r.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-brand-600 text-slate-800 hover:text-white dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-brand-600 transition flex items-center justify-center gap-2"
                  >
                    <span>View Milestones & Track Progress</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

