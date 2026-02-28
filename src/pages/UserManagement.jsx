import React, { useState } from 'react';
import {
    Search,
    Download,
    Plus,
    ChevronDown,
    Filter,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Users,
    Clock,
    DollarSign,
    MoreVertical,
    HelpCircle
} from 'lucide-react';
import { cn } from '../utils/utils';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const users = [
        {
            id: 1,
            name: 'Dr. James Wilson',
            email: 'j.wilson@stmarys.org',
            organization: 'St. Mary\'s General',
            plan: 'Enterprise',
            credits: '12,450',
            status: 'Active',
            avatar: 'JW'
        },
        {
            id: 2,
            name: 'Elena Rodriguez',
            email: 'elena.r@westside.med',
            organization: 'Westside Medical Center',
            plan: 'Professional',
            credits: '3,200',
            status: 'Active',
            avatar: 'ER'
        },
        {
            id: 3,
            name: 'Mark Bradley',
            email: 'mbradley@global.health',
            organization: 'Global Health Clinic',
            plan: 'Basic',
            credits: '150',
            status: 'Suspended',
            avatar: 'MB'
        },
        {
            id: 4,
            name: 'Arthur Morgan',
            email: 'amorgan@stmarys.org',
            organization: 'St. Mary\'s General',
            plan: 'Enterprise',
            credits: '8,900',
            status: 'Active',
            avatar: 'AM'
        }
    ];

    return (
        <div className="flex-1 bg-[#f8fafc] min-h-screen p-6 lg:p-10 overflow-y-auto custom-scrollbar">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-8">
                <span className="hover:text-slate-600 cursor-pointer transition-colors">Admin</span>
                <ChevronRight size={14} />
                <span className="text-slate-900">User Management</span>
            </nav>

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-none mb-3">User Management</h1>
                    <p className="text-slate-500 font-medium text-lg">Manage system users, access levels, and medical facility credentials.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-5 h-12 bg-white border border-slate-100 rounded-xl text-slate-700 font-bold text-[15px] shadow-sm hover:border-slate-200 transition-all active:scale-95">
                        <Download size={18} className="text-slate-400" />
                        <span>Export</span>
                    </button>
                    <button className="flex items-center gap-2 px-6 h-12 bg-[#0d9488] border border-[#0d9488] rounded-xl text-white font-bold text-[15px] shadow-lg shadow-teal-500/20 hover:bg-[#0c857a] transition-all active:scale-95">
                        <Plus size={18} />
                        <span>Add New User</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar Card */}
            <div className="bg-white p-4 lg:p-6 rounded-[24px] shadow-sm border border-slate-100 mb-8">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[300px] relative">
                        <Input
                            placeholder="Search by name, email, or organization..."
                            icon={Search}
                            className="h-12 bg-slate-50/50 border-slate-100 rounded-xl w-full text-[15px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <select className="h-12 pl-5 pr-12 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 appearance-none cursor-pointer focus:bg-white focus:ring-4 focus:ring-[#0d9488]/5 transition-all outline-none">
                            <option>Organization</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select className="h-12 pl-5 pr-12 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 appearance-none cursor-pointer focus:bg-white focus:ring-4 focus:ring-[#0d9488]/5 transition-all outline-none">
                            <option>All Plans</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select className="h-12 pl-5 pr-12 bg-slate-50/50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 appearance-none cursor-pointer focus:bg-white focus:ring-4 focus:ring-[#0d9488]/5 transition-all outline-none">
                            <option>Status</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <button className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm transition-all hover:border-slate-200 active:scale-95">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Users Table Card */}
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden mb-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="px-8 py-5 w-16">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0d9488] focus:ring-[#0d9488]" />
                                </th>
                                <th className="px-4 py-5 font-bold text-[11px] text-slate-400 uppercase tracking-widest">Name & Email</th>
                                <th className="px-4 py-5 font-bold text-[11px] text-slate-400 uppercase tracking-widest">Organization</th>
                                <th className="px-4 py-5 font-bold text-[11px] text-slate-400 uppercase tracking-widest text-center">Plan</th>
                                <th className="px-4 py-5 font-bold text-[11px] text-slate-400 uppercase tracking-widest">Credits</th>
                                <th className="px-4 py-5 font-bold text-[11px] text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 font-bold text-[11px] text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-4.5">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0d9488] focus:ring-[#0d9488]" />
                                    </td>
                                    <td className="px-4 py-4.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[13px] font-bold text-slate-600 border border-white shadow-sm overflow-hidden">
                                                {user.avatar ? (
                                                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=f1f5f9&color=475569&bold=true`} alt={user.name} />
                                                ) : user.avatar}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 leading-tight">{user.name}</span>
                                                <span className="text-[12px] font-medium text-slate-400 mt-0.5">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4.5">
                                        <span className="text-sm font-semibold text-slate-600">{user.organization}</span>
                                    </td>
                                    <td className="px-4 py-4.5 text-center">
                                        <span className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold",
                                            user.plan === 'Enterprise' ? "bg-blue-50 text-blue-600" :
                                                user.plan === 'Professional' ? "bg-purple-50 text-purple-600" :
                                                    "bg-slate-100 text-slate-600"
                                        )}>
                                            {user.plan}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4.5">
                                        <span className="text-sm font-bold text-slate-900">{user.credits}</span>
                                    </td>
                                    <td className="px-4 py-4.5">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                user.status === 'Active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                                            )} />
                                            <span className={cn(
                                                "text-[12px] font-bold",
                                                user.status === 'Active' ? "text-emerald-600" : "text-amber-600"
                                            )}>
                                                {user.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4.5 text-right">
                                        <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-5 bg-white border-t border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-slate-400">
                        Showing <span className="text-slate-900">1</span> to <span className="text-slate-900">10</span> of <span className="text-slate-900">154</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#0d9488] text-white font-bold text-sm shadow-md shadow-teal-500/10">1</button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all">2</button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all text-[11px] font-medium text-slate-400">3</button>
                        <span className="text-slate-300 px-1">...</span>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all">16</button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 transition-all active:scale-95">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Users</p>
                        <h4 className="text-2xl font-bold text-slate-900">142</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Review</p>
                        <h4 className="text-2xl font-bold text-slate-900">12</h4>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Credits Issued</p>
                        <h4 className="text-2xl font-bold text-slate-900">842,500</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
