import { Search } from 'lucide-react';
import { recentCases } from '../data/mockData';

const EmployeeMyCases = () => {
  return (
    <div className="space-y-5">
      <section className="glass-card p-4 flex flex-wrap gap-3 items-center justify-between">
        <h2 className="employee-heading text-slate-100">Case History <span className="text-cyan-300">({recentCases.length})</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full lg:w-auto">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3 top-3 text-slate-500" />
            <input className="glass-input h-10 pl-8 pr-3 w-full" placeholder="Search" />
          </div>
          <select className="glass-input h-10 px-3 w-full"><option>Status</option></select>
          <input className="glass-input h-10 px-3 w-full" type="date" />
          <button className="gradient-btn h-10 px-4 text-slate-950 font-semibold w-full">Export All</button>
        </div>
      </section>

      <section className="glass-card overflow-hidden">
        <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
          {recentCases.map((row) => (
            <article key={row.id} className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-100 font-semibold">{row.id}</p>
                <span className="text-xs px-2 py-1 rounded-full border border-cyan-400/30 text-cyan-200">{row.status}</span>
              </div>
              <p className="text-sm text-slate-300 mt-2">{row.patient} · Age {row.age}</p>
              <p className="text-xs text-slate-400 mt-1">Teeth: {row.teeth}</p>
              <p className="text-xs text-slate-400 mt-1">Scan Body: Nobel Uni 3.5</p>
              <p className="text-xs text-slate-400 mt-1">Date: {row.date}</p>
              <p className="text-xs text-cyan-300 mt-2">view / download / delete</p>
            </article>
          ))}
        </div>
        <table className="hidden md:table w-full table-fixed">
          <thead className="text-left text-xs text-slate-400">
            <tr>
              <th className="p-3">Case ID</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Age</th>
              <th className="p-3">Teeth</th>
              <th className="p-3">Scan Body</th>
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
                <td className="p-3 text-slate-300 break-words">Nobel Uni 3.5</td>
                <td className="p-3 text-slate-300 break-words">{row.date}</td>
                <td className="p-3 text-slate-300 break-words">{row.status}</td>
                <td className="p-3 text-cyan-300 break-words">view / download / delete</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default EmployeeMyCases;
