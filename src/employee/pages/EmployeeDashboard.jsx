import { CirclePlay, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { employeeStats, recentCases } from '../data/mockData';

const statusClass = {
  Completed: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30',
  'In Progress': 'bg-violet-500/20 text-violet-200 border-violet-400/30',
  Pending: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <section className="glass-card p-5 border-l-4 border-cyan-400 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="employee-heading text-xl text-slate-100">Good morning, Doctor 👋</h2>
          <p className="text-slate-400 mt-1">3 cases in progress</p>
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
        {employeeStats.map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <p className="text-xs text-slate-400">{stat.label}</p>
            <p className="employee-heading text-2xl text-cyan-200 mt-2">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-cyan-400/10">
          <h3 className="employee-heading text-slate-100">Recent Cases</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
          {recentCases.map((row) => (
            <article key={row.id} className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-100 font-semibold">{row.id}</p>
                <span className={`text-xs px-2 py-1 rounded-full border ${statusClass[row.status]}`}>{row.status}</span>
              </div>
              <p className="text-sm text-slate-300 mt-2">{row.patient} · Age {row.age}</p>
              <p className="text-xs text-slate-400 mt-1">Teeth: {row.teeth}</p>
              <p className="text-xs text-slate-400 mt-1">Date: {row.date}</p>
              <p className="text-xs text-cyan-300 mt-2">view / download / delete</p>
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
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((row) => (
                <tr key={row.id} className="border-t border-cyan-400/10 hover:bg-cyan-500/5">
                  <td className="p-3 text-slate-200 break-words">{row.id}</td>
                  <td className="p-3 text-slate-300 break-words">{row.patient}</td>
                  <td className="p-3 text-slate-300">{row.age}</td>
                  <td className="p-3 text-slate-300 break-words">{row.teeth}</td>
                  <td className="p-3 text-slate-300 break-words">{row.date}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full border ${statusClass[row.status]}`}>{row.status}</span></td>
                  <td className="p-3 text-cyan-300 text-sm break-words">view / download / delete</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default EmployeeDashboard;
