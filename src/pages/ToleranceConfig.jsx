import React, { useState } from 'react';
import {
    Info,
    Settings,
    ChevronRight,
    HelpCircle,
    Shield,
    Save,
    ChevronDown,
    Percent
} from 'lucide-react';
import { cn } from '../utils/utils';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ToleranceConfig = () => {
    return (
        <div className="flex-1 bg-[#f8fafc] min-h-screen p-6 lg:p-10 overflow-y-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-8">
                <span className="hover:text-slate-600 cursor-pointer transition-colors">Settings</span>
                <ChevronRight size={14} />
                <span className="text-slate-900">Tolerance</span>
            </nav>

            {/* Page Header */}
            <header className="mb-10">
                <h1 className="text-[32px] font-bold text-slate-900 tracking-tight mb-2">Tolerance Threshold Configuration</h1>
                <p className="text-slate-500 font-medium text-lg max-w-4xl">
                    Define the acceptable deviation limits for automated diagnostic alerts across different medical branches.
                </p>
            </header>

            {/* System Configuration Note */}
            <div className="bg-[#eefcfb] border border-[#ccfbf1] rounded-2xl p-6 flex items-start gap-5 mb-10 group hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0d9488] shrink-0 border border-teal-50">
                    <Info size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-[#0d9488] mb-1">System Configuration Note</h3>
                    <p className="text-slate-600 font-medium text-[15px] leading-relaxed">
                        Adjusting these parameters will update the real-time monitoring sensitivity for all active diagnostic devices in the selected facility.
                    </p>
                </div>
            </div>

            {/* Configuration Form Card */}
            <div className="bg-white rounded-[24px] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="p-6 lg:p-8 flex items-center gap-3 border-b border-slate-50">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                        <Settings size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Configuration Form</h3>
                </div>

                <div className="p-8 lg:p-10 space-y-10">
                    {/* Two Column Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Target Company */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <label className="text-sm font-bold text-slate-800">Target Company</label>
                                <HelpCircle size={14} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                            </div>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                    {/* Icon placeholder if needed */}
                                </div>
                                <select className="w-full h-14 bg-slate-50/50 border border-slate-200 rounded-xl px-5 text-slate-600 font-medium focus:bg-white focus:ring-4 focus:ring-[#0d9488]/5 focus:border-[#0d9488] transition-all appearance-none cursor-pointer">
                                    <option>Select a medical facility or entity</option>
                                    <option>Nobel Biocare</option>
                                    <option>Straumann</option>
                                    <option>Zimmer Biomet</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors">
                                    <ChevronDown size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Tolerance Degree */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-1">
                                <label className="text-sm font-bold text-slate-800">Tolerance Degree (± %)</label>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0d9488] transition-colors">
                                    <Percent size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="5.0"
                                    className="w-full h-14 bg-slate-50/50 border border-slate-200 rounded-xl pl-12 pr-5 text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-[#0d9488]/5 focus:border-[#0d9488] transition-all outline-none placeholder:text-slate-300"
                                />
                            </div>
                            <p className="text-[12px] font-semibold text-slate-400 italic px-1">Recommended: 2.5% - 7.5% for general vitals.</p>
                        </div>
                    </div>

                    {/* Active Guardian Mode Section */}
                    <div className="bg-[#f0f9ff]/50 border-2 border-dashed border-[#bae6fd] rounded-2xl p-6 flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0284c7] shrink-0 border border-blue-100">
                            <Shield size={20} />
                        </div>
                        <p className="text-slate-600 font-medium text-[15px] leading-relaxed pt-1">
                            <span className="font-bold text-slate-900">Active Guardian Mode:</span> Ensures any deviation beyond the set degree triggers a priority level 1 alert to the duty supervisor.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 lg:p-8 bg-slate-50/30 flex items-center justify-end gap-6 border-t border-slate-50">
                    <button className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors px-4">
                        Cancel
                    </button>
                    <Button
                        className="h-12 px-8 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-all text-sm"
                    >
                        <Save size={18} />
                        Save Configuration
                    </Button>
                </div>
            </div>

            {/* Bottom Decoration (the three dots from screenshot) */}
            <div className="flex justify-center gap-2 mt-12 opacity-20">
                <div className="w-2 h-2 rounded-full bg-clinical-teal animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-clinical-teal animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-clinical-teal animate-pulse delay-300"></div>
            </div>
        </div>
    );
};

export default ToleranceConfig;
