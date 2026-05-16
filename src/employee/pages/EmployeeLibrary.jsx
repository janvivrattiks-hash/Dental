import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../Script/api';

const PAGE_SIZE = 12;

const Skeleton = () => (
  <div className="glass-card p-4 animate-pulse space-y-3">
    <div className="h-32 rounded-xl bg-slate-800/60" />
    <div className="h-4 rounded bg-slate-700/60 w-3/4" />
    <div className="h-3 rounded bg-slate-700/40 w-1/2" />
  </div>
);

const EmployeeLibrary = () => {
  const navigate = useNavigate();

  const [libraries, setLibraries] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const debounceRef = useRef(null);

  // Load brands once
  useEffect(() => {
    api.all_libraries.brands()
      .then((res) => setBrands(res.data?.data ?? []))
      .catch(() => {});
  }, []);

  const loadLibraries = useCallback(async (searchVal, brand, pageNum) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: pageNum, size: PAGE_SIZE };
      if (searchVal) params.search = searchVal;
      if (brand) params.company_name = brand;
      const res = await api.all_libraries.list(params);
      const payload = res.data;
      setLibraries(payload?.data ?? []);
      setTotal(payload?.total ?? 0);
      setTotalPages(payload?.pages ?? 1);
    } catch {
      setError('Could not load libraries. Please try again.');
      setLibraries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadLibraries('', '', 1);
  }, [loadLibraries]);

  // Debounced search
  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadLibraries(value, selectedBrand, 1);
    }, 400);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setPage(1);
    loadLibraries(search, brand, 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    loadLibraries(search, selectedBrand, newPage);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="text-sm text-slate-400">
          {total > 0 ? `${total} librar${total === 1 ? 'y' : 'ies'} found` : 'No libraries'}
        </div>
        <div className="flex gap-2 flex-wrap">
          <input
            className="glass-input h-10 px-3 min-w-[180px]"
            placeholder="Search by brand…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <select
            className="glass-input h-10 px-3"
            value={selectedBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          {(search || selectedBrand) && (
            <button
              className="h-10 px-3 rounded-xl border border-slate-600 text-slate-300 text-sm hover:border-slate-500"
              onClick={() => { setSearch(''); setSelectedBrand(''); setPage(1); loadLibraries('', '', 1); }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 text-rose-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => <Skeleton key={i} />)
          : libraries.length === 0
          ? (
            <div className="col-span-full text-center text-slate-400 py-12">
              No libraries match your filters.
            </div>
          )
          : libraries.map((lib) => (
            <article key={lib.id} className="glass-card p-4 flex flex-col">
              <div className="h-32 rounded-xl bg-[#040915] border border-cyan-400/20 mb-3 grid place-content-center text-slate-600 text-xs">
                3D preview
              </div>
              <h3 className="text-slate-100 employee-heading text-base">{lib.company_name}</h3>
              <p className="text-sm text-slate-400 mt-1">
                {lib.manufacturer_id || 'N/A'} · {lib.angle_alignment}°
              </p>
              <p className="text-xs text-slate-500 mt-1">Tolerance: {lib.tolerance_degree}°</p>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <button
                  className="text-cyan-300 text-sm hover:text-cyan-200"
                  onClick={() => navigate('/new-case')}
                >
                  Use in New Case →
                </button>
                <span className="text-xs px-2 py-1 rounded-full border border-slate-600 text-slate-400">
                  Admin
                </span>
              </div>
            </article>
          ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="h-9 w-9 rounded-full border border-slate-600 text-slate-300 grid place-content-center disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-slate-400">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="h-9 w-9 rounded-full border border-slate-600 text-slate-300 grid place-content-center disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeLibrary;
