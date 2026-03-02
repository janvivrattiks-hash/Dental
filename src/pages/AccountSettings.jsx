import React, { useState } from 'react';
import {
    ChevronRight,
    User,
    Mail,
    Briefcase,
    Globe,
    ShieldCheck,
    Lock,
    Smartphone,
    Download,
    CheckCircle2,
    X,
    Camera,
    Eye,
    EyeOff
} from 'lucide-react';
import { cn } from '../utils/utils';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Link } from 'react-router-dom';

const AccountSettings = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [profileImage, setProfileImage] = useState("https://ui-avatars.com/api/?name=Sarah+Chen&background=f0f9f9&color=0d9488&bold=true&size=200");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const fileInputRef = React.useRef(null);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 800);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-[1200px] mx-auto overflow-y-auto h-full scrollbar-hidden pb-32">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
            />
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-6 text-sm font-medium">
                <span className="text-slate-400">Admin</span>
                <ChevronRight size={14} className="text-slate-400" />
                <span className="text-slate-900 font-bold">Settings</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl lg:text-[36px] font-black text-slate-900 tracking-tight leading-none mb-3">Account Settings</h1>
                    <p className="text-slate-500 font-medium text-base">Manage your platform identity and security credentials.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-6 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50">
                        Discard
                    </Button>
                    <Button
                        onClick={handleSave}
                        isLoading={isSaving}
                        className="h-11 px-8 bg-[#0d9488] hover:bg-[#0c857a] text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-500/20"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Profile Information Card */}
                <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-xl shadow-slate-200/40 border border-slate-50">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-clinical-teal/10 rounded-xl flex items-center justify-center text-clinical-teal">
                            <User size={22} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Profile Information</h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group cursor-pointer" onClick={triggerUpload}>
                                <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden">
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#0d9488] rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                                    <Camera size={18} />
                                </div>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-widest leading-relaxed">
                                JPG, GIF or PNG.<br />Max size of 2MB.
                            </p>
                        </div>

                        {/* Form Fields */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-900 ml-1 uppercase tracking-wider">Full Name</label>
                                <Input
                                    defaultValue="Dr. Sarah Chen"
                                    className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 px-6 font-semibold focus:bg-white transition-all text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-900 ml-1 uppercase tracking-wider">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0d9488] transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <Input
                                        defaultValue="sarah.chen@dentalplatform.com"
                                        className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 pl-14 pr-6 font-semibold focus:bg-white transition-all text-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-900 ml-1 uppercase tracking-wider">Professional Role</label>
                                <div className="relative group">
                                    <select className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-[#0d9488]/5 focus:border-[#0d9488] transition-all appearance-none cursor-pointer outline-none">
                                        <option>Chief Administrator</option>
                                        <option>Clinical Director</option>
                                        <option>Lead Dentist</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronRight size={18} className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-bold text-slate-900 ml-1 uppercase tracking-wider">Language</label>
                                <div className="relative group">
                                    <select className="w-full h-14 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 font-semibold text-slate-700 focus:bg-white focus:ring-4 focus:ring-[#0d9488]/5 focus:border-[#0d9488] transition-all appearance-none cursor-pointer outline-none">
                                        <option>English (US)</option>
                                        <option>Spanish (ES)</option>
                                        <option>French (FR)</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronRight size={18} className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security & Access Card */}
                <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-50">
                    <div className="p-8 lg:p-10 border-b border-slate-50">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-clinical-teal/10 rounded-xl flex items-center justify-center text-clinical-teal">
                                    <ShieldCheck size={22} />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Security & Access</h2>
                            </div>
                            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black tracking-widest uppercase leading-none">
                                Highly Secure
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    Update Password
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Current Password</label>
                                        <div className="relative group">
                                            <Input
                                                type={showCurrentPassword ? "text" : "password"}
                                                defaultValue="password123"
                                                className="h-12 rounded-xl bg-slate-50/50 border-slate-100 pl-5 pr-12 font-bold tracking-widest text-[#0d9488]"
                                            />
                                            <button
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0d9488] transition-colors"
                                            >
                                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-wider">New Password</label>
                                        <div className="relative group">
                                            <Input
                                                type={showNewPassword ? "text" : "password"}
                                                defaultValue="password123"
                                                className="h-12 rounded-xl bg-slate-50/50 border-slate-100 pl-5 pr-12 font-bold tracking-widest text-slate-400"
                                            />
                                            <button
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0d9488] transition-colors"
                                            >
                                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Confirm New Password</label>
                                        <div className="relative group">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                defaultValue="password123"
                                                className="h-12 rounded-xl bg-slate-50/50 border-slate-100 pl-5 pr-12 font-bold tracking-widest text-slate-400"
                                            />
                                            <button
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0d9488] transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Account Data Audit Card */}
                <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-xl shadow-slate-200/40 border border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                            <Download size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 leading-tight mb-1">Account Data Audit</h2>
                            <p className="text-sm font-medium text-slate-400">
                                Download a full record of your account activity and personal data.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" className="h-11 px-8 border-slate-100 text-slate-700 font-bold hover:bg-slate-50 transition-all rounded-xl">
                        Request Export
                    </Button>
                </div>
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed bottom-10 right-10 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-[#0d9488] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <CheckCircle2 size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-sm leading-none">Settings Saved</p>
                            <p className="text-[11px] font-medium text-white/80 mt-1">All changes have been applied successfully.</p>
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-all"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountSettings;
