import { useEffect, useState } from 'react';
import { CirclePlay, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../Script/api';

const STATUS_CLASS = {
  completed: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30',
  processing: 'bg-violet-500/20 text-violet-200 border-violet-400/30',
  pending: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
  failed: 'bg-red-500/20 text-red-200 border-red-400/30',
  deleted: 'bg-slate-500/20 text-slate-400 border-slate-600',
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, plan: 'free' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const [casesRes, planRes] = await Promise.all([
          api.employee.cases.list({ page: 1, limit: 10 }),
          api.employee.subscription.myPlan(),
        ]);

        if (!mounted) return;

        const caseList = casesRes.data?.data || [];
        const planData = planRes.data?.data || {};

        setCases(caseList);
        setStats({
          total: casesRes.data?.pagination?.total || caseList.length,
          completed: caseList.filter((c) => c.status === 'completed').length,
          pending: caseList.filter((c) => c.status === 'pending').length,
          plan: planData.display_name || 'Free',
          casesUsed: planData.cases_used_this_month || 0,
          casesLimit: planData.cases_limit === -1 ? '∞' : planData.cases_limit,
        });
      } catch {
        // silently fall back to empty state
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const statCards = [
    { label: 'Total Cases', value: stats.total },
    { label: 'Completed', value: stats.completed },
    { label: 'In Progress', value: stats.pending },
    { label: 'Plan', value: stats.plan },
  ];

  return (
    <div className="space-y-6">
      <section className="glass-card p-5 border-l-4 border-cyan-400 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="employee-heading text-xl text-slate-100">Good morning, Doctor 👋</h2>
          <p className="text-slate-400 mt-1">
            {loading ? 'Loading cases...' : `${stats.pending} case${stats.pending !== 1 ? 's' : ''} in progress`}
          </p>
        </div>
        <button onClick={() => navigate('/new-case')} className="gradient-btn h-11 px-6 text-slate-950 font-semibold inline-flex items-center gap-2">
          <Plus size={16} /> New Case
        </button>
      </section>

      <section className="glass-card p-5">
        <div className="aspect-video rounded-xl border border-cyan-400/20 bg-[#040915] relative overflow-hidden">
          <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" className="absolute inset-0 grid place-content-center">
            <div className="h-14 w-14 rounded-full bg-cyan-500/20 border border-cyan-300/50 grid place-content-center text-cyan-200">
              <CirclePlay size={28} />
            </div>
          </a>
          <div className="absolute left-4 top-4">
            <h3 className="text-slate-100 employee-heading">How MyPathFinder Works - Step by Step Guide</h3>
            <p className="text-xs text-slate-400">Watch before starting your first case</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <p className="text-xs text-slate-400">{stat.label}</p>
            <p className="employee-heading text-2xl text-cyan-200 mt-2">
              {loading ? '…' : stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-cyan-400/10 flex items-center justify-between">
          <h3 className="employee-heading text-slate-100">Recent Cases</h3>
          {stats.casesUsed !== undefined && (
            <p className="text-xs text-slate-400">
              {stats.casesUsed} of {stats.casesLimit} cases used this month
            </p>
          )}
        </div>

        {loading ? (
          <div className="p-6 text-center text-slate-400 text-sm">Loading cases...</div>
        ) : cases.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">
            No cases yet.{' '}
            <button onClick={() => navigate('/new-case')} className="text-cyan-300 underline">Create your first case</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
              {cases.map((row) => (
                <article key={row.id} className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-100 font-semibold">{row.case_reference}</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_CLASS[row.status] || STATUS_CLASS.pending}`}>{row.status}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-2">{row.patient_name} · Age {row.patient_age}</p>
                  <p className="text-xs text-slate-400 mt-1">Teeth: {(row.teeth || []).map((t) => t.tooth_number).join(', ') || '—'}</p>
                  <p className="text-xs text-slate-400 mt-1">Date: {row.case_date || '—'}</p>
                </article>
              ))}
            </div>
            <div className="hidden md:block">
              <table className="w-full table-fixed">
                <thead className="text-left text-xs text-slate-400">
                  <tr>
                    <th className="p-3">Case ID</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Age</th>
                    <th className="p-3">Teeth</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((row) => (
                    <tr key={row.id} className="border-t border-cyan-400/10 hover:bg-cyan-500/5">
                      <td className="p-3 text-slate-200 break-words">{row.case_reference}</td>
                      <td className="p-3 text-slate-300 break-words">{row.patient_name}</td>
                      <td className="p-3 text-slate-300">{row.patient_age}</td>
                      <td className="p-3 text-slate-300 break-words">{(row.teeth || []).map((t) => t.tooth_number).join(', ') || '—'}</td>
                      <td className="p-3 text-slate-300 break-words">{row.case_date || '—'}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_CLASS[row.status] || STATUS_CLASS.pending}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default EmployeeDashboard;
