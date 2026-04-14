import { Bell } from 'lucide-react';
import { useEmployee } from '../../context/EmployeeContext';

const EmployeeTopbar = ({ title }) => {
  const { employeeUser } = useEmployee();

  return (
    <header className="h-[72px] border-b border-cyan-400/15 px-6 flex items-center justify-between bg-[#081226]/80 backdrop-blur-md sticky top-0 z-10">
      <div>
        <h1 className="employee-heading text-xl text-slate-100">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="h-10 w-10 rounded-full border border-cyan-400/30 text-cyan-300 grid place-content-center glow-hover">
          <Bell size={17} />
        </button>
        <div className="px-3 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-sm text-cyan-200">
          {employeeUser.name}
        </div>
      </div>
    </header>
  );
};

export default EmployeeTopbar;
