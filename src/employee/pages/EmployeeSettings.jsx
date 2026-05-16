import { useState } from 'react';
import { useEmployee } from '../../context/EmployeeContext';
import api, { notifyError, notifySuccess } from '../../Script/api';

const EmployeeSettings = () => {
  const { employeeUser, logoutEmployee } = useEmployee();

  const [profile, setProfile] = useState({
    full_name: employeeUser.name || '',
    clinic_name: '',
    phone: '',
  });
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '' });
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.employee.profile.update(profile);
      notifySuccess('Profile updated');
    } catch (err) {
      notifyError(err?.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!passwords.current_password || !passwords.new_password) return;
    setSaving(true);
    try {
      await api.employee.profile.changePassword(passwords);
      notifySuccess('Password changed successfully');
      setPasswords({ current_password: '', new_password: '' });
    } catch (err) {
      notifyError(err?.response?.data?.detail || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <section className="glass-card p-5 xl:col-span-2 space-y-4">
        <h2 className="employee-heading text-slate-100">Profile</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              className="glass-input h-11 px-3"
              placeholder="Full Name"
              value={profile.full_name}
              onChange={(e) => setProfile((s) => ({ ...s, full_name: e.target.value }))}
            />
            <input
              className="glass-input h-11 px-3"
              value={employeeUser.email}
              readOnly
              title="Email cannot be changed"
            />
            <input
              className="glass-input h-11 px-3"
              placeholder="Clinic Name"
              value={profile.clinic_name}
              onChange={(e) => setProfile((s) => ({ ...s, clinic_name: e.target.value }))}
            />
            <input
              className="glass-input h-11 px-3"
              placeholder="Phone"
              value={profile.phone}
              onChange={(e) => setProfile((s) => ({ ...s, phone: e.target.value }))}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="gradient-btn h-10 px-5 text-slate-950 font-semibold disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <h3 className="employee-heading text-slate-100 pt-2">Security</h3>
        <form onSubmit={changePassword} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="glass-input h-11 px-3"
            type="password"
            placeholder="Current password"
            value={passwords.current_password}
            onChange={(e) => setPasswords((s) => ({ ...s, current_password: e.target.value }))}
          />
          <input
            className="glass-input h-11 px-3"
            type="password"
            placeholder="New password"
            value={passwords.new_password}
            onChange={(e) => setPasswords((s) => ({ ...s, new_password: e.target.value }))}
          />
          <button
            type="submit"
            disabled={saving || !passwords.current_password || !passwords.new_password}
            className="gradient-btn h-10 px-5 text-slate-950 font-semibold disabled:opacity-40"
          >
            Change Password
          </button>
        </form>
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
        <button
          onClick={logoutEmployee}
          className="mt-6 w-full h-10 border border-red-400/40 text-red-300 rounded-xl hover:bg-red-500/10"
        >
          Logout
        </button>
      </section>
    </div>
  );
};

export default EmployeeSettings;
