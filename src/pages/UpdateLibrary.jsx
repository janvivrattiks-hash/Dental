import React from 'react';
import {
    ChevronRight,
    Save,
    X,
    Info,
    Box,
    FileCode,
    History,
    Trash2,
    CheckCircle2,
    Upload,
    HelpCircle
} from 'lucide-react';
import { cn } from '../utils/utils';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Link } from 'react-router-dom';

const UpdateLibrary = () => {
    const auditHistory = [
        {
            event: 'Metadata updated',
            time: 'Today, 10:24 AM by Dr. Aris Thorne',
            status: 'completed'
        },
        {
            event: 'Scan Body STL Replaced',
            time: '14 Mar 2024 by System Admin',
            status: 'completed'
        },
        {
            event: 'Library Created',
            time: '12 Jan 2024 by System Admin',
            status: 'completed'
        }
    ];

    return (
        <div className="p-6 lg:p-10 max-w-[1400px] mx-auto overflow-y-auto h-full scrollbar-hidden">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-8 text-sm font-medium">
                <Link to="/library" className="text-clinical-teal hover:underline">Libraries</Link>
                <ChevronRight size={14} className="text-slate-400" />
                <span className="text-slate-400">Edit Library</span>
                <ChevronRight size={14} className="text-slate-400" />
                <span className="text-slate-900 font-bold">Straumann</span>
            </nav>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-none mb-3">Update Library: Straumann</h1>
                    <p className="text-slate-500 font-medium text-base">Manage implant system specifications and STL assets</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-6 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50">
                        Discard
                    </Button>
                    <Button className="h-11 px-8 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20">
                        Save Updates
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column (Main Form & Assets) */}
                <div className="xl:col-span-2 space-y-8">
                    {/* General Information Card */}
                    <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-xl shadow-slate-200/40 border border-slate-50">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-clinical-teal/10 rounded-xl flex items-center justify-center text-clinical-teal">
                                <Info size={22} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">General Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-900 ml-1">Company Name</label>
                                <Input
                                    defaultValue="Straumann"
                                    className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 px-6 font-semibold focus:bg-white"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-900 ml-1">Manufacturer ID</label>
                                <Input
                                    defaultValue="STR-00492"
                                    className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 px-6 font-semibold focus:bg-white"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-slate-900 ml-1">Tolerance Degree (µm)</label>
                                    <HelpCircle size={16} className="text-slate-400 cursor-help" />
                                </div>
                                <div className="relative">
                                    <Input
                                        defaultValue="5"
                                        className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 px-6 font-semibold focus:bg-white pr-20"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">microns</div>
                                </div>
                                <p className="text-[11px] font-medium text-slate-400 mt-2 px-1">
                                    Increasing tolerance may affect analysis precision in complex cases.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* File Assets Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-clinical-teal/10 rounded-xl flex items-center justify-center text-clinical-teal">
                                <Box size={22} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">File Assets (STL)</h2>
                        </div>

                        {/* Scan Body Card */}
                        <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-xl shadow-slate-200/40 border border-slate-50">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-clinical-teal/5 rounded-xl flex items-center justify-center text-clinical-teal">
                                        <Box size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 leading-tight">Scan Body Geometry</h3>
                                        <p className="text-sm font-medium text-slate-400">Primary reference for digital impression analysis</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black tracking-widest leading-none">
                                    <CheckCircle2 size={12} strokeWidth={3} />
                                    VERIFIED
                                </div>
                            </div>
                            <div className="bg-slate-50/50 rounded-2xl px-6 py-5 flex items-center justify-between group border border-dashed border-slate-200 hover:border-clinical-teal/30 hover:bg-clinical-teal/5 transition-all">
                                <div className="flex items-center gap-4">
                                    <FileCode size={20} className="text-slate-400 group-hover:text-clinical-teal transition-colors" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">straumann_scanbody_v2.stl</p>
                                        <p className="text-[11px] font-medium text-slate-400 mt-1">Last updated 14 Mar 2024 • 4.2 MB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-clinical-teal font-black text-[12px] flex items-center gap-2 hover:bg-white px-4 py-2 rounded-xl transition-all">
                                    <Upload size={16} />
                                    Replace
                                </Button>
                            </div>
                        </div>

                        {/* Analog Interface Card */}
                        <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-xl shadow-slate-200/40 border border-slate-50">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-clinical-teal/5 rounded-xl flex items-center justify-center text-clinical-teal">
                                        <Box size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 leading-tight">Analog Interface Geometry</h3>
                                        <p className="text-sm font-medium text-slate-400">Interface mapping for physical analog placement</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black tracking-widest leading-none">
                                    <CheckCircle2 size={12} strokeWidth={3} />
                                    VERIFIED
                                </div>
                            </div>
                            <div className="bg-slate-50/50 rounded-2xl px-6 py-5 flex items-center justify-between group border border-dashed border-slate-200 hover:border-clinical-teal/30 hover:bg-clinical-teal/5 transition-all">
                                <div className="flex items-center gap-4">
                                    <FileCode size={20} className="text-slate-400 group-hover:text-clinical-teal transition-colors" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">straumann_analog_interface_rc.stl</p>
                                        <p className="text-[11px] font-medium text-slate-400 mt-1">Last updated 14 Mar 2024 • 2.8 MB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-clinical-teal font-black text-[12px] flex items-center gap-2 hover:bg-white px-4 py-2 rounded-xl transition-all">
                                    <Upload size={16} />
                                    Replace
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Preview & Audit) */}
                <div className="space-y-8 h-fit lg:sticky lg:top-0">
                    {/* Library Preview Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/40 border border-slate-50">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 font-primary">Library Preview</h2>
                        <div className="aspect-square bg-slate-50 rounded-[32px] flex flex-col items-center justify-center p-8 border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-4">
                                <Box size={32} strokeWidth={1.5} />
                            </div>
                            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">3D Visualization</p>
                            <Button className="mt-8 bg-white text-slate-900 hover:bg-slate-100 font-bold px-6 h-11 border border-slate-100 shadow-sm rounded-xl">
                                Launch Viewer
                            </Button>
                        </div>
                    </div>

                    {/* Audit History Card */}
                    <div className="bg-[#f0f9f9]/50 rounded-[32px] p-8 shadow-sm border border-clinical-teal/10">
                        <div className="flex items-center gap-3 mb-8">
                            <History size={20} className="text-clinical-teal" />
                            <h2 className="text-lg font-bold text-slate-900">Audit History</h2>
                        </div>
                        <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-clinical-teal/10">
                            {auditHistory.map((item, idx) => (
                                <div key={idx} className="relative pl-10">
                                    <div className="absolute left-[8px] top-1 w-2 h-2 rounded-full bg-clinical-teal ring-4 ring-[#f0f9f9] shadow-sm z-10" />
                                    <p className="text-[13px] font-bold text-slate-900 leading-tight">{item.event}</p>
                                    <p className="text-[11px] font-medium text-slate-400 mt-1">{item.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Archive Library Card */}
                    <div className="bg-rose-50/30 rounded-[32px] p-8 shadow-sm border border-rose-100 group transition-all">
                        <Button
                            variant="ghost"
                            className="w-full h-14 bg-white hover:bg-rose-50 text-rose-600 font-black text-sm lg:text-base border border-rose-100 shadow-sm rounded-2xl flex items-center justify-center gap-3 transition-all"
                        >
                            <Trash2 size={20} />
                            Archive Library
                        </Button>
                    </div>
                </div>
            </div>

            {/* Platform Footer */}
            <div className="mt-20 py-8 border-t border-slate-100 flex flex-col items-center gap-2">
                <p className="text-[11px] font-medium text-slate-400">
                    © 2024 Dental Implant Analysis Platform • Professional Medical Diagnostics Tool
                </p>
            </div>
        </div>
    );
};

export default UpdateLibrary;
