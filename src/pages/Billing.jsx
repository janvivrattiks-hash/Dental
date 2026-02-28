import React, { useState } from 'react';
import {
    Download,
    Plus,
    Search,
    TrendingUp,
    Clock,
    Activity,
    FileText,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Filter,
    RefreshCw,
    Waypoints
} from 'lucide-react';
import { cn } from '../utils/utils';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Billing = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const stats = [
        {
            title: 'Total Revenue',
            value: '$128,450.00',
            trend: '12% from last month',
            trendType: 'up',
            icon: TrendingUp,
            iconClass: 'bg-[#eefcfb] text-[#0d9488]'
        },
        {
            title: 'Pending Invoices',
            value: '$4,200.00',
            trend: '14 invoices outstanding',
            trendType: 'neutral',
            icon: Clock,
            iconClass: 'bg-amber-50 text-amber-500'
        },
        {
            title: 'Active Subscriptions',
            value: '842',
            trend: '3% growth rate',
            trendType: 'up',
            icon: Waypoints,
            iconClass: 'bg-indigo-50 text-indigo-500'
        }
    ];

    const transactions = [
        {
            id: 1,
            user: 'Dr. Sarah Smith',
            email: 'sarah.smith@practice.com',
            amount: '$1,250.00',
            date: 'Oct 24, 2023, 10:30 AM',
            status: 'Paid',
            avatar: 'SS'
        },
        {
            id: 2,
            user: 'Central General Hospital',
            type: 'Enterprise License',
            amount: '$8,400.00',
            date: 'Oct 23, 2023, 02:15 PM',
            status: 'Pending',
            avatar: 'CG'
        },
        {
            id: 3,
            user: 'Linda Zhao',
            email: 'linda.zhao@care.org',
            amount: '$450.00',
            date: 'Oct 22, 2023, 09:45 AM',
            status: 'Paid',
            avatar: 'LZ'
        },
        {
            id: 4,
            user: 'Dr. James Wilson',
            email: 'j.wilson@ortho.com',
            amount: '$1,250.00',
            date: 'Oct 21, 2023, 04:20 PM',
            status: 'Failed',
            avatar: 'JW'
        },
        {
            id: 5,
            user: 'Riverside Clinic',
            type: 'Professional Plan',
            amount: '$2,100.00',
            date: 'Oct 20, 2023, 11:00 AM',
            status: 'Paid',
            avatar: 'RC'
        }
    ];

    return (
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto overflow-y-auto h-full scrollbar-hidden">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl lg:text-[32px] font-bold text-slate-900 tracking-tight leading-none mb-2">Billing & Transactions</h1>
                    <p className="text-slate-500 font-medium text-sm lg:text-base">Manage practice revenue, invoices, and insurance claims.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 h-11 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">
                        <Download size={18} className="text-slate-400" />
                        <span>Export CSV</span>
                    </button>
                    <Button className="h-11 px-6 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-all text-sm">
                        <Plus size={18} />
                        New Invoice
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-50 group transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[15px] font-bold text-slate-400">{stat.title}</span>
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", stat.iconClass)}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <h2 className="text-2xl lg:text-[32px] font-black text-slate-900 mb-2">{stat.value}</h2>
                        <p className={cn(
                            "text-sm font-bold flex items-center gap-1",
                            stat.trendType === 'up' ? "text-emerald-500" : "text-slate-400"
                        )}>
                            {stat.trendType === 'up' && <TrendingUp size={14} />}
                            {stat.trend}
                        </p>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col md:flex-row items-center gap-4 mb-8">
                <div className="flex flex-1 items-center gap-3 w-full">
                    <div className="relative group flex-1 max-w-sm">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0d9488] transition-colors">
                            <Calendar size={18} />
                        </div>
                        <select className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-5 text-slate-900 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-[#0d9488]/5 focus:border-[#0d9488] transition-all appearance-none cursor-pointer">
                            <option>Last 30 Days</option>
                            <option>Last 90 Days</option>
                            <option>Year to Date</option>
                        </select>
                    </div>
                    <div className="relative group flex-1 max-w-sm">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0d9488] transition-colors">
                            <Filter size={18} />
                        </div>
                        <select className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-5 text-slate-900 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-[#0d9488]/5 focus:border-[#0d9488] transition-all appearance-none cursor-pointer">
                            <option>All Plans</option>
                            <option>Basic Plan</option>
                            <option>Professional Plan</option>
                            <option>Enterprise License</option>
                        </select>
                    </div>
                </div>

                <div className="relative group w-full md:w-80">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0d9488] transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="w-full h-12 bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-5 text-slate-900 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-[#0d9488]/5 focus:border-[#0d9488] transition-all outline-none"
                    />
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-50 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                <th className="px-8 py-5">User / Entity</th>
                                <th className="px-8 py-5">Amount</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Invoice</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.map((t) => (
                                <tr key={t.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-white shadow-sm flex-shrink-0">
                                                {t.avatar}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 leading-none truncate">{t.user}</p>
                                                <p className="text-[11px] font-semibold text-slate-400 mt-1.5 truncate">{t.email || t.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-base font-black text-slate-900">{t.amount}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[13px] font-bold text-slate-500">{t.date}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <span className={cn(
                                                "text-[10px] px-3 py-1.5 rounded-lg font-black tracking-widest whitespace-nowrap",
                                                t.status === 'Paid' ? "bg-emerald-50 text-emerald-600" :
                                                    t.status === 'Pending' ? "bg-amber-50 text-amber-600" :
                                                        "bg-rose-50 text-rose-600"
                                            )}>
                                                {t.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {t.status === 'Failed' ? (
                                            <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all">
                                                <RefreshCw size={20} />
                                            </button>
                                        ) : (
                                            <button className="p-2 text-slate-400 hover:text-[#0d9488] hover:bg-teal-50 rounded-lg transition-all">
                                                <Download size={20} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer / Pagination */}
                <div className="px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-50">
                    <p className="text-sm font-bold text-slate-400">
                        Showing 1 to 5 of 842 entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:bg-slate-50 transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#eefcfb] text-[#0d9488] font-black text-sm shadow-sm">
                            1
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all">
                            2
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all">
                            3
                        </button>
                        <span className="text-slate-400 px-1 font-bold">...</span>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:bg-slate-50 transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;
