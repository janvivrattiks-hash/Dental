import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    History,
    BarChart3,
    Settings,
    LogOut,
    Microscope,
    X
} from 'lucide-react';
import { cn } from '../../utils/utils';
import { useGlobal } from '../../context/GlobalContext';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user } = useGlobal();

    const menuItems = [
        { title: 'Dashboard', path: '/', icon: LayoutDashboard },
        { title: 'Library Management', path: '/library', icon: BookOpen },
        { title: 'Subscription Plans', path: '/plans', icon: ClipboardList },
        { title: 'Payment History', path: '/payments', icon: History },
        { title: 'User Analytics', path: '/analytics', icon: BarChart3 },
    ];

    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-100 flex flex-col h-screen transition-transform duration-300 lg:translate-x-0 lg:static lg:z-20",
            isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}>
            <div className="p-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0d9488] rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                        <Microscope size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">ImplaScan</h1>
                        <span className="text-[10px] font-bold text-clinical-teal uppercase tracking-widest mt-1 block">Admin Console</span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose && onClose()}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group font-semibold',
                                isActive
                                    ? 'bg-[#eefcfb] text-[#0d9488]'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-[#0d9488]'
                            )}
                        >
                            <item.icon size={20} className={cn('transition-transform duration-300 group-hover:scale-110', isActive ? 'text-[#0d9488]' : 'text-slate-400 group-hover:text-[#0d9488]')} />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-slate-50">
                <div className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-slate-50 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#fef3c7] border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                            <img
                                src={`https://ui-avatars.com/api/?name=Sarah+Chen&background=fef3c7&color=92400e&bold=true`}
                                alt="Admin"
                                className="w-full h-full rounded-full"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 leading-none">Dr. Sarah Chen</span>
                            <span className="text-[11px] font-medium text-slate-400 mt-1">System Admin</span>
                        </div>
                    </div>
                    <Settings size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
