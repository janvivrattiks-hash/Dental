import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api, { notifyError } from '../../Script/api';

const STATUS_CLASS = {
  completed: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30',
  processing: 'bg-violet-500/20 text-violet-200 border-violet-400/30',
  pending: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
  failed: 'bg-red-500/20 text-red-200 border-red-400/30',
};

const EmployeeMyCases = () => {
  const [cases, setCases] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const loadCases = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await api.employee.cases.list(params);
      setCases(res.data?.data || []);
      setTotal(res.data?.pagination?.total || 0);
    } catch (err) {
      notifyError('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [page, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadCases();
  };

  const exportAll = () => {
    const csv = [
      ['Case ID', 'Patient', 'Age', 'Date', 'Status'].join(','),
      ...cases.map((c) => [c.case_reference, c.patient_name, c.patient_age, c.case_date, c.status].join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cases.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <section className="glass-card p-4 flex flex-wrap gap-3 items-center justify-between">
        <h2 className="employee-heading text-slate-100">
          Case History <span className="text-cyan-300">({total})</span>
        </h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full lg:w-auto">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3 top-3 text-slate-500" />
            <input
              className="glass-input h-10 pl-8 pr-3 w-full"
              placeholder="Search patient"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="glass-input h-10 px-3 w-full"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <button type="submit" className="glass-input h-10 px-3 w-full text-cyan-300 text-sm">Search</button>
          <button type="button" onClick={exportAll} className="gradient-btn h-10 px-4 text-slate-950 font-semibold w-full">Export CSV</button>
        </form>
      </section>

      <section className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-slate-400 text-sm">Loading cases...</div>
        ) : cases.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No cases found.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
              {cases.map((row) => (
                <article key={row.id} className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-100 font-semibold">{row.case_reference}</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_CLASS[row.status] || 'border-slate-600 text-slate-400'}`}>{row.status}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-2">{row.patient_name} · Age {row.patient_age}</p>
                  <p className="text-xs text-slate-400 mt-1">Teeth: {(row.teeth || []).map((t) => t.tooth_number).join(', ') || '—'}</p>
                  <p className="text-xs text-slate-400 mt-1">Date: {row.case_date || '—'}</p>
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
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Notes</th>
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
                      <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_CLASS[row.status] || 'border-slate-600 text-slate-400'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 break-words text-xs">{row.doctor_notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      {total > 20 && (
        <div className="flex items-center justify-center gap-3">
          <button
            className="glass-input h-9 px-4 text-sm text-slate-300 disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </button>
          <span className="text-sm text-slate-400">Page {page}</span>
          <button
            className="glass-input h-9 px-4 text-sm text-slate-300 disabled:opacity-40"
            disabled={cases.length < 20}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeMyCases;
