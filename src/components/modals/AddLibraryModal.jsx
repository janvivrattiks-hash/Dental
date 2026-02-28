import React from 'react';
import { X, Upload, FileUp, File } from 'lucide-react';
import { cn } from '../../utils/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AddLibraryModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-[520px] bg-white rounded-[20px] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Header */}
                <div className="p-6 lg:p-8 flex items-center justify-between border-b border-slate-50">
                    <h2 className="text-xl font-bold text-slate-900">Add New Implant Library</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 lg:p-8 space-y-6">
                    {/* Two Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Company Name</label>
                            <Input
                                placeholder="e.g. Osstem"
                                className="h-12 bg-white border-slate-200 rounded-lg focus:ring-teal-500/10 focus:border-teal-500 transition-all px-5 text-slate-700 font-medium text-sm"
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Tolerance Degree</label>
                            <Input
                                placeholder="±0.00 mm"
                                className="h-12 bg-white border-slate-200 rounded-lg focus:ring-teal-500/10 focus:border-teal-500 transition-all px-5 text-slate-700 font-medium text-sm"
                            />
                        </div>
                    </div>

                    {/* Scan Body File Upload */}
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Scan Body File (.STL / .OBJ)</label>
                        <div className="group relative border-2 border-dashed border-slate-200 hover:border-teal-500/50 rounded-xl p-6 lg:p-8 transition-all cursor-pointer bg-slate-50/30 hover:bg-teal-50/30">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="w-11 h-11 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-teal-500 transition-colors mb-3">
                                    <File size={22} />
                                </div>
                                <p className="text-base font-bold text-slate-900 mb-0.5">Click to upload or drag & drop</p>
                                <p className="text-[12px] font-semibold text-slate-400">Maximum file size 50MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Analog File Upload */}
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Analog File (.STL / .OBJ)</label>
                        <div className="group relative border-2 border-dashed border-slate-200 hover:border-teal-500/50 rounded-xl p-6 lg:p-8 transition-all cursor-pointer bg-slate-50/30 hover:bg-teal-50/30">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="w-11 h-11 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-teal-500 transition-colors mb-3">
                                    <FileUp size={22} />
                                </div>
                                <p className="text-base font-bold text-slate-900 mb-0.5">Click to upload or drag & drop</p>
                                <p className="text-[12px] font-semibold text-slate-400">Maximum file size 50MB</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 lg:p-8 bg-slate-50/50 flex items-center justify-end gap-5 border-t border-slate-50">
                    <button
                        onClick={onClose}
                        className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors px-4 py-2"
                    >
                        Cancel
                    </button>
                    <Button
                        onClick={() => {
                            // Handle save
                            onClose();
                        }}
                        className="h-12 px-8 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-lg font-bold shadow-lg shadow-teal-500/20 active:scale-95 transition-all text-sm"
                    >
                        Save Library
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddLibraryModal;
