import { Search, Bell, Menu } from 'lucide-react';
import { useGlobal } from '../../context/GlobalContext';
import Input from '../ui/Input';

const Navbar = () => {
    const { user } = useGlobal();

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="w-96">
                <Input
                    placeholder="Search patients, appointments..."
                    icon={Search}
                    className="bg-slate-50 border-none focus:ring-clinical-blue/5"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 rounded-full hover:bg-slate-100 transition-all duration-300 group">
                    <Bell size={20} className="text-slate-500 group-hover:text-clinical-blue" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-100"></div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-clinical-blue transition-colors duration-200">{user.name}</p>
                        <p className="text-xs font-semibold text-slate-400">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-clinical-blue/10 border-2 border-clinical-blue/20 p-0.5 transition-transform duration-300 group-hover:rotate-3">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=2badee&color=fff&bold=true&rounded=true`}
                            alt="Avatar"
                            className="w-full h-full rounded-[9px]"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
