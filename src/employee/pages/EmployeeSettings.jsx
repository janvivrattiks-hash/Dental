import { useEmployee } from '../../context/EmployeeContext';

const EmployeeSettings = () => {
  const { employeeUser, logoutEmployee } = useEmployee();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <section className="glass-card p-5 xl:col-span-2 space-y-4">
        <h2 className="employee-heading text-slate-100">Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="glass-input h-11 px-3" defaultValue={employeeUser.name} />
          <input className="glass-input h-11 px-3" defaultValue={employeeUser.email} />
          <input className="glass-input h-11 px-3" placeholder="Clinic" />
          <input className="glass-input h-11 px-3" placeholder="Phone" />
        </div>
        <h3 className="employee-heading text-slate-100 pt-2">Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="glass-input h-11 px-3" type="password" placeholder="New password" />
          <div>
            <div className="h-2 rounded-full bg-slate-700 overflow-hidden mt-4">
              <div className="h-full w-2/3 bg-cyan-400" />
            </div>
            <p className="text-xs text-slate-400 mt-1">Password strength: Good</p>
          </div>
        </div>
      </section>

      <section className="glass-card p-5 space-y-3">
        <h2 className="employee-heading text-slate-100">Notifications</h2>
        <label className="flex items-center justify-between text-slate-300">
          <span>Email Alerts</span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className="flex items-center justify-between text-slate-300">
          <span>In-App Alerts</span>
          <input type="checkbox" defaultChecked />
        </label>
        <button onClick={logoutEmployee} className="mt-6 w-full h-10 border border-red-400/40 text-red-300 rounded-xl hover:bg-red-500/10">Logout</button>
      </section>
    </div>
  );
};

export default EmployeeSettings;
