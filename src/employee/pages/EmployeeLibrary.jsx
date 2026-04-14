import { adminAnalogLibrary } from '../data/mockData';

const EmployeeLibrary = () => {
  return (
    <div className="space-y-4">
      <div className="glass-card p-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-full bg-cyan-500/15 border border-cyan-400/35 text-cyan-200">Scan Bodies</button>
          <button className="px-4 py-2 rounded-full border border-slate-600 text-slate-300">Analogs</button>
        </div>
        <div className="flex gap-2">
          <input className="glass-input h-10 px-3" placeholder="Search" />
          <select className="glass-input h-10 px-3"><option>Brand</option></select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {adminAnalogLibrary.map((body) => (
          <article key={body.id} className="glass-card p-4">
            <div className="h-32 rounded-xl bg-[#040915] border border-cyan-400/20 mb-3" />
            <h3 className="text-slate-100 employee-heading text-base">{body.name}</h3>
            <p className="text-sm text-slate-400 mt-1">{body.brand} · {body.size}</p>
            <div className="mt-4 flex items-center justify-between">
              <button className="text-cyan-300 text-sm">Use in New Case →</button>
              <span className="text-xs px-2 py-1 rounded-full border border-slate-600 text-slate-400">Read only</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default EmployeeLibrary;
