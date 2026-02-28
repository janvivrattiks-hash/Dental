import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Calendar,
    DollarSign,
    Activity,
    MoreHorizontal,
    Search,
    Bell,
    Plus,
    CreditCard,
    Download,
    TrendingUp,
    Microscope,
    Tablet,
    Settings
} from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { cn } from '../utils/utils';
import AddLibraryModal from '../components/modals/AddLibraryModal';

const Dashboard = () => {
    const [isAddLibraryModalOpen, setIsAddLibraryModalOpen] = useState(false);
    const scanActivity = [
        {
            id: 1,
            user: 'Dr. James Dalton',
            clinic: 'Metropolitan Dental',
            type: 'Mandible Full Arch',
            count: 12,
            status: 'COMPLETED',
            date: 'Oct 24, 2023',
            time: '14:32',
            avatar: 'JD'
        },
        {
            id: 2,
            user: 'Dr. Lucia Rossi',
            clinic: 'Rome Implant Clinic',
            type: 'Maxilla Quadrant',
            count: 4,
            status: 'PROCESSING',
            date: 'Oct 24, 2023',
            time: '14:15',
            avatar: 'LR'
        },
        {
            id: 3,
            user: 'Dr. Mark Kepler',
            clinic: 'Kepler Orthodontics',
            type: 'Full Skull CBCT',
            count: 28,
            status: 'COMPLETED',
            date: 'Oct 24, 2023',
            time: '13:50',
            avatar: 'MK'
        },
        {
            id: 4,
            user: 'Sarah Hughes',
            clinic: 'St. Luke\'s Dental',
            type: 'Mandible Premolar',
            count: 8,
            status: 'FAILED',
            date: 'Oct 24, 2023',
            time: '12:45',
            avatar: 'SH'
        },
    ];

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
                    <button className="w-11 lg:w-12 h-11 lg:h-12 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#0d9488] transition-all shadow-sm group">
                        <div className="relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </div>
                    </button>
                    <button className="flex items-center gap-2 px-4 lg:px-6 h-11 lg:h-12 bg-white border border-slate-100 rounded-xl text-slate-900 font-bold text-sm lg:text-base shadow-sm hover:border-[#0d9488]/30 transition-all">
                        <Calendar size={18} className="text-slate-400" />
                        <span>Last 30 Days</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 group hover:translate-y-[-4px] transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-clinical-blue/10 rounded-xl flex items-center justify-center text-clinical-blue group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> 12%
                        </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
                    <h2 className="text-2xl lg:text-[28px] font-extrabold text-slate-900">1,240</h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 group hover:translate-y-[-4px] transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-[#eefcfb] rounded-xl flex items-center justify-center text-[#0d9488] group-hover:scale-110 transition-transform">
                            <Tablet size={24} />
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> 5%
                        </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Subscriptions</p>
                    <h2 className="text-2xl lg:text-[28px] font-extrabold text-slate-900">850</h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 group hover:translate-y-[-4px] transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-clinical-blue/10 rounded-xl flex items-center justify-center text-clinical-blue group-hover:scale-110 transition-transform">
                            <Microscope size={24} />
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> 18%
                        </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Scans</p>
                    <h2 className="text-2xl lg:text-[28px] font-extrabold text-slate-900">12,400</h2>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 group hover:translate-y-[-4px] transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <DollarSign size={24} />
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> 10%
                        </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
                    <h2 className="text-2xl lg:text-[28px] font-extrabold text-slate-900">$45.2k</h2>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-10">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Quick Actions</h3>
                <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                    <Button
                        onClick={() => setIsAddLibraryModalOpen(true)}
                        className="h-12 lg:h-14 px-6 lg:px-8 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-teal-500/20 active:scale-95 transition-all text-sm lg:text-base">
                        <Plus size={18} className="p-0.5 bg-white/20 rounded-md" />
                        Add Library
                    </Button>
                    <Button className="h-12 lg:h-14 px-6 lg:px-8 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-teal-500/20 active:scale-95 transition-all text-sm lg:text-base">
                        <Plus size={18} className="p-0.5 bg-white/20 rounded-md" />
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
                        <button className="text-[13px] font-bold text-[#0d9488] hover:underline transition-all">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User / Clinic</th>
                                    <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scan Type</th>
                                    <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Scan Count</th>
                                    <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 lg:px-8 py-4 lg:py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Date / Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scanActivity.map((scan) => (
                                    <tr key={scan.id} className="group hover:bg-slate-50/50 transition-all duration-300 border-b border-slate-50">
                                        <td className="px-6 lg:px-8 py-4 lg:py-6">
                                            <div className="flex items-center gap-3 lg:gap-4">
                                                <div className="w-9 lg:w-10 h-9 lg:h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-white shadow-sm flex-shrink-0">
                                                    {scan.avatar}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 leading-none truncate">{scan.user}</p>
                                                    <p className="text-[11px] font-semibold text-slate-400 mt-1.5 truncate">{scan.clinic}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-8 py-4 lg:py-6 text-sm font-bold text-slate-600">{scan.type}</td>
                                        <td className="px-6 lg:px-8 py-4 lg:py-6">
                                            <div className="flex items-center justify-center gap-3 min-w-[100px] lg:min-w-[120px]">
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#0d9488] rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(13,148,136,0.3)]"
                                                        style={{ width: `${(scan.count / 30) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[13px] font-bold text-slate-900">{scan.count}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-8 py-4 lg:py-6">
                                            <div className="flex justify-center">
                                                <span className={cn(
                                                    "text-[10px] px-2.5 py-1.5 rounded-lg font-black tracking-widest whitespace-nowrap",
                                                    scan.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" :
                                                        scan.status === 'PROCESSING' ? "bg-amber-50 text-amber-600" :
                                                            "bg-rose-50 text-rose-600"
                                                )}>
                                                    {scan.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 lg:px-8 py-4 lg:py-6 text-right">
                                            <p className="text-[12px] font-bold text-slate-500 leading-none">{scan.date}</p>
                                            <p className="text-[11px] font-bold text-slate-400 mt-1.5">{scan.time}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Scan Volume Trends */}
                <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-50 p-6 lg:p-10 h-fit">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-lg lg:text-xl font-bold text-slate-900">Scan Volume Trend</h3>
                        <div className="p-2 bg-slate-50 rounded-lg">
                            <TrendingUp size={18} className="text-[#0d9488]" />
                        </div>
                    </div>

                    {/* Bar Chart Mockup */}
                    <div className="flex items-end justify-between h-48 mb-10 px-2 lg:px-4">
                        {[65, 85, 45, 90, 70, 100, 95].map((height, i) => (
                            <div key={i} className="w-6 lg:w-8 relative group">
                                <div
                                    className={cn(
                                        "w-full rounded-t-lg transition-all duration-500 cursor-pointer shadow-sm shadow-[#0d9488]/5",
                                        i === 5 ? "bg-[#0d9488] h-[100%] shadow-[0_-4px_12px_rgba(13,148,136,0.2)]" :
                                            i === 6 ? "bg-[#14b8a6] h-[95%] shadow-[0_-4px_12px_rgba(20,184,166,0.15)]" :
                                                "bg-[#ccfbf1]/60 hover:bg-[#99f6e4] hover:shadow-[0_-4px_12px_rgba(153,246,228,0.2)]"
                                    )}
                                    style={{ height: i < 5 ? `${height}%` : undefined }}
                                ></div>
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold shadow-xl border border-white/10 backdrop-blur-md">
                                    {height * 30} scans
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6 mb-12">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-500">Weekly Target</span>
                            <span className="text-[15px] font-extrabold text-slate-900">2,500 / 3,000</span>
                        </div>
                        <div className="h-3 bg-slate-50 rounded-full overflow-hidden p-0.5">
                            <div className="h-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] w-[83%] rounded-full shadow-[0_0_8px_rgba(13,148,136,0.2)] transition-all duration-1000 ease-out"></div>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium italic">Target based on subscription quotas.</p>
                    </div>

                    <div className="pt-10 border-t border-slate-50">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8">Top Implant Libraries</h4>
                        <div className="space-y-5 lg:space-y-6">
                            {[
                                { name: 'Nobel Biocare', count: '4,210', color: 'bg-[#0d9488]' },
                                { name: 'Straumann', count: '3,890', color: 'bg-[#14b8a6]' },
                                { name: 'Zimmer Biomet', count: '2,100', color: 'bg-clinical-blue' }
                            ].map((lib) => (
                                <div key={lib.name} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-3 lg:p-4 -m-3 lg:-m-4 rounded-xl transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-2 h-2 rounded-full", lib.color)}></div>
                                        <span className="text-sm lg:text-[15px] font-bold text-slate-700 group-hover:text-[#0d9488] transition-colors">{lib.name}</span>
                                    </div>
                                    <span className="text-sm lg:text-[14px] font-extrabold text-slate-900">{lib.count} <span className="text-slate-400 text-xs font-bold">scans</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <AddLibraryModal
                isOpen={isAddLibraryModalOpen}
                onClose={() => setIsAddLibraryModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
