import { Link, useLocation } from 'react-router-dom';
import { BadgePlus, BriefcaseMedical, FolderKanban, LayoutDashboard, Library, LogOut, Settings, WalletCards } from 'lucide-react';
import { cn } from '../../utils/utils';
import { useEmployee } from '../../context/EmployeeContext';

const menu = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'New Case', to: '/new-case', icon: BadgePlus },
  { label: 'My Cases', to: '/my-cases', icon: FolderKanban },
  { label: 'Library', to: '/library', icon: Library },
  { label: 'Subscription', to: '/subscription', icon: WalletCards },
  { label: 'Settings', to: '/settings', icon: Settings },
];

const EmployeeSidebar = () => {
  const { pathname } = useLocation();
  const { employeeUser, logoutEmployee } = useEmployee();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] border-r border-cyan-400/20 bg-[#050B18] p-4 lg:flex flex-col">
      <div className="glass-card px-3 py-4 mb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <p className="employee-heading text-lg font-semibold">MyPathFinder</p>
            <p className="text-[11px] text-slate-400">Dental Implant Mesh</p>
          </div>
          <span className="px-2 py-1 text-[10px] rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/40">BETA</span>
        </div>
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto pr-1">
        {menu.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all',
                active
                  ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200 shadow-[inset_3px_0_0_0_#00D4FF]'
                  : 'border-transparent text-slate-300 hover:border-cyan-400/20 hover:bg-cyan-500/5'
              )}
            >
              <item.icon size={18} className={cn(active ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,212,255,.6)]' : 'text-slate-400 group-hover:text-cyan-300')} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 space-y-3 shrink-0">
        <div className="glass-card p-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              <BriefcaseMedical size={16} className="text-cyan-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-slate-200 truncate">{employeeUser.name}</p>
              <p className="text-xs text-slate-400">{employeeUser.plan} Plan</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logoutEmployee}
          className="flex w-full items-center gap-3 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-3 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/15"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;
