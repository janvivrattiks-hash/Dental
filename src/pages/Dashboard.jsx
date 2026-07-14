import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Calendar,
    Search,
    Plus,
    CreditCard,
    Download,
    TrendingUp,
    Microscope,
    Tablet
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { cn } from '../utils/utils';
import AddLibraryModal from '../components/modals/AddLibraryModal';
import CreatePlanModal from '../components/modals/CreatePlanModal';
import api from '../Script/api';

const getCollection = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
};

const Dashboard = () => {
    const [isAddLibraryModalOpen, setIsAddLibraryModalOpen] = useState(false);
    const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
    const [libraries, setLibraries] = useState([]);
    const [libraryError, setLibraryError] = useState('');
    const [planModalError, setPlanModalError] = useState('');
    const [isSavingPlan, setIsSavingPlan] = useState(false);
    const [stats, setStats] = useState(null);
    const [statsError, setStatsError] = useState('');

    const loadStats = async () => {
        setStatsError('');
        try {
            const response = await api.admin.dashboardStats();
            setStats(response.data?.data ?? null);
        } catch (err) {
            setStatsError(err.response?.data?.detail || err.response?.data?.message || 'Failed to load stats.');
        }
    };

    const scanActivity = stats?.recent_activity ?? [];

    const loadLibraries = async () => {
        setLibraryError('');

        try {
            const response = await api.libraries.list();
            setLibraries(getCollection(response.data));
        } catch (err) {
            setLibraryError(err.response?.data?.detail || err.response?.data?.message || 'Failed to load libraries.');
        }
    };

    useEffect(() => {
        loadLibraries();
        loadStats();
    }, []);

    const formatCount = (value) => (value == null ? '—' : Number(value).toLocaleString());

    const handleCreatePlan = async (payload) => {
        setPlanModalError('');
        setIsSavingPlan(true);

        try {
            await api.plans.create(payload);
            setIsCreatePlanModalOpen(false);
        } catch (err) {
            setPlanModalError(err.response?.data?.detail || err.response?.data?.message || 'Failed to create plan.');
        } finally {
            setIsSavingPlan(false);
        }
    };

    return (
        <div className="p-6 lg:p-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl lg:text-[32px] font-bold text-slate-900 tracking-tight leading-none mb-2">System Overview</h1>
                    <p className="text-slate-500 font-medium text-sm lg:text-base">Real-time clinical analysis & platform monitoring</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                    <div className="flex-1 lg:w-80 relative min-w-[200px]">
                        <Input
                            placeholder="Search clinics or users..."
                            icon={Search}
                            className="bg-white border-slate-100 shadow-sm h-11 lg:h-12 rounded-xl w-full"
                        />
                    </div>

                    <button className="flex items-center gap-2 px-4 lg:px-6 h-11 lg:h-12 bg-white border border-slate-100 rounded-xl text-slate-900 font-bold text-sm lg:text-base shadow-sm hover:border-[#0d9488]/30 transition-all">
                        <Calendar size={18} className="text-slate-400" />
                        <span>Last 30 Days</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 group hover:translate-y-[-4px] transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-clinical-blue/10 rounded-xl flex items-center justify-center text-clinical-blue group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
                    <h2 className="text-2xl lg:text-[28px] font-extrabold text-slate-900">{formatCount(stats?.total_users)}</h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 group hover:translate-y-[-4px] transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-[#eefcfb] rounded-xl flex items-center justify-center text-[#0d9488] group-hover:scale-110 transition-transform">
                            <Tablet size={24} />
                        </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Subscriptions</p>
                    <h2 className="text-2xl lg:text-[28px] font-extrabold text-slate-900">{formatCount(stats?.active_subscriptions)}</h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 group hover:translate-y-[-4px] transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-clinical-blue/10 rounded-xl flex items-center justify-center text-clinical-blue group-hover:scale-110 transition-transform">
                            <Microscope size={24} />
                        </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Scans</p>
                    <h2 className="text-2xl lg:text-[28px] font-extrabold text-slate-900">{formatCount(stats?.total_scans)}</h2>
                </div>


            </div>

            {/* Quick Actions */}
            <div className="mb-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Quick Actions</h3>
                <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                    <Button
                        onClick={() => setIsAddLibraryModalOpen(true)}
                        className="h-12 lg:h-14 px-6 lg:px-8 bg-white border-slate-100 text-[#0d9488] rounded-xl font-bold flex items-center gap-3 shadow-sm hover:bg-slate-50 transition-all text-sm lg:text-base">
                        <Plus size={18} className="p-0.5 bg-slate-100 rounded-md" />
                        Add Library
                    </Button>
                    <Button
                        onClick={() => setIsCreatePlanModalOpen(true)}
                        className="h-12 lg:h-14 px-6 lg:px-8 bg-white border-slate-100 text-[#0d9488] rounded-xl font-bold flex items-center gap-3 shadow-sm hover:bg-slate-50 transition-all text-sm lg:text-base"
                    >
                        <Plus size={18} className="p-0.5 bg-slate-100 rounded-md" />
                        Add Plan
                    </Button>
                    <Link to="/payments">
                        <Button variant="outline" className="h-12 lg:h-14 px-6 lg:px-8 bg-white border-slate-100 text-[#0d9488] rounded-xl font-bold flex items-center gap-3 shadow-sm hover:bg-slate-50 transition-all text-sm lg:text-base">
                            <CreditCard size={18} />
                            View Payments
                        </Button>
                    </Link>
                    <Button variant="outline" className="h-12 lg:h-14 px-6 lg:px-8 bg-white border-slate-100 text-slate-700 rounded-xl font-bold flex items-center gap-3 shadow-sm hover:bg-slate-50 transition-all text-sm lg:text-base">
                        <Download size={18} className="text-slate-400" />
                        Export Reports
                    </Button>
                </div>
            </div>

            {/* Two Column Layout: Activity & Trends */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column: Activity Table */}
                <div className="xl:col-span-2 bg-white rounded-2xl lg:rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-50 overflow-hidden h-fit">
                    <div className="p-6 lg:p-8 flex items-center justify-between border-b border-slate-50">
                        <h3 className="text-lg lg:text-xl font-bold text-slate-900">Recent Scan Activity</h3>
                        <Link to="/users" className="text-[13px] font-bold text-[#0d9488] hover:underline transition-all">View All</Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                                    <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient / Case</th>
                                    <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Teeth</th>
                                    <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statsError ? (
                                    <tr><td colSpan={5} className="px-8 py-10 text-center text-sm font-medium text-rose-600">{statsError}</td></tr>
                                ) : scanActivity.length === 0 ? (
                                    <tr><td colSpan={5} className="px-8 py-12 text-center text-sm font-medium text-slate-400">No recent scan activity.</td></tr>
                                ) : scanActivity.map((scan) => (
                                    <tr key={scan.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b border-slate-50 whitespace-nowrap">
                                        <td className="px-6 lg:px-8 py-4 lg:py-6">
                                            <div className="flex items-center gap-3 lg:gap-4">
                                                <div className="w-9 lg:w-10 h-9 lg:h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-white shadow-sm flex-shrink-0">
                                                    {(scan.user || scan.user_email || '?').slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 leading-none truncate">{scan.user || 'Unknown'}</p>
                                                    <p className="text-[11px] font-semibold text-slate-400 mt-1.5 truncate">{scan.user_email || '—'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-8 py-4 lg:py-6">
                                            <p className="text-sm font-bold text-slate-700 leading-none">{scan.patient_name || '—'}</p>
                                            <p className="text-[11px] font-semibold text-slate-400 mt-1.5">{scan.case_reference}</p>
                                        </td>
                                        <td className="px-6 lg:px-8 py-4 lg:py-6 text-center text-sm font-bold text-slate-900">{scan.teeth_count ?? 0}</td>
                                        <td className="px-6 lg:px-8 py-4 lg:py-6">
                                            <div className="flex justify-center">
                                                <span className={cn(
                                                    "text-[10px] px-2.5 py-1.5 rounded-lg font-black tracking-widest whitespace-nowrap",
                                                    scan.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" :
                                                        scan.status === 'PROCESSING' ? "bg-amber-50 text-amber-600" :
                                                            scan.status === 'PENDING' ? "bg-slate-100 text-slate-500" :
                                                                "bg-rose-50 text-rose-600"
                                                )}>
                                                    {scan.status || 'PENDING'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-8 py-4 lg:py-6 text-right">
                                            <p className="text-[12px] font-bold text-slate-500 leading-none">
                                                {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : '—'}
                                            </p>
                                            <p className="text-[11px] font-bold text-slate-400 mt-1.5">
                                                {scan.created_at ? new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Top Implant Libraries */}
                <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-50 p-6 lg:p-10 h-fit">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-lg lg:text-xl font-bold text-slate-900">Implant Libraries</h3>
                        <Link to="/library" className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                            <TrendingUp size={18} className="text-[#0d9488]" />
                        </Link>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8">Top Implant Libraries</h4>
                        {libraryError ? (
                            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                                {libraryError}
                            </div>
                        ) : null}
                        <div className="space-y-5 lg:space-y-6">
                            {(libraries.length ? libraries.slice(0, 3) : [{ id: 'empty-state', company_name: 'No libraries found', manufacturer_id: 'Create one from Add Library' }]).map((lib, index) => (
                                <div key={lib.id || lib.company_name} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-3 lg:p-4 -m-3 lg:-m-4 rounded-xl transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={cn('w-2 h-2 rounded-full', index === 0 ? 'bg-[#0d9488]' : index === 1 ? 'bg-[#14b8a6]' : 'bg-clinical-blue')}></div>
                                        <span className="text-sm lg:text-[15px] font-bold text-slate-700 group-hover:text-[#0d9488] transition-colors">{lib.company_name}</span>
                                    </div>
                                    <span className="text-sm lg:text-[14px] font-extrabold text-slate-900">{lib.manufacturer_id || 'No manufacturer id'} <span className="text-slate-400 text-xs font-bold">id</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <AddLibraryModal
                isOpen={isAddLibraryModalOpen}
                onClose={() => setIsAddLibraryModalOpen(false)}
                onSuccess={loadLibraries}
            />
            <CreatePlanModal
                isOpen={isCreatePlanModalOpen}
                plan={null}
                onSubmit={handleCreatePlan}
                isSaving={isSavingPlan}
                error={planModalError}
                onClose={() => {
                    setIsCreatePlanModalOpen(false);
                    setPlanModalError('');
                }}
            />
        </div>
    );
};

export default Dashboard;
