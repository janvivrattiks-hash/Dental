import React, { useEffect, useState } from 'react';
import { X, ClipboardList, IndianRupee, Zap, FileText } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const CreatePlanModal = ({ isOpen, onClose, plan, onSubmit, isSaving = false, error = '' }) => {
    const [formData, setFormData] = useState({
        name: '',
        price_rupee: '',
        credits: '',
        description: '',
    });

    useEffect(() => {
        setFormData({
            name: plan?.name || '',
            price_rupee: plan?.price_rupee ?? plan?.price ?? '',
            credits: plan?.credits ?? '',
            description: plan?.description || '',
        });
    }, [plan, isOpen]);

    if (!isOpen) return null;

    const isEdit = !!plan;

    const handleSubmit = async () => {
        if (!onSubmit) {
            onClose();
            return;
        }

        await onSubmit({
            name: formData.name.trim(),
            price_rupee: Number(formData.price_rupee),
            credits: Number(formData.credits),
            description: formData.description.trim(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-[520px] max-h-[90vh] flex flex-col bg-white rounded-[20px] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
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

                <div className="p-6 lg:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Plan Name</label>
                        <Input
                            placeholder="e.g. Premium Plus"
                            value={formData.name}
                            onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))}
                            icon={ClipboardList}
                            className="h-12 bg-white border-slate-200 rounded-lg focus:ring-teal-500/10 focus:border-teal-500 transition-all text-slate-700 font-medium text-sm"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Price (INR)</label>
                            <Input
                                placeholder="0.00"
                                value={formData.price_rupee}
                                onChange={(e) => setFormData((current) => ({ ...current, price_rupee: e.target.value }))}
                                icon={IndianRupee}
                                className="h-12 bg-white border-slate-200 rounded-lg focus:ring-teal-500/10 focus:border-teal-500 transition-all text-slate-700 font-medium text-sm"
                                min="0"
                                step="0.01"
                                type="number"
                                required
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Credits</label>
                            <Input
                                placeholder="e.g. 5000"
                                value={formData.credits}
                                onChange={(e) => setFormData((current) => ({ ...current, credits: e.target.value }))}
                                icon={Zap}
                                className="h-12 bg-white border-slate-200 rounded-lg focus:ring-teal-500/10 focus:border-teal-500 transition-all text-slate-700 font-medium text-sm"
                                min="0"
                                step="1"
                                type="number"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Description</label>
                        <div className="relative">
                            <div className="absolute left-4 top-3.5 text-slate-400 transition-colors duration-200">
                                <FileText size={18} />
                            </div>
                            <textarea
                                placeholder="Describe the plan features and target audience..."
                                value={formData.description}
                                onChange={(e) => setFormData((current) => ({ ...current, description: e.target.value }))}
                                className="w-full min-h-[120px] bg-white border border-slate-200 rounded-lg focus:ring-clinical-blue focus:ring-4 focus:ring-clinical-blue/10 focus:border-clinical-blue transition-all pl-12 pr-5 py-3 text-slate-700 font-medium text-sm outline-none resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {error ? (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
                            {error}
                        </div>
                    ) : null}
                </div>

                <div className="p-6 lg:p-8 bg-slate-50/50 flex items-center justify-end gap-5 border-t border-slate-50 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={handleSubmit}
                        className="h-12 px-8 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-lg font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-all text-sm"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : isEdit ? 'Update Plan' : 'Save Plan'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreatePlanModal;
