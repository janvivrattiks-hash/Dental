import React from 'react';
import { X, ClipboardList, DollarSign, Zap, FileText } from 'lucide-react';
import { cn } from '../../utils/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';

const CreatePlanModal = ({ isOpen, onClose, plan }) => {
    if (!isOpen) return null;

    const isEdit = !!plan;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-[520px] max-h-[90vh] flex flex-col bg-white rounded-[20px] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Header */}
                <div className="p-6 lg:p-8 flex items-center justify-between border-b border-slate-50 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-900">
                        {isEdit ? `Edit Subscription Plan: ${plan.name}` : 'Create New Subscription Plan'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 lg:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    {/* Plan Name */}
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Plan Name</label>
                        <Input
                            placeholder="e.g. Premium Plus"
                            defaultValue={plan?.name || ''}
                            icon={ClipboardList}
                            className="h-12 bg-white border-slate-200 rounded-lg focus:ring-teal-500/10 focus:border-teal-500 transition-all text-slate-700 font-medium text-sm"
                        />
                    </div>

                    {/* Price & Credits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Price (USD)</label>
                            <Input
                                placeholder="0.00"
                                defaultValue={plan?.price || ''}
                                icon={DollarSign}
                                className="h-12 bg-white border-slate-200 rounded-lg focus:ring-teal-500/10 focus:border-teal-500 transition-all text-slate-700 font-medium text-sm"
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Credits</label>
                            <Input
                                placeholder="e.g. 5,000"
                                defaultValue={plan?.credits || ''}
                                icon={Zap}
                                className="h-12 bg-white border-slate-200 rounded-lg focus:ring-teal-500/10 focus:border-teal-500 transition-all text-slate-700 font-medium text-sm"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Description</label>
                        <div className="relative">
                            <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-clinical-blue transition-colors duration-200">
                                <FileText size={18} />
                            </div>
                            <textarea
                                placeholder="Describe the plan features and target audience..."
                                defaultValue={plan?.description || ''}
                                className="w-full min-h-[120px] bg-white border border-slate-200 rounded-lg focus:ring-clinical-blue focus:ring-4 focus:ring-clinical-blue/10 focus:border-clinical-blue transition-all pl-12 pr-5 py-3 text-slate-700 font-medium text-sm outline-none resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 lg:p-8 bg-slate-50/50 flex items-center justify-end gap-5 border-t border-slate-50 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={() => {
                            // Handle save logic here
                            onClose();
                        }}
                        className="h-12 px-8 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-lg font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-all text-sm"
                    >
                        {isEdit ? 'Update Plan' : 'Save Plan'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreatePlanModal;
